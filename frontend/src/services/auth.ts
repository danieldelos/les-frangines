export type AuthUser = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: "admin" | "professor" | "aluno";
};

export type AuthSuccess = {
  user: AuthUser;
};

export type AuthError = {
  detail: string;
};

import { api } from './api';

export async function loginWithPassword(input: {
  email: string;
  password: string;
}): Promise<AuthSuccess> {
  const response = await api.post<AuthSuccess>('/auth/login', input);
  return response.data;
}

export async function registerWithPassword(input: {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}): Promise<AuthSuccess> {
  const response = await api.post<AuthSuccess>('/auth/register', input);
  return response.data;
}

export async function loginWithGoogle(idToken: string): Promise<AuthSuccess> {
  const response = await api.post<AuthSuccess>('/auth/google', { id_token: idToken });
  return response.data;
}

