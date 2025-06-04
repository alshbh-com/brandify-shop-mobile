
import React from 'react';
import { Button } from '@/components/ui/button';

interface AdminHeaderProps {
  onLogout: () => void;
}

const AdminHeader = ({ onLogout }: AdminHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">لوحة الإدارة</h1>
        <Button
          onClick={onLogout}
          variant="ghost"
          className="text-white hover:bg-white/20"
        >
          خروج
        </Button>
      </div>
    </div>
  );
};

export default AdminHeader;
