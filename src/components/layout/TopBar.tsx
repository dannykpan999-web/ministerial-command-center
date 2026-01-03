import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { locales, Locale } from '@/lib/i18n';
import { currentUser } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Search,
  Bell,
  Globe,
  User,
  LogOut,
  Settings,
  FileText,
  FolderOpen,
  Clock,
  PenTool,
  AlertTriangle,
  CheckCircle,
  Moon,
  Sun,
  HelpCircle,
  Mail,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, subHours, subDays } from 'date-fns';
import { es } from 'date-fns/locale';

interface Notification {
  id: string;
  type: 'deadline' | 'signature' | 'document' | 'system';
  title: string;
  message: string;
  time: Date;
  read: boolean;
  actionUrl?: string;
}

const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'deadline',
    title: 'Plazo próximo a vencer',
    message: 'Respuesta a solicitud de ampliación vence en 3 días',
    time: subHours(new Date(), 1),
    read: false,
    actionUrl: '/deadlines',
  },
  {
    id: 'n2',
    type: 'signature',
    title: 'Documento pendiente de firma',
    message: 'Solicitud de ampliación de concesión portuaria requiere su firma',
    time: subHours(new Date(), 3),
    read: false,
    actionUrl: '/signature',
  },
  {
    id: 'n3',
    type: 'document',
    title: 'Nuevo documento recibido',
    message: 'ENT-2024-001542 - Solicitud de ampliación de concesión',
    time: subDays(new Date(), 1),
    read: true,
    actionUrl: '/inbox',
  },
  {
    id: 'n4',
    type: 'system',
    title: 'Actualización del sistema',
    message: 'Se han aplicado mejoras de seguridad al sistema',
    time: subDays(new Date(), 2),
    read: true,
  },
  {
    id: 'n5',
    type: 'deadline',
    title: 'Plazo vencido',
    message: 'Entrega documentación portuaria venció hace 2 días',
    time: subDays(new Date(), 2),
    read: true,
    actionUrl: '/deadlines',
  },
];

export function TopBar() {
  const { t, locale, setLocale } = useLanguage();
  const [commandOpen, setCommandOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  const initials = currentUser.name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('');

  const roleLabels: Record<string, string> = {
    admin: 'Administrador',
    gabinete: 'Gabinete',
    revisor: 'Revisor',
    lector: 'Lector',
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'deadline': return <Clock className="h-4 w-4 text-warning" />;
      case 'signature': return <PenTool className="h-4 w-4 text-primary" />;
      case 'document': return <FileText className="h-4 w-4 text-info" />;
      case 'system': return <Settings className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    setNotifications(notifications.map(n =>
      n.id === notification.id ? { ...n, read: true } : n
    ));
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const formatNotificationTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Hace unos minutos';
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    return format(date, 'dd MMM', { locale: es });
  };

  return (
    <>
      <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
        {/* Search */}
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <Button
            variant="outline"
            className="w-full justify-start text-muted-foreground h-10"
            onClick={() => setCommandOpen(true)}
          >
            <Search className="h-4 w-4 mr-2" />
            <span className="flex-1 text-left">{t('common.search_placeholder')}</span>
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={toggleDarkMode}
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Language switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Idioma</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.entries(locales).map(([code, name]) => (
                <DropdownMenuItem
                  key={code}
                  onClick={() => setLocale(code as Locale)}
                  className={locale === code ? 'bg-accent' : ''}
                >
                  {name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h3 className="font-semibold text-sm">{t('common.notifications')}</h3>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={markAllAsRead}>
                    Marcar todo como leído
                  </Button>
                )}
              </div>
              <ScrollArea className="h-[320px]">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <Bell className="h-8 w-8 mb-2 opacity-50" />
                    <p className="text-sm">Sin notificaciones</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {notifications.map(notification => (
                      <div
                        key={notification.id}
                        className={`flex gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                          !notification.read ? 'bg-primary/5' : ''
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <span className="shrink-0 h-2 w-2 rounded-full bg-primary mt-1.5" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatNotificationTime(notification.time)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
              <div className="border-t p-2">
                <Button variant="ghost" className="w-full text-sm" onClick={() => navigate('/settings')}>
                  Ver configuración de notificaciones
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 gap-2 pl-2 pr-3">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm font-medium">{currentUser.name.split(' ')[0]}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{currentUser.name}</p>
                  <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                  <Badge variant="secondary" className="w-fit mt-1 text-xs">
                    {roleLabels[currentUser.role]}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setProfileOpen(true)}>
                <User className="mr-2 h-4 w-4" />
                {t('common.profile')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                {t('nav.ajustes')}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                Ayuda
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                {t('common.logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Command palette */}
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder={t('common.search_placeholder')} />
        <CommandList>
          <CommandEmpty>{t('common.no_results')}</CommandEmpty>
          <CommandGroup heading="Documentos">
            <CommandItem onSelect={() => { navigate('/inbox'); setCommandOpen(false); }}>
              <FileText className="mr-2 h-4 w-4" />
              <span>ENT-2024-001542 - Solicitud de ampliación</span>
            </CommandItem>
            <CommandItem onSelect={() => { navigate('/inbox'); setCommandOpen(false); }}>
              <FileText className="mr-2 h-4 w-4" />
              <span>ENT-2024-001541 - Informe trimestral</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Expedientes">
            <CommandItem onSelect={() => { navigate('/cases/exp1'); setCommandOpen(false); }}>
              <FolderOpen className="mr-2 h-4 w-4" />
              <span>EXP-2024-00342 - Renovación Terminal Norte</span>
            </CommandItem>
            <CommandItem onSelect={() => { navigate('/cases/exp2'); setCommandOpen(false); }}>
              <FolderOpen className="mr-2 h-4 w-4" />
              <span>EXP-2024-00341 - Licitación 5G</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Profile Dialog */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Mi Perfil</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            {/* Avatar section */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{currentUser.name}</h3>
                <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                <Badge variant="secondary" className="mt-1 text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  {roleLabels[currentUser.role]}
                </Badge>
              </div>
            </div>

            {/* Profile info */}
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="profile-name">Nombre completo</Label>
                  <Input id="profile-name" defaultValue={currentUser.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-email">Correo electrónico</Label>
                  <Input id="profile-email" defaultValue={currentUser.email} type="email" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Rol</Label>
                <Input value={roleLabels[currentUser.role]} disabled />
              </div>

              <Card>
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium mb-3">Estadísticas</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-semibold">24</p>
                      <p className="text-xs text-muted-foreground">Documentos</p>
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">8</p>
                      <p className="text-xs text-muted-foreground">Expedientes</p>
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">12</p>
                      <p className="text-xs text-muted-foreground">Firmas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setProfileOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setProfileOpen(false)}>
                Guardar cambios
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
