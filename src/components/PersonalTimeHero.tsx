import React, { useState, useEffect } from 'react';
import { Terminal, Share2, Settings, Globe, Moon, Sun, HelpCircle, Edit3, Download, Upload, Database, X, UserPlus } from 'lucide-react';
import { PersonalInfo, StatusType } from '../types';
import { getCurrentTimeInTimezone, formatTime, suggestStatusByTime, getSchedulePeriod, updateStatusBasedOnSchedule } from '../utils/timezone';
import { detectUserTimezone, formatTimezoneDisplay, getAllTimezones } from '../utils/timezone';
import { generateShareString, copyToClipboard, generateAppShareString, parseAppShareString, parseShareString } from '../utils/shareString';
import { statusConfig, getRandomFlavorText } from '../config/statusConfig';
import { ScheduleSelector } from './ScheduleSelector';
import { AppData } from '../types';
import { ProfileInitialization } from './PersonalTimeHero/components/ProfileInitialization';
import { useDataImportExport } from './PersonalTimeHero/hooks/useDataImportExport';
import { useNameEditor } from './PersonalTimeHero/hooks/useNameEditor';
import { useTitleEditor } from './PersonalTimeHero/hooks/useTitleEditor';

interface PersonalTimeHeroProps {
  personalInfo: PersonalInfo;
  onUpdatePersonalInfo: (updates: Partial<PersonalInfo>) => void;
  onToggleTheme: () => void;
  onToggleHelp: () => void;
  onToggleTimezoneOverride: () => void;
  onToggleSettings: () => void;
  onExportAllAppData: () => void;
  onImportAllAppData: (data: AppData) => void;
  theme: 'dark' | 'light';
  appData: AppData;
  timezoneOverride?: number;
}

