import React from 'react';
import { Calendar, Users, Target, MoreVertical, Clock, AlertCircle } from 'lucide-react';

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
  teamName: string;
  teamId: string;
}

interface ProjectCardProps {
  project: Project;
  theme: 'dark' | 'light';
  getPriorityColor: (priority: string) => string;
  getStatusColor: (status: string) => string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  theme,
  getPriorityColor,
  getStatusColor,
}) => {
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOverdue = project.dueDate && new Date(project.dueDate) < new Date();

  return (
    <div className={`rounded-lg border p-6 transition-all hover:scale-105 ${
      theme === 'dark'
        ? 'bg-tactical-charcoal border-tactical-gray hover:border-tactical-amber'
        : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <h3 className={`font-semibold mr-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {project.name}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
          </div>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {project.teamName}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`flex items-center px-2 py-1 rounded text-xs font-medium ${getPriorityColor(project.priority)}`}>
            {project.priority === 'critical' && <AlertCircle className="w-3 h-3 mr-1" />}
            {project.priority.toUpperCase()}
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
        {project.description}
      </p>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-medium ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Progress
          </span>
          <span className={`text-sm font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {project.progress}%
          </span>
        </div>
        <div className={`w-full h-2 rounded-full ${
          theme === 'dark' ? 'bg-tactical-gray' : 'bg-gray-200'
        }`}>
          <div
            className={`h-2 rounded-full transition-all ${getProgressColor(project.progress)}`}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Due Date */}
      {project.dueDate && (
        <div className={`flex items-center mb-4 text-sm ${
          isOverdue 
            ? 'text-red-500' 
            : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <Calendar className="w-4 h-4 mr-2" />
          <span>Due: {formatDate(project.dueDate)}</span>
          {isOverdue && <AlertCircle className="w-4 h-4 ml-2" />}
        </div>
      )}

      {/* Assigned Members */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-medium ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Assigned ({project.assignedMembers.length})
          </span>
        </div>
        
        <div className="flex -space-x-2">
          {project.assignedMembers.slice(0, 4).map((memberId, index) => (
            <div
              key={memberId}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                theme === 'dark' 
                  ? 'bg-tactical-gray border-tactical-charcoal' 
                  : 'bg-gray-200 border-white'
              }`}
            >
              {String.fromCharCode(65 + index)}
            </div>
          ))}
          {project.assignedMembers.length > 4 && (
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
              theme === 'dark' 
                ? 'bg-tactical-gray border-tactical-charcoal text-gray-400' 
                : 'bg-gray-200 border-white text-gray-600'
            }`}>
              +{project.assignedMembers.length - 4}
            </div>
          )}
        </div>
      </div>

      {/* Last Updated */}
      <div className={`text-xs mb-4 ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }`}>
        <Clock className="w-3 h-3 inline mr-1" />
        Updated: {formatDate(project.updatedAt)}
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button
          className={`flex-1 flex items-center justify-center py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
            theme === 'dark'
              ? 'bg-tactical-amber text-tactical-black hover:bg-yellow-500'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <Target className="w-4 h-4 mr-1" />
          View Project
        </button>
        
        <button
          className={`flex items-center justify-center py-2 px-3 rounded-lg border transition-colors ${
            theme === 'dark'
              ? 'border-tactical-gray text-gray-400 hover:text-white hover:bg-tactical-gray'
              : 'border-gray-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Users className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};