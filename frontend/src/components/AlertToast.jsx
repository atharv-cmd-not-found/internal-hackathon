import React from 'react';
import { AlertOctagon, X } from 'lucide-react';

const AlertToast = ({ alert, onClose }) => {
  if (!alert) return null;

  return (
    <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-right fade-in duration-300">
      <div className="bg-danger/90 backdrop-blur-md text-white p-4 rounded-xl shadow-2xl border-l-4 border-white flex items-start space-x-4 max-w-md w-full">
        <div className="p-2 bg-white/20 rounded-lg animate-pulse">
          <AlertOctagon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-lg mb-1">{alert.cameraName}</h4>
          <p className="text-white/90 text-sm leading-relaxed">{alert.message}</p>
          <span className="text-white/60 text-xs mt-2 block">
            {new Date(alert.timestamp).toLocaleTimeString()}
          </span>
        </div>
        <button 
          onClick={onClose}
          className="text-white/70 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AlertToast;
