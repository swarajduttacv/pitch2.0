import React from 'react';
import type { EvaluationScores } from '../types';

interface RadarChartProps {
  scores: EvaluationScores;
}

const RadarChart: React.FC<RadarChartProps> = ({ scores }) => {
  const data = [
    { axis: 'Clarity', value: scores.clarity.score },
    { axis: 'Market', value: scores.marketUnderstanding.score },
    { axis: 'Innovation', value: scores.innovation.score },
    { axis: 'Feasibility', value: scores.feasibility.score },
  ];

  const width = 300;
  const height = 300;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(centerX, centerY) * 0.8;
  const levels = 5; // Number of concentric circles

  const angleSlice = (Math.PI * 2) / data.length;

  const points = data
    .map((d, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = centerX + (d.value / 100) * radius * Math.cos(angle);
      const y = centerY + (d.value / 100) * radius * Math.sin(angle);
      return `${x},${y}`;
    })
    .join(' ');

  const axisPoints = data.map((_, i) => {
    const angle = angleSlice * i - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { x, y };
  });

  const labelPoints = data.map((d, i) => {
    const angle = angleSlice * i - Math.PI / 2;
    const x = centerX + radius * 1.15 * Math.cos(angle);
    const y = centerY + radius * 1.15 * Math.sin(angle);
    return { x, y, label: d.axis };
  });

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <g>
        {/* Concentric circles */}
        {[...Array(levels)].map((_, i) => (
          <circle
            key={i}
            cx={centerX}
            cy={centerY}
            r={(radius * (i + 1)) / levels}
            fill="none"
            stroke="#4b5563" // gray-600
            strokeWidth="1"
          />
        ))}

        {/* Axis lines */}
        {axisPoints.map((p, i) => (
          <line
            key={i}
            x1={centerX}
            y1={centerY}
            x2={p.x}
            y2={p.y}
            stroke="#4b5563" // gray-600
            strokeWidth="1"
          />
        ))}

        {/* Data polygon */}
        <polygon
          points={points}
          stroke="#14b8a6" // teal-500
          strokeWidth="2"
          fill="#5eead4" // teal-300
          fillOpacity="0.4"
        />
        
        {/* Data points */}
        {data.map((d, i) => {
             const angle = angleSlice * i - Math.PI / 2;
             const x = centerX + (d.value / 100) * radius * Math.cos(angle);
             const y = centerY + (d.value / 100) * radius * Math.sin(angle);
             return <circle key={i} cx={x} cy={y} r="4" fill="#0d9488" />; // teal-600
        })}

        {/* Labels */}
        {labelPoints.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={p.y}
            dy="0.35em"
            textAnchor={p.x > centerX ? 'start' : p.x < centerX ? 'end' : 'middle'}
            className="text-xs font-semibold fill-gray-300"
          >
            {p.label}
          </text>
        ))}
      </g>
    </svg>
  );
};

export default RadarChart;