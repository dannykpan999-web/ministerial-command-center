import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DocumentDirection } from '../dto/create-document.dto';

@Injectable()
export class CorrelativeNumberService {
  constructor(private prisma: PrismaService) {}

  /**
   * Generate correlative number in format: ENT-2026-000001 (IN) or SAL-2026-000001 (OUT)
   * @param direction Document direction (IN/OUT)
   * @returns Promise<string> Correlative number
   */
  async generateCorrelativeNumber(direction: DocumentDirection): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = direction === DocumentDirection.IN ? 'ENT' : 'SAL';
    const searchPattern = `${prefix}-${year}-%`;

    // Find the last document with this prefix and year
    const lastDocument = await this.prisma.document.findFirst({
      where: {
        correlativeNumber: {
          startsWith: `${prefix}-${year}-`,
        },
      },
      orderBy: {
        correlativeNumber: 'desc',
      },
    });

    let nextNumber = 1;

    if (lastDocument) {
      // Extract the number from the correlative (e.g., "ENT-2026-000042" -> 42)
      const parts = lastDocument.correlativeNumber.split('-');
      if (parts.length === 3) {
        const currentNumber = parseInt(parts[2], 10);
        if (!isNaN(currentNumber)) {
          nextNumber = currentNumber + 1;
        }
      }
    }

    // Pad with zeros to 6 digits
    const paddedNumber = nextNumber.toString().padStart(6, '0');

    return `${prefix}-${year}-${paddedNumber}`;
  }

  /**
   * Validate correlative number format
   * @param correlativeNumber The correlative number to validate
   * @returns boolean
   */
  isValidFormat(correlativeNumber: string): boolean {
    // Format: PREFIX-YYYY-NNNNNN
    const regex = /^(ENT|SAL)-\d{4}-\d{6}$/;
    return regex.test(correlativeNumber);
  }
}
