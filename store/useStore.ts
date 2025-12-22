import { create } from 'zustand';
import { supabase, Task } from '../services/supabase';

interface AppState {
  // ... existing state
  session: {
    isAuthenticated: boolean;
    user: any;
    plan: string | null;
  };
  tasks: Task[];
  hasCompletedWizard: boolean;

  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;

  // Task actions
  fetchTasks: () => Promise<void>;
  createTask: (task: Partial<Task>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
    completeWizard: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  completeWizard: () => {
    localStorage.setItem('wizard-completed', 'true');
    set({ hasCompletedWizard: true });
  }, activeTab: 'dashboard',
    session: {
      isAuthenticated: undefined,
      user: null,
      plan: null,
    },
    tasks: [],
    killSwitch: false,
    stats: {
      totalRuns: 0,
      risksCaught: 0,
      moneySaved: 0,
      activeWorkers: 0,
    },
    userRole: 'user',
    hasCompletedWizard: typeof window !== 'undefined' && localStorage.getItem('wizard-completed') === 'true',
    
    // AUTH ACTIONS
    initializeAuth: async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        set({
          session: {
            isAuthenticated: true,
            user: session.user,
            plan: null,
          },
        });
      } else {
        set({
          session: {
            isAuthenticated: false,
            user: null,
            plan: null,
          },
        });
      }
    },

    login: async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      await get().initializeAuth();
    },

    signup: async (email: string, password: string) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
    },

    logout: async () => {
      await supabase.auth.signOut();
      set({
        session: {
          isAuthenticated: false,
          user: null,
          plan: null,
        },
      });
    },

    // TASK ACTIONS
    fetchTasks: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        return;
      }

      set({ tasks: data || [] });
    },

    createTask: async (task: Partial<Task>) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            ...task,
            timestamp: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating task:', error);
        throw error;
      }

      // Refresh tasks
      await get().fetchTasks();
    },

    updateTask: async (id: string, updates: Partial<Task>) => {
      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating task:', error);
        throw error;
      }

      // Refresh tasks
      await get().fetchTasks();
    },

    deleteTask: async (id: string) => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting task:', error);
        throw error;
      }

      // Refresh tasks
      await get().fetchTasks();
    },
}))
