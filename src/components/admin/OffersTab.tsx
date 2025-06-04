
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tag, Edit, Trash2, Percent } from 'lucide-react';

interface Offer {
  id: string;
  product_id: string;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

interface OffersTabProps {
  offers: Offer[];
  products: any[];
  onAddOffer: () => void;
  onEditOffer: (offer: Offer) => void;
  onDeleteOffer: (id: string) => void;
}

const OffersTab = ({
  offers,
  products,
  onAddOffer,
  onEditOffer,
  onDeleteOffer
}: OffersTabProps) => {
  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'منتج محذوف';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">إدارة العروض</h2>
        <Button
          onClick={onAddOffer}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Tag size={16} className="ml-2" />
          إضافة عرض
        </Button>
      </div>

      <div className="grid gap-4">
        {offers.map(offer => (
          <Card key={offer.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                  <Percent className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{getProductName(offer.product_id)}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Badge variant="outline" className="text-orange-600 border-orange-200">
                      خصم {offer.discount_percentage}%
                    </Badge>
                    <Badge variant={offer.is_active ? "default" : "secondary"}>
                      {offer.is_active ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">
                    من {new Date(offer.start_date).toLocaleDateString('ar')} 
                    إلى {new Date(offer.end_date).toLocaleDateString('ar')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => onEditOffer(offer)}
                    size="sm"
                    variant="outline"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    onClick={() => onDeleteOffer(offer.id)}
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

export default OffersTab;
