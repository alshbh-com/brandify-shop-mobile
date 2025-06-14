import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useApp } from '@/contexts/AppContext';
import { useSettingsContext } from '@/contexts/SettingsContext';
import { User, Calendar, Mail, LogOut, Edit, Settings, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ProfileScreen = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    birthDate: '',
    profileImage: '',
    whatsapp: '',
  });
  const [merchantStatus, setMerchantStatus] = useState<string | null>(null);
  const { user, logout, updateUserProfile } = useApp();
  const { language, updateLanguage, t } = useSettingsContext();

  useEffect(() => {
    // جلب بيانات الحالة ورقم الواتساب من Supabase
    const fetchMerchantFields = async () => {
      if (user?.id) {
        const { data, error } = await supabase.from("profiles").select("merchant_status, whatsapp_number").eq("id", user.id).maybeSingle();
        if (data) {
          setMerchantStatus(data.merchant_status);
          setEditData(prev => ({ ...prev, whatsapp: data.whatsapp_number || "" }));
        }
      }
    };
    fetchMerchantFields();
  }, [user && user.id]);

  const handleEditStart = () => {
    if (user) {
      setEditData({
        name: user.name,
        birthDate: user.birthDate,
        profileImage: user.profileImage,
        whatsapp: editData.whatsapp,
      });
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (!editData.name || !editData.birthDate) {
      alert(t('fillAllFields'));
      return;
    }
    const calculateAge = (birthDate: string): number => {
      const today = new Date();
      const birth = new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age;
    };
    const age = calculateAge(editData.birthDate);
    if (age < 18) {
      alert(t('ageRestriction'));
      return;
    }
    // تحديث بيانات البروفايل
    await supabase
      .from('profiles')
      .update({
        name: editData.name,
        birth_date: editData.birthDate,
        profile_image: editData.profileImage,
        whatsapp_number: editData.whatsapp,
      })
      .eq('id', user.id);

    setIsEditing(false);
    alert(t('changesSaved'));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setEditData(prev => ({ ...prev, profileImage: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) return null;

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const userAge = calculateAge(user.birthDate);

  // Add this function to handle contacting the manager via WhatsApp
  const handleContactManager = () => {
    const adminWhatsApp = "201204486263";
    const message = encodeURIComponent("مرحبًا، أرجو تفعيل حساب التاجر الخاص بي.");
    window.open(`https://wa.me/${adminWhatsApp}?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('profile')}</h1>
      
      <Card className="max-w-md mx-auto bg-white shadow-lg mb-4">
        <CardContent className="p-6">
          {/* Profile Image */}
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <img
                src={isEditing ? editData.profileImage : user.profileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 mx-auto"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 cursor-pointer hover:bg-blue-600 transition-colors">
                  <Edit size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 space-x-reverse">
              <User className="text-blue-500" size={20} />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
                {isEditing ? (
                  <Input
                    value={editData.name}
                    onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                    className="border-gray-200"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">{user.name}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3 space-x-reverse">
              <Mail className="text-blue-500" size={20} />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
                <p className="text-gray-800">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 space-x-reverse">
              <Calendar className="text-blue-500" size={20} />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('birthDate')}</label>
                {isEditing ? (
                  <Input
                    type="date"
                    value={editData.birthDate}
                    onChange={(e) => setEditData(prev => ({ ...prev, birthDate: e.target.value }))}
                    className="border-gray-200"
                  />
                ) : (
                  <p className="text-gray-800">{user.birthDate}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{userAge}</span>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('age')}</label>
                <p className="text-gray-800">{userAge} {t('years')}</p>
              </div>
            </div>

            {/* حقل رقم واتساب للتاجر */}
            <div className="flex items-center space-x-3 space-x-reverse">
              <User className="text-blue-500" size={20} />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">رقم الواتساب (للتاجر)</label>
                {isEditing ? (
                  <Input
                    type="text"
                    value={editData.whatsapp}
                    onChange={e => setEditData(prev => ({ ...prev, whatsapp: e.target.value }))}
                    className="border-gray-200"
                    placeholder="مثال: 20XXXXXXXXX"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">{editData.whatsapp || "—"}</p>
                )}
              </div>
            </div>
          </div>

          {/* حالة التاجر وزر التواصل مع المدير */}
          {merchantStatus === "pending" && (
            <div className="mt-3 flex flex-col items-center space-y-2">
              <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded font-semibold">في انتظار تفعيل حساب التاجر</div>
              <Button className="bg-green-600" onClick={handleContactManager}>
                تواصل مع المدير لتفعيل الحساب
              </Button>
            </div>
          )}
          {merchantStatus === "rejected" && (
            <div className="mt-3 bg-red-100 text-red-800 px-4 py-2 rounded font-semibold">تم رفض تفعيل حساب التاجر - حسابك في وضع مستخدم عادي</div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 space-y-3">
            {isEditing ? (
              <div className="flex gap-3">
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-green-500 hover:bg-green-600"
                >
                  {t('save')}
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="flex-1"
                >
                  {t('cancel')}
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleEditStart}
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                <Edit size={16} className="ml-2" />
                {t('editInfo')}
              </Button>
            )}
            
            <Button
              onClick={() => setShowSettings(!showSettings)}
              variant="outline"
              className="w-full"
            >
              <Settings size={16} className="ml-2" />
              {t('settings')}
            </Button>
            
            <Button
              onClick={logout}
              variant="destructive"
              className="w-full"
            >
              <LogOut size={16} className="ml-2" />
              {t('logout')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Settings Panel - Only Language Setting */}
      {showSettings && (
        <Card className="max-w-md mx-auto bg-white shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('settings')}</h3>
            
            {/* Language Setting Only */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 space-x-reverse">
                <Globe className="text-blue-500" size={20} />
                <span className="text-gray-700">{t('language')}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={language === 'ar' ? 'default' : 'outline'}
                  onClick={() => updateLanguage('ar')}
                >
                  {t('arabic')}
                </Button>
                <Button
                  size="sm"
                  variant={language === 'en' ? 'default' : 'outline'}
                  onClick={() => updateLanguage('en')}
                >
                  {t('english')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfileScreen;
