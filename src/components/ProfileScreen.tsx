
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useApp } from '@/contexts/AppContext';
import { User, Calendar, Mail, LogOut, Edit } from 'lucide-react';

const ProfileScreen = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    birthDate: '',
    profileImage: ''
  });

  const { user, logout, updateUserProfile } = useApp();

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
      alert('يرجى ملء جميع الحقول المطلوبة');
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
      alert('عذراً، يجب أن يكون عمرك 18 عاماً أو أكثر');
      return;
    }

    updateUserProfile(editData);
    setIsEditing(false);
    alert('تم حفظ التغييرات بنجاح');
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

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">الحساب الشخصي</h1>
      
      <Card className="max-w-md mx-auto bg-white shadow-lg">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                <p className="text-gray-800">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 space-x-reverse">
              <Calendar className="text-blue-500" size={20} />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الميلاد</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">العمر</label>
                <p className="text-gray-800">{userAge} سنة</p>
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
                  حفظ
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="flex-1"
                >
                  إلغاء
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleEditStart}
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                <Edit size={16} className="ml-2" />
                تعديل المعلومات
              </Button>
            )}
            
            <Button
              onClick={logout}
              variant="destructive"
              className="w-full"
            >
              <LogOut size={16} className="ml-2" />
              تسجيل الخروج
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileScreen;
