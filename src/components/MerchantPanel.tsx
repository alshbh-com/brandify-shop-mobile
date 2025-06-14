
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useApp } from '@/contexts/AppContext';
import { useProducts } from '@/hooks/useProducts';
import { Plus, Edit, Trash2, Upload, X, Package, Tag, LogOut } from 'lucide-react';
import MerchantProductForm from './merchant/MerchantProductForm';
import MerchantOfferRequestForm from './merchant/MerchantOfferRequestForm';

const MerchantPanel = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [showProductForm, setShowProductForm] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category_id: '',
    description: '',
    image: ''
  });

  const { user, logout, categories } = useApp();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();

  // Filter products for current merchant
  const merchantProducts = products.filter(p => p.merchant_id === user?.id);

  const handleProductSubmit = async (e: React.FormEvent) => {
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
      image: productForm.image || '/placeholder.svg',
      merchant_id: user?.id
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        setEditingProduct(null);
      } else {
        await addProduct(productData);
      }
      setProductForm({ name: '', price: '', category_id: '', description: '', image: '' });
      setShowProductForm(false);
    } catch (error) {
      alert('حدث خطأ أثناء حفظ المنتج');
    }
  };

  const startEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price.toString(),
      category_id: product.category_id,
      description: product.description || '',
      image: product.image
    });
    setShowProductForm(true);
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
        setProductForm(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">لوحة التاجر</h1>
          <Button
            onClick={logout}
            variant="ghost"
            className="text-white hover:bg-white/20"
          >
            <LogOut size={16} className="ml-2" />
            خروج
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200 px-4">
        <div className="flex space-x-4 space-x-reverse overflow-x-auto">
          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            منتجاتي
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'offers'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            طلب عروض
          </button>
        </div>
      </div>

      <div className="p-4">
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
              {merchantProducts.map(product => (
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
                        <p className="text-sm text-gray-500">
                          {categories.find(c => c.id === product.category_id)?.name || 'غير محدد'}
                        </p>
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

        {activeTab === 'offers' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">طلب عروض</h2>
              <Button
                onClick={() => setShowOfferForm(true)}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Tag size={16} className="ml-2" />
                طلب عرض جديد
              </Button>
            </div>
            
            <Card className="bg-blue-50">
              <CardContent className="p-4">
                <p className="text-blue-800">
                  <strong>ملاحظة:</strong> جميع طلبات العروض تحتاج موافقة المدير قبل النشر.
                  سيتم مراجعة طلبك وإشعارك بالقرار.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      <MerchantProductForm
        show={showProductForm}
        editing={editingProduct}
        form={productForm}
        categories={categories}
        onClose={() => {
          setShowProductForm(false);
          setEditingProduct(null);
          setProductForm({ name: '', price: '', category_id: '', description: '', image: '' });
        }}
        onSubmit={handleProductSubmit}
        onFormChange={(updates) => setProductForm(prev => ({ ...prev, ...updates }))}
        onImageUpload={handleImageUpload}
      />

      {/* Offer Request Form Modal */}
      <MerchantOfferRequestForm
        show={showOfferForm}
        products={merchantProducts}
        onClose={() => setShowOfferForm(false)}
      />
    </div>
  );
};

export default MerchantPanel;
