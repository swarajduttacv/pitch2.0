import React, { useState, useEffect } from 'react';
import * as authService from '../services/authService';
import { PitchRecord } from '../types';

interface PitchHistoryProps {
  onClose: () => void;
  onViewPitch: (record: PitchRecord) => void;
}

const PitchHistory: React.FC<PitchHistoryProps> = ({ onClose, onViewPitch }) => {
  const [history, setHistory] = useState<PitchRecord[]>([]);

  useEffect(() => {
    setHistory(authService.getPitchHistory());
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in-up" style={{ animationDuration: '0.3s' }} onClick={onClose}>
      <div className="glassmorphism w-full max-w-2xl h-[80vh] rounded-2xl shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-100">Pitch History</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4">
          {history.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>You have no saved pitches.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {history.map(record => (
                <li key={record.id}>
                  <button 
                    onClick={() => onViewPitch(record)}
                    className="w-full text-left p-4 bg-gray-900/50 rounded-lg hover:bg-gray-700/50 transition-colors"
                  >
                    <p className="font-semibold text-gray-200 truncate">{record.pitchText.substring(0, 100)}...</p>
                    <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
                      <span>Evaluated on: {record.date}</span>
                      <span className="font-medium text-sky-400">Persona: {record.persona}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default PitchHistory;