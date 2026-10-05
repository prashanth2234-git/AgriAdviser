import { apiFetch, setStoredToken, clearStoredToken } from './api';
import {
  RegisterInput,
  LoginInput,
  UserRecord,
  UserPreferencesRecord,
  PreferencesUpdateInput,
} from '@shared/types';

export const authService = {
  async register(data: RegisterInput): Promise<{ user: UserRecord; token: string }> {
    const res = await apiFetch<{ user: UserRecord; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setStoredToken(res.token);
    return res;
  },

  async login(data: LoginInput): Promise<{ user: UserRecord; token: string }> {
    const res = await apiFetch<{ user: UserRecord; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setStoredToken(res.token);
    return res;
  },

  async logout(): Promise<void> {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } finally {
      clearStoredToken();
    }
  },

  async getCurrentUser(): Promise<UserRecord> {
    const res = await apiFetch<{ user: UserRecord }>('/auth/me');
    return res.user;
  },

  async getProfile(): Promise<UserRecord> {
    return await apiFetch<UserRecord>('/profile');
  },

  async updateProfile(data: Partial<UserRecord>): Promise<UserRecord> {
    return await apiFetch<UserRecord>('/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async getPreferences(): Promise<UserPreferencesRecord> {
    return await apiFetch<UserPreferencesRecord>('/preferences');
  },

  async updatePreferences(data: PreferencesUpdateInput): Promise<UserPreferencesRecord> {
    return await apiFetch<UserPreferencesRecord>('/preferences', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};
