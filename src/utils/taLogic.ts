import { ICBI_JOB_LEVELS, ICBI_MATRICES, IcbiDomainConfig } from '../data/constants';
import {
  Candidate,
  CommAssessment,
  IcbiAssessment,
  IcbiDomainKey,
  IcbiJobLevel,
  IcbiResultStatus,
  IcbiSubDomainKey,
  JobLevel,
  ParentInfo,
  ParentStatus,
  TalentRequest,
} from '../types/ta';

export interface CommScoreBreakdown {
  ptsAccent: number;
  ptsGrammar: number;
  ptsStructure: number;
  ptsFluency: number;
  assessment: CommAssessment;
}

export function calculateCommAssessment(params: {
  waiverEnabled: boolean;
  accentRating: number;
  grammarRating: number;
  structureRating: number;
  fluencyRating: number;
  interviewerNotes?: string;
}): CommScoreBreakdown {
  const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n || 3)));
  const accent = clamp(params.accentRating);
  const grammar = clamp(params.grammarRating);
  const structure = clamp(params.structureRating);
  const fluency = clamp(params.fluencyRating);

  const ptsAccent = accent * 4; // 20%
  const ptsGrammar = grammar * 4; // 20%
  const ptsStructure = structure * 6; // 30%
  const ptsFluency = fluency * 6; // 30%
  const totalScore = ptsAccent + ptsGrammar + ptsStructure + ptsFluency;

  let cefrLevel = 'A1 (Breakthrough / Basic - Low CEFR Level)';
  if (totalScore >= 90) cefrLevel = 'C2 (Proficient - High CEFR Level)';
  else if (totalScore >= 75) cefrLevel = 'C1 (Advanced - High CEFR Level)';
  else if (totalScore >= 60) cefrLevel = 'B2 (Vantage / Upper Intermediate - High CEFR Level)';
  else if (totalScore >= 45) cefrLevel = 'B1 (Threshold / Intermediate - Low CEFR Level)';
  else if (totalScore >= 30) cefrLevel = 'A2 (Waystage / Elementary - Low CEFR Level)';

  const hasSubThree = accent < 3 || grammar < 3 || structure < 3 || fluency < 3;
  let result = 'Failed';

  if (params.waiverEnabled) {
    result = totalScore >= 60 ? 'Pass (Local Dialect Waiver)' : 'Failed (Local Dialect Waiver)';
  } else {
    result = !hasSubThree && totalScore >= 60 ? 'Pass' : 'Failed';
  }

  return {
    ptsAccent,
    ptsGrammar,
    ptsStructure,
    ptsFluency,
    assessment: {
      waiverEnabled: params.waiverEnabled,
      accentRating: accent,
      grammarRating: grammar,
      structureRating: structure,
      fluencyRating: fluency,
      totalScore,
      cefrLevel,
      result,
      interviewerNotes: params.interviewerNotes || '',
    },
  };
}

export interface CommBadgeMeta {
  label: string;
  tone: 'emerald' | 'amber' | 'red';
}

export function getCandidateCommBadgeMeta(comm?: CommAssessment): CommBadgeMeta | null {
  if (!comm || !comm.result) return null;
  const shortCefr = comm.cefrLevel ? comm.cefrLevel.split(' ')[0] : '';
  const isHigh = Boolean(
    comm.cefrLevel && ['B2', 'C1', 'C2'].some((lvl) => comm.cefrLevel.includes(lvl))
  );
  const tierLabel = isHigh ? 'High' : 'Low';

  if (comm.result.includes('Waiver') || comm.result.includes('Waivered')) {
    if (comm.result.includes('Pass')) {
      return { label: 'Pass (Waivered)', tone: 'amber' };
    }
    return { label: 'Failed (Waivered)', tone: 'red' };
  }
  if (comm.result === 'Pass') {
    return { label: `Pass (${shortCefr} - ${tierLabel})`, tone: 'emerald' };
  }
  return { label: `Failed (${shortCefr} - ${tierLabel})`, tone: 'red' };
}

