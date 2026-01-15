import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EntitiesService } from './entities.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('entities')
@Controller('entities')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EntitiesController {
  constructor(private entitiesService: EntitiesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all entities' })
  findAll() {
    return this.entitiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get entity by ID' })
  findOne(@Param('id') id: string) {
    return this.entitiesService.findOne(id);
  }
}
