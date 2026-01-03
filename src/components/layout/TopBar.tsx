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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Bell, Globe, User, LogOut, Settings, FileText, FolderOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function TopBar() {
  const { t, locale, setLocale } = useLanguage();
  const [commandOpen, setCommandOpen] = useState(false);
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
          <Button variant="ghost" size="icon" className="h-9 w-9 relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
          </Button>

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
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                {t('common.profile')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                {t('nav.ajustes')}
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
    </>
  );
}
