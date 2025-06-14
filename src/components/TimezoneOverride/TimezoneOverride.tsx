import React, { useState } from 'react';
import { Globe, MapPin, Wifi, X } from 'lucide-react';

interface TimezoneOverrideProps {
  currentOffset: number;
  detectedOffset: number;
  isUsingOverride: boolean;
  onTimezoneChange: (offset: number | undefined) => void;
  theme: 'light' | 'dark';
  isOpen: boolean;
  onClose: () => void;
}

const COMMON_TIMEZONES = [
  { name: 'Hawaii (HST)', offset: -10 },
  { name: 'Alaska (AKST)', offset: -9 },
  { name: 'Pacific (PST)', offset: -8 },
  { name: 'Mountain (MST)', offset: -7 },
  { name: 'Central (CST)', offset: -6 },
  { name: 'Eastern (EST)', offset: -5 },
  { name: 'Atlantic', offset: -4 },
  { name: 'Brasília', offset: -3 },
  { name: 'UTC/GMT', offset: 0 },
  { name: 'London (GMT)', offset: 0 },
  { name: 'Paris (CET)', offset: 1 },
  { name: 'Cairo (EET)', offset: 2 },
  { name: 'Moscow (MSK)', offset: 3 },
  { name: 'Dubai (GST)', offset: 4 },
  { name: 'India (IST)', offset: 5.5 },
  { name: 'Bangladesh', offset: 6 },
  { name: 'Bangkok (ICT)', offset: 7 },
  { name: 'Beijing (CST)', offset: 8 },
  { name: 'Tokyo (JST)', offset: 9 },
  { name: 'Sydney (AEST)', offset: 10 },
  { name: 'Auckland (NZST)', offset: 12 },
];

export const TimezoneOverride: React.FC<TimezoneOverrideProps> = ({
  currentOffset,
  detectedOffset,
  isUsingOverride,
  onTimezoneChange,
  theme,
  isOpen,
  onClose,
}) => {
  const [selectedOffset, setSelectedOffset] = useState<number>(currentOffset);

  if (!isOpen) return null;

  const handleApply = () => {
    onTimezoneChange(selectedOffset);
    onClose();
  };

  const handleReset = () => {
    onTimezoneChange(undefined);
    setSelectedOffset(detectedOffset);
    onClose();
  };

  const formatOffset = (offset: number) => {
    const hours = Math.floor(Math.abs(offset));
    const minutes = Math.round((Math.abs(offset) - hours) * 60);
    const sign = offset >= 0 ? '+' : '-';
    return `UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full max-w-md mx-4 rounded-lg shadow-xl ${
        theme === 'dark' 
          ? 'bg-tactical-black border border-tactical-amber/20' 
          : 'bg-white border border-gray-200'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          theme === 'dark' ? 'border-tactical-amber/20' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-blue-500" />
            <h3 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Timezone Override
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-md transition-colors ${
              theme === 'dark' 
                ? 'hover:bg-tactical-amber/10 text-gray-400 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Current Status */}
          <div className={`p-3 rounded-lg ${
            theme === 'dark' ? 'bg-tactical-amber/5' : 'bg-blue-50'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Current Status
              </span>
            </div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <div>Detected: {formatOffset(detectedOffset)}</div>
              <div>Active: {formatOffset(currentOffset)} 
                {isUsingOverride && (
                  <span className="ml-2 inline-flex items-center">
                    <Wifi className="w-3 h-3 mr-1" />
                    Override
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Timezone Selection */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Select Timezone
            </label>
            <select
              value={selectedOffset}
              onChange={(e) => setSelectedOffset(Number(e.target.value))}
              className={`w-full p-2 rounded-md border ${
                theme === 'dark' 
                  ? 'bg-tactical-black border-tactical-amber/20 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            >
              {COMMON_TIMEZONES.map((tz) => (
                <option key={tz.offset} value={tz.offset}>
                  {tz.name} ({formatOffset(tz.offset)})
                </option>
              ))}
            </select>
          </div>

          {/* Info */}
          <div className={`text-xs ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            💡 Useful when using VPN or working in a different timezone than your system clock.
          </div>
        </div>

        {/* Footer */}
        <div className={`flex justify-between p-4 border-t ${
          theme === 'dark' ? 'border-tactical-amber/20' : 'border-gray-200'
        }`}>
          <button
            onClick={handleReset}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${
              theme === 'dark' 
                ? 'text-gray-400 hover:text-white hover:bg-tactical-amber/10' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            Reset to Detected
          </button>
          <button
            onClick={handleApply}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${
              theme === 'dark' 
                ? 'bg-tactical-amber text-tactical-black hover:bg-tactical-amber/90' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Apply Override
          </button>
        </div>
      </div>
    </div>
  );
}; 