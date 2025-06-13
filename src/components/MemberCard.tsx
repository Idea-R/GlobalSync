import React, { useState, useEffect } from 'react';
import { Trash2, MapPin, Clock, User } from 'lucide-react';
import { TeamMember, StatusType } from '../types';
import { getCurrentTimeInTimezone, formatTimeWithAMPM, getSchedulePeriod } from '../utils/timezone';
import { statusConfig, getRandomFlavorText } from '../config/statusConfig';
import { updateStatusBasedOnSchedule } from '../utils/timezone';

interface MemberCardProps {
  member: TeamMember;
  onUpdateMember: (id: string, updates: Partial<TeamMember>) => void;
  onDeleteMember: (id: string) => void;
  theme: 'dark' | 'light';
}

export const MemberCard: React.FC<MemberCardProps> = ({
  member,
  onUpdateMember,
  onDeleteMember,
  theme,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [flavorText, setFlavorText] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = getCurrentTimeInTimezone(member.timezone);
      setCurrentTime(newTime);
      
      // Auto-update status based on schedule if enabled
      const autoStatus = updateStatusBasedOnSchedule(
        newTime, 
        member.workHours, 
        member.sleepHours, 
        member.autoStatus
      );
      
      if (autoStatus && autoStatus !== member.status) {
        onUpdateMember(member.id, { status: autoStatus as StatusType });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [member.timezone, member.workHours, member.sleepHours, member.autoStatus, member.status, member.id, onUpdateMember]);

  useEffect(() => {
    setFlavorText(getRandomFlavorText(member.status));
  }, [member.status]);

  const handleStatusChange = (status: StatusType) => {
    onUpdateMember(member.id, { status });
    setShowStatusDropdown(false);
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDeleteMember(member.id);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  const currentPeriod = getSchedulePeriod(currentTime, member.workHours, member.sleepHours);
  
  const periodColors = {
    work: 'bg-steel-blue',
    sleep: 'bg-warning-red',
    available: 'bg-radar-green',
  };

  const periodLabels = {
    work: 'WORK',
    sleep: 'SLEEP',
    available: 'AVAILABLE',
  };

  return (
    <div className={`rounded-lg p-6 transition-all duration-300 animate-tactical-deploy relative group border ${
      theme === 'dark'
        ? 'bg-tactical-charcoal border-tactical-gray hover:border-tactical-amber/50 hover:shadow-lg hover:shadow-tactical-amber/10'
        : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100'
    }`}>
      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className={`absolute top-3 right-3 p-1 rounded transition-all duration-200 ${
          showDeleteConfirm
            ? (theme === 'dark' ? 'bg-warning-red text-white' : 'bg-red-500 text-white')
            : theme === 'dark'
              ? 'bg-tactical-gray/50 text-gray-400 hover:bg-warning-red hover:text-white opacity-0 group-hover:opacity-100'
              : 'bg-gray-200/50 text-gray-500 hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100'
        }`}
        title={showDeleteConfirm ? 'Click again to confirm deletion' : 'Delete member'}
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Avatar and Name */}
      <div className="flex items-center mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-3 ${
          theme === 'dark' ? 'bg-tactical-gray' : 'bg-gray-200'
        }`}>
          {member.avatar ? (
            <img
              src={member.avatar}
              alt={member.name}
              className="w-full h-full rounded-lg object-cover"
            />
          ) : (
            <User className={`w-6 h-6 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`} />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold truncate text-lg ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {member.name}
          </h3>
          <div className={`flex items-center text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <MapPin className="w-3 h-3 mr-1" />
            <span>{member.timezone}</span>
          </div>
        </div>
      </div>

      {/* Time Display */}
      <div className={`rounded-lg p-4 mb-4 border ${
        theme === 'dark' 
          ? 'bg-tactical-black border-tactical-gray' 
          : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Clock className={`w-4 h-4 mr-2 ${
              theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
            }`} />
            <span className={`font-medium text-sm ${
              theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
            }`}>LOCAL TIME</span>
          </div>
          
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full ${periodColors[currentPeriod]} mr-2 animate-tactical-pulse`} />
            <span className={`text-xs uppercase tracking-wider ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {periodLabels[currentPeriod]}
            </span>
          </div>
        </div>
        
        <div className={`text-2xl font-mono font-bold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {formatTimeWithAMPM(currentTime)}
        </div>
      </div>

      {/* Schedule Visualization */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs uppercase tracking-wider ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>Schedule</span>
          <span className={`text-xs ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Work: {member.workHours} | Sleep: {member.sleepHours}
          </span>
        </div>
        
        <div className={`h-2 rounded-full overflow-hidden flex ${
          theme === 'dark' ? 'bg-tactical-black' : 'bg-gray-200'
        }`}>
          {/* This is a simplified schedule bar - in production you'd calculate exact positions */}
          <div className="w-1/3 bg-radar-green" title="Available" />
          <div className="w-1/3 bg-steel-blue" title="Work Hours" />
          <div className="w-1/3 bg-warning-red" title="Sleep Hours" />
        </div>
      </div>

      {/* Status Selector */}
      <div className="relative">
        <button
          onClick={() => setShowStatusDropdown(!showStatusDropdown)}
          className={`w-full text-left p-3 rounded-lg border transition-colors ${
            theme === 'dark'
              ? 'bg-tactical-black border-tactical-gray hover:border-tactical-amber'
              : 'bg-gray-50 border-gray-200 hover:border-blue-500'
          }`}
        >
          <div className="flex items-center">
            <span className="text-xl mr-3">{statusConfig[member.status].icon}</span>
            <div className="flex-1">
              <div className={`font-medium ${
                theme === 'dark' 
                  ? statusConfig[member.status].color 
                  : statusConfig[member.status].color
              }`}>
                {statusConfig[member.status].label}
              </div>
              <div className={`text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {statusConfig[member.status].description}
              </div>
            </div>
          </div>
        </button>
        
        {showStatusDropdown && (
          <div className={`absolute top-full left-0 right-0 mt-2 rounded-lg shadow-xl z-40 border ${
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
                  <span className="text-lg mr-3">{config.icon}</span>
                  <div>
                    <div className={`font-medium text-sm ${
                      theme === 'dark' ? config.color : config.color
                    }`}>
                      {config.label}
                    </div>
                    <div className={`text-xs ${
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

      {/* Flavor Text */}
      <div className="mt-3 text-center">
        <p className={`text-xs italic ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {flavorText}
        </p>
      </div>
    </div>
  );
};