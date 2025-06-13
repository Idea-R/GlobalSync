import React, { useState } from 'react';
import { Clock, Zap, Settings } from 'lucide-react';
import { schedulePresets, getPresetBySchedule } from '../config/schedulePresets';
import { SchedulePreset } from '../types';

interface ScheduleSelectorProps {
  workHours: string;
  sleepHours: string;
  autoStatus: boolean;
  onScheduleChange: (workHours: string, sleepHours: string) => void;
  onAutoStatusChange: (enabled: boolean) => void;
  theme: 'dark' | 'light';
}

export const ScheduleSelector: React.FC<ScheduleSelectorProps> = ({
  workHours,
  sleepHours,
  autoStatus,
  onScheduleChange,
  onAutoStatusChange,
  theme,
}) => {
  const [showCustom, setShowCustom] = useState(false);
  const [customWork, setCustomWork] = useState(workHours);
  const [customSleep, setCustomSleep] = useState(sleepHours);

  const currentPreset = getPresetBySchedule(workHours, sleepHours);

  const handlePresetSelect = (preset: SchedulePreset) => {
    onScheduleChange(preset.workHours, preset.sleepHours);
    setShowCustom(false);
  };

  const handleCustomSave = () => {
    onScheduleChange(customWork, customSleep);
    setShowCustom(false);
  };

  const formatTimeRange = (range: string) => {
    if (!range) return 'None';
    const [start, end] = range.split('-');
    const formatHour = (h: string) => {
      const hour = parseInt(h);
      if (hour === 0) return '12 AM';
      if (hour < 12) return `${hour} AM`;
      if (hour === 12) return '12 PM';
      return `${hour - 12} PM`;
    };
    return `${formatHour(start)} - ${formatHour(end)}`;
  };

  return (
    <div className="space-y-3">
      {/* Auto Status Toggle */}
      <div className={`p-3 rounded-lg border ${
        theme === 'dark' 
          ? 'bg-tactical-black border-tactical-gray' 
          : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Zap className={`w-5 h-5 mr-2 ${
              theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
            }`} />
            <span className={`font-medium text-sm ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Auto Status Updates
            </span>
          </div>
          <button
            onClick={() => onAutoStatusChange(!autoStatus)}
            className={`relative w-10 h-5 rounded-full transition-colors ${
              autoStatus 
                ? (theme === 'dark' ? 'bg-tactical-amber' : 'bg-blue-600')
                : (theme === 'dark' ? 'bg-tactical-gray' : 'bg-gray-300')
            }`}
          >
            <div className={`absolute w-4 h-4 rounded-full bg-white transition-transform top-0.5 ${
              autoStatus ? 'translate-x-5' : 'translate-x-0.5'
            }`} />
          </button>
        </div>
        <p className={`text-xs ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Automatically update status based on your schedule (Sleep → Deep Work → Available)
        </p>
      </div>

      {/* Current Schedule Display */}
      <div className={`p-3 rounded-lg border ${
        theme === 'dark' 
          ? 'bg-tactical-black border-tactical-gray' 
          : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex items-center mb-3">
          <Clock className={`w-5 h-5 mr-2 ${
            theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
          }`} />
          <span className={`font-medium text-sm ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Current Schedule
          </span>
        </div>
        
        {currentPreset ? (
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-3">{currentPreset.emoji}</span>
            <div>
              <div className={`font-medium text-sm ${
                theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
              }`}>
                {currentPreset.name}
              </div>
              <div className={`text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {currentPreset.description}
              </div>
            </div>
          </div>
        ) : (
          <div className={`font-medium mb-2 text-sm ${
            theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
          }`}>
            Custom Schedule
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className={`font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Work: 
            </span>
            <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
              {formatTimeRange(workHours)}
            </span>
          </div>
          <div>
            <span className={`font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Sleep: 
            </span>
            <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
              {formatTimeRange(sleepHours)}
            </span>
          </div>
        </div>
      </div>

      {/* Schedule Presets */}
      <div>
        <h4 className={`font-medium mb-2 text-sm ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Quick Schedule Presets
        </h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {schedulePresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handlePresetSelect(preset)}
              className={`p-2 rounded-lg border text-left transition-all hover:scale-105 ${
                currentPreset?.name === preset.name
                  ? theme === 'dark'
                    ? 'bg-tactical-amber/20 border-tactical-amber'
                    : 'bg-blue-50 border-blue-300'
                  : theme === 'dark'
                    ? 'bg-tactical-charcoal border-tactical-gray hover:border-tactical-amber/50'
                    : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center mb-1">
                <span className="text-base mr-1">{preset.emoji}</span>
                <span className={`font-medium text-xs ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {preset.name}
                </span>
              </div>
              <div className={`text-xs leading-tight ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Work: {formatTimeRange(preset.workHours)}<br/>
                Sleep: {formatTimeRange(preset.sleepHours)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Schedule */}
      <div>
        <button
          onClick={() => setShowCustom(!showCustom)}
          className={`flex items-center w-full p-2 rounded-lg border transition-colors ${
            theme === 'dark'
              ? 'bg-tactical-charcoal border-tactical-gray hover:border-tactical-amber'
              : 'bg-white border-gray-200 hover:border-blue-500'
          }`}
        >
          <Settings className={`w-4 h-4 mr-2 ${
            theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
          }`} />
          <span className={`font-medium text-sm ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Custom Schedule
          </span>
        </button>

        {showCustom && (
          <div className={`mt-2 p-3 rounded-lg border ${
            theme === 'dark' 
              ? 'bg-tactical-black border-tactical-gray' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Work Hours (24h)
                </label>
                <input
                  type="text"
                  value={customWork}
                  onChange={(e) => setCustomWork(e.target.value)}
                  placeholder="9-17"
                  className={`w-full px-3 py-2 rounded border focus:outline-none text-sm ${
                    theme === 'dark'
                      ? 'bg-tactical-charcoal border-tactical-gray text-white focus:border-tactical-amber'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Sleep Hours (24h)
                </label>
                <input
                  type="text"
                  value={customSleep}
                  onChange={(e) => setCustomSleep(e.target.value)}
                  placeholder="23-7"
                  className={`w-full px-3 py-2 rounded border focus:outline-none text-sm ${
                    theme === 'dark'
                      ? 'bg-tactical-charcoal border-tactical-gray text-white focus:border-tactical-amber'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                  }`}
                />
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleCustomSave}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                  theme === 'dark'
                    ? 'bg-tactical-amber text-tactical-black hover:bg-yellow-500'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Apply Custom Schedule
              </button>
              <button
                onClick={() => setShowCustom(false)}
                className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                  theme === 'dark'
                    ? 'bg-tactical-gray text-white hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};