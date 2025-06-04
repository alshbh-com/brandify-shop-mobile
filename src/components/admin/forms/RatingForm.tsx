
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface RatingFormProps {
  show: boolean;
  editing: any;
  form: any;
  products: any[];
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onFormChange: (updates: any) => void;
}

const RatingForm = ({
  show,
  editing,
  form,
  products,
  onClose,
  onSubmit,
  onFormChange
}: RatingFormProps) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              {editing ? 'تعديل تقييم' : 'إضافة تقييم جديد'}
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
                disabled={!!editing}
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
              <label className="block text-sm font-medium mb-1">التقييم (1-5) *</label>
              <Input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={form.rating}
                onChange={(e) => onFormChange({ rating: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">تعليق الأدمن</label>
              <Input
                value={form.admin_comment}
                onChange={(e) => onFormChange({ admin_comment: e.target.value })}
                placeholder="تعليق اختياري"
              />
            </div>
            
            <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600">
              {editing ? 'حفظ التغييرات' : 'إضافة التقييم'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RatingForm;
