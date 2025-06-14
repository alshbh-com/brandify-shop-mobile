import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { useProducts } from '@/hooks/useProducts';
import { Plus, Edit, Trash2, Package, LogOut, Clock, CheckCircle, XCircle } from 'lucide-react';
import MerchantProductForm from './merchant/MerchantProductForm';
import MerchantProductApprovalForm from './merchant/MerchantProductApprovalForm';
import { supabase } from '@/integrations/supabase/client';

const MerchantPanel = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [showProductForm, setShowProductForm] = useState(false);
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [approvalRequests, setApprovalRequests] = useState<any[]>([]);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category_id: '',
    description: '',
    image: '',
    has_sizes: false,
    size_s_price: '',
    size_m_price: '',
    size_l_price: ''
  });

  const { user, logout, categories } = useApp();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();

  // Filter products for current merchant (approved products only)
  const merchantProducts = products.filter(p => p.merchant_id === user?.id);

  useEffect(() => {
    if (user) {
      fetchApprovalRequests();
    }
  }, [user]);

  const fetchApprovalRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('product_approval_requests')
        .select('*')
        .eq('merchant_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApprovalRequests(data || []);
    } catch (error) {
      console.error('Error fetching approval requests:', error);
    }
  };

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
      merchant_id: user?.id,
      has_sizes: productForm.has_sizes,
      size_s_price: productForm.size_s_price ? parseFloat(productForm.size_s_price) : null,
      size_m_price: productForm.size_m_price ? parseFloat(productForm.size_m_price) : null,
      size_l_price: productForm.size_l_price ? parseFloat(productForm.size_l_price) : null
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        setEditingProduct(null);
      } else {
        await addProduct(productData);
      }
      setProductForm({
        name: '',
        price: '',
        category_id: '',
        description: '',
        image: '',
        has_sizes: false,
        size_s_price: '',
        size_m_price: '',
        size_l_price: ''
      });
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
      image: product.image,
      has_sizes: product.has_sizes || false,
      size_s_price: product.size_s_price ? product.size_s_price.toString() : '',
      size_m_price: product.size_m_price ? product.size_m_price.toString() : '',
      size_l_price: product.size_l_price ? product.size_l_price.toString() : ''
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-200"><Clock size={12} className="ml-1" />قيد المراجعة</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600 border-green-200"><CheckCircle size={12} className="ml-1" />موافق عليه</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600 border-red-200"><XCircle size={12} className="ml-1" />مرفوض</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'غير محدد';
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
            منتجاتي المعتمدة
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'requests'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            طلبات الموافقة
          </button>
        </div>
      </div>

      <div className="p-4">
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">المنتجات المعتمدة</h2>
              <Button
                onClick={() => setShowProductForm(true)}
                className="bg-green-500 hover:bg-green-600"
              >
                <Plus size={16} className="ml-2" />
                تعديل منتج معتمد
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
                          {getCategoryName(product.category_id)}
                        </p>
                        <p className="text-blue-600 font-bold">{product.price} ج.م</p>
                        
                        {/* عرض أسعار الأحجام إذا كانت متوفرة */}
                        {product.has_sizes && (
                          <div className="mt-1">
                            <div className="flex gap-2">
                              {product.size_s_price && (
                                <Badge variant="outline" className="text-xs">
                                  S: {product.size_s_price} ج.م
                                </Badge>
                              )}
                              {product.size_m_price && (
                                <Badge variant="outline" className="text-xs">
                                  M: {product.size_m_price} ج.م
                                </Badge>
                              )}
                              {product.size_l_price && (
                                <Badge variant="outline" className="text-xs">
                                  L: {product.size_l_price} ج.م
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
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

        {activeTab === 'requests' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">طلبات الموافقة على المنتجات</h2>
              <Button
                onClick={() => setShowApprovalForm(true)}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Plus size={16} className="ml-2" />
                طلب موافقة منتج جديد
              </Button>
            </div>

            <Card className="bg-blue-50">
              <CardContent className="p-4">
                <p className="text-blue-800">
                  <strong>ملاحظة:</strong> جميع المنتجات تحتاج موافقة المدير قبل النشر.
                  العروض يتم إضافتها من المدير فقط.
                </p>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {approvalRequests.map(request => (
                <Card key={request.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={request.product_image}
                        alt={request.product_name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{request.product_name}</h3>
                        <p className="text-sm text-gray-500">
                          {getCategoryName(request.product_category_id)}
                        </p>
                        <p className="text-blue-600 font-bold">{request.product_price} ج.م</p>
                        <p className="text-xs text-gray-400">
                          {new Date(request.created_at).toLocaleDateString('ar')}
                        </p>
                        {request.admin_notes && (
                          <p className="text-sm text-gray-600 mt-1">
                            <strong>ملاحظات المدير:</strong> {request.admin_notes}
                          </p>
                        )}
                      </div>
                      <div className="text-center">
                        {getStatusBadge(request.status)}
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
      <MerchantProductForm
        show={showProductForm}
        editing={editingProduct}
        form={productForm}
        categories={categories}
        onClose={() => {
          setShowProductForm(false);
          setEditingProduct(null);
          setProductForm({
            name: '',
            price: '',
            category_id: '',
            description: '',
            image: '',
            has_sizes: false,
            size_s_price: '',
            size_m_price: '',
            size_l_price: ''
          });
        }}
        onSubmit={handleProductSubmit}
        onFormChange={(updates) => setProductForm(prev => ({ ...prev, ...updates }))}
        onImageUpload={handleImageUpload}
      />

      {/* Product Approval Request Form Modal */}
      <MerchantProductApprovalForm
        show={showApprovalForm}
        categories={categories}
        onClose={() => setShowApprovalForm(false)}
        onSuccess={fetchApprovalRequests}
      />
    </div>
  );
};

export default MerchantPanel;
