import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useMutation, useQuery } from '@tanstack/react-query';
import { documentsApi } from '@/lib/api/documents.api';
import { entitiesApi } from '@/lib/api/entities.api';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Bot,
  Send,
  FileText,
  Sparkles,
  ListChecks,
  Languages,
  FileEdit,
  AlertTriangle,
  Copy,
  Plus,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { delay } from '@/lib/mockData';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  title?: string;
  sources?: { title: string; id: string }[];
  metadata?: any;
}

const modes = [
  { id: 'summarize', label: 'Resumir', icon: Sparkles },
  { id: 'draft', label: 'Redactar respuesta', icon: FileEdit },
  { id: 'keypoints', label: 'Puntos clave', icon: ListChecks },
  { id: 'translate', label: 'Traducir', icon: Languages },
  { id: 'memo', label: 'Preparar memo', icon: FileText },
];

const tones = [
  { id: 'formal', label: 'Formal' },
  { id: 'very_formal', label: 'Muy formal' },
  { id: 'internal', label: 'Nota interna' },
];

const documentTypes = [
  { id: 'RESPUESTA', label: 'Respuesta a Oficio' },
  { id: 'MEMORANDO', label: 'Memorando Interno' },
  { id: 'DECRETO', label: 'Decreto Ministerial' },
  { id: 'OFICIO', label: 'Oficio' },
  { id: 'RESOLUCION', label: 'Resolución' },
  { id: 'CARTA', label: 'Carta Oficial' },
];

