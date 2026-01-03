import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Upload,
  Video,
  Mic,
  Image,
  FileText,
  Download,
  Eye,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaItem {
  id: string;
  name: string;
  type: 'audio' | 'video' | 'image';
  status: 'queued' | 'processing' | 'done' | 'error';
  progress?: number;
  result?: {
    transcript?: string;
    summary?: string;
    text?: string;
  };
}

const mockItems: MediaItem[] = [
  {
    id: '1',
    name: 'reunion_gabinete_2024-01-15.mp3',
    type: 'audio',
    status: 'done',
    result: {
      transcript: 'Buenos días a todos. Comenzamos la reunión del gabinete ministerial con los siguientes puntos en agenda...',
      summary: 'Reunión de gabinete donde se discutieron temas de infraestructura portuaria, regulación de telecomunicaciones y acuerdos de cooperación internacional.',
    },
  },
  {
    id: '2',
    name: 'conferencia_prensa.mp4',
    type: 'video',
    status: 'processing',
    progress: 65,
  },
  {
    id: '3',
    name: 'documento_escaneado.jpg',
    type: 'image',
    status: 'done',
    result: {
      text: 'OFICIO Nº 2024-00234\n\nAsunto: Solicitud de información sobre proyectos de infraestructura...',
    },
  },
  {
    id: '4',
    name: 'entrevista_radio.wav',
    type: 'audio',
    status: 'queued',
  },
  {
    id: '5',
    name: 'recorte_prensa.png',
    type: 'image',
    status: 'error',
  },
];

export default function MultimediaPage() {
  const { t } = useLanguage();
  const [items, setItems] = useState<MediaItem[]>(mockItems);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  const statusIcons = {
    queued: <Clock className="h-4 w-4" />,
    processing: <Loader2 className="h-4 w-4 animate-spin" />,
    done: <CheckCircle className="h-4 w-4" />,
    error: <XCircle className="h-4 w-4" />,
  };

  const statusVariants: Record<string, 'muted' | 'info' | 'success' | 'destructive'> = {
    queued: 'muted',
    processing: 'info',
    done: 'success',
    error: 'destructive',
  };

  const statusLabels = {
    queued: t('multimedia.queued'),
    processing: t('multimedia.processing'),
    done: t('multimedia.done'),
    error: t('multimedia.error'),
  };

  const typeIcons = {
    audio: <Mic className="h-5 w-5" />,
    video: <Video className="h-5 w-5" />,
    image: <Image className="h-5 w-5" />,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <PageHeader
        title={t('multimedia.title')}
        description={t('multimedia.description')}
        action={
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            {t('multimedia.upload_file')}
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Area */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Arrastra archivos aquí o haz clic para seleccionar</p>
              <p className="text-xs text-muted-foreground mt-1">MP3, WAV, MP4, JPG, PNG (máx. 100MB)</p>
            </div>
          </CardContent>
        </Card>

        {/* Items List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Archivos procesados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {items.map(item => (
              <div
                key={item.id}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                  selectedItem?.id === item.id ? 'border-primary bg-primary/5' : 'hover:border-primary/20'
                )}
                onClick={() => setSelectedItem(item)}
              >
                <div className={cn(
                  'h-10 w-10 rounded-lg flex items-center justify-center',
                  item.type === 'audio' ? 'bg-purple-100 text-purple-600' :
                  item.type === 'video' ? 'bg-blue-100 text-blue-600' :
                  'bg-green-100 text-green-600'
                )}>
                  {typeIcons[item.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  {item.status === 'processing' && item.progress && (
                    <Progress value={item.progress} className="h-1 mt-2" />
                  )}
                </div>
                <StatusBadge variant={statusVariants[item.status]}>
                  {statusIcons[item.status]}
                  <span className="ml-1">{statusLabels[item.status]}</span>
                </StatusBadge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resultados</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedItem ? (
              selectedItem.status === 'done' && selectedItem.result ? (
                <div className="space-y-4">
                  {selectedItem.result.transcript && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">{t('multimedia.transcript')}</h4>
                      <div className="bg-muted rounded-lg p-3 text-sm max-h-40 overflow-y-auto">
                        {selectedItem.result.transcript}
                      </div>
                    </div>
                  )}
                  {selectedItem.result.summary && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">{t('multimedia.summary')}</h4>
                      <div className="bg-muted rounded-lg p-3 text-sm">
                        {selectedItem.result.summary}
                      </div>
                    </div>
                  )}
                  {selectedItem.result.text && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Texto extraído (OCR)</h4>
                      <div className="bg-muted rounded-lg p-3 text-sm font-mono max-h-40 overflow-y-auto">
                        {selectedItem.result.text}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Exportar texto
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-1" />
                      Crear documento
                    </Button>
                  </div>
                </div>
              ) : selectedItem.status === 'processing' ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 mx-auto animate-spin text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">Procesando archivo...</p>
                  {selectedItem.progress && (
                    <p className="text-sm font-medium mt-1">{selectedItem.progress}%</p>
                  )}
                </div>
              ) : selectedItem.status === 'queued' ? (
                <div className="text-center py-8">
                  <Clock className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">En cola de procesamiento</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <XCircle className="h-8 w-8 mx-auto text-destructive mb-3" />
                  <p className="text-sm text-destructive">Error al procesar el archivo</p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Reintentar
                  </Button>
                </div>
              )
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Eye className="h-8 w-8 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Selecciona un archivo para ver los resultados</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
