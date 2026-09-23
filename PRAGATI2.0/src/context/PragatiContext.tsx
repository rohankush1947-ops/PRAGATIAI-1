import { api } from "../services/api";
import React, { createContext, useContext, useState, useEffect } from 'react';

import {
  UserRole,
  Challenge,
  Startup,
  Application,
  ExpertEvaluation,
  PilotProject,
  ProcurementContract,
  ScaleUpPlan,
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

  updateValidationDecision: (
    pilotId: string,
    decision: 'Scale' | 'Modify' | 'Stop' | 'Continue Pilot',
    remarks: string
  ) => void;

  releaseProcurementMilestone: (
  contractId: string,
  milestoneNumber: number
) => Promise<void>;

  advanceScaleUpPhase: (phaseNumber: string) => Promise<void>;

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
     Still local/demo data for now.
  ========================================================= */

 const [startups, setStartups] =
  useState<Startup[]>(MOCK_STARTUPS);

  useEffect(() => {
  const loadStartups = async () => {
    try {
      const data = await api.getStartups();
      setStartups(data);
    } catch (error) {
      console.error(
        'Failed to load startups:',
        error
      );
    }
  };

  loadStartups();
}, []);


  /* =========================================================
     APPLICATIONS
     Still local/demo data for now.
  ========================================================= */

 const [applications, setApplications] =
  useState<Application[]>(INITIAL_APPLICATIONS);

  /* =========================================================
     EVALUATIONS
  ========================================================= */

  const [evaluations, setEvaluations] =
  useState<ExpertEvaluation[]>(INITIAL_EVALUATIONS);

  useEffect(() => {
  const loadEvaluations = async () => {
    try {
      const data = await api.getEvaluations();
      setEvaluations(data);
    } catch (error) {
      console.error('Failed to load evaluations:', error);
    }
  };

  loadEvaluations();
}, []);


  /* =========================================================
     PILOTS
  ========================================================= */

 const [pilots, setPilots] =
  useState<PilotProject[]>(INITIAL_PILOTS);

  useEffect(() => {
  const loadPilots = async () => {
    try {
      const data = await api.getPilots();
      setPilots(data);
    } catch (error) {
      console.error(
        'Failed to load pilots:',
        error
      );
    }
  };

  loadPilots();
}, []);

  /* =========================================================
     PROCUREMENT
  ========================================================= */

  const [procurementContracts, setProcurementContracts] =
    useState<ProcurementContract[]>(INITIAL_PROCUREMENT);

  useEffect(() => {
    const loadProcurement = async () => {
      try {
        const data = await api.getProcurement();
        setProcurementContracts(data);
      } catch (error) {
        console.error(
          'Failed to load procurement contracts:',
          error
        );
      }
    };

    loadProcurement();
  }, []);

  useEffect(() => {
  const loadScaleUp = async () => {
    try {
      const data = await api.getScaleUp();
      setScaleUpPlan(data);
    } catch (error) {
      console.error(
        'Failed to load scale-up plan:',
        error
      );
    }
  };

  loadScaleUp();
}, []);

useEffect(() => {
  const loadAuditLogs = async () => {
    try {
      const data = await api.getAuditLogs();
      setAuditLogs(data);
    } catch (error) {
      console.error(
        'Failed to load audit logs:',
        error
      );
    }
  };

  loadAuditLogs();
}, []);

useEffect(() => {
  const loadNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error(
        'Failed to load notifications:',
        error
      );
    }
  };

  loadNotifications();
}, []);

  /* =========================================================
     SCALE-UP
  ========================================================= */

  const [scaleUpPlan, setScaleUpPlan] =
  useState<ScaleUpPlan>(INITIAL_SCALE_UP);


  /* =========================================================
     AUDIT LOGS
  ========================================================= */

const [auditLogs, setAuditLogs] =
  useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  /* =========================================================
     NOTIFICATIONS
  ========================================================= */

  const [notifications, setNotifications] =
  useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  const [toasts, setToasts] =
  useState<ToastMessage[]>([]);


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
      status: 'In Progress',
      progressPercent: 15,
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
     VALIDATION DECISION
  ========================================================= */

 const updateValidationDecision = async (
  pilotId: string,
  decision:
    | 'Scale'
    | 'Modify'
    | 'Stop'
    | 'Continue Pilot',
  remarks: string
): Promise<void> => {
  try {
    const updatedPilot =
      await api.recordValidationDecision(
        pilotId,
        decision,
        remarks
      );

    setPilots(prev =>
      prev.map(p =>
        p.id === pilotId
          ? updatedPilot
          : p
      )
    );

    const pilot = pilots.find(
      p => p.id === pilotId
    );

    if (pilot) {
      if (decision === 'Scale') {
        setChallenges(prev =>
          prev.map(c =>
            c.id === pilot.challengeId
              ? {
                  ...c,
                  status: 'Scaled'
                }
              : c
          )
        );

        setApplications(prev =>
          prev.map(a =>
            a.startupId === pilot.startupId &&
            a.challengeId === pilot.challengeId
              ? {
                  ...a,
                  status: 'Validated'
                }
              : a
          )
        );
      }

      addAuditLog(
        'Pilot Validation Decision Logged',
        `Decision "${decision.toUpperCase()}" authorized for ${pilot.startupName}. Remarks: ${remarks}`,
        'Government Officer',
        'Chief Engineer PWD'
      );

      addNotification(
        'Pilot Validation Decision',
        `Authorized decision: ${decision.toUpperCase()} for ${pilot.startupName}`,
        'validation'
      );

      addToast(
        decision === 'Scale'
          ? 'success'
          : 'info',
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
      setPilots(prev =>
        prev.map(p =>
          p.id === pilotId
            ? { 
                ...p, 
                validationDecision: decision, 
                validationRemarks: remarks, 
                decisionDate: new Date().toISOString().split('T')[0],
                status: decision === 'Scale' ? ('Scale Approved' as const) : ('In Progress' as const) 
              }
            : p
        )
      );

      if (decision === 'Scale') {
        setChallenges(prev =>
          prev.map(c =>
            c.id === pilot.challengeId
              ? {
                  ...c,
                  status: 'Scaled'
                }
              : c
          )
        );

        setApplications(prev =>
          prev.map(a =>
            a.startupId === pilot.startupId &&
            a.challengeId === pilot.challengeId
              ? {
                  ...a,
                  status: 'Validated'
                }
              : a
          )
        );
      }

      addAuditLog(
        'Pilot Validation Decision Logged',
        `Decision "${decision.toUpperCase()}" authorized for ${pilot.startupName}. Remarks: ${remarks}`,
        'Government Officer',
        'Chief Engineer PWD'
      );

      addNotification(
        'Pilot Validation Decision',
        `Authorized decision: ${decision.toUpperCase()} for ${pilot.startupName}`,
        'validation'
      );

      addToast(
        decision === 'Scale'
          ? 'success'
          : 'info',
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


  /* =========================================================
     SCALE-UP
  ========================================================= */

 const advanceScaleUpPhase = async (
  phaseNumber: string
): Promise<void> => {
  try {
    const updatedPlan =
      await api.advanceScaleUpPhase(phaseNumber);

    setScaleUpPlan(updatedPlan);

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
        updateValidationDecision,

        releaseProcurementMilestone,
        advanceScaleUpPhase,

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