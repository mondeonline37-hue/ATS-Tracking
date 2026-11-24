export type JobLevel = 'Non-Supervisor' | 'Supervisory' | 'Managerial';
export type WorkArrangement = 'On-Site' | 'Hybrid' | 'Work From Home';
export type TabId = 'dashboard' | 'requests' | 'candidates';

export interface TalentRequest {
  id: string;
  etrfNumber: string;
  position: string;
  location: string;
  sbu?: string;
  company: string;
  department: string;
  workArrangement: WorkArrangement;
  jobLevel: JobLevel;
  dateRequested: string;
  salaryGrade: string;
  negotiable: boolean;
  maxSalary: string;
  areaManager: string;
  storeManager: string;
  hrbp: string;
  srHrbp: string;
  hrOps: string;
}

export type ParentStatus = 'Alive' | 'Deceased' | 'Solo Parent' | 'Separated' | '';

export interface ParentInfo {
  name: string;
  status: ParentStatus;
  work: string;
}

export interface AdditionalEducation {
  school: string;
  degree: string;
  major: string;
  year: string;
}

export interface License {
  title: string;
  number: string;
  exp: string;
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
}

export interface WorkExperience {
  position: string;
  jobLevel: JobLevel;
  company: string;
  fromDate: string;
  toDate: string;
  totalMonths: number;
  reason: string;
}

export interface CommAssessment {
  waiverEnabled: boolean;
  accentRating: number;
  grammarRating: number;
  structureRating: number;
  fluencyRating: number;
  totalScore: number;
  cefrLevel: string;
  result: string;
  interviewerNotes?: string;
}

export type IcbiJobLevel = 'Non-Supervisory' | 'Supervisory' | 'Managerial';

export type IcbiSubDomainKey =
  | 'motivation'
  | 'jobKnowledge'
  | 'cognitiveSkills'
  | 'efficiency'
  | 'strategicThinking'
  | 'marketCustomerOrientation'
  | 'planningOrganizing'
  | 'effectiveDelegation'
  | 'financialAcumen'
  | 'independence'
  | 'accountability'
  | 'communication'
  | 'managingInterdependencies'
  | 'ethicalDecisionMaking'
  | 'changeManagement'
  | 'developsTalent'
  | 'drivesPerformance';

export type IcbiDomainKey = 'motivationFit' | 'jobFit' | 'behavioralFit';

export interface IcbiSubDomainScore {
  rating: number | null;
  evidence: string;
}

export type IcbiResultStatus = 'Pass' | 'Failed';

export interface IcbiAssessment {
  selectedJobLevel?: IcbiJobLevel;
  jobLevelLocked?: boolean;
  waiverEnabled?: boolean;
  remarks?: string;
  scores: Record<IcbiSubDomainKey, IcbiSubDomainScore>;
}

export interface Candidate {
  id: string;
  etrfId: string;
  appliedPosition?: string;
  appliedJobLevel?: JobLevel;
  appDate: string;
  appSource: string;
  relocation: string;
  industry: string;
  name: string;
  age: number;
  email: string;
  phone: string;
  phone2?: string;
  birthdate: string;
  civilStatus: string;
  address: string;
  father: ParentInfo;
  mother: ParentInfo;
  school: string;
  degree: string;
  major: string;
  yearGraduated: string;
  additionalEducations: AdditionalEducation[];
  licenses: License[];
  certifications: Certification[];
  workExperiences: WorkExperience[];
  commAssessment: CommAssessment;
  icbiAssessment?: IcbiAssessment;
}

export interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  actionText: string;
  variant: 'danger' | 'primary';
  onConfirm: () => void;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
