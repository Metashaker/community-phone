// create CallsService class, importing the PrismaService

import { PrismaService } from 'src/libraries/prisma.service';

export class CallsService {
  constructor(private prisma: PrismaService) {}

  async create() {
    //return this.prisma.callEvent.create({ data });
  }

  async findAll() {
    //return this.prisma.callEvent.findMany();
  }
}
