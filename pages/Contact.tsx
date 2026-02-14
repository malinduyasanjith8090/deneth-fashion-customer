import React from 'react';
import { Phone, Mail, MapPin, Instagram, MessageCircle, Facebook } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-white animate-fade-in">
       {/* Hero */}
       <div className="bg-gray-50 py-20 text-center px-4">
          <h1 className="text-4xl font-serif font-bold text-black mb-6">Connect With Us</h1>
          <p className="max-w-2xl mx-auto text-gray-600 leading-relaxed">
            At Deneth Fashion, we believe in the timeless elegance of linen. Our mission is to provide you with sustainable, comfortable, and stylish clothing.
          </p>
       </div>

       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
             
             {/* Contact Info */}
             <div className="space-y-8">
                <h2 className="text-2xl font-serif font-bold mb-6">Talk to Us</h2>
                
                <div className="flex items-start space-x-4">
                   <div className="bg-black text-white p-3 rounded-full">
                      <Phone className="w-5 h-5" />
                   </div>
                   <div>
                      <h3 className="font-bold text-lg">Phone</h3>
                      <p className="text-gray-600 mt-1">074 071 6403</p>
                      <p className="text-sm text-gray-400 mt-1">Mon-Sat 9am - 6pm</p>
                   </div>
                </div>

                <div className="flex items-start space-x-4">
                   <div className="bg-black text-white p-3 rounded-full">
                      <MapPin className="w-5 h-5" />
                   </div>
                   <div>
                      <h3 className="font-bold text-lg">Location</h3>
                      <p className="text-gray-600 mt-1">81/61, Pannaluwa, Wataraka, Padukka</p>
                      <p className="text-sm text-gray-400 mt-1">We deliver countrywide.</p>
                   </div>
                </div>

                <div className="flex items-start space-x-4">
                   <div className="bg-green-600 text-white p-3 rounded-full">
                      <MessageCircle className="w-5 h-5" />
                   </div>
                   <div>
                      <h3 className="font-bold text-lg">WhatsApp</h3>
                      <p className="text-gray-600 mt-1">Chat with us directly for custom orders.</p>
                      <a 
                        href="https://wa.me/94765399868" 
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block mt-2 text-green-700 font-bold underline underline-offset-4"
                      >
                         Start Chat
                      </a>
                   </div>
                </div>

                <div className="pt-8">
                    <h3 className="font-bold mb-4">Follow @DenethFashion</h3>
                    <div className="flex space-x-4">
                        <a href="https://www.instagram.com/denethfashion?igsh=MXBwcG8yb3prcm84YQ%3D%3D&utm_source=qr" className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-all">
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a href="https://web.facebook.com/DenethFashion/" className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-all">
                            <Facebook className="w-5 h-5" />
                        </a>
                        <a href="https://www.tiktok.com/@denethfashion?_r=1&_t=ZS-93YYzJHInf2" className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-all font-bold">
                            T
                        </a>
                    </div>
                </div>
             </div>

             {/* Simple Form */}
             <div className="bg-gray-50 p-8 rounded-lg">
                <h2 className="text-2xl font-serif font-bold mb-6">Send a Message</h2>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                   <input type="text" placeholder="Your Name" className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-black outline-none" />
                   <input type="email" placeholder="Email Address" className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-black outline-none" />
                   <textarea rows={4} placeholder="How can we help?" className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-black outline-none"></textarea>
                   <button className="w-full bg-black text-white py-3 font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
                      Send Message
                   </button>
                </form>
             </div>

          </div>
       </div>
    </div>
  );
};