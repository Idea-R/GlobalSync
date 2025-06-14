import React, { useState } from 'react';
import { Users, Clock, Target, ChevronDown, ChevronUp, Calendar, ExternalLink } from 'lucide-react';
import { PersonalInfo, TeamMember } from '../types';
import { findCollaborationWindows, formatCollaborationTime, getPeriodEmoji } from '../utils/collaboration';
import { generateCollaborationCalendarUrl } from '../utils/googleCalendar';

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const windows = findCollaborationWindows(personalInfo, teamMembers);
  const bestWindows = isExpanded ? windows : windows.slice(0, 3); // Show all or top 3

  if (teamMembers.length === 0) {
    return null;
  }

  return (
    <div className={`rounded-lg p-6 mb-8 border transition-all duration-300 relative ${
      theme === 'dark' 
        ? 'bg-tactical-charcoal border-tactical-gray' 
        : 'bg-white border-gray-200 shadow-lg'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Target className={`w-6 h-6 mr-3 ${
            theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
          }`} />
          <h2 className={`text-xl font-bold font-tactical ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Optimal Collaboration Windows
          </h2>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Date Picker for Calendar Events */}
          <div className="flex items-center space-x-2">
            <Calendar className={`w-4 h-4 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`} />
            <input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className={`px-2 py-1 rounded text-sm border ${
                theme === 'dark'
                  ? 'bg-tactical-black border-tactical-gray text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              title="Select date for calendar events"
            />
          </div>
        
          {windows.length > 3 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`flex items-center px-3 py-1 rounded-lg text-sm transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-tactical-gray text-gray-400 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Show All ({windows.length})
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {windows.length === 0 ? (
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
        <>
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 relative ${
            isExpanded ? 'max-h-[600px] overflow-y-auto pr-2' : ''
          }`}>
            {bestWindows.map((window, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-all duration-200 hover:scale-[1.02] relative ${
                  theme === 'dark'
                    ? 'bg-tactical-black border-tactical-gray hover:border-tactical-amber/50'
                    : 'bg-gray-50 border-gray-200 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
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
                  
                  <div className="flex items-center space-x-2">
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      theme === 'dark' 
                        ? 'bg-radar-green/20 text-radar-green' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {window.availableMembers.length} devs
                    </div>
                    
                    <button
                      onClick={() => {
                        const calendarUrl = generateCollaborationCalendarUrl(window, selectedDate);
                        globalThis.open(calendarUrl, '_blank');
                      }}
                      className={`p-1 rounded transition-colors ${
                        theme === 'dark'
                          ? 'hover:bg-tactical-gray text-gray-400 hover:text-tactical-amber'
                          : 'hover:bg-gray-200 text-gray-500 hover:text-blue-600'
                      }`}
                      title={`Add to Google Calendar for ${selectedDate.toLocaleDateString()}`}
                    >
                      <Calendar className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-1 relative">
                  {window.availableMembers.slice(0, 3).map((name, memberIndex) => (
                    <div
                      key={memberIndex}
                      className={`text-xs px-2 py-1 rounded flex items-center relative ${
                        theme === 'dark'
                          ? 'bg-tactical-gray/50 text-gray-300'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Users className="w-3 h-3 mr-1 opacity-50 flex-shrink-0" />
                      <span className="truncate">{name}</span>
                    </div>
                  ))}
                  {window.availableMembers.length > 3 && (
                    <div className={`text-xs px-2 py-1 text-center relative ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      +{window.availableMembers.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className={`mt-4 flex items-center justify-center text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <Clock className="w-4 h-4 mr-2" />
            <span>Times shown in UTC • Based on work/sleep schedules • Click 📅 to add to Google Calendar</span>
          </div>
        </>
      )}
    </div>
  );
};