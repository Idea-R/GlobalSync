import React, { useState } from 'react';
import { Settings, X, Upload, Download } from 'lucide-react';
import { PersonalInfo, AppData } from '../types';
import { ScheduleSelector } from './ScheduleSelector';
import { useDataImportExport } from './PersonalTimeHero/hooks/useDataImportExport';
import { generateAppShareString, copyToClipboard } from '../utils/shareString';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  personalInfo: PersonalInfo;
  onUpdatePersonalInfo: (updates: Partial<PersonalInfo>) => void;
  onImportAllAppData: (data: AppData) => void;
  appData: AppData;
  theme: 'dark' | 'light';
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  personalInfo,
  onUpdatePersonalInfo,
  onImportAllAppData,
  appData,
  theme,
}) => {
  const {
    importString,
    importError,
    handleImportAllData,
    setImportString,
  } = useDataImportExport(appData, onImportAllAppData);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-tactical flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl border animate-tactical-deploy ${
        theme === 'dark' 
          ? 'bg-tactical-charcoal border-tactical-gray' 
          : 'bg-white border-gray-200 shadow-2xl'
      }`}>
        <div className={`flex items-center justify-between px-4 sm:px-6 py-4 border-b ${
          theme === 'dark' ? 'border-tactical-gray' : 'border-gray-200'
        }`}>
          <div className="flex items-center">
            <Settings className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 ${
              theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
            }`} />
            <h3 className={`text-base sm:text-lg font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Configuration</h3>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 border ${
              theme === 'dark' 
                ? 'hover:bg-tactical-gray text-gray-400 hover:text-white border-tactical-gray hover:border-tactical-amber' 
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700 border-gray-300 hover:border-blue-500'
            }`}
            title="Close Configuration"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
        
        <div className="px-4 sm:px-6 py-4">
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
          
          {/* Import/Export Data */}
          <div className={`pt-4 border-t ${
            theme === 'dark' ? 'border-tactical-gray' : 'border-gray-200'
          }`}>
            <div className="grid grid-cols-1 gap-6">
              {/* Export Section */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Export Complete Setup
                </label>
                <p className={`text-xs mb-3 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Export your complete GlobalSync setup including personal info, team members, and theme settings.
                </p>
                <button
                  onClick={async () => {
                    const appShareString = generateAppShareString(appData);
                    const success = await copyToClipboard(appShareString);
                    if (success) {
                      console.log('Export successful!');
                    } else {
                      console.error('Export failed');
                    }
                  }}
                  className={`w-full flex items-center justify-center px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                    theme === 'dark'
                      ? 'bg-tactical-amber text-tactical-black hover:bg-yellow-500'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Copy Export String
                </button>
              </div>

              {/* Import Section */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Import from Backup
                </label>
                <p className={`text-xs mb-3 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Restore your complete setup from a previously exported GlobalSyncApp:// string.
                </p>
                <div className="space-y-2">
                  <textarea
                    value={importString}
                    onChange={(e) => setImportString(e.target.value)}
                    placeholder="Paste GlobalSyncApp:// string here..."
                    className={`w-full px-3 py-2 rounded-lg resize-none focus:outline-none text-sm ${
                      theme === 'dark'
                        ? 'bg-tactical-charcoal border border-tactical-gray text-white placeholder-gray-500 focus:border-tactical-amber'
                        : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                    }`}
                    rows={3}
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
    </div>
  );
}; 