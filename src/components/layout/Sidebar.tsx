import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Home,
  Inbox,
  Send,
  FolderOpen,
  Clock,
  Bot,
  Video,
  PenTool,
  Archive,
  FileText,
  ClipboardList,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const navItems = [
  { key: 'nav.inicio', path: '/', icon: Home },
  { key: 'nav.bandeja_entrada', path: '/inbox', icon: Inbox },
  { key: 'nav.bandeja_salida', path: '/outbox', icon: Send },
  { key: 'nav.expedientes', path: '/cases', icon: FolderOpen },
  { key: 'nav.plazos', path: '/deadlines', icon: Clock },
  { key: 'nav.asistente', path: '/assistant', icon: Bot },
  { key: 'nav.multimedia', path: '/multimedia', icon: Video },
  { key: 'nav.firma', path: '/signature', icon: PenTool },
  { key: 'nav.archivo', path: '/archive', icon: Archive },
  { key: 'nav.contenidos', path: '/content', icon: FileText },
  { key: 'nav.auditoria', path: '/audit', icon: ClipboardList },
  { key: 'nav.ajustes', path: '/settings', icon: Settings },
];

// Mobile bottom navigation items (subset of main nav)
const mobileNavItems = [
  { key: 'nav.inicio', path: '/', icon: Home },
  { key: 'nav.bandeja_entrada', path: '/inbox', icon: Inbox },
  { key: 'nav.expedientes', path: '/cases', icon: FolderOpen },
  { key: 'nav.asistente', path: '/assistant', icon: Bot },
  { key: 'nav.ajustes', path: '/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const { t } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Mobile menu button - only visible on mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 left-3 z-50 lg:hidden h-10 w-10 bg-card shadow-md border"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300',
          mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar - Desktop always visible, Mobile as overlay */}
      <aside
        className={cn(
          'flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300',
          // Desktop styles
          'hidden lg:flex',
          collapsed ? 'lg:w-16' : 'lg:w-64'
        )}
      >
        {/* Logo */}
        <div className={cn(
          'flex items-center h-16 px-4 border-b border-sidebar-border',
          collapsed ? 'justify-center' : 'gap-3'
        )}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary animate-scale-in">
            <span className="text-sm font-bold text-sidebar-primary-foreground">IA</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col animate-fade-in-left">
              <span className="text-sm font-semibold text-sidebar-foreground">Plataforma IA</span>
              <span className="text-xs text-sidebar-foreground/60">Ministerial</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <ul className="space-y-1">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              const navLink = (
                <Link
                  to={item.path}
                  className={cn(
                    'nav-item group',
                    isActive && 'nav-item-active',
                    collapsed && 'justify-center px-2'
                  )}
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  <Icon className={cn(
                    'h-5 w-5 shrink-0 transition-transform duration-200',
                    'group-hover:scale-110'
                  )} />
                  {!collapsed && (
                    <span className="transition-colors duration-200">{t(item.key)}</span>
                  )}
                  {isActive && !collapsed && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-sidebar-primary rounded-r-full" />
                  )}
                </Link>
              );

              return (
                <li key={item.path} className="animate-fade-in-left relative" style={{ animationDelay: `${index * 0.03}s` }}>
                  {collapsed ? (
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        {navLink}
                      </TooltipTrigger>
                      <TooltipContent side="right" className="font-medium">
                        {t(item.key)}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    navLink
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Collapse toggle */}
        <div className="p-2 border-t border-sidebar-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              'w-full text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200',
              collapsed && 'px-2'
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4 transition-transform hover:translate-x-1" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2 transition-transform hover:-translate-x-1" />
                <span>Colapsar</span>
              </>
            )}
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar - Slide in from left */}
      <aside
        className={cn(
          'fixed left-0 top-0 bottom-0 w-[280px] z-50 flex flex-col bg-sidebar border-r border-sidebar-border lg:hidden transition-transform duration-300 ease-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-sidebar-border gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <span className="text-sm font-bold text-sidebar-primary-foreground">IA</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground">Plataforma IA</span>
            <span className="text-xs text-sidebar-foreground/60">Ministerial</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <ul className="space-y-1">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <li
                  key={item.path}
                  className={cn(
                    mobileOpen && 'animate-fade-in-left'
                  )}
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'nav-item relative',
                      isActive && 'nav-item-active'
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>{t(item.key)}</span>
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-sidebar-primary rounded-r-full" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Close button for mobile */}
        <div className="p-2 border-t border-sidebar-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileOpen(false)}
            className="w-full text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <X className="h-4 w-4 mr-2" />
            <span>Cerrar menú</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t z-40 lg:hidden safe-area-inset">
        <div className="flex items-center justify-around px-2 py-1">
          {mobileNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center justify-center py-2 px-3 min-w-[56px] rounded-lg transition-all duration-200',
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground active:scale-95'
                )}
              >
                <Icon className={cn(
                  'h-5 w-5 mb-1 transition-transform',
                  isActive && 'scale-110'
                )} />
                <span className="text-[10px] font-medium truncate max-w-[56px]">
                  {t(item.key).split(' ')[0]}
                </span>
                {isActive && (
                  <span className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
