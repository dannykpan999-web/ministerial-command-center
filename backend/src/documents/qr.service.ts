import { Injectable, Logger } from '@nestjs/common';
import * as QRCode from 'qrcode';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class QrService {
  private readonly logger = new Logger(QrService.name);
  private baseUrl: string;

  constructor(private configService: ConfigService) {
    // Use frontend URL or fallback to backend URL
    this.baseUrl = this.configService.get<string>(
      'FRONTEND_URL',
      'http://72.61.41.94',
    );
  }

  /**
   * Generate QR code for a document
   * Returns base64 data URL that can be embedded in PDFs or stored
   */
  async generateDocumentQR(documentId: string): Promise<string> {
    try {
      // Create URL that points to document details page
      const documentUrl = `${this.baseUrl}/documents/${documentId}`;

      // Generate QR code as data URL (base64)
      const qrCodeDataUrl = await QRCode.toDataURL(documentUrl, {
        errorCorrectionLevel: 'H', // High error correction
        type: 'image/png',
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      this.logger.log(`QR code generated for document ${documentId}`);

      return qrCodeDataUrl;
    } catch (error) {
      this.logger.error(`Failed to generate QR code: ${error.message}`);
      throw new Error(`QR code generation failed: ${error.message}`);
    }
  }

  /**
   * Generate QR code as buffer (for file upload)
   */
  async generateDocumentQRBuffer(documentId: string): Promise<Buffer> {
    try {
      const documentUrl = `${this.baseUrl}/documents/${documentId}`;

      const qrBuffer = await QRCode.toBuffer(documentUrl, {
        errorCorrectionLevel: 'H',
        type: 'png',
        width: 300,
        margin: 2,
      });

      return qrBuffer;
    } catch (error) {
      this.logger.error(`Failed to generate QR buffer: ${error.message}`);
      throw new Error(`QR buffer generation failed: ${error.message}`);
    }
  }

  /**
   * Generate verification QR code with additional data
   * Includes: document number, date, hash for verification
   */
  async generateVerificationQR(
    documentId: string,
    correlativeNumber: string,
    hash?: string,
  ): Promise<string> {
    try {
      // Create verification payload
      const verificationData = {
        id: documentId,
        number: correlativeNumber,
        url: `${this.baseUrl}/documents/${documentId}`,
        hash: hash ? hash.substring(0, 16) : undefined, // First 16 chars of hash
        verified: new Date().toISOString(),
      };

      // Generate QR with JSON payload
      const qrCodeDataUrl = await QRCode.toDataURL(
        JSON.stringify(verificationData),
        {
          errorCorrectionLevel: 'H',
          type: 'image/png',
          width: 300,
          margin: 2,
        },
      );

      this.logger.log(
        `Verification QR code generated for ${correlativeNumber}`,
      );

      return qrCodeDataUrl;
    } catch (error) {
      this.logger.error(
        `Failed to generate verification QR: ${error.message}`,
      );
      throw new Error(`Verification QR generation failed: ${error.message}`);
    }
  }

  /**
   * Parse QR code data (for verification)
   */
  parseQRData(qrText: string): any {
    try {
      // Try to parse as JSON
      return JSON.parse(qrText);
    } catch {
      // If not JSON, return as plain URL
      return { url: qrText };
    }
  }
}
