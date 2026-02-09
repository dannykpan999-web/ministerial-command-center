import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import {
  FileText,
  Download,
  Trash2,
  Upload,
  Calendar,
  User,
  Building,
  Clock,
  AlertCircle,
  FileUp,
  History,
  Edit,
  MoreVertical,
  RefreshCw,
  ScanText,
  Copy,
  Sparkles,
  UserPlus,
} from 'lucide-react';
import { documentsApi } from '@/lib/api/documents.api';
import { FileUpload, type UploadedFile } from '@/components/documents/FileUpload';
import { FileReplaceDialog } from '@/components/documents/FileReplaceDialog';
import { FileVersionHistory } from '@/components/documents/FileVersionHistory';
import { DocumentAnalysisDialog } from '@/components/documents/DocumentAnalysisDialog';
import { AssignDialog } from '@/components/documents/AssignDialog';
import { WorkflowTimeline } from '@/components/workflow/WorkflowTimeline';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DocumentDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentId: string;
  onEdit?: (document: any) => void;
}

export function DocumentDetailSheet({
  open,
  onOpenChange,
  documentId,
  onEdit,
}: DocumentDetailSheetProps) {
  const queryClient = useQueryClient();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [replaceDialogOpen, setReplaceDialogOpen] = useState(false);
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [extractedOcrText, setExtractedOcrText] = useState<string>('');
  const [analysisDialogOpen, setAnalysisDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  // Fetch document details
  const { data: document, isLoading } = useQuery({
    queryKey: ['document', documentId],
    queryFn: () => documentsApi.findOne(documentId),
    enabled: open && !!documentId,
  });

  // Upload files mutation
  const uploadFilesMutation = useMutation({
    mutationFn: async (files: File[]) => {
      return documentsApi.uploadFiles(documentId, files);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['document', documentId] });
      toast.success('Archivos subidos exitosamente');
      setUploadedFiles([]);

      // Capture extracted OCR text
      if (data.extractedText && data.extractedText.trim().length > 0) {
        setExtractedOcrText(data.extractedText);
        toast.success(`OCR completado: ${data.extractedText.length} caracteres extraídos`, {
          description: 'El texto extraído se muestra debajo.',
        });
      }
    },
    onError: (error: any) => {
      toast.error('Error al subir archivos: ' + (error.response?.data?.message || error.message));
    },
  });

  // Delete file mutation
  const deleteFileMutation = useMutation({
    mutationFn: async (fileId: string) => {
      return documentsApi.deleteFile(documentId, fileId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document', documentId] });
      toast.success('Archivo eliminado exitosamente');
    },
    onError: (error: any) => {
      toast.error('Error al eliminar archivo: ' + (error.response?.data?.message || error.message));
    },
  });

  // Convert file mutation
  const convertFileMutation = useMutation({
    mutationFn: async ({ fileId, targetFormat }: { fileId: string; targetFormat: 'pdf' | 'docx' | 'xlsx' }) => {
      return documentsApi.convertFile(fileId, targetFormat);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document', documentId] });
      toast.success('Archivo convertido exitosamente');
    },
    onError: (error: any) => {
      toast.error('Error al convertir archivo: ' + (error.response?.data?.message || error.message));
    },
  });

  const handleUploadFiles = async () => {
    const filesToUpload = uploadedFiles.filter((f) => f.file).map((f) => f.file!);

    if (filesToUpload.length === 0) {
      toast.error('Por favor seleccione archivos para subir');
      return;
    }

    setUploadingFiles(true);
    try {
      await uploadFilesMutation.mutateAsync(filesToUpload);
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleDownloadFile = async (file: any) => {
    try {
      const fileName = file.fileName || file.storagePath?.split('/').pop() || 'download';

      // Download file directly from backend
      const blob = await documentsApi.downloadFile(file.id);

      if (!blob) {
        toast.error('Error al descargar el archivo');
        return;
      }

      // Create download link using simpler approach
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.style.display = 'none';
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Archivo descargado correctamente');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Error al descargar el archivo');
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('¿Está seguro que desea eliminar este archivo?')) {
      return;
    }

    try {
      await deleteFileMutation.mutateAsync(fileId);
    } catch (error) {
      // Error already handled in mutation
    }
  };

  const handleConvertFile = async (file: any) => {
    // Determine target format based on current file type
    // Note: Backend only supports conversions TO PDF (Word→PDF, Excel→PDF)
    // PDF→Word conversion is NOT supported by LibreOffice service
    const targetFormat: 'pdf' = 'pdf';
    const mimeType = file.mimeType?.toLowerCase() || '';
    const fileName = (file.fileName || '').toLowerCase();

    // Only allow conversions from Word/Excel/PowerPoint to PDF
    const isPdf = mimeType.includes('pdf') || fileName.endsWith('.pdf');
    if (isPdf) {
      toast.error('La conversión desde PDF no está soportada. Solo se puede convertir a PDF.');
      return;
    }

    const isWord = mimeType.includes('word') || mimeType.includes('document') || fileName.endsWith('.doc') || fileName.endsWith('.docx');
    const isExcel = mimeType.includes('excel') || mimeType.includes('spreadsheet') || fileName.endsWith('.xls') || fileName.endsWith('.xlsx');
    const isPowerPoint = mimeType.includes('powerpoint') || mimeType.includes('presentation') || fileName.endsWith('.ppt') || fileName.endsWith('.pptx');

    if (!isWord && !isExcel && !isPowerPoint) {
      toast.error('Este tipo de archivo no soporta conversión a PDF');
      return;
    }

    if (!confirm('¿Convertir este archivo a PDF?')) {
      return;
    }

    toast.loading('Convirtiendo archivo a PDF...');

    try {
      const result = await convertFileMutation.mutateAsync({ fileId: file.id, targetFormat });
      toast.dismiss();

      // Check if conversion actually succeeded
      if (result && !result.success) {
        toast.error(result.error || 'Error en la conversión');
        return;
      }

      toast.success('Archivo convertido exitosamente');

      // Force refetch document to show new converted file
      await queryClient.refetchQueries({ queryKey: ['document', documentId] });
    } catch (error) {
      toast.dismiss();
      // Error already handled in mutation
    }
  };

  const handleOpenReplaceDialog = (file: any) => {
    setSelectedFile(file);
    setReplaceDialogOpen(true);
  };

  const handleOpenVersionHistory = (file: any) => {
    setSelectedFile(file);
    setVersionHistoryOpen(true);
  };

  const handleFileReplaced = () => {
    queryClient.invalidateQueries({ queryKey: ['document', documentId] });
    setReplaceDialogOpen(false);
  };

  const handleVersionRestored = () => {
    queryClient.invalidateQueries({ queryKey: ['document', documentId] });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'destructive';
      case 'HIGH':
        return 'default';
      case 'MEDIUM':
        return 'secondary';
      case 'LOW':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'Urgente';
      case 'HIGH':
        return 'Alta';
      case 'MEDIUM':
        return 'Media';
      case 'LOW':
        return 'Baja';
      default:
        return priority;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'Borrador';
      case 'PENDING':
        return 'Pendiente';
      case 'IN_PROGRESS':
        return 'En Progreso';
      case 'COMPLETED':
        return 'Completado';
      case 'ARCHIVED':
        return 'Archivado';
      case 'REJECTED':
        return 'Rechazado';
      default:
        return status;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (isLoading || !document) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-2xl">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Clock className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Cargando documento...</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-hidden flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-xl mb-2 flex items-start justify-between">
            <span className="flex-1">{document?.title}</span>
            <div className="flex gap-2 ml-4">
              {document?.content && document.content.trim().length >= 50 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAnalysisDialogOpen(true)}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Analizar con IA
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAssignDialogOpen(true)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Asignar
              </Button>
              {onEdit && document && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(document)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              )}
            </div>
          </SheetTitle>
          <SheetDescription className="flex items-center gap-2">
            <span className="font-mono text-sm">#{document.correlativeNumber}</span>
            <Badge variant={getPriorityColor(document.priority)}>
              {getPriorityLabel(document.priority)}
            </Badge>
            <Badge variant="outline">{getStatusLabel(document.status)}</Badge>
          </SheetDescription>
        </SheetHeader>

        <Separator className="my-4" />

        <ScrollArea className="flex-1 pr-4">
          {/* Document Information */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Tipo
                </div>
                <p className="text-sm">{document.type}</p>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Fecha de Recepción
                </div>
                <p className="text-sm">
                  {document.receivedAt
                    ? format(new Date(document.receivedAt), 'PPP', { locale: es })
                    : 'No especificada'}
                </p>
              </div>

              {document.entity && (
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Departamento
                  </div>
                  <p className="text-sm">{document.entity.name}</p>
                </div>
              )}

              {document.responsible && (
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Responsable
                  </div>
                  <p className="text-sm">
                    {document.responsible.firstName} {document.responsible.lastName}
                  </p>
                </div>
              )}

              {document.origin && (
                <div className="space-y-1 col-span-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Procedencia
                  </div>
                  <p className="text-sm">{document.origin}</p>
                </div>
              )}

              {document.channel && (
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">
                    Canal
                  </div>
                  <p className="text-sm">{document.channel}</p>
                </div>
              )}

              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">
                  Clasificación
                </div>
                <p className="text-sm">
                  {document.classification === 'INTERNAL' ? 'Interna' : 'Externa'}
                </p>
              </div>
            </div>

            {/* Content */}
            {document.content && (
              <>
                <Separator />
                <div className="space-y-2">
                  <div className="text-sm font-medium">Contenido</div>
                  <div
                    className="text-sm text-muted-foreground prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: document.content }}
                  />
                </div>
              </>
            )}

            {/* AI Summary */}
            {document.aiSummary && (
              <>
                <Separator />
                <div className="space-y-2">
                  <div className="text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Resumen de IA
                  </div>
                  <p className="text-sm text-muted-foreground">{document.aiSummary}</p>
                </div>
              </>
            )}

            {/* FILES SECTION - ARCHIVOS ADJUNTOS */}
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileUp className="h-5 w-5" />
                  Archivos Adjuntos
                </h3>
                <Badge variant="secondary">
                  {document.files?.length || 0} archivo(s)
                </Badge>
              </div>

              {/* File Upload Section */}
              <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
                <Label className="text-sm font-medium">Agregar Archivos</Label>
                <FileUpload
                  files={uploadedFiles}
                  onFilesChange={setUploadedFiles}
                  onTextExtracted={setExtractedOcrText}
                  maxFiles={10}
                  maxSize={50 * 1024 * 1024} // 50MB
                />
                {uploadedFiles.length > 0 && (
                  <Button
                    onClick={handleUploadFiles}
                    disabled={uploadingFiles || uploadFilesMutation.isPending}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploadingFiles ? 'Subiendo...' : `Subir ${uploadedFiles.length} archivo(s)`}
                  </Button>
                )}
              </div>

              {/* OCR Extracted Text Display */}
              {extractedOcrText && extractedOcrText.trim().length > 0 && (
                <Card className="border-green-200 bg-green-50/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2 text-green-800">
                      <ScanText className="h-4 w-4" />
                      Texto Extraído (OCR)
                      <Badge variant="secondary" className="ml-auto">
                        {extractedOcrText.length} caracteres
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Textarea
                      value={extractedOcrText}
                      readOnly
                      className="min-h-[150px] font-mono text-xs bg-white resize-y"
                      placeholder="El texto extraído aparecerá aquí..."
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        try {
                          // Try modern clipboard API first
                          if (navigator.clipboard && navigator.clipboard.writeText) {
                            await navigator.clipboard.writeText(extractedOcrText);
                            toast.success('Texto copiado al portapapeles');
                            return;
                          }
                        } catch (clipboardError) {
                          console.log('Modern clipboard API failed, trying fallback:', clipboardError);
                        }

                        // Fallback for older browsers or HTTP
                        try {
                          const textArea = window.document.createElement('textarea');
                          textArea.value = extractedOcrText;

                          // Make textarea visible but out of viewport
                          textArea.style.position = 'absolute';
                          textArea.style.left = '-9999px';
                          textArea.style.top = '0';
                          textArea.style.opacity = '0';

                          window.document.body.appendChild(textArea);

                          // Select the text
                          textArea.focus();
                          textArea.select();
                          textArea.setSelectionRange(0, extractedOcrText.length);

                          // Execute copy command
                          const successful = window.document.execCommand('copy');

                          // Remove textarea
                          window.document.body.removeChild(textArea);

                          if (successful) {
                            toast.success('Texto copiado al portapapeles');
                          } else {
                            toast.error('Error al copiar texto. Por favor, intente copiar manualmente.');
                          }
                        } catch (error) {
                          console.error('Copy failed:', error);
                          toast.error('Error al copiar texto. Por favor, intente copiar manualmente.');
                        }
                      }}
                      className="w-full"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar Texto
                    </Button>                  </CardContent>
                </Card>
              )}

              {/* Files List */}
              {document.files && document.files.length > 0 ? (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Archivos Existentes</Label>
                  <div className="space-y-2">
                    {document.files.map((file: any) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {file.fileName || file.storagePath?.split('/').pop() || 'Sin nombre'}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{formatFileSize(file.fileSize || file.size || 0)}</span>
                              <span>•</span>
                              <span>
                                {format(new Date(file.createdAt || file.uploadedAt), 'PPp', { locale: es })}
                              </span>
                              {file.version && file.version > 1 && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <History className="h-3 w-3" />
                                    v{file.version}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleDownloadFile(file)}>
                              <Download className="h-4 w-4 mr-2" />
                              Descargar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenReplaceDialog(file)}>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Reemplazar archivo
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenVersionHistory(file)}>
                              <History className="h-4 w-4 mr-2" />
                              Ver historial de versiones
                            </DropdownMenuItem>
                            {((file.mimeType?.toLowerCase().includes('word') || file.mimeType?.toLowerCase().includes('document') || file.fileName?.toLowerCase().endsWith('.doc') || file.fileName?.toLowerCase().endsWith('.docx')) ||
                              (file.mimeType?.toLowerCase().includes('excel') || file.mimeType?.toLowerCase().includes('spreadsheet') || file.fileName?.toLowerCase().endsWith('.xls') || file.fileName?.toLowerCase().endsWith('.xlsx')) ||
                              (file.mimeType?.toLowerCase().includes('powerpoint') || file.mimeType?.toLowerCase().includes('presentation') || file.fileName?.toLowerCase().endsWith('.ppt') || file.fileName?.toLowerCase().endsWith('.pptx'))) && (
                              <DropdownMenuItem
                                onClick={() => handleConvertFile(file)}
                                disabled={convertFileMutation.isPending}
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                Convertir a PDF
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteFile(file.id)}
                              disabled={deleteFileMutation.isPending}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No hay archivos adjuntos</p>
                  <p className="text-xs">Agregue archivos usando el formulario de arriba</p>
                </div>
              )}
            </div>

            {/* WORKFLOW TIMELINE SECTION */}
            <Separator />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Progreso del Flujo de Trabajo
              </h3>
              <WorkflowTimeline document={document} />
            </div>
          </div>
        </ScrollArea>
      </SheetContent>

      {/* File Replace Dialog */}
      {selectedFile && (
        <FileReplaceDialog
          open={replaceDialogOpen}
          onOpenChange={setReplaceDialogOpen}
          documentId={documentId}
          fileId={selectedFile.id}
          fileName={selectedFile.fileName || selectedFile.storagePath?.split('/').pop() || 'archivo'}
          onReplaced={handleFileReplaced}
        />
      )}

      {/* File Version History Dialog */}
      {selectedFile && (
        <FileVersionHistory
          open={versionHistoryOpen}
          onOpenChange={setVersionHistoryOpen}
          fileId={selectedFile.id}
          fileName={selectedFile.fileName || selectedFile.storagePath?.split('/').pop() || 'archivo'}
          onVersionRestored={handleVersionRestored}
        />
      )}

      {/* AI Analysis Dialog */}
      <DocumentAnalysisDialog
        open={analysisDialogOpen}
        onOpenChange={setAnalysisDialogOpen}
        documentId={documentId}
        documentTitle={document?.title || 'Documento'}
      />

      {/* Assign Dialog */}
      <AssignDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        document={document}
      />
    </Sheet>
  );
}

function Label({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-sm font-medium ${className}`}>{children}</div>;
}
