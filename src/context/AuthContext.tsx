import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../utils/supabaseClient';

export type UserRole = 'kid' | 'parent' | 'school' | 'admin' | null;

interface AuthContextType {
  user: any;
  role: UserRole;
  childProfile: any;
  loading: boolean;
  kidLogin: (secretKey: string) => Promise<{ success: boolean; error?: string }>;
  parentLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  childProfile: null,
  loading: true,
  kidLogin: async () => ({ success: false }),
  parentLogin: async () => ({ success: false }),
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [childProfile, setChildProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    checkInitialAuth();
  }, []);

  const checkInitialAuth = async () => {
    try {
      const savedRole = (await AsyncStorage.getItem('kido_auth_role')) as UserRole;
      const childId = await AsyncStorage.getItem('kido_child_id');

      if (savedRole === 'kid' && childId) {
        // Fetch kid profile
        const { data, error } = await supabase
          .from('children')
          .select('*')
          .eq('id', childId)
          .single();

        if (data && !error) {
          setChildProfile(data);
          setRole('kid');
        }
      } else {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          setRole(savedRole || 'parent');
        }
      }
    } catch (e) {
      console.warn('Error checking initial auth:', e);
    } finally {
      setLoading(false);
    }
  };

  const kidLogin = async (secretKey: string) => {
    try {
      const cleanKey = secretKey.trim().toUpperCase();
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('secret_key', cleanKey)
        .single();

      if (error || !data) {
        return { success: false, error: 'Oops! Secret Key not found. Please ask your parent/teacher!' };
      }

      await AsyncStorage.setItem('kido_auth_role', 'kid');
      await AsyncStorage.setItem('kido_child_id', data.id);
      await AsyncStorage.setItem('kido_child_name', data.name || 'Champion');
      if (data.theme) {
        await AsyncStorage.setItem('kido_theme', data.theme);
      }

      setChildProfile(data);
      setRole('kid');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed. Please try again!' };
    }
  };

  const parentLogin = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error || !data.user) {
        return { success: false, error: error?.message || 'Invalid email or password.' };
      }

      await AsyncStorage.setItem('kido_auth_role', 'parent');
      setUser(data.user);
      setRole('parent');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed. Please try again.' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    await AsyncStorage.removeItem('kido_auth_role');
    await AsyncStorage.removeItem('kido_child_id');
    await AsyncStorage.removeItem('kido_child_name');
    setUser(null);
    setRole(null);
    setChildProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        childProfile,
        loading,
        kidLogin,
        parentLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
