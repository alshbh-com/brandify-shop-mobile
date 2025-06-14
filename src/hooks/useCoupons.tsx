
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Coupon {
  id: string;
  code: string;
  discount_percent: number;
  start_date: string;
  end_date: string;
  max_usage: number;
  usage_count: number;
  is_active: boolean;
  created_at: string;
}

export const useCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCoupons(data || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCoupon = async (coupon: Omit<Coupon, 'id' | 'created_at' | 'usage_count'>) => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .insert([{ ...coupon, usage_count: 0 }])
        .select()
        .single();

      if (error) throw error;
      setCoupons(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding coupon:', error);
      throw error;
    }
  };

  const updateCoupon = async (id: string, updates: Partial<Coupon>) => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setCoupons(prev => prev.map(c => c.id === id ? data : c));
      return data;
    } catch (error) {
      console.error('Error updating coupon:', error);
      throw error;
    }
  };

  const deleteCoupon = async (id: string) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCoupons(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting coupon:', error);
      throw error;
    }
  };

  return {
    coupons,
    loading,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    refetchCoupons: fetchCoupons
  };
};
