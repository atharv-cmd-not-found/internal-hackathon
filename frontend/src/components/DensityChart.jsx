import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { DENSITY_LIMITS } from '../utils/densityHelpers';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const time = new Date(label).toLocaleTimeString();
    const count = payload[0].value;
    
    let status = 'LOW';
    let color = 'text-success';
    if (count > DENSITY_LIMITS.WARNING) {
      status = 'HIGH';
      color = 'text-danger';
    } else if (count > DENSITY_LIMITS.SAFE) {
      status = 'MEDIUM';
      color = 'text-warning';
    }

    return (
      <div className="bg-surface border border-gray-700 p-3 rounded-lg shadow-xl backdrop-blur-md">
        <p className="text-gray-400 text-sm mb-1">{time}</p>
        <p className="font-bold text-white">
          Density: <span className={color}>{count} people ({status})</span>
        </p>
      </div>
    );
  }
  return null;
};

const DensityChart = ({ data }) => {
  // Add gradient background based on y-value zones
  return (
    <div className="bg-surface rounded-xl border border-gray-800 p-4 md:p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">Live Density Timeline</h3>
          <p className="text-sm text-gray-400">Main Camera - Rolling 60s window</p>
        </div>
        <div className="flex space-x-4 text-sm font-medium">
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-success mr-2"></span> Safe</div>
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-warning mr-2"></span> Caution</div>
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-danger mr-2"></span> Danger</div>
        </div>
      </div>
      
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8}/> {/* Red */}
                <stop offset="30%" stopColor="#eab308" stopOpacity={0.6}/> {/* Yellow */}
                <stop offset="70%" stopColor="#22c55e" stopOpacity={0.4}/> {/* Green */}
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis 
              dataKey="time" 
              tickFormatter={(timeStr) => new Date(timeStr).toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' })}
              stroke="#9ca3af"
              tick={{fill: '#9ca3af', fontSize: 12}}
              minTickGap={20}
            />
            <YAxis 
              stroke="#9ca3af"
              tick={{fill: '#9ca3af', fontSize: 12}}
              domain={[0, 30]}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <ReferenceLine y={DENSITY_LIMITS.SAFE} stroke="#22c55e" strokeDasharray="3 3" label={{ position: 'top', value: 'Safe Limit', fill: '#22c55e', fontSize: 12 }} />
            <ReferenceLine y={DENSITY_LIMITS.WARNING} stroke="#eab308" strokeDasharray="3 3" label={{ position: 'top', value: 'Caution Limit', fill: '#eab308', fontSize: 12 }} />
            
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="#60a5fa" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorCount)" 
              isAnimationActive={false} // Disable animation for smoother live updates
            />

            {/* Event Markers for Spikes */}
            {data.map((entry, index) => {
              if (entry.isSpike) {
                return (
                  <ReferenceLine 
                    key={`spike-${index}`} 
                    x={entry.time} 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    label={{ position: 'insideTopLeft', value: '⚠', fill: '#ef4444', fontSize: 16 }}
                  />
                );
              }
              return null;
            })}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DensityChart;
