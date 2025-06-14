import React, { useState, useEffect } from 'react';
import { PersonalTimeHero } from './components/PersonalTimeHero';
import { TeamGrid } from './components/TeamGrid';
import { AddMemberModal } from './components/AddMemberModal';
import { CollaborationPanel } from './components/CollaborationPanel';
import { HelpModal } from './components/HelpModal';
import { AppData, PersonalInfo, TeamMember } from './types';
import { loadData, saveData, addTeamMember, updateTeamMember, removeTeamMember } from './utils/storage';
import { generateAppShareString, copyToClipboard } from './utils/shareString';
import { Github, MessageCircle } from 'lucide-react';

function App() {
  const [data, setData] = useState<AppData>(loadData);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Auto-save to localStorage whenever data changes
  useEffect(() => {
    saveData(data);
  }, [data]);

  const handleUpdatePersonalInfo = (updates: Partial<PersonalInfo>) => {
    setData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        ...updates,
      },
    }));
  };

  const handleAddMember = (member: Omit<TeamMember, 'id' | 'lastUpdated'>) => {
    setData(prev => addTeamMember(prev, member));
    setShowAddModal(false);
  };

  const handleUpdateMember = (id: string, updates: Partial<TeamMember>) => {
    setData(prev => updateTeamMember(prev, id, updates));
  };

  const handleDeleteMember = (id: string) => {
    setData(prev => removeTeamMember(prev, id));
  };

  const handleToggleTheme = () => {
    setData(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  };

  const handleToggleHelp = () => {
    setShowHelp(!showHelp);
  };

  const handleExportAllAppData = async () => {
    const appShareString = generateAppShareString(data);
    await copyToClipboard(appShareString);
  };

  const handleImportAllAppData = (importedData: AppData) => {
    setData(importedData);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      data.theme === 'dark' 
        ? 'bg-tactical-black text-white'
        : 'bg-gray-100 text-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center justify-center mb-6">
                    <img 
          src="/GlobalSnycLogo.png" 
          alt="GlobalSync Logo" 
          className="max-w-40 sm:max-w-52 lg:max-w-64 h-auto mb-4"
        />
            <div className="text-center">
              <h1 className={`text-xl sm:text-2xl lg:text-3xl font-bold font-tactical ${
                data.theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                AI Developer Command Center
              </h1>
            </div>
          </div>
          <p className={`text-sm sm:text-base ${
            data.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Elite coordination platform for AI-assisted development teams operating globally 🌍
          </p>
        </div>

        {/* Personal Time Hero Section */}
        <PersonalTimeHero
          personalInfo={data.personalInfo}
          onUpdatePersonalInfo={handleUpdatePersonalInfo}
          onToggleTheme={handleToggleTheme}
          onToggleHelp={handleToggleHelp}
          onExportAllAppData={handleExportAllAppData}
          onImportAllAppData={handleImportAllAppData}
          theme={data.theme}
          appData={data}
        />

        {/* Collaboration Panel */}
        <CollaborationPanel
          personalInfo={data.personalInfo}
          teamMembers={data.teamMembers}
          theme={data.theme}
        />

        {/* Team Grid Section */}
        <TeamGrid
          teamMembers={data.teamMembers}
          onUpdateMember={handleUpdateMember}
          onDeleteMember={handleDeleteMember}
          onAddMember={() => setShowAddModal(true)}
          theme={data.theme}
        />

        {/* Add Member Modal */}
        <AddMemberModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAddMember={handleAddMember}
          theme={data.theme}
        />

        {/* Help Modal */}
        <HelpModal
          isOpen={showHelp}
          onClose={() => setShowHelp(false)}
          theme={data.theme}
        />

        {/* Footer */}
        <footer className="text-center mt-16 pb-8">
          <p className={`text-sm mb-4 ${
            data.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Engineered with AI precision for superior developer collaboration ⚡
          </p>
          
          {/* Developer Social Links */}
          <div className="mb-4">
            <p className={`text-xs mb-2 ${
              data.theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
            }`}>
              Developed by idea/R
            </p>
            <div className="flex items-center justify-center space-x-4">
              <a
                href="https://twitter.com/Xentrilo"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center text-xs transition-colors hover:scale-105 ${
                  data.theme === 'dark' 
                    ? 'text-gray-400 hover:text-tactical-amber' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                @Xentrilo
              </a>
              <a
                href="https://github.com/Idea-R"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center text-xs transition-colors hover:scale-105 ${
                  data.theme === 'dark' 
                    ? 'text-gray-400 hover:text-tactical-amber' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <Github className="w-3 h-3 mr-1" />
                Idea-R
              </a>
              <a
                href="https://discord.gg/your-discord-invite"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center text-xs transition-colors hover:scale-105 ${
                  data.theme === 'dark' 
                    ? 'text-gray-400 hover:text-tactical-amber' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                title="Ideas Realized: Vibe Coding Community"
              >
                <MessageCircle className="w-3 h-3 mr-1" />
                idea/R Community
              </a>
            </div>
          </div>
          
          <p className={`text-xs ${
            data.theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
          }`}>
            Mission: Global coordination for AI-assisted development teams
          </p>
        </footer>

        {/* Bolt.new Badge */}
        <div className="fixed bottom-4 right-4 z-40">
          <a 
            href="https://bolt.new/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block transition-all duration-300 hover:shadow-2xl"
          >
            <img 
              src="https://storage.bolt.army/logotext_poweredby_360w.png" 
              alt="Powered by Bolt.new badge" 
                                className="h-8 md:h-10 w-auto opacity-90 hover:opacity-100 hover:scale-110 transition-all duration-300"
            />
          </a>
        </div>
      </div>

    </div>
  );
}

export default App;