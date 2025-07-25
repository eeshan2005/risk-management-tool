import { create } from 'zustand';

interface AuthState {
  user: any | null;
  profile: {
    role: 'admin' | 'assessor' | 'reviewer' | null;
    company_id: string | null;
    email: string | null;
  } | null;
  loading: boolean;
  setUser: (user: any) => void;
  setProfile: (profile: AuthState['profile']) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: false,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  reset: () => set({ user: null, profile: null, loading: false }),
})); 