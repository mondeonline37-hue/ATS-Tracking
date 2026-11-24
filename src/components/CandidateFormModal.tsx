import React, { useEffect, useRef, useState } from 'react';
import {
  Bold,
  Bot,
  Briefcase,
  ClipboardList,
  ClipboardPaste,
  CloudUpload,
  FileSignature,
  GraduationCap,
  Italic,
  List,
  Loader2,
  MessageSquare,
  Plus,
  PlusCircle,
  Sparkles,
  SquarePen,
  Strikethrough,
  Trash2,
  Underline,
  User,
  X,
} from 'lucide-react';
import {
  APP_SOURCES,
  CIVIL_STATUS_OPTIONS,
  COMM_DESCRIPTORS,
  INDUSTRY_OPTIONS,
  JOB_LEVELS,
  PARENT_STATUS_OPTIONS,
  RELOCATION_OPTIONS,
} from '../data/constants';
import {
  AdditionalEducation,
  Candidate,
  Certification,
  IcbiAssessment,
  JobLevel,
  License,
  ParentStatus,
  TalentRequest,
  WorkExperience,
} from '../types/ta';
import { extractTextFromResumeFile } from '../utils/resumeFileParser';
import {
  calculateAgeFromBirthdate,
  calculateCommAssessment,
  calculateMonthsBetween,
  createDefaultIcbiAssessment,
  getParentFieldRules,
  normalizeIcbiAssessment,
  normalizeParentsInfo,
  parseResumeText,
  resolveCandidateRoleContext,
  sanitizeNotesHtml,
} from '../utils/taLogic';
import { IcbiMatrixSection } from './IcbiMatrixSection';

