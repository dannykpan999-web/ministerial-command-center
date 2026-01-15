import { Module } from '@nestjs/common';
import { EntitiesService } from './entities.service';
import { EntitiesController } from './entities.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [EntitiesController],
  providers: [EntitiesService, PrismaService],
  exports: [EntitiesService],
})
export class EntitiesModule {}
