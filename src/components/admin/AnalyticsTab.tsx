
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAnalytics } from '@/hooks/useAnalytics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, ShoppingCart, TrendingUp, Clock, Eye, Package } from 'lucide-react';

const AnalyticsTab = () => {
  const { analytics, loading, error, refetch } = useAnalytics();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>جاري تحميل الإحصائيات...</p>
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

  if (!analytics) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-200">قيد الانتظار</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-green-600 border-green-200">مكتمل</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="text-red-600 border-red-200">ملغي</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-blue-500" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-500">إجمالي الزوار</p>
                <p className="text-2xl font-bold">{analytics.totalVisitors}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-green-500" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-500">إجمالي الطلبات</p>
                <p className="text-2xl font-bold">{analytics.totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-500" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-500">التجار النشطين</p>
                <p className="text-2xl font-bold">{analytics.ordersByMerchant.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-orange-500" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-500">المنتجات المباعة</p>
                <p className="text-2xl font-bold">{analytics.topProducts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by Merchant */}
        <Card>
          <CardHeader>
            <CardTitle>الطلبات حسب التاجر</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.ordersByMerchant}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="merchant_name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total_orders" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>أكثر المنتجات مبيعاً</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.topProducts}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, value}) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="total_quantity"
                >
                  {analytics.topProducts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            الطلبات الحديثة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold">{order.product_name}</h4>
                  <p className="text-sm text-gray-500">
                    الكمية: {order.quantity} • المبلغ: {order.total_amount} ج.م
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.created_at).toLocaleDateString('ar')}
                  </p>
                </div>
                <div className="text-center">
                  {getStatusBadge(order.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue by Merchant */}
      <Card>
        <CardHeader>
          <CardTitle>الإيرادات حسب التاجر</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.ordersByMerchant.map((merchant, index) => (
              <div key={merchant.merchant_id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold">{merchant.merchant_name}</h4>
                  <p className="text-sm text-gray-500">
                    {merchant.total_orders} طلب
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">
                    {merchant.total_amount.toFixed(2)} ج.م
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsTab;
