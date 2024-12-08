import { Module } from '@nestjs/common';
import { CallsController } from './calls.controller';
import { CallsService } from './calls.service';
import { PrismaModule } from 'src/libraries/prisma.module';

@Module({
  controllers: [CallsController],
  providers: [CallsService],
  exports: [CallsService],
  imports: [PrismaModule],
})
export class CallsModule {}
