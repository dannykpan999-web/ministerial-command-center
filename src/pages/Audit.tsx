import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTableSkeleton } from '@/components/ui/data-table-skeleton';
import { Download, Search, User, FileText, FolderOpen, PenTool } from 'lucide-react';
import { fetchAuditLog, getUserById, AuditEntry } from '@/lib/mockData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const actionIcons: Record<string, any> = { document: FileText, expediente: FolderOpen, signature: PenTool, user: User, system: User };

export default function AuditPage() {
  const { t } = useLanguage();
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAuditLog().then(data => { setEntries(data); setLoading(false); }); }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <PageHeader title={t('audit.title')} description={t('audit.description')} action={<Button variant="outline"><Download className="h-4 w-4 mr-2" />{t('audit.export_report')}</Button>} />
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder={t('common.search')} className="pl-9" /></div>
        <Select defaultValue="all"><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Todas las acciones</SelectItem></SelectContent></Select>
      </div>
      {loading ? <DataTableSkeleton columns={4} rows={5} /> : (
        <div className="space-y-2">
          {entries.map(entry => {
            const user = getUserById(entry.userId);
            const Icon = actionIcons[entry.targetType] || FileText;
            return (
              <Card key={entry.id}><CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center"><Icon className="h-5 w-5 text-muted-foreground" /></div>
                <div className="flex-1"><p className="font-medium text-sm">{entry.action}</p><p className="text-xs text-muted-foreground">{entry.details}</p></div>
                <div className="text-right text-sm"><p className="font-medium">{user?.name}</p><p className="text-xs text-muted-foreground">{format(entry.timestamp, "dd MMM yyyy HH:mm", { locale: es })}</p></div>
              </CardContent></Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
