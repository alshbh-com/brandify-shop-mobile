
import React from 'react';

interface AdminNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AdminNavigation = ({ activeTab, onTabChange }: AdminNavigationProps) => {
  const tabs = [
    { id: 'store', label: 'إعدادات المتجر' },
    { id: 'themes', label: 'التصميمات' },
    { id: 'products', label: 'المنتجات' },
    { id: 'categories', label: 'الأقسام' },
    { id: 'offers', label: 'العروض' },
    { id: 'favorites', label: 'المفضلة' },
    { id: 'ratings', label: 'التقييمات' }
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-4">
      <div className="flex space-x-4 space-x-reverse overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminNavigation;
