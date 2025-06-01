
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useApp } from '@/contexts/AppContext';
import { useSettingsContext } from '@/contexts/SettingsContext';
import { User, Calendar, Mail, LogOut, Edit, Settings, Globe, Moon, Sun, Monitor } from 'lucide-react';

const ProfileScreen = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    birthDate: '',
    profileImage: ''
  });

  const { user, logout, updateUserProfile } = useApp();
  const { language, theme, updateLanguage, updateTheme, t } = useSettingsContext();

  const handleEditStart = () => {
    if (user) {
      setEditData({
        name: user.name,
        birthDate: user.birthDate,
        profileImage: user.profileImage
      });
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (!editData.name || !editData.birthDate) {
      alert(t('fillAllFields'));
      return;
    }

    // التحقق من العمر
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

    updateUserProfile(editData);
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

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun size={16} />;
      case 'dark':
        return <Moon size={16} />;
      case 'system':
        return <Monitor size={16} />;
      default:
        return <Monitor size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 pb-20">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">{t('profile')}</h1>
      
      <Card className="max-w-md mx-auto bg-white dark:bg-gray-800 shadow-lg mb-4">
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('name')}</label>
                {isEditing ? (
                  <Input
                    value={editData.name}
                    onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                    className="border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                  />
                ) : (
                  <p className="text-gray-800 dark:text-gray-200 font-medium">{user.name}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3 space-x-reverse">
              <Mail className="text-blue-500" size={20} />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('email')}</label>
                <p className="text-gray-800 dark:text-gray-200">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 space-x-reverse">
              <Calendar className="text-blue-500" size={20} />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('birthDate')}</label>
                {isEditing ? (
                  <Input
                    type="date"
                    value={editData.birthDate}
                    onChange={(e) => setEditData(prev => ({ ...prev, birthDate: e.target.value }))}
                    className="border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                  />
                ) : (
                  <p className="text-gray-800 dark:text-gray-200">{user.birthDate}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{userAge}</span>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('age')}</label>
                <p className="text-gray-800 dark:text-gray-200">{userAge} {t('years')}</p>
              </div>
            </div>
          </div>

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

      {/* Settings Panel */}
      {showSettings && (
        <Card className="max-w-md mx-auto bg-white dark:bg-gray-800 shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">{t('settings')}</h3>
            
            {/* Language Setting */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Globe className="text-blue-500" size={20} />
                  <span className="text-gray-700 dark:text-gray-300">{t('language')}</span>
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

              {/* Theme Setting */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  {getThemeIcon()}
                  <span className="text-gray-700 dark:text-gray-300">{t('theme')}</span>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant={theme === 'light' ? 'default' : 'outline'}
                    onClick={() => updateTheme('light')}
                  >
                    <Sun size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    onClick={() => updateTheme('dark')}
                  >
                    <Moon size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant={theme === 'system' ? 'default' : 'outline'}
                    onClick={() => updateTheme('system')}
                  >
                    <Monitor size={14} />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfileScreen;
