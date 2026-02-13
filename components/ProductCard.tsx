import React, { useState } from 'react';
import { Product } from '../types';
import { ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Use images array from backend
  const getDisplayImage = () => {
    if (isHovered && product.images && product.images.length > 1) {
      return product.images[1]; // Second image on hover
    }
    return product.images?.[0] || product.image || ''; // First image or fallback
  };

  const displayImage = getDisplayImage();

  return (
    <div 
      className="group cursor-pointer flex flex-col h-full"
      onClick={() => onClick(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden bg-gray-100 aspect-[3/4] mb-4">
        {displayImage ? (
          <img 
            src={displayImage} 
            alt={product.name} 
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-image.jpg';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
        
        {product.isNew && (
          <span className="absolute top-2 left-2 bg-black text-white text-[10px] uppercase font-bold px-2 py-1 tracking-wider z-10">
            New Arrival
          </span>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Quick Action */}
        <button className="absolute bottom-0 left-0 right-0 bg-white text-black py-4 text-sm font-bold uppercase tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center space-x-2 border-t border-gray-100">
           <ShoppingBag className="w-4 h-4" />
           <span>View Details</span>
        </button>
      </div>
      
      <div className="flex-1 flex flex-col text-center group-hover:-translate-y-1 transition-transform duration-300">
        <h3 className="text-sm font-medium text-gray-900 group-hover:text-black transition-colors font-serif text-lg">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">{product.subCategory}</p>
        <p className="mt-2 text-sm font-bold text-gray-900">Rs. {product.price.toLocaleString()}</p>
      </div>
    </div>
  );
};