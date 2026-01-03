import { useState } from 'react';
import { Document, departments, getDepartmentById, Department } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Bot,
  Sparkles,
  FileText,
  Send,
  Copy,
  Check,
  RefreshCw,
  Building2,
  ChevronRight,
  Mail,
  Phone,
  MessageCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocumentAIPanelProps {
  document: Document;
  onClose?: () => void;
}

export function DocumentAIPanel({ document, onClose }: DocumentAIPanelProps) {
  const [copied, setCopied] = useState<'summary' | 'response' | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editedResponse, setEditedResponse] = useState(document.aiProposedResponse || '');

  const handleCopy = async (text: string, type: 'summary' | 'response') => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  const decretedDepartments = document.decretedTo?.map(id => getDepartmentById(id)).filter(Boolean) as Department[];

  return (
    <div className="space-y-4">
      {/* AI Summary Section */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              Resumen IA
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRegenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {document.aiSummary ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {document.aiSummary}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => handleCopy(document.aiSummary!, 'summary')}
              >
                {copied === 'summary' ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-green-500" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copiar resumen
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="text-center py-6">
              <Bot className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">
                No hay resumen disponible
              </p>
              <Button variant="outline" size="sm" className="mt-3" onClick={handleRegenerate}>
                <Sparkles className="h-4 w-4 mr-2" />
                Generar resumen
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Proposed Response Section */}
      <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-500" />
              </div>
              Respuesta propuesta
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {document.aiProposedResponse ? (
            <div className="space-y-3">
              <Textarea
                value={editedResponse}
                onChange={(e) => setEditedResponse(e.target.value)}
                className="min-h-[150px] text-sm resize-none"
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => handleCopy(editedResponse, 'response')}
                >
                  {copied === 'response' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-green-500" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copiar
                    </>
                  )}
                </Button>
                <Button variant="default" size="sm" className="gap-2">
                  <Send className="h-3.5 w-3.5" />
                  Crear documento de respuesta
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <FileText className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">
                No hay respuesta propuesta
              </p>
              <Button variant="outline" size="sm" className="mt-3" onClick={handleRegenerate}>
                <Sparkles className="h-4 w-4 mr-2" />
                Generar respuesta
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Decreted To Section */}
      {decretedDepartments && decretedDepartments.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                <Building2 className="h-4 w-4" />
              </div>
              Decretado a
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {decretedDepartments.map((dept) => (
                <div
                  key={dept.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: dept.color }}
                    >
                      {dept.code}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{dept.name}</p>
                      <p className="text-xs text-muted-foreground">{dept.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" title="Enviar email">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" title="WhatsApp">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Decree Dialog Component
interface DecreeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document;
  onDecree?: (departmentIds: string[]) => void;
}

export function DecreeDialog({ open, onOpenChange, document, onDecree }: DecreeDialogProps) {
  const [selectedDepts, setSelectedDepts] = useState<string[]>(document.decretedTo || []);
  const [sendNotification, setSendNotification] = useState(true);
  const [notificationMethod, setNotificationMethod] = useState<'email' | 'whatsapp' | 'both'>('email');

  const toggleDepartment = (id: string) => {
    setSelectedDepts(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    onDecree?.(selectedDepts);
    onOpenChange(false);
  };

  // Group departments by level
  const groupedDepts = departments.reduce((acc, dept) => {
    const level = dept.level;
    if (!acc[level]) acc[level] = [];
    acc[level].push(dept);
    return acc;
  }, {} as Record<number, Department[]>);

  const levelLabels: Record<number, string> = {
    1: 'Máxima Autoridad',
    2: 'Alta Dirección',
    3: 'Secretarías',
    4: 'Direcciones',
    5: 'Delegaciones y Secciones',
    6: 'Personal',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Decretar Documento
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <div className="mb-4 p-3 rounded-lg bg-muted/50">
            <p className="text-sm font-medium">{document.title}</p>
            <p className="text-xs text-muted-foreground">{document.correlativeNumber}</p>
          </div>

          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6">
              {Object.entries(groupedDepts).map(([level, depts]) => (
                <div key={level}>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    {levelLabels[Number(level)] || `Nivel ${level}`}
                  </h4>
                  <div className="space-y-2">
                    {depts.map((dept) => (
                      <div
                        key={dept.id}
                        className={cn(
                          'flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all',
                          selectedDepts.includes(dept.id)
                            ? 'border-primary bg-primary/5'
                            : 'border-transparent bg-muted/50 hover:border-muted-foreground/20'
                        )}
                        onClick={() => toggleDepartment(dept.id)}
                      >
                        <Checkbox
                          checked={selectedDepts.includes(dept.id)}
                          onCheckedChange={() => toggleDepartment(dept.id)}
                        />
                        <div
                          className="h-10 w-10 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ backgroundColor: dept.color }}
                        >
                          {dept.code}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{dept.name}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {dept.email}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Notification options */}
          <div className="mt-4 p-4 rounded-lg bg-muted/50 space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="send-notification"
                checked={sendNotification}
                onCheckedChange={(checked) => setSendNotification(checked as boolean)}
              />
              <label htmlFor="send-notification" className="text-sm font-medium cursor-pointer">
                Enviar notificación automática
              </label>
            </div>
            {sendNotification && (
              <div className="flex gap-2 pl-6">
                <Button
                  variant={notificationMethod === 'email' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setNotificationMethod('email')}
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Email
                </Button>
                <Button
                  variant={notificationMethod === 'whatsapp' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setNotificationMethod('whatsapp')}
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  WhatsApp
                </Button>
                <Button
                  variant={notificationMethod === 'both' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setNotificationMethod('both')}
                >
                  Ambos
                </Button>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={selectedDepts.length === 0}>
            <Send className="h-4 w-4 mr-2" />
            Decretar a {selectedDepts.length} departamento(s)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
