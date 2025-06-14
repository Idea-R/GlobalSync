import React from 'react';
import { TeamMember } from '../types';
import { Clock, MapPin, Briefcase, Edit2, Trash2, User } from 'lucide-react';
import { statusConfig } from '../config/statusConfig';
import { formatTimezoneDisplay, getCurrentTimeInTimezone, formatTimeWithAMPM } from '../utils/timezone';

interface TeamListProps {
  teamMembers: TeamMember[];
  onUpdateMember: (id: string, updates: Partial<TeamMember>) => void;
  onDeleteMember: (id: string) => void;
  theme: 'dark' | 'light';
}

export const TeamList: React.FC<TeamListProps> = ({
  teamMembers,
  onUpdateMember,
  onDeleteMember,
  theme,
}) => {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className={`grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium uppercase tracking-wider ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }`}>
        <div className="col-span-3">Developer</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Local Time</div>
        <div className="col-span-2">Timezone</div>
        <div className="col-span-3">Actions</div>
      </div>

      {/* List Items */}
      {teamMembers.map((member) => {
        const memberStatusConfig = statusConfig[member.status];
        const currentTime = getCurrentTimeInTimezone(member.timezone);
        
        return (
          <div
            key={member.id}
            className={`grid grid-cols-12 gap-4 px-4 py-3 rounded-lg border transition-all ${
              theme === 'dark'
                ? 'bg-tactical-charcoal border-tactical-gray hover:border-tactical-amber/50'
                : 'bg-white border-gray-200 hover:border-blue-300 shadow-sm'
            }`}
          >
            {/* Developer Info */}
            <div className="col-span-3 flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                theme === 'dark' ? 'bg-tactical-gray' : 'bg-gray-200'
              }`}>
                {member.avatar || member.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className={`font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {member.name}
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-0.5 ${
                  member.title
                    ? theme === 'dark'
                      ? 'bg-tactical-amber/20 text-tactical-amber border border-tactical-amber/30'
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                    : theme === 'dark'
                      ? 'bg-tactical-gray/30 text-gray-500 border border-tactical-gray/50'
                      : 'bg-gray-100 text-gray-500 border border-gray-200'
                }`}>
                  {member.title || 'No role assigned'}
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="col-span-2 flex items-center">
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                theme === 'dark' ? 'bg-tactical-gray' : 'bg-gray-100'
              }`}>
                <span className="mr-1">{memberStatusConfig.icon}</span>
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                  {memberStatusConfig.label}
                </span>
              </div>
            </div>

            {/* Local Time */}
            <div className="col-span-2 flex items-center">
              <Clock className={`w-4 h-4 mr-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                {formatTimeWithAMPM(currentTime)}
              </span>
            </div>

            {/* Timezone */}
            <div className="col-span-2 flex items-center">
              <MapPin className={`w-4 h-4 mr-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <span className={`text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {formatTimezoneDisplay(member.timezone)}
              </span>
            </div>

            {/* Actions */}
            <div className="col-span-3 flex items-center justify-end space-x-2">
              <button
                onClick={() => {
                  // For now, just toggle status as a simple edit action
                  const statuses: Array<typeof member.status> = ['vibing', 'deepwork', 'afk', 'sleep', 'pair', 'voice'];
                  const currentIndex = statuses.indexOf(member.status);
                  const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                  onUpdateMember(member.id, { status: nextStatus });
                }}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-tactical-gray text-gray-400 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
                title="Edit Member"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDeleteMember(member.id)}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-warning-red/20 text-gray-400 hover:text-warning-red'
                    : 'hover:bg-red-50 text-gray-600 hover:text-red-600'
                }`}
                title="Remove Member"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}; 