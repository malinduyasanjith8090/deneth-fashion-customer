import React, { useState, useEffect, useRef } from 'react';
import { Product, ViewState } from '../types';
import { ProductCard } from '../components/ProductCard';
import { ArrowRight, ChevronLeft, ChevronRight, Truck, Star, Shield, Loader } from 'lucide-react';
import { api } from '../api';

interface HomeProps {
  changeView: (view: ViewState) => void;
  selectProduct: (product: Product) => void;
}

const HERO_SLIDES = [
  {
    id: 1,
    image: "https://hips.hearstapps.com/hmg-prod/images/linen-banner-680f91f444f70.png",
    title: "Premium Linen Pants",
    subtitle: "For Men & Women",
    desc: "Elevate Your Comfort. Sustainable Linen, Modern Style."
  },
  {
    id: 2,
    image: "https://livelinen.com/cdn/shop/articles/what-to-wear-with-linen-pants_f99d7573-33ab-4534-9872-bb810f9c7347.jpg?v=1743508029",
    title: "Summer Essentials",
    subtitle: "New Arrivals",
    desc: "Lightweight, breathable, and perfectly tailored for the season."
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=2000&auto=format&fit=crop",
    title: "Timeless Elegance",
    subtitle: "Classic Cuts",
    desc: "Discover the versatility of our signature linen collection."
  }
];

// Hook for scroll animation
const useOnScreen = (options: IntersectionObserverInit) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect(); // Only animate once
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref, options]);

  return [ref, isVisible] as const;
};

const FadeInSection = ({ children }: { children: React.ReactNode }) => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });

  return (
    <div ref={ref} className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {children}
    </div>
  );
};

