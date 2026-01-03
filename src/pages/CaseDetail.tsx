import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  FileText,
  Clock,
  PenTool,
  History,
  User,
  Calendar,
  Building2,
  CheckCircle,
  Circle,
  AlertCircle,
} from 'lucide-react';
import {
  getExpedienteById,
  getEntityById,
  getUserById,
  documents,
  deadlines,
  signatureFlows,
  auditLog,
  delay,
  Expediente,
} from '@/lib/mockData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function CaseDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [expediente, setExpediente] = useState<Expediente | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      await delay(500);
      const exp = getExpedienteById(id || '');
      setExpediente(exp || null);
      setLoading(false);
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!expediente) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <Button variant="ghost" onClick={() => navigate('/cases')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div className="mt-12 text-center text-muted-foreground">
          Expediente no encontrado
        </div>
      </div>
    );
  }

  const entity = getEntityById(expediente.entityId);
  const responsible = getUserById(expediente.responsibleId);
  const relatedDocs = documents.filter(d => expediente.documentIds.includes(d.id));
  const relatedDeadlines = deadlines.filter(d => d.expedienteId === expediente.id);
  const relatedSignatures = signatureFlows.filter(s => s.expedienteId === expediente.id);
  const relatedAudit = auditLog.filter(a => a.targetId === expediente.id);

  const statusLabels: Record<string, string> = {
    open: 'Abierto',
    pending_signature: 'Pendiente firma',
    closed: 'Cerrado',
    archived: 'Archivado',
  };

  const statusVariants: Record<string, 'success' | 'warning' | 'info' | 'muted'> = {
    open: 'info',
    pending_signature: 'warning',
    closed: 'success',
    archived: 'muted',
  };

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in">
      <Button variant="ghost" onClick={() => navigate('/cases')} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver a expedientes
      </Button>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">{expediente.title}</h1>
            <StatusBadge variant={statusVariants[expediente.status]}>
              {statusLabels[expediente.status]}
            </StatusBadge>
          </div>
          <p className="text-muted-foreground font-mono mt-1">{expediente.number}</p>
        </div>
        <Button>
          <PenTool className="h-4 w-4 mr-2" />
          Enviar a firma
        </Button>
      </div>

      <Tabs defaultValue="summary" className="space-y-6">
        <TabsList>
          <TabsTrigger value="summary">{t('cases.summary')}</TabsTrigger>
          <TabsTrigger value="documents">{t('cases.documents')}</TabsTrigger>
          <TabsTrigger value="deadlines">{t('cases.deadlines')}</TabsTrigger>
          <TabsTrigger value="signature">{t('cases.signature')}</TabsTrigger>
          <TabsTrigger value="history">{t('cases.history')}</TabsTrigger>
        </TabsList>

        {/* Summary Tab */}
        <TabsContent value="summary">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Información general</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <dt className="text-sm text-muted-foreground">Entidad</dt>
                      <dd className="font-medium">{entity?.name}</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <dt className="text-sm text-muted-foreground">Responsable</dt>
                      <dd className="font-medium">{responsible?.name}</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <dt className="text-sm text-muted-foreground">Fecha de creación</dt>
                      <dd className="font-medium">{format(expediente.createdAt, "d 'de' MMMM 'de' yyyy", { locale: es })}</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <dt className="text-sm text-muted-foreground">Última actualización</dt>
                      <dd className="font-medium">{format(expediente.updatedAt, "d 'de' MMMM 'de' yyyy", { locale: es })}</dd>
                    </div>
                  </div>
                </dl>
                {expediente.description && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="text-sm font-medium mb-2">Descripción</h4>
                    <p className="text-sm text-muted-foreground">{expediente.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Documentos</span>
                  <Badge variant="secondary">{relatedDocs.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Plazos activos</span>
                  <Badge variant="secondary">{relatedDeadlines.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Firmas pendientes</span>
                  <Badge variant="secondary">{relatedSignatures.filter(s => s.status === 'pending').length}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Documentos asociados</CardTitle>
            </CardHeader>
            <CardContent>
              {relatedDocs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No hay documentos asociados</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {relatedDocs.map(doc => (
                    <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{doc.title}</p>
                        <p className="text-xs text-muted-foreground">{doc.correlativeNumber}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(doc.createdAt, 'dd MMM yyyy', { locale: es })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deadlines Tab */}
        <TabsContent value="deadlines">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Plazos y alertas</CardTitle>
            </CardHeader>
            <CardContent>
              {relatedDeadlines.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No hay plazos programados</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {relatedDeadlines.map(deadline => {
                    const user = getUserById(deadline.assignedTo);
                    return (
                      <div key={deadline.id} className="flex items-center gap-3 p-3 rounded-lg border">
                        <div className={cn(
                          'h-8 w-8 rounded-lg flex items-center justify-center',
                          deadline.status === 'overdue' ? 'bg-destructive/10 text-destructive' :
                          deadline.status === 'urgent' ? 'bg-warning/10 text-warning' :
                          'bg-muted text-muted-foreground'
                        )}>
                          <Clock className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{deadline.title}</p>
                          <p className="text-xs text-muted-foreground">{user?.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{format(deadline.dueDate, 'dd MMM', { locale: es })}</p>
                          <StatusBadge
                            variant={
                              deadline.status === 'overdue' ? 'destructive' :
                              deadline.status === 'urgent' ? 'warning' : 'muted'
                            }
                            className="text-xs"
                          >
                            {deadline.status === 'overdue' ? 'Vencido' :
                             deadline.status === 'urgent' ? 'Urgente' : 'Próximo'}
                          </StatusBadge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Signature Tab */}
        <TabsContent value="signature">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Flujos de firma</CardTitle>
            </CardHeader>
            <CardContent>
              {relatedSignatures.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <PenTool className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No hay flujos de firma</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {relatedSignatures.map(sig => {
                    const mainSigner = getUserById(sig.mainSignerId);
                    const altSigner = getUserById(sig.alternateSignerId);
                    return (
                      <div key={sig.id} className="p-4 rounded-lg border">
                        <div className="flex items-center justify-between mb-3">
                          <StatusBadge
                            variant={
                              sig.status === 'signed' ? 'success' :
                              sig.status === 'rejected' ? 'destructive' : 'warning'
                            }
                          >
                            {sig.status === 'signed' ? 'Firmado' :
                             sig.status === 'rejected' ? 'Rechazado' : 'Pendiente'}
                          </StatusBadge>
                          <span className="text-xs text-muted-foreground font-mono">v{sig.version}</span>
                        </div>
                        <div className="grid gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Firmante principal:</span>
                            <span className="font-medium">{mainSigner?.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Alternativo:</span>
                            <span className="font-medium">{altSigner?.name}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Historial de actividad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {relatedAudit.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No hay actividad registrada</p>
                  </div>
                ) : (
                  relatedAudit.map((entry, index) => {
                    const user = getUserById(entry.userId);
                    return (
                      <div key={entry.id} className="timeline-item">
                        <div className="timeline-dot">
                          <CheckCircle className="h-3 w-3" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{entry.action}</p>
                          <p className="text-xs text-muted-foreground">{entry.details}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {user?.name} · {format(entry.timestamp, "d MMM yyyy 'a las' HH:mm", { locale: es })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
