import React, { useState } from 'react';
import * as authService from '../services/authService';

interface AuthModalProps {
  initialView: 'login' | 'signup';
  onClose: () => void;
  onSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ initialView, onClose, onSuccess }) => {
  const [view, setView] = useState(initialView);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      if (view === 'login') {
        const result = authService.login(email, password);
        if (result.success) {
          onSuccess();
        } else {
          setError(result.message);
        }
      } else {
        const result = authService.signUp(email, password);
        if (result.success) {
          setMessage(result.message);
          setView('login');
        } else {
          setError(result.message);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in-up" style={{ animationDuration: '0.3s' }} onClick={onClose}>
      <div className="glassmorphism w-full max-w-md rounded-2xl shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
            <div className="w-full">
                <div className="flex border-b border-white/10">
                    <button onClick={() => setView('login')} className={`flex-1 py-2 text-center font-medium transition-colors ${view === 'login' ? 'text-sky-400 border-b-2 border-sky-400' : 'text-gray-400'}`}>
                        Login
                    </button>
                    <button onClick={() => setView('signup')} className={`flex-1 py-2 text-center font-medium transition-colors ${view === 'signup' ? 'text-sky-400 border-b-2 border-sky-400' : 'text-gray-400'}`}>
                        Sign Up
                    </button>
                </div>
            </div>
             <button onClick={onClose} className="text-gray-500 hover:text-gray-200 transition-colors -mr-2 -mt-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </header>

        <div className="p-8">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-100">{view === 'login' ? 'Welcome Back' : 'Create an Account'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        className="mt-1 block w-full bg-gray-900/50 border border-gray-600 rounded-md p-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="mt-1 block w-full bg-gray-900/50 border border-gray-600 rounded-md p-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                </div>

                {error && <p className="text-sm text-rose-400 text-center">{error}</p>}
                {message && <p className="text-sm text-emerald-400 text-center">{message}</p>}

                <div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-teal-400 hover:scale-105 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Processing...' : (view === 'login' ? 'Login' : 'Sign Up')}
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;