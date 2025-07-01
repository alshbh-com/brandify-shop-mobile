
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2, Upload, Save, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Category {
  id: string;
  name: string;
  image: string;
}

interface CategoriesTabProps {
  categories: Category[];
  onAddCategory: (category: Omit<Category, 'id'>) => Promise<any>;
  onEditCategory: (id: string, updates: Partial<Category>) => Promise<any>;
  onDeleteCategory: (id: string) => Promise<void>;
}

const CategoriesTab = ({
  categories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory
}: CategoriesTabProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', image: '/placeholder.svg' });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم القسم",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await onEditCategory(editingId, formData);
        toast({
          title: "تم بنجاح",
          description: "تم تحديث القسم بنجاح"
        });
        setEditingId(null);
      } else {
        await onAddCategory(formData);
        toast({
          title: "تم بنجاح",
          description: "تم إضافة القسم بنجاح"
        });
        setShowAddForm(false);
      }
      setFormData({ name: '', image: '/placeholder.svg' });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء حفظ القسم",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({ name: category.name, image: category.image });
    setShowAddForm(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا القسم؟')) {
      try {
        await onDeleteCategory(id);
        toast({
          title: "تم بنجاح",
          description: "تم حذف القسم بنجاح"
        });
      } catch (error: any) {
        toast({
          title: "خطأ",
          description: error.message || "حدث خطأ أثناء حذف القسم",
          variant: "destructive"
        });
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({ name: '', image: '/placeholder.svg' });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">إدارة الأقسام</h2>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-green-500 hover:bg-green-600"
          disabled={showAddForm || editingId}
        >
          <Plus size={16} className="ml-2" />
          إضافة قسم
        </Button>
      </div>

      {(showAddForm || editingId) && (
        <Card className="border-2 border-blue-200">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">
                  {editingId ? 'تحرير القسم' : 'إضافة قسم جديد'}
                </h3>
                <Button
                  type="button"
                  onClick={cancelEdit}
                  variant="ghost"
                  size="sm"
                >
                  <X size={16} />
                </Button>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">اسم القسم</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="أدخل اسم القسم"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">صورة القسم</label>
                <div className="space-y-2">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                  <label className="flex items-center gap-2 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors w-fit">
                    <Upload size={16} />
                    اختيار صورة
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600"
                  disabled={loading}
                >
                  <Save size={16} className="ml-2" />
                  {loading ? 'جاري الحفظ...' : 'حفظ'}
                </Button>
                <Button
                  type="button"
                  onClick={cancelEdit}
                  variant="outline"
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {categories.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">لا توجد أقسام حالياً</p>
              <p className="text-sm text-gray-400 mt-1">قم بإضافة قسم جديد للبدء</p>
            </CardContent>
          </Card>
        ) : (
          categories.map(category => (
            <Card key={category.id} className={editingId === category.id ? 'border-blue-300 bg-blue-50' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-gray-500">معرف: {category.id}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(category)}
                      size="sm"
                      variant="outline"
                      disabled={showAddForm || editingId}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      onClick={() => handleDelete(category.id)}
                      size="sm"
                      variant="destructive"
                      disabled={showAddForm || editingId}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoriesTab;
