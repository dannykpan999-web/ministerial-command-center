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
} from 'lucide-react';
import { useState } from 'react';
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

export function Sidebar() {
  const location = useLocation();
  const { t } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center h-16 px-4 border-b border-sidebar-border',
        collapsed ? 'justify-center' : 'gap-3'
      )}>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
          <span className="text-sm font-bold text-sidebar-primary-foreground">IA</span>
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground">Plataforma IA</span>
            <span className="text-xs text-sidebar-foreground/60">Ministerial</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            const navLink = (
              <Link
                to={item.path}
                className={cn(
                  'nav-item',
                  isActive && 'nav-item-active',
                  collapsed && 'justify-center px-2'
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{t(item.key)}</span>}
              </Link>
            );

            return (
              <li key={item.path}>
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
            'w-full text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent',
            collapsed && 'px-2'
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span>Colapsar</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
