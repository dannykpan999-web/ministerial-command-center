import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.department.findMany({
      where: { isActive: true },
      orderBy: [{ level: 'asc' }, { order: 'asc' }],
      include: {
        parent: true,
        _count: {
          select: { users: true },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.department.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        users: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            position: true,
          },
        },
      },
    });
  }

  async getHierarchy() {
    // Get root departments (level 1)
    const rootDepts = await this.prisma.department.findMany({
      where: {
        level: 1,
        isActive: true,
      },
      include: {
        children: {
          include: {
            children: {
              include: {
                children: true,
              },
            },
          },
        },
      },
      orderBy: { order: 'asc' },
    });

    return rootDepts;
  }
}
