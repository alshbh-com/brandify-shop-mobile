
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string | null;
  referral_code: string;
  commission_rate: number;
  total_earnings: number;
  status: string;
  created_at: string;
}

export interface ReferralTransaction {
  id: string;
  referral_id: string;
  order_id: string;
  commission_amount: number;
  status: string;
  created_at: string;
}

export const useReferrals = () => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [userReferral, setUserReferral] = useState<Referral | null>(null);
  const [transactions, setTransactions] = useState<ReferralTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all referrals (admin only)
      const { data: referralsData, error: referralsError } = await supabase
        .from('referrals')
        .select('*')
        .order('created_at', { ascending: false });

      if (referralsError) throw referralsError;

      setReferrals(referralsData || []);

      // Get current user's referral
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userReferralData } = await supabase
          .from('referrals')
          .select('*')
          .eq('referrer_id', user.id)
          .single();

        setUserReferral(userReferralData);

        // Get user's referral transactions
        if (userReferralData) {
          const { data: transactionsData } = await supabase
            .from('referral_transactions')
            .select('*')
            .eq('referral_id', userReferralData.id)
            .order('created_at', { ascending: false });

          setTransactions(transactionsData || []);
        }
      }

    } catch (error) {
      console.error('Error fetching referrals:', error);
      setError('حدث خطأ أثناء جلب بيانات الإحالة');
    } finally {
      setLoading(false);
    }
  };

  const createReferralCode = async (userId: string) => {
    try {
      // Generate referral code using the database function
      const { data: codeData, error: codeError } = await supabase
        .rpc('generate_referral_code', { user_id: userId });

      if (codeError) throw codeError;

      // Create referral record
      const { data, error } = await supabase
        .from('referrals')
        .insert({
          referrer_id: userId,
          referral_code: codeData,
          commission_rate: 10.0
        })
        .select()
        .single();

      if (error) throw error;

      setUserReferral(data);
      return data;

    } catch (error) {
      console.error('Error creating referral code:', error);
      throw error;
    }
  };

  const updateReferralStatus = async (referralId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('referrals')
        .update({ status })
        .eq('id', referralId);

      if (error) throw error;

      await fetchReferrals();
    } catch (error) {
      console.error('Error updating referral status:', error);
      throw error;
    }
  };

  const processReferralCommission = async (orderId: string, referralCode: string) => {
    try {
      // Find referral by code
      const { data: referralData, error: referralError } = await supabase
        .from('referrals')
        .select('*')
        .eq('referral_code', referralCode)
        .eq('status', 'active')
        .single();

      if (referralError || !referralData) return;

      // Get order details
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError || !orderData) return;

      // Calculate commission
      const commissionAmount = (orderData.total_amount * referralData.commission_rate) / 100;

      // Create transaction
      const { error: transactionError } = await supabase
        .from('referral_transactions')
        .insert({
          referral_id: referralData.id,
          order_id: orderId,
          commission_amount: commissionAmount,
          status: 'completed'
        });

      if (transactionError) throw transactionError;

      // Update referral total earnings
      const { error: updateError } = await supabase
        .from('referrals')
        .update({
          total_earnings: referralData.total_earnings + commissionAmount
        })
        .eq('id', referralData.id);

      if (updateError) throw updateError;

      await fetchReferrals();

    } catch (error) {
      console.error('Error processing referral commission:', error);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  return {
    referrals,
    userReferral,
    transactions,
    loading,
    error,
    refetch: fetchReferrals,
    createReferralCode,
    updateReferralStatus,
    processReferralCommission
  };
};
