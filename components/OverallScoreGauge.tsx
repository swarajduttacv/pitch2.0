import React from 'react';

interface OverallScoreGaugeProps {
  score: number;
}

const OverallScoreGauge: React.FC<OverallScoreGaugeProps> = ({ score }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = (value: number) => {
    if (value >= 75) return 'text-emerald-400';
    if (value >= 50) return 'text-sky-400';
    return 'text-rose-400';
  };

  const color = getScoreColor(score);

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full" viewBox="0 0 140 140">
          <circle
            className="text-gray-500/20"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="70"
            cy="70"
          />
          <circle
            className={color}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="70"
            cy="70"
            style={{ 
                transform: 'rotate(-90deg)', 
                transformOrigin: '50% 50%',
                transition: 'stroke-dashoffset 1.5s cubic-bezier(0.25, 1, 0.5, 1)' 
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-5xl font-bold ${color}`}>
            {score}
          </span>
          <span className="text-sm text-gray-400 font-medium">Overall Score</span>
        </div>
      </div>
    </div>
  );
};

export default OverallScoreGauge;