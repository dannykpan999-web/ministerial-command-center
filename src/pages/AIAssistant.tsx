import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
  sources?: { title: string; id: string }[];
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

export default function AIAssistant() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hola, soy tu asistente de inteligencia artificial. ¿En qué puedo ayudarte hoy?\n\nPuedo ayudarte a:\n- Resumir documentos\n- Redactar respuestas oficiales\n- Extraer puntos clave\n- Traducir contenido\n- Preparar memorandos',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [tone, setTone] = useState('formal');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() && !selectedMode) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: selectedMode 
        ? `[Modo: ${modes.find(m => m.id === selectedMode)?.label}] ${input}`
        : input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSelectedMode(null);
    setLoading(true);

    // Simulate AI response
    await delay(1500);

    const responses: Record<string, string> = {
      summarize: `**Resumen del documento**\n\nEl documento presenta una solicitud formal de Terminal Marítima S.A. para la ampliación del plazo de concesión portuaria.\n\n**Puntos principales:**\n1. La solicitud se basa en inversiones de USD 45 millones realizadas entre 2022-2024\n2. Se solicita una extensión de 15 años adicionales\n3. Se comprometen a mejoras de infraestructura adicionales\n\n**Recomendación:** Revisar con el departamento legal antes de proceder.`,
      draft: `**Borrador de respuesta**\n\n---\n\nEstimados señores de Terminal Marítima S.A.,\n\nAcusamos recibo de su comunicación de fecha [fecha], referente a la solicitud de ampliación de la concesión portuaria.\n\nAl respecto, informamos que su solicitud ha sido recibida y será evaluada por las instancias técnicas correspondientes en un plazo de [XX] días hábiles.\n\nQuedamos a su disposición para cualquier consulta adicional.\n\nAtentamente,\n\n[Firma]`,
      keypoints: `**Puntos clave extraídos:**\n\n✓ **Inversión realizada:** USD 45 millones (2022-2024)\n✓ **Solicitud:** Ampliación de concesión\n✓ **Justificación:** Inversiones adicionales\n✓ **Plazo solicitado:** 15 años adicionales\n✓ **Compromisos:** Mejoras de infraestructura\n✓ **Urgencia:** Media-Alta\n\n**Acciones requeridas:**\n1. Revisión legal del contrato vigente\n2. Evaluación técnica de inversiones\n3. Consulta con autoridades portuarias`,
      translate: `**Traducción al inglés:**\n\n---\n\nSubject: Request for Port Concession Extension\n\nDear Minister,\n\nThrough this letter, Terminal Marítima S.A. formally requests an extension of the concession period granted under Resolution No. 2020-0234, corresponding to the northern pier facilities of the main port.\n\nThis request is based on additional investments made during 2022-2024, amounting to USD 45 million...`,
      memo: `**MEMORANDO INTERNO**\n\n**Para:** Gabinete Ministerial\n**De:** Dirección de Asuntos Portuarios\n**Fecha:** ${new Date().toLocaleDateString('es')}\n**Asunto:** Solicitud de ampliación de concesión - Terminal Marítima S.A.\n\n---\n\n**1. Antecedentes**\nSe ha recibido solicitud formal de ampliación de concesión...\n\n**2. Análisis**\nLa empresa ha demostrado cumplimiento de obligaciones...\n\n**3. Recomendación**\nSe sugiere proceder con evaluación técnica detallada...`,
    };

    const defaultResponse = `Entendido. He analizado tu consulta.\n\nBasándome en el contexto disponible, puedo indicarte que:\n\n1. La documentación relacionada está disponible en el expediente EXP-2024-00342\n2. Se recomienda coordinar con el departamento legal\n3. El plazo para respuesta es de 15 días hábiles\n\n¿Necesitas que profundice en algún aspecto específico?`;

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responses[selectedMode || ''] || defaultResponse,
      sources: [
        { title: 'ENT-2024-001542 - Solicitud ampliación', id: 'd1' },
        { title: 'EXP-2024-00342 - Renovación Terminal Norte', id: 'exp1' },
      ],
    };

    setMessages(prev => [...prev, aiMessage]);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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

        {/* Mode Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {modes.map(mode => (
            <Button
              key={mode.id}
              variant={selectedMode === mode.id ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setSelectedMode(selectedMode === mode.id ? null : mode.id)}
            >
              <mode.icon className="h-4 w-4 mr-1" />
              {mode.label}
            </Button>
          ))}
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
                {message.role === 'assistant' && message.id !== '1' && (
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm">
                      <Copy className="h-3 w-3 mr-1" />
                      Copiar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Plus className="h-3 w-3 mr-1" />
                      {t('ai.insert_draft')}
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
            placeholder={t('ai.placeholder')}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-12 max-h-32 resize-none"
            rows={1}
          />
          <Button onClick={handleSend} disabled={loading || (!input.trim() && !selectedMode)}>
            <Send className="h-4 w-4" />
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
