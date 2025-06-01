
import React from 'react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { useSettingsContext } from '@/contexts/SettingsContext';
import { ShoppingBag, Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  onNext: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext }) => {
  const { profile, loading, storeName, welcomeImage } = useApp();
  const { t } = useSettingsContext();

  const userName = profile?.name || t('dearCustomer');

  const handleStartShopping = () => {
    if (onNext && typeof onNext === 'function') {
      onNext();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-200/30 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-5 w-16 h-16 bg-blue-300/20 rounded-full blur-lg"></div>
      
      <div className="text-center max-w-lg mx-auto relative z-10">
        {loading ? (
          <div className="mb-8">
            <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-gray-600 text-lg">{t('loading')}</p>
          </div>
        ) : (
          <>
            {/* Enhanced Logo Section */}
            <div className="mb-8 relative">
              <div className="relative inline-block">
                <img
                  src={welcomeImage}
                  alt="Welcome"
                  className="w-72 h-72 mx-auto rounded-3xl shadow-2xl object-cover border-4 border-white"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
                <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            
            {/* Enhanced Store Info */}
            <div className="mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center ml-3">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {t('welcomeTitle')} {storeName}
                </h1>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50">
                <p className="text-2xl font-semibold text-gray-700 mb-2">
                  {t('welcomeGreeting')} <span className="text-blue-600">{userName}</span>
                </p>
                
                <p className="text-gray-500 leading-relaxed">
                  {t('welcomeDescription')}
                </p>
              </div>
            </div>
            
            {/* Enhanced Start Button */}
            <Button
              onClick={handleStartShopping}
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 hover:from-blue-600 hover:via-purple-600 hover:to-blue-700 text-white font-bold py-6 px-12 rounded-2xl text-xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-white/20"
            >
              <ShoppingBag className="w-6 h-6 ml-3" />
              {t('startShopping')}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default WelcomeScreen;
