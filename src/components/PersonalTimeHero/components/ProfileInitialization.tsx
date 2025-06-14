import React, { useState } from 'react';
import { Terminal, UserPlus } from 'lucide-react';
import { PersonalInfo } from '../../../types';
import { detectUserTimezone, formatTimezoneDisplay, getAllTimezones } from '../../../utils/timezone';
import { parseShareString } from '../../../utils/shareString';
import { StatusType } from '../../../types';

interface ProfileInitializationProps {
  personalInfo: PersonalInfo;
  onUpdatePersonalInfo: (updates: Partial<PersonalInfo>) => void;
  theme: 'dark' | 'light';
}

export const ProfileInitialization: React.FC<ProfileInitializationProps> = ({
  personalInfo,
  onUpdatePersonalInfo,
  theme,
}) => {
  const [showInitialImport, setShowInitialImport] = useState(false);
  const [initialImportString, setInitialImportString] = useState('');
  const [initialImportError, setInitialImportError] = useState('');
  const [detectedTimezone] = useState(() => detectUserTimezone());

  const handleInitialImportProfile = () => {
    if (!initialImportString.trim()) {
      setInitialImportError('Please enter a profile share string');
      return;
    }

    const parsed = parseShareString(initialImportString.trim());
    if (!parsed || !parsed.name) {
      setInitialImportError('Invalid share string format. Please check and try again.');
      return;
    }

    onUpdatePersonalInfo({
      name: parsed.name,
      timezone: parsed.timezone ? parsed.timezone.replace('GMT', 'UTC') : 'UTC+0',
      status: (parsed.status as StatusType) || 'vibing',
      workHours: parsed.workHours || '9-17',
      sleepHours: parsed.sleepHours || '23-7',
      autoStatus: parsed.autoStatus !== undefined ? parsed.autoStatus : true,
      avatar: parsed.avatar,
      title: parsed.title,
    });
    
    setInitialImportString('');
    setInitialImportError('');
    setShowInitialImport(false);
  };

  // Auto-populate timezone on first load if not already set
  const shouldAutoPopulate = personalInfo.timezone === 'GMT+0' && detectedTimezone !== 'GMT+0';

  return (
    <div className={`rounded-lg p-8 mb-8 animate-tactical-deploy border ${
      theme === 'dark' 
        ? 'bg-tactical-charcoal border-tactical-gray' 
        : 'bg-white border-gray-200 shadow-lg'
    }`}>
      <div className="flex items-center justify-center mb-6">
        <Terminal className={`w-8 h-8 mr-3 ${
          theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
        }`} />
        <h1 className={`text-2xl font-bold font-tactical ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Initialize Command Profile
        </h1>
      </div>
      
      <div className="max-w-md mx-auto space-y-4">
        {/* Import Profile Option */}
        <div className="text-center mb-6">
          <button
            onClick={() => setShowInitialImport(!showInitialImport)}
            className={`px-6 py-3 rounded-lg border transition-all duration-200 font-medium text-sm hover:scale-105 ${
              theme === 'dark' 
                ? 'bg-tactical-black border-tactical-gray text-tactical-amber hover:border-tactical-amber hover:bg-tactical-gray/20' 
                : 'bg-gray-50 border-gray-300 text-blue-600 hover:border-blue-500 hover:bg-blue-50'
            }`}
          >
            {showInitialImport ? '← Create New Profile' : '📥 Import Existing Profile'}
          </button>
        </div>
        
        {showInitialImport ? (
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Profile Share String
              </label>
              <textarea
                value={initialImportString}
                onChange={(e) => setInitialImportString(e.target.value)}
                placeholder="Paste GlobalSync://... share string here"
                className={`w-full px-4 py-3 rounded-lg resize-none focus:outline-none ${
                  theme === 'dark'
                    ? 'bg-tactical-black border border-tactical-gray text-white placeholder-gray-500 focus:border-tactical-amber'
                    : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                }`}
                rows={3}
              />
              {initialImportError && (
                <p className={`text-xs mt-1 ${
                  theme === 'dark' ? 'text-warning-red' : 'text-red-600'
                }`}>
                  {initialImportError}
                </p>
              )}
            </div>
            
            <button
              onClick={handleInitialImportProfile}
              disabled={!initialImportString.trim()}
              className={`w-full px-4 py-3 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
                theme === 'dark'
                  ? 'bg-tactical-amber text-tactical-black hover:bg-yellow-500'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Import Profile
            </button>
          </div>
        ) : (
          <>
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Call Sign (Your Name)
              </label>
              <input
                type="text"
                placeholder="Enter your developer name"
                className={`w-full px-4 py-3 rounded-lg transition-colors focus:outline-none ${
                  theme === 'dark'
                    ? 'bg-tactical-black border border-tactical-gray text-white placeholder-gray-500 focus:border-tactical-amber'
                    : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                }`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const target = e.target as HTMLInputElement;
                    if (target.value.trim()) {
                      onUpdatePersonalInfo({ name: target.value.trim() });
                    }
                  }
                }}
              />
              <p className={`text-xs mt-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Press Enter to confirm your name
              </p>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Title/Role (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Developer, AI Engineer"
                className={`w-full px-4 py-3 rounded-lg transition-colors focus:outline-none ${
                  theme === 'dark'
                    ? 'bg-tactical-black border border-tactical-gray text-white placeholder-gray-500 focus:border-tactical-amber'
                    : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                }`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const target = e.target as HTMLInputElement;
                    onUpdatePersonalInfo({ title: target.value.trim() });
                  }
                }}
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Timezone Sector
              </label>
              <select
                value={shouldAutoPopulate ? detectedTimezone : personalInfo.timezone}
                onChange={(e) => onUpdatePersonalInfo({ timezone: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg transition-colors focus:outline-none ${
                  theme === 'dark'
                    ? 'bg-tactical-black border border-tactical-gray text-white focus:border-tactical-amber'
                    : 'bg-gray-50 border border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
              >
                {getAllTimezones().map(tz => (
                  <option key={tz} value={tz}>
                    {formatTimezoneDisplay(tz)}
                  </option>
                ))}
              </select>
              {shouldAutoPopulate && (
                <p className={`text-xs mt-1 ${
                  theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
                }`}>
                  🎯 Auto-detected your timezone: {formatTimezoneDisplay(detectedTimezone)}
                </p>
              )}
            </div>
            
            <button
              onClick={() => {
                const nameInput = document.querySelector('input[type="text"]') as HTMLInputElement;
                if (nameInput && nameInput.value.trim()) {
                  onUpdatePersonalInfo({ 
                    name: nameInput.value.trim(),
                    timezone: shouldAutoPopulate ? detectedTimezone : personalInfo.timezone
                  });
                }
              }}
              className={`w-full px-4 py-3 rounded-lg transition-colors font-medium ${
                theme === 'dark'
                  ? 'bg-tactical-amber text-tactical-black hover:bg-yellow-500'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Initialize Command Center
            </button>
          </>
        )}
      </div>
    </div>
  );
}; 