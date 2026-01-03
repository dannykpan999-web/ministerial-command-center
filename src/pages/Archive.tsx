import { useLanguage } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Folder, FileText, Building2 } from 'lucide-react';
import { entities } from '@/lib/mockData';

export default function ArchivePage() {
  const { t } = useLanguage();

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <PageHeader title={t('archive.title')} description={t('archive.description')} />
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder={t('archive.search_archive')} className="pl-9 max-w-md" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entities.map(entity => (
          <Card key={entity.id} className="cursor-pointer hover:border-primary/20 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg flex items-center justify-center text-primary-foreground font-bold" style={{ backgroundColor: entity.color }}>
                  {entity.code}
                </div>
                <div>
                  <h3 className="font-medium">{entity.name}</h3>
                  <p className="text-sm text-muted-foreground">24 documentos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