export function calculateMonthsBetween(fromDateStr: string, toDateStr?: string, referenceDate = new Date()): number {
  if (!fromDateStr) return 0;
  const fromDate = new Date(fromDateStr);
  if (Number.isNaN(fromDate.getTime())) return 0;
  const toDate = toDateStr ? new Date(toDateStr) : referenceDate;
  if (Number.isNaN(toDate.getTime())) return 0;
  const months = (toDate.getFullYear() - fromDate.getFullYear()) * 12 + (toDate.getMonth() - fromDate.getMonth());
  return months < 0 ? 0 : months;
}

export function calculateAgeFromBirthdate(birthdateStr: string, referenceDate = new Date()): number | null {
  if (!birthdateStr) return null;
  const birth = new Date(birthdateStr);
  if (Number.isNaN(birth.getTime())) return null;
  let age = referenceDate.getFullYear() - birth.getFullYear();
  const m = referenceDate.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && referenceDate.getDate() < birth.getDate())) {
    age--;
  }
  return age >= 0 && age < 120 ? age : null;
}

export interface ParsedResumeFields {
  name?: string;
  email?: string;
  phone?: string;
  phone2?: string;
  civilStatus?: 'Single' | 'Married';
  address?: string;
  school?: string;
  degree?: string;
}

export function parseResumeText(text: string): ParsedResumeFields {
  if (!text || !text.trim()) return {};
  const result: ParsedResumeFields = {};

  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    result.email = emailMatch[0];
  }

  const phoneMatches = text.match(
    /(?:\+?63|0)[\s-]?\(?\d{2,4}\)?[\s-]?\d{3,4}[\s-]?\d{4}|\b(?:\+?63|0)9\d{9}\b/g
  );
  if (phoneMatches && phoneMatches.length > 0) {
    const uniquePhones = [...new Set(phoneMatches.map((p) => p.trim()))];
    result.phone = uniquePhones[0];
    if (uniquePhones.length > 1) {
      result.phone2 = uniquePhones[1];
    }
  }

  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  if (lines.length > 0) {
    const potentialName = lines[0].replace(/resume|curriculum|vitae|cv/gi, '').trim();
    if (potentialName.length > 2 && potentialName.length < 40) {
      result.name = potentialName;
    }
  }

  if (/married/i.test(text)) result.civilStatus = 'Married';
  else if (/single/i.test(text)) result.civilStatus = 'Single';

  const addrMatch = text.match(/(?:address|location|residence)[:\s]+([^\n\r]+?)(?:\r?\n|$)/i);
  if (addrMatch) {
    result.address = addrMatch[1].trim();
  }

  const schoolMatch = text.match(/(?:university|college|institute|school)[:\s]+([^\n\r]+)/i);
  if (schoolMatch) {
    result.school = schoolMatch[1].trim();
  }

  const degreeMatch = text.match(/(?:bachelor|master|doctor|bs|ba|ms|ma|associate)\b[^\n\r]*/i);
  if (degreeMatch) {
    result.degree = degreeMatch[0].trim();
  }

  return result;
}

export function generateEtrfNumber(year = new Date().getFullYear()): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `TRF-${year}-${randomNum}`;
}

export function isStoreBasedSbu(sbu?: string): boolean {
  return sbu === 'SMR' || sbu === 'DS';
}

export function getEtrfHierarchyLabels(sbu?: string): {
  firstLevelLabel: string;
  secondLevelLabel: string;
} {
  if (isStoreBasedSbu(sbu)) {
    return {
      firstLevelLabel: 'Store Manager',
      secondLevelLabel: 'Area Manager',
    };
  }
  return {
    firstLevelLabel: 'Immediate Head',
    secondLevelLabel: 'Manager',
  };
}

