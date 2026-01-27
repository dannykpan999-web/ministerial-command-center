import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { PdfService } from './pdf.service';
import { FileUploadService } from './file-upload.service';
import { Response } from 'express';
import { CreateDocumentDto, DocumentStatus } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { QueryDocumentDto } from './dto/query-document.dto';
import { DecreeDocumentDto } from './dto/decree-document.dto';
import { AssignDocumentDto } from './dto/assign-document.dto';
import { SearchDocumentDto } from './dto/search-document.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly pdfService: PdfService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post()
  @Roles('ADMIN', 'GABINETE', 'REVISOR')
  @ApiOperation({ summary: 'Create a new document' })
  @ApiResponse({ status: 201, description: 'Document created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Entity or user not found' })
  create(@Body() createDocumentDto: CreateDocumentDto, @Request() req) {
    return this.documentsService.create(createDocumentDto, req.user.id);
  }

  @Get()
  @Roles('ADMIN', 'GABINETE', 'REVISOR', 'LECTOR')
  @ApiOperation({ summary: 'Get all documents with filters and pagination' })
  @ApiResponse({ status: 200, description: 'Documents retrieved successfully' })
  findAll(@Query() queryDto: QueryDocumentDto) {
    return this.documentsService.findAll(queryDto);
  }

  @Get('stats')
  @Roles('ADMIN', 'GABINETE', 'REVISOR', 'LECTOR')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  getStats() {
    return this.documentsService.getStats();
  }

  @Get('inbox')
  @Roles('ADMIN', 'GABINETE', 'REVISOR', 'LECTOR')
  @ApiOperation({ summary: 'Get inbox documents (direction=IN)' })
  @ApiResponse({ status: 200, description: 'Inbox documents retrieved successfully' })
  getInbox(@Query() queryDto: QueryDocumentDto) {
    return this.documentsService.getInbox(queryDto);
  }

  @Get('outbox')
  @Roles('ADMIN', 'GABINETE', 'REVISOR', 'LECTOR')
  @ApiOperation({ summary: 'Get outbox documents (direction=OUT)' })
  @ApiResponse({ status: 200, description: 'Outbox documents retrieved successfully' })
  getOutbox(@Query() queryDto: QueryDocumentDto) {
    return this.documentsService.getOutbox(queryDto);
  }

  @Get('my')
  @Roles('ADMIN', 'GABINETE', 'REVISOR', 'LECTOR')
  @ApiOperation({ summary: 'Get documents assigned to current user' })
  @ApiResponse({ status: 200, description: 'User documents retrieved successfully' })
  getMyDocuments(@Request() req, @Query() queryDto: QueryDocumentDto) {
    return this.documentsService.getMyDocuments(req.user.id, queryDto);
  }

  @Get('search')
  @Roles('ADMIN', 'GABINETE', 'REVISOR', 'LECTOR')
  @ApiOperation({ summary: 'Full-text search documents' })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid search query' })
  search(@Query() searchDto: SearchDocumentDto) {
    return this.documentsService.search(searchDto);
  }

  @Get('pending')
  @Roles('ADMIN', 'GABINETE', 'REVISOR')
  @ApiOperation({ summary: 'Get pending documents' })
  @ApiResponse({ status: 200, description: 'Pending documents retrieved successfully' })
  getPending(@Query() queryDto: QueryDocumentDto) {
    return this.documentsService.getPending(queryDto);
  }

  @Get('by-entity/:entityId')
  @Roles('ADMIN', 'GABINETE', 'REVISOR', 'LECTOR')
  @ApiOperation({ summary: 'Get documents by entity' })
  @ApiParam({ name: 'entityId', description: 'Entity UUID' })
  @ApiResponse({ status: 200, description: 'Entity documents retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Entity not found' })
  getByEntity(@Param('entityId') entityId: string, @Query() queryDto: QueryDocumentDto) {
    return this.documentsService.getByEntity(entityId, queryDto);
  }

  @Get(':id')
  @Roles('ADMIN', 'GABINETE', 'REVISOR', 'LECTOR')
  @ApiOperation({ summary: 'Get document by ID' })
  @ApiParam({ name: 'id', description: 'Document UUID' })
  @ApiResponse({ status: 200, description: 'Document retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'GABINETE', 'REVISOR')
  @ApiOperation({ summary: 'Update document' })
  @ApiParam({ name: 'id', description: 'Document UUID' })
  @ApiResponse({ status: 200, description: 'Document updated successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto) {
    return this.documentsService.update(id, updateDocumentDto);
  }

  @Patch(':id/status')
  @Roles('ADMIN', 'GABINETE', 'REVISOR')
  @ApiOperation({ summary: 'Update document status' })
  @ApiParam({ name: 'id', description: 'Document UUID' })
  @ApiResponse({ status: 200, description: 'Document status updated successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  updateStatus(@Param('id') id: string, @Body('status') status: DocumentStatus) {
    return this.documentsService.updateStatus(id, status);
  }

  @Delete(':id')
  @Roles('ADMIN', 'GABINETE')
  @ApiOperation({ summary: 'Archive document (soft delete)' })
  @ApiParam({ name: 'id', description: 'Document UUID' })
  @ApiResponse({ status: 200, description: 'Document archived successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  remove(@Param('id') id: string) {
    return this.documentsService.remove(id);
  }

  @Post(':id/decree')
  @Roles('ADMIN', 'GABINETE')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Decree document to departments' })
  @ApiParam({ name: 'id', description: 'Document UUID' })
  @ApiResponse({ status: 200, description: 'Document decreed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid department IDs' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  decree(@Param('id') id: string, @Body() decreeDto: DecreeDocumentDto) {
    return this.documentsService.decree(id, decreeDto);
  }

  @Post(':id/assign')
  @Roles('ADMIN', 'GABINETE', 'REVISOR')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign document to a user' })
  @ApiParam({ name: 'id', description: 'Document UUID' })
  @ApiResponse({ status: 200, description: 'Document assigned successfully' })
  @ApiResponse({ status: 404, description: 'Document or user not found' })
  assign(@Param('id') id: string, @Body() assignDto: AssignDocumentDto) {
    return this.documentsService.assign(id, assignDto);
  }

  @Get(':id/pdf')
  @Roles('ADMIN', 'GABINETE', 'REVISOR', 'LECTOR')
  @ApiOperation({ summary: 'Generate and download PDF of document' })
  @ApiParam({ name: 'id', description: 'Document UUID' })
  @ApiResponse({ status: 200, description: 'PDF generated successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async downloadPdf(@Param('id') id: string, @Res() res: Response) {
    const document = await this.documentsService.findOne(id);
    return this.pdfService.generateDocumentPdf(document, res);
  }

  @Post(':id/files')
  @Roles('ADMIN', 'GABINETE', 'REVISOR')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  @ApiOperation({ summary: 'Upload files to document with OCR and AI processing' })
  @ApiParam({ name: 'id', description: 'Document UUID' })
  @ApiResponse({ status: 201, description: 'Files uploaded successfully with OCR text extraction' })
  @ApiResponse({ status: 400, description: 'Invalid file or file validation failed' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async uploadFiles(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req,
  ) {
    return await this.fileUploadService.uploadDocumentFiles(
      id,
      files,
      req.user.id,
    );
  }

  @Delete(':id/files/:fileId')
  @Roles('ADMIN', 'GABINETE', 'REVISOR')
  @ApiOperation({ summary: 'Delete file from document and cloud storage' })
  @ApiParam({ name: 'id', description: 'Document UUID' })
  @ApiParam({ name: 'fileId', description: 'File UUID' })
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async deleteFile(@Param('id') id: string, @Param('fileId') fileId: string) {
    return await this.fileUploadService.deleteDocumentFile(id, fileId);
  }
}
