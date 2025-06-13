/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'tactical-black': '#0a0a0a',
        'tactical-charcoal': '#1a1a1a',
        'tactical-gray': '#2a2a2a',
        'military-green': '#2d4a3a',
        'tactical-amber': '#ffb000',
        'radar-green': '#00ff88',
        'warning-red': '#ff4444',
        'steel-blue': '#4a90a4',
        'command-orange': '#ff8c42',
      },
      fontFamily: {
        'tactical': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      animation: {
        'tactical-deploy': 'tacticalDeploy 0.6s ease-out forwards',
        'tactical-pulse': 'tacticalPulse 2s ease-in-out infinite',
        'radar-sweep': 'radarSweep 1.5s ease-in-out infinite',
        'command-glow': 'commandGlow 0.3s ease-in-out',
      },
      keyframes: {
        tacticalDeploy: {
          '0%': { 
            transform: 'translateY(20px) scale(0.95)', 
            opacity: '0',
          },
          '100%': { 
            transform: 'translateY(0) scale(1)', 
            opacity: '1',
          },
        },
        tacticalPulse: {
          '0%, 100%': { 
            boxShadow: '0 0 5px rgba(255, 176, 0, 0.3)',
          },
          '50%': { 
            boxShadow: '0 0 20px rgba(255, 176, 0, 0.6)',
          },
        },
        radarSweep: {
          '0%': { 
            transform: 'scaleX(0)',
            transformOrigin: 'left',
          },
          '50%': { 
            transform: 'scaleX(1)',
            transformOrigin: 'left',
          },
          '51%': { 
            transformOrigin: 'right',
          },
          '100%': { 
            transform: 'scaleX(0)',
            transformOrigin: 'right',
          },
        },
        commandGlow: {
          '0%': { 
            boxShadow: '0 0 5px rgba(255, 176, 0, 0.2)',
          },
          '100%': { 
            boxShadow: '0 0 15px rgba(255, 176, 0, 0.4)',
          },
        },
      },
      backdropBlur: {
        'tactical': '8px',
      },
    },
  },
  plugins: [],
};