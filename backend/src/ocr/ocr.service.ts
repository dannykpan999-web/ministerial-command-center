import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createWorker } from 'tesseract.js';
import OpenAI from 'openai';

export interface OcrResult {
  text: string;
  method: 'pdf-parse' | 'tesseract' | 'openai-vision';
  confidence?: number;
  language?: string;
}

@Injectable()
export class OcrService {
  private readonly logger = new Logger(OcrService.name);
  private openai: OpenAI | null = null;
  private enableAI: boolean;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    this.enableAI = this.configService.get<boolean>('ENABLE_AI_FEATURES', false);

    if (apiKey && this.enableAI) {
      this.openai = new OpenAI({ apiKey });
      this.logger.log('OpenAI integration enabled for advanced OCR');
    } else {
      this.logger.log('Using free OCR only (pdf-parse + tesseract)');
    }
  }

  /**
   * Extract text from file using appropriate method
   */
  async extractText(file: Express.Multer.File): Promise<OcrResult> {
    const mimeType = file.mimetype.toLowerCase();

    try {
      // PDF files - use pdf-parse first, fallback to OpenAI if fails
      if (mimeType === 'application/pdf') {
        return await this.extractFromPdf(file);
      }

      // Image files - use tesseract first, fallback to OpenAI if available
      if (mimeType.startsWith('image/')) {
        return await this.extractFromImage(file);
      }

      // Text files - direct read
      if (mimeType === 'text/plain') {
        return {
          text: file.buffer.toString('utf-8'),
          method: 'pdf-parse',
        };
      }

      // DOC/DOCX - use OpenAI if available, otherwise return empty
      if (mimeType.includes('word') || mimeType.includes('document')) {
        if (this.openai && this.enableAI) {
          return await this.extractWithOpenAI(file);
        }
        this.logger.warn('DOC/DOCX OCR requires OpenAI. Returning empty text.');
        return {
          text: '',
          method: 'pdf-parse',
        };
      }

      // Unsupported format
      this.logger.warn(`Unsupported file type for OCR: ${mimeType}`);
      return {
        text: '',
        method: 'pdf-parse',
      };
    } catch (error) {
      this.logger.error(`OCR extraction failed: ${error.message}`);
      throw new Error(`Failed to extract text: ${error.message}`);
    }
  }

  /**
   * Extract text from PDF using pdf-parse library
   */
  private async extractFromPdf(file: Express.Multer.File): Promise<OcrResult> {
    try {
      this.logger.log(`Extracting PDF: ${file.originalname} (${file.size} bytes)`);

      // Import pdf-parse
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const pdf = require('pdf-parse');
      const data = await pdf(file.buffer);

      this.logger.log(`PDF parsing complete. Pages: ${data.numpages}, Text length: ${data.text?.length || 0}`);

      // If pdf-parse succeeded and got text
      if (data.text && data.text.trim().length > 0) {
        this.logger.log(`PDF text extracted successfully (${data.text.length} chars)`);
        return {
          text: data.text.trim(),
          method: 'pdf-parse',
        };
      }

      // No text found - PDF might be scanned images
      // Note: OpenAI Vision API doesn't support PDF files directly
      // For scanned PDFs, user would need to upload images instead
      this.logger.warn('No text found in PDF (might be scanned images). Upload images for OCR instead.');
      return {
        text: '',
        method: 'pdf-parse',
      };
    } catch (error) {
      this.logger.error(`PDF parsing failed: ${error.message}`);
      this.logger.error(`PDF error details: ${JSON.stringify(error)}`);

      // Note: OpenAI Vision API doesn't support PDF files
      // Return empty text instead of throwing error
      this.logger.warn('PDF parsing failed. Returning empty text.');
      return {
        text: '',
        method: 'pdf-parse',
      };
    }
  }

  /**
   * Extract text from image using Tesseract.js
   */
  private async extractFromImage(file: Express.Multer.File): Promise<OcrResult> {
    try {
      this.logger.log(`Starting Tesseract OCR for image: ${file.originalname} (${file.size} bytes)`);

      const worker = await createWorker('spa'); // Spanish language
      this.logger.log('Tesseract worker created, recognizing text...');

      const { data } = await worker.recognize(file.buffer);
      await worker.terminate();

      this.logger.log(`Tesseract complete. Confidence: ${data.confidence.toFixed(2)}%, Text length: ${data.text?.length || 0}`);

      // If tesseract got good results (confidence > 60%)
      if (data.confidence > 60 && data.text.trim().length > 0) {
        this.logger.log(
          `Tesseract OCR successful (confidence: ${data.confidence.toFixed(2)}%)`,
        );
        return {
          text: data.text.trim(),
          method: 'tesseract',
          confidence: data.confidence,
        };
      }

      // Low confidence or no text - try OpenAI if available
      if (this.openai && this.enableAI) {
        this.logger.log(
          `Tesseract confidence low (${data.confidence.toFixed(2)}%). Trying OpenAI Vision...`,
        );
        return await this.extractWithOpenAI(file);
      }

      // Return tesseract result anyway
      this.logger.warn(`Returning low-confidence Tesseract result: ${data.text?.length || 0} chars`);
      return {
        text: data.text.trim(),
        method: 'tesseract',
        confidence: data.confidence,
      };
    } catch (error) {
      this.logger.error(`Tesseract OCR failed: ${error.message}`);
      this.logger.error(`Tesseract error stack: ${error.stack}`);

      // Try OpenAI as fallback
      if (this.openai && this.enableAI) {
        this.logger.log('Falling back to OpenAI Vision for image...');
        return await this.extractWithOpenAI(file);
      }

      throw error;
    }
  }

  /**
   * Extract text using OpenAI Vision API (for images and scanned PDFs)
   */
  private async extractWithOpenAI(file: Express.Multer.File): Promise<OcrResult> {
    if (!this.openai) {
      throw new Error('OpenAI not configured');
    }

    try {
      this.logger.log('Using OpenAI Vision for OCR...');

      // Convert buffer to base64
      const base64Image = file.buffer.toString('base64');
      const dataUrl = `data:${file.mimetype};base64,${base64Image}`;

      const response = await this.openai.chat.completions.create({
        model: this.configService.get<string>('OPENAI_VISION_MODEL', 'gpt-4o'),
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Extract all text from this document image. Return only the extracted text, maintaining the original formatting and structure. If this is a government document in Spanish, preserve all formal language, dates, reference numbers, and official information exactly as shown.',
              },
              {
                type: 'image_url',
                image_url: { url: dataUrl },
              },
            ],
          },
        ],
        max_tokens: 4000,
      });

      const extractedText = response.choices[0]?.message?.content || '';

      this.logger.log(
        `OpenAI Vision OCR successful (${extractedText.length} chars)`,
      );

      return {
        text: extractedText.trim(),
        method: 'openai-vision',
      };
    } catch (error) {
      this.logger.error(`OpenAI Vision OCR failed: ${error.message}`);
      throw new Error(`OpenAI OCR failed: ${error.message}`);
    }
  }

  /**
   * Generate AI summary of document text
   */
  async generateSummary(text: string): Promise<string> {
    if (!this.openai || !this.enableAI) {
      this.logger.warn('AI features not enabled. Skipping summary generation.');
      return '';
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: this.configService.get<string>('OPENAI_MODEL', 'gpt-4o'),
        messages: [
          {
            role: 'system',
            content:
              'Eres un asistente experto en análisis de documentos gubernamentales de Guinea Ecuatorial. Tu tarea es generar resúmenes concisos y precisos de documentos oficiales.',
          },
          {
            role: 'user',
            content: `Resume el siguiente documento oficial en 2-3 párrafos, destacando los puntos clave, acciones requeridas, y cualquier información importante:\n\n${text}`,
          },
        ],
        max_tokens: 500,
      });

      return response.choices[0]?.message?.content?.trim() || '';
    } catch (error) {
      this.logger.error(`AI summary generation failed: ${error.message}`);
      return '';
    }
  }

  /**
   * Extract key points from document text
   */
  async extractKeyPoints(text: string): Promise<string[]> {
    if (!this.openai || !this.enableAI) {
      this.logger.warn('AI features not enabled. Skipping key points extraction.');
      return [];
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: this.configService.get<string>('OPENAI_MODEL', 'gpt-4o'),
        messages: [
          {
            role: 'system',
            content:
              'Eres un asistente experto en análisis de documentos. Extrae los puntos clave de documentos oficiales en formato de lista.',
          },
          {
            role: 'user',
            content: `Extrae los 3-5 puntos más importantes de este documento. Devuelve solo una lista de puntos clave, uno por línea, comenzando cada uno con un guión:\n\n${text}`,
          },
        ],
        max_tokens: 300,
      });

      const content = response.choices[0]?.message?.content?.trim() || '';

      // Parse bullet points from response
      const points = content
        .split('\n')
        .filter((line) => line.trim().length > 0)
        .map((line) => line.replace(/^[-•*]\s*/, '').trim())
        .filter((point) => point.length > 0);

      return points;
    } catch (error) {
      this.logger.error(`AI key points extraction failed: ${error.message}`);
      return [];
    }
  }

  /**
   * Generate proposed response for document
   */
  async generateProposedResponse(text: string, documentType: string): Promise<string> {
    if (!this.openai || !this.enableAI) {
      this.logger.warn('AI features not enabled. Skipping response generation.');
      return '';
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: this.configService.get<string>('OPENAI_MODEL', 'gpt-4o'),
        messages: [
          {
            role: 'system',
            content:
              'Eres un asistente de redacción de documentos oficiales del gobierno de Guinea Ecuatorial. Generas respuestas profesionales y formales a documentos gubernamentales.',
          },
          {
            role: 'user',
            content: `Genera una respuesta oficial propuesta para este ${documentType}. La respuesta debe ser formal, profesional, y apropiada para un contexto gubernamental:\n\n${text}`,
          },
        ],
        max_tokens: 1000,
      });

      return response.choices[0]?.message?.content?.trim() || '';
    } catch (error) {
      this.logger.error(`AI response generation failed: ${error.message}`);
      return '';
    }
  }
}
