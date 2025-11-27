"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

type Toast = { id: number; message: string };

const ToastContext = createContext({ showToast: (msg: string) => {} });

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message }]);
    // auto-dismiss
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container - top center */}
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center space-y-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="bg-green-500/70 text-white px-4 py-2 rounded-xl shadow-lg border border-white/5 font-medium"
            role="status"
            aria-live="polite"
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
