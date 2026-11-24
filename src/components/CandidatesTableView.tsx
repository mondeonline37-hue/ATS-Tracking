import React from 'react';
import { Copy, Eye, Pencil, Trash2, UserPlus } from 'lucide-react';
import { APP_SOURCES } from '../data/constants';
import { Candidate, TalentRequest } from '../types/ta';
import {
  calculateIcbiSummary,
  formatIcbiResultLabel,
  resolveCandidateRoleContext,
} from '../utils/taLogic';
import { CandidateCommBadge } from './BadgeHelpers';

interface CandidatesTableViewProps {
  candidates: Candidate[];
  requests: TalentRequest[];
  assignFilter: string;
  sourceFilter: string;
  onAssignFilterChange: (value: string) => void;
  onSourceFilterChange: (value: string) => void;
  onCreateCandidate: () => void;
  onViewCandidate: (id: string) => void;
  onEditCandidate: (id: string) => void;
  onDuplicateCandidate: (id: string) => void;
  onDeleteCandidate: (id: string) => void;
  onViewRequest: (id: string) => void;
}

export function CandidatesTableView({
  candidates,
  requests,
  assignFilter,
  sourceFilter,
  onAssignFilterChange,
  onSourceFilterChange,
  onCreateCandidate,
  onViewCandidate,
  onEditCandidate,
  onDuplicateCandidate,
  onDeleteCandidate,
  onViewRequest,
}: CandidatesTableViewProps) {
  return (
    <section aria-label="Candidate Directory" className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Filter Candidates:
          </span>
          <label htmlFor="filter-cand-assignment" className="sr-only">
            Filter by assignment status
          </label>
          <select
            id="filter-cand-assignment"
            value={assignFilter}
            onChange={(e) => onAssignFilterChange(e.target.value)}
            className="text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Candidates</option>
            <option value="ASSIGNED">Assigned to eTRF</option>
            <option value="UNASSIGNED">Unassigned Pool</option>
          </select>

          <label htmlFor="filter-cand-source" className="sr-only">
            Filter by application source
          </label>
          <select
            id="filter-cand-source"
            value={sourceFilter}
            onChange={(e) => onSourceFilterChange(e.target.value)}
            className="text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Sources</option>
            {APP_SOURCES.map((src) => (
              <option key={src} value={src}>
                {src}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={onCreateCandidate}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Candidate Profile</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wide">
                <th className="px-6 py-3.5">Candidate &amp; Contact</th>
                <th className="px-6 py-3.5">Source &amp; Relocation</th>
                <th className="px-6 py-3.5">Academic Degree</th>
                <th className="px-6 py-3.5">Assigned eTRF / Position</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {candidates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                    <p className="mb-3">No matching candidates found.</p>
                    <button
                      type="button"
                      onClick={onCreateCandidate}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                    >
                      Add First Candidate
                    </button>
                  </td>
                </tr>
              ) : (
                candidates.map((cand) => {
                  const linkedReq = requests.find((r) => r.id === cand.etrfId);
                  const roleContext = resolveCandidateRoleContext(cand, requests);
                  const icbiSummary = cand.icbiAssessment
                    ? calculateIcbiSummary(cand.icbiAssessment, roleContext.jobLevelLabel)
                    : null;
                  return (
                    <tr
                      key={cand.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => onViewCandidate(cand.id)}
                          className="text-left group"
                        >
                          <div className="font-bold text-slate-900 dark:text-white text-xs group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {cand.name}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {cand.email}
                            {cand.phone ? ` · ${cand.phone}` : ''}
                          </div>
                        </button>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          <CandidateCommBadge comm={cand.commAssessment} />
                          {icbiSummary && icbiSummary.overallScore !== null && (
                            <span
                              className={`text-[11px] font-mono tabular-nums font-semibold ${
                                icbiSummary.effectiveResultStatus === 'Pass'
                                  ? 'text-emerald-700 dark:text-emerald-400'
                                  : icbiSummary.effectiveResultStatus === 'Failed'
                                    ? 'text-red-600 dark:text-red-400'
                                    : 'text-slate-600 dark:text-slate-300'
                              }`}
                            >
                              · iCBI {icbiSummary.overallScoreFormatted}/5.00 (
                              {formatIcbiResultLabel(icbiSummary)})
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {cand.appSource || 'Direct'}
                        </span>
                        <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                          {cand.industry || 'General Industry'}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {cand.relocation || 'Not specified'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {cand.degree || 'N/A'}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {cand.school || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {linkedReq ? (
                          <button
                            type="button"
                            onClick={() => onViewRequest(linkedReq.id)}
                            className="text-left group"
                          >
                            <span className="font-mono text-[11px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 rounded group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                              {linkedReq.etrfNumber}
                            </span>
                            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {cand.appliedPosition?.trim() || linkedReq.position}
                            </div>
                          </button>
                        ) : (
                          <div>
                            <span className="text-slate-400 italic text-xs">Unassigned Pool</span>
                            {cand.appliedPosition?.trim() && (
                              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                                {cand.appliedPosition.trim()}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => onViewCandidate(cand.id)}
                            aria-label={`View profile for ${cand.name}`}
                            title="View Profile"
                            className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onEditCandidate(cand.id)}
                            aria-label={`Edit profile for ${cand.name}`}
                            title="Edit Profile"
                            className="p-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDuplicateCandidate(cand.id)}
                            aria-label={`Duplicate profile for ${cand.name}`}
                            title="Duplicate Profile"
                            className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteCandidate(cand.id)}
                            aria-label={`Delete candidate ${cand.name}`}
                            title="Delete Candidate"
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
