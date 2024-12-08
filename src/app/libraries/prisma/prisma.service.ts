import { Injectable, type OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// @Injectable() allows NestJS to manage this service's lifecycle
// and inject it as a dependency into other services/controllers
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // This method is automatically called during module initialization
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }
}
