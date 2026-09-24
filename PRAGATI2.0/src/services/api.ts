import { 
  Challenge, 
  Startup, 
  Application, 
  ExpertEvaluation, 
  PilotProject, 
  ProcurementContract, 
  ScaleUpPlan, 
  AuditLogEntry, 
  AppNotification,
  AIMatchingResponse,
  AIMatchingRequest
} from '../types';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error (${response.status}): ${errorText}`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType && !contentType.includes('application/json')) {
    throw new Error(`API error: expected JSON but received ${contentType}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  // Health
  checkHealth: () => fetchJson<{ status: string; timestamp: string }>('/health'),

  // Challenges
  getChallenges: () => fetchJson<Challenge[]>('/challenges'),
  getChallengeById: (id: string) => fetchJson<Challenge>(`/challenges/${id}`),
  createChallenge: (challenge: any) => fetchJson<Challenge>('/challenges', {
    method: 'POST',
    body: JSON.stringify(challenge)
  }),
  updateChallenge: (id: string, challenge: any) => fetchJson<Challenge>(`/challenges/${id}`, {
    method: 'PUT',
    body: JSON.stringify(challenge)
  }),
  updateChallengeStatus: (id: string, status: string) => fetchJson<Challenge>(`/challenges/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  }),
  deleteChallenge: (id: string) => fetchJson<{ success: boolean; message: string }>(`/challenges/${id}`, {
    method: 'DELETE'
  }),

  // Startups
  getStartups: (search?: string, domain?: string) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (domain) params.append('domain', domain);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return fetchJson<Startup[]>(`/startups${qs}`);
  },
  getStartupById: (id: string) => fetchJson<Startup>(`/startups/${id}`),
  createStartup: (startup: any) => fetchJson<Startup>('/startups', {
    method: 'POST',
    body: JSON.stringify(startup)
  }),
  updateStartup: (id: string, startup: any) => fetchJson<Startup>(`/startups/${id}`, {
    method: 'PUT',
    body: JSON.stringify(startup)
  }),
  deleteStartup: (id: string) => fetchJson<{ success: boolean; message: string }>(`/startups/${id}`, {
    method: 'DELETE'
  }),

  // Applications
  getApplications: () => fetchJson<Application[]>('/applications'),
  getApplicationById: (id: string) => fetchJson<Application>(`/applications/${id}`),
  submitApplication: (application: any) => fetchJson<Application>('/applications', {
    method: 'POST',
    body: JSON.stringify(application)
  }),
  updateApplicationStatus: (id: string, status: string) => fetchJson<Application>(`/applications/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  }),

  // Evaluations
  getEvaluations: () => fetchJson<ExpertEvaluation[]>('/evaluations'),
  getEvaluationById: (id: string) => fetchJson<ExpertEvaluation>(`/evaluations/${id}`),
  submitEvaluation: (id: string, scores: any, recommendation: string, remarks: string) => 
    fetchJson<ExpertEvaluation>(`/evaluations/${id}`, {
      method: 'POST',
      body: JSON.stringify({ scores, recommendation, remarks })
    }),

  // Pilots
  getPilots: () => fetchJson<PilotProject[]>('/pilots'),
  getPilotById: (id: string) => fetchJson<PilotProject>(`/pilots/${id}`),
  startPilot: (applicationId: string) => fetchJson<PilotProject>('/pilots/start', {
    method: 'POST',
    body: JSON.stringify({ applicationId })
  }),
  recordValidationDecision: (pilotId: string, decision: string, remarks: string) =>
    fetchJson<PilotProject>(`/pilots/${pilotId}/validation`, {
      method: 'POST',
      body: JSON.stringify({ decision, remarks })
    }),
  updatePilotProgress: (pilotId: string, progress: { progressPercent?: number; milestones?: any[]; kpis?: any[] }) =>
    fetchJson<PilotProject>(`/pilots/${pilotId}/progress`, {
      method: 'PUT',
      body: JSON.stringify(progress)
    }),

  // Procurement
  getProcurement: () => fetchJson<ProcurementContract[]>('/procurement'),
  releaseMilestonePayout: (contractId: string, milestoneNumber: number) =>
    fetchJson<ProcurementContract>(`/procurement/${contractId}/milestones/${milestoneNumber}/release`, {
      method: 'POST'
    }),

  // Scale-up
  getScaleUp: () => fetchJson<ScaleUpPlan>('/scale-up'),
  advanceScaleUpPhase: (phase: string) => fetchJson<ScaleUpPlan>('/scale-up/advance', {
    method: 'POST',
    body: JSON.stringify({ phase })
  }),

  // Audit Logs
  getAuditLogs: () => fetchJson<AuditLogEntry[]>('/audit-logs'),
  addAuditLog: (action: string, details: string, userRole: string, userName: string) =>
    fetchJson<AuditLogEntry>('/audit-logs', {
      method: 'POST',
      body: JSON.stringify({ action, details, userRole, userName })
    }),

  // Notifications
  getNotifications: () => fetchJson<AppNotification[]>('/notifications'),
  
  addNotification: (
  title: string,
  message: string,
  type: AppNotification['type']
) =>
  fetchJson<AppNotification>('/notifications', {
    method: 'POST',
    body: JSON.stringify({
      title,
      message,
      type
    })
  }),

  
  markNotificationRead: (id: string) => fetchJson<{ success: boolean }>(`/notifications/${id}/read`, {
    method: 'POST'
  }),
  markAllNotificationsRead: () => fetchJson<{ success: boolean }>('/notifications/read-all', {
    method: 'POST'
  }),

  // Admin
  getAdminStats: () => fetchJson<any>('/admin/stats'),
  resetDemoData: () => fetchJson<{ success: boolean; message: string }>('/admin/reset-demo', {
    method: 'POST'
  }),

  // AI Matching
  getAIMatching: (request: AIMatchingRequest | string) => {
    const payload = typeof request === 'string' ? { challengeId: request } : request;
    return fetchJson<AIMatchingResponse>('/ai/matching', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
};
