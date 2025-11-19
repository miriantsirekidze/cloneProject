import React, { createContext, useState, useEffect, useContext } from 'react';
import { storage, STORAGE_KEYS } from '../utils/store';
import { logoutUser } from '../utils/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const uid = storage.getString(STORAGE_KEYS.USER_UID);
    if (uid) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = () => setIsAuthenticated(true);
  
  const logout = async () => {
    await logoutUser();
    
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);