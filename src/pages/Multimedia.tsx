import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  Globe,
  Share2,
  Sparkles,
  Camera,
  Star,
  AtSign,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaItem {
  id: string;
  name: string;
  type: 'audio' | 'video' | 'image' | 'web' | 'social';
  status: 'queued' | 'processing' | 'done' | 'error';
  progress?: number;
  source?: string;
  result?: {
    transcript?: string;
    summary?: string;
    text?: string;
    socialContent?: string;
    recommendedImage?: string;
    hashtags?: string[];
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
    status: 'done',
    result: {
      text: 'El Ministro inauguró las nuevas instalaciones del puerto...',
      recommendedImage: 'best_photo.jpg',
    },
  },
  {
    id: '6',
    name: 'Noticia: Inauguración Puerto Norte',
    type: 'web',
    status: 'done',
    source: 'https://noticias.gob.eg/inauguracion-puerto',
    result: {
      summary: 'El Ministro de Transportes inauguró hoy las nuevas instalaciones del Puerto Norte, una inversión de 50 millones que mejorará la capacidad logística del país.',
      socialContent: '🚢 ¡Gran día para Guinea Ecuatorial! Inauguramos las nuevas instalaciones del Puerto Norte. Una inversión de $50M que impulsará nuestro comercio exterior. #DesarrolloGE #PuertoNorte',
      hashtags: ['#DesarrolloGE', '#PuertoNorte', '#Infraestructura', '#ComercioExterior'],
    },
  },
  {
    id: '7',
    name: '@MinisterioGE - Twitter',
    type: 'social',
    status: 'done',
    source: 'twitter',
    result: {
      summary: 'Monitoreo de menciones y engagement de la cuenta oficial del Ministerio en las últimas 24 horas.',
    },
  },
];

// Mock images for AI photo selection
const mockPhotos = [
  { id: 'p1', name: 'foto_ministro_1.jpg', score: 95, recommended: true },
  { id: 'p2', name: 'foto_ministro_2.jpg', score: 78, recommended: false },
  { id: 'p3', name: 'foto_inauguracion.jpg', score: 92, recommended: true },
  { id: 'p4', name: 'foto_grupo.jpg', score: 65, recommended: false },
];

