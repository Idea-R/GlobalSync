import React, { useState, useEffect } from 'react';
import { LandingPage } from './LandingPage';
import { NetworkingPage } from './NetworkingPage';
import App from '../App';

type AppMode = 'landing' | 'demo' | 'authenticated';
type Page = 'dashboard' | 'networking';

interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: string;
}

export const AppRouter: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('landing');
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('globalsync-user');
    const savedMode = localStorage.getItem('globalsync-mode');
    
    if (savedUser && savedMode) {
      setUser(JSON.parse(savedUser));
      setMode(savedMode as AppMode);
    }
  }, []);

  const handleEnterApp = (userData?: User) => {
    if (userData) {
      setUser(userData);
      setMode('authenticated');
      localStorage.setItem('globalsync-user', JSON.stringify(userData));
      localStorage.setItem('globalsync-mode', 'authenticated');
    } else {
      setMode('demo');
      localStorage.setItem('globalsync-mode', 'demo');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setMode('landing');
    setCurrentPage('dashboard');
    localStorage.removeItem('globalsync-user');
    localStorage.removeItem('globalsync-mode');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Landing page
  if (mode === 'landing') {
    return (
      <LandingPage 
        onEnterApp={handleEnterApp}
        theme={theme}
      />
    );
  }

  // Demo mode - original app
  if (mode === 'demo') {
    return (
      <div className="relative">
        {/* Demo Banner */}
        <div className={`fixed top-0 left-0 right-0 z-50 py-2 px-4 text-center text-sm ${
          theme === 'dark' 
            ? 'bg-tactical-amber text-tactical-black' 
            : 'bg-blue-600 text-white'
        }`}>
          <span className="font-medium">Demo Mode</span> - 
          <button 
            onClick={() => setMode('landing')}
            className="ml-2 underline hover:no-underline"
          >
            Sign up for full features
          </button>
        </div>
        <div className="pt-10">
          <App />
        </div>
      </div>
    );
  }

  // Authenticated mode with navigation
  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-tactical-black' : 'bg-gray-50'
    }`}>
      {/* Navigation Header */}
      <nav className={`border-b ${
        theme === 'dark' ? 'border-tactical-gray bg-tactical-charcoal' : 'border-gray-200 bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <img 
                src="/GlobalSnycLogo.png" 
                alt="GlobalSync" 
                className="h-8 w-auto"
              />
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === 'dashboard'
                      ? theme === 'dark'
                        ? 'bg-tactical-amber text-tactical-black'
                        : 'bg-blue-600 text-white'
                      : theme === 'dark'
                        ? 'text-gray-300 hover:text-white hover:bg-tactical-gray'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </button>
                
                <button
                  onClick={() => setCurrentPage('networking')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === 'networking'
                      ? theme === 'dark'
                        ? 'bg-tactical-amber text-tactical-black'
                        : 'bg-blue-600 text-white'
                      : theme === 'dark'
                        ? 'text-gray-300 hover:text-white hover:bg-tactical-gray'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Network
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Plan Badge */}
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                user?.plan === 'pro'
                  ? theme === 'dark'
                    ? 'bg-tactical-amber/20 text-tactical-amber'
                    : 'bg-blue-100 text-blue-800'
                  : theme === 'dark'
                    ? 'bg-tactical-gray text-gray-300'
                    : 'bg-gray-200 text-gray-700'
              }`}>
                {user?.plan?.toUpperCase()} PLAN
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:text-white hover:bg-tactical-gray'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-white hover:bg-tactical-gray'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      {currentPage === 'dashboard' ? (
        <App />
      ) : (
        <NetworkingPage theme={theme} user={user} />
      )}
    </div>
  );
};