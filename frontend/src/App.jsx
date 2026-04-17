import React, { useState } from 'react';
import Navbar from './components/Navbar';
import StatsBar from './components/StatsBar';
import CameraGrid from './components/CameraGrid';
import MainViewer from './components/MainViewer';
import DensityChart from './components/DensityChart';
import AlertPanel from './components/AlertPanel';
import AlertToast from './components/AlertToast';
import { useSimulatedData } from './hooks/useSimulatedData';
import { useAlerts } from './hooks/useAlerts';

function App() {
  // Global State
  const { currentCount, dataPoints } = useSimulatedData();
  const { alerts, activeToast, clearAlerts, dismissToast } = useAlerts(currentCount);
  
  const [isAlertPanelOpen, setIsAlertPanelOpen] = useState(false);
  const [selectedCameraId, setSelectedCameraId] = useState(1);

  // Mock Camera Setup
  const cameras = [
    {
      id: 1,
      name: 'Gate A - Entry (Main)',
      isOffline: false,
      count: currentCount,
      streamUrl: '/video_feed', // Proxied to Flask backend
    },
    {
      id: 2,
      name: 'Gate B - Exit',
      isOffline: true,
      count: null,
      streamUrl: null,
    },
    {
      id: 3,
      name: 'Corridor 1',
      isOffline: true,
      count: null,
      streamUrl: null,
    },
    {
      id: 4,
      name: 'Corridor 2',
      isOffline: true,
      count: null,
      streamUrl: null,
    }
  ];

  const selectedCamera = cameras.find(c => c.id === selectedCameraId) || cameras[0];
  const activeAlertsCount = alerts.filter(a => a.severity === 'DANGER' || a.severity === 'CAUTION').length;

  return (
    <div className="min-h-screen flex flex-col bg-background text-white font-sans overflow-x-hidden">
      {/* Notifications & Panels */}
      <AlertToast alert={activeToast} onClose={dismissToast} />
      <AlertPanel 
        isOpen={isAlertPanelOpen} 
        onClose={() => setIsAlertPanelOpen(false)} 
        alerts={alerts}
        onClearAll={clearAlerts}
      />

      {/* Header Area */}
      <Navbar 
        unreadCount={activeAlertsCount} 
        onOpenAlerts={() => setIsAlertPanelOpen(true)} 
      />
      <StatsBar 
        activeAlerts={activeAlertsCount}
        currentDensity={cameras[0].count} // Main camera count
      />

      {/* Main Content Area */}
      <main className="flex-1 px-6 pb-8 flex flex-col space-y-6">
        
        {/* Top Section: Video Layout */}
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Main Viewer (Large left panel) */}
          <div className="w-full xl:w-3/4 aspect-video xl:aspect-auto xl:h-[600px]">
            <MainViewer camera={selectedCamera} />
          </div>
          
          {/* Sidebar Grid (Right panel or bottom on mobile) */}
          <div className="w-full xl:w-1/4 flex flex-col space-y-4 overflow-y-auto xl:h-[600px] pr-2">
            <h3 className="text-lg font-semibold text-gray-300 px-1 sticky top-0 bg-background py-2 z-10">Available Feeds</h3>
            {cameras.map(cam => (
              <div 
                key={cam.id} 
                onClick={() => setSelectedCameraId(cam.id)}
                className={`transition-transform duration-200 ${selectedCameraId === cam.id ? 'scale-[1.02]' : 'hover:scale-[1.02]'}`}
              >
                <CameraGrid 
                  cameras={[cam]} 
                  selectedCameraId={selectedCameraId} 
                  onSelectCamera={setSelectedCameraId} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section: Analytics & Charts */}
        <div className="w-full xl:w-3/4">
          <DensityChart data={dataPoints} />
        </div>

      </main>
    </div>
  );
}

export default App;