export default function MultimediaPage() {
  const { t } = useLanguage();
  const [items] = useState<MediaItem[]>(mockItems);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [activeTab, setActiveTab] = useState('files');
  const [webUrl, setWebUrl] = useState('');
  const [socialPost, setSocialPost] = useState('');

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
    web: <Globe className="h-5 w-5" />,
    social: <Share2 className="h-5 w-5" />,
  };

  const typeColors = {
    audio: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    video: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    image: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    web: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    social: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
  };

  const filteredItems = items.filter(item => {
    if (activeTab === 'files') return ['audio', 'video', 'image'].includes(item.type);
    if (activeTab === 'web') return item.type === 'web';
    if (activeTab === 'social') return item.type === 'social';
    return true;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto animate-fade-in">
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

      {/* Tabs for different content types */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="files" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Archivos</span>
          </TabsTrigger>
          <TabsTrigger value="web" className="gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Web</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="gap-2">
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Redes Sociales</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload/Input Area */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            {activeTab === 'files' && (
              <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">Arrastra archivos aquí o haz clic para seleccionar</p>
                <p className="text-xs text-muted-foreground mt-1">MP3, WAV, MP4, JPG, PNG (máx. 100MB)</p>
              </div>
            )}

            {activeTab === 'web' && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Ingresa la URL de la noticia o artículo..."
                      value={webUrl}
                      onChange={(e) => setWebUrl(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Analizar
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  La IA extraerá el contenido, generará un resumen y propondrá publicaciones para redes sociales.
                </p>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button variant="outline" size="sm" className="gap-2">
                    <AtSign className="h-4 w-4 text-[#1DA1F2]" />
                    Twitter/X
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <span className="h-4 w-4 text-[#4267B2] font-bold text-xs">f</span>
                    Facebook
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Camera className="h-4 w-4 text-[#E4405F]" />
                    Instagram
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <span className="h-4 w-4 text-[#0077B5] font-bold text-xs">in</span>
                    LinkedIn
                  </Button>
                </div>
                <Textarea
                  placeholder="Escribe tu publicación o deja que la IA genere una basada en el contenido seleccionado..."
                  value={socialPost}
                  onChange={(e) => setSocialPost(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-between items-center">
                  <Button variant="outline" size="sm">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generar con IA
                  </Button>
                  <Button>
                    <Share2 className="h-4 w-4 mr-2" />
                    Publicar
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Items List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {activeTab === 'files' && 'Archivos procesados'}
              {activeTab === 'web' && 'Contenido web analizado'}
              {activeTab === 'social' && 'Actividad en redes'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {filteredItems.map(item => (
                  <div
                    key={item.id}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all',
                      selectedItem?.id === item.id
                        ? 'border-primary bg-primary/5'
                        : 'border-transparent bg-muted/50 hover:border-muted-foreground/20'
                    )}
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className={cn(
                      'h-10 w-10 rounded-lg flex items-center justify-center shrink-0',
                      typeColors[item.type]
                    )}>
                      {typeIcons[item.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      {item.source && (
                        <p className="text-xs text-muted-foreground truncate">{item.source}</p>
                      )}
                      {item.status === 'processing' && item.progress && (
                        <Progress value={item.progress} className="h-1 mt-2" />
                      )}
                    </div>
                    <StatusBadge variant={statusVariants[item.status]}>
                      {statusIcons[item.status]}
                      <span className="ml-1 hidden sm:inline">{statusLabels[item.status]}</span>
                    </StatusBadge>
                  </div>
                ))}
              </div>
            </ScrollArea>
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
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {selectedItem.result.transcript && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">{t('multimedia.transcript')}</h4>
                        <div className="bg-muted rounded-lg p-3 text-sm">
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
                        <div className="bg-muted rounded-lg p-3 text-sm font-mono">
                          {selectedItem.result.text}
                        </div>
                      </div>
                    )}
                    {selectedItem.result.socialContent && (
                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          Contenido para redes sociales
                        </h4>
                        <div className="bg-gradient-to-br from-primary/5 to-transparent border border-primary/20 rounded-lg p-3 text-sm">
                          {selectedItem.result.socialContent}
                        </div>
                        {selectedItem.result.hashtags && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {selectedItem.result.hashtags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* AI Photo Selection */}
                    {selectedItem.type === 'image' && (
                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Camera className="h-4 w-4" />
                          Selección de foto recomendada por IA
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {mockPhotos.map(photo => (
                            <div
                              key={photo.id}
                              className={cn(
                                'relative rounded-lg overflow-hidden border-2 p-2',
                                photo.recommended
                                  ? 'border-green-500 bg-green-500/5'
                                  : 'border-transparent bg-muted'
                              )}
                            >
                              <div className="aspect-video bg-muted rounded flex items-center justify-center">
                                <Image className="h-8 w-8 text-muted-foreground" />
                              </div>
                              <div className="mt-2 flex items-center justify-between">
                                <span className="text-xs truncate">{photo.name}</span>
                                <div className="flex items-center gap-1">
                                  {photo.recommended && (
                                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                  )}
                                  <span className={cn(
                                    'text-xs font-medium',
                                    photo.score >= 90 ? 'text-green-500' :
                                    photo.score >= 70 ? 'text-yellow-500' : 'text-muted-foreground'
                                  )}>
                                    {photo.score}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          La IA evalúa composición, iluminación y calidad para recomendar la mejor foto.
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Exportar texto
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        Crear documento
                      </Button>
                      {(selectedItem.type === 'web' || selectedItem.result.socialContent) && (
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-1" />
                          Publicar en redes
                        </Button>
                      )}
                    </div>
                  </div>
                </ScrollArea>
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
                <p className="text-sm">Selecciona un elemento para ver los resultados</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
