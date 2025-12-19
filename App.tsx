import { useEffect } from 'react';
import { useAppStore } from './store/useStore';

export default function App() {
  const { 
    initializeAuth,
    session,
    hasCompletedWizard,
    activeTab, 
    setActiveTab,
    // ... rest
  } = useAppStore();

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Show loading while checking auth
  if (session.isAuthenticated === undefined) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // AUTH GUARD
  if (!session.isAuthenticated) {
    return <PaywallView />;
  }

  // WIZARD GUARD
  if (!hasCompletedWizard) {
    return <SetupWizard />;
  }

  return (
    // ... rest of your app
  );
}
