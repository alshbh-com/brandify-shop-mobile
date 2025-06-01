
import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from '@/contexts/AppContext';
import AuthScreen from '@/components/AuthScreen';
import WelcomeScreen from '@/components/WelcomeScreen';
import HomeScreen from '@/components/HomeScreen';
import CartScreen from '@/components/CartScreen';
import ProfileScreen from '@/components/ProfileScreen';
import AdminPanel from '@/components/AdminPanel';
import BottomNavigation from '@/components/BottomNavigation';

const AppContent = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  
  const { isAuthenticated, isAdmin, cart } = useApp();

  console.log('AppContent - isAuthenticated:', isAuthenticated);
  console.log('AppContent - showWelcome:', showWelcome);
  console.log('AppContent - isAdmin:', isAdmin);

  useEffect(() => {
    console.log('AppContent useEffect - isAuthenticated changed:', isAuthenticated);
    if (isAuthenticated && !showWelcome) {
      console.log('Setting showWelcome to true');
      setShowWelcome(true);
      
      // Auto-hide welcome screen after 10 seconds if user doesn't interact
      const timer = setTimeout(() => {
        console.log('Auto-hiding welcome screen after timeout');
        setShowWelcome(false);
      }, 10000);
      
      return () => {
        console.log('Clearing welcome screen timeout');
        clearTimeout(timer);
      };
    }
  }, [isAuthenticated, showWelcome]);

  const handleWelcomeNext = () => {
    console.log('handleWelcomeNext called - hiding welcome screen');
    setShowWelcome(false);
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (!isAuthenticated) {
    console.log('Rendering AuthScreen');
    return <AuthScreen />;
  }

  if (isAdmin) {
    console.log('Rendering AdminPanel');
    return <AdminPanel />;
  }

  if (showWelcome) {
    console.log('Rendering WelcomeScreen');
    return <WelcomeScreen onNext={handleWelcomeNext} />;
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
    <div className="min-h-screen bg-gray-50">
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
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default Index;
