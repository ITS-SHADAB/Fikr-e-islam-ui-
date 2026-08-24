import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import PropTypes from 'prop-types';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl overflow-hidden w-full max-w-5xl h-[85vh] relative flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-primary text-white px-5 py-3.5 flex items-center justify-between border-b border-accent/35 shrink-0">
          <h3 className="font-bold text-sm sm:text-md font-serif line-clamp-1">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded text-white/80 hover:text-white hover:bg-primary/90 focus:outline-none"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 w-full h-full min-h-0 bg-white">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
};
