import React, { useState } from 'react';
import { Plus, Users, Settings, Crown, Shield, User, Copy, Check, Search, Filter, Calendar, Target, Code, MessageSquare } from 'lucide-react';
import { CreateTeamModal } from './Teams/CreateTeamModal';
import { InviteMemberModal } from './Teams/InviteMemberModal';
import { TeamCard } from './Teams/TeamCard';
import { ProjectCard } from './Teams/ProjectCard';

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
  members: TeamMember[];
  projects: Project[];
}

interface TeamMember {
  id: string;
  username: string;
  discriminator: string;
  displayName: string;
  role: 'owner' | 'admin' | 'member';
  status: 'online' | 'away' | 'busy' | 'offline';
  timezone: string;
  avatar?: string;
  joinedAt: string;
  lastSeen: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'paused' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  dueDate?: string;
  assignedMembers: string[];
  createdAt: string;
  updatedAt: string;
}

interface TeamsPageProps {
  theme: 'dark' | 'light';
  user: any;
}

export const TeamsPage: React.FC<TeamsPageProps> = ({ theme, user }) => {
  const [activeTab, setActiveTab] = useState<'teams' | 'projects'>('teams');
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showInviteMember, setShowInviteMember] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for demonstration
  const teams: Team[] = [
    {
      id: '1',
      name: 'AI Research Squad',
      description: 'Advanced AI research and development team',
      projectName: 'Neural Network Optimization',
      memberCount: 8,
      role: 'owner',
      plan: 'pro',
      createdAt: '2024-01-15',
      lastActivity: '2 hours ago',
      members: [
        {
          id: '1',
          username: 'MadXent',
          discriminator: '0001',
          displayName: 'Alex Chen',
          role: 'owner',
          status: 'online',
          timezone: 'UTC-8',
          joinedAt: '2024-01-15',
          lastSeen: 'now',
        },
        {
          id: '2',
          username: 'BoB',
          discriminator: '0025',
          displayName: 'Bob Wilson',
          role: 'admin',
          status: 'away',
          timezone: 'UTC-5',
          joinedAt: '2024-01-16',
          lastSeen: '30 minutes ago',
        },
        {
          id: '3',
          username: 'CodeNinja',
          discriminator: '1337',
          displayName: 'Sarah Kim',
          role: 'member',
          status: 'busy',
          timezone: 'UTC+9',
          joinedAt: '2024-01-20',
          lastSeen: '1 hour ago',
        },
      ],
      projects: [
        {
          id: '1',
          name: 'Neural Network Optimization',
          description: 'Optimizing deep learning models for production',
          status: 'active',
          priority: 'high',
          progress: 65,
          dueDate: '2024-02-15',
          assignedMembers: ['1', '2', '3'],
          createdAt: '2024-01-15',
          updatedAt: '2024-01-19',
        },
        {
          id: '2',
          name: 'Data Pipeline Refactor',
          description: 'Rebuilding data processing pipeline',
          status: 'planning',
          priority: 'medium',
          progress: 15,
          assignedMembers: ['2', '3'],
          createdAt: '2024-01-18',
          updatedAt: '2024-01-19',
        },
      ],
    },
    {
      id: '2',
      name: 'Frontend Wizards',
      description: 'UI/UX focused development team',
      projectName: 'Design System v2',
      memberCount: 5,
      role: 'admin',
      plan: 'free',
      createdAt: '2024-01-10',
      lastActivity: '1 day ago',
      members: [
        {
          id: '4',
          username: 'DesignGuru',
          discriminator: '0100',
          displayName: 'Emma Rodriguez',
          role: 'owner',
          status: 'offline',
          timezone: 'UTC-7',
          joinedAt: '2024-01-10',
          lastSeen: '1 day ago',
        },
        {
          id: '5',
          username: 'ReactMaster',
          discriminator: '2024',
          displayName: 'Mike Johnson',
          role: 'admin',
          status: 'online',
          timezone: 'UTC-5',
          joinedAt: '2024-01-12',
          lastSeen: 'now',
        },
      ],
      projects: [
        {
          id: '3',
          name: 'Design System v2',
          description: 'Complete redesign of component library',
          status: 'active',
          priority: 'high',
          progress: 40,
          dueDate: '2024-02-28',
          assignedMembers: ['4', '5'],
          createdAt: '2024-01-10',
          updatedAt: '2024-01-18',
        },
      ],
    },
  ];

  const allProjects = teams.flatMap(team => 
    team.projects.map(project => ({ ...project, teamName: team.name, teamId: team.id }))
  );

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (team.projectName && team.projectName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredProjects = allProjects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.teamName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return theme === 'dark' ? 'text-red-400' : 'text-red-600';
      case 'high': return theme === 'dark' ? 'text-orange-400' : 'text-orange-600';
      case 'medium': return theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600';
      case 'low': return theme === 'dark' ? 'text-green-400' : 'text-green-600';
      default: return theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getStatusColor2 = (status: string) => {
    switch (status) {
      case 'active': return theme === 'dark' ? 'text-green-400' : 'text-green-600';
      case 'planning': return theme === 'dark' ? 'text-blue-400' : 'text-blue-600';
      case 'paused': return theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600';
      case 'completed': return theme === 'dark' ? 'text-purple-400' : 'text-purple-600';
      default: return theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
    }
  };

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-tactical-black text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <div className={`border-b ${
        theme === 'dark' ? 'border-tactical-gray' : 'border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Teams & Projects
              </h1>
              <p className={`mt-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Manage your development teams and coordinate projects globally
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCreateTeam(true)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  theme === 'dark'
                    ? 'bg-tactical-amber text-tactical-black hover:bg-yellow-500'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Team
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-8 mt-6">
            <button
              onClick={() => setActiveTab('teams')}
              className={`pb-4 border-b-2 font-medium transition-colors ${
                activeTab === 'teams'
                  ? theme === 'dark'
                    ? 'border-tactical-amber text-tactical-amber'
                    : 'border-blue-600 text-blue-600'
                  : theme === 'dark'
                    ? 'border-transparent text-gray-400 hover:text-gray-300'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Teams ({teams.length})
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`pb-4 border-b-2 font-medium transition-colors ${
                activeTab === 'projects'
                  ? theme === 'dark'
                    ? 'border-tactical-amber text-tactical-amber'
                    : 'border-blue-600 text-blue-600'
                  : theme === 'dark'
                    ? 'border-transparent text-gray-400 hover:text-gray-300'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Projects ({allProjects.length})
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeTab}...`}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
                  theme === 'dark'
                    ? 'bg-tactical-charcoal border-tactical-gray text-white focus:ring-tactical-amber'
                    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
                }`}
              />
            </div>
          </div>
          
          <button
            className={`flex items-center px-4 py-3 rounded-lg border transition-colors ${
              theme === 'dark'
                ? 'border-tactical-gray text-gray-400 hover:text-white hover:bg-tactical-gray'
                : 'border-gray-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>

        {/* Teams Tab */}
        {activeTab === 'teams' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTeams.map(team => (
              <TeamCard
                key={team.id}
                team={team}
                theme={theme}
                onInviteMembers={() => {
                  setSelectedTeam(team);
                  setShowInviteMember(true);
                }}
                getStatusColor={getStatusColor}
              />
            ))}
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                theme={theme}
                getPriorityColor={getPriorityColor}
                getStatusColor={getStatusColor2}
              />
            ))}
          </div>
        )}

        {/* Empty States */}
        {activeTab === 'teams' && filteredTeams.length === 0 && (
          <div className="text-center py-12">
            <Users className={`w-16 h-16 mx-auto mb-4 ${
              theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <h3 className={`text-xl font-semibold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {searchQuery ? 'No teams found' : 'No teams yet'}
            </h3>
            <p className={`mb-6 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {searchQuery 
                ? 'Try adjusting your search criteria'
                : 'Create your first team to start collaborating with developers worldwide'
              }
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowCreateTeam(true)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  theme === 'dark'
                    ? 'bg-tactical-amber text-tactical-black hover:bg-yellow-500'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Create Your First Team
              </button>
            )}
          </div>
        )}

        {activeTab === 'projects' && filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <Target className={`w-16 h-16 mx-auto mb-4 ${
              theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <h3 className={`text-xl font-semibold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {searchQuery ? 'No projects found' : 'No projects yet'}
            </h3>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              {searchQuery 
                ? 'Try adjusting your search criteria'
                : 'Projects will appear here when your teams create them'
              }
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateTeamModal
        isOpen={showCreateTeam}
        onClose={() => setShowCreateTeam(false)}
        theme={theme}
        user={user}
      />

      <InviteMemberModal
        isOpen={showInviteMember}
        onClose={() => setShowInviteMember(false)}
        team={selectedTeam}
        theme={theme}
      />
    </div>
  );
};