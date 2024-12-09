import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { CALLS_WEBHOOKS_QUEUE } from 'src/app/shared/constants';
import { Redis } from 'ioredis';

const redisOptions =
  process.env.NODE_ENV === 'development'
    ? {
        host: 'localhost',
        port: 6379,
      }
    : new Redis(process.env.REDIS_URL as string, {
        maxRetriesPerRequest: null,
        tls: { rejectUnauthorized: process.env.NODE_ENV === 'development' },
      });
@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: () => ({
        connection: {
          url: process.env.REDIS_URL ?? 'redis://localhost:6379',
          redisOptions,
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
