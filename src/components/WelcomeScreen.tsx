
import React from 'react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';

interface WelcomeScreenProps {
  onNext: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext }) => {
  const { settings, profile, settingsLoading, loading } = useApp();

  console.log('WelcomeScreen - onNext function:', onNext);
  console.log('WelcomeScreen - settingsLoading:', settingsLoading);
  console.log('WelcomeScreen - loading:', loading);

  // Don't show loading indefinitely - show welcome screen with defaults after reasonable time
  const isLoading = settingsLoading || loading;
  
  // Use fallback values if data is not available
  const storeName = settings?.store_name || 'متجر البرندات';
  const welcomeImage = settings?.welcome_image || '/placeholder.svg';
  const userName = profile?.name || 'عزيزنا العميل';

  const handleStartShopping = () => {
    console.log('Start shopping button clicked');
    console.log('Calling onNext function...');
    if (onNext && typeof onNext === 'function') {
      onNext();
    } else {
      console.error('onNext is not a function:', onNext);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-lg mx-auto">
        {isLoading ? (
          <div className="mb-8">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">جاري التحميل...</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <img
                src={welcomeImage}
                alt="Welcome"
                className="w-64 h-64 mx-auto rounded-3xl shadow-2xl object-cover border-4 border-white"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              مرحباً بك في {storeName}
            </h1>
            
            <p className="text-xl text-gray-600 mb-2">
              أهلاً وسهلاً، {userName}
            </p>
            
            <p className="text-gray-500 mb-8 leading-relaxed">
              استمتع بتجربة تسوق مميزة مع أفضل البرندات العالمية
            </p>
            
            <Button
              onClick={handleStartShopping}
              className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              ابدأ التسوق
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default WelcomeScreen;
