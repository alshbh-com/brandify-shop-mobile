
import React from 'react';
import { Store, Package, Tag, Heart, Star, Percent, Users, Settings, CheckCircle, BarChart3 } from 'lucide-react';

interface AdminNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AdminNavigation = ({ activeTab, onTabChange }: AdminNavigationProps) => {
  const tabs = [
    { id: 'store', label: 'إعدادات المتجر', icon: Store },
    { id: 'themes', label: 'الثيمات', icon: Settings },
    { id: 'analytics', label: 'الإحصائيات', icon: BarChart3 },
    { id: 'products', label: 'المنتجات', icon: Package },
    { id: 'categories', label: 'الأقسام', icon: Tag },
    { id: 'offers', label: 'العروض', icon: Percent },
    { id: 'favorites', label: 'المفضلة', icon: Heart },
    { id: 'ratings', label: 'التقييمات', icon: Star },
    { id: 'coupons', label: 'الكوبونات', icon: Percent },
    { id: 'approvals', label: 'طلبات الموافقة', icon: CheckCircle },
    { id: 'referrals', label: 'نظام الإحالة', icon: Users },
    { id: 'users', label: 'المستخدمين', icon: Users }
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-4">
      <div className="flex space-x-4 space-x-reverse overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-3 px-4 border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AdminNavigation;
