import React from 'react';
import { Users, Clock, Target } from 'lucide-react';
import { PersonalInfo, TeamMember } from '../types';
import { findCollaborationWindows, formatCollaborationTime, getPeriodEmoji } from '../utils/collaboration';

interface CollaborationPanelProps {
  personalInfo: PersonalInfo;
  teamMembers: TeamMember[];
  theme: 'dark' | 'light';
}

export const CollaborationPanel: React.FC<CollaborationPanelProps> = ({
  personalInfo,
  teamMembers,
  theme,
}) => {
  const windows = findCollaborationWindows(personalInfo, teamMembers);
  const bestWindows = windows.slice(0, 3); // Show top 3 collaboration windows

  if (teamMembers.length === 0) {
    return null;
  }

  return (
    <div className={`rounded-lg p-6 mb-8 border transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-tactical-charcoal border-tactical-gray' 
        : 'bg-white border-gray-200 shadow-lg'
    }`}>
      <div className="flex items-center mb-4">
        <Target className={`w-6 h-6 mr-3 ${
          theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
        }`} />
        <h2 className={`text-xl font-bold font-tactical ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Optimal Collaboration Windows
        </h2>
      </div>

      {bestWindows.length === 0 ? (
        <div className={`text-center py-8 rounded-lg border-2 border-dashed ${
          theme === 'dark' 
            ? 'border-tactical-gray text-gray-400' 
            : 'border-gray-300 text-gray-500'
        }`}>
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-medium mb-1">No Overlapping Available Hours</p>
          <p className="text-sm">
            Team schedules don't currently overlap. Consider adjusting work hours for better coordination.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bestWindows.map((window, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border transition-all duration-200 hover:scale-105 ${
                theme === 'dark'
                  ? 'bg-tactical-black border-tactical-gray hover:border-tactical-amber/50'
                  : 'bg-gray-50 border-gray-200 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-2">{getPeriodEmoji(window.period)}</span>
                <div>
                  <div className={`font-bold ${
                    theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
                  }`}>
                    {formatCollaborationTime(window)}
                  </div>
                  <div className={`text-sm capitalize ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {window.period.replace('-', ' ')}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center mb-2">
                <Users className={`w-4 h-4 mr-2 ${
                  theme === 'dark' ? 'text-radar-green' : 'text-green-600'
                }`} />
                <span className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-radar-green' : 'text-green-600'
                }`}>
                  {window.availableMembers.length} Available
                </span>
              </div>
              
              <div className="space-y-1">
                {window.availableMembers.map((name, memberIndex) => (
                  <div
                    key={memberIndex}
                    className={`text-xs px-2 py-1 rounded ${
                      theme === 'dark'
                        ? 'bg-tactical-gray text-gray-300'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className={`mt-4 text-center text-sm ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
      }`}>
        💡 Times shown in GMT. Windows calculated based on work/sleep schedules.
      </div>
    </div>
  );
};