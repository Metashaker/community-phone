import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { PinoLogger } from 'nestjs-pino';
import { Job } from 'bullmq';
import { CallsService } from '../app/modules/calls/calls.service';
import {
  CreateCallInput,
  EndCallInput,
} from '../app/modules/calls/calls.schemas';

@Processor('callsWebhooks')
export class WebhookProcessor extends WorkerHost {
  constructor(
    private readonly callsService: CallsService,
    private readonly logger: PinoLogger,
  ) {
    super();
    this.logger.info('WebhookProcessor initialized');
  }

  async process(job: Job): Promise<void> {
    this.logger.setContext(`WebhookProcessor-${job.id}`);

    try {
      this.logger.info(
        { jobId: job.id, name: job.name },
        'Processing webhook event',
      );

      switch (job.name) {
        case 'processCreateCall':
          await this.handleCreateCall(job.data as CreateCallInput);
          break;
        case 'processEndCall':
          await this.handleEndCall(job.data as EndCallInput);
          break;
        default:
          this.logger.warn({ jobName: job.name }, 'Unknown job type');
      }
    } catch (error) {
      this.logger.error(
        { error, jobId: job.id, name: job.name, data: job.data },
        'Failed to process webhook event',
      );
      throw error;
    }
  }

  private async handleCreateCall(data: CreateCallInput): Promise<void> {
    const result = await this.callsService.createCall(data);
    if (!result.success) {
      throw new Error('Failed to create call');
    }
  }

  private async handleEndCall(data: EndCallInput): Promise<void> {
    const result = await this.callsService.markCallEnded(data);
    if (!result.success) {
      throw new Error('Failed to end call');
    }
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(
      `Job ${job.id} of type ${job.name} failed with error ${error.message}`,
    );
  }

  @OnWorkerEvent('error')
  onError(error: Error) {
    this.logger.error(`An error occurred: ${error.message}`);
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    this.logger.info(`Processing job ${job.id} of type ${job.name}...`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.info(`Job ${job.id} of type ${job.name} completed.`);
  }
}
