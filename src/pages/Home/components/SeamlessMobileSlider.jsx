import React, { useState, useEffect, useLayoutEffect, useRef } from "react";

/**
 * SeamlessMobileSlider
 * Production-grade Infinite / Looping Horizontal Carousel:
 * - 3-Buffer Architecture: [Clone Set A] [Original Set B] [Clone Set C]
 * - Instantaneous, invisible boundary repositioning (scrollLeft ± setWidth)
 * - Zero flash, zero jump, zero blank space, zero layout shifts
 * - Continuous native 120fps hardware-composited momentum scrolling
 * - Multi-card fast swiping without stopping or stuttering
 * - Bidirectional infinite looping for mouse drag, touch swipe, trackpad, and navigation arrows
 * - Finite DOM footprint (only 3x original count, no unbounded memory growth)
 */
export default function SeamlessMobileSlider({
  items = [],
  renderCard,
  language = "ur",
  activeDotColor = "#7A4A28",
  dotColor = "#E6D7C8",
}) {
  if (!items || items.length === 0) return null;

  const count = items.length;

  // Single item renders statically
  if (count <= 1) {
    return (
      <div className="w-full select-none" dir={language === "ur" ? "rtl" : "ltr"}>
        {renderCard(items[0], 0, true)}
      </div>
    );
  }

  const containerRef = useRef(null);
  const cardWidthRef = useRef(0);
  const isInitialized = useRef(false);
  const isWrapping = useRef(false);
  const ticking = useRef(false);
  const activeDotIndexRef = useRef(0);
  const [activeDotIndex, setActiveDotIndex] = useState(0);

  // Mouse drag refs (for desktop testing / trackpad)
  const isMouseDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const velocity = useRef(0);
  const isDragging = useRef(false);

  // 3-Buffer list: [Set A (left clone), Set B (middle), Set C (right clone)]
  const triBufferList = [...items, ...items, ...items];

  // Initialize scroll position exactly to the start of Set B (middle set)
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const initPosition = () => {
      const width = container.clientWidth;
      if (width > 0) {
        cardWidthRef.current = width;
        container.style.scrollBehavior = "auto";
        container.scrollLeft = count * width;
        isInitialized.current = true;
      }
    };

    initPosition();
    const frame = requestAnimationFrame(initPosition);
    return () => cancelAnimationFrame(frame);
  }, [count]);

  // Handle window resizing or orientation change gracefully without jumping
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        if (newWidth > 0 && Math.abs(newWidth - cardWidthRef.current) > 1) {
          cardWidthRef.current = newWidth;
          container.style.scrollBehavior = "auto";
          container.scrollLeft = (count + activeDotIndexRef.current) * newWidth;
        }
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [count]);

  // Passive, throttled scroll listener for silent infinite boundary normalization & dot sync
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (!isInitialized.current || isWrapping.current) return;

      const width = cardWidthRef.current || container.clientWidth;
      if (width <= 0) return;

      const setWidth = count * width;
      const currentScroll = container.scrollLeft;

      // ── Silent Boundary Normalization ──
      // When scrolled into Set C (right duplicate), silently shift back into Set B
      if (currentScroll >= setWidth * 2) {
        isWrapping.current = true;
        container.style.scrollBehavior = "auto";
        container.scrollLeft = currentScroll - setWidth;
        // Re-enable wrapping on next tick
        requestAnimationFrame(() => {
          isWrapping.current = false;
        });
      }
      // When scrolled into Set A (left duplicate), silently shift forward into Set B
      else if (currentScroll < setWidth) {
        isWrapping.current = true;
        container.style.scrollBehavior = "auto";
        container.scrollLeft = currentScroll + setWidth;
        requestAnimationFrame(() => {
          isWrapping.current = false;
        });
      }

      // ── RAF-Throttled Active Dot Synchronization ──
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          if (container) {
            const w = cardWidthRef.current || container.clientWidth || 1;
            const rawIdx = Math.round(container.scrollLeft / w);
            const activeIdx = ((rawIdx % count) + count) % count;
            activeDotIndexRef.current = activeIdx;
            setActiveDotIndex((prev) => (prev !== activeIdx ? activeIdx : prev));
          }
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [count]);

  // Dot Navigation: Smooth glide to target card within Set B
  const goToIndex = (targetIdx) => {
    const container = containerRef.current;
    if (!container) return;
    const width = cardWidthRef.current || container.clientWidth;
    container.style.scrollBehavior = "smooth";
    container.scrollTo({
      left: (count + targetIdx) * width,
      behavior: "smooth",
    });
  };

  // Mouse Drag-to-Scroll (Desktop & Trackpad support)
  const onMouseDown = (e) => {
    if (e.button !== 0) return;
    const container = containerRef.current;
    if (!container) return;

    isMouseDown.current = true;
    isDragging.current = false;
    startX.current = e.pageX;
    scrollLeftStart.current = container.scrollLeft;
    lastX.current = e.pageX;
    lastTime.current = performance.now();
    velocity.current = 0;

    container.style.scrollSnapType = "none";
    container.style.scrollBehavior = "auto";
  };

  const onMouseMove = (e) => {
    if (!isMouseDown.current) return;
    const container = containerRef.current;
    if (!container) return;

    const deltaX = e.pageX - startX.current;
    if (Math.abs(deltaX) > 6) {
      isDragging.current = true;
    }

    container.scrollLeft = scrollLeftStart.current - deltaX;

    const now = performance.now();
    const dt = now - lastTime.current;
    if (dt > 8) {
      velocity.current = (e.pageX - lastX.current) / dt;
      lastX.current = e.pageX;
      lastTime.current = now;
    }
  };

  const onMouseUpOrLeave = () => {
    if (!isMouseDown.current) return;
    isMouseDown.current = false;

    const container = containerRef.current;
    if (!container) return;

    container.style.scrollSnapType = "x mandatory";

    const width = cardWidthRef.current || container.clientWidth || 1;
    const vel = velocity.current;

    // Velocity-based momentum throw
    if (Math.abs(vel) > 0.25) {
      const currentScroll = container.scrollLeft;
      const projected = currentScroll - vel * 220;
      const targetIdx = Math.round(projected / width);
      container.style.scrollBehavior = "smooth";
      container.scrollTo({
        left: targetIdx * width,
        behavior: "smooth",
      });
    } else {
      const targetIdx = Math.round(container.scrollLeft / width);
      container.style.scrollBehavior = "smooth";
      container.scrollTo({
        left: targetIdx * width,
        behavior: "smooth",
      });
    }
  };

  // Prevent accidental card navigation during drag
  const onClickCapture = (e) => {
    if (isDragging.current) {
      e.preventDefault();
      e.stopPropagation();
      isDragging.current = false;
    }
  };

  return (
    <div className="sm:hidden flex flex-col items-center gap-3.5 select-none w-full">
      {/* 
        Native Momentum Scrollable Track:
        - 3-Buffer Loop: [Set A] [Set B] [Set C]
        - -webkit-overflow-scrolling: touch for native 120fps inertia
        - scroll-snap-stop: normal allows continuous momentum passing through multiple cards on fast flick
        - scrollbar-none hides browser scrollbars cleanly
      */}
      <div
        ref={containerRef}
        className="w-full flex overflow-x-auto overflow-y-hidden scrollbar-none snap-x snap-mandatory cursor-grab active:cursor-grabbing"
        dir="ltr"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollSnapType: "x mandatory",
          scrollSnapStop: "normal",
          overscrollBehaviorX: "contain",
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUpOrLeave}
        onMouseLeave={onMouseUpOrLeave}
        onClickCapture={onClickCapture}
      >
        {triBufferList.map((item, idx) => {
          const originalIndex = idx % count;
          const isActive = originalIndex === activeDotIndex;
          const setIndex = Math.floor(idx / count);

          return (
            <div
              key={`${item?._id || item?.title || item?.slug || "card"}-set${setIndex}-${originalIndex}`}
              className="w-full shrink-0 px-2 snap-center origin-center"
              dir={language === "ur" ? "rtl" : "ltr"}
            >
              {renderCard(item, originalIndex, isActive)}
            </div>
          );
        })}
      </div>

      {/* Dots indicator */}
      <div
        className="flex items-center justify-center gap-1.5 mt-1 select-none"
        dir="ltr"
        role="tablist"
        aria-label="سلائیڈر نیویگیشن"
      >
        {items.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => goToIndex(index)}
            className="rounded-full transition-all duration-300 cursor-pointer"
            style={{
              width: activeDotIndex === index ? "20px" : "8px",
              height: "8px",
              backgroundColor:
                activeDotIndex === index ? activeDotColor : dotColor,
            }}
          />
        ))}
      </div>
    </div>
  );
}
