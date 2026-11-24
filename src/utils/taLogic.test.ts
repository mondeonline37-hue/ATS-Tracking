import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateAgeFromBirthdate,
  calculateCommAssessment,
  calculateIcbiSummary,
  calculateMonthsBetween,
  filterCandidates,
  filterTalentRequests,
  formatIcbiResultLabel,
  getCandidateCommBadgeMeta,
  getEtrfHierarchyLabels,
  getParentFieldRules,
  hasRichTextContent,
  normalizeIcbiAssessment,
  normalizeParentsInfo,
  parseResumeText,
  resolveCandidateRoleContext,
  sanitizeNotesHtml,
} from './taLogic';
import {
  INITIAL_SEED_CANDIDATES,
  INITIAL_SEED_REQUESTS,
  PARENT_STATUS_OPTIONS,
  SBUS,
} from '../data/constants';

test('calculateCommAssessment computes weighted score and CEFR level accurately', () => {
  const high = calculateCommAssessment({
    waiverEnabled: false,
    accentRating: 4,
    grammarRating: 4,
    structureRating: 4,
    fluencyRating: 4,
  });
  assert.equal(high.ptsAccent, 16);
  assert.equal(high.ptsGrammar, 16);
  assert.equal(high.ptsStructure, 24);
  assert.equal(high.ptsFluency, 24);
  assert.equal(high.assessment.totalScore, 80);
  assert.equal(high.assessment.result, 'Pass');
  assert.match(high.assessment.cefrLevel, /^C1/);

  // Sub-3 rating without waiver fails even if total >= 60
  const noWaiverFail = calculateCommAssessment({
    waiverEnabled: false,
    accentRating: 2,
    grammarRating: 3,
    structureRating: 4,
    fluencyRating: 3,
  });
  assert.equal(noWaiverFail.assessment.totalScore, 62);
  assert.equal(noWaiverFail.assessment.result, 'Failed');

  // Sub-3 rating with waiver passes when total >= 60
  const waiverPass = calculateCommAssessment({
    waiverEnabled: true,
    accentRating: 2,
    grammarRating: 3,
    structureRating: 4,
    fluencyRating: 3,
  });
  assert.equal(waiverPass.assessment.totalScore, 62);
  assert.equal(waiverPass.assessment.result, 'Pass (Local Dialect Waiver)');

  // Total < 60 fails even with waiver enabled
  const waiverLowFail = calculateCommAssessment({
    waiverEnabled: true,
    accentRating: 2,
    grammarRating: 2,
    structureRating: 3,
    fluencyRating: 3,
  });
  assert.equal(waiverLowFail.assessment.totalScore, 52);
  assert.equal(waiverLowFail.assessment.result, 'Failed (Local Dialect Waiver)');
});

test('getCandidateCommBadgeMeta formats pass, fail, and waiver badges', () => {
  assert.deepEqual(
    getCandidateCommBadgeMeta({
      waiverEnabled: false,
      accentRating: 4,
      grammarRating: 4,
      structureRating: 4,
      fluencyRating: 4,
      totalScore: 80,
      cefrLevel: 'C1 (Advanced - High CEFR Level)',
      result: 'Pass',
    }),
    { label: 'Pass (C1 - High)', tone: 'emerald' }
  );

  assert.deepEqual(
    getCandidateCommBadgeMeta({
      waiverEnabled: true,
      accentRating: 2,
      grammarRating: 3,
      structureRating: 4,
      fluencyRating: 3,
      totalScore: 62,
      cefrLevel: 'B2 (Vantage / Upper Intermediate - High CEFR Level)',
      result: 'Pass (Local Dialect Waiver)',
    }),
    { label: 'Pass (Waivered)', tone: 'amber' }
  );
});

test('calculateMonthsBetween computes non-negative duration in months', () => {
  assert.equal(calculateMonthsBetween('2021-03-01', '2026-10-31'), 67);
  assert.equal(calculateMonthsBetween('2026-10-01', '2025-01-01'), 0);
  assert.equal(calculateMonthsBetween(''), 0);
});

