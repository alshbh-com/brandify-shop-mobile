import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { useOffers } from '@/hooks/useOffers';
import { useFavorites } from '@/hooks/useFavorites';
import { useRatings } from '@/hooks/useRatings';
import { Plus, Edit, Trash2, Upload, X, Heart, Star, Tag, Percent } from 'lucide-react';
import ThemeManager from './ThemeManager';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('store');
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editingOffer, setEditingOffer] = useState<any>(null);
  const [editingRating, setEditingRating] = useState<any>(null);
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

  const [offerForm, setOfferForm] = useState({
    product_id: '',
    discount_percentage: '',
    start_date: '',
    end_date: '',
    is_active: true
  });

  const [ratingForm, setRatingForm] = useState({
    product_id: '',
    rating: '',
    admin_comment: ''
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

  const { offers, addOffer, updateOffer, deleteOffer } = useOffers();
  const { favorites, toggleFavorite, toggleFeatured } = useFavorites();
  const { ratings, addOrUpdateRating, deleteRating } = useRatings();

  useEffect(() => {
    setLocalStoreName(storeName);
  }, [storeName]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localStoreName !== storeName && localStoreName.trim() !== '') {
        updateStoreName(localStoreName);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localStoreName, storeName, updateStoreName]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'welcome' | 'product' | 'category') => {
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

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerForm.product_id || !offerForm.discount_percentage || !offerForm.end_date) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const offerData = {
      product_id: offerForm.product_id,
      discount_percentage: parseInt(offerForm.discount_percentage),
      start_date: offerForm.start_date || new Date().toISOString(),
      end_date: new Date(offerForm.end_date).toISOString(),
      is_active: offerForm.is_active
    };

    if (editingOffer) {
      updateOffer(editingOffer.id, offerData);
      setEditingOffer(null);
    } else {
      addOffer(offerData);
    }

    setOfferForm({ product_id: '', discount_percentage: '', start_date: '', end_date: '', is_active: true });
    setShowOfferForm(false);
  };

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingForm.product_id || !ratingForm.rating) {
      alert('يرجى ملء الحقول المطلوبة');
      return;
    }

    addOrUpdateRating(
      ratingForm.product_id,
      parseFloat(ratingForm.rating),
      ratingForm.admin_comment || undefined
    );

    setRatingForm({ product_id: '', rating: '', admin_comment: '' });
    setShowRatingForm(false);
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

  const startEditOffer = (offer: any) => {
    setEditingOffer(offer);
    setOfferForm({
      product_id: offer.product_id,
      discount_percentage: offer.discount_percentage.toString(),
      start_date: new Date(offer.start_date).toISOString().split('T')[0],
      end_date: new Date(offer.end_date).toISOString().split('T')[0],
      is_active: offer.is_active
    });
    setShowOfferForm(true);
  };

  const startEditRating = (productId: string) => {
    const rating = ratings.find(r => r.product_id === productId);
    setEditingRating(rating || null);
    setRatingForm({
      product_id: productId,
      rating: rating?.rating.toString() || '',
      admin_comment: rating?.admin_comment || ''
    });
    setShowRatingForm(true);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'غير محدد';
  };

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'منتج محذوف';
  };

  const isFavorite = (productId: string) => {
    return favorites.some(f => f.product_id === productId);
  };

  const isFeatured = (productId: string) => {
    return favorites.some(f => f.product_id === productId && f.is_featured);
  };

  const getProductRating = (productId: string) => {
    return ratings.find(r => r.product_id === productId);
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
        <div className="flex space-x-4 space-x-reverse overflow-x-auto">
          {[
            { id: 'store', label: 'إعدادات المتجر' },
            { id: 'themes', label: 'التصميمات' },
            { id: 'products', label: 'المنتجات' },
            { id: 'categories', label: 'الأقسام' },
            { id: 'offers', label: 'العروض' },
            { id: 'favorites', label: 'المفضلة' },
            { id: 'ratings', label: 'التقييمات' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
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

        {/* Themes Tab */}
        {activeTab === 'themes' && (
          <div className="space-y-6">
            <ThemeManager />
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
              {products.map(product => {
                const productRating = getProductRating(product.id);
                return (
                  <Card key={product.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{product.name}</h3>
                            {isFavorite(product.id) && (
                              <Heart 
                                size={16} 
                                className={`${isFeatured(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
                              />
                            )}
                            {productRating && (
                              <div className="flex items-center gap-1">
                                <Star size={14} className="text-yellow-500 fill-current" />
                                <span className="text-sm text-gray-600">{productRating.rating}</span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{getCategoryName(product.category_id)}</p>
                          <p className="text-blue-600 font-bold">{product.price} ر.س</p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            onClick={() => toggleFavorite(product.id)}
                            size="sm"
                            variant={isFavorite(product.id) ? "default" : "outline"}
                            className="text-xs"
                          >
                            <Heart size={14} />
                          </Button>
                          <Button
                            onClick={() => startEditRating(product.id)}
                            size="sm"
                            variant="outline"
                            className="text-xs"
                          >
                            <Star size={14} />
                          </Button>
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
                );
              })}
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

        {/* Offers Tab */}
        {activeTab === 'offers' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">إدارة العروض</h2>
              <Button
                onClick={() => setShowOfferForm(true)}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Tag size={16} className="ml-2" />
                إضافة عرض
              </Button>
            </div>

            <div className="grid gap-4">
              {offers.map(offer => (
                <Card key={offer.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                        <Percent className="text-white" size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{getProductName(offer.product_id)}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Badge variant="outline" className="text-orange-600 border-orange-200">
                            خصم {offer.discount_percentage}%
                          </Badge>
                          <Badge variant={offer.is_active ? "default" : "secondary"}>
                            {offer.is_active ? 'نشط' : 'غير نشط'}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">
                          من {new Date(offer.start_date).toLocaleDateString('ar')} 
                          إلى {new Date(offer.end_date).toLocaleDateString('ar')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => startEditOffer(offer)}
                          size="sm"
                          variant="outline"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          onClick={() => deleteOffer(offer.id)}
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

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">إدارة المفضلة</h2>
            </div>

            <div className="grid gap-4">
              {favorites.map(favorite => {
                const product = products.find(p => p.id === favorite.product_id);
                if (!product) return null;
                
                return (
                  <Card key={favorite.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{product.name}</h3>
                            <Heart 
                              size={16} 
                              className={`${favorite.is_featured ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
                            />
                          </div>
                          <p className="text-sm text-gray-500">{getCategoryName(product.category_id)}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant={favorite.is_featured ? "default" : "secondary"}>
                              {favorite.is_featured ? 'مميز' : 'عادي'}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => toggleFeatured(favorite.product_id)}
                            size="sm"
                            variant={favorite.is_featured ? "default" : "outline"}
                          >
                            <Star size={16} />
                          </Button>
                          <Button
                            onClick={() => toggleFavorite(favorite.product_id)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Ratings Tab */}
        {activeTab === 'ratings' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">إدارة التقييمات</h2>
              <Button
                onClick={() => setShowRatingForm(true)}
                className="bg-yellow-500 hover:bg-yellow-600"
              >
                <Star size={16} className="ml-2" />
                إضافة تقييم
              </Button>
            </div>

            <div className="grid gap-4">
              {ratings.map(rating => {
                const product = products.find(p => p.id === rating.product_id);
                if (!product) return null;
                
                return (
                  <Card key={rating.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{product.name}</h3>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={i < rating.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}
                                />
                              ))}
                              <span className="text-sm text-gray-600 mr-2">{rating.rating}</span>
                            </div>
                          </div>
                          {rating.admin_comment && (
                            <p className="text-sm text-gray-600 mt-1">{rating.admin_comment}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => startEditRating(rating.product_id)}
                            size="sm"
                            variant="outline"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            onClick={() => deleteRating(rating.product_id)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
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

      {/* Offer Form Modal */}
      {showOfferForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-white">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  {editingOffer ? 'تعديل عرض' : 'إضافة عرض جديد'}
                </CardTitle>
                <Button
                  onClick={() => {
                    setShowOfferForm(false);
                    setEditingOffer(null);
                    setOfferForm({ product_id: '', discount_percentage: '', start_date: '', end_date: '', is_active: true });
                  }}
                  variant="ghost"
                  size="sm"
                >
                  <X size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleOfferSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">المنتج *</label>
                  <select
                    value={offerForm.product_id}
                    onChange={(e) => setOfferForm(prev => ({ ...prev, product_id: e.target.value }))}
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
                    value={offerForm.discount_percentage}
                    onChange={(e) => setOfferForm(prev => ({ ...prev, discount_percentage: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">تاريخ البداية</label>
                  <Input
                    type="date"
                    value={offerForm.start_date}
                    onChange={(e) => setOfferForm(prev => ({ ...prev, start_date: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">تاريخ النهاية *</label>
                  <Input
                    type="date"
                    value={offerForm.end_date}
                    onChange={(e) => setOfferForm(prev => ({ ...prev, end_date: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={offerForm.is_active}
                    onChange={(e) => setOfferForm(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium">العرض نشط</label>
                </div>
                
                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                  {editingOffer ? 'حفظ التغييرات' : 'إضافة العرض'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Rating Form Modal */}
      {showRatingForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-white">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  {editingRating ? 'تعديل تقييم' : 'إضافة تقييم جديد'}
                </CardTitle>
                <Button
                  onClick={() => {
                    setShowRatingForm(false);
                    setEditingRating(null);
                    setRatingForm({ product_id: '', rating: '', admin_comment: '' });
                  }}
                  variant="ghost"
                  size="sm"
                >
                  <X size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRatingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">المنتج *</label>
                  <select
                    value={ratingForm.product_id}
                    onChange={(e) => setRatingForm(prev => ({ ...prev, product_id: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                    disabled={!!editingRating}
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
                    value={ratingForm.rating}
                    onChange={(e) => setRatingForm(prev => ({ ...prev, rating: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">تعليق الأدمن</label>
                  <Input
                    value={ratingForm.admin_comment}
                    onChange={(e) => setRatingForm(prev => ({ ...prev, admin_comment: e.target.value }))}
                    placeholder="تعليق اختياري"
                  />
                </div>
                
                <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600">
                  {editingRating ? 'حفظ التغييرات' : 'إضافة التقييم'}
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
