import { useState, useEffect, useCallback } from 'react';
import { getStatusFromCount } from '../utils/densityHelpers';

export const useAlerts = (currentCount) => {
  const [alerts, setAlerts] = useState([]);
  const [activeToast, setActiveToast] = useState(null);

  const addAlert = useCallback((severity, message, cameraName = 'Camera 1 - Main') => {
    const newAlert = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      cameraName,
      severity,
      message,
    };
    
    setAlerts(prev => [newAlert, ...prev].slice(0, 50)); // Keep last 50
    
    if (severity === 'DANGER') {
      setActiveToast(newAlert);
      // Auto dismiss toast after 5s
      setTimeout(() => setActiveToast(null), 5000);
    }
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const dismissToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  // Monitor currentCount to trigger alerts automatically
  useEffect(() => {
    const status = getStatusFromCount(currentCount);
    
    if (status === 'HIGH') {
      // eslint-disable-next-line
      addAlert('DANGER', `Critical density exceeded: ${currentCount} people detected.`);
    } else if (status === 'MEDIUM') {
      // Optional: add caution alert, maybe limit frequency to avoid spamming
      // addAlert('CAUTION', `Density elevated: ${currentCount} people detected.`);
    }
  }, [currentCount, addAlert]);

  return { alerts, activeToast, addAlert, clearAlerts, dismissToast };
};
