
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { getThemeById } from "@/data/themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  const { settings } = useStoreSettings();

  useEffect(() => {
    if (settings?.theme_id) {
      const theme = getThemeById(settings.theme_id);
      const root = document.documentElement;
      
      // تطبيق متغيرات CSS المخصصة
      root.style.setProperty('--theme-primary', theme.colors.primary);
      root.style.setProperty('--theme-secondary', theme.colors.secondary);
      root.style.setProperty('--theme-accent', theme.colors.accent);
      root.style.setProperty('--theme-background', theme.colors.background);
      root.style.setProperty('--theme-surface', theme.colors.surface);
      root.style.setProperty('--theme-text', theme.colors.text);
      root.style.setProperty('--theme-text-secondary', theme.colors.textSecondary);
      
      // تطبيق التدرجات
      root.style.setProperty('--theme-gradient-header', theme.gradients.header);
      root.style.setProperty('--theme-gradient-card', theme.gradients.card);
      root.style.setProperty('--theme-gradient-button', theme.gradients.button);
      
      console.log('Global theme applied:', theme.name);
    }
  }, [settings?.theme_id]);

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeWrapper>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeWrapper>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
