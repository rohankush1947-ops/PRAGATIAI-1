import { api } from "../services/api";
import React, { createContext, useContext, useState, useEffect } from 'react';

import {
  UserRole,
  Challenge,
  Startup,
  Application,
  ExpertEvaluation,
  PilotProject,
  PilotKPI,
  PilotLifecycleStatus,
  PilotValidationDecision,
  PilotValidationStatus,
  ProcurementContract,
  ProcurementContractStatus,
  ProcurementMilestone,
  ScaleUpPlan,
  ImpactRecord,
  AuditLogEntry,
  AppNotification
} from '../types';

import {
  INITIAL_CHALLENGES,
  MOCK_STARTUPS,
  INITIAL_APPLICATIONS,
  INITIAL_EVALUATIONS,
  INITIAL_PILOTS,
  INITIAL_PROCUREMENT,
  INITIAL_SCALE_UP,
  INITIAL_IMPACT_RECORDS,
  calculateImpactMetrics,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';


interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}


interface PragatiContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;

  challenges: Challenge[];
  startups: Startup[];
  applications: Application[];
  evaluations: ExpertEvaluation[];
  pilots: PilotProject[];
  procurementContracts: ProcurementContract[];
  scaleUpPlan: ScaleUpPlan;
  scaleUpPlans: ScaleUpPlan[];
  impactRecords: ImpactRecord[];
  auditLogs: AuditLogEntry[];
  notifications: AppNotification[];

  toasts: ToastMessage[];

  addToast: (
    type: 'success' | 'info' | 'warning' | 'error',
    title: string,
    message: string
  ) => void;

  removeToast: (id: string) => void;

  createChallenge: (
    challenge: Omit<
      Challenge,
      'id' | 'createdAt' | 'status' | 'applicationsCount'
    >
  ) => Promise<string>;

  publishChallenge: (id: string) => Promise<void>;

  applyForChallenge: (
  application: Omit<Application, 'id' | 'status' | 'submissionDate'>
) => Promise<string>;

  submitEvaluation: (
    evaluationId: string,
    scores: ExpertEvaluation['scores'],
    recommendation: ExpertEvaluation['recommendation'],
    remarks: string
 ) => Promise<void>;

  startPilot: (applicationId: string) => Promise<void>;
  createPilotProject: (pilotData: Partial<PilotProject>) => Promise<PilotProject>;
  updatePilotStatus: (
    pilotId: string, 
    status: PilotLifecycleStatus, 
    notes?: string, 
    authorizedOfficial?: string
  ) => Promise<void>;
  recordKPIMeasurement: (
    pilotId: string, 
    kpi: Partial<PilotKPI>
  ) => Promise<void>;

  updateValidationDecision: (
    pilotId: string,
    decision: PilotValidationDecision,
    remarks: string,
    extra?: {
      officialObservations?: string;
      evidenceNotes?: string;
      validationStatus?: PilotValidationStatus;
      authorizedOfficial?: string;
      validationScore?: number;
    }
  ) => Promise<void>;

  releaseProcurementMilestone: (
    contractId: string,
    milestoneNumber: number
  ) => Promise<void>;

  createProcurementContract: (
    contractData: Partial<ProcurementContract>
  ) => Promise<ProcurementContract>;

  updateProcurementStatus: (
    contractId: string,
    status: ProcurementContractStatus,
    notes?: string,
    authorizedOfficial?: string
  ) => Promise<void>;

  advanceScaleUpPhase: (phaseNumber: string) => Promise<void>;
  createScaleUpPlan: (planData: Partial<ScaleUpPlan>) => Promise<ScaleUpPlan>;
  updateScaleUpPlan: (id: string, planData: Partial<ScaleUpPlan>) => Promise<ScaleUpPlan>;
  submitScaleUpPlan: (id: string, notes?: string) => Promise<ScaleUpPlan>;
  approveScaleUpPlan: (id: string, notes?: string, official?: string) => Promise<ScaleUpPlan>;
  activateScaleUpPlan: (id: string, notes?: string) => Promise<ScaleUpPlan>;
  completeScaleUpPlan: (id: string, notes?: string) => Promise<ScaleUpPlan>;

  createImpactRecord: (data: Partial<ImpactRecord>) => Promise<ImpactRecord>;
  updateImpactRecord: (id: string, data: Partial<ImpactRecord>) => Promise<ImpactRecord>;
  submitImpactReport: (id: string, data: { currentValue: number; evidence?: string; notes?: string; reportedBy?: string; reportingPeriod?: string }) => Promise<ImpactRecord>;
  verifyImpactReport: (id: string, data: { verifiedBy?: string; verificationNotes?: string }) => Promise<ImpactRecord>;
  rejectImpactReport: (id: string, data: { verifiedBy?: string; reason?: string }) => Promise<ImpactRecord>;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  deleteChallenge: (id: string) => Promise<void>;
  registerStartup: (startupData: Partial<Startup> & { name: string; domain: string; techStack: string[] }) => Promise<string>;
  shortlistStartup: (challengeId: string, startupId: string) => Promise<void>;

  resetDemoData: () => void;
}


const PragatiContext = createContext<PragatiContextType | undefined>(
  undefined
);

const STORAGE_KEY_PREFIX = 'pragati_ai_';


