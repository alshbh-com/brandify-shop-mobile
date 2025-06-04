
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';

interface StoreSettingsTabProps {
  storeName: string;
  welcomeImage: string;
  onStoreNameChange: (name: string) => void;
  onWelcomeImageChange: (image: string) => void;
}

const StoreSettingsTab = ({ 
  storeName, 
  welcomeImage, 
  onStoreNameChange, 
  onWelcomeImageChange 
}: StoreSettingsTabProps) => {
  const [localStoreName, setLocalStoreName] = useState(storeName);

  useEffect(() => {
    setLocalStoreName(storeName);
  }, [storeName]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localStoreName !== storeName && localStoreName.trim() !== '') {
        onStoreNameChange(localStoreName);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localStoreName, storeName, onStoreNameChange]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        alert('يرجى اختيار ملف صورة صالح (JPEG, PNG, GIF, WebP, SVG)');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onWelcomeImageChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>اسم المتجر</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              value={localStoreName}
              onChange={(e) => setLocalStoreName(e.target.value)}
              placeholder="اسم المتجر"
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>صورة الترحيب</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <img
              src={welcomeImage}
              alt="Welcome"
              className="w-full h-48 object-cover rounded-lg border"
            />
            <label className="flex items-center justify-center gap-2 bg-blue-500 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
              <Upload size={16} />
              تغيير الصورة
              <input
                type="file"
                accept="image/*,.svg"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreSettingsTab;
