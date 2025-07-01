
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category_id: string;
  description: string;
  merchant_id?: string;
  has_sizes?: boolean;
  size_s_price?: number;
  size_m_price?: number;
  size_l_price?: number;
}

interface Category {
  id: string;
  name: string;
  image: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Starting data fetch...');
      
      const [productsResponse, categoriesResponse] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('created_at', { ascending: false })
      ]);

      console.log('📊 Products response:', productsResponse);
      console.log('📁 Categories response:', categoriesResponse);

      if (productsResponse.error) {
        console.error('❌ Products fetch error:', productsResponse.error);
        throw productsResponse.error;
      }
      if (categoriesResponse.error) {
        console.error('❌ Categories fetch error:', categoriesResponse.error);
        throw categoriesResponse.error;
      }

      const productsData = productsResponse.data || [];
      const categoriesData = categoriesResponse.data || [];

      console.log('✅ Data fetched successfully:');
      console.log(`📦 Products: ${productsData.length} items`);
      console.log(`📂 Categories: ${categoriesData.length} items`);

      setProducts(productsData);
      setCategories(categoriesData);
      
    } catch (error: any) {
      console.error('💥 Critical error in fetchData:', error);
      setError(error.message || 'حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
      console.log('🏁 Data fetch completed');
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      console.log('➕ Adding new product:', product);
      
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();

      if (error) {
        console.error('❌ Error adding product:', error);
        throw error;
      }

      console.log('✅ Product added successfully:', data);
      setProducts(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('💥 Error in addProduct:', error);
      throw error;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      console.log('📝 Updating product:', id, updates);
      
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating product:', error);
        throw error;
      }

      console.log('✅ Product updated successfully:', data);
      setProducts(prev => prev.map(p => p.id === id ? data : p));
      return data;
    } catch (error) {
      console.error('💥 Error in updateProduct:', error);
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      console.log('🗑️ Deleting product:', id);
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Error deleting product:', error);
        throw error;
      }

      console.log('✅ Product deleted successfully');
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('💥 Error in deleteProduct:', error);
      throw error;
    }
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    try {
      console.log('➕ Adding new category:', category);
      
      const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select()
        .single();

      if (error) {
        console.error('❌ Error adding category:', error);
        throw error;
      }

      console.log('✅ Category added successfully:', data);
      setCategories(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('💥 Error in addCategory:', error);
      throw error;
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      console.log('📝 Updating category:', id, updates);
      
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating category:', error);
        throw error;
      }

      console.log('✅ Category updated successfully:', data);
      setCategories(prev => prev.map(c => c.id === id ? data : c));
      return data;
    } catch (error) {
      console.error('💥 Error in updateCategory:', error);
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      console.log('🗑️ Deleting category:', id);
      
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Error deleting category:', error);
        throw error;
      }

      console.log('✅ Category deleted successfully');
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('💥 Error in deleteCategory:', error);
      throw error;
    }
  };

  return {
    products,
    categories,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    refetchData: fetchData
  };
};
