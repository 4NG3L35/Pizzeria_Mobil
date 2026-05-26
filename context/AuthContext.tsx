import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '../database/supabase';
import { Session } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'client' | null;

export interface UserData {
  id: string; 
  username: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: UserData | null;
  session: Session | null;
  logout: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, role')
        .eq('id', userId)
        .single();

      if (error) {
        
        setTimeout(async () => {
          const { data: retryData, error: retryError } = await supabase
            .from('profiles')
            .select('username, role')
            .eq('id', userId)
            .single();
          if (!retryError && retryData) {
            setUser({
              id: userId,
              username: retryData.username,
              email: email,
              role: retryData.role as UserRole,
            });
          }
        }, 500);
        return;
      }

      if (data) {
        setUser({
          id: userId,
          username: data.username,
          email: email,
          role: data.role as UserRole,
        });
      }
    } catch (err) {
      console.error('Error cargando el perfil de usuario:', err);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email || '');
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.email || '');
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const value = {
    user,
    session,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
