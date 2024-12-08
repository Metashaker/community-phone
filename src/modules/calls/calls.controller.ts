import { Controller, Get, Post, Body, Response } from '@nestjs/common';
import { CallEventDTO, FailedCallDTO } from './calls.schemas';
import { CallsService } from './calls.service';

@Controller('events')
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @Get('/failures')
  async getFailedCalls(): Promise<FailedCallDTO[]> {
    return await this.callsService.getFailedCalls();
  }

  @Post()
  async createCall(
    @Body() request: CallEventDTO,
    @Response() response: Response,
  ) {
    try {
      if (request?.started) {
        await this.callsService.createCall({
          remoteCallId: request.callId,
          from: request.from,
          to: request.to,
          startedAt: request.started,
        });
      } else if (request?.ended) {
        await this.callsService.markCallEnded({
          remoteCallId: request.callId,
          endedAt: request.ended,
        });
      }
    } finally {
      // @todo: return 201 OK to the webhook provider to reduce latency once job is enqueued,
      // if it fails we'll retry
      return response.status;
    }
  }
}
