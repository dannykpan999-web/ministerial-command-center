import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { locales, Locale } from '@/lib/i18n';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  Users,
  FileText,
  Globe,
  Bell,
  Shield,
  Eye,
  Edit,
  PenTool,
  Plus,
  Trash2,
  Copy,
  MoreVertical,
  Mail,
  FileInput,
  FileOutput
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const roles = [
  { id: 'admin', name: 'Administrador', permissions: ['read', 'write', 'sign', 'admin'] },
  { id: 'gabinete', name: 'Gabinete', permissions: ['read', 'write', 'sign'] },
  { id: 'revisor', name: 'Revisor', permissions: ['read', 'write'] },
  { id: 'lector', name: 'Lector', permissions: ['read'] },
];

interface Template {
  id: string;
  name: string;
  type: 'oficio' | 'memorando' | 'circular' | 'respuesta';
  content: string;
  variables: string[];
  isDefault: boolean;
}

const initialTemplates: Template[] = [
  {
    id: 't1',
    name: 'Oficio formal estándar',
    type: 'oficio',
    content: 'OFICIO N° {{numero}}\n\n{{ciudad}}, {{fecha}}\n\nSeñor(a):\n{{destinatario}}\n{{cargo_destinatario}}\nPresente.-\n\nREF: {{asunto}}\n\nTengo el agrado de dirigirme a usted para {{contenido}}\n\nSin otro particular, hago propicia la ocasión para expresarle los sentimientos de mi consideración y estima.\n\nAtentamente,\n\n\n{{firmante}}\n{{cargo_firmante}}',
    variables: ['numero', 'ciudad', 'fecha', 'destinatario', 'cargo_destinatario', 'asunto', 'contenido', 'firmante', 'cargo_firmante'],
    isDefault: true,
  },
  {
    id: 't2',
    name: 'Memorando interno',
    type: 'memorando',
    content: 'MEMORANDO N° {{numero}}\n\nA: {{destinatario}}\nDE: {{remitente}}\nASUNTO: {{asunto}}\nFECHA: {{fecha}}\n\n{{contenido}}\n\nAtentamente,\n\n{{firmante}}',
    variables: ['numero', 'destinatario', 'remitente', 'asunto', 'fecha', 'contenido', 'firmante'],
    isDefault: true,
  },
  {
    id: 't3',
    name: 'Circular informativa',
    type: 'circular',
    content: 'CIRCULAR N° {{numero}}\n\nFecha: {{fecha}}\n\nPara: {{destinatarios}}\nDe: {{remitente}}\nAsunto: {{asunto}}\n\nPor medio de la presente se comunica a todos los interesados que:\n\n{{contenido}}\n\nSe agradece su atención y colaboración.\n\n{{firmante}}\n{{cargo_firmante}}',
    variables: ['numero', 'fecha', 'destinatarios', 'remitente', 'asunto', 'contenido', 'firmante', 'cargo_firmante'],
    isDefault: false,
  },
  {
    id: 't4',
    name: 'Respuesta a solicitud',
    type: 'respuesta',
    content: 'OFICIO N° {{numero}}\n\nREF: Su comunicación de fecha {{fecha_solicitud}}\n\n{{ciudad}}, {{fecha}}\n\nSeñor(a):\n{{destinatario}}\nPresente.-\n\nEn respuesta a su comunicación de la referencia, me permito informarle que:\n\n{{contenido}}\n\nSin otro particular, me suscribo de usted.\n\nAtentamente,\n\n{{firmante}}\n{{cargo_firmante}}',
    variables: ['numero', 'fecha_solicitud', 'ciudad', 'fecha', 'destinatario', 'contenido', 'firmante', 'cargo_firmante'],
    isDefault: false,
  },
];

const templateTypes = {
  oficio: { label: 'Oficio', icon: FileOutput, color: 'text-blue-600' },
  memorando: { label: 'Memorando', icon: FileInput, color: 'text-purple-600' },
  circular: { label: 'Circular', icon: Mail, color: 'text-green-600' },
  respuesta: { label: 'Respuesta', icon: FileText, color: 'text-orange-600' },
};

