import React, { useState } from 'react';
import { Shield, Zap, Check, ArrowRight, Server, Lock, Cpu } from 'lucide-react';
import { useAppStore } from '../store/useStore';

const SetupWizard = () => {
  const { completeWizard } = useAppStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        if (step < 3) {
            setStep(step + 1);
        } else {
            completeWizard();
        }
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="bg-gray-900 border border-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl relative overflow-hidden flex flex-col min-h-[500px]">
        {/* Progress Bar */}
        <div className="h-1 bg-gray-800 w-full">
            <div 
                className="h-full bg-blue-600 transition-all duration-500 ease-in-out" 
                style={{ width: `${(step / 3) * 100}%` }}
            ></div>
        </div>

        <div className="flex-1 p-12 flex flex-col justify-center">
            
            {/* Step 1: Welcome & Context */}
            {step === 1 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-6 text-blue-500">
                        <Shield size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Initialize Guardian Node</h2>
                    <p className="text-gray-400 text-lg leading-relaxed mb-8">
                        Welcome to the Myers Guardian interface. We are about to establish a secure, real-time link between your LLM providers and your output channels.
                    </p>
                    
                    <div className="space-y-4 mb-8">
                        <div className="flex items-center text-gray-300">
                            <Check className="text-green-500 mr-3" size={20} />
                            <span>Establishing secure websocket tunnel...</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                            <Check className="text-green-500 mr-3" size={20} />
                            <span>Verifying regional compliance (US-EAST-1)...</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                            <Check className="text-green-500 mr-3" size={20} />
                            <span>Loading baseline hallucination models...</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 2: Configuration */}
            {step === 2 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-2xl font-bold text-white mb-6">Select Model Sources</h2>
                    <p className="text-gray-400 mb-6">Which endpoints should the Guardian monitor for liability risks?</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className="border border-blue-500 bg-blue-900/10 p-4 rounded-xl relative cursor-pointer">
                            <div className="absolute top-3 right-3 text-blue-500"><Check size={16} /></div>
                            <div className="flex items-center mb-2">
                                <Cpu className="text-gray-300 mr-2" size={20} />
                                <span className="font-bold text-white">OpenAI GPT-4</span>
                            </div>
                            <div className="text-xs text-gray-400">Connected via API Key</div>
                        </div>
                        <div className="border border-gray-700 bg-gray-800/30 p-4 rounded-xl opacity-60 hover:opacity-100 cursor-pointer transition-opacity">
                            <div className="flex items-center mb-2">
                                <Server className="text-gray-300 mr-2" size={20} />
                                <span className="font-bold text-white">Anthropic Claude</span>
                            </div>
                            <div className="text-xs text-gray-400">Click to connect</div>
                        </div>
                        <div className="border border-gray-700 bg-gray-800/30 p-4 rounded-xl opacity-60 hover:opacity-100 cursor-pointer transition-opacity">
                            <div className="flex items-center mb-2">
                                <Lock className="text-gray-300 mr-2" size={20} />
                                <span className="font-bold text-white">Private LLaMA</span>
                            </div>
                            <div className="text-xs text-gray-400">Click to connect</div>
                        </div>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-lg">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Risk Tolerance Threshold</label>
                        <input type="range" className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" defaultValue="75" />
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>Permissive</span>
                            <span>Balanced</span>
                            <span className="text-blue-400 font-bold">Strict (Recommended)</span>
                        </div>
                    </div>
                </div>
            )}

             {/* Step 3: Power Moves Tease */}
             {step === 3 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 animate-pulse">
                        <Zap size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">System Active</h2>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">
                        Your dashboard is live. We have identified 3 optimization opportunities to improve your throughput immediately.
                    </p>

                    <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 p-4 rounded-xl text-left max-w-md mx-auto mb-8">
                        <div className="text-xs text-blue-400 font-bold uppercase mb-2 tracking-wider">Recommended Next Step</div>
                        <div className="font-bold text-white flex items-center">
                            <span className="mr-2">🚀</span> Activate "Shadow Mode"
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Run risk analysis in parallel to avoid latency penalties.</p>
                    </div>
                </div>
            )}
        </div>

        {/* Footer Navigation */}
        <div className="bg-gray-950 p-6 border-t border-gray-800 flex justify-between items-center">
            <div className="text-xs text-gray-500 font-mono">
                {step === 1 && "Initialization"}
                {step === 2 && "Configuration"}
                {step === 3 && "Finalization"}
            </div>
                  <button 
            onClick={completeWizard}
            className="text-gray-400 hover:text-white px-4 py-2 rounded-lg font-bold transition-all"
          >
            Skip Setup
          </button>
          <button 
                onClick={handleNext}
                disabled={loading}
                className="bg-white hover:bg-gray-200 text-black px-6 py-2 rounded-lg font-bold flex items-center transition-all disabled:opacity-50 disabled:cursor-wait"
            >
                {loading ? 'Processing...' : (step === 3 ? 'Enter Dashboard' : 'Next Step')}
                {!loading && <ArrowRight size={16} className="ml-2" />}
            </button>
        </div>
      </div>
    </div>
  );
};

export default SetupWizard;
