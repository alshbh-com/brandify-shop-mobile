
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

  useEffect(() => {
    if (isAuthenticated && !showWelcome) {
      setShowWelcome(true);
    }
  }, [isAuthenticated]);

  const handleWelcomeNext = () => {
    setShowWelcome(false);
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
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default Index;
