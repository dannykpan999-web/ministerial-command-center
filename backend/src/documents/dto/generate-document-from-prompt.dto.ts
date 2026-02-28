import { IsString, IsEnum, IsOptional, MinLength, IsArray, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateDocumentFromPromptDto {
  @ApiProperty({
    description: 'Type of document to generate',
    enum: ['RESPUESTA', 'MEMORANDO', 'DECRETO', 'OFICIO', 'RESOLUCION', 'CARTA'],
    example: 'RESPUESTA',
  })
  @IsEnum(['RESPUESTA', 'MEMORANDO', 'DECRETO', 'OFICIO', 'RESOLUCION', 'CARTA'])
  documentType: string;

  @ApiProperty({
    description: 'Prompt describing what document to generate',
    example: 'Generar respuesta oficial sobre solicitud de información presupuestaria del Ministerio de Educación',
    minLength: 10,
  })
  @IsString()
  @MinLength(10, { message: 'El prompt debe tener al menos 10 caracteres' })
  prompt: string;

  @ApiProperty({
    description: 'Tone of the document',
    enum: ['formal', 'very_formal', 'internal'],
    example: 'formal',
    required: false,
  })
  @IsOptional()
  @IsEnum(['formal', 'very_formal', 'internal'])
  tone?: string = 'formal';

  @ApiProperty({
    description: 'Language of the document',
    enum: ['es', 'en', 'fr'],
    example: 'es',
    required: false,
  })
  @IsOptional()
  @IsEnum(['es', 'en', 'fr'])
  language?: string = 'es';

  @ApiProperty({
    description: 'IDs of linked documents to use as context for generation',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  linkedDocumentIds?: string[];
}
