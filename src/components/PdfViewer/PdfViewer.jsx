import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Download, 
  Maximize2, 
  Minimize2, 
  ChevronDown, 
  ChevronUp,
  FileText, 
  Image as ImageIcon,
  LayoutGrid,
  Plus, 
  Minus 
} from 'lucide-react';
import PropTypes from 'prop-types';

export function PdfViewer({ url, title = 'Document', type = 'auto', isModal = false, onClose = () => {} }) {
  // Viewer dimension states
  const [heightMode, setHeightMode] = useState('medium'); // short (450px), medium (650px), tall (850px)
  const [heightValue, setHeightValue] = useState(650);
  const [widthPercent, setWidthPercent] = useState(100); // 50% to 100% width

  const heightPresets = {
    short: 450,
    medium: 650,
    tall: 850,
  };

  const handleHeightPresetChange = (preset) => {
    setHeightMode(preset);
    setHeightValue(heightPresets[preset]);
  };

  const handleZoomIn = () => {
    setWidthPercent(prev => Math.min(prev + 10, 100));
  };

  const handleZoomOut = () => {
    setWidthPercent(prev => Math.max(prev - 10, 50));
  };

  // Auto-detect image vs PDF
  const isPdf = type === 'pdf' || (type !== 'image' && url && (
    url.toLowerCase().includes('.pdf') ||
    url.toLowerCase().includes('raw/upload') ||
    url.match(/\.pdf($|\?)/i)
  ));

  const isImage = type === 'image' || (type !== 'pdf' && !isPdf && url && (
    url.match(/\.(jpeg|jpg|gif|png|webp|svg)($|\?)/i) ||
    url.startsWith('data:image/') ||
    url.includes('image')
  ));

  const renderToolbar = () => (
    <div className="bg-[#1e1b18] text-white border-b border-[#b89c7d]/20 px-4 py-3 flex flex-wrap items-center justify-between gap-3 select-none">
      {/* Title */}
      <div className="flex items-center gap-2">
        {isImage ? (
          <ImageIcon className="w-5 h-5 text-[#b89c7d] shrink-0" />
        ) : (
          <FileText className="w-5 h-5 text-[#b89c7d] shrink-0" />
        )}
        <span className="text-sm font-bold truncate max-w-[200px] sm:max-w-xs font-serif text-white/95" title={title}>
          {title}
        </span>
      </div>

      {/* Adjust Size & Controls */}
      <div className="flex items-center flex-wrap gap-2.5 sm:gap-4 text-xs">
        {/* Width / Zoom Adjustment */}
        <div className="flex items-center bg-white/10 rounded px-2 py-1 gap-1">
          <span className="text-[10px] text-white/60 mr-1 uppercase font-semibold">Scale:</span>
          <button 
            type="button" 
            onClick={handleZoomOut} 
            disabled={widthPercent <= 50} 
            className="hover:text-[#b89c7d] disabled:opacity-30 p-0.5 transition-colors cursor-pointer border-0 bg-transparent text-white"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-9 text-center font-bold font-mono">{widthPercent}%</span>
          <button 
            type="button" 
            onClick={handleZoomIn} 
            disabled={widthPercent >= 100} 
            className="hover:text-[#b89c7d] disabled:opacity-30 p-0.5 transition-colors cursor-pointer border-0 bg-transparent text-white"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Height Adjust Preset (if not modal fullscreen) */}
        {!isModal && (
          <div className="flex items-center bg-white/10 rounded px-1.5 py-0.5 gap-1.5">
            <span className="text-[10px] text-white/60 uppercase font-semibold ml-1">Height:</span>
            {Object.keys(heightPresets).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleHeightPresetChange(preset)}
                className={`px-2 py-0.5 rounded capitalize font-semibold transition-all cursor-pointer border-0 ${
                  heightMode === preset 
                    ? 'bg-[#b89c7d] text-[#1e1b18] font-bold shadow-sm' 
                    : 'hover:bg-white/5 text-white/80 bg-transparent'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        )}

        {/* Action icons */}
        <div className="flex items-center gap-1.5 border-l border-white/10 pl-2 sm:pl-3.5">
          <a
            href={url}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 hover:bg-white/10 hover:text-[#b89c7d] rounded transition-colors text-white/90"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </a>

          {isModal && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 hover:text-red-400 rounded transition-colors text-white/90 cursor-pointer border-0 bg-transparent"
              title="Close Viewer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const viewerContent = (
    <div className="flex flex-col h-full bg-[#1e1b18] overflow-hidden">
      {renderToolbar()}
      {/* Document Container */}
      <div 
        className="flex-grow bg-[#151311] flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
        style={{ height: isModal ? 'calc(100vh - 60px)' : `${heightValue}px` }}
      >
        <div 
          className="h-full bg-[#1e1b18] rounded-md shadow-2xl overflow-hidden transition-all duration-300 relative border border-[#b89c7d]/10 flex items-center justify-center"
          style={{ width: `${widthPercent}%` }}
        >
          {url ? (
            isImage ? (
              <div className="w-full h-full flex items-center justify-center p-4 bg-slate-950 overflow-auto">
                <img 
                  src={url} 
                  alt={title} 
                  className="max-w-full max-h-full object-contain mx-auto transition-transform duration-300"
                />
              </div>
            ) : (
              <iframe 
                src={`${url}#toolbar=1&navpanes=0`}
                title={title} 
                className="w-full h-full border-0 select-none bg-white"
              />
            )
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-6 bg-[#151311]">
              {isImage ? (
                <ImageIcon className="w-12 h-12 text-slate-650 mb-2 animate-pulse" />
              ) : (
                <FileText className="w-12 h-12 text-slate-650 mb-2 animate-pulse" />
              )}
              <p className="text-sm font-serif">No document loaded</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return createPortal(
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 overflow-hidden animate-fade-in">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full h-full md:max-w-6xl md:h-[90vh] bg-[#1e1b18] md:rounded-xl md:shadow-2xl overflow-hidden flex flex-col border border-[#b89c7d]/20"
          >
            {viewerContent}
          </motion.div>
        </div>
      </AnimatePresence>,
      document.body
    );
  }

  // Inline Viewer
  return (
    <div className="bg-[#1e1b18] border border-[#b89c7d]/10 rounded-lg overflow-hidden shadow-md flex flex-col w-full">
      {viewerContent}
    </div>
  );
}

PdfViewer.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.oneOf(['pdf', 'image', 'auto']),
  isModal: PropTypes.bool,
  onClose: PropTypes.func,
};
