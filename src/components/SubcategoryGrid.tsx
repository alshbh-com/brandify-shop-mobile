
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Users } from 'lucide-react';

interface Subcategory {
  id: string;
  name: string;
  description: string;
  logo: string;
  banner_image: string;
  category_id: string;
  merchant_id: string;
}

interface SubcategoryGridProps {
  subcategories: Subcategory[];
  onSubcategorySelect: (subcategoryId: string) => void;
}

const SubcategoryGrid = ({ subcategories, onSubcategorySelect }: SubcategoryGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {subcategories.map((subcategory) => (
        <Card 
          key={subcategory.id} 
          className="group cursor-pointer overflow-hidden rounded-3xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2"
          onClick={() => onSubcategorySelect(subcategory.id)}
        >
          <div className="relative">
            <div className="aspect-[16/9] relative overflow-hidden">
              <img
                src={subcategory.banner_image}
                alt={subcategory.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              
              {/* Logo */}
              <div className="absolute bottom-4 right-4">
                <div className="w-16 h-16 bg-white rounded-full p-2 shadow-lg">
                  <img
                    src={subcategory.logo}
                    alt={`${subcategory.name} logo`}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              
              {/* Featured Badge */}
              <div className="absolute top-4 right-4">
                <Badge className="bg-gradient-to-r from-orange-400 to-red-500 text-white border-0 shadow-lg">
                  <Star className="w-3 h-3 mr-1" />
                  مميز
                </Badge>
              </div>
            </div>
          </div>
          
          <CardContent className="p-6">
            <div className="space-y-3">
              <div>
                <h3 className="font-bold text-xl mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">
                  {subcategory.name}
                </h3>
                {subcategory.description && (
                  <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                    {subcategory.description}
                  </p>
                )}
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">متوفر للتوصيل</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-500">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">عدة منتجات</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SubcategoryGrid;
