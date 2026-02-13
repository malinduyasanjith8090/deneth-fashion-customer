import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type?: 'success' | 'error';
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose, type = 'success' }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-24 right-4 z-[100] animate-slide-in-right">
      <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl border border-white/10 ${type === 'success' ? 'bg-black text-white' : 'bg-red-600 text-white'}`}>
        {type === 'success' ? <CheckCircle className="w-5 h-5 text-green-400" /> : <XCircle className="w-5 h-5" />}
        <span className="font-medium text-sm">{message}</span>
        <button onClick={onClose} className="ml-4 hover:opacity-70 transition-opacity">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};