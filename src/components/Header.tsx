import { Search, Bell, Settings, User } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { switchRole } from '@/store/slices/roleSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';

export const Header = () => {
  const dispatch = useAppDispatch();
  const { currentRole, currentUser } = useAppSelector((state) => state.role);

  const handleRoleSwitch = () => {
    dispatch(switchRole(currentRole === 'lead' ? 'member' : 'lead'));
  };

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search..."
              className="pl-10 w-64"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Badge 
            variant={currentRole === 'lead' ? 'default' : 'secondary'}
            className="px-3 py-1"
          >
            {currentRole === 'lead' ? '👑 Team Lead' : '👤 Team Member'}
          </Badge>

          <Button
            onClick={handleRoleSwitch}
            variant="outline"
            size="sm"
            className="bg-gradient-primary text-white border-none hover:opacity-90 transition-smooth"
          >
            Switch to {currentRole === 'lead' ? 'Member' : 'Lead'}
          </Button>

          <ThemeToggle />

          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
          </Button>

          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm">
              <div className="font-medium">{currentUser}</div>
              <div className="text-muted-foreground text-xs">
                {currentRole === 'lead' ? 'Team Lead' : 'Team Member'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};