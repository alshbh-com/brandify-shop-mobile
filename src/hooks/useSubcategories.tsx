
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Subcategory {
  id: string;
  name: string;
  description: string;
  logo: string;
  banner_image: string;
  category_id: string;
  merchant_id: string;
  is_active: boolean;
}

export const useSubcategories = () => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubcategories();
  }, []);

  const fetchSubcategories = async () => {
    try {
      const { data, error } = await supabase
        .from('subcategories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching subcategories:', error);
        setSubcategories([]);
      } else {
        setSubcategories(data || []);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setSubcategories([]);
    } finally {
      setLoading(false);
    }
  };

  const getSubcategoriesByCategory = (categoryId: string) => {
    return subcategories.filter(sub => sub.category_id === categoryId);
  };

  const addSubcategory = async (subcategory: Omit<Subcategory, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('subcategories')
        .insert([subcategory])
        .select()
        .single();

      if (error) throw error;

      setSubcategories(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding subcategory:', error);
      throw error;
    }
  };

  const updateSubcategory = async (id: string, updates: Partial<Subcategory>) => {
    try {
      const { data, error } = await supabase
        .from('subcategories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setSubcategories(prev => prev.map(sub => sub.id === id ? data : sub));
      return data;
    } catch (error) {
      console.error('Error updating subcategory:', error);
      throw error;
    }
  };

  const deleteSubcategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('subcategories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSubcategories(prev => prev.filter(sub => sub.id !== id));
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      throw error;
    }
  };

  return {
    subcategories,
    loading,
    getSubcategoriesByCategory,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory,
    refetch: fetchSubcategories
  };
};
