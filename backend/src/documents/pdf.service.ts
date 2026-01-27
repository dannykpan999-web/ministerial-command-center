import { Injectable, Logger } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);

  constructor(private prisma: PrismaService) {}

  async generateDocumentPdf(document: any, res: Response): Promise<void> {
    // Fetch document with files
    const fullDocument = await this.prisma.document.findUnique({
      where: { id: document.id },
      include: {
        files: {
          orderBy: { createdAt: 'asc' },
        },
        entity: true,
        responsible: true,
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
            position: true,
          },
        },
      },
    });

    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 60, bottom: 70, left: 60, right: 60 },
      bufferPages: true,
      info: {
        Title: document.title,
        Author: 'Ministerio MTTSIA - Guinea Ecuatorial',
        Subject: `Documento ${document.correlativeNumber}`,
        Keywords: 'oficial, ministerio, documento',
      },
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="MTTSIA-${document.correlativeNumber}.pdf"`,
    );

    // Pipe PDF to response
    doc.pipe(res);

    // Define colors (Equatorial Guinea flag colors + official)
    const greenColor = '#008751'; // Flag Green
    const redColor = '#CE1126'; // Flag Red
    const blueColor = '#003893'; // Flag Blue
    const goldColor = '#FCD116'; // Gold accent
    const darkBlue = '#001F3F'; // Dark official blue
    const textColor = '#2D3748'; // Dark Gray
    const lightGray = '#F7FAFC'; // Light background

    // ==================== HEADER ====================
    // National colors border (top) - mimicking flag colors
    const borderHeight = 6;
    const borderY = 50;
    const borderWidth = doc.page.width - 120;
    const borderX = 60;

    // Green stripe
    doc.rect(borderX, borderY, borderWidth, borderHeight)
      .fill(greenColor);

    // White stripe
    doc.rect(borderX, borderY + borderHeight, borderWidth, borderHeight)
      .fill('#FFFFFF');

    // Red stripe
    doc.rect(borderX, borderY + (borderHeight * 2), borderWidth, borderHeight)
      .fill(redColor);

    // Blue triangle on left (smaller representation)
    doc.moveTo(borderX, borderY)
      .lineTo(borderX, borderY + (borderHeight * 3))
      .lineTo(borderX + 40, borderY + (borderHeight * 1.5))
      .fill(blueColor);

    doc.moveDown(2);

    // Official Emblem Area (Text-based representation)
    doc
      .fillColor(darkBlue)
      .fontSize(20)
      .font('Helvetica-Bold')
      .text('REPÚBLICA DE GUINEA ECUATORIAL', { align: 'center' })
      .moveDown(0.2);

    doc
      .fontSize(9)
      .fillColor(textColor)
      .font('Helvetica')
      .text('UNIDAD • PAZ • JUSTICIA', { align: 'center' })
      .moveDown(0.8);

    // Ministry Header with gold background
    const ministryBoxY = doc.y;
    const ministryBoxHeight = 50;
    const ministryBoxPadding = 30;

    doc
      .rect(
        borderX,
        ministryBoxY,
        doc.page.width - 120,
        ministryBoxHeight
      )
      .fillAndStroke(lightGray, darkBlue)
      .lineWidth(2);

    doc
      .fillColor(darkBlue)
      .fontSize(16)
      .font('Helvetica-Bold')
      .text(
        'MINISTERIO DE TRANSPORTE, TECNOLOGÍA,',
        borderX + ministryBoxPadding,
        ministryBoxY + 10,
        {
          width: doc.page.width - 180,
          align: 'center',
        }
      );

    doc
      .text(
        'CORREOS Y TELECOMUNICACIONES',
        borderX + ministryBoxPadding,
        ministryBoxY + 27,
        {
          width: doc.page.width - 180,
          align: 'center',
        }
      );

    doc.y = ministryBoxY + ministryBoxHeight + 5;

    // Gold separator line
    doc
      .strokeColor(goldColor)
      .lineWidth(3)
      .moveTo(borderX + 50, doc.y)
      .lineTo(doc.page.width - borderX - 50, doc.y)
      .stroke()
      .strokeColor('#000')
      .lineWidth(1);

    doc.moveDown(0.5);

    // Document classification badge
    const classificationBadge = document.classification === 'INTERNAL'
      ? 'USO INTERNO'
      : 'DOCUMENTO OFICIAL';
    const priorityColor = document.priority === 'URGENT'
      ? redColor
      : document.priority === 'HIGH'
      ? '#FF6B35'
      : greenColor;

    doc
      .fontSize(9)
      .fillColor(textColor)
      .font('Helvetica')
      .text('Sistema de Gestión Documental • MTTSIA', { align: 'center' })
      .moveDown(0.8);

    // Document type and priority badge
    const badgeY = doc.y;
    const badgeHeight = 28;

    doc
      .rect(borderX, badgeY, doc.page.width - 120, badgeHeight)
      .fillAndStroke(priorityColor, priorityColor);

    doc
      .fillColor('#FFFFFF')
      .fontSize(12)
      .font('Helvetica-Bold')
      .text(
        `${classificationBadge} ${document.priority ? '• ' + document.priority : ''}`,
        borderX,
        badgeY + 8,
        {
          width: doc.page.width - 120,
          align: 'center',
        }
      );

    doc.y = badgeY + badgeHeight;
    doc.moveDown(1.5);

    // Reset fill color
    doc.fillColor(textColor);

    // ==================== METADATA SECTION ====================
    const metadataBoxY = doc.y;
    const leftCol = doc.page.margins.left;
    const rightCol = doc.page.width / 2 + 10;
    const colWidth = (doc.page.width / 2) - doc.page.margins.left - 20;

    // Light gray background for metadata
    doc
      .rect(leftCol, metadataBoxY, doc.page.width - doc.page.margins.left - doc.page.margins.right, 85)
      .fillAndStroke(lightGray, darkBlue)
      .lineWidth(1);

    // Left column metadata
    doc.fillColor(textColor);
    let metaY = metadataBoxY + 10;

    doc
      .fontSize(8)
      .font('Helvetica-Bold')
      .fillColor(darkBlue)
      .text('Nº DE EXPEDIENTE:', leftCol + 10, metaY);

    doc
      .font('Helvetica')
      .fillColor(textColor)
      .text(document.correlativeNumber, leftCol + 95, metaY);

    metaY += 15;
    doc
      .font('Helvetica-Bold')
      .fillColor(darkBlue)
      .text('FECHA:', leftCol + 10, metaY);

    doc
      .font('Helvetica')
      .fillColor(textColor)
      .text(
        new Date(document.createdAt).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }),
        leftCol + 95,
        metaY
      );

    metaY += 15;
    doc
      .font('Helvetica-Bold')
      .fillColor(darkBlue)
      .text('TIPO:', leftCol + 10, metaY);

    doc
      .font('Helvetica')
      .fillColor(textColor)
      .text(document.type || 'N/A', leftCol + 95, metaY);

    // Right column metadata
    metaY = metadataBoxY + 10;

    doc
      .font('Helvetica-Bold')
      .fillColor(darkBlue)
      .text('ESTADO:', rightCol, metaY);

    const statusText = {
      DRAFT: 'Borrador',
      PENDING: 'Pendiente',
      IN_PROGRESS: 'En Proceso',
      COMPLETED: 'Completado',
      ARCHIVED: 'Archivado',
      REJECTED: 'Rechazado',
    }[document.status] || document.status;

    doc
      .font('Helvetica')
      .fillColor(textColor)
      .text(statusText, rightCol + 55, metaY);

    metaY += 15;
    doc
      .font('Helvetica-Bold')
      .fillColor(darkBlue)
      .text('DIRECCIÓN:', rightCol, metaY);

    doc
      .font('Helvetica')
      .fillColor(textColor)
      .text(document.direction === 'IN' ? 'Entrada' : 'Salida', rightCol + 55, metaY);

    metaY += 15;
    doc
      .font('Helvetica-Bold')
      .fillColor(darkBlue)
      .text('CLASIFICACIÓN:', rightCol, metaY);

    doc
      .font('Helvetica')
      .fillColor(textColor)
      .text(
        document.classification === 'INTERNAL' ? 'Interno' : 'Externo',
        rightCol + 80,
        metaY
      );

    doc.y = metadataBoxY + 95;
    doc.moveDown(1.5);

    // ==================== FROM/TO SECTION ====================
    // From/To box with official styling
    const fromToY = doc.y;

    doc
      .rect(leftCol, fromToY, doc.page.width - doc.page.margins.left - doc.page.margins.right, 50)
      .fillAndStroke('#FFFFFF', darkBlue)
      .lineWidth(1);

    let fromToInnerY = fromToY + 10;

    if (document.entity) {
      doc
        .fontSize(9)
        .font('Helvetica-Bold')
        .fillColor(darkBlue)
        .text('DE:', leftCol + 15, fromToInnerY, { continued: true })
        .font('Helvetica')
        .fillColor(textColor)
        .text(` ${document.entity.name}`, { width: colWidth * 2 - 30 });

      fromToInnerY += 15;
    }

    if (document.responsible) {
      doc
        .font('Helvetica-Bold')
        .fillColor(darkBlue)
        .text('PARA:', leftCol + 15, fromToInnerY, { continued: true })
        .font('Helvetica')
        .fillColor(textColor)
        .text(
          ` ${document.responsible.firstName} ${document.responsible.lastName}`,
          { width: colWidth * 2 - 30 }
        );

      if (document.responsible.position) {
        doc
          .fontSize(8)
          .fillColor(textColor)
          .font('Helvetica-Oblique')
          .text(
            `         ${document.responsible.position}`,
            { width: colWidth * 2 - 30 }
          );
      }
    }

    doc.y = fromToY + 60;
    doc.moveDown(1.5);

    // ==================== SUBJECT SECTION ====================
    // Subject header with accent color
    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor('#FFFFFF')
      .rect(leftCol, doc.y, doc.page.width - doc.page.margins.left - doc.page.margins.right, 22)
      .fillAndStroke(greenColor, greenColor);

    doc.text('ASUNTO', leftCol + 15, doc.y - 15, {
      width: doc.page.width - doc.page.margins.left - doc.page.margins.right - 30,
    });

    doc.moveDown(0.3);

    // Subject content
    doc
      .fillColor(textColor)
      .font('Helvetica')
      .fontSize(11)
      .text(document.title, {
        align: 'justify',
        lineGap: 2,
      })
      .moveDown(1.5);

    // ==================== CONTENT SECTION ====================
    if (document.content) {
      // Content header
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .fillColor('#FFFFFF')
        .rect(leftCol, doc.y, doc.page.width - doc.page.margins.left - doc.page.margins.right, 22)
        .fillAndStroke(greenColor, greenColor);

      doc.text('CONTENIDO DEL DOCUMENTO', leftCol + 15, doc.y - 15);

      doc.moveDown(0.5);

      // Content text with justified alignment
      doc
        .fillColor(textColor)
        .font('Helvetica')
        .fontSize(10)
        .text(document.content, {
          align: 'justify',
          lineGap: 4,
          indent: 10,
        })
        .moveDown(2);
    }

    // ==================== AI SUMMARY SECTION ====================
    if (document.aiSummary) {
      // Check if we need a new page
      if (doc.y > 600) {
        doc.addPage();
      }

      // AI Summary header with blue accent
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .fillColor('#FFFFFF')
        .rect(leftCol, doc.y, doc.page.width - doc.page.margins.left - doc.page.margins.right, 22)
        .fillAndStroke(blueColor, blueColor);

      doc.text('RESUMEN GENERADO POR IA', leftCol + 15, doc.y - 15);

      doc.moveDown(0.5);

      // AI Summary box with light background
      const summaryBoxY = doc.y;
      const summaryHeight = doc.heightOfString(document.aiSummary, {
        width: doc.page.width - doc.page.margins.left - doc.page.margins.right - 30,
        align: 'justify',
      }) + 20;

      doc
        .rect(leftCol, summaryBoxY, doc.page.width - doc.page.margins.left - doc.page.margins.right, summaryHeight)
        .fillAndStroke('#F0F4F8', '#CBD5E0')
        .lineWidth(1);

      doc
        .fillColor(textColor)
        .font('Helvetica')
        .fontSize(9)
        .text(document.aiSummary, leftCol + 15, summaryBoxY + 10, {
          width: doc.page.width - doc.page.margins.left - doc.page.margins.right - 30,
          align: 'justify',
          lineGap: 3,
        });

      doc.y = summaryBoxY + summaryHeight;
      doc.moveDown(1.5);
    }

    // ==================== KEY POINTS SECTION ====================
    if (document.aiKeyPoints && document.aiKeyPoints.length > 0) {
      // Key Points header
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .fillColor('#FFFFFF')
        .rect(leftCol, doc.y, doc.page.width - doc.page.margins.left - doc.page.margins.right, 22)
        .fillAndStroke(goldColor, goldColor);

      doc
        .fillColor(darkBlue)
        .text('PUNTOS CLAVE', leftCol + 15, doc.y - 15);

      doc.moveDown(0.5);

      // Key points with bullets
      document.aiKeyPoints.forEach((point, index) => {
        doc
          .fillColor(greenColor)
          .fontSize(12)
          .text('●', leftCol + 15, doc.y, { continued: true })
          .fillColor(textColor)
          .fontSize(9)
          .font('Helvetica')
          .text(` ${point}`, {
            width: doc.page.width - doc.page.margins.left - doc.page.margins.right - 40,
            align: 'left',
          })
          .moveDown(0.5);
      });

      doc.moveDown(1.5);
    }

    // ==================== FILES SECTION ====================
    if (fullDocument?.files && fullDocument.files.length > 0) {
      // Check if we need a new page
      if (doc.y > 650) {
        doc.addPage();
      }

      // Files header
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .fillColor('#FFFFFF')
        .rect(leftCol, doc.y, doc.page.width - doc.page.margins.left - doc.page.margins.right, 22)
        .fillAndStroke(redColor, redColor);

      doc.text('ARCHIVOS ADJUNTOS', leftCol + 15, doc.y - 15);

      doc.moveDown(0.5);

      // Files table-like layout
      const filesBoxY = doc.y;
      const filesHeight = (fullDocument.files.length * 20) + 15;

      doc
        .rect(leftCol, filesBoxY, doc.page.width - doc.page.margins.left - doc.page.margins.right, filesHeight)
        .fillAndStroke('#FFFFFF', darkBlue)
        .lineWidth(1);

      let fileY = filesBoxY + 10;

      fullDocument.files.forEach((file, index) => {
        const fileSizeMB = (file.fileSize / (1024 * 1024)).toFixed(2);
        const uploadDate = new Date(file.createdAt).toLocaleDateString('es-ES');

        doc
          .fillColor(darkBlue)
          .fontSize(8)
          .font('Helvetica-Bold')
          .text(`${index + 1}.`, leftCol + 15, fileY, { width: 20 });

        doc
          .fillColor(textColor)
          .font('Helvetica')
          .text(file.fileName, leftCol + 35, fileY, { width: 300, continued: true });

        doc
          .fontSize(7)
          .fillColor('#718096')
          .text(` (${fileSizeMB} MB • ${uploadDate})`);

        fileY += 20;
      });

      doc.y = filesBoxY + filesHeight;
      doc.moveDown(1.5);
    }

    // ==================== QR CODE SECTION ====================
    if (document.qrCode) {
      try {
        // Add new page for QR code if needed
        if (doc.y > 580) {
          doc.addPage();
        }

        // QR Code box with official styling
        const qrBoxY = doc.y;
        const qrBoxHeight = 230;

        doc
          .rect(leftCol, qrBoxY, doc.page.width - doc.page.margins.left - doc.page.margins.right, qrBoxHeight)
          .fillAndStroke(lightGray, darkBlue)
          .lineWidth(2);

        // QR Header
        doc
          .fontSize(11)
          .font('Helvetica-Bold')
          .fillColor(darkBlue)
          .text('CÓDIGO DE VERIFICACIÓN QR', leftCol + 15, qrBoxY + 15, {
            width: doc.page.width - doc.page.margins.left - doc.page.margins.right - 30,
            align: 'center',
          });

        doc
          .fontSize(8)
          .font('Helvetica')
          .fillColor(textColor)
          .text(
            'Escanee este código para acceder al documento digital y verificar su autenticidad',
            leftCol + 15,
            qrBoxY + 35,
            {
              width: doc.page.width - doc.page.margins.left - doc.page.margins.right - 30,
              align: 'center',
            }
          );

        // Insert QR code image (base64 data URL)
        const qrSize = 140;
        const qrX = (doc.page.width - qrSize) / 2;
        const qrY = qrBoxY + 60;

        // White background for QR
        doc
          .rect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10)
          .fillAndStroke('#FFFFFF', darkBlue)
          .lineWidth(2);

        doc.image(document.qrCode, qrX, qrY, {
          width: qrSize,
          height: qrSize,
          align: 'center',
        });

        // Document ID below QR
        doc
          .fontSize(7)
          .font('Helvetica')
          .fillColor(textColor)
          .text(
            `ID: ${document.correlativeNumber}`,
            leftCol + 15,
            qrY + qrSize + 15,
            {
              width: doc.page.width - doc.page.margins.left - doc.page.margins.right - 30,
              align: 'center',
            }
          );

        doc.y = qrBoxY + qrBoxHeight;

        this.logger.log('QR code added to PDF');
      } catch (error) {
        this.logger.error(`Failed to add QR code to PDF: ${error.message}`);
        // Continue without QR code
      }
    }

    // ==================== SIGNATURE SECTION ====================
    // Add space for signatures if on last content page
    if (doc.y < 650) {
      doc.moveDown(2);

      const sigY = doc.y;
      const sigBoxHeight = 80;

      // Signature area
      doc
        .fontSize(8)
        .font('Helvetica-Oblique')
        .fillColor(textColor)
        .text('Firma y Sello:', leftCol + 20, sigY);

      // Signature line
      doc
        .moveTo(leftCol + 20, sigY + 50)
        .lineTo(leftCol + 200, sigY + 50)
        .stroke();

      if (fullDocument?.createdBy) {
        doc
          .fontSize(7)
          .font('Helvetica')
          .text(
            `${fullDocument.createdBy.firstName} ${fullDocument.createdBy.lastName}`,
            leftCol + 20,
            sigY + 55
          );

        if (fullDocument.createdBy.position) {
          doc
            .fontSize(7)
            .font('Helvetica-Oblique')
            .text(fullDocument.createdBy.position, leftCol + 20, sigY + 65);
        }
      }
    }

    // ==================== FOOTER ====================
    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);

      const pageHeight = doc.page.height;
      const footerY = pageHeight - 50;

      // Footer separator line with national colors
      doc
        .strokeColor(greenColor)
        .lineWidth(2)
        .moveTo(60, footerY)
        .lineTo(doc.page.width - 60, footerY)
        .stroke();

      // Footer text
      doc
        .fontSize(7)
        .fillColor(textColor)
        .font('Helvetica')
        .text(
          `Documento generado electrónicamente el ${new Date().toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}`,
          60,
          footerY + 8,
          { align: 'center', width: doc.page.width - 120 }
        );

      doc
        .fontSize(6)
        .fillColor(darkBlue)
        .font('Helvetica-Bold')
        .text(
          'MINISTERIO DE TRANSPORTE, TECNOLOGÍA, CORREOS Y TELECOMUNICACIONES',
          60,
          footerY + 20,
          { align: 'center', width: doc.page.width - 120 }
        );

      doc
        .fontSize(6)
        .fillColor(textColor)
        .font('Helvetica')
        .text(
          'Sistema de Gestión Documental • República de Guinea Ecuatorial',
          60,
          footerY + 30,
          { align: 'center', width: doc.page.width - 120 }
        );

      // Page numbers in circle
      const pageNumY = footerY + 8;
      const pageNumX = doc.page.width - 80;

      doc
        .circle(pageNumX, pageNumY, 12)
        .fillAndStroke(greenColor, darkBlue)
        .lineWidth(1);

      doc
        .fontSize(8)
        .fillColor('#FFFFFF')
        .font('Helvetica-Bold')
        .text(
          `${i + 1}`,
          pageNumX - 10,
          pageNumY - 5,
          { width: 20, align: 'center' }
        );

      doc
        .fontSize(6)
        .fillColor(textColor)
        .font('Helvetica')
        .text(
          `de ${pages.count}`,
          pageNumX - 15,
          pageNumY + 15,
          { width: 30, align: 'center' }
        );
    }

    // Finalize PDF
    doc.end();

    this.logger.log(`PDF generated successfully for document ${document.correlativeNumber}`);
  }
}
