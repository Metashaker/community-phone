import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { CallsController } from './modules/calls/calls.controller';
import { PrismaModule } from './libraries/prisma.module';
import { CallsModule } from './modules/calls/calls.module';

@Module({
  imports: [
    //libs
    PrismaModule,
    //modules
    CallsModule,
    //config
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
        level: process.env.LOG_LEVEL || 'info',
      },
    }),
  ],
  controllers: [CallsController],
  providers: [],
})
export class AppModule {}
