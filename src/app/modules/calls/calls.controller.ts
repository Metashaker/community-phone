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
      const { success } = await this.callsService.addCallToCreateToQueue({
        remoteCallId: request.call_id,
        from: request.from,
        to: request.to,
        startedAt: new Date(new Date(request.started).toISOString()),
      });
      if (success) {
        return response.status(HttpStatus.CREATED).send({ success });
      } else {
        return response
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send({ success });
      }
    } else if (request?.ended) {
      const { success } = await this.callsService.addCallToEndToQueue({
        remoteCallId: request.call_id,
        endedAt: new Date(new Date(request.ended).toISOString()),
      });
      if (success) {
        return response.status(HttpStatus.OK).send({ success });
      } else {
        return response
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send({ success });
      }
    } else {
      return response.status(HttpStatus.BAD_REQUEST).send({ success: false });
    }
  }
}
