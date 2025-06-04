
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, Trash2 } from 'lucide-react';

interface Favorite {
  id: string;
  product_id: string;
  is_featured: boolean;
}

interface FavoritesTabProps {
  favorites: Favorite[];
  products: any[];
  categories: any[];
  onToggleFeatured: (productId: string) => void;
  onToggleFavorite: (productId: string) => void;
}

const FavoritesTab = ({
  favorites,
  products,
  categories,
  onToggleFeatured,
  onToggleFavorite
}: FavoritesTabProps) => {
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'غير محدد';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">إدارة المفضلة</h2>
      </div>

      <div className="grid gap-4">
        {favorites.map(favorite => {
          const product = products.find(p => p.id === favorite.product_id);
          if (!product) return null;
          
          return (
            <Card key={favorite.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{product.name}</h3>
                      <Heart 
                        size={16} 
                        className={`${favorite.is_featured ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
                      />
                    </div>
                    <p className="text-sm text-gray-500">{getCategoryName(product.category_id)}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={favorite.is_featured ? "default" : "secondary"}>
                        {favorite.is_featured ? 'مميز' : 'عادي'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => onToggleFeatured(favorite.product_id)}
                      size="sm"
                      variant={favorite.is_featured ? "default" : "outline"}
                    >
                      <Star size={16} />
                    </Button>
                    <Button
                      onClick={() => onToggleFavorite(favorite.product_id)}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FavoritesTab;
