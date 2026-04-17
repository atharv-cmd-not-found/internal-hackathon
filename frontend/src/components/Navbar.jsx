import React from 'react';
import { Bell, Settings, Activity } from 'lucide-react';

const Navbar = ({ unreadCount, onOpenAlerts }) => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-surface border-b border-gray-800">
      <div className="flex items-center space-x-3 text-white">
        <Activity className="w-8 h-8 text-success animate-pulse" />
        <span className="text-xl font-bold tracking-wider">CROWD-PULSE</span>
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          onClick={onOpenAlerts}
          className="relative p-2 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
        <button className="p-2 text-gray-400 hover:text-white transition-colors duration-200">
          <Settings className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