test('calculateAgeFromBirthdate handles birthday before and after reference date', () => {
  const ref = new Date('2026-11-23T00:00:00Z');
  assert.equal(calculateAgeFromBirthdate('1997-04-12', ref), 29);
  assert.equal(calculateAgeFromBirthdate('2000-12-25', ref), 25);
});

test('parseResumeText extracts contact info, education, and name', () => {
  const sample = `Elena Marie Cruz
Email: elena.cruz@company.ph
Mobile: +63 917 555 0192 / 0918-222-3344
Address: Brgy. Rawis, Legazpi City, Albay
Civil Status: Single
University: Bicol University
Bachelor of Science in Accountancy`;

  const parsed = parseResumeText(sample);
  assert.equal(parsed.name, 'Elena Marie Cruz');
  assert.equal(parsed.email, 'elena.cruz@company.ph');
  assert.equal(parsed.phone, '+63 917 555 0192');
  assert.equal(parsed.phone2, '0918-222-3344');
  assert.equal(parsed.civilStatus, 'Single');
  assert.equal(parsed.address, 'Brgy. Rawis, Legazpi City, Albay');
  assert.equal(parsed.school, 'Bicol University');
  assert.equal(parsed.degree, 'Bachelor of Science in Accountancy');
});

test('filterTalentRequests and filterCandidates filter by dropdowns and search', () => {
  const reqs = filterTalentRequests(INITIAL_SEED_REQUESTS, 'LMR', 'ALL', '');
  assert.equal(reqs.length, 1);
  assert.equal(reqs[0].id, 'REQ-101');

  const searchReqs = filterTalentRequests(INITIAL_SEED_REQUESTS, 'ALL', 'ALL', 'warehouse');
  assert.equal(searchReqs.length, 1);
  assert.equal(searchReqs[0].id, 'REQ-103');

  const cands = filterCandidates(INITIAL_SEED_CANDIDATES, 'ASSIGNED', 'LinkedIn', '');
  assert.equal(cands.length, 1);
  assert.equal(cands[0].name, 'Camilla Reyes');
});

test('sanitizeNotesHtml strips script tags and inline event handlers', () => {
  const dirty = '<b>Good</b><script>alert(1)</script><img src="x" onerror="evil()" />';
  const clean = sanitizeNotesHtml(dirty);
  assert.equal(clean.includes('<script>'), false);
  assert.equal(clean.includes('onerror'), false);
  assert.equal(clean.includes('<b>Good</b>'), true);
  assert.equal(hasRichTextContent('<div><br></div>&nbsp;'), false);
  assert.equal(hasRichTextContent('<b>Strong candidate</b>'), true);
});

