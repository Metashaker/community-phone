import { PrismaService } from 'src/libraries/prisma/prisma.service';
import { Call } from '@prisma/client';
import { PinoLogger } from 'nestjs-pino';
import { CreateCallInput, EndCallInput } from './calls.schemas';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CallsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: PinoLogger,
  ) {}

  async createCall(call: CreateCallInput) {
    try {
      await this.prisma.call.create({
        data: {
          remoteCallId: call.remoteCallId,
          from: call.from,
          to: call.to,
          startedAt: call.startedAt,
        },
      });
    } catch (e) {
      this.logger.error({ error: e }, 'FailedCallCreation');
      throw new Error('Failed to create call');
    }
  }

  async markCallEnded(call: EndCallInput) {
    try {
      await this.prisma.call.update({
        where: { remoteCallId: call.remoteCallId },
        data: {
          endedAt: call.endedAt,
        },
      });
    } catch (e) {
      this.logger.error({ error: e }, 'FailedCallEnd');
      throw new Error('Failed to mark call as ended');
    }
  }

  async getFailedCalls(): Promise<Call[]> {
    try {
      // Get the current time in UTC
      const now = new Date();
      const nowUTC = new Date(now.toISOString());
      // Get the time 2 hours ago in UTC
      const twoHoursAgo = new Date(nowUTC.getTime() - 2 * 60 * 60 * 1000);
      // Get the time 60 minutes ago in UTC (minimum time to consider a call as failed)
      const sixtyMinutesAgo = new Date(nowUTC.getTime() - 60 * 60 * 1000);

      return await this.prisma.call.findMany({
        where: {
          AND: [
            { startedAt: { gte: twoHoursAgo.toISOString() } },
            { startedAt: { lte: sixtyMinutesAgo.toISOString() } },
            { endedAt: null },
          ],
        },
      });
    } catch (e) {
      this.logger.error({ error: e }, 'FailedToGetFailedCalls');
      throw new Error(`Failed to get failed calls: ${e}`);
    }
  }
}
