import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTableSkeleton } from '@/components/ui/data-table-skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
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
  Plus,
  Search,
  MoreHorizontal,
  Bot,
  PenTool,
  Send,
  Eye,
  Edit,
  Trash2,
  Download,
  Printer,
} from 'lucide-react';
import { EditDocumentDialog } from '@/components/documents/EditDocumentDialog';
import { useOutboxDocuments, useArchiveDocument } from '@/hooks/useDocuments';
import { entitiesApi } from '@/lib/api/entities.api';
import { usersApi } from '@/lib/api/users.api';
import { documentsApi } from '@/lib/api/documents.api';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function OutboxPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);

  // Fetch documents
  const { data, isLoading } = useOutboxDocuments({
    search: search || undefined,
    entityId: entityFilter !== 'all' ? entityFilter : undefined,
  });

  // Fetch entities
  const { data: entities = [] } = useQuery({
    queryKey: ['entities'],
    queryFn: entitiesApi.getAll,
  });

  // Mutations
  const archiveDocument = useArchiveDocument();

  const documents = data?.data || [];
  const filteredDocs = documents;

  // Handle PDF download
  const handleDownloadPdf = async (doc: any) => {
    try {
      toast.loading('Generando PDF...');
      const pdfBlob = await documentsApi.downloadPdf(doc.id);
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
    }
  };

  // Handle print
  const handlePrint = async (doc: any) => {
    try {
      toast.loading('Preparando documento para imprimir...');
      const pdfBlob = await documentsApi.downloadPdf(doc.id);
      const url = window.URL.createObjectURL(pdfBlob);
      const printWindow = window.open(url, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
          toast.dismiss();
          toast.success('Documento listo para imprimir');
        };
      } else {
        toast.dismiss();
        toast.error('No se pudo abrir la ventana de impresión');
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Error al preparar documento para impresión');
    }
  };

  // Handle edit
  const handleEdit = (doc: any) => {
    setSelectedDocument(doc);
    setEditDialogOpen(true);
  };

  // Handle delete
  const handleDelete = (doc: any) => {
    setSelectedDocument(doc);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedDocument) {
      archiveDocument.mutate(selectedDocument.id);
      setDeleteDialogOpen(false);
      setSelectedDocument(null);
    }
  };

  // Batch operations
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredDocs.map((doc: any) => doc.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  const handleBulkDownloadPdfs = async () => {
    const selectedDocs = filteredDocs.filter((doc: any) => selectedIds.includes(doc.id));
    toast.loading(`Descargando ${selectedDocs.length} documentos...`);

    for (const doc of selectedDocs) {
      await handleDownloadPdf(doc);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    toast.dismiss();
    toast.success(`${selectedDocs.length} documentos descargados`);
    setSelectedIds([]);
  };

  const handleBulkArchive = async () => {
    const confirmed = window.confirm(`¿Archivar ${selectedIds.length} documentos seleccionados?`);
    if (!confirmed) return;

    for (const id of selectedIds) {
      archiveDocument.mutate(id);
    }

    toast.success(`${selectedIds.length} documentos archivados`);
    setSelectedIds([]);
  };

  const statusLabels: Record<string, string> = {
    DRAFT: 'Borrador',
    PENDING: 'Pendiente',
    IN_PROGRESS: 'En progreso',
    COMPLETED: 'Completado',
    ARCHIVED: 'Archivado',
    REJECTED: 'Rechazado',
  };

  const statusVariants: Record<string, 'warning' | 'info' | 'success' | 'muted' | 'destructive'> = {
    DRAFT: 'warning',
    PENDING: 'warning',
    IN_PROGRESS: 'info',
    COMPLETED: 'success',
    ARCHIVED: 'muted',
    REJECTED: 'destructive',
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
            {entities.filter(e => e.isActive).map(entity => (
              <SelectItem key={entity.id} value={entity.id}>{entity.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bulk actions toolbar */}
      {selectedIds.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <span className="text-sm font-medium">
            {selectedIds.length} documento(s) seleccionado(s)
          </span>
          <div className="flex gap-2 sm:ml-auto flex-wrap">
            <Button variant="outline" size="sm" onClick={handleBulkDownloadPdfs}>
              <Download className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Descargar PDFs</span>
              <span className="sm:hidden">PDFs</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleBulkArchive} className="text-red-600">
              <Trash2 className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Archivar</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSelectedIds([])}>
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <DataTableSkeleton columns={6} rows={5} />
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
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedIds.length === filteredDocs.length && filteredDocs.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Destinatario</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocs.map((doc: any) => (
                <TableRow key={doc.id} className="group">
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(doc.id)}
                      onCheckedChange={(checked) => handleSelectOne(doc.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{doc.title}</p>
                      <p className="text-xs text-muted-foreground">{doc.correlativeNumber}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{doc.entity?.name || 'N/A'}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {doc.responsible ? `${doc.responsible.firstName} ${doc.responsible.lastName}` : 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(doc.createdAt), 'dd MMM yyyy', { locale: es })}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge variant={statusVariants[doc.status] || 'muted'}>
                      {statusLabels[doc.status] || doc.status}
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
                        <DropdownMenuItem>
                          <PenTool className="h-4 w-4 mr-2" />
                          Enviar a firma
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(doc)} className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Archivar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit Dialog */}
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
              Esta acción moverá el documento "{selectedDocument?.title}" al archivo.
              Podrá recuperarlo desde la sección de Archivo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Archivar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
