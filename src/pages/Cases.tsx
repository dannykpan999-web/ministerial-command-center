import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTableSkeleton } from '@/components/ui/data-table-skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Search,
  FolderOpen,
  Filter,
  Star,
  PenTool,
  AlertTriangle,
} from 'lucide-react';
import {
  fetchExpedientes,
  entities,
  getEntityById,
  getUserById,
  Expediente,
} from '@/lib/mockData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const savedViews = [
  { id: 'urgent', label: 'Urgentes', icon: AlertTriangle, filter: { priority: 'urgent' } },
  { id: 'pending_sig', label: 'Pendientes de firma', icon: PenTool, filter: { status: 'pending_signature' } },
];

export default function CasesPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeView, setActiveView] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const data = await fetchExpedientes();
      setExpedientes(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const applyView = (viewId: string) => {
    const view = savedViews.find(v => v.id === viewId);
    if (!view) {
      setActiveView(null);
      setStatusFilter('all');
      return;
    }
    setActiveView(viewId);
    if (view.filter.status) setStatusFilter(view.filter.status);
  };

  const filteredExpedientes = expedientes.filter(exp => {
    const matchesSearch = exp.title.toLowerCase().includes(search.toLowerCase()) ||
                         exp.number.toLowerCase().includes(search.toLowerCase());
    const matchesEntity = entityFilter === 'all' || exp.entityId === entityFilter;
    const matchesStatus = statusFilter === 'all' || exp.status === statusFilter;
    const matchesPriority = activeView === 'urgent' ? exp.priority === 'urgent' : true;
    return matchesSearch && matchesEntity && matchesStatus && matchesPriority;
  });

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

  const priorityLabels: Record<string, string> = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
    urgent: 'Urgente',
  };

  const priorityColors: Record<string, string> = {
    low: 'bg-muted text-muted-foreground',
    medium: 'bg-info/10 text-info',
    high: 'bg-warning/10 text-warning',
    urgent: 'bg-destructive/10 text-destructive',
  };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <PageHeader
        title={t('cases.title')}
        description={t('cases.description')}
        action={
          <Button onClick={() => navigate('/cases/new')}>
            <Plus className="h-4 w-4 mr-2" />
            {t('cases.create_new')}
          </Button>
        }
      />

      {/* Saved Views */}
      <div className="flex gap-2 mb-6">
        <span className="text-sm text-muted-foreground self-center mr-2">{t('cases.saved_views')}:</span>
        {savedViews.map(view => (
          <Button
            key={view.id}
            variant={activeView === view.id ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => applyView(activeView === view.id ? '' : view.id)}
          >
            <view.icon className="h-4 w-4 mr-1" />
            {view.label}
          </Button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('common.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={entityFilter} onValueChange={setEntityFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder={t('inbox.all_entities')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('inbox.all_entities')}</SelectItem>
            {entities.map(entity => (
              <SelectItem key={entity.id} value={entity.id}>{entity.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder={t('inbox.all_statuses')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('inbox.all_statuses')}</SelectItem>
            <SelectItem value="open">Abierto</SelectItem>
            <SelectItem value="pending_signature">Pendiente firma</SelectItem>
            <SelectItem value="closed">Cerrado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {loading ? (
        <DataTableSkeleton columns={6} rows={5} />
      ) : filteredExpedientes.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title={t('empty.no_cases')}
          description={t('empty.no_cases_desc')}
          action={{
            label: t('cases.create_new'),
            onClick: () => navigate('/cases/new'),
          }}
        />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Expediente</TableHead>
                <TableHead>Entidad</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Actualizado</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpedientes.map((exp) => {
                const entity = getEntityById(exp.entityId);
                const responsible = getUserById(exp.responsibleId);
                return (
                  <TableRow
                    key={exp.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/cases/${exp.id}`)}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium">{exp.title}</p>
                        <p className="text-xs text-muted-foreground font-mono">{exp.number}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-6 w-6 rounded text-xs font-semibold flex items-center justify-center text-primary-foreground"
                          style={{ backgroundColor: entity?.color }}
                        >
                          {entity?.code}
                        </div>
                        <span className="text-sm">{entity?.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{responsible?.name}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('text-xs', priorityColors[exp.priority])}>
                        {priorityLabels[exp.priority]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {format(exp.updatedAt, 'dd MMM yyyy', { locale: es })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge variant={statusVariants[exp.status]}>
                        {statusLabels[exp.status]}
                      </StatusBadge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
