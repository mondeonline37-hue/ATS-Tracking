import React, { useEffect, useRef, useState } from 'react';
import {
  Award,
  BadgeCheck,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  MapPin,
  MessageSquare,
  Pencil,
  Printer,
  ShieldCheck,
  SquarePen,
  User,
  X,
  XCircle,
} from 'lucide-react';
import { COMM_DESCRIPTORS } from '../data/constants';
import { Candidate, TalentRequest } from '../types/ta';
import {
  calculateIcbiSummary,
  formatIcbiResultLabel,
  getIcbiDomainsForLevel,
  hasRichTextContent,
  normalizeIcbiAssessment,
  normalizeParentsInfo,
  resolveCandidateRoleContext,
  sanitizeNotesHtml,
} from '../utils/taLogic';
import { CandidateCommBadge } from './BadgeHelpers';

interface ViewCandidateModalProps {
  candidate: Candidate | null;
  requests: TalentRequest[];
  onClose: () => void;
  onEdit: (id: string, tab?: 'profile' | 'comms' | 'icbi') => void;
}

export function ViewCandidateModal({
  candidate,
  requests,
  onClose,
  onEdit,
}: ViewCandidateModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'comms' | 'icbi'>('profile');
  const bodyScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (candidate) {
      setActiveTab('profile');
    }
  }, [candidate?.id]);

  useEffect(() => {
    if (bodyScrollRef.current) {
      bodyScrollRef.current.scrollTop = 0;
    }
  }, [activeTab, candidate?.id]);

  if (!candidate) return null;

  const linkedReq = requests.find((r) => r.id === candidate.etrfId);
  const positionApplied =
    candidate.appliedPosition?.trim() || linkedReq?.position || 'Not specified';
  const roleContext = resolveCandidateRoleContext(candidate, requests);
  const icbiAssessment = normalizeIcbiAssessment(candidate.icbiAssessment);
  const icbiSummary = calculateIcbiSummary(icbiAssessment, roleContext.jobLevelLabel);
  const icbiOverviewDomains = getIcbiDomainsForLevel(icbiSummary.effectiveLevel);
  const comm = candidate.commAssessment || {
    waiverEnabled: false,
    accentRating: 3,
    grammarRating: 3,
    structureRating: 3,
    fluencyRating: 3,
    totalScore: 0,
    cefrLevel: 'N/A',
    result: '',
    interviewerNotes: '',
  };

  const safeNotes = sanitizeNotesHtml(comm.interviewerNotes);
  const hasCommNotes = hasRichTextContent(safeNotes);
  const safeIcbiRemarks = sanitizeNotesHtml(icbiAssessment.remarks);
  const hasIcbiRemarks = hasRichTextContent(safeIcbiRemarks);
  const icbiResultLabel = formatIcbiResultLabel(icbiSummary);
  const normalizedParents = normalizeParentsInfo(candidate.father, candidate.mother);

  return (
    <div
      id="modal-view-candidate"
      role="dialog"
      aria-modal="true"
      aria-labelledby="view-candidate-title"
      className="fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
            <h3 id="view-candidate-title" className="font-bold text-base">
              Candidate Details &amp; Assessment
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close candidate details modal"
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg no-print"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sliding Tab Navigation */}
        <div className="flex flex-wrap border-b border-slate-800 bg-slate-900 px-6 py-2.5 gap-2 flex-shrink-0 no-print">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'profile'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('comms')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'comms'
                ? 'bg-purple-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Comms</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('icbi')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'icbi'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>iCBI Matrix</span>
          </button>
        </div>

        {/* Body */}
        <div ref={bodyScrollRef} className="p-6 overflow-y-auto flex-1">
          {activeTab === 'profile' ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {candidate.name}
                    </h2>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onEdit(candidate.id, 'profile');
                      }}
                      aria-label={`Edit candidate ${candidate.name}`}
                      title="Edit Candidate"
                      className="p-1.5 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-800 rounded-lg transition-colors no-print"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {candidate.email}
                    {' · '}
                    {candidate.phone || 'No Phone'}
                    {candidate.phone2 ? ` (Alt: ${candidate.phone2})` : ''}
                    {candidate.age ? ` · ${candidate.age} y/o` : ''}
                    {` · ${candidate.civilStatus || 'Single'}`}
                  </p>
                  {candidate.address && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{candidate.address}</span>
                    </p>
                  )}
                </div>
                <div>
                  <CandidateCommBadge comm={comm} />
                </div>
              </div>

              {/* Application & Assignment */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                <div>
                  <span className="block text-[11px] text-slate-400 font-semibold">
                    Position Applied For
                  </span>
                  <strong
                    data-testid="profile-position-applied"
                    className="text-slate-900 dark:text-slate-100"
                  >
                    {positionApplied}
                  </strong>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-400 font-semibold">
                    Assigned eTRF
                  </span>
                  <strong className="font-mono text-slate-900 dark:text-slate-100">
                    {linkedReq ? linkedReq.etrfNumber : 'Unassigned'}
                  </strong>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-400 font-semibold">
                    Application Date
                  </span>
                  <strong className="font-mono tabular-nums text-slate-900 dark:text-slate-100">
                    {candidate.appDate || 'N/A'}
                  </strong>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-400 font-semibold">Source</span>
                  <strong className="text-slate-900 dark:text-slate-100">
                    {candidate.appSource || 'Direct'}
                  </strong>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-400 font-semibold">Industry</span>
                  <strong className="text-emerald-600 dark:text-emerald-400">
                    {candidate.industry || 'General'}
                  </strong>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-400 font-semibold">Relocation</span>
                  <strong className="text-slate-900 dark:text-slate-100">
                    {candidate.relocation || 'N/A'}
                  </strong>
                </div>
              </div>

              {/* Parents Information */}
              <div>
                <h4 className="font-bold text-xs text-slate-500 dark:text-slate-400 mb-2">
                  Parents Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {normalizedParents.mother.status !== 'Solo Parent' && (
                    <div
                      data-testid="parent-father-card"
                      className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800"
                    >
                      <span className="font-bold block text-slate-800 dark:text-slate-200">
                        Father: {normalizedParents.father.name || 'N/A'}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">
                        Status: {normalizedParents.father.status || 'N/A'}
                        {normalizedParents.father.status !== 'Deceased'
                          ? ` · Work: ${normalizedParents.father.work || 'N/A'}`
                          : ''}
                      </span>
                    </div>
                  )}
                  {normalizedParents.father.status !== 'Solo Parent' && (
                    <div
                      data-testid="parent-mother-card"
                      className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800"
                    >
                      <span className="font-bold block text-slate-800 dark:text-slate-200">
                        Mother: {normalizedParents.mother.name || 'N/A'}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">
                        Status: {normalizedParents.mother.status || 'N/A'}
                        {normalizedParents.mother.status !== 'Deceased'
                          ? ` · Work: ${normalizedParents.mother.work || 'N/A'}`
                          : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Academic Attainment */}
              <div>
                <h4 className="font-bold text-xs text-slate-500 dark:text-slate-400 mb-2">
                  Academic Attainment
                </h4>
                <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                  <strong className="text-slate-800 dark:text-slate-200 block text-sm">
                    {candidate.degree || 'Degree N/A'}{' '}
                    {candidate.major ? `(${candidate.major})` : ''}
                  </strong>
                  <div className="text-slate-500 dark:text-slate-400 mt-1">
                    {candidate.school || 'School N/A'} · Graduated:{' '}
                    <span className="font-mono">{candidate.yearGraduated || 'N/A'}</span>
                  </div>
                </div>
                {candidate.additionalEducations && candidate.additionalEducations.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {candidate.additionalEducations.map((edu, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg text-xs border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        <strong>
                          {edu.degree} {edu.major ? `(${edu.major})` : ''}
                        </strong>{' '}
                        - {edu.school} ({edu.year || 'N/A'})
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Licenses & Certifications */}
              {((candidate.licenses && candidate.licenses.length > 0) ||
                (candidate.certifications && candidate.certifications.length > 0)) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-xs text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                      <BadgeCheck className="w-3.5 h-3.5 text-blue-500" />
                      Professional Licenses
                    </h4>
                    {!candidate.licenses || candidate.licenses.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No licenses recorded.</p>
                    ) : (
                      <div className="space-y-2">
                        {candidate.licenses.map((lic, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs"
                          >
                            <div className="font-bold text-slate-800 dark:text-slate-200">
                              {lic.title}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                              {lic.number ? `#${lic.number}` : 'No number'}{' '}
                              {lic.exp ? `· Exp: ${lic.exp}` : ''}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-xs text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-emerald-500" />
                      Certifications &amp; Credentials
                    </h4>
                    {!candidate.certifications || candidate.certifications.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No certifications recorded.</p>
                    ) : (
                      <div className="space-y-2">
                        {candidate.certifications.map((cert, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs"
                          >
                            <div className="font-bold text-slate-800 dark:text-slate-200">
                              {cert.name}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              {cert.issuer || 'Issuer N/A'}{' '}
                              {cert.year ? `· ${cert.year}` : ''}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Work Experience */}
              <div>
                <h4 className="font-bold text-xs text-slate-500 dark:text-slate-400 mb-2">
                  Work Experience History
                </h4>
                {!candidate.workExperiences || candidate.workExperiences.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No work history recorded.</p>
                ) : (
                  <div className="space-y-2.5">
                    {candidate.workExperiences.map((exp, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs"
                      >
                        <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200 gap-2">
                          <span>
                            {exp.position}{' '}
                            <span className="text-[11px] font-normal text-slate-400">
                              ({exp.jobLevel})
                            </span>
                          </span>
                          <span>{exp.company}</span>
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-1 flex flex-wrap justify-between gap-2">
                          <span className="font-mono tabular-nums">
                            {exp.fromDate || 'N/A'} to {exp.toDate || 'Present'} ({exp.totalMonths || 0}{' '}
                            months)
                          </span>
                          {exp.reason && <span>Reason: {exp.reason}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* iCBI Matrix Overview */}
              <div className="pt-5 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-xs text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                      <ClipboardList className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      iCBI Matrix Overview
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Job Level: <strong className="text-slate-800 dark:text-slate-200">{icbiSummary.effectiveLevel}</strong>
                      {' · '}
                      Position: <strong className="text-slate-800 dark:text-slate-200">{roleContext.positionLabel}</strong>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('icbi')}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors whitespace-nowrap shrink-0 no-print"
                  >
                    Open iCBI Matrix
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-px bg-slate-200 dark:bg-slate-700 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 text-xs">
                  {icbiOverviewDomains.map((dom) => {
                    const stat = icbiSummary.domains[dom.key];
                    return (
                      <div key={dom.key} className="bg-slate-50 dark:bg-slate-800/60 p-3">
                        <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                          {dom.title} ({dom.weightPercent}%)
                        </span>
                        <strong className="font-mono tabular-nums text-slate-900 dark:text-white">
                          {stat.averageFormatted === '–' ? '–' : `${stat.averageFormatted} / 5.00`}
                        </strong>
                      </div>
                    );
                  })}
                  <div className="bg-blue-50 dark:bg-blue-950/40 p-3">
                    <span className="block text-[11px] text-blue-700 dark:text-blue-300 font-semibold">
                      Overall Weighted
                    </span>
                    <strong className="font-mono tabular-nums text-blue-900 dark:text-blue-100 block">
                      {icbiSummary.overallScoreFormatted === '–'
                        ? 'Pending Assessment'
                        : `${icbiSummary.overallScoreFormatted} / 5.00 (${icbiSummary.overallPercent}%)`}
                    </strong>
                    {icbiSummary.effectiveResultStatus && (
                      <span
                        className={`inline-block mt-1 text-[11px] font-bold ${
                          icbiSummary.effectiveResultStatus === 'Pass'
                            ? 'text-emerald-700 dark:text-emerald-300'
                            : 'text-red-700 dark:text-red-300'
                        }`}
                      >
                        {icbiResultLabel}
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-200 interviewer-notes-display">
                  <span className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                    <SquarePen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    Interviewer Remarks
                  </span>
                  {hasIcbiRemarks ? (
                    <div dangerouslySetInnerHTML={{ __html: safeIcbiRemarks }} />
                  ) : (
                    <p className="text-slate-400 italic">No interviewer remarks recorded.</p>
                  )}
                </div>
              </div>
            </div>
          ) : activeTab === 'comms' ? (
            <div className="space-y-4">
              <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-xl border border-purple-200 dark:border-purple-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                    Communication Score
                  </span>
                  <span className="text-2xl font-extrabold text-purple-900 dark:text-purple-200 font-mono tabular-nums">
                    {comm.totalScore || 0}/100
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                    CEFR Level
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {comm.cefrLevel || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CandidateCommBadge comm={comm} />
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onEdit(candidate.id, 'comms');
                    }}
                    aria-label={`Edit communication assessment for ${candidate.name}`}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors no-print"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <strong className="block text-slate-800 dark:text-slate-200">
                    Accent &amp; Pronunciation (Rating: {comm.accentRating || 3}/5)
                  </strong>
                  <p className="text-slate-500 dark:text-slate-400 italic mt-1">
                    {COMM_DESCRIPTORS.accent[comm.accentRating || 3]}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <strong className="block text-slate-800 dark:text-slate-200">
                    Grammar (Rating: {comm.grammarRating || 3}/5)
                  </strong>
                  <p className="text-slate-500 dark:text-slate-400 italic mt-1">
                    {COMM_DESCRIPTORS.grammar[comm.grammarRating || 3]}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <strong className="block text-slate-800 dark:text-slate-200">
                    Structure &amp; Clarity of Thought (Rating: {comm.structureRating || 3}/5)
                  </strong>
                  <p className="text-slate-500 dark:text-slate-400 italic mt-1">
                    {COMM_DESCRIPTORS.structure[comm.structureRating || 3]}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <strong className="block text-slate-800 dark:text-slate-200">
                    Fluency (Rating: {comm.fluencyRating || 3}/5)
                  </strong>
                  <p className="text-slate-500 dark:text-slate-400 italic mt-1">
                    {COMM_DESCRIPTORS.fluency[comm.fluencyRating || 3]}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xs text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                  <SquarePen className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  Interviewer Notes
                </h4>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-200 interviewer-notes-display">
                  {hasCommNotes ? (
                    <div dangerouslySetInnerHTML={{ __html: safeNotes }} />
                  ) : (
                    <p className="text-slate-400 italic">No interviewer notes recorded.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5" data-testid="icbi-details-view">
              {/* Read-Only Summary Card */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-700/80">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      iCBI Matrix
                    </h4>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
                      iCBI Rating Waiver: {icbiAssessment.waiverEnabled ? 'On' : 'Off'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onEdit(candidate.id, 'icbi');
                      }}
                      aria-label={`Edit iCBI Matrix for ${candidate.name}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors no-print"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1 text-xs">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Job Level: </span>
                      <strong
                        data-testid="icbi-view-job-level"
                        className="font-bold text-slate-900 dark:text-white"
                      >
                        {icbiSummary.effectiveLevel}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Position: </span>
                      <strong
                        data-testid="icbi-view-position"
                        className="font-bold text-slate-900 dark:text-white"
                      >
                        {roleContext.positionLabel}
                      </strong>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Profile Level: {roleContext.jobLevelLabel} ({roleContext.sourceLabel}
                      {roleContext.etrfNumber ? ` · ${roleContext.etrfNumber}` : ''})
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      Overall Weighted Score
                    </span>
                    <div className="flex items-baseline sm:justify-end gap-2">
                      <span
                        data-testid="icbi-view-overall-score"
                        className="text-2xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white"
                      >
                        {icbiSummary.overallScoreFormatted}
                      </span>
                      <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                        / 5.00{icbiSummary.overallPercent !== null ? ` (${icbiSummary.overallPercent}%)` : ''}
                      </span>
                    </div>
                    <div
                      className={`text-xs font-bold inline-flex items-center gap-1 mt-0.5 ${
                        icbiSummary.effectiveResultStatus === 'Failed'
                          ? 'text-red-600 dark:text-red-400'
                          : icbiSummary.bandTone === 'emerald'
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : icbiSummary.bandTone === 'blue'
                              ? 'text-blue-700 dark:text-blue-400'
                              : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {icbiSummary.effectiveResultStatus === 'Failed' ? (
                        <XCircle className="w-3.5 h-3.5 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      )}
                      <span>{icbiResultLabel}</span>
                      <span className="text-[11px] font-normal font-mono tabular-nums text-slate-500 dark:text-slate-400">
                        · {icbiSummary.ratedSubDomains}/{icbiSummary.totalSubDomains} rated
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3-Domain Summary Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-slate-200 dark:bg-slate-700 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                  {icbiOverviewDomains.map((domain) => {
                    const domainStat = icbiSummary.domains[domain.key];
                    return (
                      <div
                        key={domain.key}
                        className="bg-white dark:bg-slate-900 px-3.5 py-2.5 flex items-center justify-between gap-2"
                      >
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                          {domain.title}
                        </span>
                        <span className="text-xs font-mono tabular-nums font-bold text-slate-900 dark:text-white whitespace-nowrap">
                          {domainStat.averageFormatted} · {domain.weightPercent}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Read-Only Final Rating & Interviewer Remarks (Visible immediately below summary) */}
              <div
                data-testid="icbi-view-remarks-section"
                className="rounded-2xl border border-blue-200 dark:border-blue-900/70 bg-slate-50 dark:bg-slate-800/50 p-4 space-y-4"
              >
                <div
                  className={`rounded-xl border p-3.5 space-y-2 ${
                    icbiSummary.effectiveResultStatus === 'Pass'
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/70'
                      : icbiSummary.effectiveResultStatus === 'Failed'
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
                        <span className="font-mono tabular-nums text-base font-extrabold text-slate-900 dark:text-white">
                          {icbiSummary.overallScoreFormatted} / 5.00
                          {icbiSummary.overallPercent !== null ? ` (${icbiSummary.overallPercent}%)` : ''}
                        </span>
                      </div>

                      <div className="h-7 w-[1px] bg-slate-300 dark:bg-slate-700 hidden sm:block" />

                      <div>
                        <span className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                          Lowest Sub-Domain
                        </span>
                        <span className="font-mono tabular-nums text-xs font-bold text-slate-800 dark:text-slate-200">
                          {icbiSummary.minRating !== null ? `${icbiSummary.minRating} / 5` : '–'}
                        </span>
                      </div>
                    </div>

                    <span
                      data-testid="icbi-view-result-badge"
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border whitespace-nowrap ${
                        icbiSummary.effectiveResultStatus === 'Pass'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800'
                          : icbiSummary.effectiveResultStatus === 'Failed'
                            ? 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/80 dark:text-red-300 dark:border-red-800'
                            : 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {icbiSummary.effectiveResultStatus === 'Pass' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      ) : icbiSummary.effectiveResultStatus === 'Failed' ? (
                        <XCircle className="w-3.5 h-3.5 shrink-0" />
                      ) : null}
                      <span>{icbiResultLabel}</span>
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-slate-200/70 dark:border-slate-700/70">
                    <p className="text-xs text-slate-700 dark:text-slate-200 font-medium">
                      {icbiSummary.gradeRemarkDetail}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      <ShieldCheck className="w-3 h-3" />
                      System-Decided
                    </span>
                  </div>
                </div>

                <div>
                  <h5 className="font-bold text-xs text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                    <SquarePen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    Interviewer Remarks
                  </h5>
                  <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-200 interviewer-notes-display">
                    {hasIcbiRemarks ? (
                      <div dangerouslySetInnerHTML={{ __html: safeIcbiRemarks }} />
                    ) : (
                      <p className="text-slate-400 italic">No interviewer remarks recorded.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Read-Only Domains & Sub-Domains */}
              {icbiOverviewDomains.map((domain) => {
                const domainStat = icbiSummary.domains[domain.key];
                return (
                  <div
                    key={domain.key}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900"
                  >
                    <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                      <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                        {domain.title}
                      </h5>
                      <span className="text-xs font-semibold font-mono tabular-nums text-slate-700 dark:text-slate-200">
                        Domain avg {domainStat.averageFormatted} · weight {domain.weightPercent}%
                      </span>
                    </div>

                    <div className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                      {domain.subDomains.map((sub) => {
                        const subScore = icbiAssessment.scores[sub.key];
                        const activeRating =
                          typeof subScore?.rating === 'number'
                            ? (subScore.rating as 1 | 2 | 3 | 4 | 5)
                            : null;

                        return (
                          <div key={sub.key} className="p-3.5 space-y-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <strong className="text-slate-800 dark:text-slate-200">
                                {sub.title}
                              </strong>
                              <span
                                className={`font-mono tabular-nums text-xs font-bold ${
                                  activeRating !== null
                                    ? 'text-blue-700 dark:text-blue-300'
                                    : 'text-slate-400 dark:text-slate-500 font-normal'
                                }`}
                              >
                                {activeRating !== null ? `Rating: ${activeRating}/5` : 'Not rated'}
                              </span>
                            </div>
                            {activeRating !== null ? (
                              <p className="text-slate-500 dark:text-slate-400 italic leading-relaxed">
                                {sub.definitions[activeRating]}
                              </p>
                            ) : (
                              <p className="text-slate-400 italic">No rating recorded.</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/80 px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center no-print flex-shrink-0">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Summary
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
