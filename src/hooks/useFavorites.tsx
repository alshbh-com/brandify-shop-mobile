
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Favorite {
  id: string;
  product_id: string;
  is_featured: boolean;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (productId: string) => {
    try {
      const existing = favorites.find(f => f.product_id === productId);
      
      if (existing) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('product_id', productId);

        if (error) throw error;
        setFavorites(prev => prev.filter(f => f.product_id !== productId));
      } else {
        const { data, error } = await supabase
          .from('favorites')
          .insert([{ product_id: productId, is_featured: false }])
          .select()
          .single();

        if (error) throw error;
        setFavorites(prev => [data, ...prev]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  };

  const toggleFeatured = async (productId: string) => {
    try {
      const favorite = favorites.find(f => f.product_id === productId);
      if (!favorite) return;

      const { data, error } = await supabase
        .from('favorites')
        .update({ is_featured: !favorite.is_featured })
        .eq('product_id', productId)
        .select()
        .single();

      if (error) throw error;
      setFavorites(prev => prev.map(f => f.product_id === productId ? data : f));
    } catch (error) {
      console.error('Error toggling featured:', error);
      throw error;
    }
  };

  return {
    favorites,
    loading,
    toggleFavorite,
    toggleFeatured,
    refetchFavorites: fetchFavorites
  };
};
