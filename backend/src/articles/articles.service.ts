import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  private readonly authorSelect = {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
  };

  async findAll(status?: string, userId?: string, userRole?: string) {
    // Drafts are only visible to their own author
    // Pending and Published are visible to all logged-in users
    const where: any = status
      ? { status: status as any }
      : {
          OR: [
            { status: { in: ['PENDING', 'PUBLISHED'] } },
            { status: 'DRAFT', authorId: userId },
          ],
        };

    return this.prisma.article.findMany({
      where,
      include: { author: { select: this.authorSelect } },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: { author: { select: this.authorSelect } },
    });
    if (!article) throw new NotFoundException('Artículo no encontrado');
    return article;
  }

  async create(dto: CreateArticleDto, authorId: string) {
    return this.prisma.article.create({
      data: {
        title: dto.title,
        content: dto.content,
        sector: dto.sector,
        sources: dto.sources ?? [],
        status: dto.status ?? 'DRAFT',
        authorId,
      },
      include: { author: { select: this.authorSelect } },
    });
  }

  async update(id: string, dto: UpdateArticleDto, userId: string, userRole: string) {
    const article = await this.findOne(id);
    // Only author or ADMIN can edit
    if (article.authorId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('No tiene permiso para editar este artículo');
    }
    return this.prisma.article.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.content && { content: dto.content }),
        ...(dto.sector && { sector: dto.sector }),
        ...(dto.sources !== undefined && { sources: dto.sources }),
        ...(dto.status && { status: dto.status as any }),
      },
      include: { author: { select: this.authorSelect } },
    });
  }

  async publish(id: string, userRole: string) {
    if (userRole !== 'ADMIN' && userRole !== 'GABINETE') {
      throw new ForbiddenException('Solo administradores pueden publicar artículos');
    }
    await this.findOne(id);
    return this.prisma.article.update({
      where: { id },
      data: { status: 'PUBLISHED', publishedAt: new Date() },
      include: { author: { select: this.authorSelect } },
    });
  }

  async remove(id: string, userId: string, userRole: string) {
    const article = await this.findOne(id);
    if (article.authorId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('No tiene permiso para eliminar este artículo');
    }
    return this.prisma.article.delete({ where: { id } });
  }
}
