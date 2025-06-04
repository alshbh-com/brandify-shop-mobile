
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  image: string;
}

interface CategoriesTabProps {
  categories: Category[];
  onAddCategory: () => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
}

const CategoriesTab = ({
  categories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory
}: CategoriesTabProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">إدارة الأقسام</h2>
        <Button
          onClick={onAddCategory}
          className="bg-green-500 hover:bg-green-600"
        >
          <Plus size={16} className="ml-2" />
          إضافة قسم
        </Button>
      </div>

      <div className="grid gap-4">
        {categories.map(category => (
          <Card key={category.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{category.name}</h3>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => onEditCategory(category)}
                    size="sm"
                    variant="outline"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    onClick={() => onDeleteCategory(category.id)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategoriesTab;
