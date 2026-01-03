import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  FileText,
  Calendar,
  User,
  Eye,
  Edit,
  Trash2,
  Send,
  Save,
  ExternalLink,
  Globe,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Bold,
  Italic,
  List,
  ListOrdered,
  Link,
  Image
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Article {
  id: string;
  title: string;
  sector: string;
  status: 'published' | 'pending' | 'draft';
  content: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  sources: string[];
}

const initialArticles: Article[] = [
  {
    id: '1',
    title: 'Avances en infraestructura portuaria',
    sector: 'Puertos',
    status: 'published',
    content: '## Modernización del Puerto Principal\n\nEl Ministerio ha completado la primera fase del proyecto de modernización de la infraestructura portuaria, que incluye:\n\n- **Nueva terminal de contenedores**: Capacidad aumentada en un 40%\n- **Sistema de grúas automatizadas**: Reducción de tiempos de carga en 30%\n- **Centro de control digital**: Monitoreo en tiempo real de operaciones\n\n### Impacto Económico\n\nSe estima que estas mejoras generarán:\n\n1. 2,500 empleos directos\n2. Incremento del 25% en el comercio exterior\n3. Reducción de costos logísticos del 15%\n\n> "Esta inversión posiciona a nuestro país como hub logístico regional" - Ministro de Transporte',
    author: 'María García López',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    sources: ['Informe Técnico PT-2024-001', 'Estudio de Impacto Económico'],
  },
  {
    id: '2',
    title: 'Nueva regulación de telecomunicaciones',
    sector: 'Telecomunicaciones',
    status: 'pending',
    content: '## Marco Regulatorio Actualizado\n\nLa nueva normativa de telecomunicaciones busca:\n\n- Garantizar el acceso universal a internet\n- Regular el espectro 5G\n- Proteger los derechos de los usuarios\n\n### Principales Cambios\n\nLos operadores deberán cumplir con nuevos estándares de calidad de servicio y transparencia en la facturación.',
    author: 'Carlos Rodríguez Pérez',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-22'),
    sources: ['Proyecto de Ley TEL-2024', 'Consulta Pública CP-001'],
  },
  {
    id: '3',
    title: 'Acuerdos de cooperación 2024',
    sector: 'Internacional',
    status: 'draft',
    content: '## Nuevos Acuerdos Bilaterales\n\nDurante el primer trimestre de 2024, se han firmado acuerdos de cooperación con:\n\n- Francia: Cooperación técnica en energías renovables\n- Alemania: Intercambio en formación profesional\n- Japón: Tecnología y desarrollo sostenible\n\n### Próximos Pasos\n\nSe están negociando acuerdos adicionales con países de la región.',
    author: 'Ana Martínez Sánchez',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    sources: [],
  },
];

const sectors = ['Puertos', 'Telecomunicaciones', 'Internacional', 'Energía', 'Transporte', 'Economía'];

