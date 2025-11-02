import React from 'react';

interface ScoreCardProps {
  label: string;
  score: number;
  justification: string;
  color: string;
  animationDelay?: string;
  className?: string;
  onClick: () => void;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ label, score, justification, color, animationDelay = '0s', className = '', onClick }) => {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <button 
      onClick={onClick}
      className={`glassmorphism p-4 rounded-xl flex flex-col items-center justify-start text-center h-full transition-transform duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-sky-500/80 animate-fade-in-up group-hover:scale-105 relative ${className}`}
      style={{ animationDelay }}
    >
      <div className="relative w-full h-full rounded-lg flex flex-col items-center">
        <div className="relative w-20 h-20 mb-3">
          <svg className="w-full h-full" viewBox="0 0 80 80">
            <circle
              className="text-gray-600/50"
              strokeWidth="6"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="40"
              cy="40"
            />
            <circle
              className={color}
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="40"
              cy="40"
              style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s ease-out' }}
              />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-100">
            {score}
          </span>
        </div>
        <h3 className="text-md font-semibold text-gray-100 mb-1">{label}</h3>
        <p className="text-gray-400 text-xs leading-relaxed">{justification}</p>
      </div>
    </button>
  );
};

export default ScoreCard;