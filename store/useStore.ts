import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Task, Log, Stats, ActiveTab, UserRole, SessionState, Tier } from '../types';
import { generateMockTasks, generateGhostLogs } from '../services/mockData';
import { generateToken } from '../services/auth';

interface AppState {
  // Session State
  session: SessionState;
  
  // App State
  activeTab: ActiveTab;
  tasks: Task[];
  ghostLogs: Log[];
  killSwitch: boolean;
  hasCompletedWizard: boolean; // NEW: Track wizard completion
  stats: Stats;
  userRole: UserRole;
  rateLimits: { vip: number; standard: number };
  
  // Actions
  login: (plan: Tier) => void;
  logout: () => void;
  completeWizard: () => void; // NEW: Action to complete wizard
  setActiveTab: (tab: ActiveTab) => void;
  setKillSwitch: (active: boolean) => void;
  setRateLimit: (queue: 'vip' | 'standard', value: number) => void;
  setUserRole: (role: UserRole) => void;
  addTask: (task: Task) => void;
  updateTaskStatus: (id: string, status: 'approved' | 'rejected', newText?: string) => void;
  updateStats: (newStats: Partial<Stats>) => void;
  resetStats: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial Session State
      session: {
        isAuthenticated: false,
        subscriptionStatus: 'inactive',
        plan: null,
        token: null
      },

      // Initial App State
      activeTab: 'dashboard',
      tasks: generateMockTasks(),
      ghostLogs: generateGhostLogs(),
      killSwitch: false,
      hasCompletedWizard: false, // Default to false
      userRole: 'admin',
      rateLimits: { vip: 80, standard: 20 },
      stats: {
        totalRuns: 1240,
        risksCaught: 42,
        moneySaved: 18600,
        activeWorkers: 12
      },

      // Actions
      login: (plan) => {
        // Issue JWT
        const role: UserRole = 'admin'; // Default role for new signups
        const token = generateToken(role, plan);
        
        set({
          session: { isAuthenticated: true, subscriptionStatus: 'active', plan, token },
          userRole: role,
          hasCompletedWizard: false // Reset wizard for new login simulation
        });
      },

      logout: () => set({
        session: { isAuthenticated: false, subscriptionStatus: 'inactive', plan: null, token: null },
        activeTab: 'dashboard',
        hasCompletedWizard: false
      }),

      completeWizard: () => set({ hasCompletedWizard: true }),

      setActiveTab: (tab) => set({ activeTab: tab }),
      
      // SECURE ENDPOINT: Kill Switch
      setKillSwitch: (active) => {
        const { userRole } = get();
        if (userRole !== 'admin') {
          console.error("SECURITY VIOLATION: Unauthorized attempt to toggle Kill Switch.");
          return;
        }
        set({ killSwitch: active });
      },

      // SECURE ENDPOINT: Rate Limits
      setRateLimit: (queue, value) => {
        const { userRole, rateLimits } = get();
        if (userRole !== 'admin') {
           console.error("SECURITY VIOLATION: Unauthorized attempt to modify Rate Limits.");
           return;
        }
        set({
            rateLimits: { ...rateLimits, [queue]: value }
        });
      },
      
      // Simulation Helper: allows impersonating roles for demo
      setUserRole: (role) => {
         const { session } = get();
         // Regenerate token to reflect the simulated role change for consistency
         if (session.plan) {
             const newToken = generateToken(role, session.plan);
             set({ 
                 userRole: role,
                 session: { ...session, token: newToken }
             });
         } else {
             set({ userRole: role });
         }
      },
      
      addTask: (task) => set((state) => {
        const newTasks = [task, ...state.tasks];
        if (newTasks.length > 100) newTasks.length = 100;
        return { tasks: newTasks };
      }),
      
      // SECURE ENDPOINT: Task Approval
      updateTaskStatus: (id, status, newText) => {
        const { userRole } = get();
        // RBAC Check: Only admins can write to the database (approve/reject)
        if (userRole !== 'admin') {
            console.error("SECURITY VIOLATION: Unauthorized attempt to update task status.");
            return;
        }

        set((state) => ({
            tasks: state.tasks.map(t => 
            t.id === id 
                ? { ...t, status, aiDraft: newText || t.aiDraft } 
                : t
            ),
            stats: status === 'approved' && newText 
            ? { ...state.stats, moneySaved: state.stats.moneySaved + 50 } 
            : state.stats
        }));
      },

      updateStats: (newStats) => set((state) => ({
        stats: { ...state.stats, ...newStats }
      })),

      resetStats: () => set({
        stats: {
            totalRuns: 1240,
            risksCaught: 42,
            moneySaved: 18600,
            activeWorkers: 12
        }
      })
    }),
    {
      name: 'myers-guardian-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        killSwitch: state.killSwitch, 
        userRole: state.userRole,
        stats: state.stats,
        session: state.session,
        rateLimits: state.rateLimits,
        hasCompletedWizard: state.hasCompletedWizard
      }),
    }
  )
);