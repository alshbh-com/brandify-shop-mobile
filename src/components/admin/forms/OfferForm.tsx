
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface OfferFormProps {
  show: boolean;
  editing: any;
  form: any;
  products: any[];
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onFormChange: (updates: any) => void;
}

const OfferForm = ({
  show,
  editing,
  form,
  products,
  onClose,
  onSubmit,
  onFormChange
}: OfferFormProps) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              {editing ? 'تعديل عرض' : 'إضافة عرض جديد'}
            </CardTitle>
            <Button onClick={onClose} variant="ghost" size="sm">
              <X size={16} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">المنتج *</label>
              <select
                value={form.product_id}
                onChange={(e) => onFormChange({ product_id: e.target.value })}
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
                onChange={(e) => onFormChange({ discount_percentage: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">تاريخ البداية</label>
              <Input
                type="date"
                value={form.start_date}
                onChange={(e) => onFormChange({ start_date: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">تاريخ النهاية *</label>
              <Input
                type="date"
                value={form.end_date}
                onChange={(e) => onFormChange({ end_date: e.target.value })}
                required
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={form.is_active}
                onChange={(e) => onFormChange({ is_active: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="is_active" className="text-sm font-medium">العرض نشط</label>
            </div>
            
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
              {editing ? 'حفظ التغييرات' : 'إضافة العرض'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfferForm;
