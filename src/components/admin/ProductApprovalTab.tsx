
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, MessageSquare, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface ProductApprovalTabProps {
  categories: any[];
}

const ProductApprovalTab = ({ categories }: ProductApprovalTabProps) => {
  const [approvalRequests, setApprovalRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchApprovalRequests();
  }, []);

  const fetchApprovalRequests = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching approval requests...');
      
      const { data, error } = await supabase
        .from('product_approval_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching approval requests:', error);
        throw error;
      }

      console.log('✅ Approval requests loaded:', data);
      setApprovalRequests(data || []);
    } catch (error: any) {
      console.error('💥 Error fetching approval requests:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل طلبات الموافقة",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'غير محدد';
  };

  const handleApprove = async (request: any) => {
    try {
      console.log('✅ Approving product:', request);
      
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

      if (productError) {
        console.error('❌ Error adding product:', productError);
        throw productError;
      }

      // تحديث حالة الطلب
      const { error: updateError } = await supabase
        .from('product_approval_requests')
        .update({ 
          status: 'approved',
          admin_notes: 'تم الموافقة على المنتج ونشره',
          updated_at: new Date().toISOString()
        })
        .eq('id', request.id);

      if (updateError) {
        console.error('❌ Error updating request status:', updateError);
        throw updateError;
      }

      toast({
        title: "تم بنجاح",
        description: "تم الموافقة على المنتج ونشره بنجاح!"
      });
      
      await fetchApprovalRequests();
    } catch (error: any) {
      console.error('💥 Error approving product:', error);
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء الموافقة على المنتج",
        variant: "destructive"
      });
    }
  };

  const handleReject = async (request: any) => {
    const adminNotes = prompt('سبب الرفض (اختياري):');
    
    try {
      console.log('❌ Rejecting product:', request);
      
      const { error } = await supabase
        .from('product_approval_requests')
        .update({ 
          status: 'rejected',
          admin_notes: adminNotes || 'تم رفض المنتج',
          updated_at: new Date().toISOString()
        })
        .eq('id', request.id);

      if (error) {
        console.error('❌ Error rejecting product:', error);
        throw error;
      }

      toast({
        title: "تم",
        description: "تم رفض المنتج"
      });
      
      await fetchApprovalRequests();
    } catch (error: any) {
      console.error('💥 Error rejecting product:', error);
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء رفض المنتج",
        variant: "destructive"
      });
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="animate-spin mr-2" size={20} />
        جاري التحميل...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">طلبات الموافقة على المنتجات</h2>
        <Button onClick={fetchApprovalRequests} variant="outline">
          <RefreshCw size={16} className="ml-2" />
          تحديث
        </Button>
      </div>

      <div className="grid gap-4">
        {approvalRequests.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">لا توجد طلبات موافقة حالياً</p>
            </CardContent>
          </Card>
        ) : (
          approvalRequests.map(request => (
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
                    <p className="text-blue-600 font-bold">{request.product_price} ر.س</p>
                    
                    {request.has_sizes && (
                      <div className="mt-2">
                        <p className="text-xs text-orange-600 font-medium">أحجام متعددة:</p>
                        <div className="flex gap-2 mt-1">
                          {request.size_s_price && (
                            <Badge variant="outline" className="text-xs">
                              S: {request.size_s_price} ر.س
                            </Badge>
                          )}
                          {request.size_m_price && (
                            <Badge variant="outline" className="text-xs">
                              M: {request.size_m_price} ر.س
                            </Badge>
                          )}
                          {request.size_l_price && (
                            <Badge variant="outline" className="text-xs">
                              L: {request.size_l_price} ر.س
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
          ))
        )}
      </div>
    </div>
  );
};

export default ProductApprovalTab;
