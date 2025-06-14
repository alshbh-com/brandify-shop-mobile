
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Merchant {
  id: string;
  name: string;
  whatsapp_number: string;
}

export const useMerchants = () => {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMerchants();
  }, []);

  const fetchMerchants = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, whatsapp_number')
        .not('whatsapp_number', 'is', null);

      if (error) throw error;

      setMerchants(data || []);
    } catch (error) {
      console.error('Error fetching merchants:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMerchantById = (id: string) => {
    return merchants.find(merchant => merchant.id === id);
  };

  return {
    merchants,
    loading,
    getMerchantById,
    refetch: fetchMerchants
  };
};
