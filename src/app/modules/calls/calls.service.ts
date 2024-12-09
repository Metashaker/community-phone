import { PrismaService } from 'src/app/libraries/prisma/prisma.service';
import { Call } from '@prisma/client';
import { PinoLogger } from 'nestjs-pino';
import { CreateCallInput, EndCallInput } from './calls.schemas';
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { CALLS_WEBHOOKS_QUEUE } from 'src/app/shared/queues';

@Injectable()
export class CallsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: PinoLogger,
    @InjectQueue(CALLS_WEBHOOKS_QUEUE.name)
    private readonly callsWebhooksQueue: Queue,
  ) {}

  async addCallToCreateToQueue(
    call: CreateCallInput,
  ): Promise<{ success: boolean }> {
    try {
      const job = await this.callsWebhooksQueue.add(
        CALLS_WEBHOOKS_QUEUE.jobs.createCall,
        call,
      );
      if (job?.id) {
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (e) {
      this.logger.error({ error: e }, 'FailedToEnqueueCreateCall');
      return { success: false };
    }
  }

  async addCallToEndToQueue(call: EndCallInput): Promise<{ success: boolean }> {
    try {
      const job = await this.callsWebhooksQueue.add(
        CALLS_WEBHOOKS_QUEUE.jobs.endCall,
        call,
      );
      if (job?.id) {
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (e) {
      this.logger.error({ error: e }, 'FailedToEnqueueEndCall');
      return { success: false };
    }
  }

  /**
   *  Receives webhook events from different phone carriers for the `call_started` event, and saves them to the database.
   *
   * **Note**: All dates are stored in UTC.
   */
  async createCall(call: CreateCallInput): Promise<{ success: boolean }> {
    try {
      await this.prisma.call.create({
        data: {
          remoteCallId: call.remoteCallId,
          from: call.from,
          to: call.to,
          startedAt: call.startedAt,
        },
      });
      return { success: true };
    } catch (e) {
      this.logger.error({ error: e }, 'FailedCallCreation');
      return { success: false };
    }
  }

  /**
   * Receives webhook events from different phone carriers for the `call_ended` event, and updates the call
   * with a `ended_at` timestamp.
   *
   * **Note**: All dates are stored in UTC.
   */
  async markCallEnded(call: EndCallInput): Promise<{ success: boolean }> {
    try {
      await this.prisma.call.update({
        where: { remoteCallId: call.remoteCallId },
        data: {
          endedAt: call.endedAt,
        },
      });
      return { success: true };
    } catch (e) {
      this.logger.error({ error: e }, 'FailedCallEnd');
      return { success: false };
    }
  }

  /**
   * Returns a list of calls from the last 2 hours,
   * that failed to be marked as ended due to an unreceived webhook event.
   *
   * **Note**: Calls can last 60 minutes max,
   *  so we don't return calls that have less than 60 minutes since they were started
   *  since they could still be going.
   */
  async getFailedCalls(): Promise<Call[]> {
    try {
      // Get the current time in UTC
      const now = new Date();
      const nowUTC = new Date(now.toISOString());
      // Get the time 2 hours ago in UTC
      const twoHoursAgo = new Date(nowUTC.getTime() - 2 * 60 * 60 * 1000);
      // Get the time 60 minutes ago in UTC (minimum time to consider a call as failed)
      const oneHourAgo = new Date(nowUTC.getTime() - 60 * 60 * 1000);

      return await this.prisma.call.findMany({
        where: {
          AND: [
            { startedAt: { gte: twoHoursAgo.toISOString() } },
            { startedAt: { lte: oneHourAgo.toISOString() } },
            { endedAt: null },
          ],
        },
      });
    } catch (e) {
      this.logger.error({ error: e }, 'FailedToGetFailedCalls');
      return [];
    }
  }
}
