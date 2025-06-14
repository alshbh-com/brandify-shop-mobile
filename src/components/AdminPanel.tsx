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
import AdminHeader from './admin/AdminHeader';
import AdminNavigation from './admin/AdminNavigation';
import StoreSettingsTab from './admin/StoreSettingsTab';
import ProductsTab from './admin/ProductsTab';
import CategoriesTab from './admin/CategoriesTab';
import OffersTab from './admin/OffersTab';
import FavoritesTab from './admin/FavoritesTab';
import RatingsTab from './admin/RatingsTab';
import ProductApprovalTab from './admin/ProductApprovalTab';
import ProductForm from './admin/forms/ProductForm';
import CategoryForm from './admin/forms/CategoryForm';
import OfferForm from './admin/forms/OfferForm';
import RatingForm from './admin/forms/RatingForm';
import AdminCouponsTab from './admin/AdminCouponsTab';
import CouponForm from './admin/forms/CouponForm';
import AdminUsersTab from './admin/AdminUsersTab';
import { supabase } from '@/integrations/supabase/client';

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
  const [coupons, setCoupons] = useState<any[]>([]);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  const [approvalRequests, setApprovalRequests] = useState<any[]>([]);
  const [couponForm, setCouponForm] = useState({
    code: '',
    discount_percent: '',
    start_date: '',
    end_date: '',
    max_usage: '',
  });

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

  useEffect(() => {
    fetchApprovalRequests();
    fetchCoupons();
  }, []);

  const fetchApprovalRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('product_approval_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApprovalRequests(data || []);
    } catch (error) {
      console.error('Error fetching approval requests:', error);
    }
  };

  const fetchCoupons = async () => {
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setCoupons(data);
  };

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponForm.code || !couponForm.discount_percent || !couponForm.end_date) {
      alert('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }
    const couponData = {
      code: couponForm.code.trim().toUpperCase(),
      discount_percent: parseInt(couponForm.discount_percent),
      start_date: couponForm.start_date || new Date().toISOString().split('T')[0],
      end_date: couponForm.end_date,
      max_usage: parseInt(couponForm.max_usage) || 1,
      is_active: true,
    };
    if (editingCoupon) {
      // تحديث الكوبون
      await supabase.from("coupons").update(couponData).eq("id", editingCoupon.id);
    } else {
      // إضافة كوبون جديد
      await supabase.from("coupons").insert([couponData]);
    }
    // إعادة الجلب بعد التعديل أو الإضافة
    const { data } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
    setCoupons(data || []);
    setShowCouponForm(false);
    setEditingCoupon(null);
    setCouponForm({ code: '', discount_percent: '', start_date: '', end_date: '', max_usage: '' });
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!window.confirm("هل أنت متأكد من حذف الكوبون؟")) return;
    await supabase.from("coupons").delete().eq("id", id);
    // تحديث قائمة الكوبونات
    const { data } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
    setCoupons(data || []);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'product' | 'category') => {
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
        if (type === 'product') {
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
      <AdminHeader onLogout={adminLogout} />
      <AdminNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="p-4">
        {activeTab === 'store' && (
          <StoreSettingsTab
            storeName={storeName}
            welcomeImage={welcomeImage}
            onStoreNameChange={updateStoreName}
            onWelcomeImageChange={updateWelcomeImage}
          />
        )}

        {activeTab === 'themes' && (
          <div className="space-y-6">
            <ThemeManager />
          </div>
        )}

        {activeTab === 'products' && (
          <ProductsTab
            products={products}
            categories={categories}
            favorites={favorites}
            ratings={ratings}
            onAddProduct={() => setShowProductForm(true)}
            onEditProduct={startEditProduct}
            onDeleteProduct={deleteProduct}
            onToggleFavorite={toggleFavorite}
            onEditRating={startEditRating}
          />
        )}

        {activeTab === 'categories' && (
          <CategoriesTab
            categories={categories}
            onAddCategory={() => setShowCategoryForm(true)}
            onEditCategory={startEditCategory}
            onDeleteCategory={deleteCategory}
          />
        )}

        {activeTab === 'offers' && (
          <OffersTab
            offers={offers}
            products={products}
            onAddOffer={() => setShowOfferForm(true)}
            onEditOffer={startEditOffer}
            onDeleteOffer={deleteOffer}
          />
        )}

        {activeTab === 'favorites' && (
          <FavoritesTab
            favorites={favorites}
            products={products}
            categories={categories}
            onToggleFeatured={toggleFeatured}
            onToggleFavorite={toggleFavorite}
          />
        )}

        {activeTab === 'ratings' && (
          <RatingsTab
            ratings={ratings}
            products={products}
            onAddRating={() => setShowRatingForm(true)}
            onEditRating={startEditRating}
            onDeleteRating={deleteRating}
          />
        )}

        {activeTab === 'coupons' && (
          <AdminCouponsTab
            coupons={coupons}
            onAddCoupon={() => {
              setEditingCoupon(null);
              setCouponForm({ code: '', discount_percent: '', start_date: '', end_date: '', max_usage: '' });
              setShowCouponForm(true);
            }}
            onEditCoupon={coupon => {
              setEditingCoupon(coupon);
              setCouponForm({
                code: coupon.code,
                discount_percent: coupon.discount_percent.toString(),
                start_date: coupon.start_date?.slice(0, 10),
                end_date: coupon.end_date?.slice(0, 10),
                max_usage: coupon.max_usage?.toString() || '',
              });
              setShowCouponForm(true);
            }}
            onDeleteCoupon={handleDeleteCoupon}
          />
        )}

        {activeTab === 'approvals' && (
          <ProductApprovalTab
            approvalRequests={approvalRequests}
            categories={categories}
            onRefresh={fetchApprovalRequests}
          />
        )}

        {activeTab === 'users' && (
          <AdminUsersTab />
        )}
      </div>

      <ProductForm
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
        onImageUpload={(e) => handleImageUpload(e, 'product')}
      />

      <CategoryForm
        show={showCategoryForm}
        editing={editingCategory}
        form={categoryForm}
        onClose={() => {
          setShowCategoryForm(false);
          setEditingCategory(null);
          setCategoryForm({ name: '', image: '' });
        }}
        onSubmit={handleCategorySubmit}
        onFormChange={(updates) => setCategoryForm(prev => ({ ...prev, ...updates }))}
        onImageUpload={(e) => handleImageUpload(e, 'category')}
      />

      <OfferForm
        show={showOfferForm}
        editing={editingOffer}
        form={offerForm}
        products={products}
        onClose={() => {
          setShowOfferForm(false);
          setEditingOffer(null);
          setOfferForm({ product_id: '', discount_percentage: '', start_date: '', end_date: '', is_active: true });
        }}
        onSubmit={handleOfferSubmit}
        onFormChange={(updates) => setOfferForm(prev => ({ ...prev, ...updates }))}
      />

      <RatingForm
        show={showRatingForm}
        editing={editingRating}
        form={ratingForm}
        products={products}
        onClose={() => {
          setShowRatingForm(false);
          setEditingRating(null);
          setRatingForm({ product_id: '', rating: '', admin_comment: '' });
        }}
        onSubmit={handleRatingSubmit}
        onFormChange={(updates) => setRatingForm(prev => ({ ...prev, ...updates }))}
      />

      <CouponForm
        show={showCouponForm}
        editing={editingCoupon}
        form={couponForm}
        onClose={() => {
          setShowCouponForm(false);
          setEditingCoupon(null);
          setCouponForm({ code: '', discount_percent: '', start_date: '', end_date: '', max_usage: '' });
        }}
        onSubmit={handleCouponSubmit}
        onFormChange={u => setCouponForm(prev => ({ ...prev, ...u }))}
      />
    </div>
  );
};

export default AdminPanel;
