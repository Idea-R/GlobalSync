import React, { useState } from 'react';
import { X, UserPlus, Download, User } from 'lucide-react';
import { TeamMember, StatusType } from '../types';
import { parseShareString } from '../utils/shareString';
import { getAllTimezones, formatTimezoneDisplay } from '../utils/timezone';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (member: Omit<TeamMember, 'id' | 'lastUpdated'>) => void;
  theme: 'dark' | 'light';
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  onAddMember,
  theme,
}) => {
  const [mode, setMode] = useState<'custom' | 'import'>('custom');
  const [shareString, setShareString] = useState('');
  const [customData, setCustomData] = useState({
    name: '',
    timezone: 'GMT+0',
    status: 'vibing' as StatusType,
    workHours: '9-17',
    sleepHours: '23-7',
    autoStatus: true,
    avatar: '',
  });
  const [error, setError] = useState('');

  const handleImport = () => {
    const parsed = parseShareString(shareString.trim());
    
    if (!parsed || !parsed.name) {
      setError('Invalid share string format. Please check and try again.');
      return;
    }
    
    onAddMember({
      name: parsed.name,
      timezone: parsed.timezone || 'GMT+0',
      status: (parsed.status as StatusType) || 'vibing',
      workHours: parsed.workHours || '9-17',
      sleepHours: parsed.sleepHours || '23-7',
      autoStatus: parsed.autoStatus !== undefined ? parsed.autoStatus : true,
      avatar: parsed.avatar,
    });
    
    handleClose();
  };

  const handleCustomAdd = () => {
    if (!customData.name.trim()) {
      setError('Developer name is required.');
      return;
    }
    
    onAddMember(customData);
    handleClose();
  };

  const handleClose = () => {
    setShareString('');
    setCustomData({
      name: '',
      timezone: 'GMT+0',
      status: 'vibing',
      workHours: '9-17',
      sleepHours: '23-7',
      autoStatus: true,
      avatar: '',
    });
    setError('');
    setMode('custom');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-tactical flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg p-6 w-full max-w-md animate-tactical-deploy border ${
        theme === 'dark' 
          ? 'bg-tactical-charcoal border-tactical-gray' 
          : 'bg-white border-gray-200 shadow-2xl'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold flex items-center ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <UserPlus className={`w-5 h-5 mr-2 ${
              theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
            }`} />
            Deploy New Developer
          </h2>
          <button
            onClick={handleClose}
            className={`p-1 rounded transition-colors ${
              theme === 'dark' 
                ? 'hover:bg-tactical-gray text-gray-400' 
                : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className={`flex rounded-lg mb-6 overflow-hidden border ${
          theme === 'dark' ? 'border-tactical-gray' : 'border-gray-300'
        }`}>
          <button
            onClick={() => setMode('custom')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center ${
              mode === 'custom'
                ? theme === 'dark' 
                  ? 'bg-tactical-amber text-tactical-black'
                  : 'bg-blue-600 text-white'
                : theme === 'dark'
                  ? 'bg-tactical-black text-gray-400 hover:text-white'
                  : 'bg-gray-50 text-gray-600 hover:text-gray-900'
            }`}
          >
            <User className="w-4 h-4 mr-2" />
            Add Custom
          </button>
          <button
            onClick={() => setMode('import')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center ${
              mode === 'import'
                ? theme === 'dark'
                  ? 'bg-tactical-amber text-tactical-black'
                  : 'bg-blue-600 text-white'
                : theme === 'dark'
                  ? 'bg-tactical-black text-gray-400 hover:text-white'
                  : 'bg-gray-50 text-gray-600 hover:text-gray-900'
            }`}
          >
            <Download className="w-4 h-4 mr-2" />
            Import Profile
          </button>
        </div>

        {error && (
          <div className={`rounded-lg p-3 mb-4 border ${
            theme === 'dark'
              ? 'bg-warning-red/20 border-warning-red'
              : 'bg-red-50 border-red-200'
          }`}>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-warning-red' : 'text-red-700'
            }`}>{error}</p>
          </div>
        )}

        {mode === 'import' ? (
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Share String
              </label>
              <textarea
                value={shareString}
                onChange={(e) => setShareString(e.target.value)}
                placeholder="Paste GlobalSync://... share string here"
                className={`w-full px-3 py-2 rounded-lg resize-none focus:outline-none ${
                  theme === 'dark'
                    ? 'bg-tactical-black border border-tactical-gray text-white placeholder-gray-500 focus:border-tactical-amber'
                    : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                }`}
                rows={4}
              />
              <p className={`text-xs mt-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Format: GlobalSync://Name|Timezone|Status|WorkHours|SleepHours|Avatar|AutoStatus
              </p>
            </div>
            
            <button
              onClick={handleImport}
              disabled={!shareString.trim()}
              className={`w-full px-4 py-3 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                theme === 'dark'
                  ? 'bg-tactical-amber text-tactical-black hover:bg-yellow-500'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Import Developer Profile
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Developer Name *
              </label>
              <input
                type="text"
                value={customData.name}
                onChange={(e) => setCustomData({ ...customData, name: e.target.value })}
                placeholder="Enter developer name"
                className={`w-full px-3 py-2 rounded-lg focus:outline-none ${
                  theme === 'dark'
                    ? 'bg-tactical-black border border-tactical-gray text-white placeholder-gray-500 focus:border-tactical-amber'
                    : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                }`}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Timezone
                </label>
                <select
                  value={customData.timezone}
                  onChange={(e) => setCustomData({ ...customData, timezone: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg focus:outline-none ${
                    theme === 'dark'
                      ? 'bg-tactical-black border border-tactical-gray text-white focus:border-tactical-amber'
                      : 'bg-gray-50 border border-gray-300 text-gray-900 focus:border-blue-500'
                  }`}
                >
                  {getAllTimezones().map(tz => (
                    <option key={tz} value={tz}>{formatTimezoneDisplay(tz)}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Initial Status
                </label>
                <select
                  value={customData.status}
                  onChange={(e) => setCustomData({ ...customData, status: e.target.value as StatusType })}
                  className={`w-full px-3 py-2 rounded-lg focus:outline-none ${
                    theme === 'dark'
                      ? 'bg-tactical-black border border-tactical-gray text-white focus:border-tactical-amber'
                      : 'bg-gray-50 border border-gray-300 text-gray-900 focus:border-blue-500'
                  }`}
                >
                  <option value="vibing">Vibing/Shipping</option>
                  <option value="deepwork">Deep Work</option>
                  <option value="afk">AFK/Grass</option>
                  <option value="sleep">Sleep Mode</option>
                  <option value="pair">Ready to Pair</option>
                  <option value="voice">Voice/AI Chat</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Work Hours
                </label>
                <input
                  type="text"
                  value={customData.workHours}
                  onChange={(e) => setCustomData({ ...customData, workHours: e.target.value })}
                  placeholder="9-17"
                  className={`w-full px-3 py-2 rounded-lg focus:outline-none ${
                    theme === 'dark'
                      ? 'bg-tactical-black border border-tactical-gray text-white placeholder-gray-500 focus:border-tactical-amber'
                      : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Sleep Hours
                </label>
                <input
                  type="text"
                  value={customData.sleepHours}
                  onChange={(e) => setCustomData({ ...customData, sleepHours: e.target.value })}
                  placeholder="23-7"
                  className={`w-full px-3 py-2 rounded-lg focus:outline-none ${
                    theme === 'dark'
                      ? 'bg-tactical-black border border-tactical-gray text-white placeholder-gray-500 focus:border-tactical-amber'
                      : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                  }`}
                />
              </div>
            </div>
            
            <button
              onClick={handleCustomAdd}
              disabled={!customData.name.trim()}
              className={`w-full px-4 py-3 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                theme === 'dark'
                  ? 'bg-tactical-amber text-tactical-black hover:bg-yellow-500'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Deploy Developer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};