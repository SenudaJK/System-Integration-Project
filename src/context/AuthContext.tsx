import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

// This interface maps to the backend response structure
interface LoginResponse {
  token: string;
  type: string;
  username: string;
  roles: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsLoading(false);
          return;
        }
        
        const userData = await authApi.validateToken() as Partial<User> & { valid: boolean };

        // First log the response to see its structure
        console.log('Token validation response:', userData);

        if (userData.valid) {
          setUser({
            id: userData.id ?? '',
            email: userData.email ?? '',
            name: userData.name ?? '',
            role: userData.role ?? '',  // Note: using the role property if available
            username: (userData as Partial<User> & { username?: string }).username ?? ''
          } as User);
        } else {
          // Token is invalid
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error('Authentication check failed:', err);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authApi.login(username, password) as LoginResponse;
      console.log('Auth response:', response);
      
      // Store JWT token from response
      localStorage.setItem('token', response.token);
      localStorage.setItem('token_type', response.type);
      
      // Set user data from response
      // Match the User type defined in types/index.ts
      setUser({
        id: response.username, // Use username as ID 
        email: `${response.username}@example.com`, // Placeholder email
        name: response.username, // Use username as name
        role: response.roles[0] as 'ROLE_ADMIN' | 'ROLE_USER' | 'ROLE_STATION_MANAGER', // Keep the ROLE_ prefix
      });
      
      // Successfully logged in, no need to return the response
      return;
    } catch (err) {
      console.error('Login failed:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('token_type');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context; // This line was missing
}