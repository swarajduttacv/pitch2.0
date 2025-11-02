import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import PitchInput from './components/PitchInput';
import Loader from './components/Loader';
import EvaluationResult from './components/EvaluationResult';
import { evaluatePitch } from './services/geminiService';
import type { EvaluationResult as EvaluationResultType, PitchRecord } from './types';
import AuthModal from './components/AuthModal';
import PitchHistory from './components/PitchHistory';
import * as authService from './services/authService';

const App: React.FC = () => {
  const [pitchText, setPitchText] = useState<string>('');
  const [persona, setPersona] = useState<string>('default');
  const [result, setResult] = useState<EvaluationResultType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Auth State
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; view: 'login' | 'signup' }>({ isOpen: false, view: 'login' });
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [isHistoryView, setIsHistoryView] = useState(false);

  const handleEvaluate = useCallback(async () => {
    if (!pitchText.trim()) {
      setError('Please enter your pitch text before evaluating.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);
    setIsHistoryView(false);

    try {
      const evaluation = await evaluatePitch(pitchText, persona as any);
      setResult(evaluation);
      if (currentUser) {
        authService.savePitchToHistory({
          id: new Date().toISOString(),
          date: new Date().toLocaleString(),
          pitchText,
          persona,
          result: evaluation,
        });
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [pitchText, persona, currentUser]);

  const handleLoginSuccess = () => {
    setCurrentUser(authService.getCurrentUser());
    setAuthModal({ isOpen: false, view: 'login' });
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };
  
  const handleViewHistoryPitch = (record: PitchRecord) => {
    setPitchText(record.pitchText);
    setPersona(record.persona);
    setResult(record.result);
    setIsHistoryView(true);
    setHistoryModalOpen(false);
    window.scrollTo(0, 0);
  };

  const resetState = () => {
    setResult(null);
    setPitchText('');
    setError(null);
    setIsHistoryView(false);
    window.scrollTo(0, 0);
  }

  return (
    <div className="min-h-screen text-gray-200 selection:bg-sky-500/30">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Header 
          user={currentUser}
          onLoginClick={() => setAuthModal({ isOpen: true, view: 'login' })}
          onSignUpClick={() => setAuthModal({ isOpen: true, view: 'signup' })}
          onHistoryClick={() => setHistoryModalOpen(true)}
          onLogout={handleLogout}
        />
        <div className="max-w-4xl mx-auto">
          {!result && !isLoading && (
            <div className="glassmorphism p-6 md:p-8 rounded-2xl shadow-lg animate-fade-in-up">
              <PitchInput
                pitchText={pitchText}
                setPitchText={setPitchText}
                onEvaluate={handleEvaluate}
                isLoading={isLoading}
                persona={persona}
                setPersona={setPersona}
              />
            </div>
          )}
          
          {isLoading && <Loader />}

          {error && (
             <div className="mt-8 text-center glassmorphism border border-rose-500/50 text-rose-300 px-4 py-3 rounded-lg relative animate-fade-in-up" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
              <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
                <svg className="fill-current h-6 w-6 text-rose-400" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
              </button>
            </div>
          )}

          {result && (
            <div>
              <EvaluationResult result={result} isHistoryView={isHistoryView} />
               <div className="mt-12 text-center animate-fade-in-up" style={{animationDelay: '400ms'}}>
                  <button
                    onClick={resetState}
                    className="px-6 py-2 bg-gray-700/80 text-gray-200 font-semibold rounded-full hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Analyze Another Pitch
                  </button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {authModal.isOpen && (
        <AuthModal 
          initialView={authModal.view}
          onClose={() => setAuthModal({ isOpen: false, view: 'login' })}
          onSuccess={handleLoginSuccess}
        />
      )}

      {historyModalOpen && (
        <PitchHistory
          onClose={() => setHistoryModalOpen(false)}
          onViewPitch={handleViewHistoryPitch}
        />
      )}

    </div>
  );
}

export default App;