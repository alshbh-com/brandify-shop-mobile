
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useReferrals } from '@/hooks/useReferrals';
import { useApp } from '@/contexts/AppContext';
import { Link, Users, DollarSign, TrendingUp, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ReferralsTab = () => {
  const { referrals, loading, error, refetch, updateReferralStatus } = useReferrals();
  const { user } = useApp();
  const { toast } = useToast();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    toast({
      title: "تم النسخ",
      description: "تم نسخ الرابط إلى الحافظة",
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleStatusUpdate = async (referralId: string, status: string) => {
    try {
      await updateReferralStatus(referralId, status);
      toast({
        title: "تم التحديث",
        description: "تم تحديث حالة الإحالة بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث حالة الإحالة",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="text-green-600 border-green-200">نشط</Badge>;
      case 'paused':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-200">متوقف مؤقتاً</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="text-red-600 border-red-200">غير نشط</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>جاري تحميل بيانات الإحالة...</p>
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

  const totalReferrals = referrals.length;
  const activeReferrals = referrals.filter(r => r.status === 'active').length;
  const totalEarnings = referrals.reduce((sum, r) => sum + r.total_earnings, 0);

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Link className="h-8 w-8 text-blue-500" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-500">إجمالي الإحالات</p>
                <p className="text-2xl font-bold">{totalReferrals}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-500" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-500">الإحالات النشطة</p>
                <p className="text-2xl font-bold">{activeReferrals}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-500" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-500">إجمالي العمولات</p>
                <p className="text-2xl font-bold">{totalEarnings.toFixed(2)} ج.م</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-500" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-500">متوسط العمولة</p>
                <p className="text-2xl font-bold">
                  {totalReferrals > 0 ? (totalEarnings / totalReferrals).toFixed(2) : '0.00'} ج.م
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referrals List */}
      <Card>
        <CardHeader>
          <CardTitle>جميع الإحالات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {referrals.map((referral) => (
              <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">كود الإحالة: {referral.referral_code}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(`${window.location.origin}?ref=${referral.referral_code}`)}
                    >
                      {copiedCode === referral.referral_code ? <Check size={14} /> : <Copy size={14} />}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    نسبة العمولة: {referral.commission_rate}% • إجمالي الأرباح: {referral.total_earnings.toFixed(2)} ج.م
                  </p>
                  <p className="text-xs text-gray-400">
                    تاريخ الإنشاء: {new Date(referral.created_at).toLocaleDateString('ar')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(referral.status)}
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusUpdate(referral.id, referral.status === 'active' ? 'paused' : 'active')}
                    >
                      {referral.status === 'active' ? 'إيقاف' : 'تفعيل'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralsTab;
