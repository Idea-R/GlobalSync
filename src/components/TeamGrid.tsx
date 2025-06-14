import React, { useState } from 'react';
import { Plus, Users, Target, Grid, List } from 'lucide-react';
import { TeamMember } from '../types';
import { MemberCard } from './MemberCard';
import { TeamList } from './TeamList';

interface TeamGridProps {
  teamMembers: TeamMember[];
  onUpdateMember: (id: string, updates: Partial<TeamMember>) => void;
  onDeleteMember: (id: string) => void;
  onAddMember: () => void;
  theme: 'dark' | 'light';
}

export const TeamGrid: React.FC<TeamGridProps> = ({
  teamMembers,
  onUpdateMember,
  onDeleteMember,
  onAddMember,
  theme,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const availableMembers = teamMembers.filter(member => 
    member.status === 'vibing' || member.status === 'pair'
  ).length;

  const allSystemsGo = teamMembers.length > 0 && availableMembers === teamMembers.length;

  if (teamMembers.length === 0) {
    return (
      <div className="text-center py-16">
        <div className={`rounded-lg p-8 max-w-md mx-auto border ${
          theme === 'dark' 
            ? 'bg-tactical-charcoal border-tactical-gray' 
            : 'bg-white border-gray-200 shadow-lg'
        }`}>
          <Users className={`w-16 h-16 mx-auto mb-4 ${
            theme === 'dark' ? 'text-tactical-gray' : 'text-gray-400'
          }`} />
          <h3 className={`text-xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            No Developers in Squad
          </h3>
          <p className={`mb-6 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Deploy your first team member to begin global coordination operations.
          </p>
          <button
            onClick={onAddMember}
            className={`flex items-center px-6 py-3 rounded-lg transition-colors font-medium mx-auto ${
              theme === 'dark'
                ? 'bg-tactical-amber text-tactical-black hover:bg-yellow-500'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Plus className="w-5 h-5 mr-2" />
            Deploy First Developer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Team Status Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Users className={`w-6 h-6 mr-3 ${
            theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
          }`} />
          <div>
            <h2 className={`text-2xl font-bold font-tactical ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Development Squad ({teamMembers.length})
            </h2>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              {availableMembers} of {teamMembers.length} developers ready for coordination
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {allSystemsGo && (
            <div className={`flex items-center px-4 py-2 rounded-lg border ${
              theme === 'dark'
                ? 'bg-radar-green/20 border-radar-green'
                : 'bg-green-50 border-green-200'
            }`}>
              <Target className={`w-4 h-4 mr-2 ${
                theme === 'dark' ? 'text-radar-green' : 'text-green-600'
              }`} />
              <span className={`font-medium text-sm ${
                theme === 'dark' ? 'text-radar-green' : 'text-green-600'
              }`}>
                All systems go for sync! 🚀
              </span>
            </div>
          )}
          
          {/* View Toggle */}
          <div className={`flex rounded-lg overflow-hidden border ${
            theme === 'dark' ? 'border-tactical-gray' : 'border-gray-300'
          }`}>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 flex items-center transition-colors ${
                viewMode === 'grid'
                  ? theme === 'dark'
                    ? 'bg-tactical-amber text-tactical-black'
                    : 'bg-blue-600 text-white'
                  : theme === 'dark'
                    ? 'bg-tactical-black text-gray-400 hover:text-white'
                    : 'bg-gray-50 text-gray-600 hover:text-gray-900'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 flex items-center transition-colors ${
                viewMode === 'list'
                  ? theme === 'dark'
                    ? 'bg-tactical-amber text-tactical-black'
                    : 'bg-blue-600 text-white'
                  : theme === 'dark'
                    ? 'bg-tactical-black text-gray-400 hover:text-white'
                    : 'bg-gray-50 text-gray-600 hover:text-gray-900'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          
          <button
            onClick={onAddMember}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors font-medium ${
              theme === 'dark'
                ? 'bg-tactical-amber text-tactical-black hover:bg-yellow-500'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Developer
          </button>
        </div>
      </div>

      {/* Team View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              style={{
                animationDelay: `${index * 150}ms`,
              }}
            >
              <MemberCard
                member={member}
                onUpdateMember={onUpdateMember}
                onDeleteMember={onDeleteMember}
                theme={theme}
              />
            </div>
          ))}
        </div>
      ) : (
        <TeamList
          teamMembers={teamMembers}
          onUpdateMember={onUpdateMember}
          onDeleteMember={onDeleteMember}
          theme={theme}
        />
      )}
    </div>
  );
};