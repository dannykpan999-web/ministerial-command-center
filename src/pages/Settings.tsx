import { useLanguage } from '@/contexts/LanguageContext';
import { locales, Locale } from '@/lib/i18n';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, FileText, Globe, Bell, Shield, Eye, Edit, PenTool } from 'lucide-react';
import { users } from '@/lib/mockData';

const roles = [
  { id: 'admin', name: 'Administrador', permissions: ['read', 'write', 'sign', 'admin'] },
  { id: 'gabinete', name: 'Gabinete', permissions: ['read', 'write', 'sign'] },
  { id: 'revisor', name: 'Revisor', permissions: ['read', 'write'] },
  { id: 'lector', name: 'Lector', permissions: ['read'] },
];

export default function SettingsPage() {
  const { t, locale, setLocale } = useLanguage();

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
          <Card><CardHeader><CardTitle className="text-base">Matriz de permisos</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b"><th className="text-left py-2 pr-4">Rol</th><th className="px-4 py-2"><Eye className="h-4 w-4 mx-auto" /></th><th className="px-4 py-2"><Edit className="h-4 w-4 mx-auto" /></th><th className="px-4 py-2"><PenTool className="h-4 w-4 mx-auto" /></th><th className="px-4 py-2"><Shield className="h-4 w-4 mx-auto" /></th></tr></thead>
                  <tbody>
                    {roles.map(role => (
                      <tr key={role.id} className="border-b"><td className="py-3 pr-4 font-medium">{role.name}</td>
                        {['read', 'write', 'sign', 'admin'].map(perm => (
                          <td key={perm} className="px-4 py-3 text-center">{role.permissions.includes(perm) ? <Badge variant="default" className="h-6 w-6 p-0 justify-center">✓</Badge> : <span className="text-muted-foreground">—</span>}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates"><Card><CardContent className="p-6 text-center text-muted-foreground">Configuración de plantillas próximamente</CardContent></Card></TabsContent>

        <TabsContent value="language">
          <Card><CardHeader><CardTitle className="text-base">Idioma de la interfaz</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Select value={locale} onValueChange={(v) => setLocale(v as Locale)}>
                <SelectTrigger className="w-64"><SelectValue /></SelectTrigger>
                <SelectContent>{Object.entries(locales).map(([code, name]) => <SelectItem key={code} value={code}>{name}</SelectItem>)}</SelectContent>
              </Select>
              <div className="space-y-2"><Label>{t('settings.timezone')}</Label>
                <Select defaultValue="utc-5"><SelectTrigger className="w-64"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="utc-5">UTC-5 (América/Lima)</SelectItem><SelectItem value="utc-6">UTC-6 (América/México)</SelectItem></SelectContent></Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card><CardHeader><CardTitle className="text-base">{t('settings.alerts')}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between"><div><Label>Recordar 48h antes del vencimiento</Label><p className="text-sm text-muted-foreground">Enviar recordatorio automático</p></div><Switch defaultChecked /></div>
              <div className="flex items-center justify-between"><div><Label>Escalar plazos vencidos</Label><p className="text-sm text-muted-foreground">Notificar al supervisor</p></div><Switch defaultChecked /></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
