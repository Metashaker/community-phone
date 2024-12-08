import { Module } from '@nestjs/common';
import { CallsService } from './calls.service';
import { CallsController } from './calls.controller';
import { BullMQModule } from 'src/app/libraries/bullmq/bullmq.module';

@Module({
  imports: [BullMQModule],
  controllers: [CallsController],
  providers: [CallsService],
  exports: [CallsService],
})
export class CallsModule {}
