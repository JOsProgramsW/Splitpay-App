import React, { createContext, useState, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import { UserSession } from '../types/auth';

interface AuthContextType {
  user: UserSession | null;
  signIn: (sessionData: UserSession) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);

  const signIn = async (sessionData: UserSession) => {
    await SecureStore.setItemAsync('jwt_token', sessionData.token);
    setUser(sessionData);
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync('jwt_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);