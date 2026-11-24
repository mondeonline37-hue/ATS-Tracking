import React, { useEffect, useState } from 'react';
import { FileSignature, Network, Sparkles, X } from 'lucide-react';
import { COMPANIES, JOB_LEVELS, SBUS, WORK_ARRANGEMENTS } from '../data/constants';
import { JobLevel, TalentRequest, WorkArrangement } from '../types/ta';
import { generateEtrfNumber, getEtrfHierarchyLabels } from '../utils/taLogic';

interface TalentRequestModalProps {
  isOpen: boolean;
  editingRequest: TalentRequest | null;
  onClose: () => void;
  onSave: (request: TalentRequest, isEdit: boolean) => void;
}

export function TalentRequestModal({
  isOpen,
  editingRequest,
  onClose,
  onSave,
}: TalentRequestModalProps) {
  const [etrfNumber, setEtrfNumber] = useState('');
  const [dateRequested, setDateRequested] = useState('');
  const [position, setPosition] = useState('');
  const [location, setLocation] = useState('');
  const [sbu, setSbu] = useState<string>(SBUS[0]);
  const [company, setCompany] = useState<string>(COMPANIES[0]);
  const [department, setDepartment] = useState('');
  const [workArrangement, setWorkArrangement] = useState<WorkArrangement>('On-Site');
  const [jobLevel, setJobLevel] = useState<JobLevel>('Non-Supervisor');
  const [salaryGrade, setSalaryGrade] = useState('');
  const [negotiable, setNegotiable] = useState(false);
  const [maxSalary, setMaxSalary] = useState('');
  const [areaManager, setAreaManager] = useState('');
  const [storeManager, setStoreManager] = useState('');
  const [hrbp, setHrbp] = useState('');
  const [srHrbp, setSrHrbp] = useState('');
  const [hrOps, setHrOps] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    if (editingRequest) {
      setEtrfNumber(editingRequest.etrfNumber || '');
      setDateRequested(editingRequest.dateRequested || '');
      setPosition(editingRequest.position || '');
      setLocation(editingRequest.location || '');
      setSbu(editingRequest.sbu || SBUS[0]);
      setCompany(editingRequest.company || COMPANIES[0]);
      setDepartment(editingRequest.department || '');
      setWorkArrangement(editingRequest.workArrangement || 'On-Site');
      setJobLevel(editingRequest.jobLevel || 'Non-Supervisor');
      setSalaryGrade(editingRequest.salaryGrade || '');
      setNegotiable(Boolean(editingRequest.negotiable));
      setMaxSalary(editingRequest.maxSalary || '');
      setAreaManager(editingRequest.areaManager || '');
      setStoreManager(editingRequest.storeManager || '');
      setHrbp(editingRequest.hrbp || '');
      setSrHrbp(editingRequest.srHrbp || '');
      setHrOps(editingRequest.hrOps || '');
    } else {
      setEtrfNumber(generateEtrfNumber());
      setDateRequested(new Date().toISOString().split('T')[0]);
      setPosition('');
      setLocation('');
      setSbu(SBUS[0]);
      setCompany(COMPANIES[0]);
      setDepartment('');
      setWorkArrangement('On-Site');
      setJobLevel('Non-Supervisor');
      setSalaryGrade('');
      setNegotiable(false);
      setMaxSalary('');
      setAreaManager('');
      setStoreManager('');
      setHrbp('');
      setSrHrbp('');
      setHrOps('');
    }
  }, [isOpen, editingRequest]);

  if (!isOpen) return null;

  const hierarchyLabels = getEtrfHierarchyLabels(sbu);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requestObj: TalentRequest = {
      id: editingRequest?.id || `REQ-${Date.now()}`,
      etrfNumber: etrfNumber.trim(),
      dateRequested,
      position: position.trim(),
      location: location.trim(),
      sbu,
      company,
      department: department.trim(),
      workArrangement,
      jobLevel,
      salaryGrade: salaryGrade.trim(),
      negotiable,
      maxSalary: negotiable ? maxSalary.trim() : '',
      areaManager: areaManager.trim(),
      storeManager: storeManager.trim(),
      hrbp: hrbp.trim(),
      srHrbp: srHrbp.trim(),
      hrOps: hrOps.trim(),
    };
    onSave(requestObj, Boolean(editingRequest));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="etrf-modal-title"
      className="fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between flex-shrink-0 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <FileSignature className="w-5 h-5 text-blue-400" />
            <h3 id="etrf-modal-title" className="font-bold text-base">
              {editingRequest
                ? 'Edit Talent Request (eTRF)'
                : 'Electronic Talent Request Form (eTRF)'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close eTRF modal"
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="bg-blue-50/70 dark:bg-blue-950/30 p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex-1">
              <label
                htmlFor="req-etrf-num"
                className="block text-xs font-bold text-blue-900 dark:text-blue-300 mb-1"
              >
                eTRF Tracking Number <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-2">
                <input
                  id="req-etrf-num"
                  type="text"
                  required
                  value={etrfNumber}
                  onChange={(e) => setEtrfNumber(e.target.value)}
                  placeholder="TRF-2026-XXXX"
                  className="w-full px-3 py-2 text-xs font-mono font-bold text-blue-900 dark:text-blue-200 bg-white dark:bg-slate-900 border border-blue-300 dark:border-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setEtrfNumber(generateEtrfNumber())}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 flex-shrink-0 whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Auto Gen
                </button>
              </div>
            </div>
            <div>
              <label
                htmlFor="req-date"
                className="block text-xs font-bold text-blue-900 dark:text-blue-300 mb-1"
              >
                Date Requested <span className="text-red-500">*</span>
              </label>
              <input
                id="req-date"
                type="date"
                required
                value={dateRequested}
                onChange={(e) => setDateRequested(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-blue-300 dark:border-blue-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="req-position"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Position / Role Title <span className="text-red-500">*</span>
              </label>
              <input
                id="req-position"
                type="text"
                required
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="e.g. Senior Operations Manager"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label
                htmlFor="req-location"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Location <span className="text-red-500">*</span>
              </label>
              <input
                id="req-location"
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Legazpi City, Albay"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label
                htmlFor="req-sbu"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                SBU <span className="text-red-500">*</span>
              </label>
              <select
                id="req-sbu"
                required
                value={sbu}
                onChange={(e) => setSbu(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
              >
                {SBUS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="req-company"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Company <span className="text-red-500">*</span>
              </label>
              <select
                id="req-company"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
              >
                {COMPANIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="req-department"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Department (Free-form) <span className="text-red-500">*</span>
              </label>
              <input
                id="req-department"
                type="text"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Store Operations"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label
                htmlFor="req-work-arrangement"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Work Arrangement <span className="text-red-500">*</span>
              </label>
              <select
                id="req-work-arrangement"
                required
                value={workArrangement}
                onChange={(e) => setWorkArrangement(e.target.value as WorkArrangement)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
              >
                {WORK_ARRANGEMENTS.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="req-job-level"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Job Level <span className="text-red-500">*</span>
              </label>
              <select
                id="req-job-level"
                required
                value={jobLevel}
                onChange={(e) => setJobLevel(e.target.value as JobLevel)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
              >
                {JOB_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="req-salary"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Salary Grade / Budget <span className="text-red-500">*</span>
              </label>
              <input
                id="req-salary"
                type="text"
                required
                value={salaryGrade}
                onChange={(e) => setSalaryGrade(e.target.value)}
                placeholder="e.g. ₱35,000 / month"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <label
                htmlFor="req-negotiable"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Salary Negotiable?
              </label>
              <label className="relative inline-flex items-center cursor-pointer w-11 h-6">
                <input
                  id="req-negotiable"
                  type="checkbox"
                  checked={negotiable}
                  onChange={(e) => setNegotiable(e.target.checked)}
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10 peer"
                />
                <div className="pointer-events-none w-11 h-6 bg-slate-300 dark:bg-slate-700 rounded-full peer peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
              </label>
            </div>

            {negotiable && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <label
                  htmlFor="req-max-salary"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                >
                  Maximum Negotiable Amount
                </label>
                <input
                  id="req-max-salary"
                  type="text"
                  value={maxSalary}
                  onChange={(e) => setMaxSalary(e.target.value)}
                  placeholder="e.g. Up to ₱45,000 / month"
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
                />
              </div>
            )}
          </div>

          <div className="pt-2">
            <h4 className="font-bold text-xs tracking-wide text-indigo-600 dark:text-indigo-400 border-b border-slate-200 dark:border-slate-800 pb-2 mb-3 flex items-center gap-1.5">
              <Network className="w-4 h-4" />
              Organizational &amp; Approval Hierarchy
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="req-store-manager"
                  className="block text-[11px] font-bold text-slate-900 dark:text-white mb-1"
                >
                  {hierarchyLabels.firstLevelLabel}
                </label>
                <input
                  id="req-store-manager"
                  type="text"
                  value={storeManager}
                  onChange={(e) => setStoreManager(e.target.value)}
                  placeholder="e.g. Elena Vance"
                  className="w-full px-3 py-1.5 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label
                  htmlFor="req-area-manager"
                  className="block text-[11px] font-bold text-slate-900 dark:text-white mb-1"
                >
                  {hierarchyLabels.secondLevelLabel}
                </label>
                <input
                  id="req-area-manager"
                  type="text"
                  value={areaManager}
                  onChange={(e) => setAreaManager(e.target.value)}
                  placeholder="e.g. Roberto Gomez"
                  className="w-full px-3 py-1.5 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label
                  htmlFor="req-hrbp"
                  className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1"
                >
                  HRBP (HR Business Partner)
                </label>
                <input
                  id="req-hrbp"
                  type="text"
                  value={hrbp}
                  onChange={(e) => setHrbp(e.target.value)}
                  placeholder="e.g. Mark Anthony Ramos"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label
                  htmlFor="req-sr-hrbp"
                  className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1"
                >
                  Senior HRBP
                </label>
                <input
                  id="req-sr-hrbp"
                  type="text"
                  value={srHrbp}
                  onChange={(e) => setSrHrbp(e.target.value)}
                  placeholder="e.g. Patricia Villanueva"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="req-hrops"
                  className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1"
                >
                  HROps (HR Operations Representative)
                </label>
                <input
                  id="req-hrops"
                  type="text"
                  value={hrOps}
                  onChange={(e) => setHrOps(e.target.value)}
                  placeholder="e.g. Jerome Cortez"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-300"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
            >
              Save eTRF Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
