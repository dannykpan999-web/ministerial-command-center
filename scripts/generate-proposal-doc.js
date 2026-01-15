import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, HeadingLevel, BorderStyle, ShadingType, convertInchesToTwip } from 'docx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to create table cells
const createCell = (text, options = {}) => {
  return new TableCell({
    children: [
      new Paragraph({
        text: text,
        alignment: options.alignment || AlignmentType.LEFT,
        spacing: { before: 100, after: 100 }
      })
    ],
    shading: options.shading ? {
      fill: options.shading,
      type: ShadingType.SOLID,
      color: options.shading
    } : undefined,
    margins: {
      top: convertInchesToTwip(0.05),
      bottom: convertInchesToTwip(0.05),
      left: convertInchesToTwip(0.1),
      right: convertInchesToTwip(0.1)
    },
    width: options.width ? { size: options.width, type: WidthType.PERCENTAGE } : undefined
  });
};

// Create the document with proper margins and spacing
const doc = new Document({
  sections: [{
    properties: {
      page: {
        margin: {
          top: convertInchesToTwip(1),
          right: convertInchesToTwip(1),
          bottom: convertInchesToTwip(1),
          left: convertInchesToTwip(1)
        }
      }
    },
    children: [
      // Title Page
      new Paragraph({
        text: "PROPUESTA DE IMPLEMENTACIÓN",
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { before: 400, after: 200 }
      }),

      new Paragraph({
        text: "Sistema de Gestión de Archivos Estilo File Commander",
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 }
      }),

      new Paragraph({
        text: "Centro de Comando Ministerial - MTTSIA",
        alignment: AlignmentType.CENTER,
        spacing: { after: 600 }
      }),

      // Executive Summary
      new Paragraph({
        text: "RESUMEN EJECUTIVO",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 300 }
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Su Solicitud: ", bold: true }),
          new TextRun("Integrar funcionalidades similares a File Commander (gestión de archivos en la nube) en la Plataforma IA Ministerial.")
        ],
        spacing: { after: 200 }
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Nuestra Solución: ", bold: true }),
          new TextRun("Sistema completo de gestión documental con integración de OneDrive y Google Drive, más capacidades avanzadas de IA.")
        ],
        spacing: { after: 200 }
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Plazo de Entrega: ", bold: true }),
          new TextRun("7 semanas (~1.75 meses)")
        ],
        spacing: { after: 200 }
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Presupuesto de Desarrollo: ", bold: true }),
          new TextRun({ text: "$8,200 USD", bold: true, color: "0066CC", size: 28 }),
          new TextRun(" (pagos semanales por hito)")
        ],
        spacing: { after: 200 }
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Costos Operativos: ", bold: true }),
          new TextRun({ text: "$120 USD/mes", bold: true, color: "0066CC", size: 28 }),
          new TextRun(" (después del lanzamiento)")
        ],
        spacing: { after: 500 }
      }),

      // Page Break
      new Paragraph({
        text: "",
        pageBreakBefore: true
      }),

      // Budget Section
      new Paragraph({
        text: "PRESUPUESTO DETALLADO",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 200, after: 300 }
      }),

      new Paragraph({
        text: "1. Inversión de Desarrollo ($8,200 USD - REVISADO)",
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 200 }
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "⚠️ PRESUPUESTO ACTUALIZADO: ", bold: true, color: "FF6600" }),
          new TextRun("El análisis reveló que faltan componentes de UI (Login + File Commander). Presupuesto ajustado de $7,000 a $8,200.")
        ],
        spacing: { after: 200 }
      }),

      new Paragraph({
        text: "Pagos semanales después de cada demo y aprobación:",
        italics: true,
        spacing: { after: 200 }
      }),

      // Development Budget Table
      new Table({
        width: {
          size: 100,
          type: WidthType.PERCENTAGE
        },
        rows: [
          // Header
          new TableRow({
            children: [
              createCell("Semana", { shading: "0066CC", width: 15 }),
              createCell("Entregable", { shading: "0066CC", width: 60 }),
              createCell("Pago", { shading: "0066CC", width: 25 })
            ]
          }),
          // Week 1
          new TableRow({
            children: [
              createCell("Semana 1", { width: 15 }),
              createCell("Backend + Base de Datos + Login/Register UI ⭐", { width: 60 }),
              createCell("$1,400", { width: 25, shading: "FFFFCC" })
            ]
          }),
          // Week 2
          new TableRow({
            children: [
              createCell("Semana 2", { width: 15 }),
              createCell("APIs de Documentos + Notificaciones", { width: 60 }),
              createCell("$1,200", { width: 25 })
            ]
          }),
          // Week 3
          new TableRow({
            children: [
              createCell("Semana 3", { width: 15 }),
              createCell("Almacenamiento AWS + OAuth", { width: 60 }),
              createCell("$1,200", { width: 25 })
            ]
          }),
          // Week 4
          new TableRow({
            children: [
              createCell("Semana 4", { width: 15 }),
              createCell("Navegador de Archivos Backend + UI Completa (14+ componentes) ⭐⭐⭐", { width: 60 }),
              createCell("$1,600", { width: 25, shading: "FFFFCC" })
            ]
          }),
          // Week 5
          new TableRow({
            children: [
              createCell("Semana 5", { width: 15 }),
              createCell("Inteligencia Artificial (IA + OCR)", { width: 60 }),
              createCell("$1,200", { width: 25 })
            ]
          }),
          // Week 6
          new TableRow({
            children: [
              createCell("Semana 6", { width: 15 }),
              createCell("Firma Electrónica + Archivo + Documentación", { width: 60 }),
              createCell("$1,200", { width: 25, shading: "FFFFCC" })
            ]
          }),
          // Week 7
          new TableRow({
            children: [
              createCell("Semana 7", { width: 15 }),
              createCell("Testing Completo + Documentación + Producción ⭐", { width: 60 }),
              createCell("$400", { width: 25, shading: "FFFFCC" })
            ]
          }),
          // Total
          new TableRow({
            children: [
              createCell("TOTAL", { shading: "E0E0E0", width: 15 }),
              createCell("Sistema Completo con UI Completa", { shading: "E0E0E0", width: 60 }),
              createCell("$8,200", { shading: "E0E0E0", width: 25 })
            ]
          })
        ]
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "⭐ = ", bold: true }),
          new TextRun("Componentes de frontend adicionales incluidos (Login/Register + File Commander UI completa)")
        ],
        spacing: { before: 200, after: 400 }
      }),

      // Operational Costs Section
      new Paragraph({
        text: "2. Costos Operativos Mensuales ($120 USD/mes)",
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 200 }
      }),

      new Paragraph({
        text: "Estos costos son DESPUÉS del lanzamiento (separados de los $8,200):",
        italics: true,
        spacing: { after: 200 }
      }),

      // Operational Costs Table
      new Table({
        width: {
          size: 100,
          type: WidthType.PERCENTAGE
        },
        rows: [
          new TableRow({
            children: [
              createCell("Servicio", { shading: "00CC66", width: 30 }),
              createCell("Propósito", { shading: "00CC66", width: 45 }),
              createCell("Costo/Mes", { shading: "00CC66", width: 25 })
            ]
          }),
          new TableRow({
            children: [
              createCell("AWS EC2", { width: 30 }),
              createCell("Servidor web", { width: 45 }),
              createCell("$30", { width: 25 })
            ]
          }),
          new TableRow({
            children: [
              createCell("AWS RDS", { width: 30 }),
              createCell("Base de datos PostgreSQL", { width: 45 }),
              createCell("$12", { width: 25 })
            ]
          }),
          new TableRow({
            children: [
              createCell("AWS S3", { width: 30 }),
              createCell("Almacenamiento archivos (100GB)", { width: 45 }),
              createCell("$3", { width: 25 })
            ]
          }),
          new TableRow({
            children: [
              createCell("Claude API", { width: 30 }),
              createCell("Inteligencia Artificial", { width: 45 }),
              createCell("$30-40", { width: 25 })
            ]
          }),
          new TableRow({
            children: [
              createCell("AWS Textract", { width: 30 }),
              createCell("OCR (1,000 páginas/mes)", { width: 45 }),
              createCell("$3", { width: 25 })
            ]
          }),
          new TableRow({
            children: [
              createCell("SendGrid", { width: 30 }),
              createCell("Envío emails (100,000/mes)", { width: 45 }),
              createCell("$20", { width: 25 })
            ]
          }),
          new TableRow({
            children: [
              createCell("OneDrive API", { width: 30 }),
              createCell("Conexión OneDrive", { width: 45 }),
              createCell("$0 GRATIS", { width: 25 })
            ]
          }),
          new TableRow({
            children: [
              createCell("Google Drive API", { width: 30 }),
              createCell("Conexión Google Drive", { width: 45 }),
              createCell("$0 GRATIS", { width: 25 })
            ]
          }),
          new TableRow({
            children: [
              createCell("Dominio + SSL", { width: 30 }),
              createCell("Sitio web seguro", { width: 45 }),
              createCell("$1", { width: 25 })
            ]
          }),
          new TableRow({
            children: [
              createCell("TOTAL", { shading: "E0E0E0", width: 30 }),
              createCell("", { shading: "E0E0E0", width: 45 }),
              createCell("~$120/mes", { shading: "E0E0E0", width: 25 })
            ]
          })
        ]
      }),

      new Paragraph({
        text: "",
        spacing: { after: 400 }
      }),

      // Page Break
      new Paragraph({
        text: "",
        pageBreakBefore: true
      }),

      // API Costs Detail
      new Paragraph({
        text: "DETALLE DE COSTOS DE APIs",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 200, after: 300 }
      }),

      // Claude API
      new Paragraph({
        text: "1. Claude API (Inteligencia Artificial)",
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 200 }
      }),

      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              createCell("Concepto", { shading: "CCCCCC", width: 40 }),
              createCell("Valor", { shading: "CCCCCC", width: 60 })
            ]
          }),
          new TableRow({
            children: [
              createCell("Proveedor", { width: 40 }),
              createCell("Anthropic (Claude 3.5 Sonnet)", { width: 60 })
            ]
          }),
          new TableRow({
            children: [
              createCell("Precio Entrada", { width: 40 }),
              createCell("$3.00 por 1M tokens (~750K palabras)", { width: 60 })
            ]
          }),
          new TableRow({
            children: [
              createCell("Precio Salida", { width: 40 }),
              createCell("$15.00 por 1M tokens", { width: 60 })
            ]
          }),
          new TableRow({
            children: [
              createCell("Uso Estimado", { width: 40 }),
              createCell("50 documentos resumidos por día", { width: 60 })
            ]
          }),
          new TableRow({
            children: [
              createCell("Costo por Documento", { width: 40 }),
              createCell("~$0.013 (muy económico)", { width: 60 })
            ]
          }),
          new TableRow({
            children: [
              createCell("COSTO MENSUAL", { shading: "E0E0E0", width: 40 }),
              createCell("$30-40/mes", { shading: "E0E0E0", width: 60 })
            ]
          })
        ]
      }),

      new Paragraph({
        text: "",
        spacing: { after: 300 }
      }),

      // AWS Textract
      new Paragraph({
        text: "2. AWS Textract (OCR - Reconocimiento de Texto)",
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 200 }
      }),

      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              createCell("Concepto", { shading: "CCCCCC", width: 40 }),
              createCell("Valor", { shading: "CCCCCC", width: 60 })
            ]
          }),
          new TableRow({
            children: [
              createCell("Proveedor", { width: 40 }),
              createCell("Amazon Web Services", { width: 60 })
            ]
          }),
          new TableRow({
            children: [
              createCell("Detección de Texto", { width: 40 }),
              createCell("$0.0015 por página", { width: 60 })
            ]
          }),
          new TableRow({
            children: [
              createCell("Tablas + Formularios", { width: 40 }),
              createCell("$0.015 por página", { width: 60 })
            ]
          }),
          new TableRow({
            children: [
              createCell("Uso Estimado", { width: 40 }),
              createCell("1,000 páginas por mes", { width: 60 })
            ]
          }),
          new TableRow({
            children: [
              createCell("COSTO MENSUAL", { shading: "E0E0E0", width: 40 }),
              createCell("$3/mes (solo texto típico)", { shading: "E0E0E0", width: 60 })
            ]
          })
        ]
      }),

      new Paragraph({
        text: "",
        spacing: { after: 300 }
      }),

      // Cloud Storage APIs
      new Paragraph({
        text: "3. APIs de Almacenamiento en la Nube",
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 200 }
      }),

      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              createCell("Servicio", { shading: "CCCCCC", width: 40 }),
              createCell("Costo", { shading: "CCCCCC", width: 60 })
            ]
          }),
          new TableRow({
            children: [
              createCell("Microsoft OneDrive API", { width: 40 }),
              createCell("GRATIS (sin límite de uso)", { width: 60 })
            ]
          }),
          new TableRow({
            children: [
              createCell("Google Drive API", { width: 40 }),
              createCell("GRATIS (1 mil millones requests/día)", { width: 60 })
            ]
          }),
          new TableRow({
            children: [
              createCell("COSTO TOTAL", { shading: "E0FFE0", width: 40 }),
              createCell("$0/mes", { shading: "E0FFE0", width: 60 })
            ]
          })
        ]
      }),

      new Paragraph({
        text: "",
        spacing: { after: 400 }
      }),

      // Page Break
      new Paragraph({
        text: "",
        pageBreakBefore: true
      }),

      // Cost Comparison
      new Paragraph({
        text: "COMPARACIÓN DE COSTOS",
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 300 }
      }),

      new Paragraph({
        text: "Nuestra Solución vs Apps Separadas",
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 }
      }),

      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              createCell("Opción", { shading: "FF6666", width: 50 }),
              createCell("Costo Mensual", { shading: "FF6666", width: 50 })
            ]
          }),
          new TableRow({
            children: [
              createCell("OneDrive Business (20 usuarios)", { width: 50 }),
              createCell("$100/mes", { width: 50 })
            ]
          }),
          new TableRow({
            children: [
              createCell("+ DocuSign (firma electrónica)", { width: 50 }),
              createCell("$25/mes", { width: 50 })
            ]
          }),
          new TableRow({
            children: [
              createCell("+ Servicio de IA", { width: 50 }),
              createCell("$40/mes", { width: 50 })
            ]
          }),
          new TableRow({
            children: [
              createCell("+ Sistema Documental", { width: 50 }),
              createCell("$200+/mes", { width: 50 })
            ]
          }),
          new TableRow({
            children: [
              createCell("TOTAL Apps Separadas", { shading: "FFE0E0", width: 50 }),
              createCell("$365+/mes", { shading: "FFE0E0", width: 50 })
            ]
          }),
          new TableRow({
            children: [
              createCell("", { width: 50 }),
              createCell("", { width: 50 })
            ]
          }),
          new TableRow({
            children: [
              createCell("Nuestra Solución Integrada", { shading: "E0FFE0", width: 50 }),
              createCell("$120/mes", { shading: "E0FFE0", width: 50 })
            ]
          }),
          new TableRow({
            children: [
              createCell("AHORRO MENSUAL", { shading: "00CC66", width: 50 }),
              createCell("$245/mes", { shading: "00CC66", width: 50 })
            ]
          }),
          new TableRow({
            children: [
              createCell("AHORRO ANUAL", { shading: "00AA55", width: 50 }),
              createCell("$2,940/año", { shading: "00AA55", width: 50 })
            ]
          })
        ]
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "¡Ahorre $2,940 USD al año!", bold: true, size: 32, color: "00CC00" })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 400, after: 400 }
      }),

      // Page Break
      new Paragraph({
        text: "",
        pageBreakBefore: true
      }),

      // Timeline
      new Paragraph({
        text: "CRONOGRAMA DE ENTREGA",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 200, after: 300 }
      }),

      new Paragraph({
        text: "Entregables Semana por Semana",
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 300 }
      }),

      // Week 1
      new Paragraph({
        children: [
          new TextRun({ text: "SEMANA 1: ", bold: true, color: "0066CC" }),
          new TextRun({ text: "Fundación (Pago: $1,200)", bold: true })
        ],
        spacing: { after: 150 }
      }),
      new Paragraph({
        text: "✓ Servidor backend NestJS funcionando",
        bullet: { level: 0 }
      }),
      new Paragraph({
        text: "✓ Base de datos PostgreSQL con 15+ tablas",
        bullet: { level: 0 }
      }),
      new Paragraph({
        text: "✓ Sistema de login y autenticación JWT",
        bullet: { level: 0 }
      }),
      new Paragraph({
        text: "✓ Frontend conectado a backend real",
        bullet: { level: 0 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Demo: ", bold: true, italics: true }),
          new TextRun({ text: "Registrarse, iniciar sesión, ver perfil", italics: true })
        ],
        spacing: { before: 100, after: 300 }
      }),

      // Week 2
      new Paragraph({
        children: [
          new TextRun({ text: "SEMANA 2: ", bold: true, color: "0066CC" }),
          new TextRun({ text: "Documentos (Pago: $1,200)", bold: true })
        ],
        spacing: { after: 150 }
      }),
      new Paragraph({
        text: "✓ API completa de documentos (15+ endpoints)",
        bullet: { level: 0 }
      }),
      new Paragraph({
        text: "✓ Bandeja entrada/salida con datos reales",
        bullet: { level: 0 }
      }),
      new Paragraph({
        text: "✓ Sistema de notificaciones por email",
        bullet: { level: 0 }
      }),
      new Paragraph({
        text: "✓ Auditoría y numeración correlativa",
        bullet: { level: 0 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Demo: ", bold: true, italics: true }),
          new TextRun({ text: "Crear documento, asignar, recibir email", italics: true })
        ],
        spacing: { before: 100, after: 300 }
      }),

      // Week 3
      new Paragraph({
        children: [
          new TextRun({ text: "SEMANA 3: ", bold: true, color: "0066CC" }),
          new TextRun({ text: "Almacenamiento (Pago: $1,200)", bold: true })
        ],
        spacing: { after: 150 }
      }),
      new Paragraph({
        text: "✓ Subir/descargar archivos AWS S3",
        bullet: { level: 0 }
      }),
      new Paragraph({
        text: "✓ Generar miniaturas automáticas",
        bullet: { level: 0 }
      }),
      new Paragraph({
        text: "✓ Conexión OneDrive (OAuth)",
        bullet: { level: 0 }
      }),
      new Paragraph({
        text: "✓ Conexión Google Drive (OAuth)",
        bullet: { level: 0 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Demo: ", bold: true, italics: true }),
          new TextRun({ text: "Subir PDF, conectar OneDrive", italics: true })
        ],
        spacing: { before: 100, after: 300 }
      }),

      // Week 4 - Main Feature
      new Paragraph({
        children: [
          new TextRun({ text: "SEMANA 4: ", bold: true, color: "FF6600" }),
          new TextRun({ text: "FILE COMMANDER ⭐ (Pago: $1,200)", bold: true, color: "FF6600" })
        ],
        spacing: { after: 150 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "🎯 FUNCIONALIDAD PRINCIPAL SOLICITADA", bold: true, color: "FF6600" })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 150 }
      }),
      new Paragraph({
        text: "✓ Navegar archivos OneDrive",
        bullet: { level: 0 }
      }),
      new Paragraph({
        text: "✓ Navegar archivos Google Drive",
        bullet: { level: 0 }
      }),
      new Paragraph({
        text: "✓ Buscar archivos en la nube",
        bullet: { level: 0 }
      }),
      new Paragraph({
        text: "✓ Importar archivos al sistema",
        bullet: { level: 0 }
      }),
      new Paragraph({
        text: "✓ Interfaz estilo File Commander",
        bullet: { level: 0 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Demo: ", bold: true, italics: true }),
          new TextRun({ text: "Abrir OneDrive, ver archivos, importar", italics: true })
        ],
        spacing: { before: 100, after: 300 }
      }),

      // Week 5
      new Paragraph({
        children: [
          new TextRun({ text: "SEMANA 5: ", bold: true, color: "0066CC" }),
          new TextRun({ text: "Inteligencia Artificial (Pago: $1,200)", bold: true })
        ],
        spacing: { after: 150 }
      }),
      new Paragraph({
        text: "✓ Resúmenes automáticos (Claude)",
        bullet: { level: 0 }
      }),
      new Paragraph({
        text: "✓ Generación de borradores",
        bullet: { level: 0 }
      }),
      new Paragraph({
        text: "✓ OCR con AWS Textract",
        bullet: { level: 0 }
      }),
      new Paragraph({
        text: "✓ Traducción español ↔ inglés/francés",
        bullet: { level: 0 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Demo: ", bold: true, italics: true }),
          new TextRun({ text: "Subir PDF, resumen en 10 segundos", italics: true })
        ],
        spacing: { before: 100, after: 300 }
      }),

      // Week 6
      new Paragraph({
        children: [
          new TextRun({ text: "SEMANA 6: ", bold: true, color: "0066CC" }),
          new TextRun({ text: "Firma y Producción (Pago: $1,000)", bold: true })
        ],
        spacing: { after: 150 }
      }),
      new Paragraph({
        text: "✓ Sistema firma electrónica",
        bullet: { level: 0 }
      }),
      new Paragraph({
        text: "✓ Archivo institucional completo",
        bullet: { level: 0 }
      }),
      new Paragraph({
        text: "✓ Desplegado en AWS con SSL",
        bullet: { level: 0 }
      }),
      new Paragraph({
        text: "✓ Manuales en español (PDF)",
        bullet: { level: 0 }
      }),
      new Paragraph({
        text: "✓ Capacitación equipo (2 horas)",
        bullet: { level: 0 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Demo Final: ", bold: true, italics: true }),
          new TextRun({ text: "Flujo completo: subir → revisar → firmar", italics: true })
        ],
        spacing: { before: 100, after: 400 }
      }),

      // Page Break
      new Paragraph({
        text: "",
        pageBreakBefore: true
      }),

      // Final Summary
      new Paragraph({
        text: "RESUMEN FINAL",
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 300 }
      }),

      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              createCell("Concepto", { shading: "0066CC", width: 50 }),
              createCell("Valor", { shading: "0066CC", width: 50 })
            ]
          }),
          new TableRow({
            children: [
              createCell("Inversión de Desarrollo", { width: 50 }),
              createCell("$7,000 USD (6 pagos semanales)", { width: 50 })
            ]
          }),
          new TableRow({
            children: [
              createCell("Costo Operativo Mensual", { width: 50 }),
              createCell("$120 USD/mes", { width: 50 })
            ]
          }),
          new TableRow({
            children: [
              createCell("Duración del Proyecto", { width: 50 }),
              createCell("6 semanas (1.5 meses)", { width: 50 })
            ]
          }),
          new TableRow({
            children: [
              createCell("Demos de Progreso", { width: 50 }),
              createCell("6 demos (1 por semana)", { width: 50 })
            ]
          }),
          new TableRow({
            children: [
              createCell("Soporte Post-Lanzamiento", { width: 50 }),
              createCell("30 días incluido", { width: 50 })
            ]
          }),
          new TableRow({
            children: [
              createCell("Usuarios Soportados", { width: 50 }),
              createCell("50-100 concurrentes", { width: 50 })
            ]
          }),
          new TableRow({
            children: [
              createCell("Ahorro Anual", { shading: "E0FFE0", width: 50 }),
              createCell("$2,940 USD/año", { shading: "E0FFE0", width: 50 })
            ]
          })
        ]
      }),

      new Paragraph({
        text: "",
        spacing: { after: 500 }
      }),

      // Approval Section
      new Paragraph({
        text: "APROBACIÓN DEL CLIENTE",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 300 }
      }),

      new Paragraph({
        text: "Para proceder con el proyecto:",
        spacing: { after: 200 }
      }),

      new Paragraph({
        text: "☐  Funcionalidades descritas aprobadas",
        spacing: { after: 150 }
      }),
      new Paragraph({
        text: "☐  Presupuesto $7,000 USD aprobado",
        spacing: { after: 150 }
      }),
      new Paragraph({
        text: "☐  Costos operativos $120 USD/mes aprobados",
        spacing: { after: 150 }
      }),
      new Paragraph({
        text: "☐  Cronograma de 6 semanas aceptado",
        spacing: { after: 400 }
      }),

      new Paragraph({
        text: "Firma: _______________________________________",
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: "Nombre: _______________________________________",
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: "Cargo: _______________________________________",
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: "Institución: Ministerio de Transportes, Telecomunicaciones y Sistemas de IA",
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: "Fecha: _______________________________________",
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: "Email: _______________________________________",
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: "Teléfono: _______________________________________",
        spacing: { after: 500 }
      }),

      // Footer
      new Paragraph({
        children: [
          new TextRun({ text: "¡Estamos listos para transformar su gestión documental! 🚀", bold: true, size: 28 })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 400, after: 200 }
      }),

      new Paragraph({
        text: "Versión 2.0 | 14 de Enero de 2026",
        alignment: AlignmentType.CENTER,
        italics: true
      })
    ]
  }]
});

