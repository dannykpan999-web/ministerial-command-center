import { IsUUID, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AssignDocumentDto {
  @ApiProperty({ description: 'UUID of user to assign document to' })
  @IsUUID()
  userId: string;

  @ApiPropertyOptional({ description: 'Optional note for assignment' })
  @IsString()
  @IsOptional()
  note?: string;
}
