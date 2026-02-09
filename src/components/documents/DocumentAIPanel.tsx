import { useState } from 'react';
import { Document, getDepartmentById, Department } from '@/lib/mockData';
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
  List,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { axiosInstance } from '@/lib/api/axios';
import { useNavigate } from 'react-router-dom';
import { departmentsApi } from '@/lib/api/departments.api';

interface DocumentAIPanelProps {
  document: Document;
  onClose?: () => void;
}

export function DocumentAIPanel({ document, onClose }: DocumentAIPanelProps) {
  const [copied, setCopied] = useState<'summary' | 'response' | null>(null);
  const [editedResponse, setEditedResponse] = useState(document.aiProposedResponse || '');

  // Local state for AI content (so we can update it without mutating props)
  const [aiSummary, setAiSummary] = useState(document.aiSummary || '');
  const [aiKeyPoints, setAiKeyPoints] = useState(document.aiKeyPoints || []);
  const [aiProposedResponse, setAiProposedResponse] = useState(document.aiProposedResponse || '');

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleCopy = async (text: string, type: 'summary' | 'response') => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  // AI Generation mutation
  const generateAIMutation = useMutation({
    mutationFn: async ({ force = false }: { force?: boolean } = {}) => {
      const response = await axiosInstance.post(`/documents/${document.id}/generate-ai`, { force });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['inbox-documents'] });

      // Update local state with new AI data
      if (data.document) {
        // Update all AI state
        setAiSummary(data.document.aiSummary || '');
        setAiKeyPoints(data.document.aiKeyPoints || []);
        setAiProposedResponse(data.document.aiProposedResponse || '');

        // Update the editable response textarea
        if (data.document.aiProposedResponse) {
          setEditedResponse(data.document.aiProposedResponse);
        }
      }

      toast.success('IA generada exitosamente', {
        description: 'El contenido se ha actualizado automáticamente',
      });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Error al generar contenido IA';

      // Show helpful message for short text
      if (errorMessage.includes('too short') || errorMessage.includes('Minimum 50 characters')) {
        toast.error('Documento muy corto', {
          description: 'El documento necesita al menos 50 caracteres para generar contenido con IA. Por favor, agrega más contenido al documento.'
        });
      } else {
        toast.error(errorMessage);
      }
    },
  });

  const handleRegenerate = () => {
    generateAIMutation.mutate({ force: true });
  };

  // Create response document mutation
  const createResponseMutation = useMutation({
    mutationFn: async () => {
      const responseData = {
        title: `Respuesta a: ${document.title}`,
        type: 'RESPUESTA',
        direction: 'OUT',
        classification: 'INTERNAL', // Required field
        content: editedResponse,
        isDraft: true, // Mark as draft instead of using status
        entityId: document.entityId,
        responsibleId: document.responsibleId,
        priority: 'MEDIUM',
      };

      const response = await axiosInstance.post('/documents', responseData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['outbox-documents'] });

      toast.success('Documento de respuesta creado', {
        description: 'Se ha creado un nuevo documento borrador con la respuesta propuesta',
      });

      // Close panel and navigate to new document
      onClose?.();
      navigate(`/documents/${data.id}`);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Error al crear documento de respuesta';
      toast.error(errorMessage);
    },
  });

  const handleCreateResponse = () => {
    if (!editedResponse || editedResponse.trim().length === 0) {
      toast.error('No hay respuesta para crear documento', {
        description: 'Primero genera una respuesta propuesta con IA',
      });
      return;
    }
    createResponseMutation.mutate();
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
              disabled={generateAIMutation.isPending}
            >
              {generateAIMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {aiSummary ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {aiSummary}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => handleCopy(aiSummary, 'summary')}
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

      {/* Key Points Section */}
      {aiKeyPoints && aiKeyPoints.length > 0 && (
        <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                <List className="h-4 w-4 text-green-500" />
              </div>
              Puntos Clave
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {aiKeyPoints.map((point: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <ChevronRight className="h-4 w-4 mt-0.5 shrink-0 text-green-600" />
                  <span className="text-muted-foreground leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

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
          {aiProposedResponse ? (
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
                <Button
                  variant="default"
                  size="sm"
                  className="gap-2"
                  onClick={handleCreateResponse}
                  disabled={createResponseMutation.isPending || !editedResponse}
                >
                  {createResponseMutation.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
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
  onDecree?: (data: {
    departmentIds: string[];
    sendNotification: boolean;
    notificationMethod: 'EMAIL' | 'WHATSAPP' | 'BOTH';
  }) => void;
}

export function DecreeDialog({ open, onOpenChange, document, onDecree }: DecreeDialogProps) {
  const [selectedDepts, setSelectedDepts] = useState<string[]>(document.decretedTo || []);
  const [sendNotification, setSendNotification] = useState(true);
  const [notificationMethod, setNotificationMethod] = useState<'email' | 'whatsapp' | 'both'>('email');

  // Fetch departments from API
  const { data: departments = [], isLoading, isError } = useQuery({
    queryKey: ['departments'],
    queryFn: departmentsApi.findAll,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Generate color based on department level
  const getDeptColor = (level: number) => {
    const colors = [
      '#8B5CF6', // Purple - Level 1
      '#3B82F6', // Blue - Level 2
      '#10B981', // Green - Level 3
      '#F59E0B', // Amber - Level 4
      '#EF4444', // Red - Level 5
      '#6366F1', // Indigo - Level 6
    ];
    return colors[(level - 1) % colors.length];
  };

  // Generate code from department name
  const getDeptCode = (dept: any) => {
    if (dept.shortName) return dept.shortName;
    const words = dept.name.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return dept.name.substring(0, 2).toUpperCase();
  };

  const toggleDepartment = (id: string) => {
    setSelectedDepts(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    onDecree?.({
      departmentIds: selectedDepts,
      sendNotification,
      notificationMethod: notificationMethod.toUpperCase() as 'EMAIL' | 'WHATSAPP' | 'BOTH',
    });
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
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <AlertCircle className="h-12 w-12 text-destructive mb-2" />
                <p className="text-sm text-muted-foreground">
                  Error al cargar departamentos
                </p>
              </div>
            ) : departments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <Building2 className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  No hay departamentos disponibles
                </p>
              </div>
            ) : (
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
                            style={{ backgroundColor: getDeptColor(dept.level) }}
                          >
                            {getDeptCode(dept)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{dept.name}</p>
                            {dept.shortName && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {dept.shortName}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
