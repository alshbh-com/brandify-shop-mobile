
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Edit, Trash2 } from 'lucide-react';

interface Rating {
  id: string;
  product_id: string;
  rating: number;
  admin_comment: string | null;
}

interface RatingsTabProps {
  ratings: Rating[];
  products: any[];
  onAddRating: () => void;
  onEditRating: (productId: string) => void;
  onDeleteRating: (productId: string) => void;
}

const RatingsTab = ({
  ratings,
  products,
  onAddRating,
  onEditRating,
  onDeleteRating
}: RatingsTabProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">إدارة التقييمات</h2>
        <Button
          onClick={onAddRating}
          className="bg-yellow-500 hover:bg-yellow-600"
        >
          <Star size={16} className="ml-2" />
          إضافة تقييم
        </Button>
      </div>

      <div className="grid gap-4">
        {ratings.map(rating => {
          const product = products.find(p => p.id === rating.product_id);
          if (!product) return null;
          
          return (
            <Card key={rating.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{product.name}</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < rating.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}
                          />
                        ))}
                        <span className="text-sm text-gray-600 mr-2">{rating.rating}</span>
                      </div>
                    </div>
                    {rating.admin_comment && (
                      <p className="text-sm text-gray-600 mt-1">{rating.admin_comment}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => onEditRating(rating.product_id)}
                      size="sm"
                      variant="outline"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      onClick={() => onDeleteRating(rating.product_id)}
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

export default RatingsTab;
