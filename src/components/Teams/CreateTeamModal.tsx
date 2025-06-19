import React, { useState } from 'react';
import { X, Users, Target, Globe, Zap, Crown, Shield, User } from 'lucide-react';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
  user: any;
}

export const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
  isOpen,
  onClose,
  theme,
  user,
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    teamName: '',
    projectName: '',
    description: '',
    plan: 'free' as 'free' | 'pro' | 'enterprise',
    isPublic: false,
    initialMembers: [] as string[],
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would create the team via API
      console.log('Creating team:', formData);
      
      onClose();
      setStep(1);
      setFormData({
        teamName: '',
        projectName: '',
        description: '',
        plan: 'free',
        isPublic: false,
        initialMembers: [],
      });
    } catch (error) {
      console.error('Failed to create team:', error);
    } finally {
      setLoading(false);
    }
  };

  const planFeatures = {
    free: [
      'Up to 5 team members',
      'Basic project management',
      'Standard support',
      'Local timezone coordination',
    ],
    pro: [
      'Unlimited team members',
      'Advanced project management',
      'Priority support',
      'Global networking access',
      'Advanced analytics',
      'Custom integrations',
    ],
    enterprise: [
      'Everything in Pro',
      'SSO integration',
      'Advanced security',
      'Dedicated support',
      'Custom deployment',
      'SLA guarantee',
    ],
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-2xl rounded-xl shadow-2xl border animate-tactical-deploy ${
        theme === 'dark' 
          ? 'bg-tactical-charcoal border-tactical-gray' 
          : 'bg-white border-gray-200'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          theme === 'dark' ? 'border-tactical-gray' : 'border-gray-200'
        }`}>
          <div className="flex items-center">
            <Users className={`w-6 h-6 mr-3 ${
              theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
            }`} />
            <h2 className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Create New Team
            </h2>
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

        {/* Progress Steps */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNum
                    ? theme === 'dark'
                      ? 'bg-tactical-amber text-tactical-black'
                      : 'bg-blue-600 text-white'
                    : theme === 'dark'
                      ? 'bg-tactical-gray text-gray-400'
                      : 'bg-gray-200 text-gray-500'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNum
                      ? theme === 'dark' ? 'bg-tactical-amber' : 'bg-blue-600'
                      : theme === 'dark' ? 'bg-tactical-gray' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs">
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Team Info</span>
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Plan</span>
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Review</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Team Name *
                </label>
                <input
                  type="text"
                  value={formData.teamName}
                  onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                  placeholder="e.g. AI Research Squad"
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
                    theme === 'dark'
                      ? 'bg-tactical-black border-tactical-gray text-white focus:ring-tactical-amber'
                      : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Primary Project Name
                </label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  placeholder="e.g. Neural Network Optimization"
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
                    theme === 'dark'
                      ? 'bg-tactical-black border-tactical-gray text-white focus:ring-tactical-amber'
                      : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500'
                  }`}
                />
                <p className={`text-xs mt-1 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Optional: You can add more projects later
                </p>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your team's focus and goals..."
                  rows={3}
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 resize-none ${
                    theme === 'dark'
                      ? 'bg-tactical-black border-tactical-gray text-white focus:ring-tactical-amber'
                      : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500'
                  }`}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  className={`w-4 h-4 rounded border-2 ${
                    theme === 'dark'
                      ? 'bg-tactical-black border-tactical-gray text-tactical-amber focus:ring-tactical-amber'
                      : 'bg-white border-gray-300 text-blue-600 focus:ring-blue-500'
                  }`}
                />
                <label htmlFor="isPublic" className={`ml-2 text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Make team discoverable in network (Pro feature)
                </label>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-lg font-semibold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Choose Your Plan
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(planFeatures).map(([planKey, features]) => (
                    <div
                      key={planKey}
                      onClick={() => setFormData({ ...formData, plan: planKey as any })}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.plan === planKey
                          ? theme === 'dark'
                            ? 'border-tactical-amber bg-tactical-amber/10'
                            : 'border-blue-600 bg-blue-50'
                          : theme === 'dark'
                            ? 'border-tactical-gray hover:border-tactical-amber/50'
                            : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center mb-3">
                        {planKey === 'free' && <User className="w-5 h-5 mr-2" />}
                        {planKey === 'pro' && <Shield className="w-5 h-5 mr-2" />}
                        {planKey === 'enterprise' && <Crown className="w-5 h-5 mr-2" />}
                        <h4 className={`font-semibold capitalize ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {planKey}
                        </h4>
                      </div>
                      
                      <ul className="space-y-2">
                        {features.map((feature, index) => (
                          <li key={index} className={`text-sm flex items-start ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            <span className="text-green-500 mr-2">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-lg font-semibold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Review Team Details
                </h3>
                
                <div className={`p-4 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-tactical-black border-tactical-gray' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="space-y-3">
                    <div>
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Team Name:
                      </span>
                      <p className={`font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {formData.teamName}
                      </p>
                    </div>
                    
                    {formData.projectName && (
                      <div>
                        <span className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Primary Project:
                        </span>
                        <p className={`font-semibold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {formData.projectName}
                        </p>
                      </div>
                    )}
                    
                    {formData.description && (
                      <div>
                        <span className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Description:
                        </span>
                        <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                          {formData.description}
                        </p>
                      </div>
                    )}
                    
                    <div>
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Plan:
                      </span>
                      <p className={`font-semibold capitalize ${
                        theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
                      }`}>
                        {formData.plan}
                      </p>
                    </div>
                    
                    <div>
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Visibility:
                      </span>
                      <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                        {formData.isPublic ? 'Public (discoverable)' : 'Private (invite-only)'}
                      </p>
                    </div>
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
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            className={`px-4 py-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'text-gray-400 hover:text-white hover:bg-tactical-gray'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {step > 1 ? 'Back' : 'Cancel'}
          </button>
          
          <button
            onClick={() => step < 3 ? setStep(step + 1) : handleSubmit()}
            disabled={loading || (step === 1 && !formData.teamName.trim())}
            className={`px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              theme === 'dark'
                ? 'bg-tactical-amber text-tactical-black hover:bg-yellow-500'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Creating...' : step < 3 ? 'Next' : 'Create Team'}
          </button>
        </div>
      </div>
    </div>
  );
};