test('calculateIcbiSummary computes Non-Supervisory (20/50/30) and Supervisory (15/40/45) matrices accurately', () => {
  // Non-Supervisory exact numbers: 4.00 (20%), 3.33 (50%), 3.75 (30%)
  const nonSup = calculateIcbiSummary(
    {
      scores: {
        motivation: { rating: 4, evidence: 'Consistent during peak' },
        jobKnowledge: { rating: 4, evidence: 'Accurate POS' },
        cognitiveSkills: { rating: 3, evidence: 'Follows multi-step rules' },
        efficiency: { rating: 3, evidence: 'Completes on time' },
        independence: { rating: 4, evidence: 'Handled customer escalation' },
        accountability: { rating: 4, evidence: 'Owned schedule change' },
        communication: { rating: 4, evidence: 'Clear huddles' },
        managingInterdependencies: { rating: 3, evidence: 'Coordinates cashiers' },
      } as never,
    },
    'Non-Supervisory'
  );

  assert.equal(nonSup.effectiveLevel, 'Non-Supervisory');
  assert.equal(nonSup.totalSubDomains, 8);
  assert.equal(nonSup.domains.motivationFit.averageFormatted, '4.00');
  assert.equal(nonSup.domains.motivationFit.weightPercent, 20);
  assert.equal(nonSup.domains.jobFit.averageFormatted, '3.33');
  assert.equal(nonSup.domains.jobFit.weightPercent, 50);
  assert.equal(nonSup.domains.behavioralFit.averageFormatted, '3.75');
  assert.equal(nonSup.domains.behavioralFit.weightPercent, 30);
  assert.equal(nonSup.overallScoreFormatted, '3.59');
  assert.equal(nonSup.overallPercent, 72);
  assert.equal(nonSup.bandLabel, 'Meets Expectations');

  // Supervisory weights: 15% / 40% / 45%, 17 sub-domains
  const sup = calculateIcbiSummary(
    {
      selectedJobLevel: 'Supervisory',
      scores: {
        motivation: { rating: 5, evidence: '' },
        jobKnowledge: { rating: 4, evidence: '' },
        cognitiveSkills: { rating: 4, evidence: '' },
        efficiency: { rating: 4, evidence: '' },
        strategicThinking: { rating: 4, evidence: '' },
        marketCustomerOrientation: { rating: 4, evidence: '' },
        planningOrganizing: { rating: 4, evidence: '' },
        effectiveDelegation: { rating: 4, evidence: '' },
        financialAcumen: { rating: 4, evidence: '' },
        independence: { rating: 4, evidence: '' },
        accountability: { rating: 4, evidence: '' },
        communication: { rating: 4, evidence: '' },
        managingInterdependencies: { rating: 4, evidence: '' },
        ethicalDecisionMaking: { rating: 4, evidence: '' },
        changeManagement: { rating: 4, evidence: '' },
        developsTalent: { rating: 4, evidence: '' },
        drivesPerformance: { rating: 4, evidence: '' },
      },
    },
    'Non-Supervisory'
  );

  assert.equal(sup.effectiveLevel, 'Supervisory');
  assert.equal(sup.totalSubDomains, 17);
  assert.equal(sup.ratedSubDomains, 17);
  assert.equal(sup.domains.motivationFit.weightPercent, 15);
  assert.equal(sup.domains.jobFit.weightPercent, 40);
  assert.equal(sup.domains.behavioralFit.weightPercent, 45);
  assert.equal(sup.overallScoreFormatted, '4.15');
  assert.equal(sup.bandLabel, 'Exceeds Standards');

  // Unrated assessment returns dashes cleanly
  const unrated = calculateIcbiSummary(undefined, 'Supervisory');
  assert.equal(unrated.domains.motivationFit.averageFormatted, '–');
  assert.equal(unrated.domains.jobFit.averageFormatted, '–');
  assert.equal(unrated.domains.behavioralFit.averageFormatted, '–');
  assert.equal(unrated.overallScoreFormatted, '–');
  assert.equal(unrated.bandLabel, 'Pending Assessment');
});

