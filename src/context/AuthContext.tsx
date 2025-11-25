import React, { createContext, useState, useEffect, useContext } from 'react';
import { storage, STORAGE_KEYS } from '../utils/store';
import { logoutUser } from '../utils/firebase/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  isProfileComplete: boolean;
  login: () => void;
  loginAsNewUser: () => void;
  completeRegistration: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const uid = storage.getString(STORAGE_KEYS.USER_UID);
    const profileDone = storage.getBoolean(STORAGE_KEYS.IS_PROFILE_COMPLETE);

    if (uid) {
      setIsAuthenticated(true);
      if (profileDone) {
        setIsProfileComplete(true);
      }
    }
    setLoading(false);
  };

  const login = () => {
    storage.set(STORAGE_KEYS.IS_PROFILE_COMPLETE, true);
    setIsAuthenticated(true);
    setIsProfileComplete(true);
  };

  const loginAsNewUser = () => {
    setIsAuthenticated(true);
    setIsProfileComplete(false);
  };

  const completeRegistration = () => {
    storage.set(STORAGE_KEYS.IS_PROFILE_COMPLETE, true);
    setIsProfileComplete(true);
  };

  const logout = async () => {
    await logoutUser();
    storage.remove(STORAGE_KEYS.IS_PROFILE_COMPLETE);
    setIsAuthenticated(false);
    setIsProfileComplete(false);
  };

  if (loading) return null;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isProfileComplete,
        login,
        loginAsNewUser,
        completeRegistration,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
