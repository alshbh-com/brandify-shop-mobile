
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Settings, Crown, Gift } from 'lucide-react';

interface StoreHeaderProps {
  storeName: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAdminClick: () => void;
}

const StoreHeader = ({ storeName, searchQuery, onSearchChange, onAdminClick }: StoreHeaderProps) => {
  return (
    <div className="relative overflow-hidden">
      {/* خلفية متدرجة مع تأثيرات */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      
      {/* عناصر زخرفية */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-400/20 rounded-full translate-y-24 -translate-x-24 blur-2xl"></div>
      
      <div className="relative px-6 pt-12 pb-8">
        {/* Header العلوي */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-3xl flex items-center justify-center border border-white/30">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                <Gift className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-black text-white drop-shadow-lg">
                {storeName}
              </h1>
              <p className="text-white/80 text-sm font-medium">
                🌟 أفضل الأسعار والجودة المضمونة
              </p>
            </div>
          </div>
          
          <Button
            onClick={onAdminClick}
            className="bg-white/20 backdrop-blur-lg border border-white/30 text-white hover:bg-white/30 rounded-2xl px-6 py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Settings className="w-4 h-4 mr-2" />
            الإدارة
          </Button>
        </div>
        
        {/* شريط البحث المحدث */}
        <div className="relative max-w-md mx-auto">
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
            <Search className="w-5 h-5" />
          </div>
          <Input
            placeholder="ابحث عن المنتجات والعروض..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pr-12 pl-6 py-4 bg-white/95 backdrop-blur-lg border-0 text-gray-800 rounded-2xl shadow-2xl focus:ring-4 focus:ring-white/30 transition-all duration-300 text-lg placeholder:text-gray-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-2xl pointer-events-none"></div>
        </div>
        
        {/* إحصائيات سريعة */}
        <div className="flex justify-center gap-6 mt-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl px-4 py-2 border border-white/20">
            <div className="text-white text-center">
              <div className="text-lg font-bold">1000+</div>
              <div className="text-xs text-white/80">عميل راضي</div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl px-4 py-2 border border-white/20">
            <div className="text-white text-center">
              <div className="text-lg font-bold">24/7</div>
              <div className="text-xs text-white/80">خدمة عملاء</div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl px-4 py-2 border border-white/20">
            <div className="text-white text-center">
              <div className="text-lg font-bold">✨</div>
              <div className="text-xs text-white/80">جودة مضمونة</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreHeader;
