
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Upload, X, Image } from 'lucide-react';

interface SubcategoryFormProps {
  show: boolean;
  editing: any;
  form: any;
  categories: any[];
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onFormChange: (updates: any) => void;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBannerUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SubcategoryForm = ({
  show,
  editing,
  form,
  categories,
  onClose,
  onSubmit,
  onFormChange,
  onLogoUpload,
  onBannerUpload
}: SubcategoryFormProps) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              {editing ? 'تعديل قسم فرعي' : 'إضافة قسم فرعي جديد'}
            </CardTitle>
            <Button onClick={onClose} variant="ghost" size="sm">
              <X size={16} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">اسم المتجر/المطعم *</label>
                <Input
                  value={form.name}
                  onChange={(e) => onFormChange({ name: e.target.value })}
                  required
                  placeholder="مثال: مطعم الأصالة"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">القسم الرئيسي *</label>
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
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">الوصف</label>
              <Input
                value={form.description}
                onChange={(e) => onFormChange({ description: e.target.value })}
                placeholder="وصف قصير عن المتجر..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">معرف التاجر (اختياري)</label>
              <Input
                value={form.merchant_id}
                onChange={(e) => onFormChange({ merchant_id: e.target.value })}
                placeholder="معرف المستخدم للتاجر"
              />
            </div>
            
            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">شعار المتجر/المطعم</label>
              {form.logo && (
                <div className="mb-3">
                  <img
                    src={form.logo}
                    alt="Logo Preview"
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                </div>
              )}
              <label className="flex items-center justify-center gap-2 bg-blue-50 border-2 border-dashed border-blue-300 py-4 px-4 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                <Image size={20} className="text-blue-500" />
                <span className="text-blue-600 font-medium">رفع شعار المتجر</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onLogoUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Banner Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">صورة الغلاف</label>
              {form.banner_image && (
                <div className="mb-3">
                  <img
                    src={form.banner_image}
                    alt="Banner Preview"
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
              <label className="flex items-center justify-center gap-2 bg-green-50 border-2 border-dashed border-green-300 py-4 px-4 rounded-lg cursor-pointer hover:bg-green-100 transition-colors">
                <Upload size={20} className="text-green-500" />
                <span className="text-green-600 font-medium">رفع صورة الغلاف</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onBannerUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={form.is_active}
                onChange={(e) => onFormChange({ is_active: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="is_active" className="text-sm font-medium">
                متجر نشط ومتاح للعملاء
              </label>
            </div>
            
            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-lg py-3">
              {editing ? 'حفظ التغييرات' : 'إضافة القسم الفرعي'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubcategoryForm;
