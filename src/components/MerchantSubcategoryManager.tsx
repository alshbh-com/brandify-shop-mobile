
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Upload, Store, Edit, Trash2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useSubcategories } from '@/hooks/useSubcategories';

interface MerchantSubcategoryManagerProps {
  merchantId: string;
}

const MerchantSubcategoryManager = ({ merchantId }: MerchantSubcategoryManagerProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<any>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    logo: '',
    banner_image: '',
    category_id: '',
    is_active: true
  });

  const { categories } = useApp();
  const { subcategories, addSubcategory, updateSubcategory, deleteSubcategory } = useSubcategories();

  // Filter subcategories for current merchant
  const merchantSubcategories = subcategories.filter(sub => sub.merchant_id === merchantId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.category_id) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      const subcategoryData = {
        ...form,
        merchant_id: merchantId
      };

      if (editingSubcategory) {
        await updateSubcategory(editingSubcategory.id, subcategoryData);
        setEditingSubcategory(null);
      } else {
        await addSubcategory(subcategoryData);
      }

      setForm({
        name: '',
        description: '',
        logo: '',
        banner_image: '',
        category_id: '',
        is_active: true
      });
      setShowForm(false);
    } catch (error) {
      alert('حدث خطأ أثناء حفظ المتجر');
      console.error('Error saving subcategory:', error);
    }
  };

  const handleEdit = (subcategory: any) => {
    setEditingSubcategory(subcategory);
    setForm({
      name: subcategory.name,
      description: subcategory.description || '',
      logo: subcategory.logo,
      banner_image: subcategory.banner_image,
      category_id: subcategory.category_id,
      is_active: subcategory.is_active
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المتجر؟')) {
      await deleteSubcategory(id);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'banner_image') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setForm(prev => ({ ...prev, [field]: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'غير محدد';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">إدارة متاجري</h2>
        <Button
          onClick={() => {
            setEditingSubcategory(null);
            setForm({
              name: '',
              description: '',
              logo: '',
              banner_image: '',
              category_id: '',
              is_active: true
            });
            setShowForm(true);
          }}
          className="bg-green-500 hover:bg-green-600"
        >
          <Store size={16} className="ml-2" />
          إضافة متجر جديد
        </Button>
      </div>

      <Card className="bg-blue-50">
        <CardContent className="p-4">
          <p className="text-blue-800">
            <strong>ملاحظة:</strong> يجب إنشاء متجر فرعي أولاً قبل إضافة المنتجات.
            المنتجات ستظهر داخل المتجر الذي تحدده.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {merchantSubcategories.map(subcategory => (
          <Card key={subcategory.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <img
                  src={subcategory.logo}
                  alt={subcategory.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{subcategory.name}</h3>
                    <Store size={16} className="text-green-500" />
                  </div>
                  <p className="text-sm text-gray-500">{getCategoryName(subcategory.category_id)}</p>
                  {subcategory.description && (
                    <p className="text-sm text-gray-600 mt-1">{subcategory.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      subcategory.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {subcategory.is_active ? 'نشط' : 'غير نشط'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(subcategory)}
                    size="sm"
                    variant="outline"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    onClick={() => handleDelete(subcategory.id)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Subcategory Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {editingSubcategory ? 'تعديل متجر' : 'إضافة متجر جديد'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">اسم المتجر *</label>
                    <Input
                      value={form.name}
                      onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                      placeholder="مثال: مطعم الأصالة"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">القسم الرئيسي *</label>
                    <select
                      value={form.category_id}
                      onChange={(e) => setForm(prev => ({ ...prev, category_id: e.target.value }))}
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
                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="وصف قصير عن المتجر..."
                  />
                </div>
                
                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">شعار المتجر</label>
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
                    <Store size={20} className="text-blue-500" />
                    <span className="text-blue-600 font-medium">رفع شعار المتجر</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'logo')}
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
                      onChange={(e) => handleImageUpload(e, 'banner_image')}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={form.is_active}
                    onChange={(e) => setForm(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium">
                    متجر نشط ومتاح للعملاء
                  </label>
                </div>
                
                <div className="flex gap-4">
                  <Button type="submit" className="flex-1 bg-green-500 hover:bg-green-600 text-lg py-3">
                    {editingSubcategory ? 'حفظ التغييرات' : 'إضافة المتجر'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowForm(false)}
                    className="px-8"
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MerchantSubcategoryManager;
