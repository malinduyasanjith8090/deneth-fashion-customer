import React from 'react';
import { Instagram, Facebook, Phone, MessageCircle, Mail } from 'lucide-react';
import { ViewState } from '../types';

interface FooterProps {
  changeView: (view: ViewState) => void;
}

export const Footer: React.FC<FooterProps> = ({ changeView }) => {
  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <div>
              {/* Logo Image - Increased size */}
              <div className="mb-2">
                <img 
                  src="/logo/Logo1.png" 
                  alt="DENETH FASHION CLOTHING" 
                  className="h-24 w-auto object-contain max-w-full"
                  onError={(e) => {
                    // Fallback to text logo if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'flex flex-col border-l-4 border-white pl-4 py-4';
                    fallback.innerHTML = `
                      <h3 class="font-serif text-3xl font-bold tracking-wider leading-none">DENETH</h3>
                      <h3 class="font-serif text-3xl font-bold tracking-wider leading-none">FASHION</h3>
                      <p class="text-sm tracking-[0.4em] uppercase text-gray-400 mt-2">Clothing</p>
                    `;
                    target.parentNode?.insertBefore(fallback, target);
                  }}
                />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mt-4">
                Sustainable linen, modern style. Elevate your comfort with our premium collection.
              </p>
              <div className="flex items-center space-x-2 text-sm font-bold text-white mt-6">
                <span>@DenethFashion</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-6">Shop</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><button onClick={() => changeView('WOMEN')} className="hover:text-white transition-colors">Women's Collection</button></li>
              <li><button onClick={() => changeView('MEN')} className="hover:text-white transition-colors">Men's Collection</button></li>
              <li><button onClick={() => changeView('HOME')} className="hover:text-white transition-colors">New Arrivals</button></li>
              <li><button onClick={() => changeView('HOME')} className="hover:text-white transition-colors">Bestsellers</button></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-6">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>074 071 6403</span>
              </li>
              <li className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4" />
                <a href="https://wa.me/254740716403" target="_blank" rel="noreferrer" className="hover:text-white">WhatsApp Us</a>
              </li>
              <li className="flex items-center space-x-2">
                 <Mail className="w-4 h-4" />
                 <span>denethfashion@gmail.com</span>
              </li>
              <li>Sri Lanka</li>
            </ul>
          </div>

          {/* Social / Scan */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-6">Connect With Us</h4>
            <div className="flex space-x-4 mb-8">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors font-bold text-sm border border-gray-400 rounded-full w-5 h-5 flex items-center justify-center">T</a>
              <a href="https://wa.me/254740716403" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors"><MessageCircle className="w-5 h-5" /></a>
            </div>
            <div className="bg-white p-2 rounded-lg">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://denethfashion.mobirisesite.com" alt="Scan Me" className="w-24 h-24" />
            </div>
            <p className="text-[10px] mt-2 text-gray-500 uppercase tracking-widest">Scan Me</p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Deneth Fashion. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};