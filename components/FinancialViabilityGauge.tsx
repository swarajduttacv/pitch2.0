import React from 'react';

interface FinancialViabilityGaugeProps {
  score: number;
}

const FinancialViabilityGauge: React.FC<FinancialViabilityGaugeProps> = ({ score }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = (value: number) => {
    if (value >= 75) return 'text-green-400';
    if (value >= 50) return 'text-lime-400';
    return 'text-yellow-400';
  };

  const color = getScoreColor(score);

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full" viewBox="0 0 110 110">
          <circle
            className="text-gray-500/20"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="55"
            cy="55"
          />
          <circle
            className={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="55"
            cy="55"
            style={{ 
                transform: 'rotate(-90deg)', 
                transformOrigin: '50% 50%',
                transition: 'stroke-dashoffset 1.5s cubic-bezier(0.25, 1, 0.5, 1)' 
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${color}`}>
            {score}
          </span>
          <span className="text-xs text-gray-400 font-medium mt-1">Financials</span>
        </div>
      </div>
    </div>
  );
};

export default FinancialViabilityGauge;