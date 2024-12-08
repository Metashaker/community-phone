import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        url: process.env.REDIS_URL ?? 'redis://localhost:6379',
        redisOptions: {
          tls: process.env.REDIS_URL?.includes('localhost')
            ? undefined
            : { rejectUnauthorized: false },
        },
      },
    }),
    BullModule.registerQueue({
      name: 'callsWebhooks',
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