test('normalizeIcbiAssessment clamps out-of-range ratings and enforces waiver Pass/Failed and per-grade remarks', () => {
  const normalized = normalizeIcbiAssessment({
    selectedJobLevel: 'Supervisory',
    waiverEnabled: true,
    remarks: '<b>Strong</b><script>alert(1)</script><ul><li>Team player</li></ul>',
    scores: {
      motivation: { rating: 9, evidence: 'Strong drive' },
    } as never,
  });
  assert.equal(normalized.selectedJobLevel, 'Supervisory');
  assert.equal(normalized.jobLevelLocked, true);
  assert.equal(normalized.waiverEnabled, true);
  assert.equal(normalized.remarks?.includes('<script>'), false);
  assert.equal(normalized.remarks?.includes('<b>Strong</b>'), true);
  assert.equal(normalized.scores.motivation.rating, 5);
  assert.equal(normalized.scores.motivation.evidence, 'Strong drive');
  assert.equal(normalized.scores.efficiency.rating, null);
  assert.equal(normalized.scores.drivesPerformance.rating, null);

  const unlocked = normalizeIcbiAssessment({ jobLevelLocked: false });
  assert.equal(unlocked.jobLevelLocked, false);

  // Waiver OFF + a rating of 2 (even with high overall avg >= 3.00) -> Auto-Fail
  const waiverOffFail = calculateIcbiSummary(
    {
      waiverEnabled: false,
      scores: {
        motivation: { rating: 2, evidence: '' },
        jobKnowledge: { rating: 5, evidence: '' },
        cognitiveSkills: { rating: 5, evidence: '' },
        efficiency: { rating: 5, evidence: '' },
      } as never,
    },
    'Non-Supervisory'
  );
  assert.equal(waiverOffFail.effectiveResultStatus, 'Failed');
  assert.equal(waiverOffFail.gradeRemarkTitle, 'Auto-Failed on Rating 2 (Waiver Off)');
  assert.equal(formatIcbiResultLabel(waiverOffFail), 'Failed — Auto-Failed on Rating 2 (Waiver Off)');

  // Waiver ON + rating of 2 + overall >= 3.00 -> Pass (Waivered)
  const waiverOnPass = calculateIcbiSummary(
    {
      waiverEnabled: true,
      scores: {
        motivation: { rating: 2, evidence: '' },
        jobKnowledge: { rating: 5, evidence: '' },
        cognitiveSkills: { rating: 5, evidence: '' },
        efficiency: { rating: 5, evidence: '' },
      } as never,
    },
    'Non-Supervisory'
  );
  assert.equal(waiverOnPass.effectiveResultStatus, 'Pass');
  assert.equal(waiverOnPass.isWaiveredPass, true);
  assert.equal(waiverOnPass.gradeRemarkTitle, 'Exceeds Standards');
  assert.equal(formatIcbiResultLabel(waiverOnPass), 'Pass (Waivered) — Exceeds Standards');

  // Waiver ON + rating of 1 -> still Fails (only 2 is waived)
  const ratingOneFail = calculateIcbiSummary(
    {
      waiverEnabled: true,
      scores: {
        motivation: { rating: 1, evidence: '' },
        jobKnowledge: { rating: 5, evidence: '' },
      } as never,
    },
    'Non-Supervisory'
  );
  assert.equal(ratingOneFail.effectiveResultStatus, 'Failed');
  assert.equal(ratingOneFail.gradeRemarkTitle, 'Critical Competency Gap (Rating 1)');

  // Remarkable tier (>= 4.50, no sub-3 ratings)
  const remarkable = calculateIcbiSummary(
    {
      scores: {
        motivation: { rating: 5, evidence: '' },
      } as never,
    },
    'Non-Supervisory'
  );
  assert.equal(remarkable.effectiveResultStatus, 'Pass');
  assert.equal(remarkable.gradeRemarkTitle, 'Remarkable');
  assert.equal(formatIcbiResultLabel(remarkable), 'Pass — Remarkable');
});

test('resolveCandidateRoleContext resolves Job Level and Position automatically from eTRF or profile', () => {
  const fromEtrf = resolveCandidateRoleContext(INITIAL_SEED_CANDIDATES[0], INITIAL_SEED_REQUESTS);
  assert.equal(fromEtrf.jobLevelLabel, 'Managerial');
  assert.equal(fromEtrf.positionLabel, 'Store Branch Operations Manager');
  assert.equal(fromEtrf.sourceLabel, 'Assigned eTRF');

  const nonSup = resolveCandidateRoleContext(
    {
      etrfId: '',
      appliedPosition: 'Store Cashier',
      appliedJobLevel: 'Non-Supervisor',
      workExperiences: [],
    },
    INITIAL_SEED_REQUESTS
  );
  assert.equal(nonSup.jobLevelLabel, 'Non-Supervisory');
  assert.equal(nonSup.positionLabel, 'Store Cashier');
  assert.equal(nonSup.sourceLabel, 'Candidate Profile');

  // Verify dedicated Managerial rubric (15/40/45, 17 sub-domains, Financial Acumen 2.7 before Effective Delegation 2.8)
  const mgr = calculateIcbiSummary(INITIAL_SEED_CANDIDATES[0].icbiAssessment, 'Managerial');
  assert.equal(mgr.effectiveLevel, 'Managerial');
  assert.equal(mgr.totalSubDomains, 17);
  assert.equal(mgr.domains.motivationFit.weightPercent, 15);
  assert.equal(mgr.domains.jobFit.weightPercent, 40);
  assert.equal(mgr.domains.behavioralFit.weightPercent, 45);
});

