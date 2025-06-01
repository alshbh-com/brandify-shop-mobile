
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useApp } from '@/contexts/AppContext';
import { Minus, Plus, Trash2 } from 'lucide-react';

const CartScreen = () => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderInfo, setOrderInfo] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });

  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    user 
  } = useApp();

  const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('السلة فارغة');
      return;
    }

    if (!orderInfo.name || !orderInfo.phone || !orderInfo.address) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    // إنشاء رسالة WhatsApp
    const cartItems = cart.map(item => 
      `${item.product.name} - الكمية: ${item.quantity} - السعر: ${item.product.price * item.quantity} ر.س`
    ).join('\n');

    const message = `
🛍️ طلب جديد من ${orderInfo.name}

📱 رقم الهاتف: ${orderInfo.phone}
📍 العنوان: ${orderInfo.address}

🛒 المنتجات:
${cartItems}

💰 المجموع الكلي: ${total} ر.س

📝 ملاحظات: ${orderInfo.notes || 'لا توجد ملاحظات'}
    `;

    const phoneNumber = '966553624564';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    
    // مسح السلة بعد الإرسال
    clearCart();
    setShowCheckout(false);
    setOrderInfo({ name: '', phone: '', address: '', notes: '' });
    alert('تم إرسال طلبك بنجاح! سيتم التواصل معك قريباً');
  };

  if (showCheckout) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 pb-20">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-center mb-6">إكمال الطلب</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الاسم الكامل *
                </label>
                <Input
                  value={orderInfo.name}
                  onChange={(e) => setOrderInfo(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="أدخل اسمك الكامل"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  رقم الهاتف *
                </label>
                <Input
                  value={orderInfo.phone}
                  onChange={(e) => setOrderInfo(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="05xxxxxxxx"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  العنوان *
                </label>
                <Input
                  value={orderInfo.address}
                  onChange={(e) => setOrderInfo(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="أدخل عنوانك بالتفصيل"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ملاحظات إضافية
                </label>
                <Input
                  value={orderInfo.notes}
                  onChange={(e) => setOrderInfo(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="أي ملاحظات خاصة بالطلب"
                />
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between text-lg font-bold">
                <span>المجموع الكلي:</span>
                <span className="text-blue-600">{total} ر.س</span>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setShowCheckout(false)}
                variant="outline"
                className="flex-1"
              >
                الرجوع
              </Button>
              <Button
                onClick={handleCheckout}
                className="flex-1 bg-green-500 hover:bg-green-600"
              >
                إرسال الطلب
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">سلة التسوق</h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-semibold text-gray-600 mb-2">السلة فارغة</h2>
          <p className="text-gray-500">لم تقم بإضافة أي منتجات بعد</p>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {cart.map(item => (
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
                      <p className="text-blue-600 font-bold">{item.product.price} ر.س</p>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        size="sm"
                        variant="outline"
                        className="w-8 h-8 p-0"
                      >
                        <Minus size={16} />
                      </Button>
                      <span className="font-semibold min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <Button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        size="sm"
                        variant="outline"
                        className="w-8 h-8 p-0"
                      >
                        <Plus size={16} />
                      </Button>
                      <Button
                        onClick={() => removeFromCart(item.product.id)}
                        size="sm"
                        variant="destructive"
                        className="w-8 h-8 p-0 mr-2"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-center text-xl font-bold mb-4">
                <span>المجموع الكلي:</span>
                <span className="text-blue-600">{total} ر.س</span>
              </div>
              <Button
                onClick={() => setShowCheckout(true)}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3"
              >
                إكمال الطلب
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default CartScreen;
