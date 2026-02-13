import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ViewState } from '../types';
import { Trash2, Minus, Plus, ArrowRight } from 'lucide-react';

interface CartProps {
  changeView: (view: ViewState) => void;
}

export const Cart: React.FC<CartProps> = ({ changeView }) => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemove = (id: string) => {
    setRemovingId(id);
    // Wait for animation to finish before removing from state
    setTimeout(() => {
      removeFromCart(id);
      setRemovingId(null);
    }, 400); // 400ms match transition duration
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white px-4 animate-fade-in">
        <h2 className="text-3xl font-serif font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">Looks like you haven't added any premium linen to your wardrobe yet.</p>
        <button 
          onClick={() => changeView('HOME')}
          className="bg-black text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-8 pb-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold mb-8">Shopping Bag</h1>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items */}
          <div className="flex-1 space-y-8">
            {cart.map((item) => (
              <div 
                key={item.cartId} 
                className={`flex gap-6 border-b border-gray-100 pb-6 transition-all duration-500 ease-out transform origin-left ${
                    removingId === item.cartId 
                      ? 'opacity-0 -translate-x-8 scale-95 pointer-events-none' 
                      : 'opacity-100 translate-x-0'
                }`}
              >
                <div className="w-24 h-32 bg-gray-100 flex-shrink-0 relative overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{item.subCategory}</p>
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="mr-4">Size: {item.selectedSize}</span>
                        <span>Color: {item.selectedColor}</span>
                      </div>
                    </div>
                    <p className="font-medium text-gray-900">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                  </div>

                  <div className="flex justify-between items-end mt-4">
                    <div className="flex items-center border border-gray-200">
                      <button 
                        onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium animate-fade-in" key={item.quantity}>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => handleRemove(item.cartId)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="w-full lg:w-96 bg-gray-50 p-8 h-fit sticky top-24 transition-all duration-300">
            <h2 className="text-lg font-bold font-serif mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>Rs. {cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>
            
            <div className="flex justify-between font-bold text-lg mb-8 border-t border-gray-200 pt-4">
              <span>Total</span>
              <span className="animate-pulse-slow">Rs. {cartTotal.toLocaleString()}</span>
            </div>

            <button 
              onClick={() => changeView('CHECKOUT')}
              className="w-full bg-black text-white py-4 flex items-center justify-center font-bold uppercase tracking-widest hover:bg-gray-800 transition-all hover:shadow-xl hover:-translate-y-1 shadow-lg"
            >
              <span>Checkout</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
            
            <p className="text-xs text-center text-gray-400 mt-4">
              Secure Checkout • Easy Returns
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};