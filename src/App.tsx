
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
  const { settings, loading } = useStoreSettings();

  useEffect(() => {
    const applyThemeWithForce = (theme: any) => {
      const root = document.documentElement;
      const body = document.body;
      
      console.log('تطبيق التصميم بقوة:', theme.name);
      
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
      
      // تطبيق التصميم على body وhtml مباشرة
      body.style.setProperty('background', theme.colors.background, 'important');
      body.style.setProperty('color', theme.colors.text, 'important');
      
      // تطبيق التصميم على html أيضاً
      root.style.setProperty('background', theme.colors.background, 'important');
      root.style.setProperty('color', theme.colors.text, 'important');
      
      // إضافة كلاس للتطبيق
      body.className = `theme-${theme.id}`;
      
      // إجبار إعادة رسم الصفحة
      const allElements = document.querySelectorAll('*');
      allElements.forEach(element => {
        const htmlElement = element as HTMLElement;
        if (htmlElement.style) {
          // إجبار إعادة حساب الأنماط
          htmlElement.style.display = 'none';
          htmlElement.offsetHeight; // trigger reflow
          htmlElement.style.display = '';
        }
      });
      
      console.log('تم تطبيق التصميم بقوة على كامل التطبيق:', theme.name);
    };

    if (!loading && settings?.theme_id) {
      const theme = getThemeById(settings.theme_id);
      applyThemeWithForce(theme);
    }
  }, [settings?.theme_id, loading]);

  // تطبيق التصميم عند تحميل المكون
  useEffect(() => {
    if (!loading && settings?.theme_id) {
      const theme = getThemeById(settings.theme_id);
      
      // تطبيق فوري
      setTimeout(() => {
        const root = document.documentElement;
        const body = document.body;
        
        root.style.setProperty('--theme-primary', theme.colors.primary);
        root.style.setProperty('--theme-secondary', theme.colors.secondary);
        root.style.setProperty('--theme-accent', theme.colors.accent);
        root.style.setProperty('--theme-background', theme.colors.background);
        root.style.setProperty('--theme-surface', theme.colors.surface);
        root.style.setProperty('--theme-text', theme.colors.text);
        root.style.setProperty('--theme-text-secondary', theme.colors.textSecondary);
        
        root.style.setProperty('--theme-gradient-header', theme.gradients.header);
        root.style.setProperty('--theme-gradient-card', theme.gradients.card);
        root.style.setProperty('--theme-gradient-button', theme.gradients.button);
        
        body.style.setProperty('background', theme.colors.background, 'important');
        body.style.setProperty('color', theme.colors.text, 'important');
        
        body.className = `theme-${theme.id}`;
      }, 100);
    }
  }, []);

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
