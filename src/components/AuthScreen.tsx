
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useApp } from '@/contexts/AppContext';
import { useSettingsContext } from '@/contexts/SettingsContext';
import { Eye, EyeOff } from 'lucide-react';

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<'user' | 'merchant'>('user');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    birthDate: '',
    whatsappNumber: '',
    storeName: ''
  });
  const [loading, setLoading] = useState(false);

  const { signUp, signIn } = useAuth();
  const { setUser } = useApp(); // Changed from login to setUser
  const { t } = useSettingsContext();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { user } = await signIn(formData.email, formData.password);
        if (user) {
          setUser(user); // Changed from login to setUser
        }
      } else {
        await signUp(
          formData.name,
          formData.email,
          formData.password,
          formData.birthDate,
          {
            userType,
            whatsappNumber: formData.whatsappNumber,
            storeName: formData.storeName
          }
        );
        alert(t('registrationSuccess'));
        setIsLogin(true);
      }
    } catch (error: any) {
      alert(error.message || t('authError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{isLogin ? t('login') : t('register')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <Label htmlFor="name">{t('name')}</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </>
            )}
            <div>
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">{t('password')}</Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            {!isLogin && (
              <>
                <div>
                  <Label htmlFor="birthDate">{t('birthDate')}</Label>
                  <Input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="whatsappNumber">{t('whatsappNumber')}</Label>
                  <Input
                    type="tel"
                    id="whatsappNumber"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleInputChange}
                    placeholder="201234567890"
                  />
                </div>
                <div>
                  <Label htmlFor="storeName">{t('storeName')}</Label>
                  <Input
                    type="text"
                    id="storeName"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleInputChange}
                    placeholder={t('storeNamePlaceholder')}
                  />
                </div>
                <div>
                  <Label>{t('userType')}</Label>
                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant={userType === 'user' ? 'default' : 'outline'}
                      onClick={() => setUserType('user')}
                    >
                      {t('user')}
                    </Button>
                    <Button
                      type="button"
                      variant={userType === 'merchant' ? 'default' : 'outline'}
                      onClick={() => setUserType('merchant')}
                    >
                      {t('merchant')}
                    </Button>
                  </div>
                </div>
              </>
            )}
            <div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t('loading') : (isLogin ? t('login') : t('register'))}
              </Button>
            </div>
          </form>
          <div className="text-sm text-gray-600 text-center">
            {isLogin ? (
              <>
                {t('noAccount')}
                <Button variant="link" onClick={() => setIsLogin(false)}>
                  {t('register')}
                </Button>
              </>
            ) : (
              <>
                {t('alreadyHaveAccount')}
                <Button variant="link" onClick={() => setIsLogin(true)}>
                  {t('login')}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthScreen;
