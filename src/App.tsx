import React, { useEffect, useMemo, useState } from 'react';
import {
  INITIAL_SEED_CANDIDATES,
  INITIAL_SEED_REQUESTS,
  STORAGE_KEY_CANDIDATES,
  STORAGE_KEY_REQUESTS,
} from './data/constants';
import {
  Candidate,
  ConfirmDialogState,
  TabId,
  TalentRequest,
  ToastMessage,
} from './types/ta';
import {
  filterCandidates,
  filterTalentRequests,
  generateEtrfNumber,
} from './utils/taLogic';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { RequestsTableView } from './components/RequestsTableView';
import { CandidatesTableView } from './components/CandidatesTableView';
import { TalentRequestModal } from './components/TalentRequestModal';
import { ViewEtrfModal } from './components/ViewEtrfModal';
import { CandidateFormModal } from './components/CandidateFormModal';
import { ViewCandidateModal } from './components/ViewCandidateModal';
import { ConfirmModal } from './components/ConfirmModal';
import { ToastContainer } from './components/ToastContainer';

function loadInitialRequests(): TalentRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REQUESTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Fallback to seed data
  }
  return structuredClone(INITIAL_SEED_REQUESTS);
}

function loadInitialCandidates(): Candidate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CANDIDATES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Fallback to seed data
  }
  return structuredClone(INITIAL_SEED_CANDIDATES);
}

