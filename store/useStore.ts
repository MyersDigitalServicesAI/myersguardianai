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
  },  activeTab: 'dashboard',
  killSwitch: false,
  stats: {
    totalTasks: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
  },
  userRole: 'user',
  hasCompletedWizard: false,

  // AUTH ACTIONS
  initializeAuth: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      set({
        session: {
          isAuthenticated: true,
          user: session.user,
          plan: session.user.user_metadata?.plan || 'free',
        },
      });
      
      // Fetch user's tasks
      await get().fetchTasks();
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        set({
          session: {
            isAuthenticated: true,
            user: session.user,
            plan: session.user.user_metadata?.plan || 'free',
          },
        });
        get().fetchTasks();
      } else {
        set({
          session: {
            isAuthenticated: false,
            user: null,
            plan: null,
          },
          tasks: [],
        });
      }
    });
  },

  login: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
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
      tasks: [],
    });
  },
  
    completeWizard: () => set({ hasCompletedWizard: true }),

  // TASK ACTIONS (connected to Supabase)
  fetchTasks: async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      return;
    }

    set({ tasks: data || [] });
    
    // Update stats
    const completed = data?.filter(t => t.status === 'completed').length || 0;
    const pending = data?.filter(t => t.status === 'pending').length || 0;
    const inProgress = data?.filter(t => t.status === 'in_progress').length || 0;
    
    set({
      stats: {
        totalTasks: data?.length || 0,
        completed,
        pending,
        inProgress,
      },
    });
  },

  createTask: async (task: Partial<Task>) => {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        title: task.title,
        description: task.description,
        status: task.status || 'pending',
        priority: task.priority || 'medium',
      }])
      .select()
      .single();

    if (error) throw error;
    
    await get().fetchTasks();
  },

  updateTask: async (id: string, updates: Partial<Task>) => {
    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    
    await get().fetchTasks();
  },

  deleteTask: async (id: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    await get().fetchTasks();
  },

  // ... rest of your existing actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  setKillSwitch: (value) => set({ killSwitch: value }),
}));
