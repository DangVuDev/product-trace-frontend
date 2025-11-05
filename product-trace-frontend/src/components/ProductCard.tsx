// src/components/ProductCard.tsx
import { Link } from 'react-router-dom';
import { MapPin, Box, Truck, CheckCircle } from 'lucide-react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const getStatusIcon = (status: string) => {
    if (status.includes('Đóng gói')) return <Box className="w-4 h-4" />;
    if (status.includes('vận chuyển')) return <Truck className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  const getStatusColor = (status: string) => {
    if (status.includes('Đóng gói')) return 'bg-blue-100 text-blue-700';
    if (status.includes('vận chuyển')) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  return (
    <Link to={`/product/${product.productId}`} className="block group">
      <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
        <div className="relative overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-medium">
            #{product.productId}
          </div>
        </div>
        
        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
          
          <p className="text-sm text-gray-600 flex items-center gap-1.5 mb-3">
            <MapPin className="w-3.5 h-3.5" />
            {product.manufacturer}
          </p>

          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(product.currentStatus.status)}`}>
            {getStatusIcon(product.currentStatus.status)}
            {product.currentStatus.status}
          </div>
        </div>
      </div>
    </Link>
  );
}