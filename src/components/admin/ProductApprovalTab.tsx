
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ProductApprovalTabProps {
  approvalRequests: any[];
  categories: any[];
  onRefresh: () => void;
}

const ProductApprovalTab = ({
  approvalRequests,
  categories,
  onRefresh
}: ProductApprovalTabProps) => {
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'غير محدد';
  };

  const handleApprove = async (request: any) => {
    try {
      // إضافة المنتج إلى جدول المنتجات
      const { error: productError } = await supabase
        .from('products')
        .insert([{
          name: request.product_name,
          price: request.product_price,
          category_id: request.product_category_id,
          description: request.product_description,
          image: request.product_image,
          merchant_id: request.merchant_id,
          has_sizes: request.has_sizes || false,
          size_s_price: request.size_s_price,
          size_m_price: request.size_m_price,
          size_l_price: request.size_l_price
        }]);

      if (productError) throw productError;

      // تحديث حالة الطلب
      const { error: updateError } = await supabase
        .from('product_approval_requests')
        .update({ 
          status: 'approved',
          admin_notes: 'تم الموافقة على المنتج ونشره'
        })
        .eq('id', request.id);

      if (updateError) throw updateError;

      alert('تم الموافقة على المنتج ونشره بنجاح!');
      onRefresh();
    } catch (error) {
      console.error('Error approving product:', error);
      alert('حدث خطأ أثناء الموافقة على المنتج');
    }
  };

  const handleReject = async (request: any) => {
    const adminNotes = prompt('سبب الرفض (اختياري):');
    
    try {
      const { error } = await supabase
        .from('product_approval_requests')
        .update({ 
          status: 'rejected',
          admin_notes: adminNotes || 'تم رفض المنتج'
        })
        .eq('id', request.id);

      if (error) throw error;

      alert('تم رفض المنتج');
      onRefresh();
    } catch (error) {
      console.error('Error rejecting product:', error);
      alert('حدث خطأ أثناء رفض المنتج');
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">طلبات الموافقة على المنتجات</h2>
        <Button onClick={onRefresh} variant="outline">
          تحديث
        </Button>
      </div>

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
                  
                  {/* عرض أسعار الأحجام إذا كانت متوفرة */}
                  {request.has_sizes && (
                    <div className="mt-2">
                      <p className="text-xs text-orange-600 font-medium">أحجام متعددة:</p>
                      <div className="flex gap-2 mt-1">
                        {request.size_s_price && (
                          <Badge variant="outline" className="text-xs">
                            S: {request.size_s_price} ج.م
                          </Badge>
                        )}
                        {request.size_m_price && (
                          <Badge variant="outline" className="text-xs">
                            M: {request.size_m_price} ج.م
                          </Badge>
                        )}
                        {request.size_l_price && (
                          <Badge variant="outline" className="text-xs">
                            L: {request.size_l_price} ج.م
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-400">
                    {new Date(request.created_at).toLocaleDateString('ar')}
                  </p>
                  {request.product_description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {request.product_description}
                    </p>
                  )}
                  {request.admin_notes && (
                    <p className="text-sm text-orange-600 mt-1">
                      <MessageSquare size={12} className="inline ml-1" />
                      {request.admin_notes}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2 items-end">
                  {getStatusBadge(request.status)}
                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApprove(request)}
                        size="sm"
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <CheckCircle size={16} />
                        موافقة
                      </Button>
                      <Button
                        onClick={() => handleReject(request)}
                        size="sm"
                        variant="destructive"
                      >
                        <XCircle size={16} />
                        رفض
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {approvalRequests.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">لا توجد طلبات موافقة حالياً</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductApprovalTab;