export const PragatiProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {

  /* =========================================================
     ROLE
  ========================================================= */

  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => {
    return (
      (localStorage.getItem(
        `${STORAGE_KEY_PREFIX}role`
      ) as UserRole) || 'government'
    );
  });


  /* =========================================================
     CHALLENGES
     Backend is now the source of truth.
  ========================================================= */

  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}challenges`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_CHALLENGES;
  });

  /* Sync challenges to local storage */
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}challenges`, JSON.stringify(challenges));
    } catch (e) {}
  }, [challenges]);

  /* Load challenges from backend when available */
  useEffect(() => {
    const loadChallenges = async () => {
      try {
        const data = await api.getChallenges();
        if (Array.isArray(data) && data.length > 0) {
          setChallenges(data);
        }
      } catch (error) {
        console.warn(
          'Could not fetch remote challenges, using local challenges:',
          error
        );
      }
    };

    loadChallenges();
  }, []);


  /* =========================================================
     STARTUPS
  ========================================================= */
  const [startups, setStartups] = useState<Startup[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}startups`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return MOCK_STARTUPS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}startups`, JSON.stringify(startups));
    } catch (e) {}
  }, [startups]);

  /* =========================================================
     APPLICATIONS
  ========================================================= */
  const [applications, setApplications] = useState<Application[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}applications`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_APPLICATIONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}applications`, JSON.stringify(applications));
    } catch (e) {}
  }, [applications]);

  /* =========================================================
     EVALUATIONS
  ========================================================= */
  const [evaluations, setEvaluations] = useState<ExpertEvaluation[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}evaluations`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_EVALUATIONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}evaluations`, JSON.stringify(evaluations));
    } catch (e) {}
  }, [evaluations]);

  /* =========================================================
     PILOTS
  ========================================================= */
  const [pilots, setPilots] = useState<PilotProject[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}pilots`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_PILOTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}pilots`, JSON.stringify(pilots));
    } catch (e) {}
  }, [pilots]);

  /* =========================================================
     PROCUREMENT
  ========================================================= */
  const [procurementContracts, setProcurementContracts] = useState<ProcurementContract[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}procurementContracts`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_PROCUREMENT;
  });

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}procurementContracts`, JSON.stringify(procurementContracts));
    } catch (e) {}
  }, [procurementContracts]);

  /* =========================================================
     SCALE-UP
  ========================================================= */
  const [scaleUpPlan, setScaleUpPlan] = useState<ScaleUpPlan>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}scaleUpPlan`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {}
    return INITIAL_SCALE_UP;
  });

  const [scaleUpPlans, setScaleUpPlans] = useState<ScaleUpPlan[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}scaleUpPlans`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [INITIAL_SCALE_UP];
  });

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}scaleUpPlan`, JSON.stringify(scaleUpPlan));
    } catch (e) {}
  }, [scaleUpPlan]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}scaleUpPlans`, JSON.stringify(scaleUpPlans));
    } catch (e) {}
  }, [scaleUpPlans]);

  /* =========================================================
     IMPACT RECORDS
  ========================================================= */
  const [impactRecords, setImpactRecords] = useState<ImpactRecord[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}impactRecords`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_IMPACT_RECORDS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}impactRecords`, JSON.stringify(impactRecords));
    } catch (e) {}
  }, [impactRecords]);

  /* =========================================================
     AUDIT LOGS
  ========================================================= */
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}auditLogs`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_AUDIT_LOGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}auditLogs`, JSON.stringify(auditLogs));
    } catch (e) {}
  }, [auditLogs]);

  /* =========================================================
     NOTIFICATIONS
  ========================================================= */
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}notifications`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}notifications`, JSON.stringify(notifications));
    } catch (e) {}
  }, [notifications]);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  /* =========================================================
     REAL-TIME MULTI-DEVICE DATA SYNCHRONIZATION
     Fetches all entities from backend on mount, window focus,
     and periodic 30-second background polling
  ========================================================= */
  const syncAllData = async () => {
    try {
      const [remoteCh, remoteSt, remoteApps, remoteEvals, remotePilots, remoteProc, remoteScale, remoteImpact, remoteLogs, remoteNotifs] =
        await Promise.allSettled([
          api.getChallenges(),
          api.getStartups(),
          api.getApplications(),
          api.getEvaluations(),
          api.getPilots(),
          api.getProcurement(),
          api.getScaleUp(),
          api.getImpactRecords(),
          api.getAuditLogs(),
          api.getNotifications()
        ]);

      if (remoteCh.status === 'fulfilled' && Array.isArray(remoteCh.value) && remoteCh.value.length > 0) {
        setChallenges(remoteCh.value);
      }
      if (remoteSt.status === 'fulfilled' && Array.isArray(remoteSt.value) && remoteSt.value.length > 0) {
        setStartups(remoteSt.value);
      }
      if (remoteApps.status === 'fulfilled' && Array.isArray(remoteApps.value) && remoteApps.value.length > 0) {
        setApplications(remoteApps.value);
      }
      if (remoteEvals.status === 'fulfilled' && Array.isArray(remoteEvals.value) && remoteEvals.value.length > 0) {
        setEvaluations(remoteEvals.value);
      }
      if (remotePilots.status === 'fulfilled' && Array.isArray(remotePilots.value) && remotePilots.value.length > 0) {
        setPilots(remotePilots.value);
      }
      if (remoteProc.status === 'fulfilled' && Array.isArray(remoteProc.value) && remoteProc.value.length > 0) {
        setProcurementContracts(remoteProc.value);
      }
      if (remoteScale.status === 'fulfilled' && remoteScale.value) {
        if (Array.isArray(remoteScale.value)) {
          setScaleUpPlans(remoteScale.value);
          if (remoteScale.value.length > 0) setScaleUpPlan(remoteScale.value[0]);
        } else {
          setScaleUpPlan(remoteScale.value);
          setScaleUpPlans(prev => [remoteScale.value, ...prev.filter(p => p.id !== remoteScale.value.id)]);
        }
      }
      if (remoteLogs.status === 'fulfilled' && Array.isArray(remoteLogs.value) && remoteLogs.value.length > 0) {
        setAuditLogs(remoteLogs.value);
      }
      if (remoteImpact.status === 'fulfilled' && Array.isArray(remoteImpact.value) && remoteImpact.value.length > 0) {
        setImpactRecords(remoteImpact.value);
      }
      if (remoteNotifs.status === 'fulfilled' && Array.isArray(remoteNotifs.value) && remoteNotifs.value.length > 0) {
        setNotifications(remoteNotifs.value);
      }
    } catch (err) {
      console.warn('Real-time sync check fallback to local:', err);
    }
  };

  useEffect(() => {
    syncAllData();

    const handleFocus = () => {
      syncAllData();
    };

    window.addEventListener('focus', handleFocus);
    const interval = setInterval(syncAllData, 30000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);


  /* =========================================================
     LOCAL STORAGE SYNC
     Challenges are intentionally NOT stored here.
  ========================================================= */

  useEffect(() => {
    localStorage.setItem(
      `${STORAGE_KEY_PREFIX}role`,
      currentRole
    );
  }, [currentRole]);



  /* =========================================================
     TOASTS
  ========================================================= */

  const addToast = (
    type: 'success' | 'info' | 'warning' | 'error',
    title: string,
    message: string
  ) => {
    const id = Math.random()
      .toString(36)
      .substring(2, 9);

    setToasts(prev => [
      ...prev,
      {
        id,
        type,
        title,
        message
      }
    ]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };


  const removeToast = (id: string) => {
    setToasts(prev =>
      prev.filter(t => t.id !== id)
    );
  };


  /* =========================================================
     AUDIT LOG
  ========================================================= */

  const addAuditLog = async (
  action: string,
  details: string,
  userRole: string = currentRole,
  userName = 'Authorized User',
  status: 'Completed' | 'Verified' = 'Completed'
): Promise<void> => {
  try {
    const newEntry = await api.addAuditLog(
      action,
      details,
      userRole,
      userName
    );

    setAuditLogs(prev => [
      newEntry,
      ...prev
    ]);
  } catch (error) {
    console.error(
      'Failed to add audit log:',
      error
    );
  }
};


  /* =========================================================
     NOTIFICATIONS
  ========================================================= */

  const addNotification = async (
  title: string,
  message: string,
  type: AppNotification['type']
): Promise<void> => {
  try {
    const newNotif = await api.addNotification(
      title,
      message,
      type
    );

    setNotifications(prev => [
      newNotif,
      ...prev
    ]);
  } catch (error) {
    console.error(
      'Failed to add notification:',
      error
    );
  }
};

  /* =========================================================
     ROLE SWITCH
  ========================================================= */

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}role`, role);
    } catch (e) {
      console.warn('Could not persist role to localStorage:', e);
    }

    addToast(
      'info',
      'Active Portal Switched',
      `You are now viewing as ${role.toUpperCase()}`
    );
  };


  /* =========================================================
     CREATE CHALLENGE
     Backend connected
  ========================================================= */

  const createChallenge = async (
    challengeData: Omit<
      Challenge,
      'id' | 'createdAt' | 'status' | 'applicationsCount'
    > & { status?: string; allowDuplicate?: boolean }
  ): Promise<string> => {
    try {
      const newChallenge = await api.createChallenge(challengeData);

      setChallenges(prev => {
        const filtered = prev.filter(c => c && c.id !== newChallenge.id);
        return [newChallenge, ...filtered];
      });

      // Synchronize context state with backend DB
      try {
        const latestChallenges = await api.getChallenges();
        if (Array.isArray(latestChallenges) && latestChallenges.length > 0) {
          setChallenges(latestChallenges);
        }
      } catch (syncErr) {
        console.warn('Background sync after challenge creation:', syncErr);
      }

      addAuditLog(
        'Challenge Created & Published',
        `Published challenge: ${newChallenge.title} (ID: ${newChallenge.id})`,
        'Government Officer',
        'Officer In-Charge'
      );

      addNotification(
        'New Challenge Published',
        `${newChallenge.title} is now open for startup submissions.`,
        'challenge'
      );

      addToast(
        'success',
        'Challenge Published',
        `Challenge ${newChallenge.id} registered and saved to database.`
      );

      return newChallenge.id;
    } catch (error: any) {
      console.warn('Backend API unavailable, saving challenge locally in session:', error);
      
      const newId = `CH-${Date.now().toString().slice(-4)}`;
      const fallbackChallenge: Challenge = {
        id: newId,
        createdAt: new Date().toISOString().split('T')[0],
        status: (challengeData.status as any) || 'Published',
        applicationsCount: 0,
        ...challengeData
      } as Challenge;

      setChallenges(prev => [fallbackChallenge, ...prev]);

      addAuditLog(
        'Challenge Created & Published',
        `Published challenge: ${fallbackChallenge.title} (ID: ${fallbackChallenge.id})`,
        'Government Officer',
        'Officer In-Charge'
      );

      addNotification(
        'New Challenge Published',
        `${fallbackChallenge.title} is now open for startup submissions.`,
        'challenge'
      );

      addToast(
        'success',
        'Challenge Published',
        `Challenge ${fallbackChallenge.id} registered and saved to session.`
      );

      return fallbackChallenge.id;
    }
  };


  /* =========================================================
     PUBLISH CHALLENGE
     Backend connected
  ========================================================= */

  const publishChallenge = async (
    id: string
  ): Promise<void> => {

    try {

      const updatedChallenge =
        await api.updateChallengeStatus(
          id,
          'Published'
        );

      setChallenges(prev =>
        prev.map(c =>
          c.id === id
            ? updatedChallenge
            : c
        )
      );

      addAuditLog(
        'Challenge Status Updated',
        `Challenge status set to Published for ${updatedChallenge.title}`
      );

      addToast(
        'success',
        'Challenge Published',
        `${updatedChallenge.title} is now open for startup discovery.`
      );

    } catch (error) {

      console.warn(
        'Backend API unavailable, publishing challenge locally:',
        error
      );

      setChallenges(prev =>
        prev.map(c =>
          c.id === id
            ? { ...c, status: 'Published' }
            : c
        )
      );

      addAuditLog(
        'Challenge Status Updated',
        `Challenge status set to Published for challenge ${id}`
      );

      addToast(
        'success',
        'Challenge Published',
        'Challenge status set to Published for startup discovery.'
      );
    }
  };


  /* =========================================================
     APPLY FOR CHALLENGE
     Still local/demo for now.
  ========================================================= */

  const applyForChallenge = async (
  appData: Omit<Application, 'id' | 'submissionDate' | 'status'>
): Promise<string> => {
  try {
    const newApp = await api.submitApplication(appData);

    setApplications(prev => [
      newApp,
      ...prev
    ]);

    const newEvalItem: ExpertEvaluation = {
      id: `eval-${newApp.id}`,
      applicationId: newApp.id,
      challengeId: newApp.challengeId,
      challengeTitle: newApp.challengeTitle,
      startupId: newApp.startupId,
      startupName: newApp.startupName,
      evaluatorName: 'Dr. Arvind Swaminathan',
      evaluatorSpecialization: 'IIT Madras AI & Infrastructure Panel',
      date: newApp.submissionDate || new Date().toISOString().split('T')[0],
      scores: {
        technicalCapability: 0,
        innovation: 0,
        scalability: 0,
        costEffectiveness: 0,
        impact: 0
      },
      totalScore: 0,
      recommendation: 'Under Review' as any,
      remarks: 'Awaiting expert technical panel review and rubric scoring.',
      isSubmitted: false
    };
    setEvaluations(prev => [newEvalItem, ...prev.filter(e => e.id !== newEvalItem.id)]);

    setChallenges(prev =>
      prev.map(c =>
        c.id === appData.challengeId
          ? {
              ...c,
              applicationsCount:
                c.applicationsCount + 1
            }
          : c
      )
    );

    addAuditLog(
      'Application Submitted',
      `${appData.startupName} submitted application for ${appData.challengeTitle}`,
      'Startup',
      appData.startupName
    );

    addNotification(
      'New Application Submitted',
      `${appData.startupName} submitted a proposal for ${appData.challengeTitle}`,
      'application'
    );

    addToast(
      'success',
      'Application Submitted',
      'Your proposal was received and forwarded for automated eligibility screening.'
    );

    return newApp.id;
  } catch (error) {
    console.warn('Backend API unavailable, submitting application locally:', error);

    const fallbackApp: Application = {
      id: `APP-${Date.now().toString().slice(-4)}`,
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'Under Review',
      ...appData
    };

    setApplications(prev => [fallbackApp, ...prev]);

    const fallbackEvalItem: ExpertEvaluation = {
      id: `eval-${fallbackApp.id}`,
      applicationId: fallbackApp.id,
      challengeId: fallbackApp.challengeId,
      challengeTitle: fallbackApp.challengeTitle,
      startupId: fallbackApp.startupId,
      startupName: fallbackApp.startupName,
      evaluatorName: 'Dr. Arvind Swaminathan',
      evaluatorSpecialization: 'IIT Madras AI & Infrastructure Panel',
      date: fallbackApp.submissionDate || new Date().toISOString().split('T')[0],
      scores: {
        technicalCapability: 0,
        innovation: 0,
        scalability: 0,
        costEffectiveness: 0,
        impact: 0
      },
      totalScore: 0,
      recommendation: 'Under Review' as any,
      remarks: 'Awaiting expert technical panel review and rubric scoring.',
      isSubmitted: false
    };
    setEvaluations(prev => [fallbackEvalItem, ...prev.filter(e => e.id !== fallbackEvalItem.id)]);

    setChallenges(prev =>
      prev.map(c =>
        c.id === appData.challengeId
          ? {
              ...c,
              applicationsCount: c.applicationsCount + 1
            }
          : c
      )
    );

    addAuditLog(
      'Application Submitted',
      `${appData.startupName} submitted application for ${appData.challengeTitle}`,
      'Startup',
      appData.startupName
    );

    addNotification(
      'New Application Submitted',
      `${appData.startupName} submitted a proposal for ${appData.challengeTitle}`,
      'application'
    );

    addToast(
      'success',
      'Application Submitted',
      'Your proposal was received and forwarded for automated eligibility screening.'
    );

    return fallbackApp.id;
  }
};


  /* =========================================================
     EXPERT EVALUATION
  ========================================================= */

  const submitEvaluation = async (
  evaluationId: string,
  scores: ExpertEvaluation['scores'],
  recommendation: ExpertEvaluation['recommendation'],
  remarks: string
): Promise<void> => {
  try {
    const updatedEvaluation = await api.submitEvaluation(
      evaluationId,
      scores,
      recommendation,
      remarks
    );

    setEvaluations(prev =>
      prev.map(ev =>
        ev.id === evaluationId
          ? updatedEvaluation
          : ev
      )
    );

    const evalItem = evaluations.find(
      e => e.id === evaluationId
    );

    if (evalItem) {
      const total = updatedEvaluation.totalScore;

      setApplications(prev =>
        prev.map(a =>
          a.id === evalItem.applicationId
            ? {
                ...a,
                expertScore: total,
                expertRecommendation: recommendation,
                status:
                  recommendation === 'Shortlist for Pilot'
                    ? 'Shortlisted'
                    : 'Under Review'
              }
            : a
        )
      );

      addAuditLog(
        'Expert Evaluation Completed',
        `Scored ${total}/100 with recommendation "${recommendation}" for ${evalItem.startupName}`,
        'Expert Evaluator',
        evalItem.evaluatorName,
        'Verified'
      );

      addNotification(
        'Evaluation Completed',
        `Evaluation submitted for ${evalItem.startupName} (${total}/100)`,
        'evaluation'
      );

      addToast(
        'success',
        'Evaluation Submitted',
        `Score ${total}/100 recorded. Official recommendation logged.`
      );
    }
  } catch (error) {
    console.warn('Backend API unavailable, submitting evaluation locally:', error);

    const evalItem = evaluations.find(e => e.id === evaluationId);
    const total = Object.values(scores).reduce((a, b) => a + (Number(b) || 0), 0);

    const fallbackEval: ExpertEvaluation = {
      id: evaluationId,
      applicationId: evalItem?.applicationId || '',
      challengeId: evalItem?.challengeId || '',
      startupId: evalItem?.startupId || '',
      startupName: evalItem?.startupName || '',
      challengeTitle: evalItem?.challengeTitle || '',
      evaluatorName: evalItem?.evaluatorName || 'Expert Evaluator',
      evaluatorSpecialization: evalItem?.evaluatorSpecialization || 'Evaluation Committee',
      date: new Date().toISOString().split('T')[0],
      scores,
      totalScore: total,
      recommendation,
      remarks,
      isSubmitted: true
    };

    setEvaluations(prev =>
      prev.map(ev => (ev.id === evaluationId ? fallbackEval : ev))
    );

    if (evalItem) {
      setApplications(prev =>
        prev.map(a =>
          a.id === evalItem.applicationId
            ? {
                ...a,
                expertScore: total,
                expertRecommendation: recommendation,
                status:
                  recommendation === 'Shortlist for Pilot'
                    ? 'Shortlisted'
                    : 'Under Review'
              }
            : a
        )
      );

      addAuditLog(
        'Expert Evaluation Completed',
        `Scored ${total}/100 with recommendation "${recommendation}" for ${evalItem.startupName}`,
        'Expert Evaluator',
        evalItem.evaluatorName,
        'Verified'
      );

      addNotification(
        'Evaluation Completed',
        `Evaluation submitted for ${evalItem.startupName} (${total}/100)`,
        'evaluation'
      );

      addToast(
        'success',
        'Evaluation Submitted',
        `Score ${total}/100 recorded. Official recommendation logged.`
      );
    }
  }
};

  /* =========================================================
     START PILOT
  ========================================================= */

  const startPilot = async (
  applicationId: string
): Promise<void> => {
  const app = applications.find(
    a => a.id === applicationId
  );

  if (!app) return;

  try {
    const newPilot = await api.startPilot(applicationId);

    setPilots(prev => [
      newPilot,
      ...prev.filter(p => p.id !== newPilot.id)
    ]);

    setApplications(prev =>
      prev.map(a =>
        a.id === applicationId
          ? {
              ...a,
              status: 'Pilot'
            }
          : a
      )
    );

    setChallenges(prev =>
      prev.map(c =>
        c.id === app.challengeId
          ? {
              ...c,
              status: 'Pilot Active'
            }
          : c
      )
    );

    addAuditLog(
      'Pilot Commenced',
      `90-day pilot project sanctioned for ${app.startupName} under ${app.challengeTitle}`
    );

    addNotification(
      'Pilot Commenced',
      `Pilot project sanctioned for ${app.startupName}.`,
      'pilot'
    );

    addToast(
      'success',
      'Pilot Initiated',
      `Controlled pilot project created for ${app.startupName}.`
    );
  } catch (error) {
    console.warn('Backend API unavailable, initiating pilot locally:', error);

    const fallbackPilot: PilotProject = {
      id: `PLT-${Date.now().toString().slice(-4)}`,
      challengeId: app.challengeId,
      challengeTitle: app.challengeTitle,
      startupId: app.startupId,
      startupName: app.startupName,
      department: app.department || 'Urban Infrastructure',
      pilotDuration: '90 Days',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Planning',
      progressPercent: 0,
      validationScore: 0,
      kpis: [
        { name: 'Detection Accuracy', target: '95%', actual: '92%', unit: '%', status: 'Met', targetNum: 95, actualNum: 92 },
        { name: 'Inference Latency', target: '<200ms', actual: '180ms', unit: 'ms', status: 'Met', targetNum: 200, actualNum: 180 },
        { name: 'System Uptime', target: '99.5%', actual: '99.9%', unit: '%', status: 'Exceeded', targetNum: 99.5, actualNum: 99.9 }
      ],
      milestones: [
        { id: 'm1', title: 'Environment Setup & Live Integration', date: 'Month 1', status: 'Completed', deliverables: 'Edge sensors connected' },
        { id: 'm2', title: 'Field Testing & Data Ingestion', date: 'Month 2', status: 'In Progress', deliverables: 'Telemetry ingestion active' },
        { id: 'm3', title: 'Validation Report & Sign-off', date: 'Month 3', status: 'Upcoming', deliverables: 'Department validation signoff' }
      ]
    };

    setPilots(prev => [fallbackPilot, ...prev.filter(p => p.id !== fallbackPilot.id)]);

    setApplications(prev =>
      prev.map(a => (a.id === applicationId ? { ...a, status: 'Pilot' } : a))
    );

    setChallenges(prev =>
      prev.map(c => (c.id === app.challengeId ? { ...c, status: 'Pilot Active' } : c))
    );

    addAuditLog(
      'Pilot Commenced',
      `90-day pilot project sanctioned for ${app.startupName} under ${app.challengeTitle}`
    );

    addNotification(
      'Pilot Commenced',
      `Pilot project sanctioned for ${app.startupName}.`,
      'pilot'
    );

    addToast(
      'success',
      'Pilot Initiated',
      `Controlled pilot project created for ${app.startupName}.`
    );
  }
};

  /* =========================================================
     PILOT PROJECT MANAGEMENT & LIFECYCLE
  ========================================================= */

  const createPilotProject = async (
    pilotData: Partial<PilotProject>
  ): Promise<PilotProject> => {
    try {
      const newPilot = await api.createPilot(pilotData);
      setPilots(prev => [newPilot, ...prev.filter(p => p.id !== newPilot.id)]);

      if (pilotData.startupId && pilotData.challengeId) {
        setApplications(prev =>
          prev.map(a =>
            (a.startupId === pilotData.startupId || a.startupName === pilotData.startupName) &&
            (a.challengeId === pilotData.challengeId || a.challengeTitle === pilotData.challengeTitle)
              ? { ...a, status: 'Pilot' }
              : a
          )
        );
        setChallenges(prev =>
          prev.map(c =>
            c.id === pilotData.challengeId || c.title === pilotData.challengeTitle
              ? { ...c, status: 'Pilot Active' }
              : c
          )
        );
      }

      addAuditLog(
        'Pilot Created',
        `Pilot project created for ${newPilot.startupName} under ${newPilot.challengeTitle}. Duration: ${newPilot.pilotDuration}`,
        'Government Officer',
        newPilot.governmentOfficer || 'Er. Rajeshwar Rao, Chief Engineer, PWD'
      );

      addNotification(
        'Pilot Project Created',
        `Controlled pilot project sanctioned for ${newPilot.startupName}.`,
        'pilot'
      );

      addToast(
        'success',
        'Pilot Created',
        `Pilot project "${newPilot.title || newPilot.challengeTitle}" created successfully.`
      );

      return newPilot;
    } catch (err) {
      console.warn('Backend API unavailable, creating pilot locally:', err);
      const fallbackPilot: PilotProject = {
        id: `pilot-${Date.now().toString(36)}`,
        title: pilotData.title || `${pilotData.startupName} Field Pilot`,
        challengeId: pilotData.challengeId || 'ch-custom',
        challengeTitle: pilotData.challengeTitle || 'Innovation Challenge',
        startupId: pilotData.startupId || `startup-${Date.now().toString(36)}`,
        startupName: pilotData.startupName || 'Innovative Startup',
        department: pilotData.department || 'Public Works Department',
        pilotLocation: pilotData.pilotLocation || 'Bengaluru Urban Corridor',
        objective: pilotData.objective || 'Operational capability and contract KPI verification',
        pilotDuration: pilotData.pilotDuration || '90 Days',
        startDate: pilotData.startDate || new Date().toISOString().split('T')[0],
        endDate: pilotData.endDate || new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
        governmentOfficer: pilotData.governmentOfficer || 'Er. Rajeshwar Rao, Chief Engineer, PWD',
        expectedOutcomes: pilotData.expectedOutcomes || 'Verified performance benchmarks',
        budget: pilotData.budget || '₹35,00,000',
        notes: pilotData.notes || '',
        status: pilotData.status || 'Planning',
        progressPercent: pilotData.status === 'Active' ? 10 : 0,
        validationStatus: 'Pending',
        milestones: [
          { id: 'm1', title: 'Pilot Agreement & Legal Clearance', date: 'Day 1', status: 'Completed', deliverables: 'Tripartite legal agreement signed' },
          { id: 'm2', title: 'Sensor Deployment & Site Preparation', date: 'Day 15', status: 'In Progress', deliverables: 'Field hardware ready' },
          { id: 'm3', title: 'Data Ingestion & Baseline Calibration', date: 'Day 35', status: 'Upcoming', deliverables: 'Baseline metric datasets established' },
          { id: 'm4', title: 'Operational Stress Testing', date: 'Day 60', status: 'Upcoming', deliverables: 'Full-load performance verification' },
          { id: 'm5', title: 'Independent KPI Auditing', date: 'Day 75', status: 'Upcoming', deliverables: 'Third-party engineer sign-off' },
          { id: 'm6', title: 'Outcome Report & Validation Gateway', date: 'Day 90', status: 'Upcoming', deliverables: 'Final outcome validation dossier' }
        ],
        kpis: Array.isArray(pilotData.kpis) && pilotData.kpis.length > 0 ? pilotData.kpis : [
          { name: 'Detection Accuracy', description: 'Accuracy in field operations', baseline: '80%', baselineNum: 80, target: '≥ 90%', actual: '0%', unit: '%', status: 'On Track', targetNum: 90, actualNum: 0, isUserEntered: false },
          { name: 'Inference Latency', description: 'Max edge computation response time', baseline: '500ms', baselineNum: 500, target: '≤ 200ms', actual: '0ms', unit: 'ms', status: 'On Track', targetNum: 200, actualNum: 0, isUserEntered: false },
          { name: 'System Uptime', description: 'Continuous uninterrupted operation', baseline: '95%', baselineNum: 95, target: '≥ 99%', actual: '0%', unit: '%', status: 'On Track', targetNum: 99, actualNum: 0, isUserEntered: false },
          { name: 'Road Coverage', description: 'Corridor coverage percentage', baseline: '50%', baselineNum: 50, target: '≥ 80%', actual: '0%', unit: '%', status: 'On Track', targetNum: 80, actualNum: 0, isUserEntered: false }
        ]
      };

      setPilots(prev => [fallbackPilot, ...prev.filter(p => p.id !== fallbackPilot.id)]);

      if (pilotData.startupId && pilotData.challengeId) {
        setApplications(prev =>
          prev.map(a =>
            (a.startupId === pilotData.startupId || a.startupName === pilotData.startupName) &&
            (a.challengeId === pilotData.challengeId || a.challengeTitle === pilotData.challengeTitle)
              ? { ...a, status: 'Pilot' }
              : a
          )
        );
        setChallenges(prev =>
          prev.map(c =>
            c.id === pilotData.challengeId || c.title === pilotData.challengeTitle
              ? { ...c, status: 'Pilot Active' }
              : c
          )
        );
      }

      addAuditLog(
        'Pilot Created',
        `Pilot project created for ${fallbackPilot.startupName} under ${fallbackPilot.challengeTitle}. Duration: ${fallbackPilot.pilotDuration}`,
        'Government Officer',
        fallbackPilot.governmentOfficer
      );

      addNotification(
        'Pilot Project Created',
        `Controlled pilot project sanctioned for ${fallbackPilot.startupName}.`,
        'pilot'
      );

      addToast(
        'success',
        'Pilot Created',
        `Pilot project "${fallbackPilot.title || fallbackPilot.challengeTitle}" created.`
      );

      return fallbackPilot;
    }
  };

  const updatePilotStatus = async (
    pilotId: string,
    status: PilotLifecycleStatus,
    notes?: string,
    authorizedOfficial?: string
  ): Promise<void> => {
    try {
      const updatedPilot = await api.updatePilotStatus(pilotId, status, notes, authorizedOfficial);
      setPilots(prev => prev.map(p => p.id === pilotId ? updatedPilot : p));

      let auditAction = 'Pilot Status Updated';
      if (status === 'Approved') auditAction = 'Pilot Approved';
      else if (status === 'Active') auditAction = 'Pilot Activated';
      else if (status === 'Under Evaluation' || status === 'Completed') auditAction = 'Pilot Completed';

      addAuditLog(
        auditAction,
        `Pilot status transitioned to "${status}" for ${updatedPilot.startupName}.`,
        'Government Officer',
        authorizedOfficial || updatedPilot.authorizedOfficial || 'Er. Rajeshwar Rao, Chief Engineer, PWD'
      );

      addNotification(
        `Pilot ${status}`,
        `Pilot project for ${updatedPilot.startupName} is now ${status}.`,
        'pilot'
      );

      addToast(
        'success',
        'Pilot Status Updated',
        `Pilot lifecycle status changed to ${status}.`
      );
    } catch (err) {
      console.warn('Backend API unavailable, updating pilot status locally:', err);
      setPilots(prev => prev.map(p => {
        if (p.id === pilotId) {
          const newProgress = status === 'Active' && p.progressPercent < 25 ? 25 : (status === 'Under Evaluation' || status === 'Completed' ? 100 : p.progressPercent);
          return {
            ...p,
            status,
            progressPercent: newProgress,
            notes: notes || p.notes,
            validationStatus: status === 'Under Evaluation' ? 'Under Review' : p.validationStatus,
            authorizedOfficial: authorizedOfficial || p.authorizedOfficial
          };
        }
        return p;
      }));

      const p = pilots.find(x => x.id === pilotId);
      const startupName = p?.startupName || 'Startup';
      let auditAction = 'Pilot Status Updated';
      if (status === 'Approved') auditAction = 'Pilot Approved';
      else if (status === 'Active') auditAction = 'Pilot Activated';
      else if (status === 'Under Evaluation' || status === 'Completed') auditAction = 'Pilot Completed';

      addAuditLog(
        auditAction,
        `Pilot status transitioned to "${status}" for ${startupName}.`,
        'Government Officer',
        authorizedOfficial || 'Er. Rajeshwar Rao, Chief Engineer, PWD'
      );

      addNotification(
        `Pilot ${status}`,
        `Pilot project for ${startupName} is now ${status}.`,
        'pilot'
      );

      addToast(
        'success',
        'Pilot Status Updated',
        `Pilot lifecycle status changed to ${status}.`
      );
    }
  };

  const recordKPIMeasurement = async (
    pilotId: string,
    kpi: Partial<PilotKPI>
  ): Promise<void> => {
    try {
      const updatedPilot = await api.recordKPIMeasurement(pilotId, kpi);
      setPilots(prev => prev.map(p => p.id === pilotId ? updatedPilot : p));

      addAuditLog(
        'KPI Recorded',
        `Recorded KPI measurement "${kpi.name}" (Actual: ${kpi.actual}, Target: ${kpi.target}) for ${updatedPilot.startupName}`,
        'Government Officer',
        updatedPilot.authorizedOfficial || 'Er. Rajeshwar Rao, Chief Engineer, PWD'
      );

      addNotification(
        'KPI Telemetry Recorded',
        `New metric recorded for ${updatedPilot.startupName}: ${kpi.name} = ${kpi.actual}`,
        'pilot'
      );

      addToast(
        'success',
        'KPI Recorded',
        `KPI "${kpi.name}" recorded at ${kpi.actual} (${kpi.status}).`
      );
    } catch (err) {
      console.warn('Backend API unavailable, recording KPI locally:', err);
      const parsedTargetNum = typeof kpi.targetNum === 'number' ? kpi.targetNum : (parseFloat(String(kpi.target).replace(/[^0-9.]/g, '')) || 0);
      const parsedActualNum = typeof kpi.actualNum === 'number' ? kpi.actualNum : (parseFloat(String(kpi.actual).replace(/[^0-9.]/g, '')) || 0);
      const parsedBaselineNum = typeof kpi.baselineNum === 'number' ? kpi.baselineNum : (kpi.baseline ? (parseFloat(String(kpi.baseline).replace(/[^0-9.]/g, '')) || 0) : undefined);

      const kpiEntry: PilotKPI = {
        name: kpi.name || 'Custom KPI',
        description: kpi.description || '',
        baseline: kpi.baseline || '',
        baselineNum: parsedBaselineNum,
        target: kpi.target || '100%',
        actual: kpi.actual || '0%',
        unit: kpi.unit || '',
        status: (kpi.status as any) || 'On Track',
        targetNum: parsedTargetNum,
        actualNum: parsedActualNum,
        measurementDate: kpi.measurementDate || new Date().toISOString().split('T')[0],
        evidenceNotes: kpi.evidenceNotes || '',
        isUserEntered: true
      };

      setPilots(prev => prev.map(p => {
        if (p.id === pilotId) {
          const currentKpis = p.kpis || [];
          const idx = currentKpis.findIndex(k => k.name.trim().toLowerCase() === kpiEntry.name.trim().toLowerCase());
          let nextKpis: PilotKPI[];
          if (idx >= 0) {
            nextKpis = [...currentKpis];
            nextKpis[idx] = kpiEntry;
          } else {
            nextKpis = [...currentKpis, kpiEntry];
          }
          return {
            ...p,
            kpis: nextKpis
          };
        }
        return p;
      }));

      const p = pilots.find(x => x.id === pilotId);
      const sName = p?.startupName || 'Startup';
      addAuditLog(
        'KPI Recorded',
        `Recorded KPI measurement "${kpiEntry.name}" (Actual: ${kpiEntry.actual}, Target: ${kpiEntry.target}) for ${sName}`,
        'Government Officer',
        'Er. Rajeshwar Rao, Chief Engineer, PWD'
      );

      addNotification(
        'KPI Telemetry Recorded',
        `New metric recorded for ${sName}: ${kpiEntry.name} = ${kpiEntry.actual}`,
        'pilot'
      );

      addToast(
        'success',
        'KPI Recorded',
        `KPI "${kpiEntry.name}" recorded at ${kpiEntry.actual} (${kpiEntry.status}).`
      );
    }
  };

  /* =========================================================
     VALIDATION DECISION
  ========================================================= */

 const updateValidationDecision = async (
  pilotId: string,
  decision: PilotValidationDecision,
  remarks: string,
  extra?: {
    officialObservations?: string;
    evidenceNotes?: string;
    validationStatus?: PilotValidationStatus;
    authorizedOfficial?: string;
    validationScore?: number;
  }
): Promise<void> => {
  try {
    const updatedPilot = await api.recordValidationDecision(
      pilotId,
      decision,
      remarks,
      extra
    );

    setPilots(prev =>
      prev.map(p => p.id === pilotId ? updatedPilot : p)
    );

    const pilot = pilots.find(p => p.id === pilotId);

    if (pilot) {
      if (decision === 'Scale') {
        setChallenges(prev =>
          prev.map(c =>
            c.id === pilot.challengeId ? { ...c, status: 'Scaled' } : c
          )
        );

        setApplications(prev =>
          prev.map(a =>
            a.startupId === pilot.startupId && a.challengeId === pilot.challengeId
              ? { ...a, status: 'Validated' }
              : a
          )
        );
      }

      addAuditLog(
        'Outcome Validation Submitted',
        `Outcome validation report finalized for ${pilot.startupName} under ${pilot.challengeTitle}.`,
        'Government Officer',
        extra?.authorizedOfficial || 'Er. Rajeshwar Rao, Chief Engineer, PWD'
      );

      addAuditLog(
        'Validation Decision Recorded',
        `Decision "${decision.toUpperCase()}" authorized for ${pilot.startupName}. Remarks: ${remarks}`,
        'Government Officer',
        extra?.authorizedOfficial || 'Er. Rajeshwar Rao, Chief Engineer, PWD'
      );

      addNotification(
        'Pilot Validation Decision',
        `Authorized decision: ${decision.toUpperCase()} for ${pilot.startupName}`,
        'validation'
      );

      addToast(
        decision === 'Scale' ? 'success' : 'info',
        `Validation Decision: ${decision}`,
        `Authorized human decision recorded for ${pilot.startupName}.`
      );
    }
  } catch (error) {
    console.warn(
      'Backend API unavailable, recording validation decision locally:',
      error
    );

    const pilot = pilots.find(p => p.id === pilotId);
    if (pilot) {
      const nextStatus = decision === 'Scale' ? ('Scale Approved' as const) : decision === 'Close' || decision === 'Stop' ? ('Completed' as const) : decision === 'Re-pilot' || decision === 'Continue Pilot' ? ('Active' as const) : ('Validated' as const);

      setPilots(prev =>
        prev.map(p =>
          p.id === pilotId
            ? { 
                ...p, 
                validationDecision: decision, 
                validationRemarks: remarks, 
                officialObservations: extra?.officialObservations || remarks,
                evidenceNotes: extra?.evidenceNotes || p.evidenceNotes,
                validationStatus: extra?.validationStatus || 'Validated',
                validationScore: typeof extra?.validationScore === 'number' ? extra.validationScore : p.validationScore,
                decisionDate: new Date().toISOString().split('T')[0],
                status: nextStatus,
                authorizedOfficial: extra?.authorizedOfficial || p.authorizedOfficial || 'Er. Rajeshwar Rao, Chief Engineer, PWD'
              }
            : p
        )
      );

      if (decision === 'Scale') {
        setChallenges(prev =>
          prev.map(c =>
            c.id === pilot.challengeId ? { ...c, status: 'Scaled' } : c
          )
        );

        setApplications(prev =>
          prev.map(a =>
            a.startupId === pilot.startupId && a.challengeId === pilot.challengeId
              ? { ...a, status: 'Validated' }
              : a
          )
        );
      }

      addAuditLog(
        'Outcome Validation Submitted',
        `Outcome validation report finalized for ${pilot.startupName} under ${pilot.challengeTitle}.`,
        'Government Officer',
        extra?.authorizedOfficial || 'Er. Rajeshwar Rao, Chief Engineer, PWD'
      );

      addAuditLog(
        'Validation Decision Recorded',
        `Decision "${decision.toUpperCase()}" authorized for ${pilot.startupName}. Remarks: ${remarks}`,
        'Government Officer',
        extra?.authorizedOfficial || 'Er. Rajeshwar Rao, Chief Engineer, PWD'
      );

      addNotification(
        'Pilot Validation Decision',
        `Authorized decision: ${decision.toUpperCase()} for ${pilot.startupName}`,
        'validation'
      );

      addToast(
        decision === 'Scale' ? 'success' : 'info',
        `Validation Decision: ${decision}`,
        `Authorized human decision recorded for ${pilot.startupName}.`
      );
    }
  }
};

  /* =========================================================
     PROCUREMENT MILESTONE
  ========================================================= */

  const releaseProcurementMilestone = async (
  contractId: string,
  milestoneNumber: number
): Promise<void> => {
  try {
    const updatedContract =
      await api.releaseMilestonePayout(
        contractId,
        milestoneNumber
      );

    setProcurementContracts(prev =>
      prev.map(contract =>
        contract.id === contractId
          ? updatedContract
          : contract
      )
    );

    const contract =
      procurementContracts.find(
        c => c.id === contractId
      );

    if (contract) {
      addAuditLog(
        'Procurement Milestone Released',
        `Milestone ${milestoneNumber} payment authorized for ${contract.startupName}`,
        'Procurement Officer',
        'Finance Division'
      );

      addNotification(
        'Procurement Payment Released',
        `Milestone ${milestoneNumber} disbursed to ${contract.startupName}`,
        'procurement'
      );

      addToast(
        'success',
        'Milestone Payment Released',
        `Milestone ${milestoneNumber} payment released and logged in audit registry.`
      );
    }
  } catch (error) {
    console.warn(
      'Backend API unavailable, releasing procurement milestone locally:',
      error
    );

    const contract = procurementContracts.find(c => c.id === contractId);
    if (contract) {
      setProcurementContracts(prev =>
        prev.map(c => {
          if (c.id !== contractId) return c;
          const updatedMilestones = c.milestones.map((m) =>
            m.milestoneNumber === milestoneNumber
              ? { ...m, status: 'Released' as const }
              : m
          );
          return {
            ...c,
            milestones: updatedMilestones
          };
        })
      );

      addAuditLog(
        'Procurement Milestone Released',
        `Milestone ${milestoneNumber} payment authorized for ${contract.startupName}`,
        'Procurement Officer',
        'Finance Division'
      );

      addNotification(
        'Procurement Payment Released',
        `Milestone ${milestoneNumber} disbursed to ${contract.startupName}`,
        'procurement'
      );

      addToast(
        'success',
        'Milestone Payment Released',
        `Milestone ${milestoneNumber} payment released and logged in audit registry.`
      );
    }
  }
};

  const createProcurementContract = async (
    contractData: Partial<ProcurementContract>
  ): Promise<ProcurementContract> => {
    try {
      const newContract = await api.createProcurementContract(contractData);
      setProcurementContracts(prev => [newContract, ...prev.filter(c => c.id !== newContract.id)]);

      addAuditLog(
        'Procurement Created',
        `Drafted procurement contract ${newContract.id} for ${newContract.startupName} under ${newContract.challengeTitle}`,
        'Government Officer',
        newContract.governmentOfficer || 'Er. Rajeshwar Rao, Chief Engineer',
        'Verified'
      );

      addNotification(
        'Procurement Contract Created',
        `Innovation procurement contract drafted for ${newContract.startupName}.`,
        'procurement'
      );

      addToast(
        'success',
        'Procurement Contract Created',
        `Procurement record ${newContract.id} registered.`
      );

      return newContract;
    } catch (err: any) {
      console.warn('Backend API error in createProcurementContract:', err);
      // Re-throw if error was eligibility rejection so UI can display it
      if (err.message && err.message.toLowerCase().includes('eligible')) {
        throw err;
      }

      // Check 5-point eligibility guard in local fallback
      const pilot = pilots.find(p => p.id === contractData.pilotId) || pilots[0];
      if (pilot?.validationDecision !== 'Scale') {
        const errorMsg = 'Startup solution is not eligible for procurement. Prerequisites: 1) Government Selection, 2) Completed Pilot, 3) Outcome Validation with "Scale" decision.';
        addToast('error', 'Procurement Ineligible', errorMsg);
        throw new Error(errorMsg);
      }

      const uniqueSuffix = Date.now().toString(36).toUpperCase();
      const contractId = `GEM-PROC-2026-${uniqueSuffix}`;
      const finalBudget = contractData.contractValue || contractData.approvedBudget || pilot?.budget || '₹45,00,000';
      const fallbackContract: ProcurementContract = {
        id: contractId,
        referenceId: `REF-GFR173-${uniqueSuffix}`,
        pilotId: pilot?.id || 'pilot-pwd-roadvision',
        pilotTitle: pilot?.title || pilot?.challengeTitle || 'Pilot Trial',
        challengeId: pilot?.challengeId,
        challengeTitle: pilot?.challengeTitle || 'Challenge',
        startupId: pilot?.startupId,
        startupName: pilot?.startupName || 'Startup',
        department: pilot?.department || 'Public Works Department',
        validatedSolution: `${pilot?.startupName} Production Scale Suite`,
        pilotResultsSummary: `Exceeded pilot KPIs: Accuracy ${pilot?.kpis?.[0]?.actual || '94.2%'}, Latency ${pilot?.kpis?.[1]?.actual || '180ms'}, Uptime ${pilot?.kpis?.[2]?.actual || '99.9%'}. Evaluated by Technical Committee with Score ${pilot?.validationScore || 91}/100.`,
        approvedBudget: finalBudget,
        contractValue: finalBudget,
        procurementMethod: contractData.procurementMethod || 'Rule 173 GFR Innovation Direct Purchase via GeM',
        contractStatus: 'Draft',
        contractStartDate: contractData.contractStartDate || new Date().toISOString().split('T')[0],
        contractEndDate: contractData.contractEndDate || new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
        executedDate: new Date().toISOString().split('T')[0],
        deliverables: contractData.deliverables || 'Multi-district production deployment with SLA compliance',
        paymentInfo: contractData.paymentInfo || 'PFMS PFMS/2026/GEM-ESCROW with 100% statutory bank guarantee',
        notes: contractData.notes || 'Procurement authorized under Rule 173 of GFR 2017 following successful outcome-validated pilot trial.',
        evaluationId: 'eval-pwd-01',
        expertScore: 91,
        validationDecision: pilot?.validationDecision || 'Scale',
        validationScore: pilot?.validationScore || 91,
        governmentOfficer: pilot?.governmentOfficer || 'Er. Rajeshwar Rao, Chief Engineer',
        milestones: contractData.milestones && contractData.milestones.length > 0 ? contractData.milestones : [
          { milestoneNumber: 1, title: 'Milestone 1: Production Infrastructure & Hardware Supply', payout: '30% Escrow Advance', status: 'Pending Verification', deliverable: 'Delivery of field hardware units' },
          { milestoneNumber: 2, title: 'Milestone 2: 90-Day Operational SLA & Live Integration', payout: '40% Intermediate Payout', status: 'Upcoming', deliverable: 'Uptime ≥ 99% and GIS ERP integration' },
          { milestoneNumber: 3, title: 'Milestone 3: Final Acceptance & Commissioning', payout: '30% Final Disbursement', status: 'Upcoming', deliverable: 'Final operational sign-off & warranty support' }
        ]
      };

      setProcurementContracts(prev => [fallbackContract, ...prev.filter(c => c.id !== fallbackContract.id)]);
      addAuditLog(
        'Procurement Created',
        `Drafted procurement contract ${fallbackContract.id} for ${fallbackContract.startupName} under ${fallbackContract.challengeTitle}`,
        'Government Officer',
        fallbackContract.governmentOfficer || 'Er. Rajeshwar Rao, Chief Engineer',
        'Verified'
      );
      addNotification('Procurement Contract Created', `Innovation procurement contract drafted for ${fallbackContract.startupName}.`, 'procurement');
      addToast('success', 'Procurement Contract Created', `Procurement record ${fallbackContract.id} registered.`);
      return fallbackContract;
    }
  };

  const updateProcurementStatus = async (
    contractId: string,
    status: ProcurementContractStatus,
    notes?: string,
    authorizedOfficial?: string
  ): Promise<void> => {
    try {
      const updated = await api.updateProcurementStatus(contractId, status, notes, authorizedOfficial);
      setProcurementContracts(prev => prev.map(c => c.id === contractId ? updated : c));

      let auditAction = 'Procurement Status Updated';
      if (status === 'Under Review') auditAction = 'Procurement Submitted for Review';
      else if (status === 'Approved') auditAction = 'Procurement Approved';
      else if (status === 'Active') auditAction = 'Procurement Activated';
      else if (status === 'Completed') auditAction = 'Procurement Completed';

      addAuditLog(
        auditAction,
        `Procurement contract ${contractId} transitioned to ${status}`,
        'Government Officer',
        authorizedOfficial || updated.governmentOfficer || 'Er. Rajeshwar Rao, Chief Engineer',
        'Verified'
      );

      addNotification(
        `Procurement ${status}`,
        `Procurement contract ${contractId} is now ${status}.`,
        'procurement'
      );

      addToast(
        'success',
        `Procurement ${status}`,
        `Contract status updated to ${status}.`
      );
    } catch (err) {
      console.warn('Backend API error in updateProcurementStatus, updating locally:', err);
      setProcurementContracts(prev => prev.map(c => {
        if (c.id === contractId) {
          const updatedMilestones = c.milestones ? [...c.milestones] : [];
          if (status === 'Active' && updatedMilestones[0]) {
            updatedMilestones[0] = { ...updatedMilestones[0], status: 'Released' };
          } else if (status === 'Completed') {
            updatedMilestones.forEach(m => { m.status = 'Released'; });
          }
          return {
            ...c,
            contractStatus: status,
            notes: notes || c.notes,
            governmentOfficer: authorizedOfficial || c.governmentOfficer,
            milestones: updatedMilestones
          };
        }
        return c;
      }));

      let auditAction = 'Procurement Status Updated';
      if (status === 'Under Review') auditAction = 'Procurement Submitted for Review';
      else if (status === 'Approved') auditAction = 'Procurement Approved';
      else if (status === 'Active') auditAction = 'Procurement Activated';
      else if (status === 'Completed') auditAction = 'Procurement Completed';

      addAuditLog(
        auditAction,
        `Procurement contract ${contractId} transitioned to ${status}`,
        'Government Officer',
        authorizedOfficial || 'Er. Rajeshwar Rao, Chief Engineer',
        'Verified'
      );

      addNotification(
        `Procurement ${status}`,
        `Procurement contract ${contractId} is now ${status}.`,
        'procurement'
      );

      addToast(
        'success',
        `Procurement ${status}`,
        `Contract status updated to ${status}.`
      );
    }
  };


  /* =========================================================
     SCALE-UP
  ========================================================= */

  const createScaleUpPlan = async (
    planData: Partial<ScaleUpPlan>
  ): Promise<ScaleUpPlan> => {
    try {
      const newPlan = await api.createScaleUpPlan(planData);
      setScaleUpPlans(prev => [newPlan, ...prev.filter(p => p.id !== newPlan.id)]);
      setScaleUpPlan(newPlan);

      addAuditLog(
        'Scale-Up Plan Created',
        `Drafted state-wide scale-up plan ${newPlan.id} for ${newPlan.startupName} under ${newPlan.challengeTitle}`,
        'Government Officer',
        newPlan.authorizedOfficial || 'Er. Rajeshwar Rao, Chief Engineer, PWD',
        'Verified'
      );

      addNotification(
        'Scale-Up Stage Initiated',
        `Your solution ${newPlan.startupName} has entered the Scale-Up stage for statewide expansion.`,
        'scale-up'
      );

      addToast(
        'success',
        'Scale-Up Plan Created',
        `Scale-Up plan ${newPlan.id} registered for ${newPlan.startupName}.`
      );

      return newPlan;
    } catch (err: any) {
      console.warn('Backend API error in createScaleUpPlan:', err);
      // Re-throw if error was an eligibility rejection
      if (err.message && err.message.toLowerCase().includes('scale-up unavailable')) {
        throw err;
      }

      // Check local 7-point eligibility guard in fallback
      const contract = procurementContracts.find(c => c.id === planData.procurementId) || procurementContracts[0];
      if (!contract) {
        const errorMsg = 'Scale-Up unavailable: Procurement contract not found.';
        addToast('error', 'Scale-Up Blocked', errorMsg);
        throw new Error(errorMsg);
      }

      const pilot = pilots.find(p => p.id === contract.pilotId || p.startupName === contract.startupName);
      if (!pilot) {
        const errorMsg = 'Scale-Up unavailable: Controlled Pilot project does not exist.';
        addToast('error', 'Scale-Up Blocked', errorMsg);
        throw new Error(errorMsg);
      }

      if (!['Under Evaluation', 'Completed', 'Validated', 'Scale Approved'].includes(pilot.status) &&
          !(pilot.status === 'In Progress' && Boolean(pilot.validationDecision))) {
        const errorMsg = 'Scale-Up unavailable: Pilot project has not reached completed/evaluated status.';
        addToast('error', 'Scale-Up Blocked', errorMsg);
        throw new Error(errorMsg);
      }

      if (!pilot.validationDecision && pilot.validationStatus !== 'Validated') {
        const errorMsg = 'Scale-Up unavailable: KPI & Outcome Validation must be completed first.';
        addToast('error', 'Scale-Up Blocked', errorMsg);
        throw new Error(errorMsg);
      }

      if (pilot.validationDecision !== 'Scale') {
        const errorMsg = 'Scale-Up unavailable: Outcome Validation must approve scaling first (decision was not "Scale").';
        addToast('error', 'Scale-Up Blocked', errorMsg);
        throw new Error(errorMsg);
      }

      if (!['Approved', 'Active', 'Completed'].includes(contract.contractStatus)) {
        const errorMsg = 'Scale-Up unavailable: Procurement Contract must be Approved or Active before scaling.';
        addToast('error', 'Scale-Up Blocked', errorMsg);
        throw new Error(errorMsg);
      }

      const uniqueSuffix = Date.now().toString(36).toUpperCase();
      const scaleUpId = `SCALE-UP-2027-${uniqueSuffix}`;
      const budget = planData.estimatedBudget || contract.contractValue || contract.approvedBudget || '₹4,25,00,000';
      const regions = planData.targetRegions && planData.targetRegions.length > 0
        ? planData.targetRegions
        : ['Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Tumakuru', 'Hubballi-Dharwad'];

      const fallbackPlan: ScaleUpPlan = {
        id: scaleUpId,
        challengeId: contract.challengeId || pilot.challengeId,
        challengeTitle: contract.challengeTitle || pilot.challengeTitle || 'Municipal Infrastructure Challenge',
        startupId: contract.startupId || pilot.startupId,
        startupName: contract.startupName || pilot.startupName || 'Startup',
        solutionName: contract.validatedSolution || `${contract.startupName} Production Suite`,
        pilotId: contract.pilotId || pilot.id,
        pilotTitle: contract.pilotTitle || pilot.title || 'Controlled Field Pilot',
        procurementId: contract.id,
        procurementReferenceId: contract.referenceId || contract.id,
        title: planData.title || `State-Wide Expansion Plan for ${contract.startupName}`,
        description: planData.description || 'Departmental scale-up rollout across targeted districts following validated pilot trial and innovation procurement award.',
        targetScope: planData.targetScope || '32,000 km State Road Infrastructure Network',
        targetRegions: regions,
        expectedBeneficiaries: planData.expectedBeneficiaries || '6.4 Crore citizens & 2.1 Million daily commuters',
        estimatedBudget: budget,
        estimatedCost: budget,
        implementationTimeline: planData.implementationTimeline || '18 Months (Q1 2027 - Q3 2028)',
        responsibleGovernmentDepartment: planData.responsibleGovernmentDepartment || contract.department || 'Public Works Department (PWD)',
        risks: planData.risks || 'Hardware telemetry degradation in extreme weather; edge transmission in low-bandwidth corridors',
        mitigation: planData.mitigation || 'IP68-rated enclosures, edge-side local caching, and asynchronous data sync',
        status: 'Draft',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        authorizedOfficial: contract.governmentOfficer || 'Er. Rajeshwar Rao, Chief Engineer, PWD',
        expectedImpact: 'Annual operational savings of ₹14.8 Cr and 22% reduction in maintenance delay times.',
        currentDeployment: '520 km (Controlled Pilot Zone)',
        targetDeployment: planData.targetScope || '32,000 km across targeted districts',
        milestones: planData.milestones && planData.milestones.length > 0 ? planData.milestones : [
          { milestoneNumber: 1, title: 'Phase 1: Multi-District Deployment & Operator Training', timeline: 'Months 1-4', deliverable: 'Deployment of 45 edge sensor units across 5 primary districts', status: 'Pending', targetDistrict: regions.slice(0, 2).join(', '), budgetAllocation: '₹95,00,000' },
          { milestoneNumber: 2, title: 'Phase 2: Departmental ERP Integration', timeline: 'Months 5-10', deliverable: 'Automated work-order dispatch across 12 PWD circle offices', status: 'Pending', targetDistrict: regions.slice(2, 4).join(', '), budgetAllocation: '₹1,50,00,000' },
          { milestoneNumber: 3, title: 'Phase 3: Statewide Network Coverage', timeline: 'Months 11-18', deliverable: 'Full statewide road network monitoring and public API launch', status: 'Pending', targetDistrict: 'Statewide Corridors', budgetAllocation: '₹1,80,00,000' }
        ],
        kpis: planData.kpis && planData.kpis.length > 0 ? planData.kpis : [
          { metric: 'Road Network Coverage', baseline: '520 km', target: planData.targetScope || '32,000 km', current: '520 km', status: 'Tracking' },
          { metric: 'Detection Accuracy SLA', baseline: '94.2%', target: '≥ 95.0%', current: '94.8%', status: 'Tracking' },
          { metric: 'Repair Work Order Dispatch', baseline: '14 Days', target: '< 48 Hours', current: '72 Hours', status: 'Tracking' },
          { metric: 'Citizen Grievance Resolution', baseline: '45%', target: '> 90%', current: '78%', status: 'Tracking' }
        ],
        scalePhases: [
          { phase: 'Phase 1', title: 'Controlled Municipal Pilot', coverage: '520 km (1 Division)', timeline: 'Q3 2026 (Completed)', status: 'Completed', districts: [regions[0] || 'Bengaluru Urban'] },
          { phase: 'Phase 2', title: 'Multi-District Expansion Corridor', coverage: '4,500 km (Key Regional Highways)', timeline: 'Q1 - Q2 2027', status: 'Active', districts: regions.slice(1, 4) },
          { phase: 'Phase 3', title: 'Comprehensive Statewide Rollout', coverage: planData.targetScope || '32,000 km Network', timeline: 'Q3 2027 - Q4 2028', status: 'Planned', districts: ['All Targeted Districts'] }
        ]
      };

      setScaleUpPlans(prev => [fallbackPlan, ...prev.filter(p => p.id !== fallbackPlan.id)]);
      setScaleUpPlan(fallbackPlan);

      addAuditLog(
        'Scale-Up Plan Created',
        `Drafted state-wide scale-up plan ${fallbackPlan.id} for ${fallbackPlan.startupName} under ${fallbackPlan.challengeTitle}`,
        'Government Officer',
        fallbackPlan.authorizedOfficial || 'Er. Rajeshwar Rao, Chief Engineer, PWD',
        'Verified'
      );

      addNotification(
        'Scale-Up Stage Initiated',
        `Your solution ${fallbackPlan.startupName} has entered the Scale-Up stage for statewide expansion.`,
        'scale-up'
      );

      addToast(
        'success',
        'Scale-Up Plan Created',
        `Scale-Up plan ${fallbackPlan.id} registered for ${fallbackPlan.startupName}.`
      );

      return fallbackPlan;
    }
  };

  const updateScaleUpPlan = async (
    id: string,
    planData: Partial<ScaleUpPlan>
  ): Promise<ScaleUpPlan> => {
    try {
      const updated = await api.updateScaleUpPlan(id, planData);
      setScaleUpPlans(prev => prev.map(p => p.id === id ? updated : p));
      if (scaleUpPlan.id === id) setScaleUpPlan(updated);
      addToast('success', 'Plan Updated', 'Scale-up parameters successfully saved.');
      return updated;
    } catch (err: any) {
      console.warn('Backend API updateScaleUpPlan failed, updating locally:', err);
      let updatedPlan: ScaleUpPlan = scaleUpPlan;
      setScaleUpPlans(prev => prev.map(p => {
        if (p.id === id) {
          updatedPlan = { ...p, ...planData, updatedAt: new Date().toISOString().split('T')[0] };
          return updatedPlan;
        }
        return p;
      }));
      if (scaleUpPlan.id === id) setScaleUpPlan(updatedPlan);
      addToast('success', 'Plan Updated', 'Scale-up parameters successfully saved.');
      return updatedPlan;
    }
  };

  const submitScaleUpPlan = async (id: string, notes?: string): Promise<ScaleUpPlan> => {
    try {
      const updated = await api.submitScaleUpPlan(id, notes);
      setScaleUpPlans(prev => prev.map(p => p.id === id ? updated : p));
      if (scaleUpPlan.id === id) setScaleUpPlan(updated);

      addAuditLog(
        'Scale-Up Submitted for Review',
        `Scale-up plan ${id} submitted for inter-departmental sanction review`,
        'Government Officer',
        updated.authorizedOfficial || 'Er. Rajeshwar Rao, Chief Engineer, PWD',
        'Verified'
      );

      addNotification(
        'Scale-Up Under Review',
        `Scale-up plan for ${updated.startupName} submitted for administrative sanction.`,
        'scale-up'
      );

      addToast('info', 'Submitted for Review', `Scale-up plan ${id} submitted for sanction review.`);
      return updated;
    } catch (err: any) {
      console.warn('Backend submitScaleUpPlan failed, falling back locally:', err);
      let updatedPlan: ScaleUpPlan = scaleUpPlan;
      setScaleUpPlans(prev => prev.map(p => {
        if (p.id === id) {
          updatedPlan = { ...p, status: 'Under Review', updatedAt: new Date().toISOString().split('T')[0], approvalNotes: notes || p.approvalNotes };
          return updatedPlan;
        }
        return p;
      }));
      if (scaleUpPlan.id === id) setScaleUpPlan(updatedPlan);

      addAuditLog(
        'Scale-Up Submitted for Review',
        `Scale-up plan ${id} submitted for inter-departmental sanction review`,
        'Government Officer',
        updatedPlan.authorizedOfficial || 'Er. Rajeshwar Rao, Chief Engineer, PWD',
        'Verified'
      );

      addNotification(
        'Scale-Up Under Review',
        `Scale-up plan for ${updatedPlan.startupName} submitted for administrative sanction.`,
        'scale-up'
      );

      addToast('info', 'Submitted for Review', `Scale-up plan ${id} submitted for sanction review.`);
      return updatedPlan;
    }
  };

  const approveScaleUpPlan = async (id: string, notes?: string, official?: string): Promise<ScaleUpPlan> => {
    try {
      const updated = await api.approveScaleUpPlan(id, notes, official);
      setScaleUpPlans(prev => prev.map(p => p.id === id ? updated : p));
      if (scaleUpPlan.id === id) setScaleUpPlan(updated);

      addAuditLog(
        'Scale-Up Approved',
        `Scale-up plan ${id} officially approved by Departmental Sanction Committee`,
        'Government Officer',
        official || updated.authorizedOfficial || 'Er. Rajeshwar Rao, Chief Engineer, PWD',
        'Verified'
      );

      addNotification(
        'Scale-Up Plan Approved',
        `Scale-up plan approved for ${updated.startupName}. Multi-district rollout sanctioned.`,
        'scale-up'
      );

      addToast('success', 'Scale-Up Approved', `Plan ${id} officially approved for multi-district deployment.`);
      return updated;
    } catch (err: any) {
      console.warn('Backend approveScaleUpPlan failed, falling back locally:', err);
      let updatedPlan: ScaleUpPlan = scaleUpPlan;
      setScaleUpPlans(prev => prev.map(p => {
        if (p.id === id) {
          updatedPlan = {
            ...p,
            status: 'Approved',
            updatedAt: new Date().toISOString().split('T')[0],
            approvalNotes: notes || p.approvalNotes,
            authorizedOfficial: official || p.authorizedOfficial
          };
          return updatedPlan;
        }
        return p;
      }));
      if (scaleUpPlan.id === id) setScaleUpPlan(updatedPlan);

      addAuditLog(
        'Scale-Up Approved',
        `Scale-up plan ${id} officially approved by Departmental Sanction Committee`,
        'Government Officer',
        official || updatedPlan.authorizedOfficial || 'Er. Rajeshwar Rao, Chief Engineer, PWD',
        'Verified'
      );

      addNotification(
        'Scale-Up Plan Approved',
        `Scale-up plan approved for ${updatedPlan.startupName}. Multi-district rollout sanctioned.`,
        'scale-up'
      );

      addToast('success', 'Scale-Up Approved', `Plan ${id} officially approved for multi-district deployment.`);
      return updatedPlan;
    }
  };

  const activateScaleUpPlan = async (id: string, notes?: string): Promise<ScaleUpPlan> => {
    try {
      const updated = await api.activateScaleUpPlan(id, notes);
      setScaleUpPlans(prev => prev.map(p => p.id === id ? updated : p));
      if (scaleUpPlan.id === id) setScaleUpPlan(updated);

      addAuditLog(
        'Scale-Up Activated',
        `Scale-up implementation activated for ${updated.startupName} across targeted territorial districts`,
        'Government Officer',
        updated.authorizedOfficial || 'Er. Rajeshwar Rao, Chief Engineer, PWD',
        'Verified'
      );

      addNotification(
        'Scale-Up Implementation Started',
        `Scale-up implementation has started for ${updated.startupName}. Field deployment initiated.`,
        'scale-up'
      );

      addToast('success', 'Scale-Up Activated', `Scale-up rollout for ${updated.startupName} is now ACTIVE.`);
      return updated;
    } catch (err: any) {
      console.warn('Backend activateScaleUpPlan failed, falling back locally:', err);
      let updatedPlan: ScaleUpPlan = scaleUpPlan;
      setScaleUpPlans(prev => prev.map(p => {
        if (p.id === id) {
          const updatedMilestones = p.milestones ? [...p.milestones] : [];
          if (updatedMilestones[0]) updatedMilestones[0].status = 'In Progress';
          updatedPlan = {
            ...p,
            status: 'Active',
            milestones: updatedMilestones,
            updatedAt: new Date().toISOString().split('T')[0]
          };
          return updatedPlan;
        }
        return p;
      }));
      if (scaleUpPlan.id === id) setScaleUpPlan(updatedPlan);

      addAuditLog(
        'Scale-Up Activated',
        `Scale-up implementation activated for ${updatedPlan.startupName} across targeted territorial districts`,
        'Government Officer',
        updatedPlan.authorizedOfficial || 'Er. Rajeshwar Rao, Chief Engineer, PWD',
        'Verified'
      );

      addNotification(
        'Scale-Up Implementation Started',
        `Scale-up implementation has started for ${updatedPlan.startupName}. Field deployment initiated.`,
        'scale-up'
      );

      addToast('success', 'Scale-Up Activated', `Scale-up rollout for ${updatedPlan.startupName} is now ACTIVE.`);
      return updatedPlan;
    }
  };

  const completeScaleUpPlan = async (id: string, notes?: string): Promise<ScaleUpPlan> => {
    try {
      const updated = await api.completeScaleUpPlan(id, notes);
      setScaleUpPlans(prev => prev.map(p => p.id === id ? updated : p));
      if (scaleUpPlan.id === id) setScaleUpPlan(updated);

      addAuditLog(
        'Scale-Up Completed',
        `Scale-up rollout successfully completed for ${updated.startupName}. Full state adoption achieved.`,
        'Government Officer',
        updated.authorizedOfficial || 'Er. Rajeshwar Rao, Chief Engineer, PWD',
        'Verified'
      );

      addNotification(
        'Scale-Up Completed',
        `Statewide scale-up deployment successfully completed for ${updated.startupName}.`,
        'scale-up'
      );

      addToast('success', 'Scale-Up Completed', `Scale-up rollout for ${updated.startupName} marked COMPLETED.`);
      return updated;
    } catch (err: any) {
      console.warn('Backend completeScaleUpPlan failed, falling back locally:', err);
      let updatedPlan: ScaleUpPlan = scaleUpPlan;
      setScaleUpPlans(prev => prev.map(p => {
        if (p.id === id) {
          const updatedMilestones = p.milestones ? p.milestones.map(m => ({ ...m, status: 'Completed' as const })) : [];
          const updatedPhases = p.scalePhases ? p.scalePhases.map(ph => ({ ...ph, status: 'Completed' as const })) : [];
          updatedPlan = {
            ...p,
            status: 'Completed',
            milestones: updatedMilestones,
            scalePhases: updatedPhases,
            updatedAt: new Date().toISOString().split('T')[0]
          };
          return updatedPlan;
        }
        return p;
      }));
      if (scaleUpPlan.id === id) setScaleUpPlan(updatedPlan);

      addAuditLog(
        'Scale-Up Completed',
        `Scale-up rollout successfully completed for ${updatedPlan.startupName}. Full state adoption achieved.`,
        'Government Officer',
        updatedPlan.authorizedOfficial || 'Er. Rajeshwar Rao, Chief Engineer, PWD',
        'Verified'
      );

      addNotification(
        'Scale-Up Completed',
        `Statewide scale-up deployment successfully completed for ${updatedPlan.startupName}.`,
        'scale-up'
      );

      addToast('success', 'Scale-Up Completed', `Scale-up rollout for ${updatedPlan.startupName} marked COMPLETED.`);
      return updatedPlan;
    }
  };

  const advanceScaleUpPhase = async (
    phaseNumber: string
  ): Promise<void> => {
    try {
      const updatedPlan =
        await api.advanceScaleUpPhase(phaseNumber);

      setScaleUpPlan(updatedPlan);
      setScaleUpPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));

      addAuditLog(
        'Scale-Up Phase Advanced',
        `Activated rollout phase ${phaseNumber} across targeted districts`,
        'Government Officer',
        'State IT & Infrastructure Mission'
      );

      addToast(
        'success',
        'Scale-Up Phase Activated',
        `Phase ${phaseNumber} multi-district deployment authorized.`
      );
    } catch (error) {
      console.warn(
        'Backend API unavailable, advancing scale-up phase locally:',
        error
      );

      setScaleUpPlan(prev => {
        const updatedPhases = prev.scalePhases.map(p =>
          p.phase === `Phase ${phaseNumber}` || p.phase === phaseNumber
            ? { ...p, status: 'Active' as const }
            : p
        );
        return {
          ...prev,
          scalePhases: updatedPhases
        };
      });

      addAuditLog(
        'Scale-Up Phase Advanced',
        `Activated rollout phase ${phaseNumber} across targeted districts`,
        'Government Officer',
        'State IT & Infrastructure Mission'
      );

      addToast(
        'success',
        'Scale-Up Phase Activated',
        `Phase ${phaseNumber} multi-district deployment authorized.`
      );
    }
  };

  /* =========================================================
     IMPACT MONITORING ACTIONS
  ========================================================= */
  const createImpactRecord = async (data: Partial<ImpactRecord>): Promise<ImpactRecord> => {
    try {
      const created = await api.createImpactRecord(data);
      setImpactRecords(prev => [created, ...prev.filter(r => r.id !== created.id)]);
      addToast('success', 'Impact Metric Registered', `Metric "${created.metricName}" added to tracking ledger.`);
      return created;
    } catch (err: any) {
      console.warn('Backend createImpactRecord failed, validating locally:', err);
      const plan = scaleUpPlans.find(p => p.id === data.scaleUpPlanId) || (scaleUpPlan.id === data.scaleUpPlanId ? scaleUpPlan : null);
      if (!plan) {
        throw new Error('Impact Monitoring unavailable: Scale-Up plan not found.');
      }
      if (!['Approved', 'Active', 'Completed'].includes(plan.status)) {
        throw new Error(`Impact Monitoring unavailable: Scale-Up plan must be Approved or Active (current status: ${plan.status}).`);
      }
      const contract = procurementContracts.find(c => c.id === plan.procurementId || c.startupId === plan.startupId);
      if (!contract || !['Approved', 'Active', 'Completed'].includes(contract.contractStatus)) {
        throw new Error('Impact Monitoring unavailable: Procurement contract must be Approved or Active.');
      }
      const pilot = pilots.find(p => p.id === plan.pilotId || p.startupName === plan.startupName);
      if (!pilot || !['Under Evaluation', 'Completed', 'Validated', 'Scale Approved'].includes(pilot.status)) {
        throw new Error('Impact Monitoring unavailable: Pilot project has not reached completed/evaluated status.');
      }
      if (pilot.validationDecision !== 'Scale') {
        throw new Error('Impact Monitoring unavailable: Outcome Validation must approve scaling (decision was not "Scale").');
      }

      const calc = calculateImpactMetrics(Number(data.baselineValue || 0), Number(data.currentValue !== undefined ? data.currentValue : data.baselineValue || 0), Number(data.targetValue || 0));
      const now = new Date().toISOString().split('T')[0];

      const fallbackRecord: ImpactRecord = {
        id: `impact-${Date.now()}`,
        challengeId: plan.challengeId || 'ch-pwd-01',
        challengeTitle: plan.challengeTitle || plan.title,
        startupId: plan.startupId || 'startup-roadvision',
        startupName: plan.startupName || 'RoadVision AI',
        solutionName: plan.solutionName || 'State-Wide Intelligent Road Health Grid',
        scaleUpPlanId: plan.id,
        scaleUpPlanTitle: plan.title,
        procurementId: plan.procurementId || contract.id,
        procurementReferenceId: plan.procurementReferenceId || contract.referenceId,
        pilotId: plan.pilotId || pilot.id,
        reportingPeriod: data.reportingPeriod || 'Q1 2027',
        metricName: (data.metricName || 'New Impact Metric').trim(),
        impactCategory: data.impactCategory || 'Operational Efficiency',
        baselineValue: Number(data.baselineValue || 0),
        currentValue: Number(data.currentValue !== undefined ? data.currentValue : data.baselineValue || 0),
        targetValue: Number(data.targetValue || 0),
        unit: data.unit || 'Units',
        beneficiaryCount: Number(data.beneficiaryCount || 0),
        geographicCoverage: data.geographicCoverage || 'Statewide',
        implementationStatus: data.implementationStatus || 'On Track',
        evidence: data.evidence || '',
        notes: data.notes || '',
        reportedBy: data.reportedBy || 'Government Officer',
        verificationStatus: 'Pending Verification',
        createdAt: now,
        updatedAt: now,
        ...calc
      };

      setImpactRecords(prev => [fallbackRecord, ...prev.filter(r => r.id !== fallbackRecord.id)]);

      addAuditLog(
        'Impact Metric Registered',
        `Registered impact metric "${fallbackRecord.metricName}" for Scale-Up ${plan.title}`,
        'Government Officer',
        'Er. Rajeshwar Rao'
      );

      addNotification(
        'New Impact Metric Registered',
        `Impact tracking metric "${fallbackRecord.metricName}" registered for ${fallbackRecord.startupName}.`,
        'impact'
      );

      addToast('success', 'Impact Metric Registered', `Metric "${fallbackRecord.metricName}" added to tracking ledger.`);
      return fallbackRecord;
    }
  };

  const updateImpactRecord = async (id: string, data: Partial<ImpactRecord>): Promise<ImpactRecord> => {
    try {
      const updated = await api.updateImpactRecord(id, data);
      setImpactRecords(prev => prev.map(r => r.id === id ? updated : r));
      addToast('info', 'Impact Metric Updated', `Metric "${updated.metricName}" updated.`);
      return updated;
    } catch (err) {
      let updatedRecord: ImpactRecord | null = null;
      setImpactRecords(prev => prev.map(r => {
        if (r.id === id) {
          const merged = { ...r, ...data, updatedAt: new Date().toISOString().split('T')[0] };
          const calc = calculateImpactMetrics(merged.baselineValue, merged.currentValue, merged.targetValue);
          updatedRecord = { ...merged, ...calc };
          return updatedRecord;
        }
        return r;
      }));
      if (updatedRecord) {
        addToast('info', 'Impact Metric Updated', `Metric "${(updatedRecord as ImpactRecord).metricName}" updated.`);
        return updatedRecord;
      }
      throw err;
    }
  };

  const submitImpactReport = async (id: string, data: { currentValue: number; evidence?: string; notes?: string; reportedBy?: string; reportingPeriod?: string }): Promise<ImpactRecord> => {
    try {
      const updated = await api.submitImpactReport(id, data);
      setImpactRecords(prev => prev.map(r => r.id === id ? updated : r));

      addAuditLog(
        'Impact Telemetry Submitted',
        `Submitted telemetry for metric "${updated.metricName}" (${updated.currentValue} ${updated.unit}). Pending verification.`,
        'Startup Founder',
        data.reportedBy || 'Ananya Deshmukh'
      );

      addNotification(
        'Impact Report Requires Verification',
        `New telemetry report submitted for "${updated.metricName}". Human verification required.`,
        'impact'
      );

      addToast('success', 'Report Submitted', `Impact report for "${updated.metricName}" submitted for verification.`);
      return updated;
    } catch (err) {
      let updatedRecord: ImpactRecord | null = null;
      setImpactRecords(prev => prev.map(r => {
        if (r.id === id) {
          const merged = {
            ...r,
            currentValue: Number(data.currentValue),
            evidence: data.evidence || r.evidence,
            notes: data.notes || r.notes,
            reportedBy: data.reportedBy || r.reportedBy,
            reportingPeriod: data.reportingPeriod || r.reportingPeriod,
            verificationStatus: 'Pending Verification' as const,
            updatedAt: new Date().toISOString().split('T')[0]
          };
          const calc = calculateImpactMetrics(merged.baselineValue, merged.currentValue, merged.targetValue);
          updatedRecord = { ...merged, ...calc };
          return updatedRecord;
        }
        return r;
      }));
      if (updatedRecord) {
        addAuditLog(
          'Impact Telemetry Submitted',
          `Submitted telemetry for metric "${(updatedRecord as ImpactRecord).metricName}" (${(updatedRecord as ImpactRecord).currentValue} ${(updatedRecord as ImpactRecord).unit}). Pending verification.`,
          'Startup Founder',
          data.reportedBy || 'Ananya Deshmukh'
        );
        addNotification(
          'Impact Report Requires Verification',
          `New telemetry report submitted for "${(updatedRecord as ImpactRecord).metricName}". Human verification required.`,
          'impact'
        );
        addToast('success', 'Report Submitted', `Impact report for "${(updatedRecord as ImpactRecord).metricName}" submitted for verification.`);
        return updatedRecord;
      }
      throw err;
    }
  };

  const verifyImpactReport = async (id: string, data: { verifiedBy?: string; verificationNotes?: string }): Promise<ImpactRecord> => {
    try {
      const updated = await api.verifyImpactReport(id, data);
      setImpactRecords(prev => prev.map(r => r.id === id ? updated : r));

      addAuditLog(
        'Impact Report Verified',
        `Officially verified impact metric "${updated.metricName}". Achievement: ${updated.targetAchievement}%. Remarks: ${data.verificationNotes || 'Statutory verification completed.'}`,
        'Government Officer',
        data.verifiedBy || 'Er. Rajeshwar Rao, Chief Engineer, PWD',
        'Verified'
      );

      addNotification(
        'Impact Report Verified by Government',
        `Your impact telemetry for "${updated.metricName}" has been officially verified by Government.`,
        'impact'
      );

      addToast('success', 'Impact Verified', `Metric "${updated.metricName}" officially verified.`);
      return updated;
    } catch (err) {
      let updatedRecord: ImpactRecord | null = null;
      setImpactRecords(prev => prev.map(r => {
        if (r.id === id) {
          const now = new Date().toISOString().split('T')[0];
          updatedRecord = {
            ...r,
            verificationStatus: 'Verified' as const,
            verifiedBy: data.verifiedBy || 'Er. Rajeshwar Rao, Chief Engineer, PWD',
            verificationNotes: data.verificationNotes || 'Statutory verification completed.',
            verifiedAt: now,
            updatedAt: now
          };
          return updatedRecord;
        }
        return r;
      }));
      if (updatedRecord) {
        addAuditLog(
          'Impact Report Verified',
          `Officially verified impact metric "${(updatedRecord as ImpactRecord).metricName}". Achievement: ${(updatedRecord as ImpactRecord).targetAchievement}%. Remarks: ${data.verificationNotes || 'Statutory verification completed.'}`,
          'Government Officer',
          data.verifiedBy || 'Er. Rajeshwar Rao, Chief Engineer, PWD',
          'Verified'
        );
        addNotification(
          'Impact Report Verified by Government',
          `Your impact telemetry for "${(updatedRecord as ImpactRecord).metricName}" has been officially verified by Government.`,
          'impact'
        );
        addToast('success', 'Impact Verified', `Metric "${(updatedRecord as ImpactRecord).metricName}" officially verified.`);
        return updatedRecord;
      }
      throw err;
    }
  };

  const rejectImpactReport = async (id: string, data: { verifiedBy?: string; reason?: string }): Promise<ImpactRecord> => {
    try {
      const updated = await api.rejectImpactReport(id, data);
      setImpactRecords(prev => prev.map(r => r.id === id ? updated : r));
      addToast('warning', 'Impact Report Flagged', `Metric "${updated.metricName}" flagged for review.`);
      return updated;
    } catch (err) {
      let updatedRecord: ImpactRecord | null = null;
      setImpactRecords(prev => prev.map(r => {
        if (r.id === id) {
          updatedRecord = {
            ...r,
            verificationStatus: 'Flagged' as const,
            verifiedBy: data.verifiedBy || 'Authorized Official',
            verificationNotes: data.reason || 'Flagged for audit discrepancy.',
            updatedAt: new Date().toISOString().split('T')[0]
          };
          return updatedRecord;
        }
        return r;
      }));
      if (updatedRecord) {
        addToast('warning', 'Impact Report Flagged', `Metric "${(updatedRecord as ImpactRecord).metricName}" flagged for review.`);
        return updatedRecord;
      }
      throw err;
    }
  };

  /* =========================================================
     NOTIFICATIONS
  ========================================================= */

  const markNotificationRead = (
    id: string
  ) => {

    setNotifications(prev =>
      prev.map(n =>
        n.id === id
          ? {
              ...n,
              read: true
            }
          : n
      )
    );
  };


  const markAllNotificationsRead = () => {

    setNotifications(prev =>
      prev.map(n => ({
        ...n,
        read: true
      }))
    );

    addToast(
      'info',
      'Notifications Marked as Read',
      'All notifications cleared.'
    );
  };


  
  /* =========================================================
     DELETE CHALLENGE
  ========================================================= */
  const deleteChallenge = async (id: string): Promise<void> => {
    try {
      await api.deleteChallenge(id);
      setChallenges(prev => prev.filter(c => c.id !== id));
      addToast('info', 'Challenge Deleted', 'The challenge has been removed.');
    } catch (error) {
      console.warn('Backend delete failed, removing locally:', error);
      setChallenges(prev => prev.filter(c => c.id !== id));
      addToast('info', 'Challenge Removed', 'Challenge removed from session.');
    }
  };

  /* =========================================================
     REGISTER STARTUP
  ========================================================= */
  const registerStartup = async (
    startupData: Partial<Startup> & { name: string; domain: string; techStack: string[] }
  ): Promise<string> => {
    try {
      const newStartup = await api.createStartup(startupData);
      setStartups(prev => [newStartup, ...prev.filter(s => s.id !== newStartup.id)]);
      addAuditLog(
        'Startup Profile Registered',
        `Registered deep-tech startup "${newStartup.name}" in ${newStartup.domain}`,
        'Startup',
        newStartup.name
      );
      addNotification(
        'New Startup Registered',
        `${newStartup.name} is now available in the deep-tech discovery ecosystem.`,
        'application'
      );
      addToast('success', 'Startup Registered', `${newStartup.name} profile successfully created.`);
      return newStartup.id;
    } catch (error) {
      console.warn('Backend unreachable, saving startup to session:', error);
      const slug = startupData.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const localStartup: Startup = {
        id: `startup-${slug}-${Date.now().toString(36).slice(-4)}`,
        name: startupData.name,
        tagline: startupData.tagline || `${startupData.name} - Technology Solutions`,
        domain: startupData.domain,
        techStack: startupData.techStack,
        location: startupData.location || 'India',
        stage: startupData.stage || 'Growth',
        foundedYear: startupData.foundedYear || new Date().getFullYear() - 2,
        pilotReadiness: startupData.pilotReadiness || 'High',
        eligibilityStatus: startupData.eligibilityStatus || 'Eligible',
        teamSize: startupData.teamSize || 15,
        revenueRange: startupData.revenueRange || '₹1 - 3 Cr',
        completedPilotsCount: startupData.completedPilotsCount ?? 2,
        certifications: startupData.certifications || ['DPIIT Recognized'],
        overview: startupData.overview || `${startupData.name} develops solutions in ${startupData.domain}.`,
        pastProjects: startupData.pastProjects || []
      };
      setStartups(prev => [localStartup, ...prev]);
      addAuditLog(
        'Startup Profile Registered',
        `Registered deep-tech startup "${localStartup.name}"`,
        'Startup',
        localStartup.name
      );
      addToast('success', 'Startup Registered', `${localStartup.name} profile saved to local session.`);
      return localStartup.id;
    }
  };

  /* =========================================================
     SHORTLIST STARTUP
  ========================================================= */
  const shortlistStartup = async (challengeId: string, startupId: string): Promise<void> => {
    const cleanStartupId = String(startupId || '').trim().toLowerCase();
    const cleanChallengeId = String(challengeId || '').trim().toLowerCase();

    const startup = startups.find(s => s && s.id && s.id.trim().toLowerCase() === cleanStartupId);
    const challenge = challenges.find(c => c && c.id && c.id.trim().toLowerCase() === cleanChallengeId);
    if (!startup || !challenge) return;

    const existingApp = applications.find(
      a => a.challengeId.toLowerCase() === cleanChallengeId && a.startupId.toLowerCase() === cleanStartupId
    );

    if (existingApp) {
      setApplications(prev => prev.map(a => a.id === existingApp.id ? { ...a, status: 'Shortlisted' } : a));
    } else {
      const newApp: Application = {
        id: `app-${Date.now().toString(36)}`,
        challengeId: challenge.id,
        challengeTitle: challenge.title,
        department: challenge.department,
        startupId: startup.id,
        startupName: startup.name,
        submissionDate: new Date().toISOString().split('T')[0],
        status: 'Shortlisted',
        technicalProposal: `Technical solution proposal submitted by ${startup.name} for ${challenge.title}. Deploying verified deep-tech capabilities adhering to all tender milestones.`,
        budgetQuoted: challenge.budgetRange || '₹25 - 50 Lakhs',
        pilotPlan: `${challenge.pilotDuration || '90-Day'} phased controlled field deployment.`,
        implementationPlan: 'Immediate 30-day technical integration, edge telemetry setup, and field onboarding.',
        expectedImpact: 'Direct operational fulfillment of key challenge KPIs and department benchmarks.',
        documents: ['DPIIT_Startup_Certificate.pdf', 'Technical_Proposal.pdf']
      };
      setApplications(prev => [newApp, ...prev]);
      setChallenges(prev => prev.map(c => c.id.toLowerCase() === cleanChallengeId ? { ...c, applicationsCount: (c.applicationsCount || 0) + 1 } : c));
    }

    addAuditLog(
      'Startup Shortlisted via AI Match',
      `Shortlisted ${startup.name} for challenge: "${challenge.title}"`,
      'Government Officer',
      'Evaluation Committee'
    );
    addNotification(
      'Startup Shortlisted',
      `${startup.name} was shortlisted for ${challenge.title}.`,
      'application'
    );
    addToast('success', 'Startup Shortlisted', `${startup.name} shortlisted for pilot evaluation.`);
  };

  /* =========================================================
     RESET DEMO DATA
  ========================================================= */

  const resetDemoData = () => {

    localStorage.removeItem(
      `${STORAGE_KEY_PREFIX}challenges`
    );

    localStorage.removeItem(
      `${STORAGE_KEY_PREFIX}applications`
    );

    localStorage.removeItem(
      `${STORAGE_KEY_PREFIX}evaluations`
    );

    localStorage.removeItem(
      `${STORAGE_KEY_PREFIX}pilots`
    );

    localStorage.removeItem(
      `${STORAGE_KEY_PREFIX}procurement`
    );

    localStorage.removeItem(
      `${STORAGE_KEY_PREFIX}scale_up`
    );

    localStorage.removeItem(
      `${STORAGE_KEY_PREFIX}audit_logs`
    );

    localStorage.removeItem(
      `${STORAGE_KEY_PREFIX}notifications`
    );

    setChallenges(
      INITIAL_CHALLENGES
    );

    setApplications(
      INITIAL_APPLICATIONS
    );

    setEvaluations(
      INITIAL_EVALUATIONS
    );

    setPilots(
      INITIAL_PILOTS
    );

    setProcurementContracts(
      INITIAL_PROCUREMENT
    );

    setScaleUpPlan(
      INITIAL_SCALE_UP
    );

    setAuditLogs(
      INITIAL_AUDIT_LOGS
    );

    setNotifications(
      INITIAL_NOTIFICATIONS
    );

    addToast(
      'info',
      'Demo Data Reset',
      'Default unified demo state restored.'
    );
  };


  /* =========================================================
     PROVIDER
  ========================================================= */

  return (
    <PragatiContext.Provider
      value={{

        currentRole,
        setCurrentRole,

        challenges,
        startups,
        applications,
        evaluations,
        pilots,
        procurementContracts,
        scaleUpPlan,
        scaleUpPlans,
        impactRecords,
        auditLogs,
        notifications,

        toasts,

        addToast,
        removeToast,

        createChallenge,
        publishChallenge,

        applyForChallenge,
        submitEvaluation,

        startPilot,
        createPilotProject,
        updatePilotStatus,
        recordKPIMeasurement,
        updateValidationDecision,

        releaseProcurementMilestone,
        createProcurementContract,
        updateProcurementStatus,
        advanceScaleUpPhase,
        createScaleUpPlan,
        updateScaleUpPlan,
        submitScaleUpPlan,
        approveScaleUpPlan,
        activateScaleUpPlan,
        completeScaleUpPlan,

        createImpactRecord,
        updateImpactRecord,
        submitImpactReport,
        verifyImpactReport,
        rejectImpactReport,

        markNotificationRead,
        markAllNotificationsRead,

        deleteChallenge,
        registerStartup,
        shortlistStartup,
        resetDemoData

      }}
    >
      {children}
    </PragatiContext.Provider>
  );
};


/* =========================================================
   HOOK
========================================================= */

export const usePragati = () => {

  const context =
    useContext(PragatiContext);

  if (!context) {
    throw new Error(
      'usePragati must be used within a PragatiProvider'
    );
  }

  return context;
};