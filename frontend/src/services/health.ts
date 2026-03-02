import { djangoApi } from './django-api';

export type BackendHealth = {
  status: string;
};

export type HealthResult =
  | { ok: true; url: string; data: BackendHealth }
  | { ok: false; url: string; error: string };

export async function fetchBackendHealth(): Promise<HealthResult> {
  const url = `${djangoApi.defaults.baseURL}/api/health/`;

  try {
    const response = await djangoApi.get<BackendHealth>('/api/health/');
    return { ok: true, url, data: response.data };
  } catch (error: any) {
    const message = error.response?.status 
      ? `HTTP ${error.response.status}` 
      : error.message || 'Erro desconhecido';
    return { ok: false, url, error: message };
  }
}

