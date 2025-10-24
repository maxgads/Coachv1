import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DonutChartProps {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
  size?: number;
  strokeWidth?: number;
}

const DonutChart: React.FC<DonutChartProps> = ({ data, size = 250, strokeWidth = 30 }) => {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  
  const halfSize = size / 2;
  const radius = halfSize - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  if (totalValue === 0) {
      return <div className="flex items-center justify-center h-full text-[var(--text-secondary)]">No hay datos para mostrar.</div>;
  }

  let accumulatedPercentage = 0;

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full h-full">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <g transform={`rotate(-90 ${halfSize} ${halfSize})`}>
            {data.map((item, index) => {
              const percentage = (item.value / totalValue) * 100;
              const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
              
              const currentAccumulated = accumulatedPercentage;
              accumulatedPercentage += percentage;

              return (
                <motion.circle
                  key={index}
                  cx={halfSize}
                  cy={halfSize}
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={hoveredSegment === item.name ? strokeWidth * 1.2 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={- (currentAccumulated / 100) * circumference}
                  strokeLinecap="butt"
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: - (currentAccumulated / 100) * circumference }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                  onMouseEnter={() => setHoveredSegment(item.name)}
                  onMouseLeave={() => setHoveredSegment(null)}
                  style={{ zIndex: hoveredSegment === item.name ? 10 : 1, transition: 'stroke-width 0.2s ease' }}
                />
              );
            })}
          </g>
        </svg>
        <AnimatePresence>
            {hoveredSegment ? (
                 <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none"
                >
                    <div className="text-3xl font-bold text-[var(--text-primary)]">
                        {((data.find(d => d.name === hoveredSegment)?.value || 0) / totalValue * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-[var(--text-secondary)] max-w-[100px] truncate">{hoveredSegment}</div>
                </motion.div>
            ) : (
                 <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none"
                >
                    <div className="text-2xl font-bold text-[var(--text-primary)]">{totalValue.toFixed(1)}</div>
                    <div className="text-sm text-[var(--text-secondary)]">Total Horas</div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
      <div className="w-full md:w-auto max-w-xs space-y-2">
        {data.map((item, index) => (
          <div 
            key={index} 
            className="flex items-center gap-3 text-sm p-1 rounded-md transition-colors hover:bg-[var(--bg-inner)]"
            onMouseEnter={() => setHoveredSegment(item.name)}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            <div style={{ backgroundColor: item.color }} className="w-3 h-3 rounded-full flex-shrink-0" />
            <span className="flex-1 text-[var(--text-secondary)] truncate">{item.name}</span>
            <span className="font-semibold text-[var(--text-primary)]">{item.value.toFixed(1)}h</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