export function filterTalentRequests(
  requests: TalentRequest[],
  companyFilter: string,
  levelFilter: string,
  searchQuery: string
): TalentRequest[] {
  const q = searchQuery.trim().toLowerCase();
  return requests.filter((req) => {
    if (companyFilter !== 'ALL' && req.company !== companyFilter) return false;
    if (levelFilter !== 'ALL' && req.jobLevel !== levelFilter) return false;
    if (q) {
      const match =
        (req.position || '').toLowerCase().includes(q) ||
        (req.etrfNumber || '').toLowerCase().includes(q) ||
        (req.sbu || '').toLowerCase().includes(q) ||
        (req.company || '').toLowerCase().includes(q) ||
        (req.department || '').toLowerCase().includes(q) ||
        (req.location || '').toLowerCase().includes(q) ||
        (req.areaManager || '').toLowerCase().includes(q) ||
        (req.storeManager || '').toLowerCase().includes(q) ||
        (req.hrOps || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
}

export function filterCandidates(
  candidates: Candidate[],
  assignFilter: string,
  sourceFilter: string,
  searchQuery: string
): Candidate[] {
  const q = searchQuery.trim().toLowerCase();
  return candidates.filter((cand) => {
    if (assignFilter === 'ASSIGNED' && !cand.etrfId) return false;
    if (assignFilter === 'UNASSIGNED' && cand.etrfId) return false;
    if (sourceFilter !== 'ALL' && cand.appSource !== sourceFilter) return false;
    if (q) {
      const match =
        (cand.name || '').toLowerCase().includes(q) ||
        (cand.email || '').toLowerCase().includes(q) ||
        (cand.phone || '').toLowerCase().includes(q) ||
        (cand.phone2 || '').toLowerCase().includes(q) ||
        (cand.school || '').toLowerCase().includes(q) ||
        (cand.degree || '').toLowerCase().includes(q) ||
        (cand.industry || '').toLowerCase().includes(q) ||
        (cand.appSource || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
}

export function sanitizeNotesHtml(rawHtml?: string): string {
  if (!rawHtml) return '';
  return rawHtml
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript:/gi, '');
}

export function hasRichTextContent(rawHtml?: string): boolean {
  if (!rawHtml) return false;
  const plainText = rawHtml
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .trim();
  return plainText.length > 0;
}

export function createDefaultIcbiAssessment(): IcbiAssessment {
  return {
    jobLevelLocked: true,
    waiverEnabled: false,
    remarks: '',
    scores: {
      motivation: { rating: null, evidence: '' },
      jobKnowledge: { rating: null, evidence: '' },
      cognitiveSkills: { rating: null, evidence: '' },
      efficiency: { rating: null, evidence: '' },
      strategicThinking: { rating: null, evidence: '' },
      marketCustomerOrientation: { rating: null, evidence: '' },
      planningOrganizing: { rating: null, evidence: '' },
      effectiveDelegation: { rating: null, evidence: '' },
      financialAcumen: { rating: null, evidence: '' },
      independence: { rating: null, evidence: '' },
      accountability: { rating: null, evidence: '' },
      communication: { rating: null, evidence: '' },
      managingInterdependencies: { rating: null, evidence: '' },
      ethicalDecisionMaking: { rating: null, evidence: '' },
      changeManagement: { rating: null, evidence: '' },
      developsTalent: { rating: null, evidence: '' },
      drivesPerformance: { rating: null, evidence: '' },
    },
  };
}

export function normalizeIcbiAssessment(input?: Partial<IcbiAssessment>): IcbiAssessment {
  const defaults = createDefaultIcbiAssessment();
  const rawScores = input?.scores;
  const clampRating = (val: unknown): number | null => {
    if (val === null || val === undefined || val === '') return null;
    const n = Number(val);
    if (!Number.isFinite(n)) return null;
    return Math.max(1, Math.min(5, Math.round(n)));
  };

  if (input?.selectedJobLevel && ICBI_JOB_LEVELS.includes(input.selectedJobLevel)) {
    defaults.selectedJobLevel = input.selectedJobLevel;
  }

  defaults.jobLevelLocked =
    typeof input?.jobLevelLocked === 'boolean' ? input.jobLevelLocked : true;

  defaults.waiverEnabled = Boolean(input?.waiverEnabled);

  defaults.remarks =
    typeof input?.remarks === 'string' ? sanitizeNotesHtml(input.remarks) : '';

  (Object.keys(defaults.scores) as IcbiSubDomainKey[]).forEach((key) => {
    const incoming = rawScores?.[key];
    if (incoming) {
      defaults.scores[key] = {
        rating: clampRating(incoming.rating),
        evidence: typeof incoming.evidence === 'string' ? incoming.evidence : '',
      };
    }
  });

  return defaults;
}

export function getIcbiDomainsForLevel(level: IcbiJobLevel): IcbiDomainConfig[] {
  return ICBI_MATRICES[level] || ICBI_MATRICES['Non-Supervisory'];
}

export interface IcbiDomainSummary {
  key: IcbiDomainKey;
  title: string;
  weightPercent: number;
  ratedCount: number;
  totalCount: number;
  average: number | null;
  averageFormatted: string;
  weightedContribution: number | null;
}

export interface IcbiSummary {
  effectiveLevel: IcbiJobLevel;
  domains: Record<IcbiDomainKey, IcbiDomainSummary>;
  ratedSubDomains: number;
  totalSubDomains: number;
  overallScore: number | null;
  overallScoreFormatted: string;
  overallPercent: number | null;
  bandLabel: string;
  bandTone: 'emerald' | 'blue' | 'amber' | 'slate';
  waiverEnabled: boolean;
  minRating: number | null;
  hasRatingOne: boolean;
  hasRatingTwo: boolean;
  isWaiveredPass: boolean;
  effectiveResultStatus: IcbiResultStatus | null;
  gradeRemarkTitle: string;
  gradeRemarkDetail: string;
}

export function formatIcbiResultLabel(
  summary: Pick<IcbiSummary, 'effectiveResultStatus' | 'isWaiveredPass' | 'gradeRemarkTitle'>
): string {
  if (!summary.effectiveResultStatus) return 'Pending Assessment';
  if (summary.isWaiveredPass) {
    return `Pass (Waivered) — ${summary.gradeRemarkTitle}`;
  }
  return `${summary.effectiveResultStatus} — ${summary.gradeRemarkTitle}`;
}

export function calculateIcbiSummary(
  assessment?: Partial<IcbiAssessment>,
  defaultLevel: IcbiJobLevel = 'Non-Supervisory'
): IcbiSummary {
  const normalized = normalizeIcbiAssessment(assessment);
  const effectiveLevel: IcbiJobLevel = normalized.selectedJobLevel ?? defaultLevel;
  const domainConfigs = getIcbiDomainsForLevel(effectiveLevel);
  const domains = {} as Record<IcbiDomainKey, IcbiDomainSummary>;

  let ratedWeightedSum = 0;
  let ratedWeightTotal = 0;
  let ratedSubDomains = 0;
  let totalSubDomains = 0;
  const allRatedRatings: number[] = [];

  for (const domain of domainConfigs) {
    const ratings = domain.subDomains
      .map((sub) => normalized.scores[sub.key].rating)
      .filter((r): r is number => typeof r === 'number' && r >= 1 && r <= 5);

    allRatedRatings.push(...ratings);
    const ratedCount = ratings.length;
    const totalCount = domain.subDomains.length;
    ratedSubDomains += ratedCount;
    totalSubDomains += totalCount;

    const average =
      ratedCount > 0 ? ratings.reduce((acc, r) => acc + r, 0) / ratedCount : null;
    const weightedContribution =
      average !== null ? average * (domain.weightPercent / 100) : null;

    if (weightedContribution !== null) {
      ratedWeightedSum += weightedContribution;
      ratedWeightTotal += domain.weightPercent / 100;
    }

    domains[domain.key] = {
      key: domain.key,
      title: domain.title,
      weightPercent: domain.weightPercent,
      ratedCount,
      totalCount,
      average,
      averageFormatted: average !== null ? average.toFixed(2) : '–',
      weightedContribution,
    };
  }

  const overallScore = ratedWeightTotal > 0 ? ratedWeightedSum / ratedWeightTotal : null;
  const waiverEnabled = Boolean(normalized.waiverEnabled);
  const minRating = allRatedRatings.length > 0 ? Math.min(...allRatedRatings) : null;
  const hasRatingOne = allRatedRatings.some((r) => r === 1);
  const hasRatingTwo = allRatedRatings.some((r) => r === 2);
  const hasSubThree = allRatedRatings.some((r) => r < 3);

  let effectiveResultStatus: IcbiResultStatus | null = null;
  let isWaiveredPass = false;
  let gradeRemarkTitle = 'Pending Assessment';
  let gradeRemarkDetail =
    'Rate competencies (1–5) above to determine Pass or Failed status and grade remark.';
  let bandLabel = 'Pending Assessment';
  let bandTone: 'emerald' | 'blue' | 'amber' | 'slate' = 'slate';

  if (overallScore !== null) {
    const passesWaiver = waiverEnabled ? !hasRatingOne && overallScore >= 3.0 : !hasSubThree && overallScore >= 3.0;
    effectiveResultStatus = passesWaiver ? 'Pass' : 'Failed';
    isWaiveredPass = Boolean(passesWaiver && waiverEnabled && hasRatingTwo);

    if (effectiveResultStatus === 'Pass') {
      if (overallScore >= 4.5) {
        gradeRemarkTitle = 'Remarkable';
        gradeRemarkDetail = isWaiveredPass
          ? 'Exceptional overall score (4.50–5.00); sub-domain rating of 2 waived under iCBI Waiver.'
          : 'Exceptional competency mastery (4.50–5.00); strongly recommended for hire.';
        bandLabel = 'Remarkable';
        bandTone = 'emerald';
      } else if (overallScore >= 4.0) {
        gradeRemarkTitle = 'Exceeds Standards';
        gradeRemarkDetail = isWaiveredPass
          ? 'Strong overall score (4.00–4.49); sub-domain rating of 2 waived under iCBI Waiver.'
          : 'Consistently exceeds role competency standards (4.00–4.49) across domains.';
        bandLabel = 'Exceeds Standards';
        bandTone = 'emerald';
      } else {
        gradeRemarkTitle = 'Meets Expectations';
        gradeRemarkDetail = isWaiveredPass
          ? 'Meets passing threshold (3.00–3.99); sub-domain rating of 2 waived under iCBI Waiver.'
          : 'Demonstrates solid baseline competencies (3.00–3.99) required for the role.';
        bandLabel = 'Meets Expectations';
        bandTone = 'blue';
      }
    } else {
      bandTone = 'amber';
      if (hasRatingOne) {
        gradeRemarkTitle = 'Critical Competency Gap (Rating 1)';
        gradeRemarkDetail =
          'Automatic fail: one or more sub-domains scored 1 (not eligible for rating-2 waiver).';
        bandLabel = 'Failed — Rating 1';
      } else if (!waiverEnabled && hasRatingTwo && overallScore >= 3.0) {
        gradeRemarkTitle = 'Auto-Failed on Rating 2 (Waiver Off)';
        gradeRemarkDetail =
          'Automatic fail: contains a sub-domain rating of 2 while iCBI Rating Waiver is disabled.';
        bandLabel = 'Failed — Rating 2';
      } else if (overallScore >= 2.0) {
        gradeRemarkTitle = 'Below Expectations';
        gradeRemarkDetail =
          'Weighted score (2.00–2.99) is below the 3.00 passing threshold.';
        bandLabel = 'Below Expectations';
      } else {
        gradeRemarkTitle = 'Not Recommended';
        gradeRemarkDetail =
          'Weighted score (< 2.00) indicates substantial competency gaps across domains.';
        bandLabel = 'Not Recommended';
      }
    }
  }

  return {
    effectiveLevel,
    domains,
    ratedSubDomains,
    totalSubDomains,
    overallScore,
    overallScoreFormatted: overallScore !== null ? overallScore.toFixed(2) : '–',
    overallPercent: overallScore !== null ? Math.round((overallScore / 5) * 100) : null,
    bandLabel,
    bandTone,
    waiverEnabled,
    minRating,
    hasRatingOne,
    hasRatingTwo,
    isWaiveredPass,
    effectiveResultStatus,
    gradeRemarkTitle,
    gradeRemarkDetail,
  };
}

export function formatJobLevelForMatrix(
  level?: JobLevel
): 'Non-Supervisory' | 'Supervisory' | 'Managerial' {
  if (level === 'Supervisory') return 'Supervisory';
  if (level === 'Managerial') return 'Managerial';
  return 'Non-Supervisory';
}

export interface CandidateRoleContext {
  rawJobLevel: JobLevel;
  jobLevelLabel: 'Non-Supervisory' | 'Supervisory' | 'Managerial';
  positionLabel: string;
  sourceLabel: 'Assigned eTRF' | 'Candidate Profile' | 'Unassigned Pool';
  etrfNumber?: string;
}

export function resolveCandidateRoleContext(
  candidate: Pick<Candidate, 'etrfId' | 'appliedPosition' | 'appliedJobLevel' | 'workExperiences'>,
  requests: TalentRequest[]
): CandidateRoleContext {
  const linkedReq = requests.find((r) => r.id === candidate.etrfId);
  const trimmedPos = candidate.appliedPosition?.trim();
  if (linkedReq) {
    return {
      rawJobLevel: linkedReq.jobLevel,
      jobLevelLabel: formatJobLevelForMatrix(linkedReq.jobLevel),
      positionLabel: trimmedPos || linkedReq.position,
      sourceLabel: 'Assigned eTRF',
      etrfNumber: linkedReq.etrfNumber,
    };
  }

  const fallbackLevel: JobLevel =
    candidate.appliedJobLevel || candidate.workExperiences?.[0]?.jobLevel || 'Non-Supervisor';

  return {
    rawJobLevel: fallbackLevel,
    jobLevelLabel: formatJobLevelForMatrix(fallbackLevel),
    positionLabel: trimmedPos || 'General Talent Pool (Unassigned)',
    sourceLabel: trimmedPos ? 'Candidate Profile' : 'Unassigned Pool',
  };
}

export interface ParentFieldRules {
  fatherSectionDisabled: boolean;
  fatherWorkDisabled: boolean;
  motherSectionDisabled: boolean;
  motherWorkDisabled: boolean;
}

export function getParentFieldRules(
  fatherStatus: ParentStatus,
  motherStatus: ParentStatus
): ParentFieldRules {
  const motherIsSolo = motherStatus === 'Solo Parent';
  const fatherIsSolo = !motherIsSolo && fatherStatus === 'Solo Parent';

  return {
    fatherSectionDisabled: motherIsSolo,
    fatherWorkDisabled: motherIsSolo || fatherStatus === 'Deceased',
    motherSectionDisabled: fatherIsSolo,
    motherWorkDisabled: fatherIsSolo || motherStatus === 'Deceased',
  };
}

export function normalizeParentsInfo(
  father?: Partial<ParentInfo>,
  mother?: Partial<ParentInfo>
): { father: ParentInfo; mother: ParentInfo } {
  const fStatus: ParentStatus = father?.status || 'Alive';
  const mStatus: ParentStatus = mother?.status || 'Alive';

  if (fStatus === 'Solo Parent') {
    return {
      father: {
        name: (father?.name || '').trim(),
        status: 'Solo Parent',
        work: (father?.work || '').trim(),
      },
      mother: {
        name: '',
        status: '',
        work: '',
      },
    };
  }

  if (mStatus === 'Solo Parent') {
    return {
      father: {
        name: '',
        status: '',
        work: '',
      },
      mother: {
        name: (mother?.name || '').trim(),
        status: 'Solo Parent',
        work: (mother?.work || '').trim(),
      },
    };
  }

  return {
    father: {
      name: (father?.name || '').trim(),
      status: fStatus,
      work: fStatus === 'Deceased' ? '' : (father?.work || '').trim(),
    },
    mother: {
      name: (mother?.name || '').trim(),
      status: mStatus,
      work: mStatus === 'Deceased' ? '' : (mother?.work || '').trim(),
    },
  };
}
