
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { getThemeById } from "@/data/themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const IOS_THEME = {
  id: 1,
  name: "iOS Modern",
  colors: {
    primary: "#007aff",
    secondary: "#34c759",
    accent: "#f2f3f7",
    background: "#f8f8fa",
    surface: "#ffffff",
    text: "#222b45",
    textSecondary: "#8e8e93",
  },
  gradients: {
    header: "linear-gradient(135deg, #e1e9f7 0%, #f8f8fa 100%)",
    card: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    button: "linear-gradient(90deg, #007aff 0%, #34c759 100%)",
  }
};

const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  // نجبر جميع متغيرات التصميم الخاصة بستايل iOS
  useEffect(() => {
    const theme = IOS_THEME;
    const root = document.documentElement;
    const body = document.body;

    // متغيرات الألوان
    root.style.setProperty('--theme-primary', theme.colors.primary);
    root.style.setProperty('--theme-secondary', theme.colors.secondary);
    root.style.setProperty('--theme-accent', theme.colors.accent);
    root.style.setProperty('--theme-background', theme.colors.background);
    root.style.setProperty('--theme-surface', theme.colors.surface);
    root.style.setProperty('--theme-text', theme.colors.text);
    root.style.setProperty('--theme-text-secondary', theme.colors.textSecondary);

    // متغيرات التدرجات
    root.style.setProperty('--theme-gradient-header', theme.gradients.header);
    root.style.setProperty('--theme-gradient-card', theme.gradients.card);
    root.style.setProperty('--theme-gradient-button', theme.gradients.button);

    // إعداد خلفيات وصف الألوان بقوة في البودي والجذر
    body.style.setProperty('background', theme.colors.background, 'important');
    body.style.setProperty('color', theme.colors.text, 'important');
    root.style.setProperty('background', theme.colors.background, 'important');
    root.style.setProperty('color', theme.colors.text, 'important');
    body.className = `theme-ios-modern`;

    // تعديلات على جميع العناصر لتأكيد التطبيق
    setTimeout(() => {
      // ضبط خطوط كل العناصر
      document.querySelectorAll('*').forEach(element => {
        const htmlElement = element as HTMLElement;
        if (htmlElement.style) {
          htmlElement.style.fontFamily = "'Cairo', 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif";
          htmlElement.style.transition = 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)';
        }
      });
      // إعادة رسم كامل للصفحة
      body.style.display = 'none';
      body.offsetHeight;
      body.style.display = '';
    }, 60);
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
