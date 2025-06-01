
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useApp } from '@/contexts/AppContext';
import { Minus, Plus, Trash2, ShoppingBag, Phone, MapPin, User, MessageSquare } from 'lucide-react';

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
    
    clearCart();
    setShowCheckout(false);
    setOrderInfo({ name: '', phone: '', address: '', notes: '' });
    alert('تم إرسال طلبك بنجاح! سيتم التواصل معك قريباً');
  };

  if (showCheckout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 pb-20">
        <Card className="max-w-md mx-auto rounded-3xl shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">إكمال الطلب</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 ml-2 text-blue-500" />
                  الاسم الكامل *
                </label>
                <Input
                  value={orderInfo.name}
                  onChange={(e) => setOrderInfo(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="أدخل اسمك الكامل"
                  className="rounded-2xl border-gray-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 ml-2 text-blue-500" />
                  رقم الهاتف *
                </label>
                <Input
                  value={orderInfo.phone}
                  onChange={(e) => setOrderInfo(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="05xxxxxxxx"
                  className="rounded-2xl border-gray-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 ml-2 text-blue-500" />
                  العنوان *
                </label>
                <Input
                  value={orderInfo.address}
                  onChange={(e) => setOrderInfo(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="أدخل عنوانك بالتفصيل"
                  className="rounded-2xl border-gray-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare className="w-4 h-4 ml-2 text-blue-500" />
                  ملاحظات إضافية
                </label>
                <Input
                  value={orderInfo.notes}
                  onChange={(e) => setOrderInfo(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="أي ملاحظات خاصة بالطلب"
                  className="rounded-2xl border-gray-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
              <div className="flex justify-between text-xl font-bold">
                <span className="text-gray-700">المجموع الكلي:</span>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {total} ر.س
                </span>
              </div>
            </div>
            
            <div className="flex gap-4 mt-8">
              <Button
                onClick={() => setShowCheckout(false)}
                variant="outline"
                className="flex-1 rounded-2xl border-gray-200 hover:bg-gray-50"
              >
                الرجوع
              </Button>
              <Button
                onClick={handleCheckout}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-2xl shadow-lg"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 pb-20">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center ml-3">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            سلة التسوق
          </h1>
        </div>
      </div>
      
      {cart.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">السلة فارغة</h2>
          <p className="text-gray-500">لم تقم بإضافة أي منتجات بعد</p>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {cart.map(item => (
              <Card key={item.product.id} className="bg-white shadow-xl rounded-3xl border-0 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-2xl"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 mb-1">{item.product.name}</h3>
                      <p className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold text-lg">
                        {item.product.price} ر.س
                      </p>
                    </div>
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        size="sm"
                        variant="outline"
                        className="w-10 h-10 p-0 rounded-full border-gray-200"
                      >
                        <Minus size={16} />
                      </Button>
                      <span className="font-bold text-lg min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <Button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        size="sm"
                        variant="outline"
                        className="w-10 h-10 p-0 rounded-full border-gray-200"
                      >
                        <Plus size={16} />
                      </Button>
                      <Button
                        onClick={() => removeFromCart(item.product.id)}
                        size="sm"
                        variant="destructive"
                        className="w-10 h-10 p-0 rounded-full mr-2"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card className="bg-white shadow-2xl rounded-3xl border-0">
            <CardContent className="p-8">
              <div className="flex justify-between items-center text-2xl font-bold mb-6">
                <span className="text-gray-700">المجموع الكلي:</span>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {total} ر.س
                </span>
              </div>
              <Button
                onClick={() => setShowCheckout(true)}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-300"
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
