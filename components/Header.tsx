import React from 'react';

interface HeaderProps {
  user: { email: string } | null;
  onLoginClick: () => void;
  onSignUpClick: () => void;
  onHistoryClick: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLoginClick, onSignUpClick, onHistoryClick, onLogout }) => {
  return (
    <header>
      {/* Top Bar */}
      <div className="h-10 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-full">
          {/* Left Side */}
          <div className="text-left">
            {user && (
              <span className="text-sm text-gray-400">Welcome, {user.email}</span>
            )}
          </div>

          {/* Right Side */}
          <div className="text-right">
            {user ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={onHistoryClick}
                  className="px-3 py-2 text-sm font-medium text-gray-300 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Pitch History
                </button>
                <button
                  onClick={onLogout}
                  className="px-3 py-2 text-sm font-medium text-gray-300 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={onLoginClick}
                  className="px-4 py-2 text-sm font-medium text-gray-200 bg-transparent rounded-lg hover:bg-gray-700/50 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={onSignUpClick}
                  className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Main Title Section */}
      <div className="text-center pt-8 pb-4 md:pt-12 md:pb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-teal-400 mb-2">
            PitchPerfect AI
          </h1>
          <p className="text-lg md:text-xl text-gray-400">
            Get your startup idea graded by an AI investor.
          </p>
      </div>
    </header>
  );
};

export default Header;
