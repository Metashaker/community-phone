import { Controller, Get, Post, Body, Response } from '@nestjs/common';
import { CallEventDTO, FailedCallDTO } from './calls.schemas';
import { CallsService } from './calls.service';

@Controller('events')
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @Get('/failures')
  /**
   * Returns a list of calls from the last 2 hours,
   * that failed to be marked as ended due to an unreceived webhook event.
   *
   * **Note**: Calls can last 60 minutes max,
   *  so we don't return calls that have less than 60 minutes since they were started
   *  since they could still be going.
   */
  async getFailedCalls(): Promise<FailedCallDTO[]> {
    return await this.callsService.getFailedCalls();
  }

  @Post()
  /**
   *  Receives webhook events from different phone carriers for 2 different types of events:
   * 1. Call initiated
   * 2. Call ended
   */
  async createCall(
    @Body() request: CallEventDTO,
    @Response() response: Response,
  ) {
    try {
      if (request?.started) {
        //@todo: implement logic to save the call event
      } else if (request?.ended) {
        //@todo: implement logic to update the call with the ended event
      }
    } finally {
      // @todo: return 201 OK to the webhook provider to reduce latency once job is enqueued,
      // if it fails we'll retry
      return response.status;
    }
  }
}
