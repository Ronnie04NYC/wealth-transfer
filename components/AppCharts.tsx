import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { ChartDataPoint } from '../types';

interface ChartProps {
  data: ChartDataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black border border-cyan-500/50 p-3 shadow-[0_0_15px_rgba(6,182,212,0.3)] text-sm font-mono">
        <p className="font-bold text-cyan-200 mb-2 border-b border-cyan-900 pb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="flex justify-between gap-4">
            <span>{entry.name}:</span>
            <span className="font-bold">{typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}%</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const ProductivityChart: React.FC<ChartProps> = ({ data }) => {
  return (
    <div className="h-[400px] w-full font-mono">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#e879f9" stopOpacity={0.5}/>
              <stop offset="95%" stopColor="#e879f9" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorWage" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.5}/>
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="year" stroke="#475569" tick={{fill: '#94a3b8'}} />
          <YAxis stroke="#475569" tick={{fill: '#94a3b8'}} label={{ value: 'GROWTH (%)', angle: -90, position: 'insideLeft', fill: '#64748b' }} />
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <Tooltip content={<CustomTooltip />} cursor={{stroke: '#fff', strokeWidth: 1, strokeDasharray: '4 4'}} />
          <Legend wrapperStyle={{ color: '#cbd5e1' }} iconType="diamond" />
          <Area 
            type="monotone" 
            dataKey="productivity" 
            name="NET PRODUCTIVITY" 
            stroke="#e879f9" 
            fillOpacity={1} 
            fill="url(#colorProd)" 
            strokeWidth={3}
            animationDuration={2000}
          />
          <Area 
            type="monotone" 
            dataKey="hourlyCompensation" 
            name="HOURLY PAY" 
            stroke="#22d3ee" 
            fillOpacity={1} 
            fill="url(#colorWage)" 
            strokeWidth={3}
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const CeoPayChart: React.FC<ChartProps> = ({ data }) => {
  return (
    <div className="h-[400px] w-full font-mono">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <XAxis dataKey="year" stroke="#475569" tick={{fill: '#94a3b8'}} />
          <YAxis stroke="#475569" tick={{fill: '#94a3b8'}} label={{ value: 'GROWTH (%)', angle: -90, position: 'insideLeft', fill: '#64748b' }} />
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <Tooltip content={<CustomTooltip />} cursor={{stroke: '#fff', strokeWidth: 1, strokeDasharray: '4 4'}} />
          <Legend wrapperStyle={{ color: '#cbd5e1' }} iconType="diamond" />
          <Line type="step" dataKey="ceoPayGrowth" name="CEO PAY" stroke="#facc15" strokeWidth={3} dot={false} activeDot={{r: 8, fill: "#facc15", stroke: "#000"}} animationDuration={2000} />
          <Line type="step" dataKey="workerPayGrowth" name="WORKER PAY" stroke="#22d3ee" strokeWidth={3} dot={false} activeDot={{r: 6, fill: "#22d3ee", stroke: "#000"}} animationDuration={2000} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const CostOfLivingChart: React.FC<ChartProps> = ({ data }) => {
  return (
    <div className="h-[400px] w-full font-mono">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <XAxis dataKey="year" stroke="#475569" tick={{fill: '#94a3b8'}} />
          <YAxis stroke="#475569" tick={{fill: '#94a3b8'}} label={{ value: 'INDEX (100=BASE)', angle: -90, position: 'insideLeft', fill: '#64748b' }} />
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <Tooltip content={<CustomTooltip />} cursor={{stroke: '#fff', strokeWidth: 1, strokeDasharray: '4 4'}} />
          <Legend wrapperStyle={{ color: '#cbd5e1' }} iconType="diamond" />
          <Line type="monotone" dataKey="wages" name="WAGES" stroke="#22d3ee" strokeWidth={3} strokeDasharray="5 5" dot={false} />
          <Line type="monotone" dataKey="housing" name="HOUSING" stroke="#ef4444" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="healthcare" name="HEALTHCARE" stroke="#a3e635" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="tuition" name="COLLEGE" stroke="#e879f9" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
