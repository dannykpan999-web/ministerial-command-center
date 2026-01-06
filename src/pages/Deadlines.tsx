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
    <div className="p-4 sm:p-6 max-w-7xl mx-auto animate-fade-in safe-area-inset">
      <PageHeader
        title={t('deadlines.title')}
        description={t('deadlines.description')}
        action={
          <Button size="sm" className="h-9 sm:h-10">
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">{t('deadlines.new_deadline')}</span>
          </Button>
        }
      />

      {/* View Toggle - Compact on mobile */}
      <div className="flex gap-2 mb-4 sm:mb-6">
        <Button
          variant={view === 'list' ? 'secondary' : 'outline'}
          size="sm"
          onClick={() => setView('list')}
          className="h-8 sm:h-9 text-xs sm:text-sm"
        >
          <List className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">{t('deadlines.list_view')}</span>
        </Button>
        <Button
          variant={view === 'calendar' ? 'secondary' : 'outline'}
          size="sm"
          onClick={() => setView('calendar')}
          className="h-8 sm:h-9 text-xs sm:text-sm"
        >
          <Calendar className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">{t('deadlines.calendar_view')}</span>
        </Button>
      </div>

      {/* Alert Rules Preview - Compact on mobile */}
      <Card className="mb-4 sm:mb-6">
        <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6">
          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Reglas de alerta activas</span>
            <span className="sm:hidden">Alertas activas</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-success shrink-0" />
              <span className="truncate">{t('deadlines.reminder_48h')}</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-success shrink-0" />
              <span className="truncate">{t('deadlines.escalate_today')}</span>
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
          <div className="space-y-2 sm:space-y-3">
            {sortedDeadlines.map(deadline => {
              const user = getUserById(deadline.assignedTo);
              const expediente = getExpedienteById(deadline.expedienteId);
              return (
                <Card key={deadline.id} className="hover:border-primary/20 transition-colors cursor-pointer active:scale-[0.98]">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className={cn(
                        'h-8 w-8 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center shrink-0',
                        deadline.status === 'overdue' ? 'bg-destructive/10 text-destructive' :
                        deadline.status === 'urgent' ? 'bg-warning/10 text-warning' :
                        'bg-muted text-muted-foreground'
                      )}>
                        {deadline.status === 'overdue' ? <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" /> :
                         deadline.status === 'urgent' ? <Clock className="h-4 w-4 sm:h-5 sm:w-5" /> :
                         <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        {/* Mobile layout */}
                        <div className="sm:hidden">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-medium text-sm truncate">{deadline.title}</h3>
                            <StatusBadge variant={statusVariants[deadline.status]} className="text-[10px] shrink-0">
                              {statusLabels[deadline.status]}
                            </StatusBadge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate mb-1">
                            {expediente?.number} · {user?.name}
                          </p>
                          <p className="text-xs font-medium">{format(deadline.dueDate, "d MMM", { locale: es })}</p>
                        </div>
                        {/* Desktop layout */}
                        <div className="hidden sm:block">
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
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 sm:pb-4 px-3 sm:px-6">
            <CardTitle className="text-base sm:text-lg capitalize">
              {format(currentMonth, 'MMMM yyyy', { locale: es })}
            </CardTitle>
            <div className="flex gap-1 sm:gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
                className="flex-1 sm:flex-none h-8 text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">Anterior</span>
                <span className="sm:hidden">Ant.</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(new Date())}
                className="flex-1 sm:flex-none h-8 text-xs sm:text-sm"
              >
                Hoy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
                className="flex-1 sm:flex-none h-8 text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">Siguiente</span>
                <span className="sm:hidden">Sig.</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
              {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => (
                <div key={day} className="bg-muted p-1 sm:p-2 text-center text-[10px] sm:text-sm font-medium text-muted-foreground">
                  <span className="sm:hidden">{day}</span>
                  <span className="hidden sm:inline">{['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'][i]}</span>
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
                      'bg-card min-h-16 sm:min-h-24 p-1 sm:p-2 relative',
                      index === 0 && `col-start-${adjustedIndex + 1}`,
                      isToday(day) && 'bg-primary/5'
                    )}
                    style={index === 0 ? { gridColumnStart: adjustedIndex + 1 } : undefined}
                  >
                    <span className={cn(
                      'text-[10px] sm:text-sm',
                      isToday(day) && 'font-bold text-primary'
                    )}>
                      {format(day, 'd')}
                    </span>
                    <div className="mt-0.5 sm:mt-1 space-y-0.5 sm:space-y-1">
                      {/* Mobile: Show dots only */}
                      <div className="sm:hidden flex gap-0.5 flex-wrap">
                        {dayDeadlines.slice(0, 3).map(d => (
                          <div
                            key={d.id}
                            className={cn(
                              'h-1.5 w-1.5 rounded-full',
                              d.status === 'overdue' ? 'bg-destructive' :
                              d.status === 'urgent' ? 'bg-warning' :
                              'bg-muted-foreground'
                            )}
                          />
                        ))}
                        {dayDeadlines.length > 3 && (
                          <span className="text-[8px] text-muted-foreground">+{dayDeadlines.length - 3}</span>
                        )}
                      </div>
                      {/* Desktop: Show full labels */}
                      <div className="hidden sm:block">
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
