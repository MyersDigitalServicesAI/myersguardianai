import React from 'react';
import { Shield, Zap, Check, Lock, Activity, Globe } from 'lucide-react';
import { useAppStore } from '../store/useStore';

// Workaround for TypeScript not recognizing custom web components in JSX
// This avoids issues with global namespace declaration merging
const StripeBuyButton = 'stripe-buy-button' as any;

const PaywallView = () => {
  const { login } = useAppStore();

  const handleExistingCustomerLogin = () => {
      // In production, this would open your Auth provider (Clerk/Supabase) modal
      login('enterprise'); // Simulating a returning Enterprise user
  };

  const FeatureItem = ({ text }: { text: string }) => (
    <div className="flex items-center space-x-3 text-gray-300">
      <div className="bg-blue-500/10 p-1 rounded-full text-blue-400">
        <Check size={14} />
      </div>
      <span className="text-sm">{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[128px]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-2">
           <div className="bg-blue-600 p-1.5 rounded shadow-[0_0_15px_rgba(37,99,235,0.5)]">
             <Zap size={20} fill="white" className="text-white" />
           </div>
           <span className="text-xl font-bold tracking-tight">Myers Guardian AI</span>
        </div>
        <div className="flex items-center space-x-4">
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors hidden md:block">Documentation</a>
            <button 
                onClick={handleExistingCustomerLogin}
                className="text-sm bg-gray-900 border border-gray-700 hover:bg-gray-800 px-4 py-2 rounded-lg text-white font-medium transition-colors"
            >
            Log In
            </button>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center p-8 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-gray-900 border border-gray-800 rounded-full px-3 py-1 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs font-mono text-gray-300 tracking-wide uppercase">v3.0.1 System Online</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 mb-6 tracking-tight">
          Secure Your <br /> AI Infrastructure.
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed">
          The enterprise standard for real-time LLM risk monitoring, liability prevention, and human-in-the-loop workflows.
        </p>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl text-left">
          
          {/* Standard Plan */}
          <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-all group relative flex flex-col">
            <div className="mb-6">
               <h3 className="text-lg font-bold text-white mb-2">Standard</h3>
               <div className="flex items-baseline space-x-1">
                 <span className="text-3xl font-bold">$499</span>
                 <span className="text-gray-500">/month</span>
               </div>
               <p className="text-sm text-gray-400 mt-2">For growing teams deploying AI agents.</p>
            </div>
            
            <div className="space-y-4 mb-8 flex-1">
              <FeatureItem text="Up to 10k requests/mo" />
              <FeatureItem text="Basic Hallucination Detection" />
              <FeatureItem text="5 Team Members" />
              <FeatureItem text="Email Support" />
            </div>

            <div className="w-full pt-2">
              <StripeBuyButton
                buy-button-id="buy_btn_1SdlZpKpgJRKm8rUVmiK9TDv"
                publishable-key="pk_live_51RT2xFKpgJRKm8rUH9dh7QR3NCjVYya9lMfr9BRHmLbCWLTvBN5L3SysvZONlqE81qS4Hh5SvAy76ddaMna4wYNe00VZzaVMre"
              >
              </StripeBuyButton>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-gray-900/80 backdrop-blur border border-blue-500/30 rounded-2xl p-8 relative overflow-hidden shadow-[0_0_40px_rgba(37,99,235,0.1)] group flex flex-col">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              RECOMMENDED
            </div>
            <div className="mb-6">
               <h3 className="text-lg font-bold text-white mb-2 flex items-center">
                 Enterprise <Shield size={16} className="ml-2 text-blue-400" />
               </h3>
               <div className="flex items-baseline space-x-1">
                 <span className="text-3xl font-bold">$2,499</span>
                 <span className="text-gray-500">/month</span>
               </div>
               <p className="text-sm text-gray-400 mt-2">Full liability protection & dedicated hardware.</p>
            </div>
            
            <div className="space-y-4 mb-8 flex-1">
              <FeatureItem text="Unlimited Requests" />
              <FeatureItem text="Emergency Kill Switch Access" />
              <FeatureItem text="VIP Processing Queue (12ms)" />
              <FeatureItem text="Dedicated Shadow LLM Auditor" />
              <FeatureItem text="SLA & Liability Coverage" />
            </div>

            <div className="w-full pt-2">
              <StripeBuyButton
                buy-button-id="buy_btn_1Sdln2KpgJRKm8rUC5Xyvgif"
                publishable-key="pk_live_51RT2xFKpgJRKm8rUH9dh7QR3NCjVYya9lMfr9BRHmLbCWLTvBN5L3SysvZONlqE81qS4Hh5SvAy76ddaMna4wYNe00VZzaVMre"
              >
              </StripeBuyButton>
            </div>
          </div>

        </div>

        <div className="mt-12 flex items-center space-x-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
           {/* Mock Trust Badges */}
           <div className="flex items-center space-x-2"><Activity size={20} /> <span className="font-bold">SOC2 Compliant</span></div>
           <div className="h-4 w-px bg-gray-700"></div>
           <div className="flex items-center space-x-2"><Lock size={20} /> <span className="font-bold">256-bit Encryption</span></div>
           <div className="h-4 w-px bg-gray-700"></div>
           <div className="flex items-center space-x-2"><Globe size={20} /> <span className="font-bold">Deployed in 4 Regions</span></div>
        </div>
      </main>
    </div>
  );
};

export default PaywallView;