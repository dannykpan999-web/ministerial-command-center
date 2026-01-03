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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  FolderOpen,
  UserPlus,
  Clock,
  Bot,
  PenTool,
  Inbox,
} from 'lucide-react';
import {
  fetchDocuments,
  entities,
  users,
  getEntityById,
  getUserById,
  Document,
} from '@/lib/mockData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function InboxPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    async function loadData() {
      const docs = await fetchDocuments('in');
      setDocuments(docs);
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase()) ||
                         doc.correlativeNumber.toLowerCase().includes(search.toLowerCase());
    const matchesEntity = entityFilter === 'all' || doc.entityId === entityFilter;
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    return matchesSearch && matchesEntity && matchesStatus;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredDocs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredDocs.map(d => d.id));
    }
  };

  const statusLabels: Record<string, string> = {
    pending: 'Pendiente',
    in_progress: 'En proceso',
    completed: 'Completado',
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
        title={t('inbox.title')}
        description={t('inbox.description')}
        action={
          <Button onClick={() => navigate('/inbox/new')}>
            <Plus className="h-4 w-4 mr-2" />
            {t('inbox.register_new')}
          </Button>
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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder={t('inbox.all_statuses')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('inbox.all_statuses')}</SelectItem>
            <SelectItem value="pending">{t('inbox.pending')}</SelectItem>
            <SelectItem value="in_progress">{t('inbox.in_progress')}</SelectItem>
            <SelectItem value="completed">{t('inbox.completed')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk actions */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-muted rounded-lg animate-fade-in">
          <span className="text-sm text-muted-foreground">
            {selectedIds.length} seleccionado(s)
          </span>
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" size="sm">
              <FolderOpen className="h-4 w-4 mr-1" />
              Abrir expediente
            </Button>
            <Button variant="outline" size="sm">
              <UserPlus className="h-4 w-4 mr-1" />
              Asignar
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <DataTableSkeleton columns={6} rows={5} />
      ) : filteredDocs.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={t('empty.no_documents')}
          description={t('empty.no_documents_desc')}
          action={{
            label: t('inbox.register_new'),
            onClick: () => navigate('/inbox/new'),
          }}
        />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedIds.length === filteredDocs.length}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Entidad</TableHead>
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
                      <Checkbox
                        checked={selectedIds.includes(doc.id)}
                        onCheckedChange={() => toggleSelect(doc.id)}
                      />
                    </TableCell>
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
                            <FolderOpen className="h-4 w-4 mr-2" />
                            Abrir expediente
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Asignar responsable
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Clock className="h-4 w-4 mr-2" />
                            Crear plazo
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Bot className="h-4 w-4 mr-2" />
                            Enviar a IA
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
