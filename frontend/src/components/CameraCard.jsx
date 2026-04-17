import React from 'react';
import { VideoOff } from 'lucide-react';
import { getStatusColors, getStatusFromCount } from '../utils/densityHelpers';

const CameraCard = ({ id, name, isOffline, count, streamUrl, onClick, isSelected }) => {
  const status = isOffline ? 'UNKNOWN' : getStatusFromCount(count);
  const statusColors = getStatusColors(status);
  
  return (
    <div 
      onClick={() => onClick(id)}
      className={`relative overflow-hidden rounded-xl border bg-surface transition-all duration-300 cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500 border-transparent' : 'border-gray-800 hover:border-gray-600'
      }`}
    >
      {/* Top Bar Overlay */}
      <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/80 to-transparent z-10 flex justify-between items-center pointer-events-none">
        <span className="text-white font-medium drop-shadow-md">{name}</span>
        <div className={`px-2 py-1 rounded text-xs font-bold border backdrop-blur-sm ${statusColors}`}>
          {isOffline ? 'OFFLINE' : status}
        </div>
      </div>
      
      {/* Content */}
      <div className="aspect-video bg-gray-900 w-full relative flex items-center justify-center">
        {isOffline ? (
          <div className="flex flex-col items-center justify-center text-gray-500 space-y-2">
            <VideoOff className="w-10 h-10" />
            <span className="text-sm font-medium">Feed Offline</span>
          </div>
        ) : (
          <img 
            src={streamUrl} 
            alt={name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback if proxy/backend fails
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div class="flex flex-col items-center justify-center text-gray-500 space-y-2"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-video-off"><path d="M10.66 6H14a2 2 0 0 1 2 2v2.34l1 1L22 8v8l-2.07-2.07-2.59-2.59-2.68-2.68-4-4L6.6 2.6 4.39 4.81l15.22 15.22-2.21 2.21-3.61-3.61-2.12-2.12L8 13.06V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2.34l2.32 2.32Z"/></svg><span class="text-sm font-medium">Connection Error</span></div>';
            }}
          />
        )}
      </div>
      
      {/* Bottom Bar Overlay */}
      {!isOffline && (
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent z-10 flex justify-between items-center pointer-events-none">
          <span className="text-gray-300 text-sm">People Count:</span>
          <span className="text-white font-bold text-lg">{count}</span>
        </div>
      )}
    </div>
  );
};

export default CameraCard;
