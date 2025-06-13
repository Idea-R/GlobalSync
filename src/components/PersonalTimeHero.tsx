import React, { useState, useEffect } from 'react';
import { Terminal, Share2, Settings, Globe, Moon, Sun, HelpCircle, Edit3, Download, Upload, Database, X, UserPlus } from 'lucide-react';
import { PersonalInfo, StatusType } from '../types';
import { getCurrentTimeInTimezone, formatTime, suggestStatusByTime, getSchedulePeriod, updateStatusBasedOnSchedule } from '../utils/timezone';
import { detectUserTimezone, formatTimezoneDisplay, getAllTimezones } from '../utils/timezone';
import { generateShareString, copyToClipboard, generateAppShareString, parseAppShareString, parseShareString } from '../utils/shareString';
import { statusConfig, getRandomFlavorText } from '../config/statusConfig';
import { ScheduleSelector } from './ScheduleSelector';
import { AppData } from '../types';

interface PersonalTimeHeroProps {
  personalInfo: PersonalInfo;
  onUpdatePersonalInfo: (updates: Partial<PersonalInfo>) => void;
  onToggleTheme: () => void;
  onToggleHelp: () => void;
  onExportAllAppData: () => void;
  onImportAllAppData: (data: AppData) => void;
  theme: 'dark' | 'light';
  appData: AppData;
}

