import React from 'react';
import CameraCard from './CameraCard';

const CameraGrid = ({ cameras, selectedCameraId, onSelectCamera }) => {
  // If no main viewer, show grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 px-6 pb-6">
      {cameras.map(cam => (
        <CameraCard 
          key={cam.id}
          {...cam}
          isSelected={cam.id === selectedCameraId}
          onClick={onSelectCamera}
        />
      ))}
    </div>
  );
};

export default CameraGrid;
