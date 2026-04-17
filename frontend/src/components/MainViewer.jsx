import React from 'react';
import { VideoOff, Maximize2 } from 'lucide-react';
import { getStatusColors, getStatusFromCount } from '../utils/densityHelpers';

const MainViewer = ({ camera }) => {
  if (!camera) return null;

  const status = camera.isOffline ? 'UNKNOWN' : getStatusFromCount(camera.count);
  const statusColors = getStatusColors(status);

  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-700 bg-surface h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-surface z-10">
        <div>
          <h2 className="text-xl font-bold text-white">{camera.name}</h2>
          <p className="text-sm text-gray-400">Live Feed</p>
        </div>
        <div className={`px-3 py-1.5 rounded-md text-sm font-bold border ${statusColors}`}>
          {camera.isOffline ? 'OFFLINE' : status}
        </div>
      </div>
      
      {/* Video Content */}
      <div className="flex-1 bg-black relative flex items-center justify-center">
        {camera.isOffline ? (
          <div className="flex flex-col items-center justify-center text-gray-500 space-y-4">
            <VideoOff className="w-16 h-16" />
            <span className="text-xl font-medium">Camera Feed Offline</span>
          </div>
        ) : (
          <>
            <img 
              src={camera.streamUrl} 
              alt={camera.name} 
              className="w-full h-full object-contain"
            />
            {/* Overlay Info */}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
              <div className="bg-black/60 backdrop-blur-md px-4 py-3 rounded-lg border border-gray-700">
                <span className="text-gray-400 text-sm block mb-1">Current Density</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-white">{camera.count}</span>
                  <span className="text-gray-400 text-sm">people</span>
                </div>
              </div>
              
              <button className="p-3 bg-black/60 backdrop-blur-md rounded-lg border border-gray-700 text-white pointer-events-auto hover:bg-gray-800 transition-colors">
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MainViewer;