export const PersonalTimeHero: React.FC<PersonalTimeHeroProps> = ({
  personalInfo,
  onUpdatePersonalInfo,
  onToggleTheme,
  onToggleHelp,
  onToggleTimezoneOverride,
  onToggleSettings,
  onExportAllAppData,
  onImportAllAppData,
  theme,
  appData,
  timezoneOverride,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [flavorText, setFlavorText] = useState('');

  // Custom hooks
  const {
    appCopySuccess,
    importString,
    importError,
    handleExportAllData,
    handleImportAllData,
    setImportString,
  } = useDataImportExport(appData, onImportAllAppData);

  const {
    editingName,
    tempName,
    setTempName,
    handleNameEdit,
    handleNameKeyPress,
  } = useNameEditor(personalInfo, onUpdatePersonalInfo);

  const {
    editingTitle,
    tempTitle,
    setTempTitle,
    handleTitleEdit,
    handleTitleKeyPress,
  } = useTitleEditor(personalInfo, onUpdatePersonalInfo);

  // Time and status management
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

  const handleShareProfile = async () => {
    const shareString = generateShareString(personalInfo);
    const success = await copyToClipboard(shareString);
    
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleStatusChange = (status: StatusType) => {
    onUpdatePersonalInfo({ status });
    setShowStatusDropdown(false);
  };

  const currentPeriod = getSchedulePeriod(currentTime, personalInfo.workHours, personalInfo.sleepHours);
  const suggestedStatus = suggestStatusByTime(currentTime, personalInfo.workHours, personalInfo.sleepHours);

  const periodColors = {
    work: 'bg-steel-blue',
    sleep: 'bg-warning-red',
    available: 'bg-radar-green',
  };

  // Show ProfileInitialization if no name is set
  if (!personalInfo.name) {
    return (
      <ProfileInitialization
        personalInfo={personalInfo}
        onUpdatePersonalInfo={onUpdatePersonalInfo}
        theme={theme}
      />
    );
  }

  return (
    <div className={`rounded-lg p-4 sm:p-6 lg:p-8 mb-8 relative animate-tactical-deploy border ${
      theme === 'dark' 
        ? 'bg-tactical-charcoal border-tactical-gray' 
        : 'bg-white border-gray-200 shadow-lg'
    }`}>


      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center">
          {/* Logo Only Version */}
          <img 
            src="/GlobalSnycLogoOnly.png" 
            alt="GlobalSync Logo" 
            className="max-w-16 sm:max-w-20 lg:max-w-24 h-auto mr-3 sm:mr-4"
          />
          <div>
            <div className="flex items-center flex-wrap">
              <h1 className={`text-lg sm:text-xl lg:text-2xl font-bold font-tactical ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Command Center
              </h1>
              {editingName ? (
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onKeyDown={handleNameKeyPress}
                  onBlur={handleNameEdit}
                  className={`ml-2 sm:ml-3 px-2 py-1 rounded border text-base sm:text-lg font-bold font-tactical bg-transparent focus:outline-none ${
                    theme === 'dark'
                      ? 'text-white border-tactical-amber'
                      : 'text-gray-900 border-blue-500'
                  }`}
                  autoFocus
                />
              ) : (
                <span className={`ml-2 sm:ml-3 text-base sm:text-lg lg:text-xl font-bold font-tactical ${
                  theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
                }`}>
                  - {personalInfo.name}
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
                <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
            <p className={`text-xs sm:text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {editingTitle ? (
                <input
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onKeyDown={handleTitleKeyPress}
                  onBlur={handleTitleEdit}
                  placeholder="Enter your role/title"
                  className={`px-2 py-0.5 rounded border text-xs sm:text-sm bg-transparent focus:outline-none ${
                    theme === 'dark'
                      ? 'text-white border-tactical-amber placeholder-gray-500'
                      : 'text-gray-900 border-blue-500 placeholder-gray-400'
                  }`}
                  autoFocus
                />
              ) : (
                <>
                  {personalInfo.title ? (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mr-2 cursor-pointer hover:opacity-80 transition-opacity ${
                      theme === 'dark'
                        ? 'bg-tactical-amber/20 text-tactical-amber border border-tactical-amber/30'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`} onClick={handleTitleEdit}>
                      {personalInfo.title}
                    </span>
                  ) : (
                    <button
                      onClick={handleTitleEdit}
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mr-2 hover:opacity-80 transition-opacity ${
                        theme === 'dark'
                          ? 'bg-tactical-gray/50 text-gray-400 border border-tactical-gray hover:border-tactical-amber'
                          : 'bg-gray-100 text-gray-500 border border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <Edit3 className="w-3 h-3 mr-1" />
                      Add Role
                    </button>
                  )}
                  • Elite AI Developer Operations • {personalInfo.timezone}
                </>
              )}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3 flex-wrap">
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-lg border transition-colors ${
              theme === 'dark'
                ? 'bg-tactical-black border-tactical-gray hover:border-tactical-amber'
                : 'bg-gray-50 border-gray-300 hover:border-blue-500'
            }`}
          >
            {theme === 'dark' ? 
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-tactical-amber" /> : 
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            }
          </button>
          
          <button
            onClick={handleExportAllData}
            className={`p-2 rounded-lg border transition-colors ${
              theme === 'dark'
                ? 'bg-tactical-black border-tactical-gray hover:border-tactical-amber'
                : 'bg-gray-50 border-gray-300 hover:border-blue-500'
            } ${appCopySuccess ? 'ring-2 ring-green-500' : ''}`}
            title={appCopySuccess ? "Exported to Clipboard!" : "Export All Data to Clipboard"}
          >
            <Upload className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
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
            <HelpCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${
              theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
            }`} />
          </button>
          
          <button
            onClick={onToggleTimezoneOverride}
            className={`p-2 rounded-lg border transition-colors ${
              theme === 'dark'
                ? 'bg-tactical-black border-tactical-gray hover:border-tactical-amber'
                : 'bg-gray-50 border-gray-300 hover:border-blue-500'
            } ${timezoneOverride !== undefined ? 'ring-2 ring-blue-500' : ''}`}
            title={`Timezone Override ${timezoneOverride !== undefined ? '(Active)' : ''}`}
          >
            <Globe className={`w-4 h-4 sm:w-5 sm:h-5 ${
              timezoneOverride !== undefined 
                ? 'text-blue-500' 
                : (theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600')
            }`} />
          </button>
          
          <button
            onClick={onToggleSettings}
            className={`p-2 rounded-lg border transition-colors ${
              theme === 'dark'
                ? 'bg-tactical-black border-tactical-gray hover:border-tactical-amber'
                : 'bg-gray-50 border-gray-300 hover:border-blue-500'
            }`}
          >
            <Settings className={`w-4 h-4 sm:w-5 sm:h-5 ${
              theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
            }`} />
          </button>
          
          <button
            onClick={handleShareProfile}
            className={`flex items-center px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-colors font-medium text-sm sm:text-base ${
              theme === 'dark'
                ? 'bg-tactical-amber text-tactical-black hover:bg-yellow-500'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Share2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">{copySuccess ? 'Copied!' : 'Share Profile'}</span>
            <span className="sm:hidden">{copySuccess ? '✓' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main Display - Fixed grid layout for equal heights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Time Display */}
        <div className="order-1">
          <div className={`rounded-lg p-4 sm:p-6 border h-full flex flex-col justify-between ${
            theme === 'dark' 
              ? 'bg-tactical-black border-tactical-gray' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center mb-3">
              <Globe className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 ${
                theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
              }`} />
              <span className={`font-medium text-sm sm:text-base ${
                theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
              }`}>LOCAL TIME</span>
            </div>
            
            <div className={`text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-mono font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {formatTime(currentTime)}
            </div>
            
            <div className="flex items-center">
              <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-2 ${periodColors[currentPeriod]}`} />
              <span className={`text-xs sm:text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Currently in {currentPeriod} period
                {suggestedStatus && (
                  <span className="hidden sm:inline">
                    {` • Suggested: ${statusConfig[suggestedStatus].label}`}
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Status Display - Matching height */}
        <div className="relative order-2">
          <div
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            className={`rounded-lg p-4 sm:p-6 border cursor-pointer transition-colors h-full flex flex-col justify-between ${
              theme === 'dark' 
                ? 'bg-tactical-black border-tactical-gray hover:border-tactical-amber' 
                : 'bg-gray-50 border-gray-200 hover:border-blue-500'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`font-medium text-sm sm:text-base ${
                theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
              }`}>STATUS</span>
              <span className="text-xl sm:text-2xl">{statusConfig[personalInfo.status].icon}</span>
            </div>
            
            <div className="flex-grow flex flex-col justify-center">
              <div className={`font-bold text-base sm:text-lg lg:text-xl ${
                theme === 'dark' 
                  ? statusConfig[personalInfo.status].color 
                  : statusConfig[personalInfo.status].color.replace('text-', 'text-')
              }`}>
                {statusConfig[personalInfo.status].label}
              </div>
              <div className={`text-xs sm:text-sm mt-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {statusConfig[personalInfo.status].description}
              </div>
            </div>
          </div>
          
          {showStatusDropdown && (
            <div className={`absolute top-full left-0 right-0 mt-2 rounded-lg shadow-xl z-[60] border backdrop-blur-sm ${
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
                    <span className="text-lg sm:text-xl mr-3">{config.icon}</span>
                    <div>
                      <div className={`font-medium text-sm sm:text-base ${
                        theme === 'dark' ? config.color : config.color
                      }`}>
                        {config.label}
                      </div>
                      <div className={`text-xs sm:text-sm ${
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

      {/* Flavor Text */}
      <div className="mt-4 sm:mt-6 text-center">
        <p className={`text-xs sm:text-sm italic ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {flavorText}
        </p>
      </div>


    </div>
  );
};