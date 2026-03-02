import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  loginWithPassword,
  registerWithPassword,
  loginWithGoogle,
  AuthSuccess,
  AuthUser
} from './auth';
import { fetchBackendHealth, HealthResult } from './health';

// Auth hooks
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation<AuthSuccess, Error, { email: string; password: string }>({
    mutationFn: loginWithPassword,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'user'], data.user);
    }
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation<AuthSuccess, Error, { 
    email: string; 
    password: string; 
    first_name?: string; 
    last_name?: string; 
  }>({
    mutationFn: registerWithPassword,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'user'], data.user);
    }
  });
};

export const useGoogleLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation<AuthSuccess, Error, string>({
    mutationFn: loginWithGoogle,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'user'], data.user);
    }
  });
};

export const useAuthUser = () => {
  return useQuery<AuthUser | null>({
    queryKey: ['auth', 'user'],
    queryFn: () => {
      const user = localStorage.getItem('auth_user');
      return user ? JSON.parse(user) : null;
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
};

// Health hooks
export const useBackendHealth = () => {
  return useQuery<HealthResult>({
    queryKey: ['health', 'backend'],
    queryFn: fetchBackendHealth,
    refetchInterval: 30000, // 30 seconds
    refetchOnWindowFocus: true
  });
};