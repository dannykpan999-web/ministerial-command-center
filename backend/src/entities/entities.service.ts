import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class EntitiesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.entity.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.entity.findUnique({
      where: { id },
      include: {
        _count: {
          select: { documents: true },
        },
      },
    });
  }
}
