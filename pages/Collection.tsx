import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Filter, Loader } from 'lucide-react';
import { api } from '../api';

interface CollectionProps {
  category: 'Men' | 'Women';
  selectProduct: (product: Product) => void;
}

export const Collection: React.FC<CollectionProps> = ({ category, selectProduct }) => {
  const [activeSubCat, setActiveSubCat] = useState<string>('All');
  const [activeColor, setActiveColor] = useState<string>('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.getProducts();
        
        if (response.success) {
          // Filter by category
          const filteredProducts = response.products.filter(p => p.category === category);
          setProducts(filteredProducts);
        } else {
          setError('Failed to load products');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Network error. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  // Get unique subcategories
  const subCategories = React.useMemo(() => {
    const subs = products.map(p => p.subCategory).filter(Boolean);
    return ['All', ...Array.from(new Set(subs))];
  }, [products]);

  // Get unique colors from the colors array
  const colors = React.useMemo(() => {
    const allColors = products.flatMap(p => p.colors?.map(c => c.name) || []);
    return ['All', ...Array.from(new Set(allColors))];
  }, [products]);

  // Filter products based on selected filters
  const filteredProducts = products.filter(p => {
    const matchSub = activeSubCat === 'All' || p.subCategory === activeSubCat;
    const matchColor = activeColor === 'All' || (p.colors && p.colors.some(c => c.name === activeColor));
    return matchSub && matchColor;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto text-gray-400" />
          <p className="mt-4 text-gray-500">Loading {category}'s collection...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="text-black underline underline-offset-4"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white animate-fade-in pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-serif font-bold text-black mb-4">{category}'s Collection</h1>
          <p className="text-gray-500">
            {products.length > 0 
              ? `Discover ${products.length} premium linen essentials tailored for ${category === 'Men' ? 'him' : 'her'}.`
              : 'No products available at the moment.'
            }
          </p>
        </div>

        {/* Filters - Only show if we have products */}
        {products.length > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-gray-100 pb-6 gap-4">
            <div className="flex items-center space-x-2 text-gray-500 mb-2 md:mb-0">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium uppercase tracking-wide">Filter By:</span>
            </div>

            <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
              {/* Category Filter */}
              {subCategories.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {subCategories.map(sub => (
                    <button
                      key={sub}
                      onClick={() => setActiveSubCat(sub)}
                      className={`px-4 py-2 text-sm rounded-full transition-all duration-300 ${
                        activeSubCat === sub ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}
              
              {subCategories.length > 1 && colors.length > 1 && (
                <div className="h-6 w-px bg-gray-300 hidden md:block"></div>
              )}

              {/* Color Filter */}
              {colors.length > 1 && (
                <select 
                  value={activeColor}
                  onChange={(e) => setActiveColor(e.target.value)}
                  className="bg-transparent text-sm border-none focus:ring-0 cursor-pointer text-gray-600 font-medium hover:text-black"
                >
                  <option value="All">All Colors</option>
                  {colors.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        )}

        {/* Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product._id} product={product} onClick={selectProduct} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            {products.length === 0 ? (
              <p className="text-gray-500 text-lg">No products available in this category.</p>
            ) : (
              <>
                <p className="text-gray-500 text-lg">No products found matching your filters.</p>
                <button 
                  onClick={() => { setActiveSubCat('All'); setActiveColor('All'); }}
                  className="mt-4 text-black underline underline-offset-4"
                >
                  Clear Filters
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};