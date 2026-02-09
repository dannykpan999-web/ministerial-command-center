import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Clock,
  FileText,
  Stamp,
  PenTool,
  CheckCircle,
  Send,
  Archive,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkflowStatisticsCardProps {
  className?: string;
}

interface StageStats {
  stage: string;
  count: number;
  percentage: number;
}

export function WorkflowStatisticsCard({ className }: WorkflowStatisticsCardProps) {
  // Mock data - replace with actual API call
  const { data: stats, isLoading } = useQuery({
    queryKey: ['workflow-stats'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return {
        totalDocuments: 1247,
        incomingDocuments: 823,
        outgoingDocuments: 424,
        byStage: [
          { stage: 'PENDING', count: 45, percentage: 3.6 },
          { stage: 'MANUAL_ENTRY', count: 12, percentage: 1.0 },
          { stage: 'RECEIVED', count: 23, percentage: 1.8 },
          { stage: 'REGISTRATION', count: 18, percentage: 1.4 },
          { stage: 'DISTRIBUTION', count: 34, percentage: 2.7 },
          { stage: 'ANALYSIS', count: 67, percentage: 5.4 },
          { stage: 'DRAFT_RESPONSE', count: 89, percentage: 7.1 },
          { stage: 'REVIEW', count: 56, percentage: 4.5 },
          { stage: 'SIGNATURE_PROTOCOL', count: 123, percentage: 9.9 },
          { stage: 'ACKNOWLEDGMENT', count: 78, percentage: 6.3 },
          { stage: 'ARCHIVED', count: 702, percentage: 56.3 },
        ] as StageStats[],
        averageCompletionTime: 7.2, // days
        documentsThisWeek: 34,
        documentsThisMonth: 156,
      };
    },
  });

  const stageIcons: Record<string, React.ReactNode> = {
    PENDING: <Clock className="h-4 w-4" />,
    MANUAL_ENTRY: <Stamp className="h-4 w-4" />,
    RECEIVED: <FileText className="h-4 w-4" />,
    REGISTRATION: <FileText className="h-4 w-4" />,
    DISTRIBUTION: <Send className="h-4 w-4" />,
    ANALYSIS: <FileText className="h-4 w-4" />,
    DRAFT_RESPONSE: <FileText className="h-4 w-4" />,
    REVIEW: <FileText className="h-4 w-4" />,
    SIGNATURE_PROTOCOL: <PenTool className="h-4 w-4" />,
    ACKNOWLEDGMENT: <CheckCircle className="h-4 w-4" />,
    ARCHIVED: <Archive className="h-4 w-4" />,
  };

  const stageLabels: Record<string, string> = {
    PENDING: 'Pendiente',
    MANUAL_ENTRY: 'Entrada Manual',
    RECEIVED: 'Recibido',
    REGISTRATION: 'Registro',
    DISTRIBUTION: 'Distribución',
    ANALYSIS: 'Análisis',
    DRAFT_RESPONSE: 'Borrador',
    REVIEW: 'Revisión',
    SIGNATURE_PROTOCOL: 'Firma',
    ACKNOWLEDGMENT: 'Confirmación',
    ARCHIVED: 'Archivado',
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Estadísticas de Flujo de Trabajo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  const topStages = stats.byStage
    .filter((s) => s.stage !== 'ARCHIVED')
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Estadísticas de Flujo de Trabajo</span>
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{stats.totalDocuments.toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Entrada</p>
            <p className="text-2xl font-bold text-blue-600">
              {stats.incomingDocuments.toLocaleString()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Salida</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.outgoingDocuments.toLocaleString()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Tiempo Prom.</p>
            <p className="text-2xl font-bold">{stats.averageCompletionTime}d</p>
          </div>
        </div>

        {/* Documents by Time Period */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-3">
            <p className="text-sm text-muted-foreground mb-1">Esta Semana</p>
            <div className="flex items-baseline gap-2">
              <p className="text-xl font-semibold">{stats.documentsThisWeek}</p>
              <Badge variant="success" className="text-xs">
                +12%
              </Badge>
            </div>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-sm text-muted-foreground mb-1">Este Mes</p>
            <div className="flex items-baseline gap-2">
              <p className="text-xl font-semibold">{stats.documentsThisMonth}</p>
              <Badge variant="success" className="text-xs">
                +8%
              </Badge>
            </div>
          </div>
        </div>

        {/* Top 5 Active Stages */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Etapas Más Activas
          </h4>
          <div className="space-y-3">
            {topStages.map((stage) => (
              <div key={stage.stage} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {stageIcons[stage.stage]}
                    <span className="font-medium">
                      {stageLabels[stage.stage] || stage.stage}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{stage.count}</span>
                    <span className="text-xs text-muted-foreground">
                      ({stage.percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      stage.stage === 'SIGNATURE_PROTOCOL'
                        ? 'bg-green-500'
                        : stage.stage === 'ANALYSIS' || stage.stage === 'DRAFT_RESPONSE'
                        ? 'bg-blue-500'
                        : stage.stage === 'REVIEW'
                        ? 'bg-orange-500'
                        : 'bg-gray-500'
                    )}
                    style={{ width: `${Math.min(stage.percentage, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Archived Documents */}
        <div className="rounded-lg bg-muted/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Archive className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Documentos Archivados</p>
                <p className="text-sm text-muted-foreground">
                  {stats.byStage.find((s) => s.stage === 'ARCHIVED')?.percentage.toFixed(1)}% del
                  total
                </p>
              </div>
            </div>
            <p className="text-2xl font-bold">
              {stats.byStage
                .find((s) => s.stage === 'ARCHIVED')
                ?.count.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
