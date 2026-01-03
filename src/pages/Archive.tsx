import { useState } from 'react';
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
import {
  entities,
  documents,
  getEntityById,
  getUserById,
  Document,
  Entity
} from '@/lib/mockData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Archived documents mock
const archivedDocuments: Document[] = [
  ...documents.filter(d => d.status === 'archived' || d.status === 'completed'),
  {
    id: 'arch1',
    correlativeNumber: 'ENT-2023-004521',
    title: 'Resolución de concesión portuaria 2023',
    type: 'Resolución',
    entityId: 'e1',
    responsibleId: 'u2',
    status: 'archived',
    direction: 'in',
    channel: 'Plataforma digital',
    origin: 'Dirección General de Puertos',
    tags: ['Archivo', 'Información'],
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2023-06-20'),
    content: 'RESOLUCIÓN N° 2023-0456\n\nVisto el expediente N° EXP-2023-00234, referente a la solicitud de renovación de concesión portuaria presentada por Terminal Marítima S.A.\n\nCONSIDERANDO:\n\nQue, la empresa solicitante ha cumplido con todos los requisitos establecidos en el Reglamento de Concesiones Portuarias...\n\nSE RESUELVE:\n\nArtículo 1°.- Aprobar la renovación de la concesión portuaria por un período de 10 años.\n\nArtículo 2°.- Notificar a las partes interesadas.\n\nRegistrese, comuníquese y archívese.',
  },
  {
    id: 'arch2',
    correlativeNumber: 'ENT-2023-003892',
    title: 'Informe de auditoría de telecomunicaciones',
    type: 'Informe',
    entityId: 'e2',
    responsibleId: 'u3',
    status: 'archived',
    direction: 'in',
    channel: 'Correo electrónico',
    origin: 'Contraloría General',
    tags: ['Confidencial', 'Archivo'],
    createdAt: new Date('2023-05-10'),
    updatedAt: new Date('2023-05-15'),
    content: 'INFORME DE AUDITORÍA N° 2023-089\n\nOBJETIVO:\nEvaluar el cumplimiento de las obligaciones de los operadores de telecomunicaciones.\n\nALCANCE:\nPeríodo: Enero - Diciembre 2022\n\nRESULTADOS:\n1. Se verificó el cumplimiento del 95% de las obligaciones contractuales.\n2. Se identificaron 3 observaciones menores.\n3. Se recomienda implementar mejoras en el sistema de monitoreo.\n\nCONCLUSIÓN:\nEl sector presenta un nivel satisfactorio de cumplimiento normativo.',
  },
  {
    id: 'arch3',
    correlativeNumber: 'SAL-2023-002341',
    title: 'Convenio marco de cooperación técnica',
    type: 'Acuerdo',
    entityId: 'e3',
    responsibleId: 'u1',
    status: 'archived',
    direction: 'out',
    channel: 'Mensajería física',
    origin: 'Gabinete Ministerial',
    tags: ['Internacional', 'Archivo'],
    createdAt: new Date('2023-04-20'),
    updatedAt: new Date('2023-04-25'),
    content: 'CONVENIO MARCO DE COOPERACIÓN TÉCNICA\n\nEntre el Ministerio de la República y la Agencia de Cooperación Internacional.\n\nCLÁUSULA PRIMERA: OBJETO\nEl presente convenio tiene por objeto establecer las bases de cooperación técnica...\n\nCLÁUSULA SEGUNDA: COMPROMISOS\nAmbas partes se comprometen a:\na) Intercambiar información técnica\nb) Facilitar la participación de expertos\nc) Promover actividades conjuntas\n\nCLÁUSULA TERCERA: VIGENCIA\nEl presente convenio tendrá una vigencia de 3 años.',
  },
];

export default function ArchivePage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const getDocumentsByEntity = (entityId: string) => {
    return archivedDocuments.filter(d => d.entityId === entityId);
  };

  const filteredEntities = entities.filter(entity =>
    entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entity.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDocuments = selectedEntity
    ? getDocumentsByEntity(selectedEntity.id).filter(doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.correlativeNumber.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleOpenDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setViewerOpen(true);
  };

  const statusLabels: Record<string, string> = {
    archived: 'Archivado',
    completed: 'Completado',
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
          <div
            className="flex items-center gap-2 px-2 py-1 rounded-md"
            style={{ backgroundColor: `${selectedEntity.color}15` }}
          >
            <div
              className="h-5 w-5 rounded text-[10px] font-bold flex items-center justify-center text-white"
              style={{ backgroundColor: selectedEntity.color }}
            >
              {selectedEntity.code}
            </div>
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
            const docCount = getDocumentsByEntity(entity.id).length;
            return (
              <Card
                key={entity.id}
                className="cursor-pointer hover:border-primary/20 transition-all hover:shadow-md"
                onClick={() => setSelectedEntity(entity)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div
                      className="h-12 w-12 rounded-lg flex items-center justify-center text-primary-foreground font-bold"
                      style={{ backgroundColor: entity.color }}
                    >
                      {entity.code}
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
            filteredDocuments.map(doc => {
              const responsible = getUserById(doc.responsibleId);
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
                            {format(doc.createdAt, 'dd MMM yyyy', { locale: es })}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {responsible?.name}
                          </span>
                          {doc.tags.length > 0 && (
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
                        {selectedDocument.type} · {format(selectedDocument.createdAt, 'dd MMMM yyyy', { locale: es })}
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
                  <Button>
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
                          <span className="font-medium">{selectedDocument.direction === 'in' ? 'Entrada' : 'Salida'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Canal</span>
                          <span className="font-medium">{selectedDocument.channel}</span>
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
                          <span className="font-medium">{format(selectedDocument.createdAt, 'dd/MM/yyyy')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Última actualización</span>
                          <span className="font-medium">{format(selectedDocument.updatedAt, 'dd/MM/yyyy')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Responsable</span>
                          <span className="font-medium">{getUserById(selectedDocument.responsibleId)?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Entidad</span>
                          <span className="font-medium">{getEntityById(selectedDocument.entityId)?.name}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="sm:col-span-2">
                    <CardContent className="p-4 space-y-3">
                      <h4 className="font-medium text-sm text-muted-foreground">Etiquetas</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedDocument.tags.map(tag => (
                          <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                        {selectedDocument.tags.length === 0 && (
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
