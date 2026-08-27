import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import PropTypes from 'prop-types';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-5xl",
  height = "max-h-[90vh]",
  className = "",
  dir = "ltr",
}) {
  if (!isOpen) return null;

  return createPortal(
    <div
      dir={dir}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200 text-left"
    >
      <div
        className={`bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden w-full ${maxWidth} ${height} relative flex flex-col ${className}`}
      >
        {/* Modal Header */}
        <div className="bg-primary text-white px-5 py-3.5 flex items-center justify-between border-b border-accent/35 shrink-0">
          <h3 className="font-bold text-sm sm:text-md font-serif line-clamp-1">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 focus:outline-none cursor-pointer transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 w-full h-full min-h-0 bg-white overflow-y-auto">
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
  maxWidth: PropTypes.string,
  height: PropTypes.string,
  className: PropTypes.string,
  dir: PropTypes.string,
};
