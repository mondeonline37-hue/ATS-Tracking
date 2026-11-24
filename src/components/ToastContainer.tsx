import React from 'react';
import { CheckCircle2, Info, XCircle } from 'lucide-react';
import { ToastMessage } from '../types/ta';

export function ToastContainer({ toasts }: { toasts: ToastMessage[] }) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 space-y-2 pointer-events-none"
    >
      {toasts.map((toast) => {
        const bgClass =
          toast.type === 'success'
            ? 'bg-emerald-600 text-white'
            : toast.type === 'error'
            ? 'bg-red-600 text-white'
            : 'bg-slate-800 text-white dark:bg-slate-700';

        return (
          <div
            key={toast.id}
            className={`px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold ${bgClass} pointer-events-auto flex items-center gap-2`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
            {toast.type === 'error' && <XCircle className="w-4 h-4 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}
