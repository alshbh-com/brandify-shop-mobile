
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
    // For now, return empty array until subcategories table is created
    setLoading(false);
  }, []);

  const fetchSubcategories = async () => {
    try {
      // This will work once the subcategories table is created
      console.log('Subcategories table not yet created');
      setSubcategories([]);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSubcategoriesByCategory = (categoryId: string) => {
    return subcategories.filter(sub => sub.category_id === categoryId);
  };

  const addSubcategory = async (subcategory: Omit<Subcategory, 'id'>) => {
    try {
      console.log('Adding subcategory:', subcategory);
      return { id: 'temp-id', ...subcategory };
    } catch (error) {
      console.error('Error adding subcategory:', error);
      throw error;
    }
  };

  const updateSubcategory = async (id: string, updates: Partial<Subcategory>) => {
    try {
      console.log('Updating subcategory:', id, updates);
      return { id, ...updates };
    } catch (error) {
      console.error('Error updating subcategory:', error);
      throw error;
    }
  };

  const deleteSubcategory = async (id: string) => {
    try {
      console.log('Deleting subcategory:', id);
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
