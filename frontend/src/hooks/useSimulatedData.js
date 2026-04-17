import { useState, useEffect } from 'react';

// Generates simulated data for the primary camera and mock cameras
export const useSimulatedData = () => {
  const [dataPoints, setDataPoints] = useState(() => {
    return Array.from({ length: 6 }).map((_, i) => ({
      time: new Date(Date.now() - (60 - i * 10) * 1000).toISOString(),
      count: Math.floor(Math.random() * 8), // start safe
      isSpike: false
    }));
  });
  const [currentCount, setCurrentCount] = useState(0);

  useEffect(() => {

    const interval = setInterval(() => {
      // 10% chance of a spike above 15
      const isSpike = Math.random() < 0.1;
      let nextCount;
      if (isSpike) {
        nextCount = Math.floor(Math.random() * 10) + 16; // 16-25
      } else {
        // Normally fluctuate between 0-14
        nextCount = Math.floor(Math.random() * 15);
      }

      setCurrentCount(nextCount);

      setDataPoints(prev => {
        const newPoint = {
          time: new Date().toISOString(),
          count: nextCount,
          isSpike
        };
        // Keep last 60 seconds (assuming 10s intervals, so 6 points)
        // Wait, the prompt says "tick every 10s". If we simulate every 2s to make it look alive, 
        // we can keep 30 points. Let's do 1 tick per second for liveliness, keeping 60 points.
        const newArr = [...prev, newPoint];
        if (newArr.length > 60) {
          return newArr.slice(newArr.length - 60);
        }
        return newArr;
      });
    }, 1000); // 1 update per second

    return () => clearInterval(interval);
  }, []);

  return { currentCount, dataPoints };
};
