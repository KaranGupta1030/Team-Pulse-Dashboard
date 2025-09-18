import { Users, BarChart3, Settings, CheckSquare, Calendar } from 'lucide-react';
import { useAppSelector } from '@/hooks/useRedux';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navigationItems = [
  { icon: BarChart3, label: 'Dashboard', href: '/' },
  { icon: Users, label: 'Team Members', href: '/team-members' },
  { icon: CheckSquare, label: 'Tasks', href: '/tasks' },
  { icon: Calendar, label: 'Calendar', href: '/calendar' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export const Sidebar = () => {
  const currentRole = useAppSelector((state) => state.role.currentRole);
  const location = useLocation();

  return (
    <div className="w-64 bg-dashboard-sidebar-bg text-dashboard-sidebar-text shadow-elevated">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <CheckSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Team Pulse</h1>
            <p className="text-dashboard-sidebar-muted text-sm capitalize">
              {currentRole} Dashboard
            </p>
          </div>
        </div>
      </div>

      <nav className="px-4 pb-6">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.label}>
              <Link
                to={item.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-smooth",
                  location.pathname === item.href
                    ? "bg-dashboard-sidebar-accent text-white"
                    : "text-dashboard-sidebar-muted hover:bg-dashboard-sidebar-accent hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-6 py-4 border-t border-dashboard-sidebar-accent/20">
        <div className="text-xs text-dashboard-sidebar-muted">
          © 2024 Team Pulse Dashboard
        </div>
      </div>
    </div>
  );
};