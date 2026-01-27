import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  FileText,
  ChevronRight,
  ArrowLeft,
  Download,
  Eye,
  Calendar,
  User,
  Tag,
  FolderOpen
} from 'lucide-react';
import { entitiesApi } from '@/lib/api/entities.api';
import { documentsApi } from '@/lib/api/documents.api';
import { useDocuments } from '@/hooks/useDocuments';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function ArchivePage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  // Fetch entities
  const { data: entities = [] } = useQuery({
    queryKey: ['entities'],
    queryFn: entitiesApi.getAll,
  });

  // Fetch archived documents
  const { data: documentsData } = useDocuments({
    status: 'ARCHIVED',
    entityId: selectedEntity?.id,
    search: searchQuery || undefined,
  });

  const archivedDocuments = documentsData?.data || [];

  // Count documents by entity
  const getDocumentCountByEntity = (entityId: string) => {
    const entityDocs = archivedDocuments.filter((d: any) => d.entityId === entityId);
    return entityDocs.length;
  };

  const filteredEntities = entities.filter(entity =>
    entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entity.shortName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDocuments = selectedEntity
    ? archivedDocuments.filter((doc: any) =>
        doc.entityId === selectedEntity.id &&
        (doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.correlativeNumber.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const handleOpenDocument = (doc: any) => {
    setSelectedDocument(doc);
    setViewerOpen(true);
  };

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

  const statusLabels: Record<string, string> = {
    ARCHIVED: 'Archivado',
    COMPLETED: 'Completado',
  };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <PageHeader title={t('archive.title')} description={t('archive.description')} />

      {/* Breadcrumb navigation */}
      {selectedEntity && (
        <div className="flex items-center gap-2 mb-4 text-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedEntity(null);
              setSearchQuery('');
            }}
            className="gap-1 h-8 px-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-primary/10">
            <span className="font-medium">{selectedEntity.name}</span>
          </div>
        </div>
      )}

      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={selectedEntity ? 'Buscar documentos...' : t('archive.search_archive')}
          className="pl-9 max-w-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Entity folders view */}
      {!selectedEntity ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEntities.map(entity => {
            const docCount = getDocumentCountByEntity(entity.id);
            return (
              <Card
                key={entity.id}
                className="cursor-pointer hover:border-primary/20 transition-all hover:shadow-md"
                onClick={() => setSelectedEntity(entity)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {entity.shortName?.substring(0, 2) || entity.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{entity.name}</h3>
                      <p className="text-sm text-muted-foreground">{docCount} documentos</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Documents list view */
        <div className="space-y-3">
          {filteredDocuments.length === 0 ? (
            <Card>
              <CardContent className="p-12">
                <div className="empty-state">
                  <FolderOpen className="empty-state-icon" />
                  <h3 className="empty-state-title">No hay documentos</h3>
                  <p className="empty-state-description">
                    No se encontraron documentos archivados en esta carpeta
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredDocuments.map((doc: any) => {
              return (
                <Card
                  key={doc.id}
                  className="cursor-pointer hover:border-primary/20 transition-all hover:shadow-md"
                  onClick={() => handleOpenDocument(doc)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-medium truncate">{doc.title}</h3>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {doc.correlativeNumber} · {doc.type}
                            </p>
                          </div>
                          <Badge variant="secondary">{statusLabels[doc.status] || doc.status}</Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(doc.createdAt), 'dd MMM yyyy', { locale: es })}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {doc.responsible ? `${doc.responsible.firstName} ${doc.responsible.lastName}` : 'N/A'}
                          </span>
                          {doc.tags && doc.tags.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {doc.tags.slice(0, 2).join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="shrink-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* Document viewer dialog */}
      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <FileText className="h-5 w-5" />
              {selectedDocument?.title}
            </DialogTitle>
          </DialogHeader>

          {selectedDocument && (
            <Tabs defaultValue="preview" className="mt-4">
              <TabsList>
                <TabsTrigger value="preview">Vista previa</TabsTrigger>
                <TabsTrigger value="metadata">Metadatos</TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="mt-4">
                <ScrollArea className="h-[60vh] border rounded-lg">
                  <div className="p-6 bg-white">
                    {/* Document header */}
                    <div className="text-center border-b pb-4 mb-6">
                      <p className="text-xs text-muted-foreground mb-2">
                        {selectedDocument.correlativeNumber}
                      </p>
                      <h2 className="text-xl font-semibold">{selectedDocument.title}</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedDocument.type} · {format(new Date(selectedDocument.createdAt), 'dd MMMM yyyy', { locale: es })}
                      </p>
                    </div>

                    {/* Document content */}
                    <div className="prose prose-sm max-w-none whitespace-pre-wrap font-serif">
                      {selectedDocument.content ||
                        'El contenido de este documento no está disponible para vista previa. Por favor, descargue el documento para ver su contenido completo.'}
                    </div>
                  </div>
                </ScrollArea>

                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setViewerOpen(false)}>
                    Cerrar
                  </Button>
                  <Button onClick={() => handleDownloadPdf(selectedDocument)}>
                    <Download className="h-4 w-4 mr-2" />
                    Descargar PDF
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="metadata" className="mt-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <h4 className="font-medium text-sm text-muted-foreground">Información general</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Número correlativo</span>
                          <span className="font-medium">{selectedDocument.correlativeNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tipo</span>
                          <span className="font-medium">{selectedDocument.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Dirección</span>
                          <span className="font-medium">{selectedDocument.direction === 'IN' ? 'Entrada' : 'Salida'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Canal</span>
                          <span className="font-medium">{selectedDocument.channel || 'N/A'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <h4 className="font-medium text-sm text-muted-foreground">Fechas y responsables</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Fecha de creación</span>
                          <span className="font-medium">{format(new Date(selectedDocument.createdAt), 'dd/MM/yyyy')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Última actualización</span>
                          <span className="font-medium">{format(new Date(selectedDocument.updatedAt), 'dd/MM/yyyy')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Responsable</span>
                          <span className="font-medium">
                            {selectedDocument.responsible ? `${selectedDocument.responsible.firstName} ${selectedDocument.responsible.lastName}` : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Entidad</span>
                          <span className="font-medium">{selectedDocument.entity?.name || 'N/A'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="sm:col-span-2">
                    <CardContent className="p-4 space-y-3">
                      <h4 className="font-medium text-sm text-muted-foreground">Etiquetas</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedDocument.tags && selectedDocument.tags.length > 0 ? (
                          selectedDocument.tags.map((tag: string) => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">Sin etiquetas</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
