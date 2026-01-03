import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTableSkeleton } from '@/components/ui/data-table-skeleton';
import { EmptyState } from '@/components/ui/empty-state';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  Search,
  MoreHorizontal,
  Bot,
  PenTool,
  Send,
  Eye,
  Edit,
} from 'lucide-react';
import {
  fetchDocuments,
  entities,
  getEntityById,
  getUserById,
  Document,
} from '@/lib/mockData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function OutboxPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [entityFilter, setEntityFilter] = useState<string>('all');

  useEffect(() => {
    async function loadData() {
      const docs = await fetchDocuments('out');
      setDocuments(docs);
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase()) ||
                         doc.correlativeNumber.toLowerCase().includes(search.toLowerCase());
    const matchesEntity = entityFilter === 'all' || doc.entityId === entityFilter;
    return matchesSearch && matchesEntity;
  });

  const statusLabels: Record<string, string> = {
    pending: 'Borrador',
    in_progress: 'En revisión',
    completed: 'Enviado',
    archived: 'Archivado',
  };

  const statusVariants: Record<string, 'warning' | 'info' | 'success' | 'muted'> = {
    pending: 'warning',
    in_progress: 'info',
    completed: 'success',
    archived: 'muted',
  };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <PageHeader
        title={t('outbox.title')}
        description={t('outbox.description')}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/assistant')}>
              <Bot className="h-4 w-4 mr-2" />
              {t('outbox.generate_draft')}
            </Button>
            <Button onClick={() => navigate('/outbox/new')}>
              <Plus className="h-4 w-4 mr-2" />
              {t('outbox.register_new')}
            </Button>
          </div>
        }
      />

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
      </div>

      {/* Table */}
      {loading ? (
        <DataTableSkeleton columns={5} rows={5} />
      ) : filteredDocs.length === 0 ? (
        <EmptyState
          icon={Send}
          title={t('empty.no_documents')}
          description="Los documentos de salida aparecerán aquí"
          action={{
            label: t('outbox.register_new'),
            onClick: () => navigate('/outbox/new'),
          }}
        />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Documento</TableHead>
                <TableHead>Destinatario</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocs.map((doc) => {
                const entity = getEntityById(doc.entityId);
                const responsible = getUserById(doc.responsibleId);
                return (
                  <TableRow key={doc.id} className="group">
                    <TableCell>
                      <div>
                        <p className="font-medium">{doc.title}</p>
                        <p className="text-xs text-muted-foreground">{doc.correlativeNumber}</p>
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
                      <span className="text-sm text-muted-foreground">
                        {format(doc.createdAt, 'dd MMM yyyy', { locale: es })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge variant={statusVariants[doc.status]}>
                        {statusLabels[doc.status]}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver documento
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <PenTool className="h-4 w-4 mr-2" />
                            Enviar a firma
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
