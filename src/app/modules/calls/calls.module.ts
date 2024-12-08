import { Module } from '@nestjs/common';
import { CallsController } from './calls.controller';
import { CallsService } from './calls.service';
import { BullMQModule } from 'src/app/libraries/bullmq/bullmq.module';

@Module({
  controllers: [CallsController],
  providers: [CallsService],
  exports: [CallsService],
  imports: [BullMQModule],
})
export class CallsModule {}
