
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Edit, Trash2, Store, Users, Settings } from 'lucide-react';
import { useSubcategories } from '@/hooks/useSubcategories';
import { useApp } from '@/contexts/AppContext';
import SubcategoryForm from './forms/SubcategoryForm';

const SubcategoriesTab = () => {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    logo: '',
    banner_image: '',
    category_id: '',
    merchant_id: '',
    is_active: true
  });

  const { subcategories, addSubcategory, updateSubcategory, deleteSubcategory } = useSubcategories();
  const { categories } = useApp();

  const handleAdd = () => {
    setEditing(null);
    setForm({
      name: '',
      description: '',
      logo: '',
      banner_image: '',
      category_id: '',
      merchant_id: '',
      is_active: true
    });
    setShowForm(true);
  };

  const handleEdit = (subcategory: any) => {
    setEditing(subcategory);
    setForm({
      name: subcategory.name,
      description: subcategory.description || '',
      logo: subcategory.logo,
      banner_image: subcategory.banner_image,
      category_id: subcategory.category_id,
      merchant_id: subcategory.merchant_id || '',
      is_active: subcategory.is_active
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateSubcategory(editing.id, form);
      } else {
        await addSubcategory(form);
      }
      setShowForm(false);
      setForm({
        name: '',
        description: '',
        logo: '',
        banner_image: '',
        category_id: '',
        merchant_id: '',
        is_active: true
      });
    } catch (error) {
      console.error('Error saving subcategory:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا القسم الفرعي؟')) {
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

  const toggleStatus = async (subcategory: any) => {
    try {
      await updateSubcategory(subcategory.id, {
        ...subcategory,
        is_active: !subcategory.is_active
      });
    } catch (error) {
      console.error('Error updating subcategory status:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Store className="w-5 h-5" />
          إدارة الأقسام الفرعية والمتاجر
        </h2>
        <Button
          onClick={handleAdd}
          className="bg-green-500 hover:bg-green-600"
        >
          <Plus size={16} className="ml-2" />
          إضافة قسم فرعي
        </Button>
      </div>

      <div className="grid gap-4">
        {subcategories.map(subcategory => (
          <Card key={subcategory.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <img
                  src={subcategory.logo}
                  alt={subcategory.name}
                  className="w-16 h-16 object-cover rounded-lg border"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{subcategory.name}</h3>
                    <Store size={16} className="text-blue-500" />
                    {subcategory.merchant_id && (
                      <Users size={14} className="text-purple-500" title="مرتبط بتاجر" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>القسم الرئيسي:</strong> {getCategoryName(subcategory.category_id)}
                  </p>
                  {subcategory.description && (
                    <p className="text-sm text-gray-600 mb-2">{subcategory.description}</p>
                  )}
                  {subcategory.merchant_id && (
                    <p className="text-xs text-purple-600 mb-2">
                      <strong>معرف التاجر:</strong> {subcategory.merchant_id}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleStatus(subcategory)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        subcategory.is_active 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {subcategory.is_active ? 'نشط' : 'غير نشط'}
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(subcategory)}
                    size="sm"
                    variant="outline"
                    className="text-blue-600 hover:text-blue-700"
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

      <SubcategoryForm
        show={showForm}
        editing={editing}
        form={form}
        categories={categories}
        onClose={() => setShowForm(false)}
        onSubmit={handleSubmit}
        onFormChange={(updates) => setForm(prev => ({ ...prev, ...updates }))}
        onLogoUpload={(e) => handleImageUpload(e, 'logo')}
        onBannerUpload={(e) => handleImageUpload(e, 'banner_image')}
      />
    </div>
  );
};

export default SubcategoriesTab;
