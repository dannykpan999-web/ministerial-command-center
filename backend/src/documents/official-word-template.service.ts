import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DocumentNumberingService } from './document-numbering.service';
import { QrService } from './qr.service';
import { COAT_OF_ARMS_BASE64 } from './assets/coat-of-arms.constant';
import { execFile } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const execFileAsync = promisify(execFile);

/**
 * Official Word Template Service
 *
 * Generates a DOCX that matches the official Equatorial Guinea government
 * document format (same as the PDF template):
 *
 *   [Coat of Arms — centered]
 *   REPÚBLICA DE GUINEA ECUATORIAL
 *   MINISTERIO DE TRANSPORTES, TELECOMUNICACIONES Y
 *   SISTEMAS DE INTELIGENCIA ARTIFICIAL
 *   ────◆────
 *   EL MINISTRO / LA MINISTRA
 *
 *   Núm. / Ref. / Secc. table
 *   ─────────────────────────────
 *   [recipient]        [date]
 *   DOCUMENT TITLE
 *   body content...
 *   signature block
 *
 * Calls LibreOffice directly via execFile (bypasses libreoffice-convert
 * package which has a quoting bug with filter names containing spaces).
 */
@Injectable()
export class OfficialWordTemplateService {
  private readonly logger = new Logger(OfficialWordTemplateService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly numberingService: DocumentNumberingService,
    private readonly qrService: QrService,
  ) {}

  async generateOfficialWord(documentId: string): Promise<Buffer> {
    this.logger.log(`Generating official DOCX for document: ${documentId}`);

    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
      include: { entity: { select: { name: true } } },
    });

    if (!document) throw new Error('Document not found');

    let documentNumber = document.documentNumber;
    if (!documentNumber) {
      documentNumber = await this.numberingService.assignDocumentNumber(documentId);
    }

    const qrDataUrl = await this.qrService.generateDocumentQR(documentId).catch(() => null);

    const html = this.buildHtmlDocument(document, documentNumber, qrDataUrl);

    const tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'mcc-word-'));
    const inputFile = path.join(tmpDir, 'document.html');
    const outputFile = path.join(tmpDir, 'document.docx');

    try {
      await fs.promises.writeFile(inputFile, html, 'utf-8');

      await execFileAsync('libreoffice', [
        '--headless',
        '--convert-to', 'docx:MS Word 2007 XML',
        '--outdir', tmpDir,
        inputFile,
      ], { timeout: 60000 });

      const docxBuffer = await fs.promises.readFile(outputFile);
      this.logger.log(`DOCX generated successfully for document: ${documentId}`);
      return docxBuffer;
    } catch (error) {
      this.logger.error(`LibreOffice conversion failed: ${error.message}`, error.stack);
      throw new Error(`No se pudo convertir el documento a Word: ${error.message}`);
    } finally {
      await fs.promises.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
    }
  }

  private stripHtml(html: string): string {
    if (!html) return '';
    return html
      .replace(/<\/p>/gi, '\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<\/h[1-6]>/gi, '\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<li[^>]*>/gi, '• ')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  private buildHtmlDocument(document: any, documentNumber: string, qrDataUrl: string | null): string {
    const signerTitle = document.signerTitle || 'EL MINISTRO';
    const referenceCode = document.referenceCode || '';
    const subDepartment = document.subDepartment || '';
    const recipientTitle = document.recipientTitle || '';

    const rawContent =
      document.content?.trim().length > 0
        ? document.content
        : document.aiSummary || '';

    const bodyHtml = rawContent
      ? rawContent
      : '<p><em>(Sin contenido)</em></p>';

    const now = new Date(document.createdAt);
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
    ];
    const dateStr = `Malabo, ${now.getDate()} de ${months[now.getMonth()]} de ${now.getFullYear()}`;
    const coatOfArmsDataUrl = `data:image/png;base64,${COAT_OF_ARMS_BASE64}`;

    // Build metadata rows as plain paragraphs (no table = no borders)
    const metaRows = [
      `<p style="font-size:9pt;margin:2pt 0;line-height:1.3;"><span style="font-weight:bold;font-style:italic;">N&uacute;m.&nbsp;&nbsp;</span><span style="font-style:italic;">${documentNumber || ''}</span></p>`,
      referenceCode ? `<p style="font-size:9pt;margin:2pt 0;line-height:1.3;"><span style="font-weight:bold;font-style:italic;">Ref.&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="font-style:italic;">${referenceCode}</span></p>` : '',
      subDepartment ? `<p style="font-size:9pt;margin:2pt 0;line-height:1.3;"><span style="font-weight:bold;font-style:italic;">Secc.&nbsp;&nbsp;</span><span style="font-style:italic;">${subDepartment}</span></p>` : '',
    ].filter(Boolean).join('\n');

    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    /* Page layout — matches PDF margins (left=57pt≈2cm, right=50pt≈1.76cm, top=45pt≈1.6cm) */
    @page { size: A4; margin: 1.6cm 1.76cm 2.5cm 2cm; }

    * { box-sizing: border-box; }

    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 11pt;
      color: #000;
      line-height: 1.4;
      margin: 0;
      padding: 0;
    }

    /* ── ALL tables: never show borders ── */
    table { border: none !important; border-collapse: collapse !important; }
    td, th { border: none !important; padding: 0 !important; }

    p { margin: 0; padding: 0; }
  </style>
