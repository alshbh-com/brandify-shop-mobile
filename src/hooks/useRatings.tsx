
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Rating {
  id: string;
  product_id: string;
  rating: number;
  admin_comment: string | null;
}

export const useRatings = () => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      const { data, error } = await supabase
        .from('ratings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRatings(data || []);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const addOrUpdateRating = async (productId: string, rating: number, comment?: string) => {
    try {
      const existing = ratings.find(r => r.product_id === productId);
      
      if (existing) {
        const { data, error } = await supabase
          .from('ratings')
          .update({ rating, admin_comment: comment })
          .eq('product_id', productId)
          .select()
          .single();

        if (error) throw error;
        setRatings(prev => prev.map(r => r.product_id === productId ? data : r));
        return data;
      } else {
        const { data, error } = await supabase
          .from('ratings')
          .insert([{ product_id: productId, rating, admin_comment: comment }])
          .select()
          .single();

        if (error) throw error;
        setRatings(prev => [data, ...prev]);
        return data;
      }
    } catch (error) {
      console.error('Error adding/updating rating:', error);
      throw error;
    }
  };

  const deleteRating = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('ratings')
        .delete()
        .eq('product_id', productId);

      if (error) throw error;
      setRatings(prev => prev.filter(r => r.product_id !== productId));
    } catch (error) {
      console.error('Error deleting rating:', error);
      throw error;
    }
  };

  return {
    ratings,
    loading,
    addOrUpdateRating,
    deleteRating,
    refetchRatings: fetchRatings
  };
};
