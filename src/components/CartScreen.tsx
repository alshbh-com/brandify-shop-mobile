
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useApp } from '@/contexts/AppContext';
import { useSettingsContext } from '@/contexts/SettingsContext';
import { useCoupons } from '@/hooks/useCoupons';
import { Minus, Plus, Trash2, ShoppingBag, Tag } from 'lucide-react';

const CartScreen = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useApp();
  const { t } = useSettingsContext();
  const { coupons } = useCoupons();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discount = appliedCoupon ? (subtotal * appliedCoupon.discount_percent / 100) : 0;
  const total = subtotal - discount;

  const applyCoupon = () => {
    const coupon = coupons.find(c => 
      c.code === couponCode && 
      c.is_active && 
      new Date(c.start_date) <= new Date() && 
      new Date(c.end_date) >= new Date() &&
      c.usage_count < c.max_usage
    );

    if (coupon) {
      setAppliedCoupon(coupon);
      alert(`تم تطبيق الكوبون! خصم ${coupon.discount_percent}%`);
    } else {
      alert('كود الكوبون غير صحيح أو منتهي الصلاحية');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 pb-20 flex flex-col items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={64} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">{t('emptyCart')}</h2>
          <p className="text-gray-500">{t('addProductsToCart')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('shoppingCart')}</h1>
      
      <div className="max-w-2xl mx-auto space-y-4">
        {cart.map((item) => (
          <Card key={item.product.id} className="bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4 space-x-reverse">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                  <p className="text-blue-600 font-medium">{item.product.price} {t('currency')}</p>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  >
                    <Plus size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeFromCart(item.product.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Coupon Section */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <Tag className="ml-2" size={20} />
              كود الخصم
            </h3>
            {!appliedCoupon ? (
              <div className="flex gap-2">
                <Input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="أدخل كود الخصم"
                  className="flex-1"
                />
                <Button onClick={applyCoupon} disabled={!couponCode.trim()}>
                  تطبيق
                </Button>
              </div>
            ) : (
              <div className="bg-green-50 p-3 rounded-lg flex justify-between items-center">
                <span className="text-green-800">
                  تم تطبيق كوبون: {appliedCoupon.code} (-{appliedCoupon.discount_percent}%)
                </span>
                <Button size="sm" variant="outline" onClick={removeCoupon}>
                  إزالة
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-800 mb-4">{t('orderSummary')}</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('subtotal')}</span>
                <span>{subtotal.toFixed(2)} {t('currency')}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span>خصم ({appliedCoupon.discount_percent}%)</span>
                  <span>-{discount.toFixed(2)} {t('currency')}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                <span>{t('total')}</span>
                <span className="text-blue-600">{total.toFixed(2)} {t('currency')}</span>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <Button className="w-full bg-blue-500 hover:bg-blue-600">
                {t('proceedToCheckout')}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={clearCart}
              >
                {t('clearCart')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CartScreen;
