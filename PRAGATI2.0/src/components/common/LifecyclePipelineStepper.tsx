import React from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Search, 
  Award, 
  FileCheck, 
  Briefcase, 
  CheckSquare, 
  ShoppingCart, 
  TrendingUp, 
  ChevronRight,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

export type PipelineStage = 
  | 'create_challenge'
  | 'expert_review'
  | 'startup_apply'
  | 'expert_evaluation'
  | 'pilot_project'
  | 'validation'
  | 'procurement'
  | 'scale_up';

export interface LifecyclePipelineStepperProps {
  currentStage?: PipelineStage;
  challengeId?: string;
  challengeTitle?: string;
  compact?: boolean;
  className?: string;
}

interface StepConfig {
  id: PipelineStage;
  title: string;
  shortTitle: string;
  actor: 'Government' | 'Expert' | 'Startup';
  actorColor: string;
  route: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const STAGES: StepConfig[] = [
  {
    id: 'create_challenge',
    title: 'Create Challenge',
    shortTitle: 'Challenge',
    actor: 'Government',
    actorColor: 'bg-sky-100 text-sky-700 border-sky-300',
    route: '/government/challenges',
    icon: PlusCircle,
    description: 'Outcome-based problem RFP structured via AI'
  },
  {
    id: 'expert_review',
    title: 'Expert Review',
    shortTitle: 'Review',
    actor: 'Expert',
    actorColor: 'bg-purple-100 text-purple-700 border-purple-300',
    route: '/expert/challenges',
    icon: Award,
    description: 'Technical feasibility and rubric verification'
  },
  {
    id: 'startup_apply',
    title: 'Find & Apply',
    shortTitle: 'Enroll',
    actor: 'Startup',
    actorColor: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    route: '/startup/challenges',
    icon: Search,
    description: 'Founder discovery, eligibility screening & proposal'
  },
  {
    id: 'expert_evaluation',
    title: 'Expert Evaluation',
    shortTitle: 'Evaluation',
    actor: 'Expert',
    actorColor: 'bg-purple-100 text-purple-700 border-purple-300',
    route: '/expert/dashboard',
    icon: FileCheck,
    description: '100-pt scoring across Tech, Pilot, Scale & Domain'
  },
  {
    id: 'pilot_project',
    title: 'Pilot Project',
    shortTitle: 'Pilot',
    actor: 'Government',
    actorColor: 'bg-sky-100 text-sky-700 border-sky-300',
    route: '/government/pilots',
    icon: Briefcase,
    description: '60-90 day controlled trials & field telemetry'
  },
  {
    id: 'validation',
    title: 'KPI Validation',
    shortTitle: 'Validation',
    actor: 'Government',
    actorColor: 'bg-amber-100 text-amber-700 border-amber-300',
    route: '/government/validation',
    icon: CheckSquare,
    description: 'Committee sign-off vs target performance metrics'
  },
  {
    id: 'procurement',
    title: 'Procurement',
    shortTitle: 'Procurement',
    actor: 'Government',
    actorColor: 'bg-sky-100 text-sky-700 border-sky-300',
    route: '/government/procurement',
    icon: ShoppingCart,
    description: 'GeM direct contract and milestone escrow payouts'
  },
  {
    id: 'scale_up',
    title: 'Pan-India Scale-up',
    shortTitle: 'Scale-up',
    actor: 'Government',
    actorColor: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    route: '/government/scale-up',
    icon: TrendingUp,
    description: 'Statewide and national multi-district deployment'
  }
];

export const LifecyclePipelineStepper: React.FC<LifecyclePipelineStepperProps> = ({
  currentStage = 'create_challenge',
  challengeId,
  challengeTitle,
  compact = false,
  className = ''
}) => {
  const currentIndex = STAGES.findIndex(s => s.id === currentStage);

  return (
    <div className={`p-5 rounded-2xl bg-white border border-slate-200 shadow-sm ${className}`}>
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              PRAGATI INNOVATION LIFECYCLE
            </span>
            {challengeId && (
              <span className="text-xs text-slate-400 font-mono">
                Ref: {challengeId}
              </span>
            )}
          </div>
          {challengeTitle ? (
            <h4 className="text-sm font-bold text-slate-900 mt-1 line-clamp-1">
              {challengeTitle}
            </h4>
          ) : (
            <p className="text-xs text-slate-500 mt-1">
              End-to-End Governance: From Problem Statement to Pan-India Procurement
            </p>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-sky-500"></span> Government
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span> Expert
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Startup
          </span>
        </div>
      </div>

      {/* Stepper Scroll Container */}
      <div className="overflow-x-auto pb-2">
        <ol className="flex items-center min-w-[760px] justify-between relative">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isCompleted = idx < currentIndex;
            const isActive = idx === currentIndex;
            const isPending = idx > currentIndex;

            return (
              <li key={stage.id} className="flex-1 relative group">
                {/* Connecting Line */}
                {idx < STAGES.length - 1 && (
                  <div 
                    className={`absolute top-4 left-1/2 w-full h-0.5 -z-0 transition-colors ${
                      isCompleted ? 'bg-sky-500' : 'bg-slate-200'
                    }`}
                  />
                )}

                <Link
                  to={stage.route}
                  className="flex flex-col items-center text-center relative z-10 p-1.5 focus:outline-none"
                  title={`${stage.title} - ${stage.description}`}
                >
                  {/* Step Bubble */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isActive
                        ? 'bg-sky-600 text-white ring-4 ring-sky-100 shadow-md scale-110'
                        : isCompleted
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white border-2 border-slate-300 text-slate-400 group-hover:border-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Actor Pill */}
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border mt-2 ${stage.actorColor}`}>
                    {stage.actor}
                  </span>

                  {/* Step Title */}
                  <span
                    className={`text-[11px] font-semibold mt-1 transition-colors leading-tight ${
                      isActive
                        ? 'text-sky-700 font-bold'
                        : isCompleted
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {compact ? stage.shortTitle : stage.title}
                  </span>

                  {/* Subtitle / Status */}
                  {!compact && (
                    <span className="text-[10px] text-slate-400 mt-0.5 max-w-[90px] line-clamp-1 hidden md:block">
                      {isActive ? 'In Progress' : isCompleted ? 'Completed' : 'Pending'}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};