export default function ContentPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');

  // Editor state
  const [editTitle, setEditTitle] = useState('');
  const [editSector, setEditSector] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editSources, setEditSources] = useState('');

  const statusLabels: Record<string, string> = {
    published: 'Publicado',
    pending: 'Pendiente',
    draft: 'Borrador',
  };

  const statusIcons: Record<string, React.ReactNode> = {
    published: <CheckCircle className="h-4 w-4 text-success" />,
    pending: <Clock className="h-4 w-4 text-warning" />,
    draft: <AlertCircle className="h-4 w-4 text-muted-foreground" />,
  };

  const handleCreateNew = () => {
    setEditTitle('');
    setEditSector('');
    setEditContent('');
    setEditSources('');
    setIsCreating(true);
    setIsEditing(true);
  };

  const handleEdit = (article: Article) => {
    setSelectedArticle(article);
    setEditTitle(article.title);
    setEditSector(article.sector);
    setEditContent(article.content);
    setEditSources(article.sources.join('\n'));
    setIsEditing(true);
  };

  const handleView = (article: Article) => {
    setSelectedArticle(article);
    setViewMode('detail');
  };

  const handleSave = (status: 'draft' | 'pending') => {
    if (!editTitle.trim() || !editSector || !editContent.trim()) {
      toast({
        title: 'Campos requeridos',
        description: 'Por favor complete el título, sector y contenido',
        variant: 'destructive',
      });
      return;
    }

    const now = new Date();
    const sources = editSources.split('\n').filter(s => s.trim());

    if (isCreating) {
      const newArticle: Article = {
        id: `article-${Date.now()}`,
        title: editTitle,
        sector: editSector,
        status,
        content: editContent,
        author: 'María García López',
        createdAt: now,
        updatedAt: now,
        sources,
      };
      setArticles([newArticle, ...articles]);
      toast({
        title: 'Artículo creado',
        description: status === 'draft' ? 'Guardado como borrador' : 'Enviado para aprobación',
      });
    } else if (selectedArticle) {
      setArticles(articles.map(a =>
        a.id === selectedArticle.id
          ? { ...a, title: editTitle, sector: editSector, content: editContent, sources, status, updatedAt: now }
          : a
      ));
      toast({
        title: 'Artículo actualizado',
        description: status === 'draft' ? 'Cambios guardados' : 'Enviado para aprobación',
      });
    }

    setIsEditing(false);
    setIsCreating(false);
    setSelectedArticle(null);
  };

  const handleDelete = (id: string) => {
    setArticles(articles.filter(a => a.id !== id));
    toast({
      title: 'Artículo eliminado',
      description: 'El artículo ha sido eliminado correctamente',
    });
  };

  const handlePublish = (article: Article) => {
    setArticles(articles.map(a =>
      a.id === article.id ? { ...a, status: 'published', updatedAt: new Date() } : a
    ));
    toast({
      title: 'Artículo publicado',
      description: 'El artículo está ahora visible públicamente',
    });
  };

  // Detail view
  if (viewMode === 'detail' && selectedArticle) {
    return (
      <div className="p-6 max-w-4xl mx-auto animate-fade-in">
        <Button
          variant="ghost"
          onClick={() => {
            setViewMode('list');
            setSelectedArticle(null);
          }}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a la lista
        </Button>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{selectedArticle.sector}</Badge>
                  <Badge variant={selectedArticle.status === 'published' ? 'default' : 'secondary'}>
                    {statusIcons[selectedArticle.status]}
                    <span className="ml-1">{statusLabels[selectedArticle.status]}</span>
                  </Badge>
                </div>
                <CardTitle className="text-2xl">{selectedArticle.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {selectedArticle.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(selectedArticle.updatedAt, 'dd MMM yyyy', { locale: es })}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(selectedArticle)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                {selectedArticle.status === 'pending' && (
                  <Button size="sm" onClick={() => handlePublish(selectedArticle)}>
                    <Globe className="h-4 w-4 mr-2" />
                    Publicar
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[60vh]">
              <div className="prose prose-sm max-w-none">
                {selectedArticle.content.split('\n').map((line, i) => {
                  if (line.startsWith('## ')) {
                    return <h2 key={i} className="text-xl font-semibold mt-6 mb-3">{line.replace('## ', '')}</h2>;
                  }
                  if (line.startsWith('### ')) {
                    return <h3 key={i} className="text-lg font-semibold mt-4 mb-2">{line.replace('### ', '')}</h3>;
                  }
                  if (line.startsWith('- **')) {
                    const match = line.match(/- \*\*(.+?)\*\*: (.+)/);
                    if (match) {
                      return (
                        <p key={i} className="ml-4 my-1">
                          • <strong>{match[1]}</strong>: {match[2]}
                        </p>
                      );
                    }
                  }
                  if (line.startsWith('- ')) {
                    return <p key={i} className="ml-4 my-1">• {line.replace('- ', '')}</p>;
                  }
                  if (line.match(/^\d+\. /)) {
                    return <p key={i} className="ml-4 my-1">{line}</p>;
                  }
                  if (line.startsWith('> ')) {
                    return (
                      <blockquote key={i} className="border-l-4 border-primary/30 pl-4 italic my-4 text-muted-foreground">
                        {line.replace('> ', '')}
                      </blockquote>
                    );
                  }
                  if (line.trim()) {
                    return <p key={i} className="my-2">{line}</p>;
                  }
                  return null;
                })}
              </div>

              {selectedArticle.sources.length > 0 && (
                <div className="mt-8 pt-4 border-t">
                  <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Fuentes
                  </h4>
                  <ul className="space-y-1">
                    {selectedArticle.sources.map((source, i) => (
                      <li key={i} className="text-sm text-primary hover:underline cursor-pointer">
                        {source}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <PageHeader
        title={t('content.title')}
        description={t('content.description')}
        action={
          <Button onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            {t('content.new_article')}
          </Button>
        }
      />

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{articles.filter(a => a.status === 'published').length}</p>
              <p className="text-sm text-muted-foreground">Publicados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{articles.filter(a => a.status === 'pending').length}</p>
              <p className="text-sm text-muted-foreground">Pendientes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{articles.filter(a => a.status === 'draft').length}</p>
              <p className="text-sm text-muted-foreground">Borradores</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Articles list */}
      <div className="space-y-3">
        {articles.map(article => (
          <Card
            key={article.id}
            className="hover:border-primary/20 transition-all hover:shadow-md"
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleView(article)}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium hover:text-primary transition-colors">{article.title}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{article.sector}</p>
                    </div>
                    <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                      {statusIcons[article.status]}
                      <span className="ml-1">{statusLabels[article.status]}</span>
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {article.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(article.updatedAt, 'dd MMM yyyy', { locale: es })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleView(article)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(article)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(article.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Editor Dialog */}
      <Dialog open={isEditing} onOpenChange={(open) => {
        if (!open) {
          setIsEditing(false);
          setIsCreating(false);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {isCreating ? 'Nuevo artículo' : 'Editar artículo'}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="content" className="mt-4">
            <TabsList>
              <TabsTrigger value="content">Contenido</TabsTrigger>
              <TabsTrigger value="metadata">Metadatos</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Título del artículo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Contenido</Label>
                <div className="border rounded-lg">
                  {/* Simple toolbar */}
                  <div className="flex items-center gap-1 p-2 border-b bg-muted/30">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Italic className="h-4 w-4" />
                    </Button>
                    <div className="w-px h-6 bg-border mx-1" />
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <List className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                    <div className="w-px h-6 bg-border mx-1" />
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Link className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Image className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    id="content"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Escribe el contenido usando Markdown..."
                    className="min-h-[300px] border-0 rounded-none focus-visible:ring-0"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Soporta formato Markdown: ## para títulos, **negrita**, - para listas, {'>'} para citas
                </p>
              </div>
            </TabsContent>

            <TabsContent value="metadata" className="space-y-4 mt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sector">Sector</Label>
                  <Select value={editSector} onValueChange={setEditSector}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un sector" />
                    </SelectTrigger>
                    <SelectContent>
                      {sectors.map(sector => (
                        <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sources">Fuentes (una por línea)</Label>
                <Textarea
                  id="sources"
                  value={editSources}
                  onChange={(e) => setEditSources(e.target.value)}
                  placeholder="Informe Técnico PT-2024-001&#10;Estudio de Impacto Económico"
                  className="min-h-[100px]"
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => {
              setIsEditing(false);
              setIsCreating(false);
            }}>
              Cancelar
            </Button>
            <Button variant="outline" onClick={() => handleSave('draft')}>
              <Save className="h-4 w-4 mr-2" />
              Guardar borrador
            </Button>
            <Button onClick={() => handleSave('pending')}>
              <Send className="h-4 w-4 mr-2" />
              Enviar para aprobación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
