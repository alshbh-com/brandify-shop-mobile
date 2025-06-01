
import React, { createContext, useContext, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useProducts } from '@/hooks/useProducts';
import { useStoreSettings } from '@/hooks/useStoreSettings';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category_id: string;
  description: string;
}

interface Category {
  id: string;
  name: string;
  image: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface AppContextType {
  // Auth
  user: any;
  profile: any;
  isAuthenticated: boolean;
  loading: boolean;
  signUp: (name: string, email: string, password: string, birthDate: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<any>;
  
  // Products & Categories
  products: Product[];
  categories: Category[];
  productsLoading: boolean;
  addProduct: (product: Omit<Product, 'id'>) => Promise<any>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<any>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<any>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<any>;
  deleteCategory: (id: string) => Promise<void>;
  
  // Store Settings
  settings: any;
  settingsLoading: boolean;
  updateSettings: (updates: any) => Promise<any>;
  checkAdminPassword: (password: string) => boolean;
  
  // Cart & Admin
  cart: CartItem[];
  isAdmin: boolean;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const profile = useProfile();
  const products = useProducts();
  const storeSettings = useStoreSettings();
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const adminLogin = (password: string): boolean => {
    if (storeSettings.checkAdminPassword(password)) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdmin(false);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const value: AppContextType = {
    // Auth
    user: auth.user,
    profile: profile.profile,
    isAuthenticated: !!auth.user,
    loading: auth.loading || profile.loading,
    signUp: auth.signUp,
    signIn: auth.signIn,
    signOut: auth.signOut,
    updateProfile: profile.updateProfile,
    
    // Products & Categories
    products: products.products,
    categories: products.categories,
    productsLoading: products.loading,
    addProduct: products.addProduct,
    updateProduct: products.updateProduct,
    deleteProduct: products.deleteProduct,
    addCategory: products.addCategory,
    updateCategory: products.updateCategory,
    deleteCategory: products.deleteCategory,
    
    // Store Settings
    settings: storeSettings.settings,
    settingsLoading: storeSettings.loading,
    updateSettings: storeSettings.updateSettings,
    checkAdminPassword: storeSettings.checkAdminPassword,
    
    // Cart & Admin
    cart,
    isAdmin,
    adminLogin,
    adminLogout,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
