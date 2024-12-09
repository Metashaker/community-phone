import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { CALLS_WEBHOOKS_QUEUE } from 'src/app/shared/constants';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: () => ({
        connection: {
          url: process.env.REDIS_URL ?? 'redis://localhost:6379',
          redis: {
            tls:
              process.env.NODE_ENV === 'development'
                ? undefined
                : { rejectUnauthorized: false },
          },
        },
      }),
    }),
    BullModule.registerQueue({
      name: CALLS_WEBHOOKS_QUEUE.name,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    }),
  ],
  exports: [BullModule],
})
export class BullMQModule {}
