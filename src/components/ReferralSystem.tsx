
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useReferrals } from '@/hooks/useReferrals';
import { useApp } from '@/contexts/AppContext';
import { Link, Copy, Check, DollarSign, Users, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ReferralSystem = () => {
  const { userReferral, transactions, loading, error, createReferralCode } = useReferrals();
  const { user } = useApp();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCreateReferralCode = async () => {
    if (!user) return;
    
    try {
      await createReferralCode(user.id);
      toast({
        title: "تم إنشاء كود الإحالة",
        description: "يمكنك الآن مشاركة رابط الإحالة مع الأصدقاء",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إنشاء كود الإحالة",
        variant: "destructive",
      });
    }
  };

  const copyReferralLink = () => {
    if (!userReferral) return;
    
    const referralLink = `${window.location.origin}?ref=${userReferral.referral_code}`;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({
      title: "تم النسخ",
      description: "تم نسخ رابط الإحالة إلى الحافظة",
    });
    setTimeout(() =>setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>جاري تحميل نظام الإحالة...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!userReferral ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-6 w-6" />
              انضم لنظام الإحالة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                احصل على عمولة من كل عملية شراء تتم من خلال رابط الإحالة الخاص بك
              </p>
              <Button onClick={handleCreateReferralCode} className="bg-blue-500 hover:bg-blue-600">
                إنشاء كود الإحالة
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Referral Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-green-500" />
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-500">إجمالي الأرباح</p>
                    <p className="text-2xl font-bold">{userReferral.total_earnings.toFixed(2)} ج.م</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-500" />
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-500">عدد المعاملات</p>
                    <p className="text-2xl font-bold">{transactions.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-500">نسبة العمولة</p>
                    <p className="text-2xl font-bold">{userReferral.commission_rate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Referral Link */}
          <Card>
            <CardHeader>
              <CardTitle>رابط الإحالة الخاص بك</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <code className="flex-1 text-sm">
                    {`${window.location.origin}?ref=${userReferral.referral_code}`}
                  </code>
                  <Button variant="outline" size="sm" onClick={copyReferralLink}>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    كود الإحالة: {userReferral.referral_code}
                  </Badge>
                  <Badge variant="outline" className={
                    userReferral.status === 'active' ? 'text-green-600 border-green-200' : 'text-red-600 border-red-200'
                  }>
                    {userReferral.status === 'active' ? 'نشط' : 'غير نشط'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  شارك هذا الرابط مع أصدقائك واحصل على {userReferral.commission_rate}% عمولة من كل عملية شراء
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card>
            <CardHeader>
              <CardTitle>تاريخ العمولات</CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  لا توجد معاملات حتى الآن
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold">عمولة من طلب #{transaction.order_id.slice(0, 8)}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.created_at).toLocaleDateString('ar')}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-green-600">
                          +{transaction.commission_amount.toFixed(2)} ج.م
                        </p>
                        <Badge variant="outline" className={
                          transaction.status === 'completed' ? 'text-green-600 border-green-200' : 'text-yellow-600 border-yellow-200'
                        }>
                          {transaction.status === 'completed' ? 'مكتمل' : 'قيد المراجعة'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ReferralSystem;
