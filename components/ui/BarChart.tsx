
import React from 'react';

interface BarChartProps {
  labels: string[];
  values: number[];
  color: string;
}

const BarChart: React.FC<BarChartProps> = ({ labels, values, color }) => {
  if (!labels || labels.length === 0 || !values || values.length === 0) {
    return <div className="flex items-center justify-center h-full text-[var(--text-secondary)]">No hay datos para mostrar.</div>;
  }

  const padding = { top: 20, right: 10, bottom: 30, left: 30 };
  const svgWidth = 600;
  const svgHeight = 250;
  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;
  
  const maxValue = Math.max(...values, 1);
  const barWidth = chartWidth / (labels.length * 2);

  return (
    <div className="w-full h-full">
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="font-sans w-full h-full">
        {/* Y Axis */}
        <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + chartHeight} stroke="var(--border-color)" strokeWidth="1" />
        
        {/* Bars and Labels */}
        {values.map((value, index) => {
          const barHeight = (value / maxValue) * chartHeight;
          const x = padding.left + index * (chartWidth / labels.length) + (chartWidth / labels.length - barWidth) / 2;
          const y = padding.top + chartHeight - barHeight;
          
          return (
            <g key={index}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={color}
                rx="2"
                ry="2"
              />
              <text
                x={x + barWidth / 2}
                y={y - 5}
                textAnchor="middle"
                className="text-xs font-semibold fill-[var(--text-primary)]"
                fontSize="10"
              >
                {value.toFixed(1)}
              </text>
            </g>
          );
        })}

        {/* X Axis */}
        <line x1={padding.left} y1={padding.top + chartHeight} x2={padding.left + chartWidth} y2={padding.top + chartHeight} stroke="var(--border-color)" strokeWidth="1" />
        {labels.map((label, index) => {
          const x = padding.left + index * (chartWidth / labels.length) + (chartWidth / labels.length) / 2;
          return (
            <text
              key={index}
              x={x}
              y={padding.top + chartHeight + 15}
              textAnchor="middle"
              className="text-xs fill-[var(--text-secondary)]"
               fontSize="10"
            >
              {label.length > 8 ? label.substring(0, 7) + '…' : label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default BarChart;
