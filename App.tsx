import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Collection } from './pages/Collection';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Contact } from './pages/Contact';
import { CartProvider } from './context/CartContext';
import { ChatBot } from './components/ChatBot';
import { Product, ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [prevView, setPrevView] = useState<ViewState>('HOME');
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const mainRef = useRef<HTMLElement>(null);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('PRODUCT');
  };

  const handleBackToCollection = () => {
    if (selectedProduct) {
      setCurrentView(selectedProduct.category === 'Men' ? 'MEN' : 'WOMEN');
    } else {
      setCurrentView('HOME');
    }
  };

  const handleChangeView = (view: ViewState) => {
    if (view === currentView || isAnimating) return;
    
    setPrevView(currentView);
    setIsAnimating(true);
    
    // Start animation
    setTimeout(() => {
      setCurrentView(view);
      setIsAnimating(false);
    }, 300); // Match this with CSS transition duration
  };

  const renderView = () => {
    switch (currentView) {
      case 'HOME':
        return (
          <div className={`page-transition ${isAnimating ? 'page-exit' : 'page-enter'}`}>
            <Home changeView={handleChangeView} selectProduct={handleProductSelect} />
          </div>
        );
      case 'WOMEN':
        return (
          <div className={`page-transition ${isAnimating ? 'page-exit' : 'page-enter'}`}>
            <Collection category="Women" selectProduct={handleProductSelect} />
          </div>
        );
      case 'MEN':
        return (
          <div className={`page-transition ${isAnimating ? 'page-exit' : 'page-enter'}`}>
            <Collection category="Men" selectProduct={handleProductSelect} />
          </div>
        );
      case 'PRODUCT':
        return selectedProduct ? (
          <div className={`page-transition ${isAnimating ? 'page-exit' : 'page-enter'}`}>
            <ProductDetail 
              product={selectedProduct} 
              goBack={handleBackToCollection} 
              selectProduct={handleProductSelect}
              changeView={handleChangeView}
            />
          </div>
        ) : (
          <div className={`page-transition ${isAnimating ? 'page-exit' : 'page-enter'}`}>
            <Home changeView={handleChangeView} selectProduct={handleProductSelect} />
          </div>
        );
      case 'CART':
        return (
          <div className={`page-transition ${isAnimating ? 'page-exit' : 'page-enter'}`}>
            <Cart changeView={handleChangeView} />
          </div>
        );
      case 'CHECKOUT':
        return (
          <div className={`page-transition ${isAnimating ? 'page-exit' : 'page-enter'}`}>
            <Checkout changeView={handleChangeView} />
          </div>
        );
      case 'CONTACT':
        return (
          <div className={`page-transition ${isAnimating ? 'page-exit' : 'page-enter'}`}>
            <Contact />
          </div>
        );
      default:
        return (
          <div className={`page-transition ${isAnimating ? 'page-exit' : 'page-enter'}`}>
            <Home changeView={handleChangeView} selectProduct={handleProductSelect} />
          </div>
        );
    }
  };

  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen overflow-x-hidden">
        {/* Add global styles for animations */}
        <style>
          {`
            .page-transition {
              position: relative;
              width: 100%;
            }
            
            .page-enter {
              animation: fadeIn 0.3s ease-in-out forwards;
            }
            
            .page-exit {
              animation: fadeOut 0.3s ease-in-out forwards;
            }
            
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            @keyframes fadeOut {
              from {
                opacity: 1;
                transform: translateY(0);
              }
              to {
                opacity: 0;
                transform: translateY(-20px);
              }
            }
            
            /* Smooth transitions for all interactive elements */
            * {
              transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.2s ease, opacity 0.2s ease;
            }
            
            /* Remove blue focus outline on buttons - ONLY FOR NAV BUTTONS */
            nav button:focus,
            nav a:focus,
            button:focus:not(:focus-visible),
            a:focus:not(:focus-visible) {
              outline: none;
              box-shadow: none;
            }
            
            /* Keep accessibility focus for keyboard users */
            button:focus-visible,
            a:focus-visible {
              outline: 2px solid #3b82f6;
              outline-offset: 2px;
            }
            
            /* Smooth scrolling */
            html {
              scroll-behavior: smooth;
            }
            
            /* Smooth hover effects */
            button, a {
              transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }
          `}
        </style>
        
        <Navbar currentView={currentView} changeView={handleChangeView} />
        <main ref={mainRef} className="flex-grow">
          {renderView()}
        </main>
        <Footer changeView={handleChangeView} />
        <ChatBot />
      </div>
    </CartProvider>
  );
};

export default App;