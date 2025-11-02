import React, { useState, useRef, useEffect } from 'react';

interface PitchInputProps {
  pitchText: string;
  setPitchText: (text: string) => void;
  onEvaluate: () => void;
  isLoading: boolean;
  persona: string;
  setPersona: (persona: string) => void;
}

const placeholderText = `Paste your pitch deck or business plan text here...

For best results, include sections like:
- Problem: What problem are you solving?
- Solution: How do you solve it?
- Market Size: How big is the opportunity?
- Business Model: How do you make money?
- Team: Who is on your team?
- Financials: What are your projections?
...and any other relevant information.
`;

const personas = [
    { id: 'default', name: 'Balanced VC' },
    { id: 'aggressive-vc', name: 'Aggressive VC' },
    { id: 'cautious-angel', name: 'Cautious Angel' },
    { id: 'data-analyst', name: 'Data-driven Analyst' },
];

const PersonaSelector: React.FC<{
  persona: string;
  setPersona: (p: string) => void;
  isLoading: boolean;
}> = ({ persona, setPersona, isLoading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedPersona = personas.find(p => p.id === persona);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <label htmlFor="persona-select" className="block text-sm font-medium text-gray-300 mb-2">
        Select Investor Persona
      </label>
      <button
        id="persona-select"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="w-full glassmorphism text-white rounded-lg p-3 text-left flex justify-between items-center ring-1 ring-transparent focus:outline-none focus:ring-sky-500 transition-all duration-200"
      >
        <span>{selectedPersona?.name}</span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 w-full glassmorphism rounded-lg shadow-xl z-10 overflow-hidden origin-top animate-fade-in-up"
             style={{ animationDuration: '0.3s' }}>
          <ul className="py-1">
            {personas.map(p => (
              <li key={p.id}>
                <button
                  onClick={() => {
                    setPersona(p.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
                    persona === p.id ? 'bg-sky-500/30 text-sky-300' : 'text-gray-200 hover:bg-gray-700/50'
                  }`}
                >
                  {p.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};


const PitchInput: React.FC<PitchInputProps> = ({ pitchText, setPitchText, onEvaluate, isLoading, persona, setPersona }) => {
  return (
    <div className="w-full">
      <div className="mb-6">
        <PersonaSelector persona={persona} setPersona={setPersona} isLoading={isLoading} />
      </div>
      <textarea
        value={pitchText}
        onChange={(e) => setPitchText(e.target.value)}
        placeholder={placeholderText}
        className="w-full h-80 p-4 glassmorphism rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-200 text-gray-200 placeholder-gray-400 resize-y"
        disabled={isLoading}
      />
      <div className="mt-6 flex justify-center">
        <button
          onClick={onEvaluate}
          disabled={isLoading || !pitchText.trim()}
          className="px-8 py-3 bg-gradient-to-r from-sky-500 to-teal-400 text-white font-bold rounded-full shadow-lg hover:scale-105 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            'Evaluate Pitch'
          )}
        </button>
      </div>
    </div>
  );
};

export default PitchInput;