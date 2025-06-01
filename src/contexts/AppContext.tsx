
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  birthDate: string;
  profileImage: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
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
  user: User | null;
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  welcomeImage: string;
  storeName: string;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, birthDate: string) => Promise<boolean>;
  logout: () => void;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  updateWelcomeImage: (image: string) => void;
  updateStoreName: (name: string) => void;
  updateUserProfile: (updates: Partial<User>) => void;
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
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [welcomeImage, setWelcomeImage] = useState('/placeholder.svg');
  const [storeName, setStoreName] = useState('متجر البرندات');
  
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'ساعة ذكية Apple Watch',
      price: 1200,
      image: '/placeholder.svg',
      category: 'إلكترونيات',
      description: 'ساعة ذكية عصرية مع ميزات متقدمة'
    },
    {
      id: '2',
      name: 'حقيبة يد Louis Vuitton',
      price: 2500,
      image: '/placeholder.svg',
      category: 'موضة',
      description: 'حقيبة يد فاخرة من العلامة التجارية الشهيرة'
    },
    {
      id: '3',
      name: 'عطر Chanel No. 5',
      price: 800,
      image: '/placeholder.svg',
      category: 'عطور',
      description: 'عطر كلاسيكي من شانيل'
    }
  ]);

  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'إلكترونيات', image: '/placeholder.svg' },
    { id: '2', name: 'موضة', image: '/placeholder.svg' },
    { id: '3', name: 'عطور', image: '/placeholder.svg' },
    { id: '4', name: 'مجوهرات', image: '/placeholder.svg' }
  ]);

  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedAuth = localStorage.getItem('isAuthenticated');
    if (savedUser && savedAuth === 'true') {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // محاكاة تسجيل الدخول
    const savedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const foundUser = savedUsers.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const userAge = calculateAge(foundUser.birthDate);
      if (userAge < 18) {
        alert('عذراً، يجب أن يكون عمرك 18 عاماً أو أكثر للتسجيل');
        return false;
      }
      
      const userToSet = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        birthDate: foundUser.birthDate,
        profileImage: foundUser.profileImage || '/placeholder.svg'
      };
      
      setUser(userToSet);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userToSet));
      localStorage.setItem('isAuthenticated', 'true');
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string, birthDate: string): Promise<boolean> => {
    const age = calculateAge(birthDate);
    if (age < 18) {
      alert('عذراً، يجب أن يكون عمرك 18 عاماً أو أكثر للتسجيل');
      return false;
    }

    const savedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const existingUser = savedUsers.find((u: any) => u.email === email);
    
    if (existingUser) {
      alert('هذا البريد الإلكتروني مسجل مسبقاً');
      return false;
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      birthDate,
      profileImage: '/placeholder.svg'
    };

    savedUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(savedUsers));
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  };

  const adminLogin = (password: string): boolean => {
    if (password === '01278006248') {
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

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Date.now().toString() };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === id ? { ...product, ...updates } : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = { ...category, id: Date.now().toString() };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev =>
      prev.map(category =>
        category.id === id ? { ...category, ...updates } : category
      )
    );
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(category => category.id !== id));
  };

  const updateWelcomeImage = (image: string) => {
    setWelcomeImage(image);
  };

  const updateStoreName = (name: string) => {
    setStoreName(name);
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // تحديث في قائمة المستخدمين المسجلين أيضاً
      const savedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const updatedUsers = savedUsers.map((u: any) =>
        u.id === user.id ? { ...u, ...updates } : u
      );
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    }
  };

  const value: AppContextType = {
    user,
    products,
    categories,
    cart,
    welcomeImage,
    storeName,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    adminLogin,
    adminLogout,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    updateWelcomeImage,
    updateStoreName,
    updateUserProfile
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
