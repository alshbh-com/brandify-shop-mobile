
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';

interface MerchantOfferRequestFormProps {
  show: boolean;
  products: any[];
  onClose: () => void;
}

const MerchantOfferRequestForm = ({
  show,
  products,
  onClose
}: MerchantOfferRequestFormProps) => {
  const { user } = useApp();
  const [form, setForm] = useState({
    product_id: '',
    discount_percentage: '',
    start_date: '',
    end_date: '',
    note: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.product_id || !form.discount_percentage || !form.end_date) {
      alert('يرجى ملء جميع الحق المطلوبة');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('offer_requests')
        .insert([{
          merchant_id: user?.id,
          product_id: form.product_id,
          discount_percentage: parseInt(form.discount_percentage),
          start_date: form.start_date || new Date().toISOString().split('T')[0],
          end_date: form.end_date,
          note: form.note,
          status: 'pending'
        }]);

      if (error) throw error;

      alert('تم إرسال طلب العرض بنجاح! سيتم مراجعته من قبل المدير.');
      setForm({ product_id: '', discount_percentage: '', start_date: '', end_date: '', note: '' });
      onClose();
    } catch (error) {
      console.error('Error submitting offer request:', error);
      alert('حدث خطأ أثناء إرسال الطلب');
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
            <CardTitle>طلب عرض جديد</CardTitle>
            <Button onClick={onClose} variant="ghost" size="sm">
              <X size={16} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">المنتج *</label>
              <select
                value={form.product_id}
                onChange={(e) => setForm(prev => ({ ...prev, product_id: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">اختر المنتج</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">نسبة الخصم (%) *</label>
              <Input
                type="number"
                min="1"
                max="100"
                value={form.discount_percentage}
                onChange={(e) => setForm(prev => ({ ...prev, discount_percentage: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">تاريخ البداية</label>
              <Input
                type="date"
                value={form.start_date}
                onChange={(e) => setForm(prev => ({ ...prev, start_date: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">تاريخ النهاية *</label>
              <Input
                type="date"
                value={form.end_date}
                onChange={(e) => setForm(prev => ({ ...prev, end_date: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">ملاحظات إضافية</label>
              <Input
                value={form.note}
                onChange={(e) => setForm(prev => ({ ...prev, note: e.target.value }))}
                placeholder="أي تفاصيل إضافية للعرض..."
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={loading}
            >
              {loading ? 'جاري الإرسال...' : 'إرسال طلب العرض'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MerchantOfferRequestForm;
