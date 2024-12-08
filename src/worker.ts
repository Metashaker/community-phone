import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker/worker.module';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(WorkerModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
