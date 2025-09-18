import { Moon, Sun } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { setTheme } from '@/store/slices/themeSlice';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export const ThemeToggle = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.toggle('dark', systemTheme === 'dark');
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  const handleThemeChange = () => {
    if (theme === 'light') {
      dispatch(setTheme('dark'));
    } else if (theme === 'dark') {
      dispatch(setTheme('system'));
    } else {
      dispatch(setTheme('light'));
    }
  };

  const getThemeIcon = () => {
    if (theme === 'dark') {
      return <Moon className="w-4 h-4" />;
    } else if (theme === 'light') {
      return <Sun className="w-4 h-4" />;
    } else {
      // System theme - show based on current system preference
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      return systemTheme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'Auto';
      default:
        return 'Auto';
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleThemeChange}
      className="flex items-center space-x-2 hover:bg-accent"
      title={`Current theme: ${getThemeLabel()} - Click to cycle through themes`}
    >
      {getThemeIcon()}
      <span className="hidden sm:inline text-sm">{getThemeLabel()}</span>
    </Button>
  );
};