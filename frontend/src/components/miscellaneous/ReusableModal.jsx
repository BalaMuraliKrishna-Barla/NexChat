// frontend/src/components/miscellaneous/ReusableModal.jsx
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';

const ReusableModal = ({ isOpen, onClose, title, children, footer }) => {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Use ReactDOM.createPortal to render the modal into the dedicated portal div
  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md transform transition-all animate-slide-up">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"><X size={24} /></button>
        </div>
        <div className="p-6">{children}</div>
        {footer && <div className="flex justify-end p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-b-lg">{footer}</div>}
      </div>
    </div>,
    document.getElementById('modal-portal')
  );
};

export default ReusableModal;