export default function SettingsPage() {
  const { t, locale, setLocale } = useLanguage();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState<Template['type']>('oficio');
  const [editContent, setEditContent] = useState('');

  const handleCreateTemplate = () => {
    setEditName('');
    setEditType('oficio');
    setEditContent('');
    setIsCreating(true);
    setIsEditing(true);
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setEditName(template.name);
    setEditType(template.type);
    setEditContent(template.content);
    setIsCreating(false);
    setIsEditing(true);
  };

  const handleDuplicateTemplate = (template: Template) => {
    const newTemplate: Template = {
      ...template,
      id: `t${Date.now()}`,
      name: `${template.name} (copia)`,
      isDefault: false,
    };
    setTemplates([...templates, newTemplate]);
    toast({
      title: 'Plantilla duplicada',
      description: 'Se ha creado una copia de la plantilla',
    });
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
    toast({
      title: 'Plantilla eliminada',
      description: 'La plantilla ha sido eliminada correctamente',
    });
  };

  const handleSaveTemplate = () => {
    if (!editName.trim() || !editContent.trim()) {
      toast({
        title: 'Campos requeridos',
        description: 'Por favor complete el nombre y contenido de la plantilla',
        variant: 'destructive',
      });
      return;
    }

    // Extract variables from content ({{variable}})
    const variableMatches = editContent.match(/\{\{(\w+)\}\}/g) || [];
    const variables = [...new Set(variableMatches.map(v => v.replace(/\{\{|\}\}/g, '')))];

    if (isCreating) {
      const newTemplate: Template = {
        id: `t${Date.now()}`,
        name: editName,
        type: editType,
        content: editContent,
        variables,
        isDefault: false,
      };
      setTemplates([...templates, newTemplate]);
      toast({
        title: 'Plantilla creada',
        description: 'La plantilla ha sido creada correctamente',
      });
    } else if (editingTemplate) {
      setTemplates(templates.map(t =>
        t.id === editingTemplate.id
          ? { ...t, name: editName, type: editType, content: editContent, variables }
          : t
      ));
      toast({
        title: 'Plantilla actualizada',
        description: 'Los cambios han sido guardados',
      });
    }

    setIsEditing(false);
    setEditingTemplate(null);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in">
      <PageHeader title={t('settings.title')} description={t('settings.description')} />
      <Tabs defaultValue="roles" className="space-y-6">
        <TabsList>
          <TabsTrigger value="roles"><Users className="h-4 w-4 mr-2" />{t('settings.roles')}</TabsTrigger>
          <TabsTrigger value="templates"><FileText className="h-4 w-4 mr-2" />{t('settings.templates')}</TabsTrigger>
          <TabsTrigger value="language"><Globe className="h-4 w-4 mr-2" />{t('settings.language')}</TabsTrigger>
          <TabsTrigger value="alerts"><Bell className="h-4 w-4 mr-2" />{t('settings.alerts')}</TabsTrigger>
        </TabsList>

        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Matriz de permisos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4">Rol</th>
                      <th className="px-4 py-2"><Eye className="h-4 w-4 mx-auto" /></th>
                      <th className="px-4 py-2"><Edit className="h-4 w-4 mx-auto" /></th>
                      <th className="px-4 py-2"><PenTool className="h-4 w-4 mx-auto" /></th>
                      <th className="px-4 py-2"><Shield className="h-4 w-4 mx-auto" /></th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map(role => (
                      <tr key={role.id} className="border-b">
                        <td className="py-3 pr-4 font-medium">{role.name}</td>
                        {['read', 'write', 'sign', 'admin'].map(perm => (
                          <td key={perm} className="px-4 py-3 text-center">
                            {role.permissions.includes(perm)
                              ? <Badge variant="default" className="h-6 w-6 p-0 justify-center">✓</Badge>
                              : <span className="text-muted-foreground">—</span>
                            }
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Plantillas de documentos</CardTitle>
              <Button onClick={handleCreateTemplate} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nueva plantilla
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {templates.map(template => {
                  const TypeIcon = templateTypes[template.type].icon;
                  return (
                    <div
                      key={template.id}
                      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <div className={`h-10 w-10 rounded-lg bg-muted flex items-center justify-center ${templateTypes[template.type].color}`}>
                        <TypeIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{template.name}</h4>
                          {template.isDefault && (
                            <Badge variant="secondary" className="text-xs">Por defecto</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {templateTypes[template.type].label}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {template.variables.length} variables
                          </span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditTemplate(template)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicateTemplate(template)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicar
                          </DropdownMenuItem>
                          {!template.isDefault && (
                            <DropdownMenuItem
                              onClick={() => handleDeleteTemplate(template.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Variables disponibles</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Usa {'{{nombre_variable}}'} en el contenido para crear campos dinámicos
                </p>
                <div className="flex flex-wrap gap-2">
                  {['numero', 'fecha', 'ciudad', 'destinatario', 'remitente', 'asunto', 'contenido', 'firmante', 'cargo_firmante'].map(v => (
                    <Badge key={v} variant="outline" className="text-xs font-mono">
                      {`{{${v}}}`}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Template Editor Dialog */}
          <Dialog open={isEditing} onOpenChange={(open) => {
            if (!open) {
              setIsEditing(false);
              setEditingTemplate(null);
            }
          }}>
            <DialogContent className="max-w-3xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>
                  {isCreating ? 'Nueva plantilla' : 'Editar plantilla'}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Nombre de la plantilla</Label>
                    <Input
                      id="template-name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Ej: Oficio de respuesta formal"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-type">Tipo de documento</Label>
                    <Select value={editType} onValueChange={(v) => setEditType(v as Template['type'])}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(templateTypes).map(([key, { label }]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template-content">Contenido de la plantilla</Label>
                  <Textarea
                    id="template-content"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Escribe el contenido de la plantilla usando variables..."
                    className="min-h-[300px] font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Usa {'{{variable}}'} para crear campos dinámicos. Ejemplo: {'{{destinatario}}'}, {'{{fecha}}'}
                  </p>
                </div>

                {editContent && (
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-xs font-medium mb-2">Variables detectadas:</p>
                    <div className="flex flex-wrap gap-1">
                      {[...new Set((editContent.match(/\{\{(\w+)\}\}/g) || []).map(v => v.replace(/\{\{|\}\}/g, '')))].map(v => (
                        <Badge key={v} variant="secondary" className="text-xs font-mono">{v}</Badge>
                      ))}
                      {!(editContent.match(/\{\{(\w+)\}\}/g) || []).length && (
                        <span className="text-xs text-muted-foreground">Ninguna variable detectada</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => {
                  setIsEditing(false);
                  setEditingTemplate(null);
                }}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveTemplate}>
                  {isCreating ? 'Crear plantilla' : 'Guardar cambios'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="language">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Idioma de la interfaz</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={locale} onValueChange={(v) => setLocale(v as Locale)}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(locales).map(([code, name]) => (
                    <SelectItem key={code} value={code}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="space-y-2">
                <Label>{t('settings.timezone')}</Label>
                <Select defaultValue="utc-5">
                  <SelectTrigger className="w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc-5">UTC-5 (América/Lima)</SelectItem>
                    <SelectItem value="utc-6">UTC-6 (América/México)</SelectItem>
                    <SelectItem value="utc-3">UTC-3 (América/Buenos Aires)</SelectItem>
                    <SelectItem value="utc+1">UTC+1 (Europa/Madrid)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('settings.alerts')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Recordar 48h antes del vencimiento</Label>
                  <p className="text-sm text-muted-foreground">Enviar recordatorio automático</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Escalar plazos vencidos</Label>
                  <p className="text-sm text-muted-foreground">Notificar al supervisor</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificaciones por correo</Label>
                  <p className="text-sm text-muted-foreground">Recibir alertas por email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Resumen diario</Label>
                  <p className="text-sm text-muted-foreground">Recibir resumen de actividad cada mañana</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
