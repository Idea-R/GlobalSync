import React, { useState } from 'react';
import { X, Mail, Lock, User, Zap, Globe, Users, Target } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup' | 'demo';
  onAuthSuccess: (user: any) => void;
  theme: 'dark' | 'light';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  mode: initialMode,
  onAuthSuccess,
  theme,
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'demo'>(initialMode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'demo') {
        // Demo mode - just close modal and continue with local storage
        onClose();
        return;
      }

      if (mode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        
        // Simulate signup API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock user data
        const user = {
          id: crypto.randomUUID(),
          email: formData.email,
          name: formData.name,
          plan: 'free',
          createdAt: new Date().toISOString(),
        };
        
        onAuthSuccess(user);
      } else {
        // Login mode
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock user data
        const user = {
          id: crypto.randomUUID(),
          email: formData.email,
          name: formData.email.split('@')[0],
          plan: 'pro',
          createdAt: new Date().toISOString(),
        };
        
        onAuthSuccess(user);
      }
      
      onClose();
    } catch (err) {
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Globe, text: 'Global team coordination' },
    { icon: Users, text: 'Unlimited team members' },
    { icon: Target, text: 'Smart collaboration windows' },
    { icon: Zap, text: 'Real-time status updates' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-md rounded-xl shadow-2xl border animate-tactical-deploy ${
        theme === 'dark' 
          ? 'bg-tactical-charcoal border-tactical-gray' 
          : 'bg-white border-gray-200'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          theme === 'dark' ? 'border-tactical-gray' : 'border-gray-200'
        }`}>
          <div className="flex items-center">
            <img 
              src="/GlobalSnycLogoOnly.png" 
              alt="GlobalSync" 
              className="w-8 h-8 mr-3"
            />
            <h2 className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {mode === 'demo' ? 'Try Demo' : mode === 'login' ? 'Welcome Back' : 'Join GlobalSync'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark' 
                ? 'hover:bg-tactical-gray text-gray-400 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {mode === 'demo' ? (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className={`text-lg font-semibold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Experience GlobalSync Demo
                </h3>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Try all features with local storage. No signup required!
                </p>
              </div>

              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <feature.icon className={`w-5 h-5 mr-3 ${
                      theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
                    }`} />
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => onClose()}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    theme === 'dark'
                      ? 'bg-tactical-amber text-tactical-black hover:bg-yellow-500'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Continue with Demo
                </button>
                
                <div className="text-center">
                  <button
                    onClick={() => setMode('signup')}
                    className={`text-sm ${
                      theme === 'dark' ? 'text-tactical-amber hover:text-yellow-400' : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    Want full features? Sign up for free →
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Full Name
                  </label>
                  <div className="relative">
                    <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
                        theme === 'dark'
                          ? 'bg-tactical-black border-tactical-gray text-white focus:ring-tactical-amber'
                          : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500'
                      }`}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
                      theme === 'dark'
                        ? 'bg-tactical-black border-tactical-gray text-white focus:ring-tactical-amber'
                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500'
                    }`}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Password
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
                      theme === 'dark'
                        ? 'bg-tactical-black border-tactical-gray text-white focus:ring-tactical-amber'
                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500'
                    }`}
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
                        theme === 'dark'
                          ? 'bg-tactical-black border-tactical-gray text-white focus:ring-tactical-amber'
                          : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500'
                      }`}
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className={`p-3 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-warning-red/20 border-warning-red text-warning-red'
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  theme === 'dark'
                    ? 'bg-tactical-amber text-tactical-black hover:bg-yellow-500'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className={`text-sm ${
                    theme === 'dark' ? 'text-tactical-amber hover:text-yellow-400' : 'text-blue-600 hover:text-blue-700'
                  }`}
                >
                  {mode === 'login' 
                    ? "Don't have an account? Sign up" 
                    : 'Already have an account? Sign in'
                  }
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode('demo')}
                  className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                  }`}
                >
                  Try demo instead
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};