interface CandidateFormModalProps {
  isOpen: boolean;
  editingCandidate: Candidate | null;
  requests: TalentRequest[];
  initialTab?: 'profile' | 'comms' | 'icbi';
  onClose: () => void;
  onSave: (candidate: Candidate, isEdit: boolean) => void;
  onToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function CandidateFormModal({
  isOpen,
  editingCandidate,
  requests,
  initialTab = 'profile',
  onClose,
  onSave,
  onToast,
}: CandidateFormModalProps) {
  const [formTab, setFormTab] = useState<'profile' | 'comms' | 'icbi'>(initialTab);
  const [parseMode, setParseMode] = useState<'file' | 'paste'>('file');
  const [pastedResumeText, setPastedResumeText] = useState('');
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Application & Assignment
  const [etrfId, setEtrfId] = useState('');
  const [appliedPosition, setAppliedPosition] = useState('');
  const [appliedJobLevel, setAppliedJobLevel] = useState<JobLevel>('Non-Supervisor');
  const [appDate, setAppDate] = useState('');
  const [appSource, setAppSource] = useState<string>('Jobstreet');
  const [relocation, setRelocation] = useState<string>('Willing to Relocate');
  const [industry, setIndustry] = useState('');

  // Personal Info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [showPhone2, setShowPhone2] = useState(false);
  const [phone2, setPhone2] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [age, setAge] = useState<string>('');
  const [civilStatus, setCivilStatus] = useState('Single');
  const [address, setAddress] = useState('');

  // Parents Info
  const [fatherName, setFatherName] = useState('');
  const [fatherStatus, setFatherStatus] = useState<ParentStatus>('Alive');
  const [fatherWork, setFatherWork] = useState('');
  const [motherName, setMotherName] = useState('');
  const [motherStatus, setMotherStatus] = useState<ParentStatus>('Alive');
  const [motherWork, setMotherWork] = useState('');

  // Primary Education
  const [school, setSchool] = useState('');
  const [degree, setDegree] = useState('');
  const [major, setMajor] = useState('');
  const [yearGraduated, setYearGraduated] = useState('');

  // Dynamic Repeaters
  const [additionalEducations, setAdditionalEducations] = useState<AdditionalEducation[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);

  // Comms Assessment
  const [waiverEnabled, setWaiverEnabled] = useState(false);
  const [accentRating, setAccentRating] = useState(3);
  const [grammarRating, setGrammarRating] = useState(3);
  const [structureRating, setStructureRating] = useState(3);
  const [fluencyRating, setFluencyRating] = useState(3);
  const [interviewerNotes, setInterviewerNotes] = useState('');
  const notesEditorRef = useRef<HTMLDivElement | null>(null);
  const formScrollRef = useRef<HTMLFormElement | null>(null);

  // iCBI Matrix Assessment
  const [icbiAssessment, setIcbiAssessment] = useState<IcbiAssessment>(
    createDefaultIcbiAssessment
  );

  useEffect(() => {
    if (!isOpen) return;
    setFormTab(initialTab);
    setParseMode('file');
    setPastedResumeText('');
    setValidationError(null);

    if (editingCandidate) {
      const initialEtrfId = editingCandidate.etrfId || '';
      const initialReq = requests.find((r) => r.id === initialEtrfId);
      setEtrfId(initialEtrfId);
      setAppliedPosition(editingCandidate.appliedPosition || initialReq?.position || '');
      setAppliedJobLevel(
        editingCandidate.appliedJobLevel || initialReq?.jobLevel || 'Non-Supervisor'
      );
      setAppDate(editingCandidate.appDate || new Date().toISOString().split('T')[0]);
      setAppSource(editingCandidate.appSource || 'Jobstreet');
      setRelocation(editingCandidate.relocation || 'Willing to Relocate');
      setIndustry(editingCandidate.industry || '');
      setName(editingCandidate.name || '');
      setEmail(editingCandidate.email || '');
      setPhone(editingCandidate.phone || '');
      setShowPhone2(Boolean(editingCandidate.phone2));
      setPhone2(editingCandidate.phone2 || '');
      setBirthdate(editingCandidate.birthdate || '');
      setAge(editingCandidate.age ? String(editingCandidate.age) : '');
      setCivilStatus(editingCandidate.civilStatus || 'Single');
      setAddress(editingCandidate.address || '');

      const normalizedParents = normalizeParentsInfo(
        editingCandidate.father,
        editingCandidate.mother
      );
      setFatherName(normalizedParents.father.name);
      setFatherStatus(normalizedParents.father.status);
      setFatherWork(normalizedParents.father.work);
      setMotherName(normalizedParents.mother.name);
      setMotherStatus(normalizedParents.mother.status);
      setMotherWork(normalizedParents.mother.work);

      setSchool(editingCandidate.school || '');
      setDegree(editingCandidate.degree || '');
      setMajor(editingCandidate.major || '');
      setYearGraduated(editingCandidate.yearGraduated || '');

      setAdditionalEducations(
        (editingCandidate.additionalEducations || []).map((e) => ({ ...e }))
      );
      setLicenses((editingCandidate.licenses || []).map((l) => ({ ...l })));
      setCertifications((editingCandidate.certifications || []).map((c) => ({ ...c })));
      setWorkExperiences((editingCandidate.workExperiences || []).map((w) => ({ ...w })));

      const comm = editingCandidate.commAssessment;
      setWaiverEnabled(Boolean(comm?.waiverEnabled));
      setAccentRating(comm?.accentRating || 3);
      setGrammarRating(comm?.grammarRating || 3);
      setStructureRating(comm?.structureRating || 3);
      setFluencyRating(comm?.fluencyRating || 3);
      const safeNotes = sanitizeNotesHtml(comm?.interviewerNotes || '');
      setInterviewerNotes(safeNotes);
      if (notesEditorRef.current) {
        notesEditorRef.current.innerHTML = safeNotes;
      }
      setIcbiAssessment(normalizeIcbiAssessment(editingCandidate.icbiAssessment));
    } else {
      setEtrfId('');
      setAppliedPosition('');
      setAppliedJobLevel('Non-Supervisor');
      setAppDate(new Date().toISOString().split('T')[0]);
      setAppSource('Jobstreet');
      setRelocation('Willing to Relocate');
      setIndustry('');
      setName('');
      setEmail('');
      setPhone('');
      setShowPhone2(false);
      setPhone2('');
      setBirthdate('');
      setAge('');
      setCivilStatus('Single');
      setAddress('');
      setFatherName('');
      setFatherStatus('Alive');
      setFatherWork('');
      setMotherName('');
      setMotherStatus('Alive');
      setMotherWork('');
      setSchool('');
      setDegree('');
      setMajor('');
      setYearGraduated('');
      setAdditionalEducations([]);
      setLicenses([{ title: '', number: '', exp: '' }]);
      setCertifications([{ name: '', issuer: '', year: '' }]);
      setWorkExperiences([
        {
          position: '',
          jobLevel: 'Non-Supervisor',
          company: '',
          fromDate: '',
          toDate: '',
          totalMonths: 0,
          reason: '',
        },
      ]);
      setWaiverEnabled(false);
      setAccentRating(3);
      setGrammarRating(3);
      setStructureRating(3);
      setFluencyRating(3);
      setInterviewerNotes('');
      if (notesEditorRef.current) {
        notesEditorRef.current.innerHTML = '';
      }
      setIcbiAssessment(createDefaultIcbiAssessment());
    }
  }, [isOpen, editingCandidate, initialTab, requests]);

  // Keep rich text editor DOM synced & scroll to top when switching tabs
  useEffect(() => {
    if (formTab === 'comms' && notesEditorRef.current) {
      notesEditorRef.current.innerHTML = interviewerNotes;
    }
    if (formScrollRef.current) {
      formScrollRef.current.scrollTop = 0;
    }
  }, [formTab]);

  if (!isOpen) return null;

  const commBreakdown = calculateCommAssessment({
    waiverEnabled,
    accentRating,
    grammarRating,
    structureRating,
    fluencyRating,
    interviewerNotes,
  });

  const roleContext = resolveCandidateRoleContext(
    {
      etrfId,
      appliedPosition,
      appliedJobLevel,
      workExperiences,
    },
    requests
  );

  const applyParsedResume = (rawText: string) => {
    const parsed = parseResumeText(rawText);
    if (parsed.email) setEmail(parsed.email);
    if (parsed.phone) setPhone(parsed.phone);
    if (parsed.phone2) {
      setShowPhone2(true);
      setPhone2(parsed.phone2);
    }
    if (parsed.name) setName(parsed.name);
    if (parsed.civilStatus) setCivilStatus(parsed.civilStatus);
    if (parsed.address) setAddress(parsed.address);
    if (parsed.school) setSchool(parsed.school);
    if (parsed.degree) setDegree(parsed.degree);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsParsingFile(true);
    try {
      const text = await extractTextFromResumeFile(file);
      applyParsedResume(text);
      onToast('Resume parsed & fields populated successfully!', 'success');
    } catch {
      onToast('Error reading file. Please input details manually.', 'error');
    } finally {
      setIsParsingFile(false);
      e.target.value = '';
    }
  };

  const handleParsePastedText = () => {
    if (!pastedResumeText.trim()) {
      onToast('Please paste resume text into the text box first.', 'error');
      return;
    }
    applyParsedResume(pastedResumeText);
    onToast('Pasted resume text parsed & fields populated!', 'success');
  };

  const handleBirthdateChange = (val: string) => {
    setBirthdate(val);
    const computed = calculateAgeFromBirthdate(val);
    if (computed !== null) {
      setAge(String(computed));
    }
  };

  const formatNote = (command: string) => {
    document.execCommand(command, false);
    if (notesEditorRef.current) {
      setInterviewerNotes(notesEditorRef.current.innerHTML);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const missing: string[] = [];
    if (!name.trim()) missing.push('Full Candidate Name');
    if (!email.trim()) missing.push('Email Address');
    if (!phone.trim()) missing.push('Primary Phone Number');
    if (!appDate) missing.push('Application Date');

    if (missing.length > 0) {
      setValidationError(`Please complete required Profile fields: ${missing.join(', ')}`);
      setFormTab('profile');
      return;
    }

    setValidationError(null);

    const currentNotesHtml = sanitizeNotesHtml(
      notesEditorRef.current ? notesEditorRef.current.innerHTML : interviewerNotes
    );

    const finalComm = calculateCommAssessment({
      waiverEnabled,
      accentRating,
      grammarRating,
      structureRating,
      fluencyRating,
      interviewerNotes: currentNotesHtml,
    }).assessment;

    const linkedReq = requests.find((r) => r.id === etrfId);
    const normalizedParents = normalizeParentsInfo(
      { name: fatherName, status: fatherStatus, work: fatherWork },
      { name: motherName, status: motherStatus, work: motherWork }
    );

    const candidateObj: Candidate = {
      id: editingCandidate?.id || `CAND-${Date.now()}`,
      etrfId,
      appliedPosition: appliedPosition.trim() || linkedReq?.position || undefined,
      appliedJobLevel: etrfId ? linkedReq?.jobLevel || appliedJobLevel : appliedJobLevel,
      appDate,
      appSource,
      relocation,
      industry: industry.trim(),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      phone2: showPhone2 ? phone2.trim() : '',
      birthdate,
      age: parseInt(age, 10) || 0,
      civilStatus,
      address: address.trim(),
      father: normalizedParents.father,
      mother: normalizedParents.mother,
      school: school.trim(),
      degree: degree.trim(),
      major: major.trim(),
      yearGraduated: yearGraduated.trim(),
      additionalEducations: additionalEducations.filter((ed) => ed.school.trim() || ed.degree.trim()),
      licenses: licenses.filter((l) => l.title.trim()),
      certifications: certifications.filter((c) => c.name.trim()),
      workExperiences: workExperiences.filter((w) => w.position.trim() || w.company.trim()),
      commAssessment: finalComm,
      icbiAssessment: normalizeIcbiAssessment(icbiAssessment),
    };

    onSave(candidateObj, Boolean(editingCandidate));
  };

  const parentRules = getParentFieldRules(fatherStatus, motherStatus);

  const handleFatherStatusChange = (nextStatus: ParentStatus) => {
    setFatherStatus(nextStatus);
    if (nextStatus === 'Deceased') {
      setFatherWork('');
    }
    if (nextStatus === 'Solo Parent') {
      setMotherName('');
      setMotherStatus('');
      setMotherWork('');
    } else if (fatherStatus === 'Solo Parent' && !motherStatus) {
      setMotherStatus('Alive');
    }
  };

  const handleMotherStatusChange = (nextStatus: ParentStatus) => {
    setMotherStatus(nextStatus);
    if (nextStatus === 'Deceased') {
      setMotherWork('');
    }
    if (nextStatus === 'Solo Parent') {
      setFatherName('');
      setFatherStatus('');
      setFatherWork('');
    } else if (motherStatus === 'Solo Parent' && !fatherStatus) {
      setFatherStatus('Alive');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="candidate-modal-title"
      className="fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
            <h3 id="candidate-modal-title" className="font-bold text-base">
              {editingCandidate ? 'Edit Candidate Profile' : 'Candidate Profile Enrollment'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close candidate profile modal"
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sliding Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/60 p-2 gap-2 px-6 flex-shrink-0">
          <button
            type="button"
            onClick={() => setFormTab('profile')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 ${
              formTab === 'profile'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>
          <button
            type="button"
            onClick={() => setFormTab('comms')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 ${
              formTab === 'comms'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Comms</span>
          </button>
          <button
            type="button"
            onClick={() => setFormTab('icbi')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 ${
              formTab === 'icbi'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>iCBI Matrix</span>
          </button>
        </div>

        <form
          ref={formScrollRef}
          id="form-candidate"
          noValidate
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto flex-1 space-y-6"
        >
          {validationError && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold"
            >
              {validationError}
            </div>
          )}

          {formTab === 'profile' ? (
            <div className="space-y-6">
              {/* Resume Parser */}
              <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-2.5">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                    <Bot className="w-4 h-4 text-emerald-500" />
                    Automated Resume Parser
                  </span>
                  <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setParseMode('file')}
                      className={`px-3 py-1 rounded-lg font-bold transition-colors flex items-center gap-1 ${
                        parseMode === 'file'
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <CloudUpload className="w-3.5 h-3.5" />
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setParseMode('paste')}
                      className={`px-3 py-1 rounded-lg font-bold transition-colors flex items-center gap-1 ${
                        parseMode === 'paste'
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <ClipboardPaste className="w-3.5 h-3.5" />
                      Paste Text
                    </button>
                  </div>
                </div>

                {parseMode === 'file' ? (
                  <div className="border-2 border-dashed border-emerald-300 dark:border-emerald-800 rounded-xl p-4 text-center relative bg-emerald-50/40 dark:bg-emerald-950/20">
                    <input
                      type="file"
                      accept=".docx,.pdf,.txt"
                      aria-label="Upload resume file"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="space-y-1.5">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                        <CloudUpload className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Upload Resume / CV Document (.DOCX, .PDF, or .TXT)
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Extracts phone numbers, email, education, and contact details
                        </p>
                      </div>
                      {isParsingFile && (
                        <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center gap-2 pt-1">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Parsing resume text &amp; auto-filling fields...</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label htmlFor="paste-resume-textarea" className="sr-only">
                      Paste resume text
                    </label>
                    <textarea
                      id="paste-resume-textarea"
                      rows={4}
                      value={pastedResumeText}
                      onChange={(e) => setPastedResumeText(e.target.value)}
                      placeholder="Paste full resume / CV text here (e.g. Contact details, work experience, education)..."
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-slate-800 dark:text-slate-100"
                    />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleParsePastedText}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Parse &amp; Auto-Fill Fields</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Application & Assignment Details */}
              <div className="bg-emerald-50/60 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/50">
                <h4 className="font-bold text-xs text-emerald-900 dark:text-emerald-400 mb-3 flex items-center gap-2">
                  <FileSignature className="w-4 h-4" />
                  Application &amp; Assignment Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="cand-etrf-id"
                      className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Assign to Open eTRF Position
                    </label>
                    <select
                      id="cand-etrf-id"
                      value={etrfId}
                      onChange={(e) => {
                        const nextId = e.target.value;
                        setEtrfId(nextId);
                        const nextReq = requests.find((r) => r.id === nextId);
                        if (nextReq) {
                          setAppliedPosition(nextReq.position);
                          setAppliedJobLevel(nextReq.jobLevel);
                        }
                      }}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                    >
                      <option value="">-- Unassigned (General Talent Pool) --</option>
                      {requests.map((req) => (
                        <option key={req.id} value={req.id}>
                          {req.etrfNumber} - {req.position} ({req.company})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="cand-app-date"
                      className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Application Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="cand-app-date"
                      type="date"
                      required
                      value={appDate}
                      onChange={(e) => setAppDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="cand-app-source"
                      className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Application Source <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="cand-app-source"
                      required
                      value={appSource}
                      onChange={(e) => setAppSource(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                    >
                      {APP_SOURCES.map((src) => (
                        <option key={src} value={src}>
                          {src}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="cand-relocation"
                      className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Relocation Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="cand-relocation"
                      required
                      value={relocation}
                      onChange={(e) => setRelocation(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                    >
                      {RELOCATION_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="cand-industry"
                      className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Industry Background (Type or Scroll Options)
                    </label>
                    <input
                      id="cand-industry"
                      list="industry-list"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="Type or select industry (e.g. Retail Operations)"
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                    />
                    <datalist id="industry-list">
                      {INDUSTRY_OPTIONS.map((ind) => (
                        <option key={ind} value={ind} />
                      ))}
                    </datalist>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="cand-applied-position"
                      className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Position Applied For
                    </label>
                    <input
                      id="cand-applied-position"
                      type="text"
                      value={appliedPosition}
                      onChange={(e) => setAppliedPosition(e.target.value)}
                      placeholder="e.g. Store Cashier / Merchandiser"
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="cand-applied-job-level"
                      className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Target Job Level (For iCBI Matrix)
                    </label>
                    <select
                      id="cand-applied-job-level"
                      value={appliedJobLevel}
                      onChange={(e) => setAppliedJobLevel(e.target.value as JobLevel)}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                    >
                      <option value="Non-Supervisor">Non-Supervisory</option>
                      <option value="Supervisory">Supervisory</option>
                      <option value="Managerial">Managerial</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h4 className="font-bold text-xs text-slate-500 dark:text-slate-400 mb-3 pb-1.5 border-b border-slate-200 dark:border-slate-800">
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="cand-name"
                      className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Full Candidate Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="cand-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Maria Clara Santos"
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="cand-email"
                      className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="cand-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. maria.santos@email.com"
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="cand-phone"
                      className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Primary Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="cand-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +63 917 123 4567"
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  {showPhone2 ? (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label
                          htmlFor="cand-phone2"
                          className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300"
                        >
                          Secondary Contact Number
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setShowPhone2(false);
                            setPhone2('');
                          }}
                          className="text-[11px] text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                      <input
                        id="cand-phone2"
                        type="tel"
                        value={phone2}
                        onChange={(e) => setPhone2(e.target.value)}
                        placeholder="e.g. (052) 480-1234"
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                  ) : (
                    <div className="flex items-end pb-1.5">
                      <button
                        type="button"
                        onClick={() => setShowPhone2(true)}
                        className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        Add Secondary Contact
                      </button>
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="cand-birthdate"
                      className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Birthdate
                    </label>
                    <input
                      id="cand-birthdate"
                      type="date"
                      value={birthdate}
                      onChange={(e) => handleBirthdateChange(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="cand-age"
                      className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Age
                    </label>
                    <input
                      id="cand-age"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Auto / Manual"
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="cand-civil-status"
                      className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Civil Status
                    </label>
                    <select
                      id="cand-civil-status"
                      value={civilStatus}
                      onChange={(e) => setCivilStatus(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                    >
                      {CIVIL_STATUS_OPTIONS.map((cs) => (
                        <option key={cs} value={cs}>
                          {cs}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="cand-address"
                      className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Complete Address
                    </label>
                    <input
                      id="cand-address"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Brgy. Imperial, Legazpi City, Albay"
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>

              {/* Parents Information */}
              <div>
                <h4 className="font-bold text-xs text-slate-500 dark:text-slate-400 mb-3 pb-1.5 border-b border-slate-200 dark:border-slate-800">
                  Parents Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    className={`bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 transition-opacity ${
                      parentRules.fatherSectionDisabled ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
                        Father&apos;s Details
                      </div>
                      {parentRules.fatherSectionDisabled && (
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                          No Input (Solo Parent)
                        </span>
                      )}
                    </div>
                    <div>
                      <label htmlFor="cand-father-name" className="block text-[11px] text-slate-500">
                        Father&apos;s Name
                      </label>
                      <input
                        id="cand-father-name"
                        type="text"
                        disabled={parentRules.fatherSectionDisabled}
                        value={parentRules.fatherSectionDisabled ? '' : fatherName}
                        onChange={(e) => setFatherName(e.target.value)}
                        placeholder={parentRules.fatherSectionDisabled ? '' : 'Full name'}
                        className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:bg-slate-100 disabled:dark:bg-slate-800/70 disabled:text-slate-400 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label
                          htmlFor="cand-father-status"
                          className="block text-[11px] text-slate-500"
                        >
                          Status
                        </label>
                        <select
                          id="cand-father-status"
                          disabled={parentRules.fatherSectionDisabled}
                          value={parentRules.fatherSectionDisabled ? '' : fatherStatus}
                          onChange={(e) => handleFatherStatusChange(e.target.value as ParentStatus)}
                          className="w-full px-2 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg disabled:bg-slate-100 disabled:dark:bg-slate-800/70 disabled:text-slate-400 disabled:cursor-not-allowed"
                        >
                          {parentRules.fatherSectionDisabled && <option value=""></option>}
                          {PARENT_STATUS_OPTIONS.map((statusOption) => (
                            <option key={statusOption} value={statusOption}>
                              {statusOption}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="cand-father-work"
                          className="block text-[11px] text-slate-500"
                        >
                          Occupation / Work
                        </label>
                        <input
                          id="cand-father-work"
                          type="text"
                          disabled={parentRules.fatherWorkDisabled}
                          value={parentRules.fatherWorkDisabled ? '' : fatherWork}
                          onChange={(e) => setFatherWork(e.target.value)}
                          placeholder={parentRules.fatherWorkDisabled ? '' : 'e.g. Farmer / Retired'}
                          className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg disabled:bg-slate-100 disabled:dark:bg-slate-800/70 disabled:text-slate-400 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  <div
                    className={`bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 transition-opacity ${
                      parentRules.motherSectionDisabled ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
                        Mother&apos;s Details
                      </div>
                      {parentRules.motherSectionDisabled && (
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                          No Input (Solo Parent)
                        </span>
                      )}
                    </div>
                    <div>
                      <label htmlFor="cand-mother-name" className="block text-[11px] text-slate-500">
                        Mother&apos;s Name
                      </label>
                      <input
                        id="cand-mother-name"
                        type="text"
                        disabled={parentRules.motherSectionDisabled}
                        value={parentRules.motherSectionDisabled ? '' : motherName}
                        onChange={(e) => setMotherName(e.target.value)}
                        placeholder={
                          parentRules.motherSectionDisabled ? '' : 'Maiden / Full name'
                        }
                        className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:bg-slate-100 disabled:dark:bg-slate-800/70 disabled:text-slate-400 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label
                          htmlFor="cand-mother-status"
                          className="block text-[11px] text-slate-500"
                        >
                          Status
                        </label>
                        <select
                          id="cand-mother-status"
                          disabled={parentRules.motherSectionDisabled}
                          value={parentRules.motherSectionDisabled ? '' : motherStatus}
                          onChange={(e) => handleMotherStatusChange(e.target.value as ParentStatus)}
                          className="w-full px-2 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg disabled:bg-slate-100 disabled:dark:bg-slate-800/70 disabled:text-slate-400 disabled:cursor-not-allowed"
                        >
                          {parentRules.motherSectionDisabled && <option value=""></option>}
                          {PARENT_STATUS_OPTIONS.map((statusOption) => (
                            <option key={statusOption} value={statusOption}>
                              {statusOption}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="cand-mother-work"
                          className="block text-[11px] text-slate-500"
                        >
                          Occupation / Work
                        </label>
                        <input
                          id="cand-mother-work"
                          type="text"
                          disabled={parentRules.motherWorkDisabled}
                          value={parentRules.motherWorkDisabled ? '' : motherWork}
                          onChange={(e) => setMotherWork(e.target.value)}
                          placeholder={
                            parentRules.motherWorkDisabled ? '' : 'e.g. Homemaker / Teacher'
                          }
                          className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg disabled:bg-slate-100 disabled:dark:bg-slate-800/70 disabled:text-slate-400 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Primary Education */}
              <div>
                <h4 className="font-bold text-xs text-slate-500 dark:text-slate-400 mb-3 pb-1.5 border-b border-slate-200 dark:border-slate-800">
                  Primary Academic Attainment
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="cand-school"
                      className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Primary School / University
                    </label>
                    <input
                      id="cand-school"
                      type="text"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      placeholder="e.g. Bicol University"
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cand-degree"
                      className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Degree Earned
                    </label>
                    <input
                      id="cand-degree"
                      type="text"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      placeholder="e.g. BS Business Administration"
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cand-major"
                      className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Major / Specialization
                    </label>
                    <input
                      id="cand-major"
                      type="text"
                      value={major}
                      onChange={(e) => setMajor(e.target.value)}
                      placeholder="e.g. Human Resource Management"
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="cand-year-graduated"
                      className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Year Graduated
                    </label>
                    <input
                      id="cand-year-graduated"
                      type="text"
                      value={yearGraduated}
                      onChange={(e) => setYearGraduated(e.target.value)}
                      placeholder="e.g. 2022"
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Education */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-xs text-slate-500 dark:text-slate-400">
                    Additional Education Background
                  </h4>
                  <button
                    type="button"
                    onClick={() =>
                      setAdditionalEducations([
                        ...additionalEducations,
                        { school: '', degree: '', major: '', year: '' },
                      ])
                    }
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Add Education
                  </button>
                </div>
                <div className="space-y-3">
                  {additionalEducations.map((edu, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 relative"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setAdditionalEducations(additionalEducations.filter((_, i) => i !== idx))
                        }
                        aria-label={`Remove additional education ${idx + 1}`}
                        className="absolute top-2 right-2 p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-8">
                        <input
                          type="text"
                          placeholder="School / University"
                          aria-label={`Additional school ${idx + 1}`}
                          value={edu.school}
                          onChange={(e) => {
                            const next = [...additionalEducations];
                            next[idx] = { ...edu, school: e.target.value };
                            setAdditionalEducations(next);
                          }}
                          className="sm:col-span-2 px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                        />
                        <input
                          type="text"
                          placeholder="Degree"
                          aria-label={`Additional degree ${idx + 1}`}
                          value={edu.degree}
                          onChange={(e) => {
                            const next = [...additionalEducations];
                            next[idx] = { ...edu, degree: e.target.value };
                            setAdditionalEducations(next);
                          }}
                          className="px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                        />
                        <input
                          type="text"
                          placeholder="Major / Specialization"
                          aria-label={`Additional major ${idx + 1}`}
                          value={edu.major}
                          onChange={(e) => {
                            const next = [...additionalEducations];
                            next[idx] = { ...edu, major: e.target.value };
                            setAdditionalEducations(next);
                          }}
                          className="px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                        />
                        <input
                          type="text"
                          placeholder="Year Graduated"
                          aria-label={`Additional graduation year ${idx + 1}`}
                          value={edu.year}
                          onChange={(e) => {
                            const next = [...additionalEducations];
                            next[idx] = { ...edu, year: e.target.value };
                            setAdditionalEducations(next);
                          }}
                          className="px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Professional Licenses */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-xs text-slate-500 dark:text-slate-400">
                    Professional Licenses
                  </h4>
                  <button
                    type="button"
                    onClick={() => setLicenses([...licenses, { title: '', number: '', exp: '' }])}
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Add License
                  </button>
                </div>
                <div className="space-y-2">
                  {licenses.map((lic, idx) => (
                    <div
                      key={idx}
                      className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl border border-slate-200 dark:border-slate-800"
                    >
                      <input
                        type="text"
                        placeholder="License Title (e.g. PRC Registered Nurse)"
                        aria-label={`License title ${idx + 1}`}
                        value={lic.title}
                        onChange={(e) => {
                          const next = [...licenses];
                          next[idx] = { ...lic, title: e.target.value };
                          setLicenses(next);
                        }}
                        className="flex-1 min-w-[160px] px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="License No."
                        aria-label={`License number ${idx + 1}`}
                        value={lic.number}
                        onChange={(e) => {
                          const next = [...licenses];
                          next[idx] = { ...lic, number: e.target.value };
                          setLicenses(next);
                        }}
                        className="w-28 px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                      />
                      <input
                        type="date"
                        aria-label={`License expiry ${idx + 1}`}
                        value={lic.exp}
                        onChange={(e) => {
                          const next = [...licenses];
                          next[idx] = { ...lic, exp: e.target.value };
                          setLicenses(next);
                        }}
                        className="w-32 px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setLicenses(licenses.filter((_, i) => i !== idx))}
                        aria-label={`Remove license ${idx + 1}`}
                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-xs text-slate-500 dark:text-slate-400">
                    Certifications &amp; Credentials
                  </h4>
                  <button
                    type="button"
                    onClick={() =>
                      setCertifications([...certifications, { name: '', issuer: '', year: '' }])
                    }
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Add Certification
                  </button>
                </div>
                <div className="space-y-2">
                  {certifications.map((cert, idx) => (
                    <div
                      key={idx}
                      className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl border border-slate-200 dark:border-slate-800"
                    >
                      <input
                        type="text"
                        placeholder="Certification Name"
                        aria-label={`Certification name ${idx + 1}`}
                        value={cert.name}
                        onChange={(e) => {
                          const next = [...certifications];
                          next[idx] = { ...cert, name: e.target.value };
                          setCertifications(next);
                        }}
                        className="flex-1 min-w-[160px] px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Issuing Organization"
                        aria-label={`Certification issuer ${idx + 1}`}
                        value={cert.issuer}
                        onChange={(e) => {
                          const next = [...certifications];
                          next[idx] = { ...cert, issuer: e.target.value };
                          setCertifications(next);
                        }}
                        className="flex-1 min-w-[140px] px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Year"
                        aria-label={`Certification year ${idx + 1}`}
                        value={cert.year}
                        onChange={(e) => {
                          const next = [...certifications];
                          next[idx] = { ...cert, year: e.target.value };
                          setCertifications(next);
                        }}
                        className="w-20 px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setCertifications(certifications.filter((_, i) => i !== idx))
                        }
                        aria-label={`Remove certification ${idx + 1}`}
                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Work Experience History */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3 pb-1.5 border-b border-slate-200 dark:border-slate-800">
                  <h4 className="font-bold text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                    Work Experience History
                  </h4>
                  <button
                    type="button"
                    onClick={() =>
                      setWorkExperiences([
                        ...workExperiences,
                        {
                          position: '',
                          jobLevel: 'Non-Supervisor',
                          company: '',
                          fromDate: '',
                          toDate: '',
                          totalMonths: 0,
                          reason: '',
                        },
                      ])
                    }
                    className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Work Experience Slot
                  </button>
                </div>
                <div className="space-y-3">
                  {workExperiences.map((exp, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 relative"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setWorkExperiences(workExperiences.filter((_, i) => i !== idx))
                        }
                        aria-label={`Remove work experience ${idx + 1}`}
                        className="absolute top-2 right-2 p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pr-8">
                        <div>
                          <label className="block text-[11px] text-slate-500">Position Title</label>
                          <input
                            type="text"
                            placeholder="e.g. Shift Manager"
                            value={exp.position}
                            onChange={(e) => {
                              const next = [...workExperiences];
                              next[idx] = { ...exp, position: e.target.value };
                              setWorkExperiences(next);
                            }}
                            className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-500">Job Level</label>
                          <select
                            value={exp.jobLevel}
                            onChange={(e) => {
                              const next = [...workExperiences];
                              next[idx] = { ...exp, jobLevel: e.target.value as JobLevel };
                              setWorkExperiences(next);
                            }}
                            className="w-full px-2 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                          >
                            {JOB_LEVELS.map((lvl) => (
                              <option key={lvl} value={lvl}>
                                {lvl}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-500">Company Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Retail Corp"
                            value={exp.company}
                            onChange={(e) => {
                              const next = [...workExperiences];
                              next[idx] = { ...exp, company: e.target.value };
                              setWorkExperiences(next);
                            }}
                            className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-500">From Date</label>
                          <input
                            type="date"
                            value={exp.fromDate}
                            onChange={(e) => {
                              const fromDate = e.target.value;
                              const totalMonths = calculateMonthsBetween(fromDate, exp.toDate);
                              const next = [...workExperiences];
                              next[idx] = { ...exp, fromDate, totalMonths };
                              setWorkExperiences(next);
                            }}
                            className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-500">To Date</label>
                          <input
                            type="date"
                            value={exp.toDate}
                            onChange={(e) => {
                              const toDate = e.target.value;
                              const totalMonths = calculateMonthsBetween(exp.fromDate, toDate);
                              const next = [...workExperiences];
                              next[idx] = { ...exp, toDate, totalMonths };
                              setWorkExperiences(next);
                            }}
                            className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-500">Total Months</label>
                          <input
                            type="number"
                            readOnly
                            value={exp.totalMonths}
                            className="w-full px-2.5 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono font-bold tabular-nums"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <label className="block text-[11px] text-slate-500">
                            Reason for Leaving
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Career Growth / Relocation"
                            value={exp.reason}
                            onChange={(e) => {
                              const next = [...workExperiences];
                              next[idx] = { ...exp, reason: e.target.value };
                              setWorkExperiences(next);
                            }}
                            className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : formTab === 'comms' ? (
            <div className="space-y-6">
              <div className="bg-purple-50/70 dark:bg-purple-950/30 p-5 rounded-2xl border border-purple-200 dark:border-purple-800/60 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-200 dark:border-purple-800/50">
                  <div>
                    <h4 className="font-bold text-xs text-purple-900 dark:text-purple-300 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      Communication Assessment (CEFR Rating)
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Evaluate speech components, weighted points, and behavioral descriptors.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 shrink-0">
                    <label
                      htmlFor="comm-waiver-toggle"
                      className="text-[11px] font-bold text-slate-800 dark:text-slate-200 cursor-pointer whitespace-nowrap"
                    >
                      Local Dialect Waiver
                    </label>
                    <label className="relative inline-flex items-center cursor-pointer w-9 h-5 shrink-0">
                      <input
                        id="comm-waiver-toggle"
                        type="checkbox"
                        checked={waiverEnabled}
                        onChange={(e) => setWaiverEnabled(e.target.checked)}
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10 peer"
                      />
                      <div className="pointer-events-none w-9 h-5 bg-slate-300 dark:bg-slate-700 rounded-full peer peer-focus-visible:ring-2 peer-focus-visible:ring-purple-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600" />
                    </label>
                  </div>
                </div>

                {/* 4 Criteria Cards */}
                <div className="space-y-3">
                  {[
                    {
                      key: 'accent' as const,
                      title: 'ACCENT and PRONUNCIATION',
                      weight: 'Weight: 20%',
                      subtitle:
                        'Production of vowel/consonant sounds, syllable stress, rate of speech & neutrality',
                      rating: accentRating,
                      setRating: setAccentRating,
                      pts: commBreakdown.ptsAccent,
                      max: 20,
                    },
                    {
                      key: 'grammar' as const,
                      title: 'GRAMMAR',
                      weight: 'Weight: 20%',
                      subtitle:
                        'Subject-verb agreement, tenses, pronouns, prepositions, articles & sentence structure',
                      rating: grammarRating,
                      setRating: setGrammarRating,
                      pts: commBreakdown.ptsGrammar,
                      max: 20,
                    },
                    {
                      key: 'structure' as const,
                      title: 'STRUCTURE & CLARITY OF THOUGHT',
                      weight: 'Weight: 30%',
                      subtitle:
                        'Logical organization of main points (PREP/FDS/chronological) & smooth transitions',
                      rating: structureRating,
                      setRating: setStructureRating,
                      pts: commBreakdown.ptsStructure,
                      max: 30,
                    },
                    {
                      key: 'fluency' as const,
                      title: 'FLUENCY',
                      weight: 'Weight: 30%',
                      subtitle:
                        'Spontaneity, confidence & smooth articulation without distracting fillers or dead air',
                      rating: fluencyRating,
                      setRating: setFluencyRating,
                      pts: commBreakdown.ptsFluency,
                      max: 30,
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div>
                          <span className="font-bold text-xs text-slate-800 dark:text-slate-100">
                            {item.title}
                          </span>
                          <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 ml-2">
                            ({item.weight})
                          </span>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {item.subtitle}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div>
                            <label
                              htmlFor={`comm-rating-${item.key}`}
                              className="block text-[10px] font-bold text-slate-500"
                            >
                              Rating (1-5)
                            </label>
                            <select
                              id={`comm-rating-${item.key}`}
                              value={item.rating}
                              onChange={(e) => item.setRating(Number(e.target.value))}
                              className="px-2.5 py-1 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-purple-700 dark:text-purple-300"
                            >
                              {[1, 2, 3, 4, 5].map((r) => (
                                <option key={r} value={r}>
                                  {r}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="text-right min-w-[54px]">
                            <span className="block text-[10px] font-bold text-slate-500">
                              Points
                            </span>
                            <span className="font-mono tabular-nums text-xs font-extrabold text-slate-800 dark:text-slate-200">
                              {item.pts} / {item.max}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-[11px] italic p-2.5 bg-slate-50 dark:bg-slate-950/60 rounded-lg text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                        {COMM_DESCRIPTORS[item.key][item.rating]}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Communication Results Summary */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-purple-200 dark:border-purple-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="block text-[11px] font-semibold text-slate-500">
                        Total Score
                      </span>
                      <span
                        data-testid="comm-total-score"
                        className="text-2xl font-black text-purple-900 dark:text-purple-200 font-mono tabular-nums"
                      >
                        {commBreakdown.assessment.totalScore}/100
                      </span>
                    </div>
                    <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700" />
                    <div>
                      <span className="block text-[11px] font-semibold text-slate-500">
                        CEFR Level
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        {commBreakdown.assessment.cefrLevel}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span
                      data-testid="comm-result-badge"
                      className={`px-3 py-1.5 rounded-lg text-xs font-extrabold border inline-block ${
                        commBreakdown.assessment.result.includes('Pass')
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                          : 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-300 dark:border-red-800'
                      }`}
                    >
                      {commBreakdown.assessment.result} (
                      {commBreakdown.assessment.cefrLevel.split(' ')[0]})
                    </span>
                  </div>
                </div>

                {/* Interviewer Notes */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-purple-200 dark:border-purple-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                      <SquarePen className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      Interviewer Notes
                    </span>
                    <span className="text-[11px] text-slate-400">Rich Formatting Enabled</span>
                  </div>

                  <div className="border border-purple-200 dark:border-purple-800/70 rounded-xl overflow-hidden">
                    <div className="flex items-center gap-1 p-1.5 bg-purple-50/70 dark:bg-slate-800 border-b border-purple-200 dark:border-purple-800/70">
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          formatNote('bold');
                        }}
                        aria-label="Bold"
                        title="Bold"
                        className="p-1.5 px-2.5 hover:bg-purple-200/60 dark:hover:bg-slate-700 rounded transition-colors text-slate-700 dark:text-slate-200"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          formatNote('italic');
                        }}
                        aria-label="Italic"
                        title="Italic"
                        className="p-1.5 px-2.5 hover:bg-purple-200/60 dark:hover:bg-slate-700 rounded transition-colors text-slate-700 dark:text-slate-200"
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          formatNote('underline');
                        }}
                        aria-label="Underline"
                        title="Underline"
                        className="p-1.5 px-2.5 hover:bg-purple-200/60 dark:hover:bg-slate-700 rounded transition-colors text-slate-700 dark:text-slate-200"
                      >
                        <Underline className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          formatNote('strikeThrough');
                        }}
                        aria-label="Strikethrough"
                        title="Strikethrough"
                        className="p-1.5 px-2.5 hover:bg-purple-200/60 dark:hover:bg-slate-700 rounded transition-colors text-slate-700 dark:text-slate-200"
                      >
                        <Strikethrough className="w-3.5 h-3.5" />
                      </button>
                      <div className="h-4 w-[1px] bg-purple-200 dark:bg-slate-700 mx-1" />
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          formatNote('insertUnorderedList');
                        }}
                        aria-label="Bulleted List"
                        title="Bulleted List"
                        className="p-1.5 px-2.5 hover:bg-purple-200/60 dark:hover:bg-slate-700 rounded transition-colors text-slate-700 dark:text-slate-200"
                      >
                        <List className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div
                      ref={notesEditorRef}
                      contentEditable
                      aria-label="Interviewer notes editor"
                      onInput={(e) => setInterviewerNotes(e.currentTarget.innerHTML)}
                      className="interviewer-notes-editor p-3 text-xs min-h-[110px] max-h-[220px] overflow-y-auto focus:outline-none text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <IcbiMatrixSection
              assessment={icbiAssessment}
              roleContext={roleContext}
              onChange={setIcbiAssessment}
            />
          )}
        </form>

        {/* Sticky Footer with Cancel & Save */}
        <div className="bg-slate-50 dark:bg-slate-900/90 px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="form-candidate"
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors"
          >
            Save Candidate Profile
          </button>
        </div>
      </div>
    </div>
  );
}
