
import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from '@/contexts/AppContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import AuthScreen from '@/components/AuthScreen';
import WelcomeScreen from '@/components/WelcomeScreen';
import HomeScreen from '@/components/HomeScreen';
import CartScreen from '@/components/CartScreen';
import ProfileScreen from '@/components/ProfileScreen';
import AdminPanel from '@/components/AdminPanel';
import BottomNavigation from '@/components/BottomNavigation';
import ThemeToggle from '@/components/ThemeToggle';

const AppContent = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(() => {
    // التحقق من localStorage لمعرفة إذا كان المستخدم رأى شاشة الترحيب من قبل
    return localStorage.getItem('hasSeenWelcome') === 'true';
  });
  const [activeTab, setActiveTab] = useState('home');
  
  const { isAuthenticated, isAdmin, cart } = useApp();

  console.log('AppContent - isAuthenticated:', isAuthenticated);
  console.log('AppContent - showWelcome:', showWelcome);
  console.log('AppContent - hasSeenWelcome:', hasSeenWelcome);
  console.log('AppContent - isAdmin:', isAdmin);

  useEffect(() => {
    console.log('AppContent useEffect - isAuthenticated changed:', isAuthenticated);
    // إظهار شاشة الترحيب فقط إذا كان المستخدم مسجل الدخول ولم يرها من قبل
    if (isAuthenticated && !hasSeenWelcome) {
      console.log('Setting showWelcome to true for first time');
      setShowWelcome(true);
      
      // إخفاء شاشة الترحيب تلقائياً بعد 10 ثوان
      const timer = setTimeout(() => {
        console.log('Auto-hiding welcome screen after timeout');
        handleWelcomeNext();
      }, 10000);
      
      return () => {
        console.log('Clearing welcome screen timeout');
        clearTimeout(timer);
      };
    }
  }, [isAuthenticated, hasSeenWelcome]);

  // إعادة تعيين hasSeenWelcome عند تسجيل الخروج
  useEffect(() => {
    if (!isAuthenticated) {
      setHasSeenWelcome(false);
      setShowWelcome(false);
      localStorage.removeItem('hasSeenWelcome');
    }
  }, [isAuthenticated]);

  const handleWelcomeNext = () => {
    console.log('handleWelcomeNext called - hiding welcome screen permanently');
    setShowWelcome(false);
    setHasSeenWelcome(true);
    localStorage.setItem('hasSeenWelcome', 'true');
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (!isAuthenticated) {
    console.log('Rendering AuthScreen');
    return (
      <>
        <ThemeToggle />
        <AuthScreen />
      </>
    );
  }

  if (isAdmin) {
    console.log('Rendering AdminPanel');
    return (
      <>
        <ThemeToggle />
        <AdminPanel />
      </>
    );
  }

  if (showWelcome) {
    console.log('Rendering WelcomeScreen with handleWelcomeNext:', handleWelcomeNext);
    return (
      <>
        <ThemeToggle />
        <WelcomeScreen onNext={handleWelcomeNext} />
      </>
    );
  }

  console.log('Rendering main app with activeTab:', activeTab);

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'cart':
        return <CartScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ThemeToggle />
      {renderActiveScreen()}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        cartItemsCount={cartItemsCount}
      />
    </div>
  );
};

const Index = () => {
  return (
    <SettingsProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </SettingsProvider>
  );
};

export default Index;
