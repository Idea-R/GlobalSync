import React, { useState, useEffect } from 'react';
import { PersonalTimeHero } from './components/PersonalTimeHero';
import { TeamGrid } from './components/TeamGrid';
import { AddMemberModal } from './components/AddMemberModal';
import { CollaborationPanel } from './components/CollaborationPanel';
import { HelpModal } from './components/HelpModal';
import { AppData, PersonalInfo, TeamMember } from './types';
import { loadData, saveData, addTeamMember, updateTeamMember, removeTeamMember } from './utils/storage';
import { generateAppShareString, copyToClipboard } from './utils/shareString';

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
        : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold font-tactical mb-2`}>
            <span className={data.theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'}>
              GlobalSync
            </span>
            <span className={`ml-3 ${data.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              AI Developer Command Center
            </span>
          </h1>
          <p className={data.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Built for elite AI-assisted coding teams who ship around the clock 🌍
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
          <p className={`text-sm mb-2 ${
            data.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Engineered with AI precision for superior developer collaboration ⚡
          </p>
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
              className="h-8 md:h-10 w-auto shadow-lg opacity-90 hover:opacity-100 hover:scale-110 transition-all duration-300"
            />
          </a>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes tacticalDeploy {
          0% { 
            transform: translateY(20px) scale(0.95); 
            opacity: 0;
          }
          100% { 
            transform: translateY(0) scale(1); 
            opacity: 1;
          }
        }
        
        @keyframes tacticalPulse {
          0%, 100% { 
            box-shadow: 0 0 5px rgba(255, 176, 0, 0.3);
          }
          50% { 
            box-shadow: 0 0 20px rgba(255, 176, 0, 0.6);
          }
        }
        
        .animate-tactical-deploy {
          animation: tacticalDeploy 0.6s ease-out forwards;
        }
        
        .animate-tactical-pulse {
          animation: tacticalPulse 2s ease-in-out infinite;
        }
        
        .backdrop-blur-tactical {
          backdrop-filter: blur(8px);
        }
        
        .font-tactical {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'system-ui', sans-serif;
          font-weight: 700;
          letter-spacing: -0.025em;
        }
      `}</style>
    </div>
  );
}

export default App;