"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';
import { useAuth } from '@/store/useAuth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, profile, initializeAuth, setUser, setProfile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Initialize auth on first load
    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            setUser(session.user);
            
            // Fetch user profile
            try {
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('role, department_id, email')
                .eq('id', session.user.id)
                .single();
              
              if (error) {
                console.error('Error fetching profile on auth change:', error);
                setProfile(null);
              } else {
                setProfile(profile);
              }
            } catch (err) {
              console.error('Exception fetching profile on auth change:', err);
              setProfile(null);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          router.push('/login');
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [initializeAuth, setUser, setProfile, router]);

  return <>{children}</>;
}