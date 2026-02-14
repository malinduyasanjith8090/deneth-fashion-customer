import React, { useState } from 'react';
import { ShoppingBag, Menu, X, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  changeView: (view: ViewState) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, changeView }) => {
  const { cart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleNav = (view: ViewState) => {
    changeView(view);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          
          {/* Logo */}
          <div 
            className="flex-shrink-0 flex items-center cursor-pointer" 
            onClick={() => handleNav('HOME')}
          >
            <div className="flex items-center transform scale-100 md:scale-110 origin-left">
              {logoError ? (
                // Fallback text logo if image fails
                <div className="flex flex-col items-center">
                  <div className="w-full h-0.5 bg-black mb-1"></div>
                  <h1 className="text-xl md:text-2xl font-black tracking-[0.2em] leading-none text-black text-center">
                    <span className="block">DENNETH</span>
                    <span className="block">FASHION</span>
                  </h1>
                  <div className="flex items-center w-full mt-1.5">
                    <div className="h-px bg-black flex-grow"></div>
                    <span className="px-2 text-[0.5rem] font-bold tracking-[0.4em] uppercase text-black">CLOTHING</span>
                    <div className="h-px bg-black flex-grow"></div>
                  </div>
                </div>
              ) : (
                // Logo Image - Increased size
                <img 
                  src="/logo/Logo.png" 
                  alt="DENNETH FASHION CLOTHING" 
                  className="h-44 md:h-48 w-auto object-contain hover:opacity-90 transition-opacity duration-300"
                  onError={() => {
                    setLogoError(true);
                  }}
                />
              )}
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <button 
              onClick={() => handleNav('WOMEN')}
              className={`text-sm font-bold tracking-widest transition-colors hover:text-gray-500 ${currentView === 'WOMEN' ? 'text-black border-b-2 border-black pb-1' : 'text-gray-900'}`}
            >
              WOMEN
            </button>
            <button 
              onClick={() => handleNav('MEN')}
              className={`text-sm font-bold tracking-widest transition-colors hover:text-gray-500 ${currentView === 'MEN' ? 'text-black border-b-2 border-black pb-1' : 'text-gray-900'}`}
            >
              MEN
            </button>
            <button 
              onClick={() => handleNav('CONTACT')}
              className={`text-sm font-bold tracking-widest transition-colors hover:text-gray-500 ${currentView === 'CONTACT' ? 'text-black border-b-2 border-black pb-1' : 'text-gray-900'}`}
            >
              CONTACT
            </button>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            <a href="https://wa.me/94765399868" target="_blank" rel="noreferrer" className="hidden md:block text-gray-800 hover:text-black transition-colors">
              <Phone className="w-5 h-5" />
            </a>
            <button 
              onClick={() => handleNav('CART')}
              className="relative text-gray-800 hover:text-black transition-transform active:scale-95"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full animate-pulse-slow">
                  {cartItemCount}
                </span>
              )}
            </button>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-800 hover:text-black"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-xl z-50 animate-slide-up">
          <div className="px-6 pt-4 pb-8 space-y-4">
            <button 
              onClick={() => handleNav('HOME')}
              className="block w-full text-left px-4 py-3 text-sm font-bold tracking-widest text-gray-900 hover:bg-gray-50 rounded-sm border-l-2 border-transparent hover:border-black transition-all"
            >
              HOME
            </button>
            <button 
              onClick={() => handleNav('WOMEN')}
              className="block w-full text-left px-4 py-3 text-sm font-bold tracking-widest text-gray-900 hover:bg-gray-50 rounded-sm border-l-2 border-transparent hover:border-black transition-all"
            >
              WOMEN'S COLLECTION
            </button>
            <button 
              onClick={() => handleNav('MEN')}
              className="block w-full text-left px-4 py-3 text-sm font-bold tracking-widest text-gray-900 hover:bg-gray-50 rounded-sm border-l-2 border-transparent hover:border-black transition-all"
            >
              MEN'S COLLECTION
            </button>
            <button 
              onClick={() => handleNav('CONTACT')}
              className="block w-full text-left px-4 py-3 text-sm font-bold tracking-widest text-gray-900 hover:bg-gray-50 rounded-sm border-l-2 border-transparent hover:border-black transition-all"
            >
              CONTACT
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};