
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsData {
  totalVisitors: number;
  totalOrders: number;
  ordersByMerchant: Array<{
    merchant_id: string;
    merchant_name: string;
    total_orders: number;
    total_amount: number;
  }>;
  topProducts: Array<{
    product_id: string;
    product_name: string;
    total_quantity: number;
    total_amount: number;
  }>;
  recentOrders: Array<{
    id: string;
    user_id: string;
    product_name: string;
    quantity: number;
    total_amount: number;
    status: string;
    created_at: string;
  }>;
}

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get total visitors
      const { count: totalVisitors } = await supabase
        .from('analytics')
        .select('*', { count: 'exact', head: true });

      // Get total orders
      const { count: totalOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      // Get orders by merchant
      const { data: ordersByMerchantData } = await supabase
        .from('orders')
        .select(`
          merchant_id,
          quantity,
          total_amount,
          profiles!orders_merchant_id_fkey(name)
        `)
        .not('merchant_id', 'is', null);

      // Process orders by merchant
      const merchantStats = ordersByMerchantData?.reduce((acc: any, order: any) => {
        const merchantId = order.merchant_id;
        if (!acc[merchantId]) {
          acc[merchantId] = {
            merchant_id: merchantId,
            merchant_name: order.profiles?.name || 'تاجر غير معروف',
            total_orders: 0,
            total_amount: 0
          };
        }
        acc[merchantId].total_orders += 1;
        acc[merchantId].total_amount += parseFloat(order.total_amount);
        return acc;
      }, {});

      const ordersByMerchant = Object.values(merchantStats || {}) as any[];

      // Get top products
      const { data: topProductsData } = await supabase
        .from('orders')
        .select(`
          product_id,
          quantity,
          total_amount,
          products(name)
        `)
        .not('product_id', 'is', null);

      // Process top products
      const productStats = topProductsData?.reduce((acc: any, order: any) => {
        const productId = order.product_id;
        if (!acc[productId]) {
          acc[productId] = {
            product_id: productId,
            product_name: order.products?.name || 'منتج غير معروف',
            total_quantity: 0,
            total_amount: 0
          };
        }
        acc[productId].total_quantity += order.quantity;
        acc[productId].total_amount += parseFloat(order.total_amount);
        return acc;
      }, {});

      const topProducts = Object.values(productStats || {})
        .sort((a: any, b: any) => b.total_quantity - a.total_quantity)
        .slice(0, 5) as any[];

      // Get recent orders
      const { data: recentOrdersData } = await supabase
        .from('orders')
        .select(`
          id,
          user_id,
          quantity,
          total_amount,
          status,
          created_at,
          products(name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      const recentOrders = recentOrdersData?.map(order => ({
        id: order.id,
        user_id: order.user_id || '',
        product_name: order.products?.name || 'منتج غير معروف',
        quantity: order.quantity,
        total_amount: order.total_amount,
        status: order.status,
        created_at: order.created_at
      })) || [];

      setAnalytics({
        totalVisitors: totalVisitors || 0,
        totalOrders: totalOrders || 0,
        ordersByMerchant,
        topProducts,
        recentOrders
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('حدث خطأ أثناء جلب الإحصائيات');
    } finally {
      setLoading(false);
    }
  };

  const trackVisit = async (pageVisited: string) => {
    try {
      await supabase
        .from('analytics')
        .insert({
          page_visited: pageVisited,
          visitor_ip: '', // يمكن تحسينه لاحقاً
          user_agent: navigator.userAgent,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });
    } catch (error) {
      console.error('Error tracking visit:', error);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics,
    trackVisit
  };
};
