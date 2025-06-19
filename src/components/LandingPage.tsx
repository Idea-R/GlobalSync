import React, { useState } from 'react';
import { Globe, Users, Target, Zap, ArrowRight, Play, Star, Check } from 'lucide-react';
import { AuthModal } from './AuthModal';

interface LandingPageProps {
  onEnterApp: (user?: any) => void;
  theme: 'dark' | 'light';
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, theme }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'demo'>('demo');

  const handleAuthSuccess = (user: any) => {
    onEnterApp(user);
  };

  const features = [
    {
      icon: Globe,
      title: 'Global Timezone Coordination',
      description: 'Automatically sync with team members across all time zones with smart scheduling.',
    },
    {
      icon: Users,
      title: 'Team Management',
      description: 'Add unlimited team members, track their status, and manage collaboration windows.',
    },
    {
      icon: Target,
      title: 'Smart Collaboration Windows',
      description: 'AI-powered analysis finds optimal meeting times when your team is available.',
    },
    {
      icon: Zap,
      title: 'Real-time Status Updates',
      description: 'Live status tracking with automatic updates based on work and sleep schedules.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Lead Developer at TechCorp',
      content: 'GlobalSync transformed how our distributed team coordinates. We went from chaos to seamless collaboration.',
      rating: 5,
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Freelance AI Engineer',
      content: 'Finally, a tool that understands the reality of global remote work. The timezone coordination is brilliant.',
      rating: 5,
    },
    {
      name: 'Aisha Patel',
      role: 'Startup Founder',
      content: 'Our team spans 6 time zones. GlobalSync makes it feel like we\'re all in the same room.',
      rating: 5,
    },
  ];

  const pricingPlans = [
    {
      name: 'Demo',
      price: 'Free',
      description: 'Try all features with local storage',
      features: [
        'Full feature access',
        'Local data storage',
        'Share team profiles',
        'Collaboration windows',
      ],
      cta: 'Try Demo',
      popular: false,
      action: () => {
        setAuthMode('demo');
        setShowAuthModal(true);
      },
    },
    {
      name: 'Pro',
      price: '$5',
      period: '/month',
      description: 'Full platform with cloud sync and networking',
      features: [
        'Cloud data synchronization',
        'Team networking & discovery',
        'Advanced team management',
        'Priority support',
        'Custom integrations',
      ],
      cta: 'Start Free Trial',
      popular: true,
      action: () => {
        setAuthMode('signup');
        setShowAuthModal(true);
      },
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations',
      features: [
        'Everything in Pro',
        'SSO integration',
        'Advanced analytics',
        'Dedicated support',
        'Custom deployment',
      ],
      cta: 'Contact Sales',
      popular: false,
      action: () => {
        // Handle enterprise contact
        window.open('mailto:sales@globalsync.team?subject=Enterprise Inquiry', '_blank');
      },
    },
  ];

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-tactical-black text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Navigation */}
      <nav className={`border-b ${
        theme === 'dark' ? 'border-tactical-gray' : 'border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src="/GlobalSnycLogo.png" 
                alt="GlobalSync" 
                className="h-8 w-auto"
              />
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setAuthMode('login');
                  setShowAuthModal(true);
                }}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:text-white hover:bg-tactical-gray'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setShowAuthModal(true);
                }}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-tactical-amber text-tactical-black hover:bg-yellow-500'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className={`text-4xl sm:text-6xl font-bold mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Coordinate Your Global
            <span className={`block ${
              theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
            }`}>
              AI Development Team
            </span>
          </h1>
          
          <p className={`text-xl mb-8 max-w-3xl mx-auto ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            The ultimate command center for AI-assisted development teams operating across time zones. 
            Smart scheduling, real-time coordination, and seamless collaboration.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => {
                setAuthMode('demo');
                setShowAuthModal(true);
              }}
              className={`flex items-center px-8 py-4 text-lg font-medium rounded-lg transition-all hover:scale-105 ${
                theme === 'dark'
                  ? 'bg-tactical-amber text-tactical-black hover:bg-yellow-500'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Play className="w-5 h-5 mr-2" />
              Try Demo Now
            </button>
            
            <button
              onClick={() => {
                setAuthMode('signup');
                setShowAuthModal(true);
              }}
              className={`flex items-center px-8 py-4 text-lg font-medium rounded-lg border transition-all hover:scale-105 ${
                theme === 'dark'
                  ? 'border-tactical-gray text-white hover:bg-tactical-gray'
                  : 'border-gray-300 text-gray-900 hover:bg-gray-100'
              }`}
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>

          <p className={`text-sm mt-4 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-20 px-4 sm:px-6 lg:px-8 ${
        theme === 'dark' ? 'bg-tactical-charcoal' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Built for Global Teams
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Everything you need to coordinate AI development teams across time zones
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl border transition-all hover:scale-105 ${
                  theme === 'dark'
                    ? 'bg-tactical-black border-tactical-gray hover:border-tactical-amber'
                    : 'bg-gray-50 border-gray-200 hover:border-blue-300 hover:shadow-lg'
                }`}
              >
                <feature.icon className={`w-12 h-12 mb-4 ${
                  theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
                }`} />
                <h3 className={`text-xl font-semibold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {feature.title}
                </h3>
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Trusted by Global Teams
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl border ${
                  theme === 'dark'
                    ? 'bg-tactical-charcoal border-tactical-gray'
                    : 'bg-white border-gray-200 shadow-lg'
                }`}
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className={`mb-4 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  "{testimonial.content}"
                </p>
                <div>
                  <div className={`font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {testimonial.name}
                  </div>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className={`py-20 px-4 sm:px-6 lg:px-8 ${
        theme === 'dark' ? 'bg-tactical-charcoal' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Simple, Transparent Pricing
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Start with our demo, upgrade when you're ready
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-xl border transition-all hover:scale-105 ${
                  plan.popular
                    ? theme === 'dark'
                      ? 'bg-tactical-black border-tactical-amber ring-2 ring-tactical-amber'
                      : 'bg-blue-50 border-blue-300 ring-2 ring-blue-300'
                    : theme === 'dark'
                      ? 'bg-tactical-black border-tactical-gray'
                      : 'bg-gray-50 border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-sm font-medium ${
                    theme === 'dark'
                      ? 'bg-tactical-amber text-tactical-black'
                      : 'bg-blue-600 text-white'
                  }`}>
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className={`text-2xl font-bold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {plan.name}
                  </h3>
                  <div className={`text-4xl font-bold mb-2 ${
                    theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
                  }`}>
                    {plan.price}
                    {plan.period && (
                      <span className={`text-lg font-normal ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className={`w-5 h-5 mr-3 ${
                        theme === 'dark' ? 'text-tactical-amber' : 'text-blue-600'
                      }`} />
                      <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={plan.action}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? theme === 'dark'
                        ? 'bg-tactical-amber text-tactical-black hover:bg-yellow-500'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                      : theme === 'dark'
                        ? 'bg-tactical-gray text-white hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-3xl sm:text-4xl font-bold mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Ready to Coordinate Your Global Team?
          </h2>
          <p className={`text-xl mb-8 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Join thousands of AI developers using GlobalSync to build the future, together.
          </p>
          <button
            onClick={() => {
              setAuthMode('signup');
              setShowAuthModal(true);
            }}
            className={`px-8 py-4 text-lg font-medium rounded-lg transition-all hover:scale-105 ${
              theme === 'dark'
                ? 'bg-tactical-amber text-tactical-black hover:bg-yellow-500'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Start Your Free Trial
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t py-12 px-4 sm:px-6 lg:px-8 ${
        theme === 'dark' ? 'border-tactical-gray' : 'border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto text-center">
          <img 
            src="/GlobalSnycLogo.png" 
            alt="GlobalSync" 
            className="h-8 w-auto mx-auto mb-4"
          />
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            © 2024 GlobalSync. Built for elite AI-assisted development teams.
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onAuthSuccess={handleAuthSuccess}
        theme={theme}
      />
    </div>
  );
};