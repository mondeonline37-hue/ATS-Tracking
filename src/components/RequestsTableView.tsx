import React from 'react';
import { Copy, Eye, Headset, MapPin, Pencil, Plus, Trash2, UserCheck } from 'lucide-react';
import { COMPANIES, JOB_LEVELS } from '../data/constants';
import { TalentRequest } from '../types/ta';
import { getEtrfHierarchyLabels } from '../utils/taLogic';
import { JobLevelBadge } from './BadgeHelpers';

interface RequestsTableViewProps {
  requests: TalentRequest[];
  companyFilter: string;
  levelFilter: string;
  onCompanyFilterChange: (value: string) => void;
  onLevelFilterChange: (value: string) => void;
  onCreateRequest: () => void;
  onViewRequest: (id: string) => void;
  onEditRequest: (id: string) => void;
  onDuplicateRequest: (id: string) => void;
  onDeleteRequest: (id: string) => void;
}

export function RequestsTableView({
  requests,
  companyFilter,
  levelFilter,
  onCompanyFilterChange,
  onLevelFilterChange,
  onCreateRequest,
  onViewRequest,
  onEditRequest,
  onDuplicateRequest,
  onDeleteRequest,
}: RequestsTableViewProps) {
  return (
    <section aria-label="eTRF Talent Requests" className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="filter-request-company" className="sr-only">
            Filter by company
          </label>
          <select
            id="filter-request-company"
            value={companyFilter}
            onChange={(e) => onCompanyFilterChange(e.target.value)}
            className="text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Companies</option>
            {COMPANIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <label htmlFor="filter-request-level" className="sr-only">
            Filter by job level
          </label>
          <select
            id="filter-request-level"
            value={levelFilter}
            onChange={(e) => onLevelFilterChange(e.target.value)}
            className="text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Job Levels</option>
            {JOB_LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={onCreateRequest}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New eTRF Request</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wide">
                <th className="px-6 py-3.5">eTRF No. &amp; Position</th>
                <th className="px-6 py-3.5">SBU, Company &amp; Dept</th>
                <th className="px-6 py-3.5">Arrangement &amp; Level</th>
                <th className="px-6 py-3.5">Salary Grade</th>
                <th className="px-6 py-3.5">Org Hierarchy</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                    <p className="mb-3">No matching talent requests found.</p>
                    <button
                      type="button"
                      onClick={onCreateRequest}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                    >
                      Create First eTRF Request
                    </button>
                  </td>
                </tr>
              ) : (
                requests.map((req) => {
                  const hierarchyLabels = getEtrfHierarchyLabels(req.sbu);
                  return (
                    <tr
                      key={req.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => onViewRequest(req.id)}
                          className="text-left group"
                        >
                          <span className="font-mono text-[11px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 rounded group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                            {req.etrfNumber}
                          </span>
                          <div className="font-bold text-slate-900 dark:text-white text-xs mt-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {req.position}
                          </div>
                        </button>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span>{req.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {req.sbu ? `${req.sbu} · ` : ''}
                          {req.company}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {req.department}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <JobLevelBadge level={req.jobLevel} />
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          {req.workArrangement || 'On-Site'}
                        </div>
                      </td>
                      <td className="px-6 py-4 tabular-nums">
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {req.salaryGrade}
                        </div>
                        {req.negotiable ? (
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                            Nego: up to {req.maxSalary || 'Flex'}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 block">Fixed</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-[11px]">
                        <div
                          className="text-slate-900 dark:text-slate-100 font-bold text-xs flex items-center gap-1.5"
                          title={hierarchyLabels.firstLevelLabel}
                        >
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="text-emerald-700 dark:text-emerald-300">
                            {req.storeManager || 'N/A'}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400">
                            ({hierarchyLabels.firstLevelLabel})
                          </span>
                        </div>
                        <div
                          className="text-slate-900 dark:text-slate-100 font-bold text-xs flex items-center gap-1.5 mt-0.5"
                          title={hierarchyLabels.secondLevelLabel}
                        >
                          <UserCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                          <span className="text-blue-700 dark:text-blue-300">
                            {req.areaManager || 'N/A'}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400">
                            ({hierarchyLabels.secondLevelLabel})
                          </span>
                        </div>
                        <div
                          className="text-slate-500 dark:text-slate-400 text-[11px] mt-1 flex items-center gap-1.5"
                          title="HROps"
                        >
                          <Headset className="w-3 h-3 shrink-0" />
                          <span>{req.hrOps || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => onViewRequest(req.id)}
                            aria-label={`View eTRF ${req.etrfNumber}`}
                            title="View Details"
                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onEditRequest(req.id)}
                            aria-label={`Edit eTRF ${req.etrfNumber}`}
                            title="Edit Request"
                            className="p-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDuplicateRequest(req.id)}
                            aria-label={`Duplicate eTRF ${req.etrfNumber}`}
                            title="Duplicate Request"
                            className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteRequest(req.id)}
                            aria-label={`Delete eTRF ${req.etrfNumber}`}
                            title="Delete"
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
