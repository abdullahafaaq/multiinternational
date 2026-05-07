import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  generateToken, 
  validateToken, 
  saveToken, 
  getToken, 
  clearToken, 
  verifyPassword 
} from '@/lib/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing valid token on mount
    const token = getToken();
    const isValid = validateToken(token);
    setIsAuthenticated(isValid);
    setIsLoading(false);
  }, []);

  const login = async (password: string): Promise<boolean> => {
    if (await verifyPassword(password)) {
      const token = generateToken();
      saveToken(token);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    clearToken();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