export const PersonalTimeHero: React.FC<PersonalTimeHeroProps> = ({
  personalInfo,
  onUpdatePersonalInfo,
  onToggleTheme,
  onToggleHelp,
  onExportAllAppData,
  onImportAllAppData,
  theme,
  appData,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(personalInfo.name);
  const [copySuccess, setCopySuccess] = useState(false);
  const [appCopySuccess, setAppCopySuccess] = useState(false);
  const [importString, setImportString] = useState('');
  const [importError, setImportError] = useState('');
  const [flavorText, setFlavorText] = useState('');
  const [detectedTimezone] = useState(() => detectUserTimezone());

  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = getCurrentTimeInTimezone(personalInfo.timezone);
      setCurrentTime(newTime);
      
      // Auto-update status based on schedule if enabled
      const autoStatus = updateStatusBasedOnSchedule(
        newTime, 
        personalInfo.workHours, 
        personalInfo.sleepHours, 
        personalInfo.autoStatus
      );
      
      if (autoStatus && autoStatus !== personalInfo.status) {
        onUpdatePersonalInfo({ status: autoStatus as StatusType });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [personalInfo.timezone, personalInfo.workHours, personalInfo.sleepHours, personalInfo.autoStatus, personalInfo.status, onUpdatePersonalInfo]);

  useEffect(() => {
    setFlavorText(getRandomFlavorText(personalInfo.status));
  }, [personalInfo.status]);

  useEffect(() => {
    setTempName(personalInfo.name);
  }, [personalInfo.name]);

  const handleShareProfile = async () => {
    const shareString = generateShareString(personalInfo);
    const success = await copyToClipboard(shareString);
    
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleExportAllData = async () => {
    const appShareString = generateAppShareString(appData);
    const success = await copyToClipboard(appShareString);
    
    if (success) {
      setAppCopySuccess(true);
      setTimeout(() => setAppCopySuccess(false), 2000);
    }
  };

  const handleImportAllData = () => {
    if (!importString.trim()) {
      setImportError('Please enter an app share string');
      return;
    }

    const parsedData = parseAppShareString(importString.trim());
    if (!parsedData) {
      setImportError('Invalid app share string format. Please check and try again.');
      return;
    }

    onImportAllAppData(parsedData);
    setImportString('');
    setImportError('');
    setShowSettings(false);
  };

  const handleStatusChange = (status: StatusType) => {
    onUpdatePersonalInfo({ status });
    setShowStatusDropdown(false);
  };

  const handleNameEdit = () => {
    if (editingName) {
      onUpdatePersonalInfo({ name: tempName.trim() });
    }
    setEditingName(!editingName);
  };

  const handleNameKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameEdit();
    }
    if (e.key === 'Escape') {
      setTempName(personalInfo.name);
      setEditingName(false);
    }
  };

  const currentPeriod = getSchedulePeriod(currentTime, personalInfo.workHours, personalInfo.sleepHours);
  const suggestedStatus = suggestStatusByTime(currentTime, personalInfo.workHours, personalInfo.sleepHours);

  const periodColors = {
    work: 'bg-steel-blue',
    sleep: 'bg-warning-red',
    available: 'bg-radar-green',
  };

  if (!personalInfo.name) {
    // Auto-populate timezone on first load if not already set
    const shouldAutoPopulate = personalInfo.timezone === 'GMT+0' && detectedTimezone !== 'GMT+0';
    
    const [showImport, setShowImport] = useState(false);
    const [importString, setImportString] = useState('');
    const [importError, setImportError] = useState('');
    
    const handleImportProfile = () => {
      if (!importString.trim()) {
        setImportError('Please enter a profile share string');
        return;
      }

      const parsed = parseShareString(importString.trim());
      if (!parsed || !parsed.name) {
        setImportError('Invalid share string format. Please check and try again.');
        return;
      }

      onUpdatePersonalInfo({
        name: parsed.name,
        timezone: parsed.timezone || 'GMT+0',
        status: (parsed.status as StatusType) || 'vibing',
        workHours: parsed.workHours || '9-17',
        sleepHours: parsed.sleepHours || '23-7',
        autoStatus: parsed.autoStatus !== undefined ? parsed.autoStatus : true,
        avatar: parsed.avatar,
      });
      
      setImportString('');
      setImportError('');
      setShowImport(false);
    };
    
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
          <div className="text-center mb-4">
            <button
              onClick={() => setShowImport(!showImport)}
              className={`text-sm underline transition-colors ${
                theme === 'dark' ? 'text-tactical-amber hover:text-yellow-500' : 'text-blue-600 hover:text-blue-700'
              }`}
            >
              {showImport ? 'Create New Profile' : 'Import Existing Profile'}
            </button>
          </div>
          
          {showImport ? (
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Profile Share String
                </label>
                <textarea
                  value={importString}
                  onChange={(e) => setImportString(e.target.value)}
                  placeholder="Paste GlobalSync://... share string here"
                  className={`w-full px-4 py-3 rounded-lg resize-none focus:outline-none ${
                    theme === 'dark'
                      ? 'bg-tactical-black border border-tactical-gray text-white placeholder-gray-500 focus:border-tactical-amber'
                      : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                  }`}
                  rows={3}
                />
                {importError && (
                  <p className={`text-xs mt-1 ${
                    theme === 'dark' ? 'text-warning-red' : 'text-red-600'
                  }`}>
                    {importError}
                  </p>
                )}
              </div>
              
              <button
                onClick={handleImportProfile}
                disabled={!importString.trim()}
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
  }

  return (
    <div className={`rounded-lg p-8 mb-8 relative animate-tactical-deploy border ${
      theme === 'dark' 
        ? 'bg-tactical-charcoal border-tactical-gray' 
        : 'bg-white border-gray-200 shadow-lg'
    }`}>
      {/* Backdrop overlay for settings */}
      {showSettings && (
        <div 
          className="fixed inset-0 bg-black/20 z-[60]"
          onClick={() => setShowSettings(false)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Terminal className={`w-8 h-8 mr-3 ${
            theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
          }`} />
          <div>
            <div className="flex items-center">
              <h1 className={`text-2xl font-bold font-tactical ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Command Center - 
              </h1>
              {editingName ? (
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onKeyDown={handleNameKeyPress}
                  onBlur={handleNameEdit}
                  className={`ml-2 px-2 py-1 rounded border text-xl font-bold font-tactical bg-transparent focus:outline-none ${
                    theme === 'dark'
                      ? 'text-white border-tactical-amber'
                      : 'text-gray-900 border-blue-500'
                  }`}
                  autoFocus
                />
              ) : (
                <span className={`ml-2 text-2xl font-bold font-tactical ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {personalInfo.name}
                </span>
              )}
              <button
                onClick={handleNameEdit}
                className={`ml-2 p-1 rounded transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-tactical-gray text-gray-400 hover:text-tactical-amber'
                    : 'hover:bg-gray-100 text-gray-500 hover:text-blue-600'
                }`}
                title="Edit name"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              AI Developer Command Terminal • {personalInfo.timezone}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-lg border transition-colors ${
              theme === 'dark'
                ? 'bg-tactical-black border-tactical-gray hover:border-tactical-amber'
                : 'bg-gray-50 border-gray-300 hover:border-blue-500'
            }`}
          >
            {theme === 'dark' ? 
              <Sun className="w-5 h-5 text-tactical-amber" /> : 
              <Moon className="w-5 h-5 text-blue-600" />
            }
          </button>
          
          <button
            onClick={handleExportAllData}
            className={`p-2 rounded-lg border transition-colors ${
              theme === 'dark'
                ? 'bg-tactical-black border-tactical-gray hover:border-tactical-amber'
                : 'bg-gray-50 border-gray-300 hover:border-blue-500'
            }`}
            title="Quick Export All Data"
          >
            <Upload className={`w-5 h-5 ${
              appCopySuccess 
                ? (theme === 'dark' ? 'text-radar-green' : 'text-green-600')
                : (theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600')
            }`} />
          </button>
          
          <button
            onClick={onToggleHelp}
            className={`p-2 rounded-lg border transition-colors ${
              theme === 'dark'
                ? 'bg-tactical-black border-tactical-gray hover:border-tactical-amber'
                : 'bg-gray-50 border-gray-300 hover:border-blue-500'
            }`}
            title="Help & Documentation"
          >
            <HelpCircle className={`w-5 h-5 ${
              theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
            }`} />
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg border transition-colors ${
              theme === 'dark'
                ? 'bg-tactical-black border-tactical-gray hover:border-tactical-amber'
                : 'bg-gray-50 border-gray-300 hover:border-blue-500'
            }`}
          >
            <Settings className={`w-5 h-5 ${
              theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
            }`} />
          </button>
          
          <button
            onClick={handleShareProfile}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors font-medium ${
              theme === 'dark'
                ? 'bg-tactical-amber text-tactical-black hover:bg-yellow-500'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Share2 className="w-4 h-4 mr-2" />
            {copySuccess ? 'Copied!' : 'Share Profile'}
          </button>
        </div>
      </div>

      {/* Main Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Time Display */}
        <div className="lg:col-span-2">
          <div className={`rounded-lg p-6 border ${
            theme === 'dark' 
              ? 'bg-tactical-black border-tactical-gray' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center mb-3">
              <Globe className={`w-5 h-5 mr-2 ${
                theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
              }`} />
              <span className={`font-medium ${
                theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
              }`}>LOCAL TIME</span>
            </div>
            
            <div className={`text-4xl lg:text-6xl font-mono font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {formatTime(currentTime)}
            </div>
            
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${periodColors[currentPeriod]} mr-2 animate-tactical-pulse`} />
              <span className={`text-sm uppercase tracking-wider ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {currentPeriod} period active
              </span>
            </div>
          </div>
        </div>

        {/* Status Control */}
        <div className="relative">
          <div className={`rounded-lg p-6 border ${
            theme === 'dark' 
              ? 'bg-tactical-black border-tactical-gray' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center mb-3">
              <div className="text-2xl mr-2">{statusConfig[personalInfo.status].icon}</div>
              <span className={`font-medium ${
                theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
              }`}>STATUS</span>
            </div>
            
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                theme === 'dark'
                  ? 'bg-tactical-charcoal border-tactical-gray hover:border-tactical-amber'
                  : 'bg-white border-gray-300 hover:border-blue-500'
              }`}
            >
              <div className={`font-medium ${
                theme === 'dark' 
                  ? statusConfig[personalInfo.status].color 
                  : statusConfig[personalInfo.status].color.replace('text-', 'text-')
              }`}>
                {statusConfig[personalInfo.status].label}
              </div>
              <div className={`text-sm mt-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {statusConfig[personalInfo.status].description}
              </div>
            </button>
            
            {showStatusDropdown && (
              <div className={`absolute top-full left-0 right-0 mt-2 rounded-lg shadow-xl z-50 border ${
                theme === 'dark' 
                  ? 'bg-tactical-black border-tactical-gray' 
                  : 'bg-white border-gray-200'
              }`}>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => handleStatusChange(key as StatusType)}
                    className={`w-full text-left p-3 transition-colors border-b last:border-b-0 ${
                      theme === 'dark'
                        ? 'hover:bg-tactical-charcoal border-tactical-gray'
                        : 'hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-xl mr-3">{config.icon}</span>
                      <div>
                        <div className={`font-medium ${
                          theme === 'dark' ? config.color : config.color
                        }`}>
                          {config.label}
                        </div>
                        <div className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {config.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Flavor Text */}
      <div className="mt-6 text-center">
        <p className={`text-sm italic ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {flavorText}
        </p>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className={`absolute top-full left-0 right-0 mt-2 rounded-lg shadow-2xl z-[100] border backdrop-blur-sm ${
          theme === 'dark' 
            ? 'bg-tactical-black/95 border-tactical-gray' 
            : 'bg-white/95 border-gray-200'
        }`}>
          {/* Settings Header with Close Button */}
          <div className={`flex items-center justify-between px-6 py-4 border-b ${
            theme === 'dark' ? 'border-tactical-gray' : 'border-gray-200'
          }`}>
            <div className="flex items-center">
              <Settings className={`w-5 h-5 mr-2 ${
                theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
              }`} />
              <h3 className={`text-lg font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Configuration</h3>
            </div>
            <button
              onClick={() => setShowSettings(false)}
              className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 border ${
                theme === 'dark' 
                  ? 'hover:bg-tactical-gray text-gray-400 hover:text-white border-tactical-gray hover:border-tactical-amber' 
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700 border-gray-300 hover:border-blue-500'
              }`}
              title="Close Configuration"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="px-6 py-4">
            {/* Schedule Configuration - Compact Layout */}
            <div className="mb-6">
              <ScheduleSelector
                workHours={personalInfo.workHours}
                sleepHours={personalInfo.sleepHours}
                autoStatus={personalInfo.autoStatus}
                onScheduleChange={(workHours, sleepHours) => 
                  onUpdatePersonalInfo({ workHours, sleepHours })
                }
                onAutoStatusChange={(autoStatus) => 
                  onUpdatePersonalInfo({ autoStatus })
                }
                theme={theme}
              />
            </div>
            
            {/* Data Management Section */}
            <div className={`pt-4 border-t ${
              theme === 'dark' ? 'border-tactical-gray' : 'border-gray-200'
            }`}>
              <div className="flex items-center mb-4">
                <Database className={`w-5 h-5 mr-2 ${
                  theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
                }`} />
                <h4 className={`font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Data Management
                </h4>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Export All Data */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Backup Complete Setup
                  </label>
                  <button
                    onClick={handleExportAllData}
                    className={`w-full flex items-center justify-center px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                      theme === 'dark'
                        ? 'bg-tactical-amber text-tactical-black hover:bg-yellow-500'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {appCopySuccess ? 'Copied to Clipboard!' : 'Export All Data'}
                  </button>
                  <p className={`text-xs mt-1 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Exports personal info, team members, and theme settings
                  </p>
                </div>
                
                {/* Import All Data */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Restore from Backup
                  </label>
                  <div className="space-y-2">
                    <textarea
                      value={importString}
                      onChange={(e) => setImportString(e.target.value)}
                      placeholder="Paste GlobalSyncApp:// string here"
                      className={`w-full px-3 py-2 rounded-lg resize-none focus:outline-none text-sm ${
                        theme === 'dark'
                          ? 'bg-tactical-charcoal border border-tactical-gray text-white placeholder-gray-500 focus:border-tactical-amber'
                          : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                      }`}
                      rows={1}
                    />
                    <button
                      onClick={handleImportAllData}
                      disabled={!importString.trim()}
                      className={`w-full flex items-center justify-center px-4 py-2 rounded-lg transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                        theme === 'dark'
                          ? 'bg-radar-green text-tactical-black hover:bg-green-400'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Import All Data
                    </button>
                    {importError && (
                      <p className={`text-xs ${
                        theme === 'dark' ? 'text-warning-red' : 'text-red-600'
                      }`}>
                        {importError}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};