import React from 'react';
import { CommAssessment, JobLevel } from '../types/ta';
import { getCandidateCommBadgeMeta } from '../utils/taLogic';

export function CandidateCommBadge({ comm }: { comm?: CommAssessment }) {
  const meta = getCandidateCommBadgeMeta(comm);
  if (!meta) return null;

  const toneClasses: Record<typeof meta.tone, string> = {
    emerald:
      'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800',
    amber:
      'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800',
    red: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/70 dark:text-red-300 dark:border-red-800',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded border whitespace-nowrap ${toneClasses[meta.tone]}`}
    >
      {meta.label}
    </span>
  );
}

export function JobLevelBadge({ level }: { level: JobLevel }) {
  const cls =
    level === 'Managerial'
      ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200 dark:border-purple-800'
      : level === 'Supervisory'
      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-800'
      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-semibold rounded-md border whitespace-nowrap ${cls}`}
    >
      {level}
    </span>
  );
}
