/* eslint-disable no-unused-vars */
import React from 'react';
import { Camera, AlertTriangle, Users, CheckCircle2 } from 'lucide-react';

const StatsCard = ({ title, value, Icon, valueColor = "text-white", badge }) => (
  <div className="bg-surface p-4 rounded-xl border border-gray-800 flex items-center justify-between">
    <div>
      <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
      <div className="flex items-center space-x-2">
        <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
        {badge && (
          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${badge.color}`}>
            {badge.text}
          </span>
        )}
      </div>
    </div>
    <div className="p-3 bg-gray-800/50 rounded-lg">
      <Icon className="w-6 h-6 text-gray-400" />
    </div>
  </div>
);

const StatsBar = ({ activeAlerts, currentDensity }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-6 py-6">
      <StatsCard 
        title="Total Cameras" 
        value="4" 
        Icon={Camera} 
      />
      <StatsCard 
        title="Active Alerts" 
        value={activeAlerts} 
        Icon={AlertTriangle} 
        valueColor={activeAlerts > 0 ? "text-danger" : "text-white"}
      />
      <StatsCard 
        title="Current Density (Cam 1)" 
        value={currentDensity} 
        Icon={Users} 
      />
      <StatsCard 
        title="System Status" 
        value="ONLINE" 
        Icon={CheckCircle2} 
        valueColor="text-success"
        badge={{ text: 'STABLE', color: 'bg-success/20 text-success' }}
      />
    </div>
  );
};

export default StatsBar;
