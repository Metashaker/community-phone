import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './libraries/logger/logger.module';
import { PrismaModule } from './libraries/prisma/prisma.module';
import { CallsModule } from './modules/calls/calls.module';
import { BullMQModule } from './libraries/bullmq/bullmq.module';

@Module({
  imports: [
    //libs
    PrismaModule,
    LoggerModule,
    //modules
    CallsModule,
    BullMQModule,
    //config
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
