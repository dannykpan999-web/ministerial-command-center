import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FileUpload, type UploadedFile } from '@/components/documents/FileUpload';
import { useCreateDocument } from '@/hooks/useDocuments';
import { entitiesApi } from '@/lib/api/entities.api';
import { usersApi } from '@/lib/api/users.api';
import { documentsApi, type CreateDocumentDto } from '@/lib/api/documents.api';
import { toast as sonnerToast } from 'sonner';
import {
  FileText,
  Check,
  ChevronRight,
  ChevronLeft,
  Save,
  QrCode,
  User,
  Calendar,
  Hash,
  Info,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const steps = [
  { number: 1, title: 'Subir documento', key: 'wizard.step1' },
  { number: 2, title: 'Revisión OCR', key: 'wizard.step2' },
  { number: 3, title: 'Clasificación', key: 'wizard.step3' },
  { number: 4, title: 'Registro oficial', key: 'wizard.step4' },
  { number: 5, title: 'Confirmación', key: 'wizard.step5' },
];

const documentTypes = ['Oficio', 'Memorando', 'Circular', 'Resolución', 'Decreto', 'Informe', 'Solicitud', 'Carta', 'Acuerdo', 'Otro'];
const channels = ['Correo electrónico', 'Plataforma digital', 'Mensajería física', 'Presencial', 'Fax', 'WhatsApp'];
const tags = ['Urgente', 'Confidencial', 'Información', 'Acción requerida', 'FYI', 'Revisión', 'Aprobación'];

export default function NewEntryWizard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [processingOCR, setProcessingOCR] = useState(false);
  const [tempDocumentId, setTempDocumentId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    channel: '',
    origin: '',
    extractedText: '',
    documentType: '',
    entityId: '',
    selectedTags: [] as string[],
    responsibleId: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
    classification: 'EXTERNAL' as 'INTERNAL' | 'EXTERNAL',
  });

  const createDocument = useCreateDocument();

  // Fetch real entities and users
  const { data: entities = [] } = useQuery({
    queryKey: ['entities'],
    queryFn: entitiesApi.getAll,
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getAll,
  });

  // Debug: Log entities and users when loaded
  useEffect(() => {
    if (entities.length > 0) {
      console.log('=== ENTITIES LOADED ===');
      console.log('Total entities:', entities.length);
      console.log('First entity:', entities[0]);
      console.log('First entity ID:', entities[0]?.id);
      console.log('======================');
    }
  }, [entities]);

  useEffect(() => {
    if (users.length > 0) {
      console.log('=== USERS LOADED ===');
      console.log('Total users:', users.length);
      console.log('First user:', users[0]);
      console.log('First user ID:', users[0]?.id);
      console.log('===================');
    }
  }, [users]);

  const updateField = (field: string, value: any) => {
    console.log(`Setting ${field} to:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter(t => t !== tag)
        : [...prev.selectedTags, tag],
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return uploadedFiles.length > 0 && formData.channel && formData.origin && formData.title;
      case 2:
        return true;
      case 3:
        return formData.documentType && formData.entityId;
      case 4:
        return formData.responsibleId;
      default:
        return true;
    }
  };

  // Handle next step - process OCR when moving from Step 1 to Step 2
  const handleNextStep = async () => {
    if (currentStep === 1 && uploadedFiles.length > 0 && !tempDocumentId) {
      // Process OCR before moving to step 2 (only if not already processed)
      await processOCR();
    }
    setCurrentStep(prev => prev + 1);
  };

  // Process OCR: create draft document and upload files
  const processOCR = async () => {
    try {
      setProcessingOCR(true);
      sonnerToast.loading('Procesando OCR y extrayendo texto...');

      // Validate user and entities are loaded
      if (!user || !user.id) {
        throw new Error('Usuario no autenticado');
      }
      if (!entities || entities.length === 0) {
        throw new Error('No hay entidades disponibles');
      }

      // Create a draft document with temporary entityId and responsibleId
      // These will be updated later when user completes Steps 3 and 4
      const draftData: CreateDocumentDto = {
        title: formData.title,
        type: 'Borrador',
        direction: 'IN',
        classification: formData.classification,
        channel: formData.channel,
        origin: formData.origin,
        priority: formData.priority,
        isDraft: true,
        // Temporary values for draft - will be updated in final submission
        entityId: entities[0].id,
        responsibleId: user.id,
      };

      const draft = await documentsApi.create(draftData);
      setTempDocumentId(draft.id);

      // Upload files with OCR
      if (uploadedFiles.length > 0) {
        const filesToUpload = uploadedFiles
          .filter((f) => f.file)
          .map((f) => f.file!);

        const uploadResult = await documentsApi.uploadFiles(draft.id, filesToUpload);

        // Update extracted text
        if (uploadResult.extractedText) {
          updateField('extractedText', uploadResult.extractedText);
          sonnerToast.dismiss();
          sonnerToast.success(`OCR completado: ${uploadResult.extractedText.length} caracteres extraídos`);
        } else {
          sonnerToast.dismiss();
          sonnerToast.info('Archivos subidos. No se extrajo texto.');
        }

        // Update uploaded files with server IDs
        if (uploadResult.files && uploadResult.files.length > 0) {
          const updatedFiles = uploadedFiles.map((localFile) => {
            const serverFile = uploadResult.files.find((sf: any) => sf.fileName === localFile.name);
            if (serverFile) {
              return {
                ...localFile,
                id: serverFile.id,
                url: serverFile.storageUrl,
              };
            }
            return localFile;
          });
          setUploadedFiles(updatedFiles);
        }
      }
    } catch (error: any) {
      console.error('OCR processing error:', error);
      sonnerToast.dismiss();
      sonnerToast.error('Error al procesar OCR: ' + (error.response?.data?.message || 'Error desconocido'));
    } finally {
      setProcessingOCR(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setUploading(true);

      // Validate required fields
      if (!formData.title || formData.title.trim() === '') {
        sonnerToast.error('Por favor ingrese el título del documento');
        setUploading(false);
        return;
      }

      if (!formData.documentType || formData.documentType.trim() === '') {
        sonnerToast.error('Por favor seleccione el tipo de documento');
        setUploading(false);
        return;
      }

      if (!formData.entityId || formData.entityId.trim() === '') {
        sonnerToast.error('Por favor seleccione una entidad');
        setUploading(false);
        return;
      }

      if (!formData.responsibleId || formData.responsibleId.trim() === '') {
        sonnerToast.error('Por favor asigne un responsable');
        setUploading(false);
        return;
      }

      if (!formData.channel || formData.channel.trim() === '') {
        sonnerToast.error('Por favor seleccione el canal de recepción');
        setUploading(false);
        return;
      }

      if (!formData.origin || formData.origin.trim() === '') {
        sonnerToast.error('Por favor ingrese la procedencia');
        setUploading(false);
        return;
      }

      sonnerToast.loading('Registrando documento...');

      let documentId = tempDocumentId;

      // If we have a draft document, update it instead of creating new one
      if (tempDocumentId) {
        const updateData = {
          title: formData.title,
          type: formData.documentType,
          classification: formData.classification,
          channel: formData.channel,
          origin: formData.origin,
          entityId: formData.entityId,
          responsibleId: formData.responsibleId,
          priority: formData.priority,
          content: formData.extractedText || undefined,
          tags: formData.selectedTags,
          isDraft: false,
        };

        await documentsApi.update(tempDocumentId, updateData);
        sonnerToast.dismiss();
        sonnerToast.success('Documento registrado exitosamente');
      } else {
        // Create new document (fallback if OCR wasn't processed)
        const documentData: CreateDocumentDto = {
          title: formData.title,
          type: formData.documentType,
          direction: 'IN',
          classification: formData.classification,
          channel: formData.channel,
          origin: formData.origin,
          entityId: formData.entityId,
          responsibleId: formData.responsibleId,
          priority: formData.priority,
          content: formData.extractedText || undefined,
          tags: formData.selectedTags,
          isDraft: false,
        };

        const createdDoc = await documentsApi.create(documentData);
        documentId = createdDoc.id;

        // Upload files if they weren't uploaded during OCR
        if (uploadedFiles.length > 0 && uploadedFiles.some(f => !f.url)) {
          sonnerToast.loading('Subiendo archivos...');

          const filesToUpload = uploadedFiles
            .filter((f) => f.file && !f.url)
            .map((f) => f.file!);

          if (filesToUpload.length > 0) {
            try {
              await documentsApi.uploadFiles(createdDoc.id, filesToUpload);
            } catch (uploadError: any) {
              console.error('Error uploading files:', uploadError);
              sonnerToast.error('Error al subir archivos: ' + (uploadError.response?.data?.message || 'Error desconocido'));
            }
          }
        }

        sonnerToast.dismiss();
        sonnerToast.success('Documento registrado exitosamente');
      }

      navigate('/inbox');
    } catch (error: any) {
      sonnerToast.dismiss();

      // Enhanced error reporting
      console.error('=== DOCUMENT CREATION ERROR ===');
      console.error('Status:', error.response?.status);
      console.error('Error data:', error.response?.data);

      const errorMessage = error.response?.data?.message;
      if (Array.isArray(errorMessage)) {
        errorMessage.forEach((msg: string) => sonnerToast.error(msg));
      } else if (errorMessage) {
        sonnerToast.error(errorMessage);
      } else {
        sonnerToast.error('Error al registrar documento');
      }
    } finally {
      setUploading(false);
    }
  };

  const correlativeNumber = 'ENT-2024-001543';
  const registrationDate = new Date();

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-in">
      <PageHeader
        title={t('inbox.register_new')}
        description="Complete los pasos para registrar un nuevo documento de entrada"
      />

      {/* Stepper */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="wizard-step">
              <div
                className={cn(
                  'wizard-step-number',
                  currentStep === step.number && 'wizard-step-number-active',
                  currentStep > step.number && 'wizard-step-number-complete',
                  currentStep < step.number && 'wizard-step-number-pending'
                )}
              >
                {currentStep > step.number ? <Check className="h-4 w-4" /> : step.number}
              </div>
              <span className={cn(
                'text-sm hidden sm:inline',
                currentStep === step.number ? 'font-medium text-foreground' : 'text-muted-foreground'
              )}>
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                'h-px w-8 sm:w-16 mx-2',
                currentStep > step.number ? 'bg-success' : 'bg-border'
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          {/* Step 1: Upload */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Título del documento *</Label>
                <Input
                  placeholder="Ej: Solicitud de ampliación de concesión portuaria"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Archivos del documento</Label>
                <FileUpload
                  existingFiles={uploadedFiles}
                  onFilesChange={setUploadedFiles}
                  maxSize={10}
                  acceptedTypes={[
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'image/jpeg',
                    'image/png',
                    'image/jpg',
                  ]}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t('wizard.channel')} *</Label>
                  <Select value={formData.channel} onValueChange={(v) => updateField('channel', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar canal" />
                    </SelectTrigger>
                    <SelectContent>
                      {channels.map(channel => (
                        <SelectItem key={channel} value={channel}>{channel}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t('wizard.origin')} *</Label>
                  <Input
                    placeholder="Nombre o entidad de origen"
                    value={formData.origin}
                    onChange={(e) => updateField('origin', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Clasificación *</Label>
                  <Select value={formData.classification} onValueChange={(v: 'INTERNAL' | 'EXTERNAL') => updateField('classification', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INTERNAL">📋 Interna</SelectItem>
                      <SelectItem value="EXTERNAL">🌍 Externa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Prioridad</Label>
                  <Select value={formData.priority} onValueChange={(v: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT') => updateField('priority', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">🟢 Baja</SelectItem>
                      <SelectItem value="MEDIUM">🟡 Media</SelectItem>
                      <SelectItem value="HIGH">🟠 Alta</SelectItem>
                      <SelectItem value="URGENT">🔴 Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: OCR Review */}
          {currentStep === 2 && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-2">
                <Label>{t('wizard.ocr_original')}</Label>
                <div className="h-80 bg-muted rounded-lg border overflow-hidden">
                  {processingOCR ? (
                    <div className="h-full flex flex-col items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                      <p className="text-sm text-muted-foreground">Procesando OCR...</p>
                    </div>
                  ) : uploadedFiles.length > 0 ? (
                    <div className="h-full overflow-auto p-4 space-y-2">
                      <p className="text-sm font-medium mb-3">Archivos subidos ({uploadedFiles.length}):</p>
                      {uploadedFiles.map((file, index) => (
                        <div key={file.id} className="flex items-center gap-3 p-3 bg-background rounded-lg border">
                          <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                              {file.url && ' • Subido con OCR ✓'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <FileText className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('wizard.ocr_extracted')}</Label>
                <Textarea
                  className="h-80 resize-none"
                  placeholder="El texto será extraído automáticamente de los archivos subidos. Puede editar el texto extraído aquí..."
                  value={formData.extractedText}
                  onChange={(e) => updateField('extractedText', e.target.value)}
                  disabled={processingOCR}
                />
                <p className="text-sm text-muted-foreground">
                  {formData.extractedText ? (
                    <>✓ {formData.extractedText.length} caracteres extraídos - puede editar el texto si es necesario</>
                  ) : (
                    <>💡 Sugerencia: Puede escribir o pegar el texto del documento aquí manualmente</>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Classification */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t('wizard.classification_type')}</Label>
                  <Select value={formData.documentType} onValueChange={(v) => updateField('documentType', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t('wizard.classification_entity')}</Label>
                  <Select value={formData.entityId} onValueChange={(v) => updateField('entityId', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar entidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {entities
                        .filter(e => e.isActive)
                        .map(entity => (
                          <SelectItem key={entity.id} value={entity.id}>{entity.name}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t('wizard.classification_tags')}</Label>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <Badge
                      key={tag}
                      variant={formData.selectedTags.includes(tag) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Official Registration */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    {t('wizard.correlative_number')}
                  </Label>
                  <Input value={correlativeNumber} disabled className="font-mono" />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {t('wizard.registration_date')}
                  </Label>
                  <Input value={format(registrationDate, 'dd/MM/yyyy HH:mm')} disabled />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {t('wizard.assign_responsible')}
                  </Label>
                  <Select value={formData.responsibleId} onValueChange={(v) => updateField('responsibleId', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar responsable" />
                    </SelectTrigger>
                    <SelectContent>
                      {users
                        .filter(u => u.isActive)
                        .map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.firstName} {user.lastName}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <QrCode className="h-4 w-4" />
                    {t('wizard.generate_qr')}
                  </Label>
                  <div className="h-24 w-24 bg-muted rounded-lg border flex items-center justify-center">
                    <QrCode className="h-16 w-16 text-foreground" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Confirmation */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-6 border">
                <h3 className="font-semibold mb-4">Resumen del registro</h3>
                <dl className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm text-muted-foreground">Número correlativo</dt>
                    <dd className="font-mono font-medium">{correlativeNumber}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Fecha de registro</dt>
                    <dd>{format(registrationDate, 'dd/MM/yyyy HH:mm')}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Tipo de documento</dt>
                    <dd>{formData.documentType || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Entidad</dt>
                    <dd>{entities.find(e => e.id === formData.entityId)?.name || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Clasificación</dt>
                    <dd>{formData.classification === 'INTERNAL' ? 'Interna' : 'Externa'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Canal</dt>
                    <dd>{formData.channel || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Origen</dt>
                    <dd>{formData.origin || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Prioridad</dt>
                    <dd>
                      {formData.priority === 'LOW' && '🟢 Baja'}
                      {formData.priority === 'MEDIUM' && '🟡 Media'}
                      {formData.priority === 'HIGH' && '🟠 Alta'}
                      {formData.priority === 'URGENT' && '🔴 Urgente'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Responsable</dt>
                    <dd>
                      {(() => {
                        const user = users.find(u => u.id === formData.responsibleId);
                        return user ? `${user.firstName} ${user.lastName}` : '-';
                      })()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Etiquetas</dt>
                    <dd className="flex flex-wrap gap-1 mt-1">
                      {formData.selectedTags.length > 0 ? formData.selectedTags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      )) : '-'}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="flex items-start gap-3 p-4 bg-info/10 rounded-lg border border-info/20">
                <Info className="h-5 w-5 text-info shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">{t('wizard.what_happens_next')}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    El documento será registrado en el sistema y asignado al responsable seleccionado.
                    Se generará un código QR único y el documento quedará disponible en la bandeja de entrada.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {currentStep > 1 && (
            <Button variant="outline" onClick={() => setCurrentStep(prev => prev - 1)}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              {t('common.previous')}
            </Button>
          )}
          <Button variant="ghost" onClick={() => navigate('/inbox')}>
            {t('common.cancel')}
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <Save className="h-4 w-4 mr-1" />
            {t('common.save_draft')}
          </Button>
          {currentStep < 5 ? (
            <Button
              onClick={handleNextStep}
              disabled={!canProceed() || processingOCR}
            >
              {processingOCR ? 'Procesando OCR...' : t('common.next')}
              {!processingOCR && <ChevronRight className="h-4 w-4 ml-1" />}
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={uploading}>
              {uploading ? 'Registrando...' : t('common.confirm')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
