import { useState, useMemo } from 'react';
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
  SelectGroup,
  SelectItem,
  SelectLabel,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
  Edit,
  Trash2,
  Download,
  Printer,
} from 'lucide-react';
import { entities, entityTypeLabels } from '@/lib/mockData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DocumentAIPanel, DecreeDialog } from '@/components/documents/DocumentAIPanel';
import { EditDocumentDialog } from '@/components/documents/EditDocumentDialog';
import { useInboxDocuments, useArchiveDocument } from '@/hooks/useDocuments';
import { documentsApi } from '@/lib/api/documents.api';
import { entitiesApi, EntityType } from '@/lib/api/entities.api';
import { useDebounce } from '@/hooks/useDebounce';
import { TablePagination } from '@/components/ui/table-pagination';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function InboxPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [classificationFilter, setClassificationFilter] = useState<string>('all');
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [decreeDialogOpen, setDecreeDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fetch all entities for filtering
  const { data: allEntities = [] } = useQuery({
    queryKey: ['entities'],
    queryFn: entitiesApi.getAll,
  });

  // Filter embassies from all entities
  const embassies = allEntities.filter((entity) => entity.type === EntityType.EMBASSY && entity.isActive);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebounce(search, 500);

  // Build query parameters
  const queryParams = useMemo(() => ({
    page: currentPage,
    limit: pageSize,
    search: debouncedSearch || undefined,
    entityId: entityFilter !== 'all' ? entityFilter : undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    classification: classificationFilter !== 'all' ? classificationFilter : undefined,
  }), [currentPage, pageSize, debouncedSearch, entityFilter, statusFilter, classificationFilter]);

  // Reset to first page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [debouncedSearch, entityFilter, statusFilter, classificationFilter, entityTypeFilter]);

  // Reset entity type filter when switching to Internal classification
  useMemo(() => {
    if (classificationFilter === 'INTERNAL') {
      setEntityTypeFilter('all');
      setEntityFilter('all');
    }
  }, [classificationFilter]);

  // Fetch inbox documents with real API
  const { data: inboxData, isLoading: loading } = useInboxDocuments(queryParams);

  // Archive document mutation
  const archiveDocument = useArchiveDocument();

  const documents = inboxData?.data || [];
  const filteredDocs = documents; // Already filtered by API

  const openAIPanel = (doc: any) => {
    setSelectedDocument(doc);
    setAiPanelOpen(true);
  };

  const openDecreeDialog = (doc: any) => {
    setSelectedDocument(doc);
    setDecreeDialogOpen(true);
  };

  const handleEdit = (doc: any) => {
    setSelectedDocument(doc);
    setEditDialogOpen(true);
  };

  const handleDelete = (doc: any) => {
    setSelectedDocument(doc);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedDocument) {
      archiveDocument.mutate(selectedDocument.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setSelectedDocument(null);
        },
      });
    }
  };

  const handleDownloadPdf = async (doc: any) => {
    try {
      toast.loading('Generando PDF...');
      const pdfBlob = await documentsApi.downloadPdf(doc.id);

      // Create download link
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `documento-${doc.correlativeNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.dismiss();
      toast.success('PDF descargado exitosamente');
    } catch (error) {
      toast.dismiss();
      toast.error('Error al descargar PDF');
      console.error('PDF download error:', error);
    }
  };

  const handlePrint = async (doc: any) => {
    try {
      toast.loading('Preparando impresión...');
      const pdfBlob = await documentsApi.downloadPdf(doc.id);

      // Create URL for PDF
      const url = window.URL.createObjectURL(pdfBlob);

      // Open in new window for printing
      const printWindow = window.open(url, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
          toast.dismiss();
          toast.success('Documento listo para imprimir');
        };
      } else {
        toast.dismiss();
        toast.error('Por favor habilite las ventanas emergentes');
      }

      // Clean up after a delay
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch (error) {
      toast.dismiss();
      toast.error('Error al preparar impresión');
      console.error('Print error:', error);
    }
  };

  const handleBulkDownloadPdfs = async () => {
    if (selectedIds.length === 0) return;

    const selectedDocs = filteredDocs.filter((doc: any) => selectedIds.includes(doc.id));
    toast.loading(`Descargando ${selectedDocs.length} documentos...`);

    try {
      for (const doc of selectedDocs) {
        await handleDownloadPdf(doc);
        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      toast.dismiss();
      toast.success(`${selectedDocs.length} documentos descargados`);
      setSelectedIds([]);
    } catch (error) {
      toast.dismiss();
      toast.error('Error al descargar algunos documentos');
    }
  };

  const handleBulkArchive = async () => {
    if (selectedIds.length === 0) return;

    const confirmed = window.confirm(`¿Archivar ${selectedIds.length} documentos seleccionados?`);
    if (!confirmed) return;

    toast.loading(`Archivando ${selectedIds.length} documentos...`);

    try {
      for (const id of selectedIds) {
        archiveDocument.mutate(id);
      }
      toast.dismiss();
      toast.success(`${selectedIds.length} documentos archivados`);
      setSelectedIds([]);
    } catch (error) {
      toast.dismiss();
      toast.error('Error al archivar algunos documentos');
    }
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
      setSelectedIds(filteredDocs.map((d: any) => d.id));
    }
  };

  const statusLabels: Record<string, string> = {
    DRAFT: 'Borrador',
    PENDING: 'Pendiente',
    IN_PROGRESS: 'En proceso',
    COMPLETED: 'Completado',
    ARCHIVED: 'Archivado',
    REJECTED: 'Rechazado',
  };

  const statusVariants: Record<string, 'warning' | 'info' | 'success' | 'muted' | 'destructive'> = {
    DRAFT: 'muted',
    PENDING: 'warning',
    IN_PROGRESS: 'info',
    COMPLETED: 'success',
    ARCHIVED: 'muted',
    REJECTED: 'destructive',
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

      {/* Classification Tabs - Scrollable on mobile */}
      <div className="flex gap-2 mb-4 animate-fade-in-up overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
        <Button
          variant={classificationFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setClassificationFilter('all')}
          className="rounded-full shrink-0 h-9"
        >
          <FileText className="h-4 w-4 sm:mr-1.5" />
          <span className="hidden sm:inline">Todos</span>
        </Button>
        <Button
          variant={classificationFilter === 'INTERNAL' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setClassificationFilter('INTERNAL')}
          className="rounded-full shrink-0 h-9"
        >
          <Home className="h-4 w-4 sm:mr-1.5" />
          <span className="hidden sm:inline">Internos</span>
        </Button>
        <Button
          variant={classificationFilter === 'EXTERNAL' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setClassificationFilter('EXTERNAL')}
          className="rounded-full shrink-0 h-9"
        >
          <ExternalLink className="h-4 w-4 sm:mr-1.5" />
          <span className="hidden sm:inline">Externos</span>
        </Button>
      </div>

      {/* Filters - Stack on mobile */}
      <div className="flex flex-col gap-2 mb-4 sm:mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('common.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-11 text-base sm:text-sm"
          />
        </div>
        {/* Filter dropdowns - side by side on mobile */}
        <div className="grid grid-cols-2 sm:flex gap-2">
          <Select value={entityFilter} onValueChange={setEntityFilter}>
            <SelectTrigger className="h-10 text-xs sm:text-sm sm:w-48">
              <SelectValue placeholder="Entidad" />
            </SelectTrigger>
            <SelectContent className="max-h-[60vh] sm:max-h-80">
              <SelectItem value="all">{t('inbox.all_entities')}</SelectItem>
              {/* Group by entity type */}
              {(['internal', 'public', 'private', 'government'] as const).map(type => {
                const typeEntities = entities.filter(e => e.type === type);
                if (typeEntities.length === 0) return null;
                return (
                  <SelectGroup key={type}>
                    <SelectLabel className="flex items-center gap-1.5 text-xs text-muted-foreground py-1.5">
                      {type === 'internal' && <Home className="h-3 w-3" />}
                      {type === 'public' && <Landmark className="h-3 w-3" />}
                      {type === 'private' && <Briefcase className="h-3 w-3" />}
                      {type === 'government' && <Building2 className="h-3 w-3" />}
                      {entityTypeLabels[type]}
                    </SelectLabel>
                    {typeEntities.map(entity => (
                      <SelectItem key={entity.id} value={entity.id}>
                        <span className="flex items-center gap-2">
                          <span
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{ backgroundColor: entity.color }}
                          />
                          <span className="truncate text-xs sm:text-sm">{entity.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                );
              })}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-10 text-xs sm:text-sm sm:w-36">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('inbox.all_statuses')}</SelectItem>
              <SelectItem value="DRAFT">Borrador</SelectItem>
              <SelectItem value="PENDING">Pendiente</SelectItem>
              <SelectItem value="IN_PROGRESS">En proceso</SelectItem>
              <SelectItem value="COMPLETED">Completado</SelectItem>
              <SelectItem value="ARCHIVED">Archivado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Embassy Filter - Only show for External classification */}
        {classificationFilter === 'EXTERNAL' && (
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={entityTypeFilter} onValueChange={(value) => {
              setEntityTypeFilter(value);
              // Reset entity filter when type changes
              if (value !== 'EMBASSY') {
                setEntityFilter('all');
              }
            }}>
              <SelectTrigger className="h-10 text-xs sm:text-sm sm:w-full">
                <SelectValue placeholder="Tipo de Entidad Externa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="EMBASSY">🏛️ Embajadas</SelectItem>
                <SelectItem value="PUBLIC_COMPANY">🏢 Empresas Públicas</SelectItem>
                <SelectItem value="PRIVATE_COMPANY">💼 Empresas Privadas</SelectItem>
                <SelectItem value="INTERNATIONAL_ORG">🌍 Organizaciones Internacionales</SelectItem>
                <SelectItem value="GOVERNMENT_MINISTRY">🏛️ Ministerios</SelectItem>
              </SelectContent>
            </Select>

            {/* Specific Embassy Selector - Only show when EMBASSY is selected */}
            {entityTypeFilter === 'EMBASSY' && embassies.length > 0 && (
              <Select value={entityFilter} onValueChange={setEntityFilter}>
                <SelectTrigger className="h-10 text-xs sm:text-sm sm:w-full">
                  <SelectValue placeholder="Seleccionar Embajada" />
                </SelectTrigger>
                <SelectContent className="max-h-[60vh] sm:max-h-80">
                  <SelectItem value="all">Todas las embajadas ({embassies.length})</SelectItem>
                  {embassies.map((embassy) => (
                    <SelectItem key={embassy.id} value={embassy.id}>
                      <span className="flex items-center gap-2">
                        <span className="text-base">🏳️</span>
                        <span className="truncate text-xs sm:text-sm">{embassy.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}
      </div>

      {/* Bulk actions */}
      {selectedIds.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg animate-fade-in shadow-sm">
          <span className="text-sm font-medium">
            {selectedIds.length} documento(s) seleccionado(s)
          </span>
          <div className="flex gap-2 sm:ml-auto flex-wrap">
            <Button variant="outline" size="sm" onClick={handleBulkDownloadPdfs} className="flex-1 sm:flex-none">
              <Download className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Descargar PDFs</span>
              <span className="sm:hidden">PDFs</span>
            </Button>
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
              <UserPlus className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Asignar</span>
              <span className="sm:hidden">Asignar</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkArchive}
              className="flex-1 sm:flex-none text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Archivar</span>
              <span className="sm:hidden">Archivar</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedIds([])}
              className="flex-1 sm:flex-none"
            >
              Cancelar
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
                {filteredDocs.map((doc: any, index: number) => {
                  const entity = doc.entity; // Backend returns entity directly
                  const responsible = doc.responsible; // Backend returns responsible user directly
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
                            style={{ backgroundColor: entity?.color || '#6366f1' }}
                          >
                            {entity?.shortName || entity?.name?.substring(0, 2)?.toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <span className="text-sm block truncate">{entity?.name}</span>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              {entity?.type === 'INTERNAL_DEPARTMENT' && <><Home className="h-2.5 w-2.5" />Interno</>}
                              {entity?.type === 'PUBLIC_COMPANY' && <><Landmark className="h-2.5 w-2.5" />Empresa Pública</>}
                              {entity?.type === 'PRIVATE_COMPANY' && <><Briefcase className="h-2.5 w-2.5" />Privada</>}
                              {entity?.type === 'GOVERNMENT_MINISTRY' && <><Building2 className="h-2.5 w-2.5" />Gobierno</>}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{responsible?.firstName} {responsible?.lastName}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(doc.createdAt), 'dd MMM yyyy', { locale: es })}
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
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDownloadPdf(doc)}>
                              <Download className="h-4 w-4 mr-2 text-blue-600" />
                              Descargar PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlePrint(doc)}>
                              <Printer className="h-4 w-4 mr-2 text-green-600" />
                              Imprimir
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEdit(doc)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(doc)} className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Archivar
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

          {/* Mobile Card List - Compact iPhone-optimized design */}
          <div className="md:hidden space-y-2">
            {filteredDocs.map((doc: any, index: number) => {
              const entity = doc.entity; // Backend returns entity directly
              const isSelected = selectedIds.includes(doc.id);
              return (
                <div
                  key={doc.id}
                  className={`
                    relative bg-card rounded-xl border overflow-hidden
                    transition-all duration-200 ease-out
                    active:scale-[0.99] active:bg-muted/50
                    ${isSelected ? 'border-primary bg-primary/5 shadow-sm' : 'border-border'}
                  `}
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  {/* Status accent bar */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-0.5 ${
                      doc.status === 'PENDING' ? 'bg-warning' :
                      doc.status === 'IN_PROGRESS' ? 'bg-info' :
                      doc.status === 'COMPLETED' ? 'bg-success' : 'bg-muted'
                    }`}
                  />

                  <div className="p-3">
                    {/* Header row */}
                    <div className="flex items-start gap-2.5">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleSelect(doc.id)}
                        className="mt-1 h-4 w-4"
                      />
                      <div className="flex-1 min-w-0">
                        {/* Title and status */}
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-medium text-[13px] leading-tight line-clamp-2 flex-1">{doc.title}</h3>
                          <StatusBadge
                            variant={statusVariants[doc.status]}
                            className="shrink-0 text-[9px] px-1.5 py-0.5 h-5"
                          >
                            {statusLabels[doc.status]}
                          </StatusBadge>
                        </div>

                        {/* Entity row - compact */}
                        <div className="mt-2 flex items-center gap-2">
                          <div
                            className="h-6 w-6 rounded-md text-[9px] font-bold flex items-center justify-center text-white shrink-0"
                            style={{ backgroundColor: entity?.color || '#6366f1' }}
                          >
                            {entity?.shortName?.slice(0, 3) || entity?.name?.substring(0, 3)?.toUpperCase()}
                          </div>
                          <span className="text-xs text-muted-foreground truncate flex-1">{entity?.name}</span>
                          <span className="text-[10px] text-muted-foreground shrink-0">
                            {format(new Date(doc.createdAt), 'dd/MM', { locale: es })}
                          </span>
                        </div>

                        {/* Badges row - minimal */}
                        <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                          <Badge
                            variant={doc.classification === 'internal' ? 'secondary' : 'outline'}
                            className="text-[9px] h-5 px-1.5"
                          >
                            {doc.classification === 'internal' ? 'Int' : 'Ext'}
                          </Badge>
                          {doc.aiSummary && (
                            <Badge variant="outline" className="text-[9px] h-5 px-1.5 text-primary border-primary/30">
                              <Sparkles className="h-2.5 w-2.5 mr-0.5" />IA
                            </Badge>
                          )}
                          {doc.decretedTo && doc.decretedTo.length > 0 && (
                            <Badge variant="outline" className="text-[9px] h-5 px-1.5 text-orange-500 border-orange-500/30">
                              <Building2 className="h-2.5 w-2.5 mr-0.5" />{doc.decretedTo.length}
                            </Badge>
                          )}

                          {/* Quick actions - inline */}
                          <div className="ml-auto flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 rounded-md"
                              onClick={(e) => { e.stopPropagation(); openAIPanel(doc); }}
                            >
                              <Sparkles className="h-3.5 w-3.5 text-primary" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 rounded-md"
                              onClick={(e) => { e.stopPropagation(); openDecreeDialog(doc); }}
                            >
                              <Building2 className="h-3.5 w-3.5 text-orange-500" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-md">
                                  <MoreHorizontal className="h-3.5 w-3.5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuItem className="py-2 text-xs" onClick={() => openAIPanel(doc)}>
                                  <Sparkles className="h-3.5 w-3.5 mr-2 text-primary" />
                                  Ver resumen IA
                                </DropdownMenuItem>
                                <DropdownMenuItem className="py-2 text-xs" onClick={() => openDecreeDialog(doc)}>
                                  <Building2 className="h-3.5 w-3.5 mr-2 text-orange-500" />
                                  Decretar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="py-2 text-xs">
                                  <FolderOpen className="h-3.5 w-3.5 mr-2" />
                                  Expediente
                                </DropdownMenuItem>
                                <DropdownMenuItem className="py-2 text-xs">
                                  <UserPlus className="h-3.5 w-3.5 mr-2" />
                                  Asignar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="py-2 text-xs" onClick={() => handleDownloadPdf(doc)}>
                                  <Download className="h-3.5 w-3.5 mr-2 text-blue-600" />
                                  PDF
                                </DropdownMenuItem>
                                <DropdownMenuItem className="py-2 text-xs" onClick={() => handlePrint(doc)}>
                                  <Printer className="h-3.5 w-3.5 mr-2 text-green-600" />
                                  Imprimir
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="py-2 text-xs" onClick={() => handleEdit(doc)}>
                                  <Edit className="h-3.5 w-3.5 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem className="py-2 text-xs text-red-600" onClick={() => handleDelete(doc)}>
                                  <Trash2 className="h-3.5 w-3.5 mr-2" />
                                  Archivar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Pagination */}
      {!loading && filteredDocs.length > 0 && inboxData?.meta && (
        <div className="mt-6">
          <TablePagination
            currentPage={currentPage}
            totalPages={inboxData.meta.totalPages || 1}
            pageSize={pageSize}
            totalItems={inboxData.meta.total || filteredDocs.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
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

      {/* Edit Document Dialog */}
      {selectedDocument && (
        <EditDocumentDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          document={selectedDocument}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Archivar documento?</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedDocument && (
                <>
                  ¿Está seguro de que desea archivar el documento "{selectedDocument.title}"?
                  <br />
                  <span className="text-xs text-muted-foreground">
                    Número: {selectedDocument.correlativeNumber}
                  </span>
                  <br /><br />
                  El documento será movido a archivados y podrá restaurarse más tarde.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={archiveDocument.isPending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={archiveDocument.isPending}
            >
              {archiveDocument.isPending ? 'Archivando...' : 'Archivar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}