test('getEtrfHierarchyLabels resolves Store Manager/Area Manager for SMR & DS and Immediate Head/Manager for other SBUs', () => {
  assert.deepEqual(SBUS, [
    'SMR',
    'DS',
    'FO',
    'FFO',
    'FP',
    'LMY',
    'PM',
    'LTS',
    'CORP',
    'SSC',
    'EXL',
    'LFI',
  ]);

  assert.deepEqual(getEtrfHierarchyLabels('SMR'), {
    firstLevelLabel: 'Store Manager',
    secondLevelLabel: 'Area Manager',
  });
  assert.deepEqual(getEtrfHierarchyLabels('DS'), {
    firstLevelLabel: 'Store Manager',
    secondLevelLabel: 'Area Manager',
  });

  for (const sbu of ['FO', 'FFO', 'FP', 'LMY', 'PM', 'LTS', 'CORP', 'SSC', 'EXL', 'LFI']) {
    assert.deepEqual(getEtrfHierarchyLabels(sbu), {
      firstLevelLabel: 'Immediate Head',
      secondLevelLabel: 'Manager',
    });
  }

  assert.equal(filterTalentRequests(INITIAL_SEED_REQUESTS, 'ALL', 'ALL', 'CORP').length, 1);
});

test('parental status rules support Solo Parent, Separated, and blank Deceased occupation', () => {
  assert.deepEqual(PARENT_STATUS_OPTIONS, ['Alive', 'Deceased', 'Solo Parent', 'Separated']);

  const motherDeceasedRules = getParentFieldRules('Alive', 'Deceased');
  assert.equal(motherDeceasedRules.fatherSectionDisabled, false);
  assert.equal(motherDeceasedRules.fatherWorkDisabled, false);
  assert.equal(motherDeceasedRules.motherSectionDisabled, false);
  assert.equal(motherDeceasedRules.motherWorkDisabled, true);

  const deceasedCleared = normalizeParentsInfo(
    { name: 'Carlos Mendoza', status: 'Alive', work: 'Accountant' },
    { name: 'Maria Teresa Mendoza', status: 'Deceased', work: 'Teacher' }
  );
  assert.equal(deceasedCleared.mother.work, '');
  assert.equal(deceasedCleared.father.work, 'Accountant');

  const motherSoloRules = getParentFieldRules('Alive', 'Solo Parent');
  assert.equal(motherSoloRules.fatherSectionDisabled, true);
  assert.equal(motherSoloRules.fatherWorkDisabled, true);
  assert.equal(motherSoloRules.motherSectionDisabled, false);
  assert.equal(motherSoloRules.motherWorkDisabled, false);

  const motherSoloNormalized = normalizeParentsInfo(
    { name: 'Carlos Mendoza', status: 'Alive', work: 'Accountant' },
    { name: 'Elena Reyes', status: 'Solo Parent', work: 'Store Supervisor' }
  );
  assert.deepEqual(motherSoloNormalized.father, { name: '', status: '', work: '' });
  assert.deepEqual(motherSoloNormalized.mother, {
    name: 'Elena Reyes',
    status: 'Solo Parent',
    work: 'Store Supervisor',
  });

  const fatherSoloRules = getParentFieldRules('Solo Parent', 'Alive');
  assert.equal(fatherSoloRules.motherSectionDisabled, true);
  assert.equal(fatherSoloRules.motherWorkDisabled, true);
  assert.equal(fatherSoloRules.fatherSectionDisabled, false);
  assert.equal(fatherSoloRules.fatherWorkDisabled, false);

  const fatherSoloNormalized = normalizeParentsInfo(
    { name: 'Fernando Reyes', status: 'Solo Parent', work: 'Civil Engineer' },
    { name: 'Clara Reyes', status: 'Alive', work: 'Principal' }
  );
  assert.deepEqual(fatherSoloNormalized.father, {
    name: 'Fernando Reyes',
    status: 'Solo Parent',
    work: 'Civil Engineer',
  });
  assert.deepEqual(fatherSoloNormalized.mother, { name: '', status: '', work: '' });

  const separatedNormalized = normalizeParentsInfo(
    { name: 'Roberto Cruz', status: 'Separated', work: 'Driver' },
    { name: 'Lorna Cruz', status: 'Separated', work: 'Vendor' }
  );
  assert.equal(separatedNormalized.father.status, 'Separated');
  assert.equal(separatedNormalized.father.work, 'Driver');
  assert.equal(separatedNormalized.mother.status, 'Separated');
  assert.equal(separatedNormalized.mother.work, 'Vendor');
});
