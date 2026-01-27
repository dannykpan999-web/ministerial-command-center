import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { PdfService } from './pdf.service';
import { FileUploadService } from './file-upload.service';
import { QrService } from './qr.service';
import { PrismaModule } from '../prisma/prisma.module';
import { StorageModule } from '../storage/storage.module';
import { OcrModule } from '../ocr/ocr.module';
import { AuditModule } from '../audit/audit.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { CorrelativeNumberService } from './utils/correlative-number.util';

@Module({
  imports: [
    PrismaModule,
    StorageModule,
    OcrModule,
    AuditModule,
    NotificationsModule,
  ],
  controllers: [DocumentsController],
  providers: [
    DocumentsService,
    PdfService,
    FileUploadService,
    QrService,
    CorrelativeNumberService,
  ],
  exports: [DocumentsService, FileUploadService],
})
export class DocumentsModule {}
