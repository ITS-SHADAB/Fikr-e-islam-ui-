import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaTimes,
  FaDownload,
  FaSearchPlus,
  FaSearchMinus,
  FaSyncAlt,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { FaBox } from "react-icons/fa6";

// Image Thumbnail Component (Trigger)
export const ImageThumbnail = ({
  src,
  alt = "Image",
  size = 8, // 1-10 scale (1=smallest, 10=largest)
  className = "",
  onClick,
  showZoomIcon = true,
  borderRadius = "rounded-lg",
  objectFit = "contain",
}) => {
  const sizeMap = {
    1: "w-8 h-8",
    2: "w-10 h-10",
    3: "w-12 h-12",
    4: "w-14 h-14",
    5: "w-16 h-16",
    6: "w-20 h-20",
    7: "w-24 h-24",
    8: "w-28 h-28",
    9: "w-32 h-32",
    10: "w-40 h-40",
  };

  const sizeClass = sizeMap[size] || sizeMap[8];

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative group cursor-pointer ${sizeClass} ${borderRadius} overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 ${className}`}
      onClick={onClick}
    >
      {src ? (
        <>
          <img
            src={src}
            alt={alt}
            className={`w-full h-full object-${objectFit} transition-transform duration-300 group-hover:scale-105`}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            {showZoomIcon && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="bg-white/90 rounded-full p-2 shadow-lg"
              >
                <FaSearchPlus className="text-[#0064E0] text-sm" />
              </motion.div>
            )}
          </div>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <FaBox size={size * 2} />
        </div>
      )}
    </motion.div>
  );
};

//Full Image Viewer Modal (Portal)
const FullImageViewer = ({
  src,
  alt,
  onClose,
  onDownload,
  initialZoom = 1,
  minZoom = 0.5,
  maxZoom = 3,
  zoomStep = 0.1,
}) => {
  const [zoom, setZoom] = useState(initialZoom);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Reset state when image changes
  useEffect(() => {
    setZoom(initialZoom);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
    setIsImageLoaded(false);
  }, [src, initialZoom]);

  // Handle zoom in/out
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + zoomStep, maxZoom));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - zoomStep, minZoom));
  };

  const handleReset = () => {
    setZoom(initialZoom);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Mouse/Touch dragging for panned zoom
  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoom((prev) => Math.min(prev + zoomStep, maxZoom));
    } else {
      setZoom((prev) => Math.max(prev - zoomStep, minZoom));
    }
  };

  // Keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => {
      e.stopPropagation();
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "+":
        case "=":
          handleZoomIn();
          break;
        case "-":
          handleZoomOut();
          break;
        case "r":
        case "R":
          handleReset();
          break;
        case "ArrowUp":
          setPosition((p) => ({ ...p, y: p.y + 20 }));
          break;
        case "ArrowDown":
          setPosition((p) => ({ ...p, y: p.y - 20 }));
          break;
        case "ArrowLeft":
          setPosition((p) => ({ ...p, x: p.x + 20 }));
          break;
        case "ArrowRight":
          setPosition((p) => ({ ...p, x: p.x - 20 }));
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoom, rotation, position]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleImageLoad = (e) => {
    setImageDimensions({
      width: e.target.naturalWidth,
      height: e.target.naturalHeight,
    });
    setIsImageLoaded(true);
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-300 hover:scale-110 group"
        >
          <FaTimes className="text-2xl group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Header with image info */}
        <div className="absolute top-6 left-6 z-10 bg-black/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
          <p className="text-white text-sm font-medium">{alt}</p>
          {isImageLoaded && (
            <p className="text-white/60 text-xs mt-1">
              {imageDimensions.width} × {imageDimensions.height} px
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
          <button
            onClick={handleZoomOut}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
            title="Zoom Out (-)"
          >
            <FaSearchMinus size={16} />
          </button>

          <div className="px-3 py-1 bg-white/20 rounded-full">
            <span className="text-white text-sm font-mono">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          <button
            onClick={handleZoomIn}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
            title="Zoom In (+)"
          >
            <FaSearchPlus size={16} />
          </button>

          <div className="w-px h-6 bg-white/20" />

          <button
            onClick={handleRotate}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
            title="Rotate (R)"
          >
            <FaSyncAlt size={16} />
          </button>

          <button
            onClick={handleReset}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
            title="Reset"
          >
            <FaExternalLinkAlt size={14} />
          </button>

          <div className="w-px h-6 bg-white/20" />

          <button
            onClick={() => onDownload(src, alt)}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-[#0064E0] to-[#0a1628] hover:shadow-lg flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
            title="Download"
          >
            <FaDownload size={14} />
          </button>
        </div>

        {/* Image Container */}
        <div
          className="relative max-w-[90vw] max-h-[90vh] overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          style={{ cursor: zoom > 1 ? "grab" : "default" }}
        >
          <motion.div
            animate={{
              scale: zoom,
              rotate: rotation,
              x: position.x,
              y: position.y,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full h-full flex items-center justify-center"
          >
            {src ? (
              <img
                src={src}
                alt={alt}
                className="max-w-[90vw] max-h-[90vh] object-contain select-none"
                draggable={false}
                onLoad={handleImageLoad}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-white/50">
                <FaBox size={80} />
                <p className="mt-4 text-sm">No image available</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-24 left-1/2 bg-black/50 -translate-x-1/2 text-white text-xs flex gap-4  backdrop-blur-sm rounded-full px-4 py-1.5">
          <span>🖱️ Drag to pan</span>
          <span>🖱️ Scroll to zoom</span>
          <span>⌨️ +/- to zoom</span>
          <span>⌨️ R to reset</span>
          <span>⌨️ ESC to close</span>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

// ──────────────────────────────────────────────────────────────────────────
// Main Image Viewer Component (Resuable)
// ──────────────────────────────────────────────────────────────────────────
const ImageViewer = ({
  src,
  alt = "Image",
  thumbnailSize = 8,
  thumbnailClassName = "",
  showZoomIcon = true,
  thumbnailBorderRadius = "rounded-lg",
  thumbnailObjectFit = "contain",
  initialZoom = 1,
  minZoom = 0.5,
  maxZoom = 3,
  zoomStep = 0.1,
  onDownload,
  children, // Custom trigger element
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleDownload = async (imageSrc, imageAlt) => {
    if (onDownload) {
      onDownload(imageSrc, imageAlt);
      return;
    }

    // Default download behavior
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download =
        imageAlt.replace(/[^a-z0-9]/gi, "_").toLowerCase() || "image";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback: open in new tab
      window.open(imageSrc, "_blank");
    }
  };

  return (
    <>
      {children ? (
        <div onClick={handleOpen} className="cursor-pointer">
          {children}
        </div>
      ) : (
        <ImageThumbnail
          src={src}
          alt={alt}
          size={thumbnailSize}
          className={thumbnailClassName}
          showZoomIcon={showZoomIcon}
          borderRadius={thumbnailBorderRadius}
          objectFit={thumbnailObjectFit}
          onClick={handleOpen}
        />
      )}

      {isOpen && (
        <FullImageViewer
          src={src}
          alt={alt}
          onClose={handleClose}
          onDownload={handleDownload}
          initialZoom={initialZoom}
          minZoom={minZoom}
          maxZoom={maxZoom}
          zoomStep={zoomStep}
        />
      )}
    </>
  );
};

// PropTypes
ImageThumbnail.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  size: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  className: PropTypes.string,
  onClick: PropTypes.func,
  showZoomIcon: PropTypes.bool,
  borderRadius: PropTypes.string,
  objectFit: PropTypes.oneOf(["contain", "cover", "fill"]),
};

FullImageViewer.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onDownload: PropTypes.func,
  initialZoom: PropTypes.number,
  minZoom: PropTypes.number,
  maxZoom: PropTypes.number,
  zoomStep: PropTypes.number,
};

ImageViewer.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  thumbnailSize: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  thumbnailClassName: PropTypes.string,
  showZoomIcon: PropTypes.bool,
  thumbnailBorderRadius: PropTypes.string,
  thumbnailObjectFit: PropTypes.oneOf(["contain", "cover", "fill"]),
  initialZoom: PropTypes.number,
  minZoom: PropTypes.number,
  maxZoom: PropTypes.number,
  zoomStep: PropTypes.number,
  onDownload: PropTypes.func,
  children: PropTypes.node,
};

export default ImageViewer;
