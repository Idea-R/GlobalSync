import React from 'react';
import { Users, Settings, Crown, Shield, User, MoreVertical, Calendar, Target } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  description: string;
  projectName?: string;
  memberCount: number;
  role: 'owner' | 'admin' | 'member';
  avatar?: string;
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: string;
  lastActivity: string;
  members: any[];
  projects: any[];
}

interface TeamCardProps {
  team: Team;
  theme: 'dark' | 'light';
  onInviteMembers: () => void;
  getStatusColor: (status: string) => string;
}

export const TeamCard: React.FC<TeamCardProps> = ({
  team,
  theme,
  onInviteMembers,
  getStatusColor,
}) => {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return Crown;
      case 'admin': return Shield;
      case 'member': return User;
      default: return User;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600';
      case 'admin': return theme === 'dark' ? 'text-blue-400' : 'text-blue-600';
      case 'member': return theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
      default: return theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'pro': return theme === 'dark' ? 'bg-tactical-amber/20 text-tactical-amber' : 'bg-blue-100 text-blue-800';
      case 'enterprise': return theme === 'dark' ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-800';
      default: return theme === 'dark' ? 'bg-tactical-gray text-gray-300' : 'bg-gray-200 text-gray-700';
    }
  };

  const RoleIcon = getRoleIcon(team.role);

  return (
    <div className={`rounded-lg border p-6 transition-all hover:scale-105 ${
      theme === 'dark'
        ? 'bg-tactical-charcoal border-tactical-gray hover:border-tactical-amber'
        : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold mr-3 ${
            theme === 'dark' ? 'bg-tactical-gray' : 'bg-gray-200'
          }`}>
            {team.avatar || team.name.charAt(0)}
          </div>
          <div>
            <h3 className={`font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {team.name}
            </h3>
            <div className="flex items-center mt-1">
              <RoleIcon className={`w-4 h-4 mr-1 ${getRoleColor(team.role)}`} />
              <span className={`text-sm capitalize ${getRoleColor(team.role)}`}>
                {team.role}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanBadgeColor(team.plan)}`}>
            {team.plan.toUpperCase()}
          </div>
          <button className={`p-1 rounded transition-colors ${
            theme === 'dark'
              ? 'text-gray-400 hover:text-white hover:bg-tactical-gray'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}>
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className={`text-sm mb-4 ${
        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
      }`}>
        {team.description}
      </p>

      {/* Current Project */}
      {team.projectName && (
        <div className={`p-3 rounded-lg border mb-4 ${
          theme === 'dark' 
            ? 'bg-tactical-black border-tactical-gray' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center mb-1">
            <Target className={`w-4 h-4 mr-2 ${
              theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
            }`} />
            <span className={`text-sm font-medium ${
              theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
            }`}>
              Current Project
            </span>
          </div>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {team.projectName}
          </p>
        </div>
      )}

      {/* Members Preview */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-medium ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Members ({team.memberCount})
          </span>
        </div>
        
        <div className="flex items-center">
          <div className="flex -space-x-2">
            {team.members.slice(0, 4).map((member, index) => (
              <div
                key={member.id}
                className={`relative w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                  theme === 'dark' 
                    ? 'bg-tactical-gray border-tactical-charcoal' 
                    : 'bg-gray-200 border-white'
                }`}
                title={`${member.displayName} (${member.username}#${member.discriminator})`}
              >
                {member.avatar || member.displayName.charAt(0)}
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 ${
                  theme === 'dark' ? 'border-tactical-charcoal' : 'border-white'
                } ${getStatusColor(member.status)}`} />
              </div>
            ))}
            {team.memberCount > 4 && (
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                theme === 'dark' 
                  ? 'bg-tactical-gray border-tactical-charcoal text-gray-400' 
                  : 'bg-gray-200 border-white text-gray-600'
              }`}>
                +{team.memberCount - 4}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className={`text-center p-2 rounded border ${
          theme === 'dark' 
            ? 'bg-tactical-black border-tactical-gray' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className={`text-lg font-bold ${
            theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
          }`}>
            {team.projects.length}
          </div>
          <div className={`text-xs ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Projects
          </div>
        </div>
        
        <div className={`text-center p-2 rounded border ${
          theme === 'dark' 
            ? 'bg-tactical-black border-tactical-gray' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className={`text-lg font-bold ${
            theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
          }`}>
            {team.members.filter(m => m.status === 'online').length}
          </div>
          <div className={`text-xs ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Online
          </div>
        </div>
      </div>

      {/* Last Activity */}
      <div className={`text-xs mb-4 ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }`}>
        <Calendar className="w-3 h-3 inline mr-1" />
        Last activity: {team.lastActivity}
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button
          onClick={onInviteMembers}
          className={`flex-1 flex items-center justify-center py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
            theme === 'dark'
              ? 'bg-tactical-amber text-tactical-black hover:bg-yellow-500'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <Users className="w-4 h-4 mr-1" />
          Invite
        </button>
        
        <button
          className={`flex items-center justify-center py-2 px-3 rounded-lg border transition-colors ${
            theme === 'dark'
              ? 'border-tactical-gray text-gray-400 hover:text-white hover:bg-tactical-gray'
              : 'border-gray-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};