export default function App() {
  const [requests, setRequests] = useState<TalentRequest[]>(loadInitialRequests);
  const [candidates, setCandidates] = useState<Candidate[]>(loadInitialCandidates);
  const [currentTab, setCurrentTab] = useState<TabId>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filters
  const [reqCompanyFilter, setReqCompanyFilter] = useState('ALL');
  const [reqLevelFilter, setReqLevelFilter] = useState('ALL');
  const [candAssignFilter, setCandAssignFilter] = useState('ALL');
  const [candSourceFilter, setCandSourceFilter] = useState('ALL');

  // Modals
  const [etrfModalOpen, setEtrfModalOpen] = useState(false);
  const [editingRequestId, setEditingRequestId] = useState<string | null>(null);
  const [viewingRequestId, setViewingRequestId] = useState<string | null>(null);

  const [candModalOpen, setCandModalOpen] = useState(false);
  const [editingCandidateId, setEditingCandidateId] = useState<string | null>(null);
  const [candFormInitialTab, setCandFormInitialTab] = useState<'profile' | 'comms' | 'icbi'>('profile');
  const [viewingCandidateId, setViewingCandidateId] = useState<string | null>(null);

  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    title: '',
    message: '',
    actionText: 'Delete',
    variant: 'danger',
    onConfirm: () => {},
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(requests));
    } catch {
      // Ignore storage quota errors
    }
  }, [requests]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CANDIDATES, JSON.stringify(candidates));
    } catch {
      // Ignore storage quota errors
    }
  }, [candidates]);

  // Sync dark class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const showToast = (message: string, type: ToastMessage['type'] = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const filteredRequests = useMemo(
    () => filterTalentRequests(requests, reqCompanyFilter, reqLevelFilter, searchQuery),
    [requests, reqCompanyFilter, reqLevelFilter, searchQuery]
  );

  const filteredCandidates = useMemo(
    () => filterCandidates(candidates, candAssignFilter, candSourceFilter, searchQuery),
    [candidates, candAssignFilter, candSourceFilter, searchQuery]
  );

  const editingRequest = useMemo(
    () => requests.find((r) => r.id === editingRequestId) || null,
    [requests, editingRequestId]
  );

  const viewingRequest = useMemo(
    () => requests.find((r) => r.id === viewingRequestId) || null,
    [requests, viewingRequestId]
  );

  const editingCandidate = useMemo(
    () => candidates.find((c) => c.id === editingCandidateId) || null,
    [candidates, editingCandidateId]
  );

  const viewingCandidate = useMemo(
    () => candidates.find((c) => c.id === viewingCandidateId) || null,
    [candidates, viewingCandidateId]
  );

  // Handlers
  const handleSaveRequest = (requestObj: TalentRequest, isEdit: boolean) => {
    if (isEdit) {
      setRequests((prev) => prev.map((r) => (r.id === requestObj.id ? requestObj : r)));
      showToast('eTRF Request updated successfully!', 'success');
    } else {
      setRequests((prev) => [requestObj, ...prev]);
      showToast('eTRF Request created successfully!', 'success');
    }
    setEtrfModalOpen(false);
    setEditingRequestId(null);
  };

  const handleDuplicateRequest = (id: string) => {
    const original = requests.find((r) => r.id === id);
    if (!original) return;
    const clone: TalentRequest = {
      ...structuredClone(original),
      id: `REQ-${Date.now()}`,
      etrfNumber: generateEtrfNumber(),
      position: `${original.position} (Copy)`,
    };
    setRequests((prev) => [clone, ...prev]);
    showToast(`eTRF Request duplicated as ${clone.etrfNumber}`, 'success');
  };

  const handleDeleteRequestConfirm = (id: string) => {
    const req = requests.find((r) => r.id === id);
    setConfirmDialog({
      isOpen: true,
      title: 'Delete eTRF Request',
      message: `Are you sure you want to delete ${req?.etrfNumber || 'this request'}? This action cannot be undone.`,
      actionText: 'Delete',
      variant: 'danger',
      onConfirm: () => {
        setRequests((prev) => prev.filter((r) => r.id !== id));
        setCandidates((prev) =>
          prev.map((c) => (c.etrfId === id ? { ...c, etrfId: '' } : c))
        );
        showToast('eTRF Request deleted.', 'info');
      },
    });
  };

  const handleSaveCandidate = (candidateObj: Candidate, isEdit: boolean) => {
    if (isEdit) {
      setCandidates((prev) => prev.map((c) => (c.id === candidateObj.id ? candidateObj : c)));
    } else {
      setCandidates((prev) => [candidateObj, ...prev]);
    }
    setCandModalOpen(false);
    setEditingCandidateId(null);
    setCandFormInitialTab('profile');
    showToast('Candidate Profile saved successfully!', 'success');
  };

  const handleDuplicateCandidate = (id: string) => {
    const original = candidates.find((c) => c.id === id);
    if (!original) return;
    const clone: Candidate = {
      ...structuredClone(original),
      id: `CAND-${Date.now()}`,
      name: `${original.name} (Copy)`,
    };
    setCandidates((prev) => [clone, ...prev]);
    showToast('Candidate profile duplicated.', 'success');
  };

  const handleDeleteCandidateConfirm = (id: string) => {
    const cand = candidates.find((c) => c.id === id);
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Candidate Profile',
      message: `Are you sure you want to delete ${cand?.name || 'this candidate'}? This action cannot be undone.`,
      actionText: 'Delete',
      variant: 'danger',
      onConfirm: () => {
        setCandidates((prev) => prev.filter((c) => c.id !== id));
        showToast('Candidate profile deleted.', 'info');
      },
    });
  };

  const handleResetDemoDataConfirm = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Reset Sample Demo Data',
      message: 'Are you sure you want to reset all records back to the original demo sample data?',
      actionText: 'Reset Data',
      variant: 'danger',
      onConfirm: () => {
        setRequests(structuredClone(INITIAL_SEED_REQUESTS));
        setCandidates(structuredClone(INITIAL_SEED_CANDIDATES));
        showToast('Reset to demo sample data completed.', 'success');
      },
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Sidebar
        currentTab={currentTab}
        requestsCount={requests.length}
        candidatesCount={candidates.length}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onSwitchTab={setCurrentTab}
        onOpenNewRequest={() => {
          setEditingRequestId(null);
          setEtrfModalOpen(true);
        }}
        onOpenNewCandidate={() => {
          setEditingCandidateId(null);
          setCandFormInitialTab('profile');
          setCandModalOpen(true);
        }}
        onResetDemoData={handleResetDemoDataConfirm}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isDark={isDark}
          onToggleDark={() => setIsDark((prev) => !prev)}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        <div className="flex-1 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              requests={requests}
              candidates={candidates}
              onSwitchTab={setCurrentTab}
              onViewRequest={(id) => setViewingRequestId(id)}
              onViewCandidate={(id) => setViewingCandidateId(id)}
            />
          )}

          {currentTab === 'requests' && (
            <RequestsTableView
              requests={filteredRequests}
              companyFilter={reqCompanyFilter}
              levelFilter={reqLevelFilter}
              onCompanyFilterChange={setReqCompanyFilter}
              onLevelFilterChange={setReqLevelFilter}
              onCreateRequest={() => {
                setEditingRequestId(null);
                setEtrfModalOpen(true);
              }}
              onViewRequest={(id) => setViewingRequestId(id)}
              onEditRequest={(id) => {
                setEditingRequestId(id);
                setEtrfModalOpen(true);
              }}
              onDuplicateRequest={handleDuplicateRequest}
              onDeleteRequest={handleDeleteRequestConfirm}
            />
          )}

          {currentTab === 'candidates' && (
            <CandidatesTableView
              candidates={filteredCandidates}
              requests={requests}
              assignFilter={candAssignFilter}
              sourceFilter={candSourceFilter}
              onAssignFilterChange={setCandAssignFilter}
              onSourceFilterChange={setCandSourceFilter}
              onCreateCandidate={() => {
                setEditingCandidateId(null);
                setCandFormInitialTab('profile');
                setCandModalOpen(true);
              }}
              onViewCandidate={(id) => setViewingCandidateId(id)}
              onEditCandidate={(id) => {
                setEditingCandidateId(id);
                setCandFormInitialTab('profile');
                setCandModalOpen(true);
              }}
              onDuplicateCandidate={handleDuplicateCandidate}
              onDeleteCandidate={handleDeleteCandidateConfirm}
              onViewRequest={(id) => setViewingRequestId(id)}
            />
          )}
        </div>
      </main>

      <TalentRequestModal
        isOpen={etrfModalOpen}
        editingRequest={editingRequest}
        onClose={() => {
          setEtrfModalOpen(false);
          setEditingRequestId(null);
        }}
        onSave={handleSaveRequest}
      />

      <ViewEtrfModal
        request={viewingRequest}
        onClose={() => setViewingRequestId(null)}
        onEdit={(id) => {
          setEditingRequestId(id);
          setEtrfModalOpen(true);
        }}
      />

      <CandidateFormModal
        isOpen={candModalOpen}
        editingCandidate={editingCandidate}
        requests={requests}
        initialTab={candFormInitialTab}
        onClose={() => {
          setCandModalOpen(false);
          setEditingCandidateId(null);
          setCandFormInitialTab('profile');
        }}
        onSave={handleSaveCandidate}
        onToast={showToast}
      />

      <ViewCandidateModal
        candidate={viewingCandidate}
        requests={requests}
        onClose={() => setViewingCandidateId(null)}
        onEdit={(id, tab = 'profile') => {
          setEditingCandidateId(id);
          setCandFormInitialTab(tab);
          setCandModalOpen(true);
        }}
      />

      <ConfirmModal
        dialog={confirmDialog}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />

      <ToastContainer toasts={toasts} />
    </div>
  );
}
