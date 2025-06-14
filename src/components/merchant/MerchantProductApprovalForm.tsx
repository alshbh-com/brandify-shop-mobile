
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';

interface MerchantProductApprovalFormProps {
  show: boolean;
  categories: any[];
  onClose: () => void;
  onSuccess: () => void;
}

const MerchantProductApprovalForm = ({
  show,
  categories,
  onClose,
  onSuccess
}: MerchantProductApprovalFormProps) => {
  const { user } = useApp();
  const [form, setForm] = useState({
    product_name: '',
    product_price: '',
    product_category_id: '',
    product_description: '',
    product_image: '',
    has_sizes: false,
    size_s_price: '',
    size_m_price: '',
    size_l_price: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.product_name || !form.product_price || !form.product_category_id) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('product_approval_requests')
        .insert([{
          merchant_id: user?.id,
          product_name: form.product_name,
          product_price: parseFloat(form.product_price),
          product_category_id: form.product_category_id,
          product_description: form.product_description,
          product_image: form.product_image || '/placeholder.svg',
          has_sizes: form.has_sizes,
          size_s_price: form.size_s_price ? parseFloat(form.size_s_price) : null,
          size_m_price: form.size_m_price ? parseFloat(form.size_m_price) : null,
          size_l_price: form.size_l_price ? parseFloat(form.size_l_price) : null,
          status: 'pending'
        }]);

      if (error) throw error;

      alert('تم إرسال طلب الموافقة على المنتج بنجاح! سيتم مراجعته من قبل المدير.');
      setForm({
        product_name: '',
        product_price: '',
        product_category_id: '',
        product_description: '',
        product_image: '',
        has_sizes: false,
        size_s_price: '',
        size_m_price: '',
        size_l_price: ''
      });
      onClose();
      onSuccess();
    } catch (error) {
      console.error('Error submitting product approval request:', error);
      alert('حدث خطأ أثناء إرسال الطلب');
    } finally {
      setLoading(false);
    }
  };

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
        setForm(prev => ({ ...prev, product_image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>طلب موافقة على منتج جديد</CardTitle>
            <Button onClick={onClose} variant="ghost" size="sm">
              <X size={16} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">اسم المنتج *</label>
              <Input
                value={form.product_name}
                onChange={(e) => setForm(prev => ({ ...prev, product_name: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">السعر الأساسي *</label>
              <Input
                type="number"
                value={form.product_price}
                onChange={(e) => setForm(prev => ({ ...prev, product_price: e.target.value }))}
                required
              />
            </div>

            {/* خيارات الأحجام */}
            <div className="border rounded-lg p-3 bg-gray-50">
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  id="has_sizes"
                  checked={form.has_sizes}
                  onChange={(e) => setForm(prev => ({ ...prev, has_sizes: e.target.checked }))}
                  className="ml-2"
                />
                <label htmlFor="has_sizes" className="text-sm font-medium">
                  إضافة أحجام مختلفة (صغير، وسط، كبير)
                </label>
              </div>
              
              {form.has_sizes && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">سعر الحجم الصغير (S)</label>
                    <Input
                      type="number"
                      value={form.size_s_price}
                      onChange={(e) => setForm(prev => ({ ...prev, size_s_price: e.target.value }))}
                      placeholder="اختياري"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">سعر الحجم الوسط (M)</label>
                    <Input
                      type="number"
                      value={form.size_m_price}
                      onChange={(e) => setForm(prev => ({ ...prev, size_m_price: e.target.value }))}
                      placeholder="اختياري"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">سعر الحجم الكبير (L)</label>
                    <Input
                      type="number"
                      value={form.size_l_price}
                      onChange={(e) => setForm(prev => ({ ...prev, size_l_price: e.target.value }))}
                      placeholder="اختياري"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">القسم *</label>
              <select
                value={form.product_category_id}
                onChange={(e) => setForm(prev => ({ ...prev, product_category_id: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">اختر القسم</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">الوصف</label>
              <Input
                value={form.product_description}
                onChange={(e) => setForm(prev => ({ ...prev, product_description: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">صورة المنتج</label>
              {form.product_image && (
                <div className="mb-2">
                  <img
                    src={form.product_image}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}
              <label className="flex items-center justify-center gap-2 bg-gray-100 border border-gray-300 py-2 px-4 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                <Upload size={16} />
                رفع صورة
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-500 hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? 'جاري الإرسال...' : 'إرسال طلب الموافقة'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MerchantProductApprovalForm;
