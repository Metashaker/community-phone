import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './libraries/logger/logger.module';
import { PrismaModule } from './libraries/prisma/prisma.module';
import { CallsModule } from './modules/calls/calls.module';

@Module({
  imports: [
    //libs
    PrismaModule,
    //modules
    CallsModule,
    //config
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
