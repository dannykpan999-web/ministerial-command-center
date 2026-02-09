import {
  IsArray,
  IsUUID,
  IsBoolean,
  IsEnum,
  IsString,
  IsOptional,
  ArrayMinSize,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum NotificationMethod {
  EMAIL = 'EMAIL',
  WHATSAPP = 'WHATSAPP',
  BOTH = 'BOTH',
}

export class DecreeDocumentDto {
  @ApiProperty({ description: 'Array of department IDs', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1, { message: 'At least one department must be selected' })
  departmentIds: string[];

  @ApiProperty({ description: 'Whether to send notification', default: true })
  @IsBoolean()
  sendNotification: boolean;

  @ApiProperty({ enum: NotificationMethod, description: 'Notification method' })
  @IsEnum(NotificationMethod)
  notificationMethod: NotificationMethod;

  @ApiPropertyOptional({ description: 'Optional message for notification' })
  @IsString()
  @IsOptional()
  message?: string;
}
