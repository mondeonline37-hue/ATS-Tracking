import React, { useEffect, useRef } from 'react';
import {
  Bold,
  CheckCircle2,
  ClipboardList,
  Italic,
  List,
  ListOrdered,
  Lock,
  RemoveFormatting,
  RotateCcw,
  ShieldCheck,
  SquarePen,
  Strikethrough,
  Underline,
  Unlock,
  XCircle,
} from 'lucide-react';
import { ICBI_JOB_LEVELS } from '../data/constants';
import {
  IcbiAssessment,
  IcbiJobLevel,
  IcbiSubDomainKey,
} from '../types/ta';
import {
  calculateIcbiSummary,
  CandidateRoleContext,
  formatIcbiResultLabel,
  getIcbiDomainsForLevel,
  normalizeIcbiAssessment,
  sanitizeNotesHtml,
} from '../utils/taLogic';

interface IcbiMatrixSectionProps {
  assessment?: IcbiAssessment;
  roleContext: CandidateRoleContext;
  onChange: (next: IcbiAssessment) => void;
  showSaveButton?: boolean;
  isDirty?: boolean;
  onSaveClick?: () => void;
}

const RATING_SCALE = [1, 2, 3, 4, 5] as const;

export function IcbiMatrixSection({
  assessment,
  roleContext,
  onChange,
  showSaveButton = false,
  isDirty = false,
  onSaveClick,
}: IcbiMatrixSectionProps) {
  const normalized = normalizeIcbiAssessment(assessment);
  const summary = calculateIcbiSummary(normalized, roleContext.jobLevelLabel);
  const effectiveLevel = summary.effectiveLevel;
  const activeDomains = getIcbiDomainsForLevel(effectiveLevel);
  const isJobLevelLocked = normalized.jobLevelLocked ?? true;
  const isOverridden = Boolean(
    normalized.selectedJobLevel && normalized.selectedJobLevel !== roleContext.jobLevelLabel
  );

  const remarksEditorRef = useRef<HTMLDivElement | null>(null);
  const lastEmittedRemarksRef = useRef<string>(normalized.remarks || '');
  const waiverEnabled = Boolean(normalized.waiverEnabled);

  // Keep contentEditable remarks editor synced when assessment resets or candidate changes
  useEffect(() => {
    const incoming = normalized.remarks || '';
    if (
      remarksEditorRef.current &&
      incoming !== lastEmittedRemarksRef.current
    ) {
      remarksEditorRef.current.innerHTML = incoming;
      lastEmittedRemarksRef.current = incoming;
    }
  }, [normalized.remarks]);

  // Initialize editor DOM on mount
  useEffect(() => {
    const incoming = normalized.remarks || '';
    if (remarksEditorRef.current && remarksEditorRef.current.innerHTML !== incoming) {
      remarksEditorRef.current.innerHTML = incoming;
      lastEmittedRemarksRef.current = incoming;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleLock = () => {
    onChange({
      ...normalized,
      jobLevelLocked: !isJobLevelLocked,
    });
  };

  const handleJobLevelSelect = (level: IcbiJobLevel) => {
    if (isJobLevelLocked) return;
    onChange({
      ...normalized,
      selectedJobLevel: level === roleContext.jobLevelLabel ? undefined : level,
    });
  };

  const handleResetToProfileLevel = () => {
    if (isJobLevelLocked) return;
    const { selectedJobLevel: _unused, ...rest } = normalized;
    onChange(rest);
  };

  const handleRatingChange = (key: IcbiSubDomainKey, rating: number | null) => {
    const next: IcbiAssessment = {
      ...normalized,
      scores: {
        ...normalized.scores,
        [key]: {
          ...normalized.scores[key],
          rating,
        },
      },
    };
    onChange(next);
  };

  const handleWaiverToggle = (enabled: boolean) => {
    onChange({
      ...normalized,
      waiverEnabled: enabled,
    });
  };

  const emitRemarksHtml = (rawHtml: string) => {
    const cleaned = sanitizeNotesHtml(rawHtml);
    lastEmittedRemarksRef.current = cleaned;
    onChange({
      ...normalized,
      remarks: cleaned,
    });
  };

  const formatRemark = (command: string) => {
    if (remarksEditorRef.current) {
      remarksEditorRef.current.focus();
    }
    document.execCommand(command, false);
    if (remarksEditorRef.current) {
      emitRemarksHtml(remarksEditorRef.current.innerHTML);
    }
  };

  const resultBadgeText = formatIcbiResultLabel(summary);

  return (
    <div className="space-y-5" data-testid="icbi-matrix-section">
      {/* Header Context & Weighted Total */}
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-700/80">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              iCBI Matrix
            </h4>
          </div>

          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800 shrink-0">
            <label
              htmlFor="icbi-waiver-toggle"
              className="text-[11px] font-bold text-slate-800 dark:text-slate-200 cursor-pointer whitespace-nowrap"
            >
              iCBI Rating Waiver
            </label>
            <label className="relative inline-flex items-center cursor-pointer w-9 h-5 shrink-0">
              <input
                id="icbi-waiver-toggle"
                type="checkbox"
                checked={waiverEnabled}
                onChange={(e) => handleWaiverToggle(e.target.checked)}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10 peer"
              />
              <div className="pointer-events-none w-9 h-5 bg-slate-300 dark:bg-slate-700 rounded-full peer peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
            </label>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            {/* Job Level Segmented Toggle + Lock Control */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">Job Level:</span>
                <div
                  role="group"
                  aria-label="Job Level matrix toggle"
                  className={`inline-flex flex-wrap items-center gap-1 p-1 rounded-xl border transition-opacity ${
                    isJobLevelLocked
                      ? 'bg-slate-200/50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                      : 'bg-slate-200/80 dark:bg-slate-900 border-slate-300/70 dark:border-slate-700'
                  }`}
                >
                  {ICBI_JOB_LEVELS.map((lvl) => {
                    const active = effectiveLevel === lvl;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        disabled={isJobLevelLocked}
                        onClick={() => handleJobLevelSelect(lvl)}
                        aria-pressed={active}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                          active
                            ? 'bg-blue-600 text-white shadow-sm'
                            : isJobLevelLocked
                              ? 'text-slate-400 dark:text-slate-500 cursor-not-allowed'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-800'
                        }`}
                      >
                        {lvl}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleToggleLock}
                  aria-pressed={isJobLevelLocked}
                  aria-label={isJobLevelLocked ? 'Unlock job level' : 'Lock job level'}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                    isJobLevelLocked
                      ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                      : 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/60'
                  }`}
                >
                  {isJobLevelLocked ? (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Locked</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Unlocked</span>
                    </>
                  )}
                </button>

                <span data-testid="icbi-job-level" className="sr-only">
                  {effectiveLevel}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Position: </span>
                  <strong
                    data-testid="icbi-position"
                    className="font-bold text-slate-900 dark:text-white"
                  >
                    {roleContext.positionLabel}
                  </strong>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Profile Level: {roleContext.jobLevelLabel} ({roleContext.sourceLabel}
                  {roleContext.etrfNumber ? ` · ${roleContext.etrfNumber}` : ''})
                </span>
                {isOverridden && !isJobLevelLocked && (
                  <button
                    type="button"
                    onClick={handleResetToProfileLevel}
                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 whitespace-nowrap shrink-0"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset to Profile ({roleContext.jobLevelLabel})</span>
                  </button>
                )}
              </div>

            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 md:text-right shrink-0">
            <div>
              <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Overall Weighted Score
              </span>
              <div className="flex items-baseline md:justify-end gap-2">
                <span
                  data-testid="icbi-overall-score"
                  className="text-2xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white"
                >
                  {summary.overallScoreFormatted}
                </span>
                <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                  / 5.00{summary.overallPercent !== null ? ` (${summary.overallPercent}%)` : ''}
                </span>
              </div>
              <div
                className={`text-xs font-bold inline-flex items-center gap-1 mt-0.5 ${
                  summary.effectiveResultStatus === 'Failed'
                    ? 'text-red-600 dark:text-red-400'
                    : summary.bandTone === 'emerald'
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : summary.bandTone === 'blue'
                        ? 'text-blue-700 dark:text-blue-400'
                        : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {summary.effectiveResultStatus === 'Failed' ? (
                  <XCircle className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                )}
                <span>{resultBadgeText}</span>
                <span className="text-[11px] font-normal font-mono tabular-nums text-slate-500 dark:text-slate-400">
                  · {summary.ratedSubDomains}/{summary.totalSubDomains} rated
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3-Domain Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-slate-200 dark:bg-slate-700 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
          {activeDomains.map((domain) => {
            const domainStat = summary.domains[domain.key];
            return (
              <div
                key={domain.key}
                className="bg-white dark:bg-slate-900 px-3.5 py-2.5 flex items-center justify-between gap-2"
              >
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  {domain.title}
                </span>
                <span
                  data-testid={`icbi-summary-avg-${domain.key}`}
                  className="text-xs font-mono tabular-nums font-bold text-slate-900 dark:text-white whitespace-nowrap"
                >
                  {domainStat.averageFormatted} · {domain.weightPercent}%
                </span>
              </div>
            );
          })}
        </div>

        {showSaveButton && onSaveClick && (
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={onSaveClick}
              disabled={!isDirty}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                isDirty
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed'
              }`}
            >
              {isDirty ? 'Save iCBI Matrix' : 'iCBI Matrix Saved'}
            </button>
          </div>
        )}
      </div>

      {/* Domain Sections */}
      {activeDomains.map((domain) => {
        const domainStat = summary.domains[domain.key];
        return (
          <div
            key={domain.key}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900"
          >
            {/* Domain Header */}
            <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                {domain.title}
              </h5>
              <div
                data-testid={`icbi-domain-avg-${domain.key}`}
                className="text-xs font-semibold font-mono tabular-nums text-slate-700 dark:text-slate-200"
              >
                Domain avg {domainStat.averageFormatted} · weight {domain.weightPercent}%
              </div>
            </div>

            {/* Sub-Domains */}
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {domain.subDomains.map((sub) => {
                const subScore = normalized.scores[sub.key];
                const activeRating =
                  typeof subScore.rating === 'number'
                    ? (subScore.rating as 1 | 2 | 3 | 4 | 5)
                    : null;

                return (
                  <div key={sub.key} className="p-4 space-y-3">
                    {/* Sub-Domain Row Header + 1-5 Matrix Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          {sub.title}
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                          <strong className="text-slate-900 dark:text-slate-100">Ask: </strong>
                          {sub.ask}
                        </p>
                      </div>

                      <div className="shrink-0 space-y-1">
                        <div className="flex items-center justify-between sm:justify-end gap-2">
                          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                            Rating (1–5)
                          </span>
                          {activeRating !== null && (
                            <button
                              type="button"
                              onClick={() => handleRatingChange(sub.key, null)}
                              aria-label={`Clear rating for ${sub.title}`}
                              className="text-[10px] font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 underline"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                        <div
                          role="group"
                          aria-label={`${sub.title} rating scale 1 to 5`}
                          className="inline-flex items-center gap-1.5"
                        >
                          {RATING_SCALE.map((r) => {
                            const selected = activeRating === r;
                            return (
                              <button
                                key={r}
                                type="button"
                                onClick={() => handleRatingChange(sub.key, r)}
                                aria-label={`Rate ${sub.title} ${r} out of 5`}
                                aria-pressed={selected}
                                className={`w-9 h-9 rounded-lg font-mono tabular-nums text-xs font-bold border transition-colors ${
                                  selected
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                                }`}
                              >
                                {r}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Corresponding Official LCC Definition */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        Official LCC definition
                      </div>
                      {activeRating !== null ? (
                        <div
                          data-testid={`icbi-descriptor-${sub.key}`}
                          className="rounded-xl border border-blue-200 dark:border-blue-800/70 bg-blue-50/70 dark:bg-blue-950/40 px-3.5 py-2.5 text-xs flex items-start gap-3 text-slate-900 dark:text-white"
                        >
                          <span className="font-mono tabular-nums font-bold text-blue-700 dark:text-blue-300 w-5 shrink-0">
                            {activeRating}
                          </span>
                          <span className="flex-1 leading-snug font-medium">
                            {sub.definitions[activeRating]}
                          </span>
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 italic px-1">
                          Select a rating (1–5) above to view its Official LCC definition.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Bottom iCBI Rating Score, System Decision & Rich Remarks Box */}
      <div
        data-testid="icbi-remarks-section"
        className="rounded-2xl border border-blue-200 dark:border-blue-900/70 bg-slate-50 dark:bg-slate-800/50 p-4 space-y-4"
      >
        <div className="pb-3 border-b border-slate-200 dark:border-slate-700">
          <h5 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <SquarePen className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>iCBI Final Rating &amp; Interviewer Remarks</span>
          </h5>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Pass/Failed decision and grade remark are automatically determined from domain scores.
          </p>
        </div>

        {/* Non-Editable System-Decided Result & Grade Remark */}
        <div
          data-testid="icbi-system-decision"
          className={`rounded-xl border p-3.5 space-y-2 ${
            summary.effectiveResultStatus === 'Pass'
              ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/70'
              : summary.effectiveResultStatus === 'Failed'
                ? 'bg-red-50/70 dark:bg-red-950/30 border-red-200 dark:border-red-800/70'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <span className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                  Rating Score
                </span>
                <span
                  data-testid="icbi-remarks-score"
                  className="font-mono tabular-nums text-base font-extrabold text-slate-900 dark:text-white"
                >
                  {summary.overallScoreFormatted} / 5.00
                  {summary.overallPercent !== null ? ` (${summary.overallPercent}%)` : ''}
                </span>
              </div>

              <div className="h-7 w-[1px] bg-slate-300 dark:bg-slate-700 hidden sm:block" />

              <div>
                <span className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                  Lowest Sub-Domain
                </span>
                <span
                  data-testid="icbi-min-rating"
                  className="font-mono tabular-nums text-xs font-bold text-slate-800 dark:text-slate-200"
                >
                  {summary.minRating !== null ? `${summary.minRating} / 5` : '–'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span
                data-testid="icbi-result-badge"
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border whitespace-nowrap ${
                  summary.effectiveResultStatus === 'Pass'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800'
                    : summary.effectiveResultStatus === 'Failed'
                      ? 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/80 dark:text-red-300 dark:border-red-800'
                      : 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                }`}
              >
                {summary.effectiveResultStatus === 'Pass' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                ) : summary.effectiveResultStatus === 'Failed' ? (
                  <XCircle className="w-3.5 h-3.5 shrink-0" />
                ) : null}
                <span>{resultBadgeText}</span>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-slate-200/70 dark:border-slate-700/70">
            <p
              data-testid="icbi-grade-remark-detail"
              className="text-xs text-slate-700 dark:text-slate-200 font-medium"
            >
              {summary.gradeRemarkDetail}
            </p>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
              <ShieldCheck className="w-3 h-3" />
              System-Decided · Non-Editable
            </span>
          </div>
        </div>

        {/* Rich Text Remarks Editor */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Interviewer Remarks
            </span>
            <span className="text-[11px] text-slate-400">Rich Formatting Enabled</span>
          </div>

          <div className="border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
            <div
              role="toolbar"
              aria-label="Interviewer remarks formatting toolbar"
              className="flex flex-wrap items-center gap-1 p-1.5 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700"
            >
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  formatRemark('bold');
                }}
                aria-label="Bold interviewer remarks"
                title="Bold"
                className="p-1.5 px-2.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors text-slate-700 dark:text-slate-200"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  formatRemark('italic');
                }}
                aria-label="Italic interviewer remarks"
                title="Italic"
                className="p-1.5 px-2.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors text-slate-700 dark:text-slate-200"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  formatRemark('underline');
                }}
                aria-label="Underline interviewer remarks"
                title="Underline"
                className="p-1.5 px-2.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors text-slate-700 dark:text-slate-200"
              >
                <Underline className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  formatRemark('strikeThrough');
                }}
                aria-label="Strikethrough interviewer remarks"
                title="Strikethrough"
                className="p-1.5 px-2.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors text-slate-700 dark:text-slate-200"
              >
                <Strikethrough className="w-3.5 h-3.5" />
              </button>
              <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 mx-1" />
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  formatRemark('insertUnorderedList');
                }}
                aria-label="Bulleted list interviewer remarks"
                title="Bulleted List"
                className="p-1.5 px-2.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors text-slate-700 dark:text-slate-200"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  formatRemark('insertOrderedList');
                }}
                aria-label="Numbered list interviewer remarks"
                title="Numbered List"
                className="p-1.5 px-2.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors text-slate-700 dark:text-slate-200"
              >
                <ListOrdered className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  formatRemark('removeFormat');
                }}
                aria-label="Clear formatting interviewer remarks"
                title="Clear Formatting"
                className="p-1.5 px-2.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors text-slate-700 dark:text-slate-200"
              >
                <RemoveFormatting className="w-3.5 h-3.5" />
              </button>
            </div>

            <div
              ref={remarksEditorRef}
              contentEditable
              data-testid="icbi-remarks-editor"
              aria-label="Interviewer remarks editor"
              data-placeholder="Write overall interviewer remarks, strengths, areas of concern, and hiring recommendation..."
              onInput={(e) => emitRemarksHtml(e.currentTarget.innerHTML)}
              className="interviewer-notes-editor p-3 text-xs min-h-[120px] max-h-[260px] overflow-y-auto focus:outline-none text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 leading-relaxed"
            />
          </div>
        </div>

        {showSaveButton && onSaveClick && (
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={onSaveClick}
              disabled={!isDirty}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                isDirty
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed'
              }`}
            >
              {isDirty ? 'Save iCBI Matrix' : 'iCBI Matrix Saved'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
