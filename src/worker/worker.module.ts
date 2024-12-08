import { Module } from '@nestjs/common';
import { WebhookProcessor } from './worker.processor';
import { CallsModule } from '../app/modules/calls/calls.module';
import { LoggerModule } from '../app/libraries/logger/logger.module';
import { PrismaModule } from '../app/libraries/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { BullMQModule } from 'src/app/libraries/bullmq/bullmq.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CallsModule,
    LoggerModule,
    BullMQModule,
  ],
  providers: [WebhookProcessor],
})
export class WorkerModule {}
