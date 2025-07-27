import { create } from 'zustand';
import supabase from '@/lib/supabaseClient';

interface AuthState {
  user: any | null;
  profile: {
    role: 'super_admin' | 'department_head' | 'assessor' | 'reviewer' | null;
    department_id: string | null;
    email: string | null;
  } | null;
  loading: boolean;
  setUser: (user: any) => void;
  setProfile: (profile: AuthState['profile']) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: false,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  reset: () => set({ user: null, profile: null, loading: false }),
  initializeAuth: async () => {
    set({ loading: true });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role, department_id, email')
            .eq('id', session.user.id)
            .single();
          
          if (error) {
            console.error('Error fetching profile:', error);
            // Don't reset user on profile fetch error, just set profile to null
            // This allows login to continue even if profile fetch fails
            set({ user: session.user, profile: null, loading: false });
          } else {
            set({ user: session.user, profile: profile, loading: false });
          }
        } catch (err) {
          console.error('Exception fetching profile:', err);
          // Keep the user session but set profile to null
          set({ user: session.user, profile: null, loading: false });
        }
      } else {
        set({ user: null, profile: null, loading: false });
      }
    } catch (err) {
      console.error('Error getting session:', err);
      set({ user: null, profile: null, loading: false });
    }
  },
}));