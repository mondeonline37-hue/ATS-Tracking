import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { ConfirmDialogState } from '../types/ta';

interface ConfirmModalProps {
  dialog: ConfirmDialogState;
  onCancel: () => void;
}

export function ConfirmModal({ dialog, onCancel }: ConfirmModalProps) {
  if (!dialog.isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      className="fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-sm p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h3 id="confirm-modal-title" className="font-bold text-slate-900 dark:text-white text-base">
            {dialog.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            {dialog.message}
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="w-1/2 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              dialog.onConfirm();
              onCancel();
            }}
            className="w-1/2 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
          >
            {dialog.actionText}
          </button>
        </div>
      </div>
    </div>
  );
}