</head>
<body>

<!-- ══════════════════════════════════════════════
     OFFICIAL HEADER
     Left cell: 220pt-wide header block (PDF: blockLeft=31, blockWidth=220)
     Right cell: QR code (PDF: page.width-115, width:65, height:65)
     ══════════════════════════════════════════════ -->
<table border="0" cellspacing="0" cellpadding="0"
       style="width:100%; border:none; border-collapse:collapse; margin-bottom:7pt;">
  <tr>
    <td style="border:none; padding:0; width:220pt; text-align:center; vertical-align:top;">

      <!-- Coat of arms: 36×44pt (PDF: emblemW=44, emblemH=52, scaled slightly) -->
      <div><img src="${coatOfArmsDataUrl}"
           alt="Escudo" width="36" height="44"
           style="display:inline-block; width:36pt; height:44pt;" /></div>

      <!-- REPÚBLICA DE GUINEA ECUATORIAL — 9pt Bold -->
      <p style="font-size:9pt; font-weight:bold; text-transform:uppercase;
                 letter-spacing:0.2pt; margin:2pt 0 1pt 0; line-height:1.2;">
        REP&Uacute;BLICA DE GUINEA ECUATORIAL
      </p>

      <!-- Ministry name — 7pt normal, 2 lines -->
      <p style="font-size:7pt; text-transform:uppercase; margin:0 0 1pt 0; line-height:1.3;">
        MINISTERIO DE TRANSPORTES, TELECOMUNICACIONES Y<br/>
        SISTEMAS DE INTELIGENCIA ARTIFICIAL
      </p>

      <!-- Ornamental divider ────◆──── -->
      <p style="font-size:8pt; margin:3pt 0 2pt 0; letter-spacing:2pt;">
        &#x2500;&#x2500;&#x2500;&#x2500;&#x25C6;&#x2500;&#x2500;&#x2500;&#x2500;
      </p>

      <!-- Signer title — 9pt Bold -->
      <p style="font-size:9pt; font-weight:bold; text-transform:uppercase;
                 letter-spacing:0.4pt; margin:2pt 0 0 0;">
        ${signerTitle.toUpperCase()}
      </p>

    </td>
    <td style="border:none; padding:0; text-align:right; vertical-align:top;">
      ${qrDataUrl ? `<img src="${qrDataUrl}" alt="QR" width="65" height="65"
           style="display:inline-block; width:65pt; height:65pt;" />` : ''}
    </td>
  </tr>
</table>

<!-- ══════════════════════════════════════════════
     METADATA ROWS  Núm. / Ref. / Secc.
     Plain paragraphs — NO TABLE to avoid Word borders
     (PDF: fontSize=9, font=Helvetica-BoldOblique + Helvetica-Oblique)
     ══════════════════════════════════════════════ -->
<div style="margin-bottom:4pt;">
  ${metaRows}
