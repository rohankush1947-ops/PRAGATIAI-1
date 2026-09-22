import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PragatiProvider } from './context/PragatiContext';
import { ToastContainer } from './components/common/ToastContainer';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Pages
import { LandingPage } from './pages/landing/LandingPage';
import { RoleSelectionPage } from './pages/auth/RoleSelectionPage';

// Government Pages
import { GovDashboard } from './pages/government/GovDashboard';
import { GovChallenges } from './pages/government/GovChallenges';
import { CreateChallengeWizard } from './pages/government/CreateChallengeWizard';
import { AIChallengeAssistant } from './pages/government/AIChallengeAssistant';
import { StartupDiscovery } from './pages/government/StartupDiscovery';
import { AIMatching } from './pages/government/AIMatching';
import { GovApplications } from './pages/government/GovApplications';
import { GovPilots } from './pages/government/GovPilots';
import { KPIMonitoring } from './pages/government/KPIMonitoring';
import { PilotValidation } from './pages/government/PilotValidation';
import { ProcurementContract } from './pages/government/ProcurementContract';
import { ScaleUpPlan } from './pages/government/ScaleUpPlan';
import { GovReports } from './pages/government/GovReports';
import { AuditLogView } from './pages/government/AuditLogView';
import { NotificationsView } from './pages/government/NotificationsView';

// Startup Pages
import { StartupDashboard } from './pages/startup/StartupDashboard';
import { FindChallenges } from './pages/startup/FindChallenges';
import { StartupApplicationForm } from './pages/startup/StartupApplicationForm';
import { StartupApplications } from './pages/startup/StartupApplications';
import { EligibilityScreening } from './pages/startup/EligibilityScreening';
import { StartupProfile } from './pages/startup/StartupProfile';
import { StartupPilots } from './pages/startup/StartupPilots';

// Expert Pages
import { ExpertDashboard } from './pages/expert/ExpertDashboard';
import { ExpertEvaluation } from './pages/expert/ExpertEvaluation';
import { ExpertChallenges } from './pages/expert/ExpertChallenges';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';

export const App: React.FC = () => {
  return (
    <PragatiProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Role Selection */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<RoleSelectionPage />} />

          {/* Government Portal */}
          <Route path="/government/dashboard" element={<DashboardLayout><GovDashboard /></DashboardLayout>} />
          <Route path="/government/challenges" element={<DashboardLayout><GovChallenges /></DashboardLayout>} />
          <Route path="/government/create-challenge" element={<DashboardLayout><CreateChallengeWizard /></DashboardLayout>} />
          <Route path="/government/ai-assistant" element={<DashboardLayout><AIChallengeAssistant /></DashboardLayout>} />
          <Route path="/government/discovery" element={<DashboardLayout><StartupDiscovery /></DashboardLayout>} />
          <Route path="/government/ai-matching" element={<DashboardLayout><AIMatching /></DashboardLayout>} />
          <Route path="/government/applications" element={<DashboardLayout><GovApplications /></DashboardLayout>} />
          <Route path="/government/pilots" element={<DashboardLayout><GovPilots /></DashboardLayout>} />
          <Route path="/government/kpi-monitoring" element={<DashboardLayout><KPIMonitoring /></DashboardLayout>} />
          <Route path="/government/validation" element={<DashboardLayout><PilotValidation /></DashboardLayout>} />
          <Route path="/government/procurement" element={<DashboardLayout><ProcurementContract /></DashboardLayout>} />
          <Route path="/government/scale-up" element={<DashboardLayout><ScaleUpPlan /></DashboardLayout>} />
          <Route path="/government/reports" element={<DashboardLayout><GovReports /></DashboardLayout>} />
          <Route path="/government/audit-log" element={<DashboardLayout><AuditLogView /></DashboardLayout>} />
          <Route path="/government/notifications" element={<DashboardLayout><NotificationsView /></DashboardLayout>} />

          {/* Startup Portal */}
          <Route path="/startup/dashboard" element={<DashboardLayout><StartupDashboard /></DashboardLayout>} />
          <Route path="/startup/challenges" element={<DashboardLayout><FindChallenges /></DashboardLayout>} />
          <Route path="/startup/apply/:challengeId" element={<DashboardLayout><StartupApplicationForm /></DashboardLayout>} />
          <Route path="/startup/applications" element={<DashboardLayout><StartupApplications /></DashboardLayout>} />
          <Route path="/startup/eligibility" element={<DashboardLayout><EligibilityScreening /></DashboardLayout>} />
          <Route path="/startup/profile" element={<DashboardLayout><StartupProfile /></DashboardLayout>} />
          <Route path="/startup/pilots" element={<DashboardLayout><StartupPilots /></DashboardLayout>} />
          <Route path="/startup/notifications" element={<DashboardLayout><NotificationsView /></DashboardLayout>} />

          {/* Expert Portal */}
          <Route path="/expert/dashboard" element={<DashboardLayout><ExpertDashboard /></DashboardLayout>} />
          <Route path="/expert/challenges" element={<DashboardLayout><ExpertChallenges /></DashboardLayout>} />
          <Route path="/expert/challenges/:challengeId" element={<DashboardLayout><ExpertChallenges /></DashboardLayout>} />
          <Route path="/expert/evaluate/:applicationId" element={<DashboardLayout><ExpertEvaluation /></DashboardLayout>} />
          <Route path="/expert/applications" element={<DashboardLayout><GovApplications /></DashboardLayout>} />

          {/* Admin Portal */}
          <Route path="/admin/dashboard" element={<DashboardLayout><AdminDashboard /></DashboardLayout>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global Toast Container */}
        <ToastContainer />
      </BrowserRouter>
    </PragatiProvider>
  );
};

export default App;
