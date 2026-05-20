import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ toasts }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-center gap-3 bg-[#0A0A0A] text-white px-5 py-4 min-w-[280px] animate-fade-in-up border-l-4 border-[#9B7EC8] shadow-2xl"
        >
          {toast.type === 'success' ? (
            <CheckCircle size={16} className="text-[#9B7EC8] shrink-0" />
          ) : (
            <AlertCircle size={16} className="text-red-400 shrink-0" />
          )}
          <span className="font-inter text-[13px] tracking-wide">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

export default Toast;
