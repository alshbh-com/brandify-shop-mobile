
import React from 'react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';

interface WelcomeScreenProps {
  onNext: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext }) => {
  const { welcomeImage, storeName, user } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-lg mx-auto">
        <div className="mb-8">
          <img
            src={welcomeImage}
            alt="Welcome"
            className="w-64 h-64 mx-auto rounded-3xl shadow-2xl object-cover border-4 border-white"
          />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          مرحباً بك في {storeName}
        </h1>
        
        <p className="text-xl text-gray-600 mb-2">
          أهلاً وسهلاً، {user?.name}
        </p>
        
        <p className="text-gray-500 mb-8 leading-relaxed">
          استمتع بتجربة تسوق مميزة مع أفضل البرندات العالمية
        </p>
        
        <Button
          onClick={onNext}
          className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          ابدأ التسوق
        </Button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