</div>

<!-- ══════════════════════════════════════════════
     SEPARATOR LINE  (PDF: full-width 0.8pt stroke)
     ══════════════════════════════════════════════ -->
<hr style="border:none; border-top:0.8pt solid #000; margin:5pt 0 8pt 0;" />

<!-- ══════════════════════════════════════════════
     RECIPIENT  +  DATE  (2-column, NO BORDERS)
     Use border="0" attribute so LibreOffice drops all table borders
     ══════════════════════════════════════════════ -->
<table border="0" cellspacing="0" cellpadding="0"
       style="width:100%; border:none; border-collapse:collapse; margin-bottom:10pt;">
  <tr>
    <td style="border:none; padding:0; font-size:11pt; font-weight:bold; vertical-align:top; width:55%;">${recipientTitle || '&nbsp;'}</td>
    <td style="border:none; padding:0; font-size:11pt; text-align:right; vertical-align:top; white-space:nowrap; width:45%;">${dateStr}</td>
  </tr>
</table>

<!-- ══════════════════════════════════════════════
     DOCUMENT TITLE  (PDF: fontSize=11, Helvetica-Bold, centered)
     ══════════════════════════════════════════════ -->
<p style="text-align:center; font-weight:bold; font-size:11pt;
           text-transform:uppercase; margin:0 0 14pt 0;">
  ${document.title || ''}
</p>

<!-- ══════════════════════════════════════════════
     SALUTATION  (PDF: "Excmo. Señor:" centered)
     ══════════════════════════════════════════════ -->
<p style="text-align:center; font-size:11pt; margin:0 0 10pt 0;">Excmo. Se&ntilde;or:</p>

<!-- ══════════════════════════════════════════════
     BODY CONTENT  (PDF: fontSize=11, justify, lineGap=4)
     Full HTML from rich-text editor is injected here
     ══════════════════════════════════════════════ -->
<div style="font-size:11pt; line-height:1.5; text-align:justify;">
  ${bodyHtml}
</div>

<!-- ══════════════════════════════════════════════
     SIGNATURE SECTION  (PDF: addSignatureSection)
     ══════════════════════════════════════════════ -->
<div style="margin-top:36pt; page-break-inside:avoid;">

  <!-- Date + Motto (PDF: formatSpanishDate centered, then "POR UNA GUINEA MEJOR,") -->
  <p style="font-size:11pt; text-align:center; margin:0 0 4pt 0;">${dateStr}</p>
  <p style="font-size:11pt; font-weight:bold; text-align:center; margin:0 0 24pt 0;">POR UNA GUINEA MEJOR,</p>

  <!-- Seal  |  Signature  — 2-column NO BORDERS -->
  <table border="0" cellspacing="0" cellpadding="0"
         style="width:100%; border:none; border-collapse:collapse; margin-bottom:4pt;">
    <tr>
      <td style="border:none; padding:0; width:50%; text-align:center;
                  font-size:8.5pt; font-style:italic; color:#aaaaaa; vertical-align:bottom;">
        [Sello Oficial]
      </td>
      <td style="border:none; padding:0; width:50%; text-align:center;
                  font-size:8.5pt; font-style:italic; color:#aaaaaa; vertical-align:bottom;">
        [Firma]
      </td>
    </tr>
  </table>

  <!-- Signer name (PDF: "- signerTitle -" centered, Helvetica-Bold 11pt) -->
  <p style="font-size:11pt; font-weight:bold; text-align:center; margin:2pt 0;">
    - ${signerTitle.toUpperCase()} -
  </p>

</div>

<!-- ══════════════════════════════════════════════
     FOOTER  (PDF: addFooter — separator + recipientTitle)
     ══════════════════════════════════════════════ -->
<hr style="border:none; border-top:0.8pt solid #000; margin:18pt 0 6pt 0;" />
${recipientTitle ? `<p style="font-size:10pt; margin:3pt 0;">${recipientTitle}</p>` : '<p style="font-size:10pt; margin:3pt 0;">Excmo. Sr. __________________.- Ciudad</p>'}

</body>
</html>`;
  }
}
