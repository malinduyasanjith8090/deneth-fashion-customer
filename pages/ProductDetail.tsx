import React, { useState, useEffect, useRef } from 'react';
import { Product, ViewState } from '../types';
import { useCart } from '../context/CartContext';
import { 
  ArrowLeft, Minus, Plus, ShoppingBag, Ruler, X, ShieldCheck, 
  ChevronDown, Youtube, Volume2, VolumeX, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { api } from '../api';
import { Toast } from '../components/Toast';

interface ProductDetailProps {
  product: Product;
  goBack: () => void;
  selectProduct: (product: Product) => void;
  changeView: (view: ViewState) => void;
}

// YouTube Video Component with Shorts & Auto-play Support
const YouTubeVideo: React.FC<{ url: string; isActive: boolean }> = ({ url, isActive }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<HTMLIFrameElement>(null);
  
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const shortsRegExp = /^.*(youtube.com\/shorts\/)([^#&?]*).*/;
    
    let match = url.match(shortsRegExp);
    if (match && match[2]) {
      return { id: match[2], isShort: true };
    }
    
    match = url.match(regExp);
    if (match && match[2] && match[2].length === 11) {
      return { id: match[2], isShort: false };
    }
    
    return null;
  };

  const videoInfo = getYouTubeId(url);
  
  if (!videoInfo) return null;

  const { id, isShort } = videoInfo;
  
  const embedUrl = `https://www.youtube.com/embed/${id}?autoplay=${isActive ? 1 : 0}&mute=1&loop=1&playlist=${id}&rel=0&modestbranding=1`;

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (playerRef.current) {
      playerRef.current.contentWindow?.postMessage(
        JSON.stringify({
          event: 'command',
          func: isMuted ? 'unMute' : 'mute',
        }),
        '*'
      );
    }
  };

  useEffect(() => {
    if (isActive) {
      setIsPlaying(true);
    }
  }, [isActive]);

  return (
    <div className="relative w-full h-full">
      <iframe
        ref={playerRef}
        src={embedUrl}
        title="Product Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full"
      />
      
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
        <div className="bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
          <Youtube className="w-3 h-3" />
          <span>{isShort ? 'Short' : 'Video'}</span>
        </div>
        
        <button
          onClick={toggleMute}
          className="bg-black/80 text-white p-1.5 rounded-full hover:bg-black transition-colors"
        >
          {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
        </button>
      </div>
      
      {isActive && !isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
            Playing
          </div>
        </div>
      )}
    </div>
  );
};

// Collapsible Accordion Component
const AccordionItem = ({ title, content, isOpen, onClick }: { title: string; content: string; isOpen: boolean; onClick: () => void }) => {
  return (
    <div className="border-b border-gray-100">
      <button 
        onClick={onClick}
        className="w-full py-4 flex justify-between items-center text-left focus:outline-none group"
      >
        <span className={`text-sm font-bold uppercase tracking-wider transition-colors ${isOpen ? 'text-black' : 'text-gray-500 group-hover:text-black'}`}>
          {title}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-black' : ''}`} />
      </button>
      <div 
        className={`overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out ${isOpen ? 'max-h-48 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-sm text-gray-600 leading-relaxed pr-4">
          {content}
        </p>
      </div>
    </div>
  );
};

// Image Carousel Component for Mobile
const ImageCarousel: React.FC<{
  images: string[];
  videoUrl?: string;
  activeMedia: { type: 'image' | 'video'; src: string };
  onImageClick: (img: string) => void;
  onVideoClick: () => void;
}> = ({ images, videoUrl, activeMedia, onImageClick, onVideoClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  // Create media array (images + video)
  const mediaItems = [
    ...images.map(img => ({ type: 'image' as const, src: img })),
    ...(videoUrl ? [{ type: 'video' as const, src: videoUrl }] : [])
  ];

  useEffect(() => {
    // Find current index based on active media
    const index = mediaItems.findIndex(item => 
      item.type === activeMedia.type && item.src === activeMedia.src
    );
    if (index !== -1) {
      setCurrentIndex(index);
    }
  }, [activeMedia, mediaItems]);

  const handlePrev = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : mediaItems.length - 1;
    setCurrentIndex(newIndex);
    const item = mediaItems[newIndex];
    if (item.type === 'image') {
      onImageClick(item.src);
    } else {
      onVideoClick();
    }
  };

  const handleNext = () => {
    const newIndex = currentIndex < mediaItems.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    const item = mediaItems[newIndex];
    if (item.type === 'image') {
      onImageClick(item.src);
    } else {
      onVideoClick();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left
      handleNext();
    }
    if (touchStart - touchEnd < -75) {
      // Swipe right
      handlePrev();
    }
  };

  return (
    <div className="relative w-full">
      {/* Main Media Display */}
      <div 
        className="aspect-[3/4] bg-gray-100 overflow-hidden relative group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {activeMedia.type === 'video' ? (
          <YouTubeVideo url={activeMedia.src} isActive={true} />
        ) : (
          <img 
            src={activeMedia.src} 
            alt="Product" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-image.jpg';
            }}
          />
        )}
        
        {/* Slide Counter - Mobile & Desktop */}
        <div className="absolute top-4 right-4 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm z-10">
          {currentIndex + 1} / {mediaItems.length}
        </div>
      </div>

      {/* Navigation Arrows - Desktop Only */}
      <button
        onClick={handlePrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black p-2 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:block"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <button
        onClick={handleNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black p-2 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:block"
        aria-label="Next image"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots Indicator - Mobile & Desktop */}
      <div className="flex justify-center gap-1.5 mt-4 md:hidden">
        {mediaItems.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              const item = mediaItems[index];
              if (item.type === 'image') {
                onImageClick(item.src);
              } else {
                onVideoClick();
              }
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentIndex === index 
                ? 'bg-black w-6' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product, 
  goBack, 
  selectProduct, 
  changeView 
}) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<{ name: string; image: string } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [activeMedia, setActiveMedia] = useState<{ type: 'image' | 'video'; src: string }>({ type: 'image', src: '' });
  
  // Accordion State
  const [openSection, setOpenSection] = useState<string | null>('fabric');

  useEffect(() => {
    if (product) {
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
      
      if (product.images && product.images.length > 0) {
        setActiveMedia({ type: 'image', src: product.images[0] });
      }
      
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
    }
  }, [product]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoadingRelated(true);
        const response = await api.getProducts();
        if (response.success) {
          const related = response.products
            .filter(p => p._id !== product._id && p.category === product.category)
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchRelatedProducts();
  }, [product]);

  const handleColorChange = (color: { name: string; image: string }) => {
    setSelectedColor(color);
    setActiveMedia({ type: 'image', src: color.image });
  };

  const handleImageClick = (img: string) => {
    setActiveMedia({ type: 'image', src: img });
  };

  const handleVideoClick = () => {
    if (product.videoUrl) {
      setActiveMedia({ type: 'video', src: product.videoUrl });
    }
  };

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      setShowToast(true);
      return;
    }
    
    setIsAdding(true);
    setTimeout(() => {
      addToCart(product, selectedSize, selectedColor.name, quantity);
      setIsAdding(false);
      setShowToast(true);
    }, 600);
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const isOutOfStock = !product.inStock || product.stockQuantity === 0;

  if (!product) return null;

  return (
    <div className="bg-white min-h-screen animate-fade-in pt-4 md:pt-8 pb-20 relative">
      <Toast 
        message={`${product.name} added to bag`} 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button 
          onClick={goBack}
          className="flex items-center text-sm text-gray-500 hover:text-black mb-4 md:mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Collection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery - With Carousel for Mobile */}
          <div className="space-y-4">
            {/* Image Carousel - Works on all devices, optimized for mobile */}
            <ImageCarousel
              images={product.images || []}
              videoUrl={product.videoUrl}
              activeMedia={activeMedia}
              onImageClick={handleImageClick}
              onVideoClick={handleVideoClick}
            />
            
            {/* Desktop Thumbnails - Hidden on mobile */}
            <div className="hidden md:grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-2">
              {/* Image Thumbnails */}
              {product.images && product.images.map((img, idx) => (
                <button 
                  key={`img-${idx}`}
                  onClick={() => handleImageClick(img)}
                  className={`relative aspect-square bg-gray-100 overflow-hidden border-2 transition-all duration-300 rounded-md ${
                    activeMedia.type === 'image' && activeMedia.src === img
                      ? 'border-black opacity-100 scale-105 shadow-lg' 
                      : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-400'
                  }`}
                  title={`View ${idx + 1}`}
                >
                  <img 
                    src={img} 
                    alt={`View ${idx + 1}`} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-image.jpg';
                    }}
                  />
                  {idx === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] py-1 text-center truncate">
                      Cover
                    </div>
                  )}
                </button>
              ))}
              
              {/* Video Thumbnail - Desktop */}
              {product.videoUrl && (
                <button 
                  onClick={handleVideoClick}
                  className={`relative aspect-square bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden border-2 transition-all duration-300 rounded-md ${
                    activeMedia.type === 'video'
                      ? 'border-black opacity-100 scale-105 shadow-lg' 
                      : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-400'
                  }`}
                  title="Watch Video"
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 animate-ping bg-red-500/30 rounded-full"></div>
                      <Youtube className="w-8 h-8 text-red-600 relative z-10" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] py-1 text-center truncate">
                    Video
                  </div>
                </button>
              )}
            </div>

            
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-4 md:mb-6">
              <span className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase">
                {product.category} / {product.subCategory}
              </span>
              <h1 className="text-2xl md:text-3xl lg:text-5xl font-serif font-bold text-gray-900 mt-2 md:mt-3 mb-2 md:mb-4 leading-tight">
                {product.name}
              </h1>
              <p className="text-xl md:text-2xl font-medium text-gray-900">
                Rs. {product.price.toLocaleString()}
              </p>
              {isOutOfStock && (
                <p className="text-red-500 text-sm mt-2 font-medium">Out of Stock</p>
              )}
            </div>
            
            <p className="text-gray-600 leading-relaxed text-sm md:text-base mb-6 md:mb-8">
              {product.description}
            </p>

            <div className="space-y-6 md:space-y-8 border-t border-b border-gray-100 py-6 md:py-8 mb-6 md:mb-8">
              {/* Colors - Color selection buttons */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <span className="block text-sm font-bold text-gray-900 mb-2 md:mb-3 uppercase tracking-wide">
                    Color: <span className="text-gray-500 font-normal capitalize">{selectedColor?.name || 'Select'}</span>
                  </span>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => handleColorChange(color)}
                        className={`group relative w-14 h-14 md:w-16 md:h-16 border-2 rounded-md overflow-hidden transition-all duration-200 ${
                          selectedColor?.name === color.name 
                            ? 'border-black scale-110 shadow-lg' 
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                        title={color.name}
                      >
                        <img 
                          src={color.image} 
                          alt={color.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-image.jpg';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-2 md:mb-3">
                    <span className="block text-sm font-bold text-gray-900 uppercase tracking-wide">
                      Size: <span className="text-gray-500 font-normal">{selectedSize || 'Select'}</span>
                    </span>
                    <button 
                      onClick={() => setShowSizeChart(true)}
                      className="flex items-center text-xs font-bold uppercase tracking-wider underline underline-offset-4 text-gray-500 hover:text-black transition-colors"
                    >
                      <Ruler className="w-3 h-3 mr-1" />
                      Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border text-xs md:text-sm font-medium transition-all duration-200 ${
                          selectedSize === size 
                            ? 'border-black bg-black text-white shadow-md transform -translate-y-0.5' 
                            : 'border-gray-200 text-gray-600 hover:border-black'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <span className="block text-sm font-bold text-gray-900 mb-2 md:mb-3 uppercase tracking-wide">Quantity</span>
                <div className="flex items-center border border-gray-200 w-28 md:w-32 bg-white">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={isOutOfStock}
                    className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-gray-500 hover:text-black transition-colors disabled:opacity-50"
                  >
                    <Minus className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
                  <span className="flex-1 text-center font-bold text-sm md:text-base">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={isOutOfStock}
                    className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-gray-500 hover:text-black transition-colors disabled:opacity-50"
                  >
                    <Plus className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
                </div>
                {product.stockQuantity > 0 && product.stockQuantity < 10 && (
                  <p className="text-xs md:text-sm text-yellow-600 mt-2">Only {product.stockQuantity} left in stock!</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 md:gap-8">
              <button
                onClick={handleAddToCart}
                disabled={isAdding || isOutOfStock || !selectedColor || !selectedSize}
                className={`w-full py-3 md:py-4 px-6 md:px-8 flex items-center justify-center text-white font-bold tracking-widest uppercase transition-all duration-300 shadow-lg text-sm md:text-base ${
                  isAdding ? 'bg-green-600 scale-[0.98]' : 
                  isOutOfStock ? 'bg-gray-400 cursor-not-allowed' :
                  'bg-black hover:bg-gray-800 hover:-translate-y-1'
                }`}
              >
                {isAdding ? (
                   <span className="flex items-center">
                     <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 mr-2" /> 
                     Added to Cart
                   </span>
                ) : isOutOfStock ? (
                   "Out of Stock"
                ) : (
                   <>
                     <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                     Add to Cart
                   </>
                )}
              </button>
              
              {/* Animated Accordion Sections */}
              <div className="border-t border-gray-100">
                <AccordionItem 
                   title="Fabric & Care" 
                   content="100% Premium Linen. Machine wash cold with like colors. Tumble dry low or hang dry. Warm iron if needed."
                   isOpen={openSection === 'fabric'}
                   onClick={() => toggleSection('fabric')}
                />
                <AccordionItem 
                   title="Shipping & Returns" 
                   content="We offer islandwide delivery. Standard shipping takes 2-3 business days. Easy returns within 7 days of purchase if the item is unworn."
                   isOpen={openSection === 'shipping'}
                   onClick={() => toggleSection('shipping')}
                />
                <AccordionItem 
                   title="Sustainability" 
                   content="Our linen is sourced from sustainable farms that use less water and fewer pesticides than traditional cotton."
                   isOpen={openSection === 'sustainability'}
                   onClick={() => toggleSection('sustainability')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 md:mt-24 border-t border-gray-100 pt-12 md:pt-16">
            <h3 className="text-xl md:text-2xl font-serif font-bold mb-6 md:mb-8">You May Also Like</h3>
            {loadingRelated ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                {relatedProducts.map(p => (
                  <ProductCard key={p._id} product={p} onClick={selectProduct} />
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-white max-w-lg w-full p-6 md:p-8 relative shadow-2xl rounded-sm transform scale-100 transition-transform my-8">
            <button 
              onClick={() => setShowSizeChart(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-6">
               <h3 className="font-serif font-bold text-2xl uppercase">Size Chart</h3>
               <p className="text-gray-500 text-sm mt-1">Deneth Fashion Standard Fit</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="py-3 px-4 text-sm font-bold uppercase tracking-wider border border-black">Size</th>
                    <th className="py-3 px-4 text-sm font-bold uppercase tracking-wider border border-black">Length</th>
                    <th className="py-3 px-4 text-sm font-bold uppercase tracking-wider border border-black">Waist</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 border border-gray-200 font-bold">S</td>
                    <td className="py-3 px-4 border border-gray-200">36"</td>
                    <td className="py-3 px-4 border border-gray-200">26-28</td>
                  </tr>
                  <tr className="bg-gray-50 hover:bg-gray-100 transition-colors">
                    <td className="py-3 px-4 border border-gray-200 font-bold">M</td>
                    <td className="py-3 px-4 border border-gray-200">38"</td>
                    <td className="py-3 px-4 border border-gray-200">29-31</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 border border-gray-200 font-bold">L</td>
                    <td className="py-3 px-4 border border-gray-200">39"</td>
                    <td className="py-3 px-4 border border-gray-200">32-35</td>
                  </tr>
                  <tr className="bg-gray-50 hover:bg-gray-100 transition-colors">
                    <td className="py-3 px-4 border border-gray-200 font-bold">XL</td>
                    <td className="py-3 px-4 border border-gray-200">40"</td>
                    <td className="py-3 px-4 border border-gray-200">36-38</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <p className="text-xs text-center text-gray-400 mt-6">
              *Measurements are in inches. Allow for minor variations in production.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};