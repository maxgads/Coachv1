import React from 'react';

interface LineChartProps {
  labels: string[];
  values: number[];
  color: string;
}

const LineChart: React.FC<LineChartProps> = ({ labels, values, color }) => {
  if (!labels || labels.length === 0 || !values || values.length === 0) {
    return <div className="flex items-center justify-center h-full text-[var(--text-secondary)]">No hay datos para mostrar.</div>;
  }

  const padding = 40;
  const svgWidth = 600;
  const svgHeight = 250;
  const chartWidth = svgWidth - padding * 2;
  const chartHeight = svgHeight - padding * 2;

  const maxValue = Math.max(...values, 1);
  const xScale = chartWidth / (labels.length - 1 || 1);
  const yScale = chartHeight / maxValue;

  const path = values
    .map((value, index) => {
      const x = padding + index * xScale;
      const y = padding + chartHeight - value * yScale;
      return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
    })
    .join(' ');

  const yAxisLabels = [0, maxValue / 2, maxValue].map(v => ({ value: v.toFixed(1), y: padding + chartHeight - v * yScale }));
  
  return (
    <div className="w-full h-full overflow-x-auto">
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="font-sans w-full h-full">
        {/* Y Axis */}
        <line x1={padding} y1={padding} x2={padding} y2={padding + chartHeight} stroke="var(--border-color)" strokeWidth="1" />
        {yAxisLabels.map((label, i) => (
          <g key={i}>
            <text x={padding - 8} y={label.y} textAnchor="end" alignmentBaseline="middle" className="text-xs fill-[var(--text-secondary)]">{label.value}h</text>
            <line x1={padding} y1={label.y} x2={padding - 4} y2={label.y} stroke="var(--border-color)" strokeWidth="1" />
          </g>
        ))}

        {/* X Axis */}
        <line x1={padding} y1={padding + chartHeight} x2={padding + chartWidth} y2={padding + chartHeight} stroke="var(--border-color)" strokeWidth="1" />
         {labels.map((label, index) => {
          if (labels.length > 15 && index % Math.floor(labels.length / 10) !== 0 && index !== labels.length -1) return null;
          return (
            <text key={index} x={padding + index * xScale} y={padding + chartHeight + 15} textAnchor="middle" className="text-xs fill-[var(--text-secondary)]">{label}</text>
          )
        })}
        

        {/* Line */}
        <path d={path} fill="none" stroke={color} strokeWidth="2" />

        {/* Points */}
        {values.map((value, index) => (
          <circle
            key={index}
            cx={padding + index * xScale}
            cy={padding + chartHeight - value * yScale}
            r="3"
            fill={color}
          />
        ))}
      </svg>
    </div>
  );
};

export default LineChart;