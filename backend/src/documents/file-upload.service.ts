import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { OcrService } from '../ocr/ocr.service';
import { ConfigService } from '@nestjs/config';
import { validateFiles, scanFileContent } from '../common/validators/file-validation';

export interface UploadFilesResult {
  files: any[];
  extractedText: string;
  totalSize: number;
}

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);
  private maxFileSize: number;
  private allowedTypes: string[];
  private maxFilesPerDocument: number;

  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
    private ocrService: OcrService,
    private configService: ConfigService,
  ) {
    this.maxFileSize = this.configService.get<number>(
      'MAX_FILE_SIZE',
      10 * 1024 * 1024,
    );
    this.allowedTypes = this.configService
      .get<string>('ALLOWED_FILE_TYPES', 'pdf,doc,docx,jpg,jpeg,png,txt')
      .split(',');
    this.maxFilesPerDocument = this.configService.get<number>(
      'MAX_FILES_PER_DOCUMENT',
      10,
    );
  }

  /**
   * Upload files for a document and extract text
   */
  async uploadDocumentFiles(
    documentId: string,
    files: Express.Multer.File[],
    userId: string,
  ): Promise<UploadFilesResult> {
    // Validate document exists
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${documentId} not found`);
    }

    // Validate files
    validateFiles(files, {
      maxSize: this.maxFileSize,
      allowedTypes: this.allowedTypes,
      maxFiles: this.maxFilesPerDocument,
    });

    this.logger.log(
      `Uploading ${files.length} file(s) for document ${documentId}`,
    );

    const uploadedFiles = [];
    let combinedExtractedText = '';
    let totalSize = 0;

    // Process each file
    for (const file of files) {
      try {
        // Security scan
        scanFileContent(file);

        // Upload to R2 storage
        const storageResult = await this.storageService.uploadFile(
          file,
          `documents/${documentId}`,
        );

        // Extract text using OCR
        let extractedText = '';
        try {
          const ocrResult = await this.ocrService.extractText(file);
          extractedText = ocrResult.text;

          this.logger.log(
            `OCR completed for ${file.originalname} using ${ocrResult.method} (${extractedText.length} chars)`,
          );
        } catch (ocrError) {
          this.logger.warn(
            `OCR failed for ${file.originalname}: ${ocrError.message}`,
          );
        }

        // Save file metadata to database
        const documentFile = await this.prisma.documentFile.create({
          data: {
            documentId,
            fileName: file.originalname,
            fileSize: file.size,
            mimeType: file.mimetype,
            storageType: 'S3', // R2 is S3-compatible
            storagePath: storageResult.key,
            storageUrl: storageResult.url,
            hash: storageResult.hash,
            uploadedById: userId,
          },
        });

        uploadedFiles.push(documentFile);
        combinedExtractedText += (extractedText ? extractedText + '\n\n' : '');
        totalSize += file.size;

        this.logger.log(`File uploaded successfully: ${file.originalname}`);
      } catch (error) {
        this.logger.error(
          `Failed to upload file ${file.originalname}: ${error.message}`,
        );
        throw error;
      }
    }

    return {
      files: uploadedFiles,
      extractedText: combinedExtractedText.trim(),
      totalSize,
    };
  }

  /**
   * Delete file from document
   */
  async deleteDocumentFile(
    documentId: string,
    fileId: string,
  ): Promise<void> {
    // Get file metadata
    const file = await this.prisma.documentFile.findFirst({
      where: {
        id: fileId,
        documentId,
      },
    });

    if (!file) {
      throw new NotFoundException(`File with ID ${fileId} not found`);
    }

    // Delete from R2 storage
    try {
      await this.storageService.deleteFile(file.storagePath);
    } catch (error) {
      this.logger.error(
        `Failed to delete file from storage: ${error.message}`,
      );
      // Continue anyway to delete from database
    }

    // Delete from database
    await this.prisma.documentFile.delete({
      where: { id: fileId },
    });

    this.logger.log(`File deleted successfully: ${file.fileName}`);
  }

  /**
   * Get all files for a document
   */
  async getDocumentFiles(documentId: string) {
    return this.prisma.documentFile.findMany({
      where: { documentId },
      include: {
        uploadedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get file download URL
   */
  async getFileUrl(fileId: string): Promise<string> {
    const file = await this.prisma.documentFile.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      throw new NotFoundException(`File with ID ${fileId} not found`);
    }

    // Generate signed URL for download
    return this.storageService.getSignedUrl(file.storagePath, 3600); // 1 hour expiry
  }

  /**
   * Process uploaded files and generate AI insights
   */
  async processDocumentWithAI(
    documentId: string,
    extractedText: string,
    documentType: string,
  ): Promise<void> {
    if (!extractedText || extractedText.length < 50) {
      this.logger.warn('Text too short for AI processing');
      return;
    }

    try {
      // Generate AI summary
      const aiSummary = await this.ocrService.generateSummary(extractedText);

      // Extract key points
      const keyPoints = await this.ocrService.extractKeyPoints(extractedText);

      // Generate proposed response
      const proposedResponse = await this.ocrService.generateProposedResponse(
        extractedText,
        documentType,
      );

      // Update document with AI results
      await this.prisma.document.update({
        where: { id: documentId },
        data: {
          aiSummary: aiSummary || undefined,
          aiKeyPoints: keyPoints.length > 0 ? keyPoints : undefined,
          aiProposedResponse: proposedResponse || undefined,
        },
      });

      this.logger.log(`AI processing completed for document ${documentId}`);
    } catch (error) {
      this.logger.error(`AI processing failed: ${error.message}`);
      // Don't throw - AI processing is optional
    }
  }
}