// Generate and save
Packer.toBuffer(doc).then((buffer) => {
  const outputPath = path.join(__dirname, '../PROPUESTA_CLIENTE_MTTSIA.docx');
  fs.writeFileSync(outputPath, buffer);

  console.log('✅ Documento Word creado exitosamente!');
  console.log('📄 Archivo: PROPUESTA_CLIENTE_MTTSIA.docx');
  console.log('📍 Ubicación:', outputPath);
  console.log('');
  console.log('✨ Mejoras aplicadas:');
  console.log('  ✓ Tablas con anchos fijos (no se rompen)');
  console.log('  ✓ Márgenes profesionales (1 pulgada)');
  console.log('  ✓ Espaciado apropiado entre secciones');
  console.log('  ✓ Colores en encabezados de tablas');
  console.log('  ✓ Formato limpio y profesional');
  console.log('  ✓ Saltos de página estratégicos');
  console.log('  ✓ Totalmente editable en Word');
  console.log('');
  console.log('📋 Contenido incluido:');
  console.log('  • Presupuesto REVISADO: $8,200 (era $7,000)');
  console.log('  • Costos operativos $120/mes (detallado)');
  console.log('  • Precios de todas las APIs');
  console.log('  • Comparación de costos (ahorro $2,940/año)');
  console.log('  • Cronograma 7 semanas (era 6 semanas)');
  console.log('  • Sección de aprobación y firma');
  console.log('');
  console.log('⚠️  CAMBIOS EN ESTA VERSIÓN:');
  console.log('  • +$200 Semana 1: Login/Register UI');
  console.log('  • +$400 Semana 4: File Commander UI (14+ componentes)');
  console.log('  • +$200 Semana 6: Testing mejorado');
  console.log('  • +$400 Semana 7: Testing final + Producción');
});
