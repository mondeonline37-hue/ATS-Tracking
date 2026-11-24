import React from 'react';
import { Headset, Pencil, ShieldCheck, UserCheck, X } from 'lucide-react';
import { TalentRequest } from '../types/ta';
import { getEtrfHierarchyLabels } from '../utils/taLogic';
import { JobLevelBadge } from './BadgeHelpers';

interface ViewEtrfModalProps {
  request: TalentRequest | null;
  onClose: () => void;
  onEdit: (id: string) => void;
}

export function ViewEtrfModal({ request, onClose, onEdit }: ViewEtrfModalProps) {
  if (!request) return null;
  const hierarchyLabels = getEtrfHierarchyLabels(request.sbu);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="view-etrf-title"
      className="fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-xl overflow-hidden">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="min-w-0">
            <span className="font-mono text-xs font-bold text-blue-400">{request.etrfNumber}</span>
            <h3 id="view-etrf-title" className="text-base font-bold text-white truncate">
              {request.position}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close eTRF details modal"
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800 gap-2">
            <p className="text-slate-600 dark:text-slate-300 font-medium">
              {request.sbu ? `SBU: ${request.sbu} · ` : ''}
              {request.company} · {request.department}
            </p>
            <JobLevelBadge level={request.jobLevel} />
          </div>

          <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-slate-400 font-semibold block text-[11px]">Location</span>
              <strong className="text-slate-900 dark:text-slate-100">{request.location}</strong>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block text-[11px]">
                Work Arrangement
              </span>
              <strong className="text-slate-900 dark:text-slate-100">
                {request.workArrangement || 'On-Site'}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block text-[11px]">
                Date Requested
              </span>
              <strong className="font-mono tabular-nums text-slate-900 dark:text-slate-100">
                {request.dateRequested}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block text-[11px]">Salary Grade</span>
              <strong className="tabular-nums text-slate-900 dark:text-slate-100">
                {request.salaryGrade}{' '}
                {request.negotiable && request.maxSalary ? `(Nego up to ${request.maxSalary})` : ''}
              </strong>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-xs text-slate-500 dark:text-slate-400 mb-2">
              Approval &amp; Hierarchy
            </h4>
            <div className="space-y-2 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              {request.storeManager && (
                <div className="text-slate-900 dark:text-slate-100 text-xs flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">
                    {request.storeManager}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    ({hierarchyLabels.firstLevelLabel})
                  </span>
                </div>
              )}
              {request.areaManager && (
                <div className="text-slate-900 dark:text-slate-100 text-xs flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span className="font-bold text-blue-700 dark:text-blue-300">
                    {request.areaManager}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    ({hierarchyLabels.secondLevelLabel})
                  </span>
                </div>
              )}
              {request.hrbp && (
                <div className="text-slate-600 dark:text-slate-300 text-xs flex items-center gap-2">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>{request.hrbp}</span>
                  <span className="text-[11px] text-slate-400">(HRBP)</span>
                </div>
              )}
              {request.srHrbp && (
                <div className="text-slate-600 dark:text-slate-300 text-xs flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>{request.srHrbp}</span>
                  <span className="text-[11px] text-slate-400">(Sr HRBP)</span>
                </div>
              )}
              {request.hrOps && (
                <div className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-2">
                  <Headset className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{request.hrOps}</span>
                  <span className="text-[11px] text-slate-400">(HROps)</span>
                </div>
              )}
              {!request.areaManager &&
                !request.storeManager &&
                !request.hrbp &&
                !request.srHrbp &&
                !request.hrOps && (
                  <p className="text-slate-400 italic">No hierarchy details recorded.</p>
                )}
            </div>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/80 px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(request.id);
            }}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit Request
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
