
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

const AppContent = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(() => {
    return localStorage.getItem('hasSeenWelcome') === 'true';
  });
  const [activeTab, setActiveTab] = useState('home');
  
  const { isAuthenticated, isAdmin, cart } = useApp();

  useEffect(() => {
    if (isAuthenticated && !hasSeenWelcome) {
      setShowWelcome(true);
      
      const timer = setTimeout(() => {
        handleWelcomeNext();
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, hasSeenWelcome]);

  useEffect(() => {
    if (!isAuthenticated) {
      setHasSeenWelcome(false);
      setShowWelcome(false);
      localStorage.removeItem('hasSeenWelcome');
    }
  }, [isAuthenticated]);

  const handleWelcomeNext = () => {
    setShowWelcome(false);
    setHasSeenWelcome(true);
    localStorage.setItem('hasSeenWelcome', 'true');
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  if (isAdmin) {
    return <AdminPanel />;
  }

  if (showWelcome) {
    return <WelcomeScreen onNext={handleWelcomeNext} />;
  }

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
    <SettingsProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </SettingsProvider>
  );
};

export default Index;
