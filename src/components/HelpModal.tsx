import React from 'react';
import { X, Share2, Users, Clock, Target, Zap, HelpCircle } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, theme }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-tactical flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-tactical-deploy ${
        theme === 'dark' 
          ? 'bg-tactical-charcoal border border-tactical-gray' 
          : 'bg-white border border-gray-200 shadow-2xl'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <HelpCircle className={`w-6 h-6 mr-3 ${
              theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
            }`} />
            <h2 className={`text-2xl font-bold font-tactical ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              GlobalSync Command Manual
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-3 rounded-lg transition-all duration-200 hover:scale-110 border ${
              theme === 'dark' 
                ? 'hover:bg-tactical-gray text-gray-400 hover:text-white border-tactical-gray hover:border-tactical-amber' 
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700 border-gray-300 hover:border-blue-500'
            }`}
            title="Close Help Manual"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Getting Started */}
          <section>
            <h3 className={`text-lg font-bold mb-3 flex items-center ${
              theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
            }`}>
              <Zap className="w-5 h-5 mr-2" />
              Getting Started
            </h3>
            <div className={`space-y-2 text-sm ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <p>1. <strong>Set your name and timezone</strong> in the command center at the top</p>
              <p>2. <strong>Configure your schedule</strong> using the settings gear icon (work hours & sleep hours)</p>
              <p>3. <strong>Add team members</strong> by clicking "Add Developer" or importing share strings</p>
              <p>4. <strong>Update your status</strong> to let your team know what you're working on</p>
            </div>
          </section>

          {/* Sharing System */}
          <section>
            <h3 className={`text-lg font-bold mb-3 flex items-center ${
              theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
            }`}>
              <Share2 className="w-5 h-5 mr-2" />
              Team Sharing System
            </h3>
            <div className={`space-y-3 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <div className={`p-3 rounded-lg text-sm ${
                theme === 'dark' ? 'bg-tactical-black border border-tactical-gray' : 'bg-gray-50 border border-gray-200'
              }`}>
                <strong>Share String Format:</strong><br />
                <code className={`text-xs ${theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'}`}>
                  GlobalSync://Name|Timezone|Status|WorkHours|SleepHours|Avatar|AutoStatus
                </code>
              </div>
              <div className={`p-3 rounded-lg text-sm ${
                theme === 'dark' ? 'bg-tactical-black border border-tactical-gray' : 'bg-gray-50 border border-gray-200'
              }`}>
                <strong>Complete App Data Format:</strong><br />
                <code className={`text-xs ${theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'}`}>
                  GlobalSyncApp://PersonalInfo~TeamMembers~Theme
                </code>
              </div>
              <p className="text-sm">
                <strong>To share your profile:</strong> Click "Share Profile" to copy your complete setup including schedule
              </p>
              <p className="text-sm">
                <strong>To add teammates:</strong> Click "Add Developer" → "Import Profile" → paste their share string
              </p>
              <p className="text-sm">
                <strong>To backup/restore everything:</strong> Use "Export All Data" in settings to backup your complete setup, or "Import All Data" to restore from backup
              </p>
            </div>
          </section>

          {/* Status System */}
          <section>
            <h3 className={`text-lg font-bold mb-3 flex items-center ${
              theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
            }`}>
              <Users className="w-5 h-5 mr-2" />
              AI Developer Status Codes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {[
                { icon: '🎵', label: 'Vibing/Shipping', desc: 'In the flow, shipping code' },
                { icon: '💼', label: 'Deep Work', desc: 'Focused coding session' },
                { icon: '🚶', label: 'AFK/Grass', desc: 'Away from keyboard' },
                { icon: '😴', label: 'Sleep Mode', desc: 'Offline for rest' },
                { icon: '💬', label: 'Ready to Pair', desc: 'Available for collaboration' },
                { icon: '🎙️', label: 'Voice/AI Chat', desc: 'In voice or AI session' }
              ].map((status, index) => (
                <div key={index} className={`p-2 rounded border ${
                  theme === 'dark' ? 'bg-tactical-black border-tactical-gray' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center mb-1">
                    <span className="text-lg mr-2">{status.icon}</span>
                    <strong className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                      {status.label}
                    </strong>
                  </div>
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    {status.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Schedule System */}
          <section>
            <h3 className={`text-lg font-bold mb-3 flex items-center ${
              theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
            }`}>
              <Clock className="w-5 h-5 mr-2" />
              Schedule Coordination
            </h3>
            <div className={`space-y-2 text-sm ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <p><strong>Work Hours:</strong> Use 24-hour format (e.g., "9-17" for 9 AM to 5 PM)</p>
              <p><strong>Sleep Hours:</strong> Can cross midnight (e.g., "23-7" for 11 PM to 7 AM)</p>
              <p><strong>Available Hours:</strong> Automatically calculated as time outside work/sleep</p>
              <p><strong>Smart Suggestions:</strong> Status suggestions based on your current time vs schedule</p>
            </div>
          </section>

          {/* Collaboration Windows */}
          <section>
            <h3 className={`text-lg font-bold mb-3 flex items-center ${
              theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
            }`}>
              <Target className="w-5 h-5 mr-2" />
              Collaboration Windows
            </h3>
            <div className={`space-y-2 text-sm ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <p>GlobalSync automatically finds optimal collaboration times by analyzing everyone's schedules</p>
              <p><strong>Overlap Detection:</strong> Shows when 2+ team members are available simultaneously</p>
              <p><strong>Period Classification:</strong> Groups windows by time of day (morning, afternoon, etc.)</p>
              <p><strong>Smart Recommendations:</strong> Prioritizes longer windows with more available members</p>
            </div>
          </section>

          {/* Tips */}
          <section>
            <h3 className={`text-lg font-bold mb-3 ${
              theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
            }`}>
              💡 Pro Tips
            </h3>
            <div className={`space-y-1 text-sm ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <p>• All data is stored locally - no account required</p>
              <p>• Use the theme toggle for light/dark mode preferences</p>
              <p>• Status updates in real-time across all team member cards</p>
              <p>• Schedule bars show current period (red=sleep, blue=work, green=available)</p>
              <p>• Flavor text changes randomly to keep things fun</p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className={`mt-6 pt-6 border-t ${
          theme === 'dark' 
            ? 'border-tactical-gray text-gray-400' 
            : 'border-gray-200 text-gray-500'
        }`}>
          <div className="text-center text-sm mb-4">
            Built for elite AI-assisted coding teams who ship around the clock 🌍
          </div>
          
          {/* Close Button in Footer */}
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className={`flex items-center px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105 font-medium ${
                theme === 'dark'
                  ? 'bg-tactical-amber text-tactical-black hover:bg-yellow-500'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Close Manual
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};