export const Home: React.FC<HomeProps> = ({ changeView, selectProduct }) => {
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [loadingBestsellers, setLoadingBestsellers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Fetch bestsellers from backend
  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        setLoadingBestsellers(true);
        setError(null);
        const response = await api.getProducts();
        
        if (response.success) {
          // Get first 4 products as bestsellers
          // You can modify this logic based on your needs
          const best = response.products
            .filter(p => p.inStock) // Only in-stock products
            .slice(0, 4);
          setBestsellers(best);
        } else {
          setError('Failed to load products');
        }
      } catch (err) {
        console.error('Error fetching bestsellers:', err);
        setError('Network error. Please check your connection.');
      } finally {
        setLoadingBestsellers(false);
      }
    };

    fetchBestsellers();
  }, []);

  // Auto-slide effect with animation
  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
        setIsAnimating(false);
      }, 800); // Wait for animation to complete
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
      setIsAnimating(false);
    }, 800);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
      setIsAnimating(false);
    }, 800);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsAnimating(false);
    }, 800);
  };

  return (
    <div className="animate-fade-in overflow-x-hidden">
      {/* Auto-scrolling Marquee */}
      <div className="bg-black text-white text-xs py-2 overflow-hidden whitespace-nowrap relative z-40">
        <div className="animate-marquee inline-block">
          <span className="mx-8">COLOMBO 1-15 DELIVERY Rs. 250</span>
          <span className="mx-8">•</span>
          <span className="mx-8">ISLANDWIDE DELIVERY AVAILABLE</span>
          <span className="mx-8">•</span>
          <span className="mx-8">PREMIUM QUALITY LINEN GUARANTEED</span>
          <span className="mx-8">•</span>
          <span className="mx-8">CASH ON DELIVERY ACCEPTED</span>
          <span className="mx-8">•</span>
          <span className="mx-8">NEW ARRIVALS EVERY WEEK</span>
          <span className="mx-8">•</span>
          <span className="mx-8">COLOMBO 1-15 DELIVERY Rs. 250</span>
          <span className="mx-8">•</span>
          <span className="mx-8">ISLANDWIDE DELIVERY AVAILABLE</span>
          <span className="mx-8">•</span>
          <span className="mx-8">PREMIUM QUALITY LINEN GUARANTEED</span>
          <span className="mx-8">•</span>
          <span className="mx-8">CASH ON DELIVERY ACCEPTED</span>
        </div>
      </div>

      {/* Hero Section Slider - WITH smooth animations */}
      <section className="relative h-[85vh] bg-gray-100 overflow-hidden group">
        {HERO_SLIDES.map((slide, index) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-105'
            }`}
          >
            {/* Simple overlay */}
            <div className="absolute inset-0 bg-black/20 z-10 transition-opacity duration-1000" />
            
            {/* Image with smooth zoom animation */}
            <div className="absolute inset-0 overflow-hidden">
              <img 
                src={slide.image} 
                alt={slide.title} 
                className={`w-full h-full object-cover object-center transition-all duration-1000 ease-in-out ${
                  index === currentSlide 
                    ? 'scale-110' 
                    : 'scale-100'
                }`}
              />
            </div>
            
            {/* Text content */}
            <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4">
              <span className={`text-white text-sm md:text-base font-bold tracking-[0.3em] uppercase mb-4 transition-all duration-1000 ease-out delay-300 transform ${
                index === currentSlide 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}>
                {slide.subtitle}
              </span>
              <h1 className={`text-4xl md:text-7xl font-serif font-bold text-white mb-6 drop-shadow-lg transition-all duration-1000 ease-out delay-500 transform ${
                index === currentSlide 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-12'
              }`}>
                {slide.title}
              </h1>
              <p className={`text-white text-lg md:text-xl mb-10 max-w-xl mx-auto font-light drop-shadow-md transition-all duration-1000 ease-out delay-700 transform ${
                index === currentSlide 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-12'
              }`}>
                {slide.desc}
              </p>
              
              <div className={`flex space-x-4 transition-all duration-1000 ease-out delay-700 transform ${
                index === currentSlide 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-12'
              }`}>
                <button 
                  onClick={() => changeView('WOMEN')}
                  className="bg-white text-black px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300 shadow-xl hover:scale-105"
                >
                  Shop Women
                </button>
                <button 
                  onClick={() => changeView('MEN')}
                  className="bg-transparent border-2 border-white text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 hover:scale-105"
                >
                  Shop Men
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Slider Controls */}
        <button 
          onClick={prevSlide} 
          disabled={isAnimating}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button 
          onClick={nextSlide} 
          disabled={isAnimating}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
        
        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isAnimating || index === currentSlide}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 hover:bg-white/80'
              } ${isAnimating ? 'cursor-not-allowed' : ''}`}
            />
          ))}
        </div>
      </section>

      {/* Features Banner */}
      <section className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
                <div className="flex flex-col items-center p-4">
                    <Truck className="w-8 h-8 text-black mb-3" />
                    <h3 className="font-bold uppercase tracking-wider text-sm mb-1">Fast Delivery</h3>
                    <p className="text-gray-500 text-xs">Reliable shipping across Sri Lanka</p>
                </div>
                <div className="flex flex-col items-center p-4">
                    <Shield className="w-8 h-8 text-black mb-3" />
                    <h3 className="font-bold uppercase tracking-wider text-sm mb-1">Secure Checkout</h3>
                    <p className="text-gray-500 text-xs">Safe payment via Bank Transfer & Cash</p>
                </div>
                <div className="flex flex-col items-center p-4">
                    <Star className="w-8 h-8 text-black mb-3" />
                    <h3 className="font-bold uppercase tracking-wider text-sm mb-1">Premium Quality</h3>
                    <p className="text-gray-500 text-xs">Hand-picked linen fabrics</p>
                </div>
            </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-white">
        <FadeInSection>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div 
                onClick={() => changeView('WOMEN')}
                className="group relative h-[500px] overflow-hidden cursor-pointer"
              >
                <img 
                  src="https://luxmii.com/cdn/shop/articles/How-To-Wear-Linen-Pants-For-Work-That-Guarantee-An-Impression-Luxmii-31524263.jpg?v=1743004829&width=2048" 
                  alt="Women" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="absolute inset-0 flex flex-col justify-end items-center pb-12 text-white">
                  <h2 className="text-4xl font-serif font-bold mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">Women's</h2>
                  <span className="text-sm font-bold uppercase tracking-widest bg-white text-black px-6 py-3 hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 duration-500">
                    View Collection
                  </span>
                </div>
              </div>

              <div 
                onClick={() => changeView('MEN')}
                className="group relative h-[500px] overflow-hidden cursor-pointer"
              >
                <img 
                  src="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=1000&auto=format&fit=crop" 
                  alt="Men" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="absolute inset-0 flex flex-col justify-end items-center pb-12 text-white">
                  <h2 className="text-4xl font-serif font-bold mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">Men's</h2>
                  <span className="text-sm font-bold uppercase tracking-widest bg-white text-black px-6 py-3 hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 duration-500">
                    View Collection
                  </span>
                </div>
              </div>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* Featured Products - Bestsellers from Backend */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="text-center mb-16">
              <span className="text-sm text-gray-500 font-bold tracking-[0.2em] uppercase mb-2 block">Don't Miss Out</span>
              <h2 className="text-4xl font-serif font-bold mb-4">Our Bestsellers</h2>
              <div className="w-20 h-1 bg-black mx-auto mt-6"></div>
            </div>
          </FadeInSection>
          
          {loadingBestsellers ? (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <Loader className="w-10 h-10 animate-spin mx-auto text-gray-400" />
                <p className="mt-4 text-gray-500">Loading bestsellers...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="text-black underline underline-offset-4"
              >
                Retry
              </button>
            </div>
          ) : bestsellers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {bestsellers.map((product, idx) => (
                <div key={product._id} className={`animate-fade-in-up delay-${(idx + 1) * 100}`}>
                  <ProductCard product={product} onClick={selectProduct} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No products available at the moment.</p>
            </div>
          )}

          <div className="mt-20 text-center">
            <button 
              onClick={() => changeView('WOMEN')}
              className="group inline-flex items-center space-x-2 text-black font-semibold hover:text-gray-600 transition-colors border-b-2 border-black pb-2 hover:border-gray-600"
            >
              <span className="text-lg">View All Products</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};