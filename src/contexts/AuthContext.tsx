import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
  logout: () => void;
  signup: (email: string) => Promise<void>;
  verifySignupOtp: (email: string, otp: string) => Promise<boolean>;
  updateUserInfo: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null,
  });

  // Simulate checking for an existing session on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // In a real app, this would be a call to check the session
        const userData = localStorage.getItem('user');
        if (userData) {
          setAuthState({
            isAuthenticated: true,
            user: JSON.parse(userData),
            isLoading: false,
            error: null,
          });
        } else {
          setAuthState({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: 'Failed to load user session',
        });
      }
    };

    checkAuthStatus();
  }, []);

  // Mock login function
  const login = async (email: string): Promise<void> => {
    setAuthState({ ...authState, isLoading: true, error: null });
    try {
      // In a real app, this would be an API call
      // For now, we just simulate sending an OTP
      console.log(`OTP sent to email: ${email}`);
      localStorage.setItem('tempEmail', email);
      setAuthState({ ...authState, isLoading: false });
    } catch (error) {
      setAuthState({
        ...authState,
        isLoading: false,
        error: 'Failed to send OTP',
      });
      throw new Error('Failed to send OTP');
    }
  };

  // Mock OTP verification
  const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
    setAuthState({ ...authState, isLoading: true, error: null });
    try {
      // In a real app, this would be an API call to verify the OTP
      // For demo purposes, any 6-digit OTP is valid
      if (otp.length === 6 && /^\d+$/.test(otp)) {
        // Mock user data for successful login
        const mockUser: User = {
          id: '1',
          email,
          name: 'John Doe',
          nic: '123456789V',
          address: '123 Main St, Colombo',
          contactNumber: '+94 71 234 5678',
          vehicles: [
            {
              id: '1',
              vehicleNumber: 'KL-7896',
              chassisNumber: 'CH123456789',
              vehicleType: 'Car' as any,
              fuelType: 'Petrol 92' as any,
              quotaAmount: 20,
              remainingQuota: 15,
            },
          ],
        };
        
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.removeItem('tempEmail');
        
        setAuthState({
          isAuthenticated: true,
          user: mockUser,
          isLoading: false,
          error: null,
        });
        return true;
      } else {
        setAuthState({
          ...authState,
          isLoading: false,
          error: 'Invalid OTP',
        });
        return false;
      }
    } catch (error) {
      setAuthState({
        ...authState,
        isLoading: false,
        error: 'Failed to verify OTP',
      });
      return false;
    }
  };

  // Signup function
  const signup = async (email: string): Promise<void> => {
    setAuthState({ ...authState, isLoading: true, error: null });
    try {
      // In a real app, this would be an API call
      console.log(`OTP sent to email: ${email}`);
      localStorage.setItem('signupEmail', email);
      setAuthState({ ...authState, isLoading: false });
    } catch (error) {
      setAuthState({
        ...authState,
        isLoading: false,
        error: 'Failed to send OTP',
      });
      throw new Error('Failed to send OTP');
    }
  };

  // Verify signup OTP
  const verifySignupOtp = async (email: string, otp: string): Promise<boolean> => {
    setAuthState({ ...authState, isLoading: true, error: null });
    try {
      // In a real app, this would be an API call to verify the OTP
      // For demo purposes, any 6-digit OTP is valid
      if (otp.length === 6 && /^\d+$/.test(otp)) {
        // Store email for the signup process
        localStorage.setItem('signupVerifiedEmail', email);
        localStorage.removeItem('signupEmail');
        
        setAuthState({
          ...authState,
          isLoading: false,
        });
        return true;
      } else {
        setAuthState({
          ...authState,
          isLoading: false,
          error: 'Invalid OTP',
        });
        return false;
      }
    } catch (error) {
      setAuthState({
        ...authState,
        isLoading: false,
        error: 'Failed to verify OTP',
      });
      return false;
    }
  };

  // Update user info during signup process
  const updateUserInfo = (userData: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setAuthState({
        ...authState,
        user: updatedUser,
      });
    } else {
      // For signup flow
      const email = localStorage.getItem('signupVerifiedEmail') || '';
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name: userData.name || '',
        nic: userData.nic || '',
        address: userData.address || '',
        contactNumber: userData.contactNumber || '',
        vehicles: userData.vehicles || [],
      };
      
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.removeItem('signupVerifiedEmail');
      
      setAuthState({
        isAuthenticated: true,
        user: newUser,
        isLoading: false,
        error: null,
      });
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,
    });
  };

  const value = {
    ...authState,
    login,
    verifyOtp,
    logout,
    signup,
    verifySignupOtp,
    updateUserInfo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};