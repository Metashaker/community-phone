
import { Global, Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

@Global()
@Module({
  imports: [
    PinoLoggerModule.forRoot({
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
  exports: [PinoLoggerModule],
})
export class LoggerModule {}
