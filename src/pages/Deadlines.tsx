import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTableSkeleton } from '@/components/ui/data-table-skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import {
  Plus,
  Calendar,
  List,
  Clock,
  AlertTriangle,
  CheckCircle,
  Bell,
} from 'lucide-react';
import {
  fetchDeadlines,
  getUserById,
  getExpedienteById,
  Deadline,
} from '@/lib/mockData';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function DeadlinesPage() {
  const { t } = useLanguage();
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'calendar' | 'list'>('list');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    async function loadData() {
      const data = await fetchDeadlines();
      setDeadlines(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getDeadlinesForDay = (day: Date) => {
    return deadlines.filter(d => isSameDay(d.dueDate, day));
  };

  const statusVariants: Record<string, 'warning' | 'destructive' | 'muted'> = {
    upcoming: 'muted',
    urgent: 'warning',
    overdue: 'destructive',
  };

  const statusLabels: Record<string, string> = {
    upcoming: 'Próximo',
    urgent: 'Urgente',
    overdue: 'Vencido',
  };

  const sortedDeadlines = [...deadlines].sort((a, b) => {
    const order = { overdue: 0, urgent: 1, upcoming: 2 };
    return order[a.status] - order[b.status];
  });

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <PageHeader
        title={t('deadlines.title')}
        description={t('deadlines.description')}
        action={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t('deadlines.new_deadline')}
          </Button>
        }
      />

      {/* View Toggle */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={view === 'list' ? 'secondary' : 'outline'}
          size="sm"
          onClick={() => setView('list')}
        >
          <List className="h-4 w-4 mr-1" />
          {t('deadlines.list_view')}
        </Button>
        <Button
          variant={view === 'calendar' ? 'secondary' : 'outline'}
          size="sm"
          onClick={() => setView('calendar')}
        >
          <Calendar className="h-4 w-4 mr-1" />
          {t('deadlines.calendar_view')}
        </Button>
      </div>

      {/* Alert Rules Preview */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Reglas de alerta activas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-success" />
              {t('deadlines.reminder_48h')}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-success" />
              {t('deadlines.escalate_today')}
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <DataTableSkeleton columns={5} rows={5} />
      ) : view === 'list' ? (
        /* List View */
        deadlines.length === 0 ? (
          <EmptyState
            icon={Clock}
            title={t('empty.no_deadlines')}
            description={t('empty.no_deadlines_desc')}
          />
        ) : (
          <div className="space-y-3">
            {sortedDeadlines.map(deadline => {
              const user = getUserById(deadline.assignedTo);
              const expediente = getExpedienteById(deadline.expedienteId);
              return (
                <Card key={deadline.id} className="hover:border-primary/20 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        'h-10 w-10 rounded-lg flex items-center justify-center shrink-0',
                        deadline.status === 'overdue' ? 'bg-destructive/10 text-destructive' :
                        deadline.status === 'urgent' ? 'bg-warning/10 text-warning' :
                        'bg-muted text-muted-foreground'
                      )}>
                        {deadline.status === 'overdue' ? <AlertTriangle className="h-5 w-5" /> :
                         deadline.status === 'urgent' ? <Clock className="h-5 w-5" /> :
                         <Calendar className="h-5 w-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-medium">{deadline.title}</h3>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {expediente?.number} · {user?.name}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-medium">{format(deadline.dueDate, "d 'de' MMMM", { locale: es })}</p>
                            <StatusBadge variant={statusVariants[deadline.status]} className="mt-1">
                              {statusLabels[deadline.status]}
                            </StatusBadge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )
      ) : (
        /* Calendar View */
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg">
              {format(currentMonth, 'MMMM yyyy', { locale: es })}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(new Date())}
              >
                Hoy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
              >
                Siguiente
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                <div key={day} className="bg-muted p-2 text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
              {daysInMonth.map((day, index) => {
                const dayDeadlines = getDeadlinesForDay(day);
                const dayOfWeek = day.getDay();
                const adjustedIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                
                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      'bg-card min-h-24 p-2 relative',
                      index === 0 && `col-start-${adjustedIndex + 1}`,
                      isToday(day) && 'bg-primary/5'
                    )}
                    style={index === 0 ? { gridColumnStart: adjustedIndex + 1 } : undefined}
                  >
                    <span className={cn(
                      'text-sm',
                      isToday(day) && 'font-bold text-primary'
                    )}>
                      {format(day, 'd')}
                    </span>
                    <div className="mt-1 space-y-1">
                      {dayDeadlines.slice(0, 2).map(d => (
                        <div
                          key={d.id}
                          className={cn(
                            'text-xs p-1 rounded truncate',
                            d.status === 'overdue' ? 'bg-destructive/10 text-destructive' :
                            d.status === 'urgent' ? 'bg-warning/10 text-warning' :
                            'bg-muted text-muted-foreground'
                          )}
                        >
                          {d.title}
                        </div>
                      ))}
                      {dayDeadlines.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{dayDeadlines.length - 2} más
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
