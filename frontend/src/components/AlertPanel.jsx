import React from 'react';
import { X, AlertTriangle, Info, CheckCircle } from 'lucide-react';

const AlertPanel = ({ isOpen, onClose, alerts, onClearAll }) => {
  if (!isOpen) return null;

  const getAlertIcon = (severity) => {
    switch (severity) {
      case 'DANGER': return <AlertTriangle className="w-5 h-5 text-danger" />;
      case 'CAUTION': return <Info className="w-5 h-5 text-warning" />;
      case 'CLEAR': return <CheckCircle className="w-5 h-5 text-success" />;
      default: return <Info className="w-5 h-5 text-gray-400" />;
    }
  };

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'DANGER': return 'border-danger/30 bg-danger/10';
      case 'CAUTION': return 'border-warning/30 bg-warning/10';
      case 'CLEAR': return 'border-success/30 bg-success/10';
      default: return 'border-gray-700 bg-gray-800/50';
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-surface border-l border-gray-800 z-50 shadow-2xl flex flex-col transform transition-transform duration-300">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <span>Alert History</span>
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <span className="text-sm text-gray-400">{alerts.length} Total Alerts</span>
          <button 
            onClick={onClearAll}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Clear All
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {alerts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <CheckCircle className="w-12 h-12 mb-4 text-gray-600" />
              <p>No recent alerts</p>
            </div>
          ) : (
            alerts.map(alert => (
              <div 
                key={alert.id} 
                className={`p-4 rounded-xl border ${getAlertColor(alert.severity)}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    {getAlertIcon(alert.severity)}
                    <span className="font-semibold text-white">{alert.cameraName}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-gray-300 ml-7">{alert.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default AlertPanel;
