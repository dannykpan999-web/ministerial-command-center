import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DataTableSkeleton } from '@/components/ui/data-table-skeleton';
import {
  PenTool,
  User,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Shield,
  QrCode,
  Hash,
  Calendar,
} from 'lucide-react';
import {
  fetchSignatureFlows,
  getUserById,
  getDocumentById,
  getExpedienteById,
  SignatureFlow,
} from '@/lib/mockData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function SignaturePage() {
  const { t } = useLanguage();
  const [flows, setFlows] = useState<SignatureFlow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFlow, setSelectedFlow] = useState<SignatureFlow | null>(null);

  useEffect(() => {
    async function loadData() {
      const data = await fetchSignatureFlows();
      setFlows(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const pendingFlows = flows.filter(f => f.status === 'pending');
  const signedFlows = flows.filter(f => f.status === 'signed');
  const rejectedFlows = flows.filter(f => f.status === 'rejected');

  const statusVariants: Record<string, 'warning' | 'success' | 'destructive'> = {
    pending: 'warning',
    signed: 'success',
    rejected: 'destructive',
  };

  const statusLabels: Record<string, string> = {
    pending: t('signature.pending'),
    signed: t('signature.signed'),
    rejected: t('signature.rejected'),
  };

  const renderFlowCard = (flow: SignatureFlow) => {
    const doc = getDocumentById(flow.documentId);
    const exp = getExpedienteById(flow.expedienteId);
    const mainSigner = getUserById(flow.mainSignerId);

    return (
      <Card
        key={flow.id}
        className={cn(
          'cursor-pointer transition-colors',
          selectedFlow?.id === flow.id ? 'border-primary' : 'hover:border-primary/20'
        )}
        onClick={() => setSelectedFlow(flow)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <StatusBadge variant={statusVariants[flow.status]}>
              {flow.status === 'pending' && <Clock className="h-3 w-3" />}
              {flow.status === 'signed' && <CheckCircle className="h-3 w-3" />}
              {flow.status === 'rejected' && <XCircle className="h-3 w-3" />}
              <span className="ml-1">{statusLabels[flow.status]}</span>
            </StatusBadge>
            <span className="text-xs text-muted-foreground font-mono">v{flow.version}</span>
          </div>
          <h3 className="font-medium text-sm mb-1">{doc?.title || 'Documento'}</h3>
          <p className="text-xs text-muted-foreground">{exp?.number}</p>
          <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            <span>{mainSigner?.name}</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto animate-fade-in safe-area-inset">
      <PageHeader
        title={t('signature.title')}
        description={t('signature.description')}
        action={
          <Button size="sm" className="h-9 sm:h-10">
            <PenTool className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Nuevo flujo de firma</span>
          </Button>
        }
      />

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Flows List */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="pending">
            <TabsList className="mb-4 w-full justify-start overflow-x-auto">
              <TabsTrigger value="pending" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{t('signature.pending')}</span>
                <Badge variant="secondary" className="ml-1 text-[10px] sm:text-xs">{pendingFlows.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="signed" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{t('signature.signed')}</span>
              </TabsTrigger>
              <TabsTrigger value="rejected" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{t('signature.rejected')}</span>
              </TabsTrigger>
            </TabsList>

            {loading ? (
              <DataTableSkeleton columns={3} rows={3} />
            ) : (
              <>
                <TabsContent value="pending" className="grid gap-3 sm:grid-cols-2">
                  {pendingFlows.length === 0 ? (
                    <p className="text-muted-foreground col-span-2 text-center py-8">No hay documentos pendientes de firma</p>
                  ) : (
                    pendingFlows.map(renderFlowCard)
                  )}
                </TabsContent>
                <TabsContent value="signed" className="grid gap-3 sm:grid-cols-2">
                  {signedFlows.length === 0 ? (
                    <p className="text-muted-foreground col-span-2 text-center py-8">No hay documentos firmados</p>
                  ) : (
                    signedFlows.map(renderFlowCard)
                  )}
                </TabsContent>
                <TabsContent value="rejected" className="grid gap-3 sm:grid-cols-2">
                  {rejectedFlows.length === 0 ? (
                    <p className="text-muted-foreground col-span-2 text-center py-8">No hay documentos rechazados</p>
                  ) : (
                    rejectedFlows.map(renderFlowCard)
                  )}
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>

        {/* Detail Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Detalles del flujo</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedFlow ? (
              <div className="space-y-6">
                {/* Signers */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Firmantes</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{getUserById(selectedFlow.mainSignerId)?.name}</p>
                        <p className="text-xs text-muted-foreground">{t('signature.main_signer')}</p>
                      </div>
                      {selectedFlow.status === 'signed' && <CheckCircle className="h-4 w-4 text-success" />}
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded-lg border border-dashed">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm">{getUserById(selectedFlow.alternateSignerId)?.name}</p>
                        <p className="text-xs text-muted-foreground">{t('signature.alternate_signer')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Validators */}
                {selectedFlow.validatorIds.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">{t('signature.validators')}</h4>
                    <div className="space-y-2">
                      {selectedFlow.validatorIds.map(id => {
                        const user = getUserById(id);
                        return (
                          <div key={id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{user?.name}</span>
                            <CheckCircle className="h-4 w-4 text-success ml-auto" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Integrity Block */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    {t('signature.integrity')}
                  </h4>
                  <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <Hash className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Hash:</span>
                      <code className="font-mono">{selectedFlow.hash}</code>
                    </div>
                    {selectedFlow.timestamp && (
                      <div className="flex items-center gap-2 text-xs">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">Timestamp:</span>
                        <span>{format(selectedFlow.timestamp, "dd/MM/yyyy HH:mm:ss")}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs">
                      <FileText className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Versión:</span>
                      <span>{selectedFlow.version}</span>
                    </div>
                    <div className="flex justify-center pt-2">
                      <div className="h-16 w-16 bg-foreground rounded flex items-center justify-center">
                        <QrCode className="h-12 w-12 text-background" />
                      </div>
                    </div>
                  </div>
                </div>

                {selectedFlow.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <PenTool className="h-4 w-4 mr-1" />
                      Firmar
                    </Button>
                    <Button variant="outline">
                      Rechazar
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <PenTool className="h-8 w-8 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Selecciona un flujo para ver los detalles</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
