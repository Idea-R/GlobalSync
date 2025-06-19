import React, { useState } from 'react';
import { Search, Filter, MapPin, Clock, Star, MessageCircle, UserPlus, Globe, Code, Palette, TrendingUp } from 'lucide-react';

interface Developer {
  id: string;
  name: string;
  title: string;
  skills: string[];
  timezone: string;
  rating: number;
  hourlyRate?: number;
  availability: 'available' | 'busy' | 'offline';
  location: string;
  avatar?: string;
  bio: string;
  experience: number;
  languages: string[];
}

interface NetworkingPageProps {
  theme: 'dark' | 'light';
  user: any;
}

export const NetworkingPage: React.FC<NetworkingPageProps> = ({ theme, user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedTimezone, setSelectedTimezone] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data for demonstration
  const developers: Developer[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      title: 'Senior AI Engineer',
      skills: ['Python', 'TensorFlow', 'React', 'Node.js'],
      timezone: 'UTC-8',
      rating: 4.9,
      hourlyRate: 85,
      availability: 'available',
      location: 'San Francisco, CA',
      bio: 'Specialized in machine learning and full-stack development. 5+ years building AI-powered applications.',
      experience: 5,
      languages: ['English', 'Mandarin'],
    },
    {
      id: '2',
      name: 'Marcus Rodriguez',
      title: 'Frontend Specialist',
      skills: ['React', 'TypeScript', 'UI/UX', 'Figma'],
      timezone: 'UTC-5',
      rating: 4.8,
      hourlyRate: 75,
      availability: 'busy',
      location: 'New York, NY',
      bio: 'Frontend expert with a passion for creating beautiful, accessible user interfaces.',
      experience: 4,
      languages: ['English', 'Spanish'],
    },
    {
      id: '3',
      name: 'Aisha Patel',
      title: 'DevOps Engineer',
      skills: ['AWS', 'Docker', 'Kubernetes', 'Python'],
      timezone: 'UTC+5.5',
      rating: 4.9,
      hourlyRate: 90,
      availability: 'available',
      location: 'Mumbai, India',
      bio: 'Cloud infrastructure specialist helping teams scale their applications globally.',
      experience: 6,
      languages: ['English', 'Hindi'],
    },
    {
      id: '4',
      name: 'Erik Johansson',
      title: 'Backend Developer',
      skills: ['Node.js', 'PostgreSQL', 'GraphQL', 'Rust'],
      timezone: 'UTC+1',
      rating: 4.7,
      hourlyRate: 80,
      availability: 'available',
      location: 'Stockholm, Sweden',
      bio: 'Backend systems architect with expertise in high-performance applications.',
      experience: 7,
      languages: ['English', 'Swedish'],
    },
    {
      id: '5',
      name: 'Yuki Tanaka',
      title: 'AI Research Scientist',
      skills: ['PyTorch', 'Computer Vision', 'NLP', 'Python'],
      timezone: 'UTC+9',
      rating: 5.0,
      hourlyRate: 120,
      availability: 'offline',
      location: 'Tokyo, Japan',
      bio: 'PhD in Computer Science, specializing in deep learning and computer vision research.',
      experience: 8,
      languages: ['English', 'Japanese'],
    },
  ];

  const allSkills = Array.from(new Set(developers.flatMap(dev => dev.skills)));
  const allTimezones = Array.from(new Set(developers.map(dev => dev.timezone)));

  const filteredDevelopers = developers.filter(dev => {
    const matchesSearch = dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dev.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSkills = selectedSkills.length === 0 || 
                         selectedSkills.some(skill => dev.skills.includes(skill));
    
    const matchesTimezone = !selectedTimezone || dev.timezone === selectedTimezone;
    
    return matchesSearch && matchesSkills && matchesTimezone;
  });

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'text-green-500';
      case 'busy': return 'text-yellow-500';
      case 'offline': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const getAvailabilityBg = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
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
                Developer Network
              </h1>
              <p className={`mt-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Connect with AI developers and specialists worldwide
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`px-4 py-2 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-tactical-charcoal border-tactical-gray' 
                  : 'bg-white border-gray-200'
              }`}>
                <span className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {filteredDevelopers.length} developers found
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <div className={`rounded-lg border p-6 ${
              theme === 'dark' 
                ? 'bg-tactical-charcoal border-tactical-gray' 
                : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Filters
              </h3>

              {/* Search */}
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Search
                </label>
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search developers..."
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
                      theme === 'dark'
                        ? 'bg-tactical-black border-tactical-gray text-white focus:ring-tactical-amber'
                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500'
                    }`}
                  />
                </div>
              </div>

              {/* Skills Filter */}
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Skills
                </label>
                <div className="flex flex-wrap gap-2">
                  {allSkills.map(skill => (
                    <button
                      key={skill}
                      onClick={() => {
                        setSelectedSkills(prev => 
                          prev.includes(skill) 
                            ? prev.filter(s => s !== skill)
                            : [...prev, skill]
                        );
                      }}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedSkills.includes(skill)
                          ? theme === 'dark'
                            ? 'bg-tactical-amber text-tactical-black'
                            : 'bg-blue-600 text-white'
                          : theme === 'dark'
                            ? 'bg-tactical-gray text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timezone Filter */}
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Timezone
                </label>
                <select
                  value={selectedTimezone}
                  onChange={(e) => setSelectedTimezone(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
                    theme === 'dark'
                      ? 'bg-tactical-black border-tactical-gray text-white focus:ring-tactical-amber'
                      : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500'
                  }`}
                >
                  <option value="">All Timezones</option>
                  {allTimezones.map(tz => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSkills([]);
                  setSelectedTimezone('');
                }}
                className={`w-full py-2 px-4 rounded-lg border transition-colors ${
                  theme === 'dark'
                    ? 'border-tactical-gray text-gray-400 hover:text-white hover:bg-tactical-gray'
                    : 'border-gray-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Developer Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredDevelopers.map(developer => (
                <div
                  key={developer.id}
                  className={`rounded-lg border p-6 transition-all hover:scale-105 ${
                    theme === 'dark'
                      ? 'bg-tactical-charcoal border-tactical-gray hover:border-tactical-amber'
                      : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mr-3 ${
                        theme === 'dark' ? 'bg-tactical-gray' : 'bg-gray-200'
                      }`}>
                        {developer.avatar || developer.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className={`font-semibold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {developer.name}
                        </h3>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {developer.title}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${getAvailabilityBg(developer.availability)}`} />
                      <span className={`text-xs capitalize ${getAvailabilityColor(developer.availability)}`}>
                        {developer.availability}
                      </span>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className={`text-sm mb-4 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {developer.bio}
                  </p>

                  {/* Skills */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {developer.skills.slice(0, 4).map(skill => (
                        <span
                          key={skill}
                          className={`px-2 py-1 rounded text-xs ${
                            theme === 'dark'
                              ? 'bg-tactical-gray text-gray-300'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                      {developer.skills.length > 4 && (
                        <span className={`px-2 py-1 rounded text-xs ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          +{developer.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <MapPin className={`w-4 h-4 mr-2 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                        {developer.location}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Clock className={`w-4 h-4 mr-2 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                        {developer.timezone}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Star className={`w-4 h-4 mr-2 ${
                        theme === 'dark' ? 'text-tactical-amber' : 'text-yellow-500'
                      }`} />
                      <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                        {developer.rating} • {developer.experience} years exp
                      </span>
                    </div>
                    
                    {developer.hourlyRate && (
                      <div className="flex items-center text-sm">
                        <TrendingUp className={`w-4 h-4 mr-2 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <span className={`font-medium ${
                          theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
                        }`}>
                          ${developer.hourlyRate}/hour
                        </span>
                      </div>
                    )}
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
                      <UserPlus className="w-4 h-4 mr-1" />
                      Connect
                    </button>
                    
                    <button
                      className={`flex items-center justify-center py-2 px-3 rounded-lg border transition-colors ${
                        theme === 'dark'
                          ? 'border-tactical-gray text-gray-400 hover:text-white hover:bg-tactical-gray'
                          : 'border-gray-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredDevelopers.length === 0 && (
              <div className="text-center py-12">
                <Globe className={`w-16 h-16 mx-auto mb-4 ${
                  theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                }`} />
                <h3 className={`text-xl font-semibold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  No developers found
                </h3>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  Try adjusting your search criteria or filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};