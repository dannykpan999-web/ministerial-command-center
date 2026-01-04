import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTableSkeleton } from '@/components/ui/data-table-skeleton';
import { EmptyState } from '@/components/ui/empty-state';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Plus,
  Search,
  MoreHorizontal,
  FolderOpen,
  UserPlus,
  Clock,
  PenTool,
  Inbox,
  Building2,
  Sparkles,
  ExternalLink,
  Home,
  FileText,
  Landmark,
  Factory,
  Briefcase,
} from 'lucide-react';
import {
  fetchDocuments,
  entities,
  getEntityById,
  getUserById,
  getDepartmentById,
  Document,
  entityTypeLabels,
  Entity,
} from '@/lib/mockData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DocumentAIPanel, DecreeDialog } from '@/components/documents/DocumentAIPanel';

export default function InboxPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [classificationFilter, setClassificationFilter] = useState<string>('all');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [decreeDialogOpen, setDecreeDialogOpen] = useState(false);

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
    const matchesClassification = classificationFilter === 'all' || doc.classification === classificationFilter;
    return matchesSearch && matchesEntity && matchesStatus && matchesClassification;
  });

  const openAIPanel = (doc: Document) => {
    setSelectedDocument(doc);
    setAiPanelOpen(true);
  };

  const openDecreeDialog = (doc: Document) => {
    setSelectedDocument(doc);
    setDecreeDialogOpen(true);
  };

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
    <div className="p-4 sm:p-6 max-w-7xl mx-auto animate-fade-in">
      <PageHeader
        title={t('inbox.title')}
        description={t('inbox.description')}
        action={
          <Button onClick={() => navigate('/inbox/new')} className="btn-animate">
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">{t('inbox.register_new')}</span>
            <span className="sm:hidden">Nuevo</span>
          </Button>
        }
      />

      {/* Classification Tabs */}
      <div className="flex gap-2 mb-4 animate-fade-in-up">
        <Button
          variant={classificationFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setClassificationFilter('all')}
          className="rounded-full"
        >
          <FileText className="h-4 w-4 mr-1.5" />
          Todos
        </Button>
        <Button
          variant={classificationFilter === 'internal' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setClassificationFilter('internal')}
          className="rounded-full"
        >
          <Home className="h-4 w-4 mr-1.5" />
          Internos
        </Button>
        <Button
          variant={classificationFilter === 'external' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setClassificationFilter('external')}
          className="rounded-full"
        >
          <ExternalLink className="h-4 w-4 mr-1.5" />
          Externos
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('common.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={entityFilter} onValueChange={setEntityFilter}>
            <SelectTrigger className="w-full sm:w-48 h-10">
              <SelectValue placeholder={t('inbox.all_entities')} />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              <SelectItem value="all">{t('inbox.all_entities')}</SelectItem>
              {/* Group by entity type */}
              {(['internal', 'public', 'private', 'government'] as const).map(type => {
                const typeEntities = entities.filter(e => e.type === type);
                if (typeEntities.length === 0) return null;
                return (
                  <div key={type}>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 sticky top-0">
                      {type === 'internal' && <Home className="h-3 w-3 inline mr-1.5" />}
                      {type === 'public' && <Landmark className="h-3 w-3 inline mr-1.5" />}
                      {type === 'private' && <Briefcase className="h-3 w-3 inline mr-1.5" />}
                      {type === 'government' && <Building2 className="h-3 w-3 inline mr-1.5" />}
                      {entityTypeLabels[type]}
                    </div>
                    {typeEntities.map(entity => (
                      <SelectItem key={entity.id} value={entity.id} className="pl-6">
                        <span className="flex items-center gap-2">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: entity.color }}
                          />
                          {entity.name}
                        </span>
                      </SelectItem>
                    ))}
                  </div>
                );
              })}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-36 h-10">
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
      </div>

      {/* Bulk actions */}
      {selectedIds.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4 p-3 bg-muted rounded-lg animate-fade-in">
          <span className="text-sm text-muted-foreground">
            {selectedIds.length} seleccionado(s)
          </span>
          <div className="flex gap-2 sm:ml-auto">
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
              <FolderOpen className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Abrir expediente</span>
              <span className="sm:hidden">Expediente</span>
            </Button>
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
              <UserPlus className="h-4 w-4 mr-1" />
              Asignar
            </Button>
          </div>
        </div>
      )}

      {/* Table - Desktop */}
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
        <>
          {/* Desktop Table */}
          <div className="hidden md:block rounded-lg border animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
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
                {filteredDocs.map((doc, index) => {
                  const entity = getEntityById(doc.entityId);
                  const responsible = getUserById(doc.responsibleId);
                  return (
                    <TableRow
                      key={doc.id}
                      className="group transition-colors hover:bg-muted/50"
                      style={{ animationDelay: `${index * 0.03}s` }}
                    >
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
                          <div className="min-w-0">
                            <span className="text-sm block truncate">{entity?.name}</span>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              {entity?.type === 'internal' && <><Home className="h-2.5 w-2.5" />Interno</>}
                              {entity?.type === 'public' && <><Landmark className="h-2.5 w-2.5" />Empresa Pública</>}
                              {entity?.type === 'private' && <><Briefcase className="h-2.5 w-2.5" />Privada</>}
                              {entity?.type === 'government' && <><Building2 className="h-2.5 w-2.5" />Gobierno</>}
                            </span>
                          </div>
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
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="animate-scale-in w-56">
                            <DropdownMenuItem onClick={() => openAIPanel(doc)}>
                              <Sparkles className="h-4 w-4 mr-2 text-primary" />
                              Ver resumen IA
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openDecreeDialog(doc)}>
                              <Building2 className="h-4 w-4 mr-2 text-orange-500" />
                              Decretar documento
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
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

          {/* Mobile Card List - Beautiful redesign */}
          <div className="md:hidden space-y-3">
            {filteredDocs.map((doc, index) => {
              const entity = getEntityById(doc.entityId);
              const responsible = getUserById(doc.responsibleId);
              const isSelected = selectedIds.includes(doc.id);
              return (
                <div
                  key={doc.id}
                  className={`
                    relative bg-card rounded-2xl border-2 overflow-hidden
                    transition-all duration-300 ease-out
                    hover:shadow-lg hover:border-primary/30
                    active:scale-[0.98]
                    animate-fade-in-up
                    ${isSelected ? 'border-primary bg-primary/5 shadow-md' : 'border-border/50'}
                  `}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Status accent bar */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 ${
                      doc.status === 'pending' ? 'bg-warning' :
                      doc.status === 'in_progress' ? 'bg-info' :
                      doc.status === 'completed' ? 'bg-success' : 'bg-muted'
                    }`}
                  />

                  <div className="p-4 pt-5">
                    {/* Header with checkbox and status */}
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleSelect(doc.id)}
                        className="mt-0.5 h-5 w-5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-sm leading-tight line-clamp-2">{doc.title}</h3>
                            <p className="text-xs text-muted-foreground mt-1 font-mono">{doc.correlativeNumber}</p>
                          </div>
                          <StatusBadge
                            variant={statusVariants[doc.status]}
                            className="shrink-0 text-[10px] px-2 py-0.5"
                          >
                            {statusLabels[doc.status]}
                          </StatusBadge>
                        </div>
                      </div>
                    </div>

                    {/* Entity and info section */}
                    <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                      <div
                        className="h-10 w-10 rounded-xl text-xs font-bold flex items-center justify-center text-white shadow-sm shrink-0"
                        style={{ backgroundColor: entity?.color }}
                      >
                        {entity?.code}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{entity?.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          {entity?.type === 'internal' && <><Home className="h-3 w-3" />Interno</>}
                          {entity?.type === 'public' && <><Landmark className="h-3 w-3" />Empresa Pública</>}
                          {entity?.type === 'private' && <><Briefcase className="h-3 w-3" />Privada</>}
                          {entity?.type === 'government' && <><Building2 className="h-3 w-3" />Gobierno</>}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-muted-foreground">Recibido</p>
                        <p className="text-sm font-medium">{format(doc.createdAt, 'dd MMM', { locale: es })}</p>
                      </div>
                    </div>

                    {/* Classification badge */}
                    <div className="mt-3 flex items-center gap-2">
                      <Badge variant={doc.classification === 'internal' ? 'secondary' : 'outline'} className="text-[10px]">
                        {doc.classification === 'internal' ? (
                          <><Home className="h-3 w-3 mr-1" />Interno</>
                        ) : (
                          <><ExternalLink className="h-3 w-3 mr-1" />Externo</>
                        )}
                      </Badge>
                      {doc.aiSummary && (
                        <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
                          <Sparkles className="h-3 w-3 mr-1" />IA
                        </Badge>
                      )}
                      {doc.decretedTo && doc.decretedTo.length > 0 && (
                        <Badge variant="outline" className="text-[10px] text-orange-500 border-orange-500/30">
                          <Building2 className="h-3 w-3 mr-1" />{doc.decretedTo.length}
                        </Badge>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-3 text-xs rounded-lg"
                          onClick={(e) => { e.stopPropagation(); openAIPanel(doc); }}
                        >
                          <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                          Resumen
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-3 text-xs rounded-lg"
                          onClick={(e) => { e.stopPropagation(); openDecreeDialog(doc); }}
                        >
                          <Building2 className="h-3.5 w-3.5 mr-1.5" />
                          Decretar
                        </Button>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 animate-scale-in">
                          <DropdownMenuItem className="py-2.5" onClick={() => openAIPanel(doc)}>
                            <Sparkles className="h-4 w-4 mr-2 text-primary" />
                            Ver resumen IA
                          </DropdownMenuItem>
                          <DropdownMenuItem className="py-2.5" onClick={() => openDecreeDialog(doc)}>
                            <Building2 className="h-4 w-4 mr-2 text-orange-500" />
                            Decretar documento
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="py-2.5">
                            <FolderOpen className="h-4 w-4 mr-2" />
                            Abrir expediente
                          </DropdownMenuItem>
                          <DropdownMenuItem className="py-2.5">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Asignar responsable
                          </DropdownMenuItem>
                          <DropdownMenuItem className="py-2.5">
                            <Clock className="h-4 w-4 mr-2" />
                            Crear plazo
                          </DropdownMenuItem>
                          <DropdownMenuItem className="py-2.5">
                            <PenTool className="h-4 w-4 mr-2" />
                            Enviar a firma
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* AI Panel Sheet */}
      <Sheet open={aiPanelOpen} onOpenChange={setAiPanelOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Análisis IA del Documento
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {selectedDocument && (
              <>
                <div className="mb-4 p-3 rounded-lg bg-muted/50">
                  <p className="text-sm font-medium">{selectedDocument.title}</p>
                  <p className="text-xs text-muted-foreground">{selectedDocument.correlativeNumber}</p>
                </div>
                <DocumentAIPanel document={selectedDocument} />
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Decree Dialog */}
      {selectedDocument && (
        <DecreeDialog
          open={decreeDialogOpen}
          onOpenChange={setDecreeDialogOpen}
          document={selectedDocument}
          onDecree={(deptIds) => {
            console.log('Decreted to departments:', deptIds);
            setDecreeDialogOpen(false);
          }}
        />
      )}
    </div>
  );
}
