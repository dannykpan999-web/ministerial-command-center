import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AIDocumentGeneratorService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  /**
   * Generate a complete document from a prompt
   */
  async generateDocumentFromPrompt(
    documentType: string,
    prompt: string,
    tone: string = 'formal',
  ): Promise<{ content: string; title: string; metadata: any }> {
    if (!prompt || prompt.trim().length < 10) {
      throw new BadRequestException(
        'El prompt debe tener al menos 10 caracteres',
      );
    }

    // System prompts for different document types
    const systemPrompts: Record<string, string> = {
      RESPUESTA: `Eres un asistente especializado en redactar respuestas oficiales del Ministerio de Guinea Ecuatorial.

Genera respuestas formales, profesionales y apropiadas para contexto gubernamental. La estructura debe incluir:

1. Encabezado con membrete ministerial
2. Fecha y número de referencia
3. Destinatario
4. Saludo formal
5. Cuerpo del documento con párrafos bien estructurados
6. Despedida formal
7. Firma y cargo

Utiliza un lenguaje formal, respetuoso y profesional. Mantén la coherencia con el protocolo gubernamental de Guinea Ecuatorial.`,

      MEMORANDO: `Eres un asistente especializado en redactar memorandos internos del Ministerio de Guinea Ecuatorial.

Genera memorandos claros, concisos y profesionales. La estructura debe incluir:

1. MEMORANDO (como título)
2. Para: [Destinatario]
3. De: [Remitente]
4. Fecha: [Fecha actual]
5. Asunto: [Tema breve]
6. Cuerpo del memorando (párrafos claros y directos)
7. Firma y cargo

Utiliza un lenguaje directo pero profesional, apropiado para comunicaciones internas del gobierno.`,

      DECRETO: `Eres un asistente especializado en redactar decretos ministeriales del Ministerio de Guinea Ecuatorial.

Genera decretos formales con estructura legal apropiada. La estructura debe incluir:

1. Título: DECRETO MINISTERIAL Nº [número]
2. Considerandos: "VISTO:", "CONSIDERANDO:", "EN USO DE LAS FACULTADES:"
3. Artículos numerados (Artículo 1º, Artículo 2º, etc.)
4. Disposiciones finales
5. Firma del Ministro y sello oficial

Utiliza lenguaje legal formal, con terminología jurídica apropiada y estructura de decreto oficial.`,

      OFICIO: `Eres un asistente especializado en redactar oficios del Ministerio de Guinea Ecuatorial.

Genera oficios formales y profesionales. La estructura debe incluir:

1. Membrete ministerial
2. Número de oficio y fecha
3. Destinatario
4. Asunto
5. Saludo formal
6. Cuerpo del oficio (exposición clara y precisa)
7. Despedida formal
8. Firma y cargo

Utiliza un lenguaje formal, claro y respetuoso, apropiado para comunicaciones oficiales externas.`,

      RESOLUCION: `Eres un asistente especializado en redactar resoluciones ministeriales del Ministerio de Guinea Ecuatorial.

Genera resoluciones formales con estructura administrativa apropiada. La estructura debe incluir:

1. Título: RESOLUCIÓN MINISTERIAL Nº [número]
2. Fecha y lugar
3. Considerandos y fundamentos legales
4. Resuelve: (artículos numerados)
5. Disposiciones complementarias
6. Firma del Ministro

Utiliza lenguaje administrativo formal, con referencias a normativas y fundamentos legales apropiados.`,

      CARTA: `Eres un asistente especializado en redactar cartas oficiales del Ministerio de Guinea Ecuatorial.

Genera cartas formales y profesionales. La estructura debe incluir:

1. Membrete ministerial
2. Lugar y fecha
3. Destinatario (nombre, cargo, institución)
4. Saludo formal
5. Cuerpo de la carta (párrafos bien redactados)
6. Despedida cordial pero formal
7. Firma y cargo

Utiliza un lenguaje formal pero más cercano que un oficio, apropiado para relaciones institucionales.`,
    };

    const systemPrompt =
      systemPrompts[documentType] || systemPrompts.RESPUESTA;

    // Adjust temperature based on tone
    const temperature =
      tone === 'very_formal' ? 0.3 : tone === 'internal' ? 0.5 : 0.4;

    try {
      // Generate document content
      const contentResponse = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 2500,
        temperature: temperature,
      });

      const content =
        contentResponse.choices[0]?.message?.content?.trim() || '';

      if (!content || content.length < 50) {
        throw new BadRequestException(
          'No se pudo generar contenido válido. Por favor, intente con un prompt más específico.',
        );
      }

      // Generate title from content
      const titleResponse = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'Genera un título conciso y profesional para este documento oficial (máximo 10 palabras). Solo devuelve el título sin comillas ni puntos.',
          },
          {
            role: 'user',
            content: content.substring(0, 500),
          },
        ],
        max_tokens: 50,
        temperature: 0.3,
      });

      const title =
        titleResponse.choices[0]?.message?.content?.trim() ||
        'Documento Generado';

      // Calculate metadata
      const wordCount = content.split(/\s+/).length;
      const estimatedPages = Math.ceil(wordCount / 300);

      return {
        content,
        title,
        metadata: {
          wordCount,
          estimatedPages,
          documentType,
          tone,
          generatedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      console.error('Error generating document with AI:', error);

      if (error.response?.status === 429) {
        throw new BadRequestException(
          'Límite de solicitudes de IA excedido. Por favor, intente más tarde.',
        );
      }

      if (error.response?.status === 401) {
        throw new BadRequestException(
          'Error de autenticación con el servicio de IA. Contacte al administrador.',
        );
      }

      throw new BadRequestException(
        'Error al generar el documento con IA. Por favor, intente nuevamente.',
      );
    }
  }

  /**
   * Analyze an existing document and provide insights
   */
  async analyzeDocument(
    content: string,
    analysisType: string = 'executive_summary',
  ): Promise<{
    summary: string;
    keyTopics: string[];
    requiredActions: string[];
    urgencyLevel: string;
    stakeholders: string[];
    metadata: any;
  }> {
    if (!content || content.trim().length < 50) {
      throw new BadRequestException(
        'El documento debe tener al menos 50 caracteres para analizar',
      );
    }

    const systemPrompt = `Eres un analista experto en documentos gubernamentales de Guinea Ecuatorial.
Tu tarea es analizar documentos y proporcionar un resumen ejecutivo detallado.

Debes identificar y extraer:
1. Resumen ejecutivo (2-3 párrafos claros y concisos)
2. Temas clave (lista de temas principales mencionados)
3. Acciones requeridas (lista de acciones específicas que se deben tomar)
4. Nivel de urgencia (ALTA, MEDIA, BAJA)
5. Partes interesadas (personas, instituciones, ministerios mencionados)

Proporciona un análisis profesional, objetivo y útil para toma de decisiones rápida.`;

    try {
      const analysisResponse = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: `Analiza el siguiente documento y proporciona tu análisis en formato JSON con las siguientes claves:
            "summary" (string), "keyTopics" (array de strings), "requiredActions" (array de strings),
            "urgencyLevel" (string: "ALTA", "MEDIA", o "BAJA"), "stakeholders" (array de strings).\n\n
            Documento:\n${content}`,
          },
        ],
        max_tokens: 1500,
        temperature: 0.3,
      });

      const responseContent =
        analysisResponse.choices[0]?.message?.content?.trim() || '';

      if (!responseContent) {
        throw new BadRequestException('No se pudo generar el análisis');
      }

      // Try to parse JSON response
      let analysis: any;
      try {
        // Remove markdown code blocks if present
        const jsonContent = responseContent
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();
        analysis = JSON.parse(jsonContent);
      } catch (parseError) {
        // If JSON parsing fails, create a structured response from the text
        console.warn(
          'Could not parse AI response as JSON, using text format:',
          parseError,
        );
        analysis = {
          summary: responseContent,
          keyTopics: [],
          requiredActions: [],
          urgencyLevel: 'MEDIA',
          stakeholders: [],
        };
      }

      // Validate and ensure all fields are present
      const result = {
        summary: analysis.summary || responseContent,
        keyTopics: Array.isArray(analysis.keyTopics)
          ? analysis.keyTopics
          : [],
        requiredActions: Array.isArray(analysis.requiredActions)
          ? analysis.requiredActions
          : [],
        urgencyLevel:
          analysis.urgencyLevel &&
          ['ALTA', 'MEDIA', 'BAJA'].includes(analysis.urgencyLevel)
            ? analysis.urgencyLevel
            : 'MEDIA',
        stakeholders: Array.isArray(analysis.stakeholders)
          ? analysis.stakeholders
          : [],
        metadata: {
          analyzedAt: new Date().toISOString(),
          analysisType,
          contentLength: content.length,
          wordCount: content.split(/\s+/).length,
        },
      };

      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      console.error('Error analyzing document with AI:', error);

      if (error.response?.status === 429) {
        throw new BadRequestException(
          'Límite de solicitudes de IA excedido. Por favor, intente más tarde.',
        );
      }

      if (error.response?.status === 401) {
        throw new BadRequestException(
          'Error de autenticación con el servicio de IA. Contacte al administrador.',
        );
      }

      throw new BadRequestException(
        'Error al analizar el documento con IA. Por favor, intente nuevamente.',
      );
    }
  }

  /**
   * Validate that generated content meets minimum standards
   */
  validateGeneratedContent(content: string): boolean {
    if (!content || content.length < 50) {
      return false;
    }

    // Check for basic document structure (at least some paragraphs)
    const paragraphs = content.split('\n\n').filter((p) => p.trim().length > 0);
    if (paragraphs.length < 2) {
      return false;
    }

    return true;
  }
}
