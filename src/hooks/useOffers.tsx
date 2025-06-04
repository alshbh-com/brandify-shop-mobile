
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Offer {
  id: string;
  product_id: string;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export const useOffers = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOffers(data || []);
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const addOffer = async (offer: Omit<Offer, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('offers')
        .insert([offer])
        .select()
        .single();

      if (error) throw error;
      setOffers(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding offer:', error);
      throw error;
    }
  };

  const updateOffer = async (id: string, updates: Partial<Offer>) => {
    try {
      const { data, error } = await supabase
        .from('offers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setOffers(prev => prev.map(o => o.id === id ? data : o));
      return data;
    } catch (error) {
      console.error('Error updating offer:', error);
      throw error;
    }
  };

  const deleteOffer = async (id: string) => {
    try {
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setOffers(prev => prev.filter(o => o.id !== id));
    } catch (error) {
      console.error('Error deleting offer:', error);
      throw error;
    }
  };

  return {
    offers,
    loading,
    addOffer,
    updateOffer,
    deleteOffer,
    refetchOffers: fetchOffers
  };
};
