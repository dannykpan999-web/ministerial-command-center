import { useLanguage } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, CheckCircle, Clock } from 'lucide-react';

const articles = [
  { id: '1', title: 'Avances en infraestructura portuaria', sector: 'Puertos', status: 'published' },
  { id: '2', title: 'Nueva regulación de telecomunicaciones', sector: 'Telecomunicaciones', status: 'pending' },
  { id: '3', title: 'Acuerdos de cooperación 2024', sector: 'Internacional', status: 'draft' },
];

export default function ContentPage() {
  const { t } = useLanguage();
  const statusLabels: Record<string, string> = { published: 'Publicado', pending: 'Pendiente', draft: 'Borrador' };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <PageHeader title={t('content.title')} description={t('content.description')} action={<Button><Plus className="h-4 w-4 mr-2" />{t('content.new_article')}</Button>} />
      <div className="space-y-3">
        {articles.map(article => (
          <Card key={article.id} className="hover:border-primary/20 cursor-pointer transition-colors">
            <CardContent className="p-4 flex items-center gap-4">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1"><p className="font-medium">{article.title}</p><p className="text-sm text-muted-foreground">{article.sector}</p></div>
              <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>{statusLabels[article.status]}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
