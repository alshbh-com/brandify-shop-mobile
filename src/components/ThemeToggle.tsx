
import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useSettingsContext } from '@/contexts/SettingsContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useSettingsContext();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="fixed top-4 left-4 z-50 bg-white dark:bg-gray-800 shadow-lg"
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Button>
  );
};

export default ThemeToggle;
