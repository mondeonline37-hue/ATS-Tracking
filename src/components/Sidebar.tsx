import React from 'react';
import {
  BriefcaseBusiness,
  FilePlus2,
  FileSignature,
  GraduationCap,
  PieChart,
  RotateCcw,
  UserPlus,
  X,
} from 'lucide-react';
import { TabId } from '../types/ta';

interface SidebarProps {
  currentTab: TabId;
  requestsCount: number;
  candidatesCount: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onSwitchTab: (tab: TabId) => void;
  onOpenNewRequest: () => void;
  onOpenNewCandidate: () => void;
  onResetDemoData: () => void;
}

export function Sidebar({
  currentTab,
  requestsCount,
  candidatesCount,
  mobileOpen,
  onCloseMobile,
  onSwitchTab,
  onOpenNewRequest,
  onOpenNewCandidate,
  onResetDemoData,
}: SidebarProps) {
  const navBtnClass = (active: boolean) =>
    active
      ? 'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors text-white bg-blue-600/20 border border-blue-500/40'
      : 'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors text-slate-400 hover:bg-slate-800/70 hover:text-white border border-transparent';

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-30 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 border-r border-slate-800 z-40 transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
              <BriefcaseBusiness className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-white text-base tracking-tight leading-none whitespace-nowrap">
                TA Tracker
              </h1>
              <span className="text-[11px] font-medium text-blue-400 tracking-wide">
                Talent Acquisition
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation menu"
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-2 border-b border-slate-800/60">
          <button
            type="button"
            onClick={() => {
              onCloseMobile();
              onOpenNewRequest();
            }}
            className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center space-x-2 whitespace-nowrap"
          >
            <FilePlus2 className="w-4 h-4 shrink-0" />
            <span>Add Talent Request</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onCloseMobile();
              onOpenNewCandidate();
            }}
            className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center space-x-2 whitespace-nowrap"
          >
            <UserPlus className="w-4 h-4 shrink-0" />
            <span>Add Candidate Profile</span>
          </button>
        </div>

        <nav aria-label="Main navigation" className="p-3 space-y-1 flex-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-500 tracking-wider">
            Main Views
          </div>

          <button
            type="button"
            onClick={() => {
              onSwitchTab('dashboard');
              onCloseMobile();
            }}
            className={navBtnClass(currentTab === 'dashboard')}
          >
            <span className="flex items-center whitespace-nowrap">
              <PieChart className="w-4 h-4 mr-2.5 text-blue-400 shrink-0" />
              Dashboard
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              onSwitchTab('requests');
              onCloseMobile();
            }}
            className={navBtnClass(currentTab === 'requests')}
          >
            <span className="flex items-center whitespace-nowrap">
              <FileSignature className="w-4 h-4 mr-2.5 text-slate-400 shrink-0" />
              eTRF Talent Requests
            </span>
            <span
              data-testid="badge-requests-count"
              className="px-2 py-0.5 text-[11px] font-mono tabular-nums rounded-md bg-slate-800 text-slate-200 font-semibold border border-slate-700"
            >
              {requestsCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              onSwitchTab('candidates');
              onCloseMobile();
            }}
            className={navBtnClass(currentTab === 'candidates')}
          >
            <span className="flex items-center whitespace-nowrap">
              <GraduationCap className="w-4 h-4 mr-2.5 text-slate-400 shrink-0" />
              Candidate Directory
            </span>
            <span
              data-testid="badge-candidates-count"
              className="px-2 py-0.5 text-[11px] font-mono tabular-nums rounded-md bg-slate-800 text-slate-200 font-semibold border border-slate-700"
            >
              {candidatesCount}
            </span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 text-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2 text-[11px]">
            <span>Data Storage</span>
            <span className="font-mono text-emerald-400 font-semibold">Local Storage</span>
          </div>
          <button
            type="button"
            onClick={onResetDemoData}
            className="w-full py-2 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-medium transition-colors flex items-center justify-center space-x-1.5 whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            <span>Reset Sample Demo Data</span>
          </button>
        </div>
      </aside>
    </>
  );
}