export default function AIAssistant() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hola, soy tu asistente de inteligencia artificial. ¿En qué puedo ayudarte hoy?\n\nPuedo ayudarte a:\n- Generar documentos oficiales (Respuestas, Memorandos, Decretos, etc.)\n- Resumir documentos existentes\n- Redactar respuestas oficiales\n- Extraer puntos clave\n\nSelecciona un tipo de documento y describe lo que necesitas generar.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [documentType, setDocumentType] = useState<string>('RESPUESTA');
  const [tone, setTone] = useState('formal');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch entities for document creation
  const { data: entitiesData, isLoading: isLoadingEntities, error: entitiesError } = useQuery({
    queryKey: ['entities'],
    queryFn: () => entitiesApi.getAll(),
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Log entities loading errors
  useEffect(() => {
    if (entitiesError) {
      console.error('Error loading entities:', entitiesError);
      toast.error('Error al cargar entidades. Algunas funciones pueden no estar disponibles.');
    }
  }, [entitiesError]);

  // Mutation for generating document from prompt
  const generateMutation = useMutation({
    mutationFn: async (prompt: string) => {
      return documentsApi.generateFromPrompt({
        documentType,
        prompt,
        tone,
        language: 'es',
      });
    },
    onSuccess: (data) => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content,
        title: data.title,
        metadata: data.metadata,
      };
      setMessages(prev => [...prev, aiMessage]);
      setLoading(false);
    },
    onError: (error: any) => {
      console.error('Error generating document:', error);
      const errorMessage = error.response?.data?.message || 'Error al generar documento. Por favor, intente nuevamente.';
      toast.error(errorMessage);
      setLoading(false);
    },
  });

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: `[${documentTypes.find(dt => dt.id === documentType)?.label}] ${input}`,
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    // Call real API
    generateMutation.mutate(currentInput);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = async (content: string) => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(content);
        toast.success('Texto copiado al portapapeles');
        return;
      }
    } catch (clipboardError) {
      console.log('Modern clipboard API failed, trying fallback:', clipboardError);
    }

    // Fallback for older browsers or HTTP (non-HTTPS)
    try {
      const textArea = window.document.createElement('textarea');
      textArea.value = content;

      // Make textarea visible but out of viewport
      textArea.style.position = 'absolute';
      textArea.style.left = '-9999px';
      textArea.style.top = '0';
      textArea.style.opacity = '0';

      window.document.body.appendChild(textArea);

      // Select the text
      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, content.length);

      // Execute copy command
      const successful = window.document.execCommand('copy');

      // Remove textarea
      window.document.body.removeChild(textArea);

      if (successful) {
        toast.success('Texto copiado al portapapeles');
      } else {
        toast.error('Error al copiar texto. Por favor, intente copiar manualmente.');
      }
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error('Error al copiar texto. Por favor, intente copiar manualmente.');
    }
  };

  const handleSaveDocument = async (message: Message) => {
    try {
      if (!user) {
        toast.error('Usuario no autenticado. Por favor, inicie sesión nuevamente.');
        return;
      }

      if (isLoadingEntities) {
        toast.error('Cargando entidades. Por favor, espere un momento.');
        return;
      }

      if (!entitiesData || entitiesData.length === 0) {
        toast.error('No hay entidades disponibles. Contacte al administrador.');
        return;
      }

      // Get the first entity as default
      const defaultEntity = entitiesData[0];

      // Create document as DRAFT
      const documentData = {
        title: message.title || 'Documento Generado por IA',
        type: documentType,
        direction: 'OUT' as const,
        classification: 'EXTERNAL' as const,
        entityId: defaultEntity.id,
        responsibleId: user.id,
        content: message.content,
        isDraft: true,
        priority: 'MEDIUM' as const,
        tags: ['AI-Generated', documentType],
      };

      const result = await documentsApi.create(documentData);

      toast.success(
        `Documento guardado como borrador con ID: ${result.documentNumber || 'N/A'}`,
        {
          description: 'Puede editarlo desde la sección de documentos',
          duration: 5000,
        }
      );
    } catch (error: any) {
      console.error('Error saving document:', error);
      toast.error(
        error.response?.data?.message || 'Error al guardar el documento'
      );
    }
  };

  const handleDownloadPDF = (message: Message) => {
    try {
      // Create PDF using jsPDF
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Add title
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(message.title || 'Documento Generado por IA', 20, 20);

      // Add metadata
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Tipo: ${documentTypes.find(dt => dt.id === documentType)?.label}`, 20, 30);
      doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, 20, 35);

      if (message.metadata) {
        doc.text(`Palabras: ${message.metadata.wordCount || 'N/A'}`, 20, 40);
        doc.text(`Páginas estimadas: ${message.metadata.estimatedPages || 'N/A'}`, 20, 45);
      }

      // Add content
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');

      // Split content into lines
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - (margin * 2);
      const lines = doc.splitTextToSize(message.content, maxWidth);

      let yPosition = 55;
      const lineHeight = 7;
      const pageHeight = doc.internal.pageSize.getHeight();

      lines.forEach((line: string) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, margin, yPosition);
        yPosition += lineHeight;
      });

      // Save PDF
      const filename = `${message.title?.replace(/\s+/g, '_') || 'documento'}_${Date.now()}.pdf`;
      doc.save(filename);

      toast.success('PDF descargado correctamente');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Error al generar el PDF');
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] max-w-7xl mx-auto animate-fade-in">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col p-6">
        <PageHeader
          title={t('ai.title')}
          description={t('ai.description')}
        />

        {/* Document Type Selector */}
        <div className="mb-4">
          <Label className="text-sm font-medium mb-2 block">Tipo de Documento</Label>
          <Select value={documentType} onValueChange={setDocumentType}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {documentTypes.map(type => (
                <SelectItem key={type.id} value={type.id}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={cn(
                'chat-message',
                message.role === 'user' ? 'chat-message-user' : 'chat-message-ai'
              )}
            >
              <div className={cn(
                'h-8 w-8 rounded-lg flex items-center justify-center shrink-0',
                message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-accent'
              )}>
                {message.role === 'user' ? 'TÚ' : <Bot className="h-4 w-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                </div>
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs font-medium text-muted-foreground mb-2">{t('ai.sources')}:</p>
                    <div className="flex flex-wrap gap-2">
                      {message.sources.map(source => (
                        <Badge key={source.id} variant="outline" className="text-xs cursor-pointer hover:bg-muted">
                          <FileText className="h-3 w-3 mr-1" />
                          {source.title}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {message.role === 'assistant' && message.id !== '1' && message.content && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(message.content)}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copiar
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleSaveDocument(message)}
                      disabled={isLoadingEntities || !entitiesData || entitiesData.length === 0}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {isLoadingEntities ? 'Cargando...' : 'Guardar como Documento'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadPDF(message)}
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      Descargar PDF
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="chat-message chat-message-ai">
              <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
              <div className="flex-1">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/30 animate-pulse-soft" />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/30 animate-pulse-soft" style={{ animationDelay: '0.2s' }} />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/30 animate-pulse-soft" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Warning Banner */}
        <div className="flex items-center gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg mb-4">
          <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
          <p className="text-sm text-warning">{t('ai.review_warning')}</p>
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <Textarea
            placeholder="Ej: Generar respuesta oficial sobre solicitud de información presupuestaria del Ministerio de Educación..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-12 max-h-32 resize-none"
            rows={1}
          />
          <Button onClick={handleSend} disabled={loading || !input.trim()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Right Panel - Settings */}
      <div className="w-72 border-l p-4 space-y-6 hidden lg:block">
        <div className="space-y-3">
          <Label className="text-sm font-medium">{t('ai.tone')}</Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tones.map(t => (
                <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Documentos vinculados</Label>
          <Card>
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">ENT-2024-001542</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">EXP-2024-00342</span>
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-2">
                <Plus className="h-4 w-4 mr-1" />
                Añadir documento
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
