import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: () => ({
        connection: {
          url: process.env.REDIS_URL || 'redis://localhost:6379',
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'callsWebhooks',
      processors: [],
    }),
  ],
  exports: [BullModule],
})
export class BullMQModule {}
