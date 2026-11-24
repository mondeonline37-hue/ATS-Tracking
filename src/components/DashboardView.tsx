import React from 'react';
import {
  Building2,
  FileCheck2,
  FileSignature,
  GraduationCap,
  IdCard,
  ReceiptText,
  UserCheck,
} from 'lucide-react';
import { Candidate, TabId, TalentRequest } from '../types/ta';
import { CandidateCommBadge } from './BadgeHelpers';

interface DashboardViewProps {
  requests: TalentRequest[];
  candidates: Candidate[];
  onSwitchTab: (tab: TabId) => void;
  onViewRequest: (id: string) => void;
  onViewCandidate: (id: string) => void;
}

export function DashboardView({
  requests,
  candidates,
  onSwitchTab,
  onViewRequest,
  onViewCandidate,
}: DashboardViewProps) {
  return (
    <section aria-label="Dashboard overview" className="p-6 space-y-6">
      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide">
              Total eTRF Requests
            </p>
            <h3
              data-testid="stat-total-etrf"
              className="text-3xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white mt-1"
            >
              {requests.length}
            </h3>
            <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-1.5 inline-flex items-center gap-1">
              <FileCheck2 className="w-3.5 h-3.5" />
              Registered Requests
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center">
            <FileSignature className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide">
              Active Open Positions
            </p>
            <h3
              data-testid="stat-active-positions"
              className="text-3xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white mt-1"
            >
              {requests.length}
            </h3>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1.5 inline-flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              Across Companies
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/60 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide">
              Candidate Profiles
            </p>
            <h3
              data-testid="stat-total-candidates"
              className="text-3xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white mt-1"
            >
              {candidates.length}
            </h3>
            <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-1.5 inline-flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" />
              Enrolled Candidates
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/60 flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Split Recent Records View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Recent eTRFs Widget */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <ReceiptText className="w-4 h-4 text-blue-500" />
              Recent Talent Requests
            </h3>
            <button
              type="button"
              onClick={() => onSwitchTab('requests')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap"
            >
              View All
            </button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 flex-1 overflow-y-auto max-h-[360px] pt-2">
            {requests.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">No eTRF requests found.</div>
            ) : (
              requests.slice(0, 5).map((req) => (
                <div key={req.id} className="py-3 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => onViewRequest(req.id)}
                    className="text-left group min-w-0 flex-1"
                  >
                    <span className="font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400 group-hover:underline">
                      {req.etrfNumber}
                    </span>
                    <div className="font-bold text-slate-800 dark:text-white text-xs group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                      {req.position}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {req.sbu ? `${req.sbu} · ` : ''}
                      {req.company} · {req.location}
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => onViewRequest(req.id)}
                    aria-label={`View eTRF ${req.etrfNumber}`}
                    className="px-3 py-1.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-lg transition-colors shrink-0 whitespace-nowrap"
                  >
                    View
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Candidates Widget */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <IdCard className="w-4 h-4 text-emerald-500" />
              Recent Candidates
            </h3>
            <button
              type="button"
              onClick={() => onSwitchTab('candidates')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline whitespace-nowrap"
            >
              View Directory
            </button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 flex-1 overflow-y-auto max-h-[360px] pt-2">
            {candidates.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                No candidate profiles found.
              </div>
            ) : (
              candidates.slice(0, 5).map((cand) => (
                <div key={cand.id} className="py-3 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => onViewCandidate(cand.id)}
                    className="text-left group min-w-0 flex-1"
                  >
                    <div className="font-bold text-slate-800 dark:text-white text-xs group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                      {cand.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {cand.degree || 'Applicant'} · {cand.appSource || 'Direct'}
                    </div>
                  </button>
                  <div className="flex items-center gap-2 shrink-0">
                    <CandidateCommBadge comm={cand.commAssessment} />
                    <button
                      type="button"
                      onClick={() => onViewCandidate(cand.id)}
                      aria-label={`View details for ${cand.name}`}
                      className="px-3 py-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-lg transition-colors whitespace-nowrap"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
