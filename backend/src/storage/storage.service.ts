import { Injectable, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';

export interface UploadResult {
  key: string;
  url: string;
  size: number;
  mimeType: string;
  hash: string;
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private s3Client: S3Client;
  private bucketName: string;
  private publicUrl: string;

  constructor(private configService: ConfigService) {
    const accessKeyId = this.configService.get<string>('R2_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('R2_SECRET_ACCESS_KEY');
    const endpoint = this.configService.get<string>('R2_ENDPOINT');
    const region = this.configService.get<string>('R2_REGION', 'auto');

    this.bucketName = this.configService.get<string>('R2_BUCKET_NAME', 'ministerial-documents');
    this.publicUrl = this.configService.get<string>('R2_PUBLIC_URL', '');

    if (!accessKeyId || !secretAccessKey || !endpoint) {
      this.logger.warn('R2 credentials not configured. File uploads will fail.');
    }

    this.s3Client = new S3Client({
      region,
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    this.logger.log('R2 Storage Service initialized');
  }

  /**
   * Upload file to R2 storage
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'documents',
  ): Promise<UploadResult> {
    try {
      // Generate hash for file integrity
      const hash = this.generateFileHash(file.buffer);

      // Generate unique key
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const extension = file.originalname.split('.').pop();
      const key = `${folder}/${timestamp}-${randomString}.${extension}`;

      // Upload to R2
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        Metadata: {
          originalName: file.originalname,
          uploadedAt: new Date().toISOString(),
          hash,
        },
      });

      await this.s3Client.send(command);

      // Generate URL
      const url = this.publicUrl
        ? `${this.publicUrl}/${key}`
        : await this.getSignedUrl(key);

      this.logger.log(`File uploaded successfully: ${key}`);

      return {
        key,
        url,
        size: file.size,
        mimeType: file.mimetype,
        hash,
      };
    } catch (error) {
      this.logger.error(`Failed to upload file: ${error.message}`, error.stack);
      throw new Error(`File upload failed: ${error.message}`);
    }
  }

  /**
   * Get signed URL for private file access (expires in 1 hour)
   */
  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const url = await getSignedUrl(this.s3Client, command, { expiresIn });
      return url;
    } catch (error) {
      this.logger.error(`Failed to generate signed URL: ${error.message}`);
      throw new Error(`Failed to generate file URL: ${error.message}`);
    }
  }

  /**
   * Delete file from R2 storage
   */
  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      this.logger.log(`File deleted successfully: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to delete file: ${error.message}`);
      throw new Error(`File deletion failed: ${error.message}`);
    }
  }

  /**
   * Generate SHA-256 hash of file for integrity checking
   */
  private generateFileHash(buffer: Buffer): string {
    return createHash('sha256').update(buffer).digest('hex');
  }

  /**
   * Get file from R2 storage
   */
  async getFile(key: string): Promise<Buffer> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await this.s3Client.send(command);
      const chunks: Uint8Array[] = [];

      for await (const chunk of response.Body as any) {
        chunks.push(chunk);
      }

      return Buffer.concat(chunks);
    } catch (error) {
      this.logger.error(`Failed to get file: ${error.message}`);
      throw new Error(`File retrieval failed: ${error.message}`);
    }
  }
}
