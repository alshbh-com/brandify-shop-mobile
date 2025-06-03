
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useApp } from '@/contexts/AppContext';
import { Plus, Edit, Trash2, Upload, X } from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('store');
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [localStoreName, setLocalStoreName] = useState('');

  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category_id: '',
    description: '',
    image: ''
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    image: ''
  });

  const {
    storeName,
    welcomeImage,
    products,
    categories,
    updateStoreName,
    updateWelcomeImage,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    adminLogout
  } = useApp();

  // تحديث اسم المتجر المحلي عند تغيير اسم المتجر الرئيسي
  useEffect(() => {
    setLocalStoreName(storeName);
  }, [storeName]);

  // استخدام debouncing لتحديث اسم المتجر
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localStoreName !== storeName && localStoreName.trim() !== '') {
        updateStoreName(localStoreName);
      }
    }, 500); // انتظار 500ms قبل التحديث

    return () => clearTimeout(timer);
  }, [localStoreName, storeName, updateStoreName]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'welcome' | 'product' | 'category') => {
    const file = e.target.files?.[0];
    if (file) {
      // التحقق من نوع الملف
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        alert('يرجى اختيار ملف صورة صالح (JPEG, PNG, GIF, WebP, SVG)');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (type === 'welcome') {
          updateWelcomeImage(result);
        } else if (type === 'product') {
          setProductForm(prev => ({ ...prev, image: result }));
        } else if (type === 'category') {
          setCategoryForm(prev => ({ ...prev, image: result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.category_id) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const productData = {
      name: productForm.name,
      price: parseFloat(productForm.price),
      category_id: productForm.category_id,
      description: productForm.description,
      image: productForm.image || '/placeholder.svg'
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      setEditingProduct(null);
    } else {
      addProduct(productData);
    }

    setProductForm({ name: '', price: '', category_id: '', description: '', image: '' });
    setShowProductForm(false);
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name) {
      alert('يرجى إدخال اسم القسم');
      return;
    }

    const categoryData = {
      name: categoryForm.name,
      image: categoryForm.image || '/placeholder.svg'
    };

    if (editingCategory) {
      updateCategory(editingCategory.id, categoryData);
      setEditingCategory(null);
    } else {
      addCategory(categoryData);
    }

    setCategoryForm({ name: '', image: '' });
    setShowCategoryForm(false);
  };

  const startEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price.toString(),
      category_id: product.category_id,
      description: product.description,
      image: product.image
    });
    setShowProductForm(true);
  };

  const startEditCategory = (category: any) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      image: category.image
    });
    setShowCategoryForm(true);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'غير محدد';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">لوحة الإدارة</h1>
          <Button
            onClick={adminLogout}
            variant="ghost"
            className="text-white hover:bg-white/20"
          >
            خروج
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 px-4">
        <div className="flex space-x-4 space-x-reverse">
          {[
            { id: 'store', label: 'إعدادات المتجر' },
            { id: 'products', label: 'المنتجات' },
            { id: 'categories', label: 'الأقسام' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {/* Store Settings Tab */}
        {activeTab === 'store' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>اسم المتجر</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Input
                    value={localStoreName}
                    onChange={(e) => setLocalStoreName(e.target.value)}
                    placeholder="اسم المتجر"
                    className="flex-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>صورة الترحيب</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <img
                    src={welcomeImage}
                    alt="Welcome"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <label className="flex items-center justify-center gap-2 bg-blue-500 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
                    <Upload size={16} />
                    تغيير الصورة
                    <input
                      type="file"
                      accept="image/*,.svg"
                      onChange={(e) => handleImageUpload(e, 'welcome')}
                      className="hidden"
                    />
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">إدارة المنتجات</h2>
              <Button
                onClick={() => setShowProductForm(true)}
                className="bg-green-500 hover:bg-green-600"
              >
                <Plus size={16} className="ml-2" />
                إضافة منتج
              </Button>
            </div>

            <div className="grid gap-4">
              {products.map(product => (
                <Card key={product.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-gray-500">{getCategoryName(product.category_id)}</p>
                        <p className="text-blue-600 font-bold">{product.price} ر.س</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => startEditProduct(product)}
                          size="sm"
                          variant="outline"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          onClick={() => deleteProduct(product.id)}
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
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">إدارة الأقسام</h2>
              <Button
                onClick={() => setShowCategoryForm(true)}
                className="bg-green-500 hover:bg-green-600"
              >
                <Plus size={16} className="ml-2" />
                إضافة قسم
              </Button>
            </div>

            <div className="grid gap-4">
              {categories.map(category => (
                <Card key={category.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{category.name}</h3>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => startEditCategory(category)}
                          size="sm"
                          variant="outline"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          onClick={() => deleteCategory(category.id)}
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
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-white max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  {editingProduct ? 'تعديل منتج' : 'إضافة منتج جديد'}
                </CardTitle>
                <Button
                  onClick={() => {
                    setShowProductForm(false);
                    setEditingProduct(null);
                    setProductForm({ name: '', price: '', category_id: '', description: '', image: '' });
                  }}
                  variant="ghost"
                  size="sm"
                >
                  <X size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">اسم المنتج *</label>
                  <Input
                    value={productForm.name}
                    onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">السعر *</label>
                  <Input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">القسم *</label>
                  <select
                    value={productForm.category_id}
                    onChange={(e) => setProductForm(prev => ({ ...prev, category_id: e.target.value }))}
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
                    value={productForm.description}
                    onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">صورة المنتج (PNG, JPG, SVG)</label>
                  {productForm.image && (
                    <div className="mb-2">
                      {productForm.image.includes('data:image/svg+xml') ? (
                        <div 
                          className="w-full h-32 border rounded-lg flex items-center justify-center bg-gray-50"
                          dangerouslySetInnerHTML={{ 
                            __html: atob(productForm.image.split(',')[1]) 
                          }}
                        />
                      ) : (
                        <img
                          src={productForm.image}
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
                      onChange={(e) => handleImageUpload(e, 'product')}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    أنواع الملفات المدعومة: PNG, JPG, GIF, WebP, SVG
                  </p>
                </div>
                
                <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
                  {editingProduct ? 'حفظ التغييرات' : 'إضافة المنتج'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Category Form Modal */}
      {showCategoryForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-white">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  {editingCategory ? 'تعديل قسم' : 'إضافة قسم جديد'}
                </CardTitle>
                <Button
                  onClick={() => {
                    setShowCategoryForm(false);
                    setEditingCategory(null);
                    setCategoryForm({ name: '', image: '' });
                  }}
                  variant="ghost"
                  size="sm"
                >
                  <X size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">اسم القسم *</label>
                  <Input
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">صورة القسم (PNG, JPG, SVG)</label>
                  {categoryForm.image && (
                    <div className="mb-2">
                      {categoryForm.image.includes('data:image/svg+xml') ? (
                        <div 
                          className="w-full h-32 border rounded-lg flex items-center justify-center bg-gray-50"
                          dangerouslySetInnerHTML={{ 
                            __html: atob(categoryForm.image.split(',')[1]) 
                          }}
                        />
                      ) : (
                        <img
                          src={categoryForm.image}
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
                      onChange={(e) => handleImageUpload(e, 'category')}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    أنواع الملفات المدعومة: PNG, JPG, GIF, WebP, SVG
                  </p>
                </div>
                
                <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
                  {editingCategory ? 'حفظ التغييرات' : 'إضافة القسم'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
