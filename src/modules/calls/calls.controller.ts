import { Controller, Get, Post, Body, Res, HttpStatus } from '@nestjs/common';
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
  async createCall(@Body() request: CallEventDTO, @Res() response) {
    if (request?.started) {
      await this.callsService.createCall({
        remoteCallId: request.callId,
        from: request.from,
        to: request.to,
        startedAt: new Date(new Date(request.started).toISOString()),
      });
      return response.status(HttpStatus.CREATED).send({ success: true });
    } else if (request?.ended) {
      await this.callsService.markCallEnded({
        remoteCallId: request.callId,
        endedAt: new Date(new Date(request.ended).toISOString()),
      });
      return response.status(HttpStatus.OK).send({ success: true });
    }
  }
}
