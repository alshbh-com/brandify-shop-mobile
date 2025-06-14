
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MerchantLoginProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const MerchantLogin = ({ show, onClose, onSuccess }: MerchantLoginProps) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('يرجى إدخال كلمة المرور');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // التحقق من كلمة مرور التاجر
      const { data, error } = await supabase
        .from('store_settings')
        .select('merchant_password')
        .single();

      if (error) throw error;

      if (!data.merchant_password) {
        // إذا لم تكن كلمة المرور مُعيّنة، قم بتعيينها
        const { error: updateError } = await supabase
          .from('store_settings')
          .update({ merchant_password: password })
          .eq('id', data.id || 1);

        if (updateError) throw updateError;
        
        alert('تم تعيين كلمة مرور التاجر بنجاح!');
        onSuccess();
      } else if (data.merchant_password === password) {
        onSuccess();
      } else {
        setError('كلمة المرور غير صحيحة');
      }
    } catch (error: any) {
      setError('حدث خطأ أثناء التحقق من كلمة المرور');
      console.error('Merchant login error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>دخول لوحة التاجر</CardTitle>
            <Button onClick={onClose} variant="ghost" size="sm">
              <X size={16} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium mb-1">كلمة مرور التاجر</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={!loading ? 'أدخل كلمة المرور أو اختر واحدة جديدة' : ''}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                إذا كانت هذه المرة الأولى، ستكون هذه كلمة المرور الجديدة
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-green-500 hover:bg-green-600"
              disabled={loading}
            >
              {loading ? 'جاري التحقق...' : 'دخول'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MerchantLogin;
