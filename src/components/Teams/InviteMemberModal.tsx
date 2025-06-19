import React, { useState } from 'react';
import { X, Mail, Copy, Check, UserPlus, Link, Globe } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  description: string;
  projectName?: string;
  memberCount: number;
  role: 'owner' | 'admin' | 'member';
  avatar?: string;
  plan: 'free' | 'pro' | 'enterprise';
}

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team | null;
  theme: 'dark' | 'light';
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  isOpen,
  onClose,
  team,
  theme,
}) => {
  const [inviteMethod, setInviteMethod] = useState<'email' | 'link'>('email');
  const [emails, setEmails] = useState(['']);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !team) return null;

  const inviteLink = `https://globalsync.team/invite/${team.id}?token=abc123`;

  const handleAddEmail = () => {
    setEmails([...emails, '']);
  };

  const handleRemoveEmail = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleSendInvites = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const validEmails = emails.filter(email => email.trim() && email.includes('@'));
      console.log('Sending invites to:', validEmails);
      console.log('Message:', message);
      
      onClose();
      setEmails(['']);
      setMessage('');
    } catch (error) {
      console.error('Failed to send invites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const generateUsername = (email: string) => {
    const username = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
    const discriminator = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `${username}#${discriminator}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-lg rounded-xl shadow-2xl border animate-tactical-deploy ${
        theme === 'dark' 
          ? 'bg-tactical-charcoal border-tactical-gray' 
          : 'bg-white border-gray-200'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          theme === 'dark' ? 'border-tactical-gray' : 'border-gray-200'
        }`}>
          <div>
            <h2 className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Invite Members
            </h2>
            <p className={`text-sm mt-1 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {team.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark' 
                ? 'hover:bg-tactical-gray text-gray-400 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Method Selector */}
        <div className="p-6">
          <div className={`flex rounded-lg overflow-hidden border mb-6 ${
            theme === 'dark' ? 'border-tactical-gray' : 'border-gray-300'
          }`}>
            <button
              onClick={() => setInviteMethod('email')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center ${
                inviteMethod === 'email'
                  ? theme === 'dark'
                    ? 'bg-tactical-amber text-tactical-black'
                    : 'bg-blue-600 text-white'
                  : theme === 'dark'
                    ? 'bg-tactical-black text-gray-400 hover:text-white'
                    : 'bg-gray-50 text-gray-600 hover:text-gray-900'
              }`}
            >
              <Mail className="w-4 h-4 mr-2" />
              Email Invites
            </button>
            <button
              onClick={() => setInviteMethod('link')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center ${
                inviteMethod === 'link'
                  ? theme === 'dark'
                    ? 'bg-tactical-amber text-tactical-black'
                    : 'bg-blue-600 text-white'
                  : theme === 'dark'
                    ? 'bg-tactical-black text-gray-400 hover:text-white'
                    : 'bg-gray-50 text-gray-600 hover:text-gray-900'
              }`}
            >
              <Link className="w-4 h-4 mr-2" />
              Invite Link
            </button>
          </div>

          {inviteMethod === 'email' ? (
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Email Addresses
                </label>
                <div className="space-y-2">
                  {emails.map((email, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => handleEmailChange(index, e.target.value)}
                        placeholder="developer@example.com"
                        className={`flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
                          theme === 'dark'
                            ? 'bg-tactical-black border-tactical-gray text-white focus:ring-tactical-amber'
                            : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500'
                        }`}
                      />
                      {emails.length > 1 && (
                        <button
                          onClick={() => handleRemoveEmail(index)}
                          className={`px-3 py-2 rounded-lg border transition-colors ${
                            theme === 'dark'
                              ? 'border-tactical-gray text-gray-400 hover:text-white hover:bg-tactical-gray'
                              : 'border-gray-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={handleAddEmail}
                  className={`mt-2 text-sm ${
                    theme === 'dark' ? 'text-tactical-amber hover:text-yellow-400' : 'text-blue-600 hover:text-blue-700'
                  }`}
                >
                  + Add another email
                </button>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Personal Message (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Join our team to collaborate on exciting projects..."
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 resize-none ${
                    theme === 'dark'
                      ? 'bg-tactical-black border-tactical-gray text-white focus:ring-tactical-amber'
                      : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500'
                  }`}
                />
              </div>

              <div className={`p-3 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-tactical-black border-tactical-gray' 
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <h4 className={`text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Username Generation
                </h4>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  New members will receive usernames like: {generateUsername('example@email.com')}
                </p>
                <p className={`text-xs mt-1 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  They can customize their display name and username later.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Invite Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inviteLink}
                    readOnly
                    className={`flex-1 px-3 py-2 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-tactical-black border-tactical-gray text-gray-300'
                        : 'bg-gray-50 border-gray-300 text-gray-600'
                    }`}
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      copied
                        ? theme === 'dark'
                          ? 'bg-green-600 border-green-600 text-white'
                          : 'bg-green-600 border-green-600 text-white'
                        : theme === 'dark'
                          ? 'border-tactical-gray text-gray-400 hover:text-white hover:bg-tactical-gray'
                          : 'border-gray-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className={`text-xs mt-1 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Share this link with developers you want to invite. Link expires in 7 days.
                </p>
              </div>

              <div className={`p-3 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-tactical-black border-tactical-gray' 
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-start">
                  <Globe className={`w-4 h-4 mr-2 mt-0.5 ${
                    theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                  }`} />
                  <div>
                    <h4 className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Public Link
                    </h4>
                    <p className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Anyone with this link can join your team. Use email invites for more control.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex justify-between p-6 border-t ${
          theme === 'dark' ? 'border-tactical-gray' : 'border-gray-200'
        }`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'text-gray-400 hover:text-white hover:bg-tactical-gray'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Cancel
          </button>
          
          {inviteMethod === 'email' && (
            <button
              onClick={handleSendInvites}
              disabled={loading || !emails.some(email => email.trim() && email.includes('@'))}
              className={`flex items-center px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                theme === 'dark'
                  ? 'bg-tactical-amber text-tactical-black hover:bg-yellow-500'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {loading ? 'Sending...' : 'Send Invites'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};