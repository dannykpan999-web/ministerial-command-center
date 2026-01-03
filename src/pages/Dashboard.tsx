import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { KpiCard } from '@/components/ui/kpi-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Inbox,
  Send,
  FolderOpen,
  Clock,
  PenTool,
  Plus,
  Upload,
  Bot,
  ArrowRight,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import {
  fetchDashboardStats,
  fetchDocuments,
  fetchDeadlines,
  getEntityById,
  getUserById,
  currentUser,
  Document,
  Deadline,
} from '@/lib/mockData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Dashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [recentDocs, setRecentDocs] = useState<Document[]>([]);
  const [urgentDeadlines, setUrgentDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [statsData, docs, deadlines] = await Promise.all([
        fetchDashboardStats(),
        fetchDocuments('in'),
        fetchDeadlines(),
      ]);
      setStats(statsData);
      setRecentDocs(docs.slice(0, 5));
      setUrgentDeadlines(deadlines.filter(d => d.status === 'urgent' || d.status === 'overdue').slice(0, 4));
      setLoading(false);
    }
    loadData();
  }, []);

  const quickActions = [
    { label: t('dashboard.register_entry'), icon: Inbox, path: '/inbox/new', primary: true },
    { label: t('dashboard.register_exit'), icon: Send, path: '/outbox/new' },
    { label: t('dashboard.create_case'), icon: FolderOpen, path: '/cases/new' },
    { label: t('dashboard.upload_scan'), icon: Upload, path: '/multimedia' },
    { label: t('dashboard.ask_ai'), icon: Bot, path: '/assistant' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <PageHeader
        title={`${t('dashboard.welcome')}, ${currentUser.name.split(' ')[0]}`}
        description={format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
      />

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
        <KpiCard
          title={t('dashboard.entries_today')}
          value={stats?.entriesToday ?? 0}
          icon={Inbox}
          loading={loading}
        />
        <KpiCard
          title={t('dashboard.exits_today')}
          value={stats?.exitsToday ?? 0}
          icon={Send}
          loading={loading}
        />
        <KpiCard
          title={t('dashboard.open_cases')}
          value={stats?.openCases ?? 0}
          icon={FolderOpen}
          loading={loading}
        />
        <KpiCard
          title={t('dashboard.upcoming_deadlines')}
          value={stats?.upcomingDeadlines ?? 0}
          icon={Clock}
          loading={loading}
        />
        <KpiCard
          title={t('dashboard.pending_signatures')}
          value={stats?.pendingSignatures ?? 0}
          icon={PenTool}
          loading={loading}
        />
      </div>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">{t('dashboard.quick_actions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.path}
                variant={action.primary ? 'default' : 'outline'}
                onClick={() => navigate(action.path)}
                className="gap-2"
              >
                <action.icon className="h-4 w-4" />
                {action.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Two column layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold">{t('dashboard.recent_activity')}</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/inbox')}>
              Ver todo
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded bg-muted skeleton-shimmer" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 rounded bg-muted skeleton-shimmer" />
                      <div className="h-3 w-1/2 rounded bg-muted skeleton-shimmer" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {recentDocs.map((doc) => {
                  const entity = getEntityById(doc.entityId);
                  return (
                    <div
                      key={doc.id}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => navigate('/inbox')}
                    >
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold text-primary-foreground"
                        style={{ backgroundColor: entity?.color }}
                      >
                        {entity?.code}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{doc.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.correlativeNumber} · {format(doc.createdAt, 'dd MMM', { locale: es })}
                        </p>
                      </div>
                      <StatusBadge
                        variant={
                          doc.status === 'pending' ? 'warning' :
                          doc.status === 'in_progress' ? 'info' :
                          doc.status === 'completed' ? 'success' : 'muted'
                        }
                      >
                        {doc.status === 'pending' ? 'Pendiente' :
                         doc.status === 'in_progress' ? 'En proceso' :
                         doc.status === 'completed' ? 'Completado' : 'Archivado'}
                      </StatusBadge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Urgent Alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              {t('dashboard.urgent_alerts')}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/deadlines')}>
              Ver todo
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded bg-muted skeleton-shimmer" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 rounded bg-muted skeleton-shimmer" />
                      <div className="h-3 w-1/2 rounded bg-muted skeleton-shimmer" />
                    </div>
                  </div>
                ))}
              </div>
            ) : urgentDeadlines.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No hay alertas urgentes</p>
              </div>
            ) : (
              <div className="space-y-3">
                {urgentDeadlines.map((deadline) => {
                  const user = getUserById(deadline.assignedTo);
                  return (
                    <div
                      key={deadline.id}
                      className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:border-border cursor-pointer transition-colors"
                      onClick={() => navigate('/deadlines')}
                    >
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        deadline.status === 'overdue' ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'
                      }`}>
                        <Clock className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{deadline.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {user?.name} · Vence {format(deadline.dueDate, 'dd MMM', { locale: es })}
                        </p>
                      </div>
                      <StatusBadge
                        variant={deadline.status === 'overdue' ? 'destructive' : 'warning'}
                      >
                        {deadline.status === 'overdue' ? 'Vencido' : 'Urgente'}
                      </StatusBadge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
