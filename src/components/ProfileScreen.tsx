
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { User, Settings, LogOut, MessageCircle, Store } from 'lucide-react';
import MerchantLogin from './MerchantLogin';
import MerchantPanel from './MerchantPanel';

const ProfileScreen = () => {
  const { user, logout } = useApp();
  const [showMerchantLogin, setShowMerchantLogin] = useState(false);
  const [showMerchantPanel, setShowMerchantPanel] = useState(false);

  const handleContactManager = () => {
    const whatsappNumber = "201204486263";
    const message = "مرحباً، أرغب في تفعيل حسابي كتاجر في المتجر";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <User size={32} />
          </div>
          <div>
            <h1 className="text-xl font-bold">مرحباً بك</h1>
            <p className="text-blue-100">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings size={20} />
              إدارة الحساب
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => setShowMerchantLogin(true)}
              className="w-full justify-start gap-3 bg-green-500 hover:bg-green-600"
            >
              <Store size={20} />
              لوحة التاجر
            </Button>
            
            <Button 
              onClick={handleContactManager}
              className="w-full justify-start gap-3 bg-blue-500 hover:bg-blue-600"
            >
              <MessageCircle size={20} />
              تواصل مع المدير لتفعيل الحساب
            </Button>
            
            <Button 
              onClick={logout}
              variant="destructive"
              className="w-full justify-start gap-3"
            >
              <LogOut size={20} />
              تسجيل الخروج
            </Button>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle>معلومات الحساب</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">البريد الإلكتروني:</span>
                <span>{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">تاريخ التسجيل:</span>
                <span>{new Date(user?.created_at || '').toLocaleDateString('ar')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Merchant Login Modal */}
      <MerchantLogin
        show={showMerchantLogin}
        onClose={() => setShowMerchantLogin(false)}
        onSuccess={() => {
          setShowMerchantLogin(false);
          setShowMerchantPanel(true);
        }}
      />

      {/* Merchant Panel Modal */}
      {showMerchantPanel && (
        <div className="fixed inset-0 bg-white z-50">
          <MerchantPanel />
          <Button
            onClick={() => setShowMerchantPanel(false)}
            className="fixed top-4 left-4 z-50 bg-red-500 hover:bg-red-600"
          >
            إغلاق لوحة التاجر
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfileScreen;
