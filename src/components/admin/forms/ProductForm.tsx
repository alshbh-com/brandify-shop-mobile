
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Upload, X } from 'lucide-react';

interface ProductFormProps {
  show: boolean;
  editing: any;
  form: any;
  categories: any[];
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onFormChange: (updates: any) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProductForm = ({
  show,
  editing,
  form,
  categories,
  onClose,
  onSubmit,
  onFormChange,
  onImageUpload
}: ProductFormProps) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              {editing ? 'تعديل منتج' : 'إضافة منتج جديد'}
            </CardTitle>
            <Button onClick={onClose} variant="ghost" size="sm">
              <X size={16} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">اسم المنتج *</label>
              <Input
                value={form.name}
                onChange={(e) => onFormChange({ name: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">السعر *</label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => onFormChange({ price: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">القسم *</label>
              <select
                value={form.category_id}
                onChange={(e) => onFormChange({ category_id: e.target.value })}
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
                value={form.description}
                onChange={(e) => onFormChange({ description: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">صورة المنتج (PNG, JPG, SVG)</label>
              {form.image && (
                <div className="mb-2">
                  {form.image.includes('data:image/svg+xml') ? (
                    <div 
                      className="w-full h-32 border rounded-lg flex items-center justify-center bg-gray-50"
                      dangerouslySetInnerHTML={{ 
                        __html: atob(form.image.split(',')[1]) 
                      }}
                    />
                  ) : (
                    <img
                      src={form.image}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  )}
                </div>
              )}
              <label className="flex items-center justify-center gap-2 bg-gray-100 border border-gray-300 py-2 px-4 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                <Upload size={16} />
                رفع صورة (PNG, JPG, SVG)
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml,.svg"
                  onChange={onImageUpload}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 mt-1">
                أنواع الملفات المدعومة: PNG, JPG, GIF, WebP, SVG
              </p>
            </div>
            
            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
              {editing ? 'حفظ التغييرات' : 'إضافة المنتج'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductForm;
