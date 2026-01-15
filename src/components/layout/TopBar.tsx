import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { locales, Locale } from '@/lib/i18n';
import { useAuth } from '@/contexts/AuthContext';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/components/ui/sonner';
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
  CheckCircle2,
  Moon,
  Sun,
  HelpCircle,
  Mail,
  Shield,
  Loader2,
  Phone,
  Briefcase
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
  const { user, logout, updateProfile } = useAuth();
  const [commandOpen, setCommandOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const navigate = useNavigate();

  const userName = user ? `${user.firstName} ${user.lastName}` : 'Usuario';
  const userEmail = user?.email || '';
  const userRole = user?.role || 'LECTOR';

  const initials = userName
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('');

  const roleLabels: Record<string, string> = {
    ADMIN: 'Administrador',
    GABINETE: 'Gabinete',
    REVISOR: 'Revisor',
    LECTOR: 'Lector',
  };

  // Format phone number for Equatorial Guinea (+240)
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');

    // If starts with 240, keep it; otherwise add +240 prefix
    let formatted = '';
    if (cleaned.startsWith('240')) {
      // Format: +240 XXX XXX XXX
      formatted = '+240';
      if (cleaned.length > 3) formatted += ' ' + cleaned.slice(3, 6);
      if (cleaned.length > 6) formatted += ' ' + cleaned.slice(6, 9);
      if (cleaned.length > 9) formatted += ' ' + cleaned.slice(9, 12);
    } else if (cleaned.length > 0) {
      // Add +240 prefix
      formatted = '+240';
      if (cleaned.length > 0) formatted += ' ' + cleaned.slice(0, 3);
      if (cleaned.length > 3) formatted += ' ' + cleaned.slice(3, 6);
      if (cleaned.length > 6) formatted += ' ' + cleaned.slice(6, 9);
    }

    return formatted;
  };

  // Handle phone input change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  // Initialize form fields when modal opens
  const handleProfileOpen = (open: boolean) => {
    if (open && user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setPhone(user.phone || '');
      setPosition(user.position || '');
      setUpdateError(null);
    }
    setProfileOpen(open);
  };

  // Handle profile update
  const handleSaveProfile = async () => {
    if (!user) return;

    setIsUpdating(true);
    setUpdateError(null);

    try {
      await updateProfile(user.id, {
        firstName,
        lastName,
        email,
        phone: phone || undefined,
        position: position || undefined,
      });

      toast.success('¡Perfil actualizado!', {
        description: 'Tus cambios han sido guardados exitosamente',
        duration: 3000,
        icon: <CheckCircle2 className="h-5 w-5" />,
        className: 'border-l-4 border-l-green-500',
      });

      setProfileOpen(false);
    } catch (error: any) {
      const errorMessage = error.message || 'Error al actualizar perfil';
      setUpdateError(errorMessage);

      toast.error('Error al actualizar', {
        description: errorMessage,
        duration: 4000,
        icon: <AlertTriangle className="h-5 w-5" />,
        className: 'border-l-4 border-l-red-500',
      });
    } finally {
      setIsUpdating(false);
    }
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
      <header className="h-14 sm:h-16 border-b border-border bg-card flex items-center justify-between px-3 sm:px-6 pl-14 lg:pl-6">
        {/* Search - Hidden on mobile, shown as icon */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 max-w-xl">
          {/* Mobile search button */}
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden h-9 w-9"
            onClick={() => setCommandOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Desktop search bar */}
          <Button
            variant="outline"
            className="hidden sm:flex w-full justify-start text-muted-foreground h-10 transition-all duration-200 hover:border-primary/50"
            onClick={() => setCommandOpen(true)}
          >
            <Search className="h-4 w-4 mr-2" />
            <span className="flex-1 text-left">{t('common.search_placeholder')}</span>
            <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 transition-transform duration-200 hover:scale-110"
            onClick={toggleDarkMode}
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 transition-transform duration-300 rotate-0 hover:rotate-90" />
            ) : (
              <Moon className="h-4 w-4 transition-transform duration-300 rotate-0 hover:-rotate-12" />
            )}
          </Button>

          {/* Language switcher - Hidden on mobile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 hidden sm:flex">
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="animate-scale-in">
              <DropdownMenuLabel>Idioma</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.entries(locales).map(([code, name]) => (
                <DropdownMenuItem
                  key={code}
                  onClick={() => setLocale(code as Locale)}
                  className={`transition-colors ${locale === code ? 'bg-accent' : ''}`}
                >
                  {name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 relative transition-transform duration-200 hover:scale-110">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center animate-bounce-in">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[calc(100vw-24px)] sm:w-80 p-0 animate-scale-in">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h3 className="font-semibold text-sm">{t('common.notifications')}</h3>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={markAllAsRead}>
                    <span className="hidden sm:inline">Marcar todo como leído</span>
                    <span className="sm:hidden">Marcar leído</span>
                  </Button>
                )}
              </div>
              <ScrollArea className="h-[280px] sm:h-[320px]">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground animate-fade-in">
                    <Bell className="h-8 w-8 mb-2 opacity-50 animate-float" />
                    <p className="text-sm">Sin notificaciones</p>
                  </div>
                ) : (
                  <div className="divide-y stagger-children">
                    {notifications.map(notification => (
                      <div
                        key={notification.id}
                        className={`flex gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-all duration-200 active:scale-[0.98] ${
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
                              <span className="shrink-0 h-2 w-2 rounded-full bg-primary mt-1.5 animate-pulse" />
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
                  <span className="hidden sm:inline">Ver configuración de notificaciones</span>
                  <span className="sm:hidden">Configuración</span>
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 gap-2 pl-2 pr-2 sm:pr-3 transition-transform duration-200 hover:scale-105">
                <Avatar className="h-7 w-7 transition-transform duration-200">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline text-sm font-medium">{userName.split(' ')[0]}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 animate-scale-in">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-muted-foreground">{userEmail}</p>
                  <Badge variant="secondary" className="w-fit mt-1 text-xs">
                    {roleLabels[userRole]}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleProfileOpen(true)} className="transition-colors">
                <User className="mr-2 h-4 w-4" />
                {t('common.profile')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')} className="transition-colors">
                <Settings className="mr-2 h-4 w-4" />
                {t('nav.ajustes')}
              </DropdownMenuItem>
              {/* Language option for mobile */}
              <DropdownMenuItem className="sm:hidden transition-colors">
                <Globe className="mr-2 h-4 w-4" />
                Idioma
              </DropdownMenuItem>
              <DropdownMenuItem className="transition-colors">
                <HelpCircle className="mr-2 h-4 w-4" />
                Ayuda
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive transition-colors"
                onClick={() => logout()}
              >
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
      <Dialog open={profileOpen} onOpenChange={handleProfileOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Mi Perfil</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            {/* Error alert */}
            {updateError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{updateError}</AlertDescription>
              </Alert>
            )}

            {/* Avatar section */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{userName}</h3>
                <p className="text-sm text-muted-foreground">{userEmail}</p>
                <Badge variant="secondary" className="mt-1 text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  {roleLabels[userRole]}
                </Badge>
              </div>
            </div>

            {/* Profile info */}
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="profile-firstName">Nombre</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="profile-firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="pl-10"
                      disabled={isUpdating}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-lastName">Apellido</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="profile-lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="pl-10"
                      disabled={isUpdating}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-email">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="profile-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isUpdating}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-phone">Teléfono (opcional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="profile-phone"
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="+240 222 333 444"
                    className="pl-10"
                    disabled={isUpdating}
                    maxLength={16}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Formato: +240 XXX XXX XXX
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-position">Cargo (opcional)</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="profile-position"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="Director de Tecnología"
                    className="pl-10"
                    disabled={isUpdating}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Rol</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input value={roleLabels[userRole]} disabled className="pl-10" />
                </div>
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
              <Button
                variant="outline"
                onClick={() => handleProfileOpen(false)}
                disabled={isUpdating}
              >
                Cancelar
              </Button>
              <Button onClick={handleSaveProfile} disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  'Guardar cambios'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
