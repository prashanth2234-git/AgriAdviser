import { apiFetch } from './api';
import { AdvisoryRequestInput, AdvisoryRecord, DashboardSummary } from '@shared/types';

export const advisoryService = {
  async createAdvisory(input: AdvisoryRequestInput): Promise<AdvisoryRecord> {
    return await apiFetch<AdvisoryRecord>('/advisories', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  async getAdvisories(filters?: {
    crop?: string;
    domain?: string;
    search?: string;
    sort?: 'newest' | 'oldest';
  }): Promise<AdvisoryRecord[]> {
    return await apiFetch<AdvisoryRecord[]>('/advisories', {
      params: filters,
    });
  },

  async getAdvisoryById(id: string): Promise<AdvisoryRecord> {
    return await apiFetch<AdvisoryRecord>(`/advisories/${id}`);
  },

  async deleteAdvisory(id: string): Promise<void> {
    await apiFetch(`/advisories/${id}`, {
      method: 'DELETE',
    });
  },

  async getDashboardSummary(): Promise<DashboardSummary> {
    return await apiFetch<DashboardSummary>('/dashboard/summary');
  },
};
