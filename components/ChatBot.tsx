import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, ShoppingBag } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { MOCK_PRODUCTS } from '../constants';

// Prepare context data for the AI
const PRODUCT_CATALOG = MOCK_PRODUCTS.map(p => 
  `- ${p.name} (${p.category} / ${p.subCategory}): Rs. ${p.price}. Colors: ${p.colors.join(', ')}. Sizes: ${p.sizes.join(', ')}. ${p.description}`
).join('\n');

const SYSTEM_INSTRUCTION = `You are "Deneth AI", a helpful and stylish fashion assistant for Deneth Fashion, a premium linen clothing brand in Sri Lanka.

Your Goal: Assist customers in choosing the right linen wear, answer questions about sizing, pricing, and shipping.

Key Information:
- **Products**: We sell premium linen pants for Men and Women.
- **Catalog**:
${PRODUCT_CATALOG}
- **Delivery**: Islandwide delivery available. Rates vary by district (approx Rs. 250 - Rs. 400).
- **Payment**: We accept Cash on Delivery and Bank Transfer.
- **Tone**: Professional, polite, stylish, and concise.
- **Constraint**: If asked about topics unrelated to clothing, fashion, or our store, politely steer the conversation back to Deneth Fashion products. Do not hallucinate products we don't have.

Start by being helpful. If a user asks for recommendations, ask for their preference (Men/Women, color, style).`;

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello! I'm Deneth AI. Looking for the perfect linen fit today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      // Initialize Gemini Client
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Create Chat with history
      // We map our local message state to the API's history format
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const chat = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
        history: history
      });

      const result = await chat.sendMessage({ message: userText });
      const responseText = result.text;

      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having a little trouble connecting right now. Please try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-[90vw] sm:w-96 h-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4 border border-gray-100 animate-slide-up transform origin-bottom-right transition-all">
          
          {/* Header */}
          <div className="bg-black text-white p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center space-x-2">
              <div className="bg-white/20 p-1.5 rounded-full">
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </div>
              <div>
                <h3 className="font-serif font-bold tracking-wide text-sm">Deneth Fashion</h3>
                <span className="text-[10px] text-gray-300 flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                  Online
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 text-sm rounded-2xl shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-black text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-2">
                   <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-0"></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-300"></div>
                   </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 focus-within:ring-1 focus-within:ring-black focus-within:border-black transition-all shadow-inner">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about style, size..."
                className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                disabled={isLoading}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={`p-1.5 rounded-full transition-all ${input.trim() ? 'bg-black text-white hover:scale-105' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
            <div className="text-[10px] text-center text-gray-300 mt-2">
              Powered by Google Gemini
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center justify-center bg-black text-white w-14 h-14 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 relative"
        >
          <MessageCircle className="w-7 h-7 group-hover:scale-90 transition-transform" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>
          <div className="absolute right-16 bg-black text-white text-xs py-1 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
             Chat with AI
             <div className="absolute top-1/2 -right-1 w-2 h-2 bg-black transform -translate-y-1/2 rotate-45"></div>
          </div>
        </button>
      )}
    </div>
  );
};
