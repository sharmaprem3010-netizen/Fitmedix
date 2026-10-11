import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserAccount, UserHealthProfile } from '../../types/index.ts';
import { authService } from '../../services/authentication/authService.ts';
import { AuthCredentials, SignUpPayload } from '../../services/authentication/types.ts';

interface AuthContextType {
  user: UserAccount | null;
  profile: UserHealthProfile | null;
  isLoading: boolean;
  login: (credentials: AuthCredentials) => Promise<{ success: boolean; error?: string }>;
  signUp: (payload: SignUpPayload) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  saveProfile: (data: Partial<UserHealthProfile>) => Promise<UserHealthProfile>;
  isAuthenticated: boolean;
  isProfileComplete: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [profile, setProfile] = useState<UserHealthProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    authService.initialize().then((res) => {
      if (isMounted) {
        setUser(res.user);
        setProfile(res.profile);
        setIsLoading(false);
      }
    });

    const unsubscribe = authService.onAuthStateChange((updatedUser) => {
      if (isMounted) {
        setUser(updatedUser);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const login = useCallback(async (credentials: AuthCredentials) => {
    try {
      setIsLoading(true);
      const res = await authService.login(credentials);
      if (res.error) {
        return { success: false, error: res.error };
      }
      setUser(res.user);
      setProfile(res.profile);
      return { success: true };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = useCallback(async (payload: SignUpPayload) => {
    try {
      setIsLoading(true);
      const res = await authService.signUp(payload);
      if (res.error) {
        return { success: false, error: res.error };
      }
      setUser(res.user);
      setProfile(res.profile);
      return { success: true };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setProfile(null);
  }, []);

  const saveProfile = useCallback(async (data: Partial<UserHealthProfile>) => {
    const updated = await authService.saveProfile(data);
    setProfile(updated);
    if (user) {
      setUser({ ...user, isProfileComplete: true });
    }
    return updated;
  }, [user]);

  const isAuthenticated = !!user;
  const isProfileComplete = !!profile && (user?.isProfileComplete ?? false);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        login,
        signUp,
        logout,
        saveProfile,
        isAuthenticated,
        isProfileComplete,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
