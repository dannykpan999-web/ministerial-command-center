import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
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
import {
  Upload,
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
import { entities, users, documentTypes, channels, tags } from '@/lib/mockData';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const steps = [
  { number: 1, title: 'Subir documento', key: 'wizard.step1' },
  { number: 2, title: 'Revisión OCR', key: 'wizard.step2' },
  { number: 3, title: 'Clasificación', key: 'wizard.step3' },
  { number: 4, title: 'Registro oficial', key: 'wizard.step4' },
  { number: 5, title: 'Confirmación', key: 'wizard.step5' },
];

export default function NewEntryWizard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    file: null as File | null,
    channel: '',
    origin: '',
    extractedText: '',
    documentType: '',
    entityId: '',
    selectedTags: [] as string[],
    responsibleId: '',
  });

  const updateField = (field: string, value: any) => {
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
        return formData.file && formData.channel && formData.origin;
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

  const handleSubmit = () => {
    toast({
      title: 'Documento registrado',
      description: 'El documento ha sido registrado exitosamente con el número ENT-2024-001543',
    });
    navigate('/inbox');
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
              <div
                className={cn(
                  'border-2 border-dashed rounded-xl p-12 text-center transition-colors',
                  formData.file ? 'border-success bg-success/5' : 'border-border hover:border-primary/50'
                )}
              >
                {formData.file ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="h-12 w-12 text-success" />
                    <p className="font-medium">{formData.file.name}</p>
                    <Button variant="ghost" size="sm" onClick={() => updateField('file', null)}>
                      Cambiar archivo
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center gap-3">
                    <Upload className="h-12 w-12 text-muted-foreground" />
                    <p className="text-muted-foreground">{t('wizard.upload_doc')}</p>
                    <p className="text-xs text-muted-foreground">{t('wizard.supported_formats')}</p>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => updateField('file', e.target.files?.[0] || null)}
                    />
                  </label>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t('wizard.channel')}</Label>
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
                  <Label>{t('wizard.origin')}</Label>
                  <Input
                    placeholder="Nombre o entidad de origen"
                    value={formData.origin}
                    onChange={(e) => updateField('origin', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: OCR Review */}
          {currentStep === 2 && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-2">
                <Label>{t('wizard.ocr_original')}</Label>
                <div className="h-80 bg-muted rounded-lg flex items-center justify-center border">
                  <FileText className="h-16 w-16 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('wizard.ocr_extracted')}</Label>
                <Textarea
                  className="h-80 resize-none"
                  placeholder="Texto extraído del documento..."
                  value={formData.extractedText || 'Asunto: Solicitud de ampliación de concesión portuaria\n\nEstimado Sr. Ministro,\n\nPor medio de la presente, Terminal Marítima S.A. solicita formalmente la ampliación del plazo de la concesión otorgada mediante Resolución No. 2020-0234, correspondiente a las instalaciones del muelle norte del puerto principal.\n\nLa solicitud se fundamenta en las inversiones adicionales realizadas durante el período 2022-2024, las cuales ascienden a un monto de USD 45 millones...'}
                  onChange={(e) => updateField('extractedText', e.target.value)}
                />
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
                      {entities.map(entity => (
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
                      {users.map(user => (
                        <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
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
                    <dt className="text-sm text-muted-foreground">Canal</dt>
                    <dd>{formData.channel || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Origen</dt>
                    <dd>{formData.origin || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Responsable</dt>
                    <dd>{users.find(u => u.id === formData.responsibleId)?.name || '-'}</dd>
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
            <Button onClick={() => setCurrentStep(prev => prev + 1)} disabled={!canProceed()}>
              {t('common.next')}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              {t('common.confirm')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
