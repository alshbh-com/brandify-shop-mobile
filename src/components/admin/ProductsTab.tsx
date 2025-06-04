
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Edit, Trash2, Heart, Star } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  category_id: string;
  image: string;
}

interface Rating {
  product_id: string;
  rating: number;
}

interface Favorite {
  product_id: string;
  is_featured: boolean;
}

interface ProductsTabProps {
  products: Product[];
  categories: any[];
  favorites: Favorite[];
  ratings: Rating[];
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onToggleFavorite: (productId: string) => void;
  onEditRating: (productId: string) => void;
}

const ProductsTab = ({
  products,
  categories,
  favorites,
  ratings,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onToggleFavorite,
  onEditRating
}: ProductsTabProps) => {
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'غير محدد';
  };

  const isFavorite = (productId: string) => {
    return favorites.some(f => f.product_id === productId);
  };

  const isFeatured = (productId: string) => {
    return favorites.some(f => f.product_id === productId && f.is_featured);
  };

  const getProductRating = (productId: string) => {
    return ratings.find(r => r.product_id === productId);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">إدارة المنتجات</h2>
        <Button
          onClick={onAddProduct}
          className="bg-green-500 hover:bg-green-600"
        >
          <Plus size={16} className="ml-2" />
          إضافة منتج
        </Button>
      </div>

      <div className="grid gap-4">
        {products.map(product => {
          const productRating = getProductRating(product.id);
          return (
            <Card key={product.id}>
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
                      {isFavorite(product.id) && (
                        <Heart 
                          size={16} 
                          className={`${isFeatured(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
                        />
                      )}
                      {productRating && (
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-yellow-500 fill-current" />
                          <span className="text-sm text-gray-600">{productRating.rating}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{getCategoryName(product.category_id)}</p>
                    <p className="text-blue-600 font-bold">{product.price} ر.س</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      onClick={() => onToggleFavorite(product.id)}
                      size="sm"
                      variant={isFavorite(product.id) ? "default" : "outline"}
                      className="text-xs"
                    >
                      <Heart size={14} />
                    </Button>
                    <Button
                      onClick={() => onEditRating(product.id)}
                      size="sm"
                      variant="outline"
                      className="text-xs"
                    >
                      <Star size={14} />
                    </Button>
                    <Button
                      onClick={() => onEditProduct(product)}
                      size="sm"
                      variant="outline"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      onClick={() => onDeleteProduct(product.id)}
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

export default ProductsTab;
