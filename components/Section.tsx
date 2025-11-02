import React from 'react';

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
}

const Section: React.FC<SectionProps> = ({ title, icon, children, className = '', onClick }) => {
  return (
    <div className={className}>
      <button 
        onClick={onClick}
        className="group/button w-full p-2 -m-2 rounded-lg transition-transform duration-300 ease-out group-hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500/80"
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <div className="text-sky-500 mr-3">{icon}</div>
            <h3 className="text-xl font-bold text-gray-50">{title}</h3>
          </div>
          <div className="flex items-center text-sky-400 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300">
              <span className="text-sm font-medium mr-2">Discuss with AI</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a6 6 0 00-6 6v3.586l-1.293 1.293a1 1 0 001.414 1.414L6 12.586V8a4 4 0 018 0v4.586l2.293 2.293a1 1 0 001.414-1.414L16 11.586V8a6 6 0 00-6-6zM4 18a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1zm12 0a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1z" />
              </svg>
          </div>
        </div>
      </button>
      
      {/* Content is now static and does not have hover effects */}
      <div className="mt-4 text-gray-300 space-y-4">
        {children}
      </div>
    </div>
  );
};

export default Section;