import React, { useState, useEffect, useRef } from "react";

/**
 * SeamlessMobileSlider
 * Production-grade Infinite 1-Card Swiper Carousel:
 * - Strictly 1 card per swipe (never skips multiple cards regardless of swipe speed or screen width)
 * - Pure hardware-accelerated CSS translate3d (60/120fps)
 * - Multi-buffer infinite looping (Set A, Set B, Middle Set C, Set D, Set E)
 * - Seamless zero-flash silent boundary repositioning on transition end
 * - Real-time touch tracking with gesture disambiguation (smooth vertical page scrolling)
 * - Guaranteed consistent behavior on all screen widths (including narrow 320px - 360px phones)
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

  // Single item renders statically without slider
  if (count <= 1) {
    return (
      <div className="w-full select-none" dir={language === "ur" ? "rtl" : "ltr"}>
        {renderCard(items[0], 0, true)}
      </div>
    );
  }

  // 5 buffer sets for robust infinite loop safety margin
  const repeatCount = 5;
  const middleSetIndex = 2;

  // Build the multi-buffer list
  const bufferList = [];
  for (let s = 0; s < repeatCount; s++) {
    for (let i = 0; i < count; i++) {
      bufferList.push({ item: items[i], originalIndex: i, setIndex: s });
    }
  }

  const containerRef = useRef(null);
  const cardWidthRef = useRef(0);
  const [containerWidth, setContainerWidth] = useState(0);

  // Active slide index in bufferList (starts at the beginning of middle set)
  const [activeIndex, setActiveIndex] = useState(() => middleSetIndex * count);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  // Touch gesture refs
  const isTouchActive = useRef(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isDirectionLocked = useRef(false);
  const isHorizontalSwipe = useRef(false);
  const lastTouchX = useRef(0);
  const lastTouchTime = useRef(0);
  const touchVelocity = useRef(0);
  const hasDragged = useRef(false);

  // Mouse drag refs
  const isMouseActive = useRef(false);
  const mouseStartX = useRef(0);
  const lastMouseX = useRef(0);
  const lastMouseTime = useRef(0);
  const mouseVelocity = useRef(0);

  // Measure container width and adapt on resize / rotation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateWidth = () => {
      const w = container.clientWidth;
      if (w > 0 && Math.abs(w - cardWidthRef.current) > 1) {
        cardWidthRef.current = w;
        setContainerWidth(w);
      }
    };

    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // Update starting activeIndex if count changes (e.g. data load from API)
  useEffect(() => {
    setActiveIndex(middleSetIndex * count);
    setIsTransitioning(false);
    setDragOffset(0);
  }, [count]);

  // Silent normalization when transition finishes: instantly snap back into middle set
  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    const currentCard = ((activeIndex % count) + count) % count;
    const middleIndex = middleSetIndex * count + currentCard;

    if (activeIndex !== middleIndex) {
      setActiveIndex(middleIndex);
    }
  };

  // ── Touch Event Listeners (with passive: false for clean swipe capture) ──
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchMove = (e) => {
      if (!isTouchActive.current) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartX.current;
      const deltaY = touch.clientY - touchStartY.current;

      // Disambiguate gesture: if user scrolls vertically, let page scroll natively!
      if (!isDirectionLocked.current) {
        if (Math.abs(deltaX) > 7 || Math.abs(deltaY) > 7) {
          isDirectionLocked.current = true;
          isHorizontalSwipe.current = Math.abs(deltaX) > Math.abs(deltaY);
        }
      }

      if (isHorizontalSwipe.current) {
        if (e.cancelable) {
          e.preventDefault();
        }
        hasDragged.current = true;
        setDragOffset(deltaX);

        const now = performance.now();
        const dt = now - lastTouchTime.current;
        if (dt > 8) {
          touchVelocity.current = (touch.clientX - lastTouchX.current) / dt;
          lastTouchX.current = touch.clientX;
          lastTouchTime.current = now;
        }
      }
    };

    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => el.removeEventListener("touchmove", onTouchMove);
  }, [containerWidth]);

  const onTouchStart = (e) => {
    // If currently mid-transition, complete it immediately to start fresh swipe
    if (isTransitioning) {
      handleTransitionEnd();
    }
    const touch = e.touches[0];
    isTouchActive.current = true;
    isDirectionLocked.current = false;
    isHorizontalSwipe.current = false;
    hasDragged.current = false;
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    lastTouchX.current = touch.clientX;
    lastTouchTime.current = performance.now();
    touchVelocity.current = 0;
    setDragOffset(0);
  };

  const onTouchEnd = () => {
    if (!isTouchActive.current) return;
    isTouchActive.current = false;

    if (!isHorizontalSwipe.current) {
      setDragOffset(0);
      return;
    }

    const width = cardWidthRef.current || containerWidth || 1;
    const threshold = Math.min(width * 0.18, 55); // 18% of screen or 55px
    const vel = touchVelocity.current;

    let step = 0;
    // Exactly 1 card step: swiping left advances +1, swiping right retreats -1
    if (dragOffset < -threshold || vel < -0.28) {
      step = 1;
    } else if (dragOffset > threshold || vel > 0.28) {
      step = -1;
    }

    setIsTransitioning(true);
    setActiveIndex((prev) => prev + step);
    setDragOffset(0);
  };

  // ── Mouse Drag (Desktop Testing / Trackpad) ──
  const onMouseDown = (e) => {
    if (e.button !== 0) return;
    if (isTransitioning) {
      handleTransitionEnd();
    }
    isMouseActive.current = true;
    hasDragged.current = false;
    mouseStartX.current = e.pageX;
    lastMouseX.current = e.pageX;
    lastMouseTime.current = performance.now();
    mouseVelocity.current = 0;
    setDragOffset(0);
  };

  const onMouseMove = (e) => {
    if (!isMouseActive.current) return;
    const deltaX = e.pageX - mouseStartX.current;
    if (Math.abs(deltaX) > 6) {
      hasDragged.current = true;
    }
    setDragOffset(deltaX);

    const now = performance.now();
    const dt = now - lastMouseTime.current;
    if (dt > 8) {
      mouseVelocity.current = (e.pageX - lastMouseX.current) / dt;
      lastMouseX.current = e.pageX;
      lastMouseTime.current = now;
    }
  };

  const onMouseUp = () => {
    if (!isMouseActive.current) return;
    isMouseActive.current = false;

    const width = cardWidthRef.current || containerWidth || 1;
    const threshold = Math.min(width * 0.18, 55);
    const vel = mouseVelocity.current;

    let step = 0;
    if (dragOffset < -threshold || vel < -0.28) {
      step = 1;
    } else if (dragOffset > threshold || vel > 0.28) {
      step = -1;
    }

    setIsTransitioning(true);
    setActiveIndex((prev) => prev + step);
    setDragOffset(0);
  };

  const onMouseLeave = () => {
    if (isMouseActive.current) {
      onMouseUp();
    }
  };

  // Prevent accidental card navigation during swipe/drag
  const onClickCapture = (e) => {
    if (hasDragged.current) {
      e.preventDefault();
      e.stopPropagation();
      hasDragged.current = false;
    }
  };

  // Dot Navigation: Smooth glide to target card
  const goToIndex = (targetDotIdx) => {
    if (isTransitioning) return;
    const currentCard = ((activeIndex % count) + count) % count;
    if (currentCard === targetDotIdx) return;
    const diff = targetDotIdx - currentCard;
    setIsTransitioning(true);
    setActiveIndex((prev) => prev + diff);
  };

  // Calculate current translation offset (GPU composited)
  const currentCardWidth = containerWidth || cardWidthRef.current || 360;
  const currentTranslate = -activeIndex * currentCardWidth + dragOffset;
  const activeDotIndex = ((activeIndex % count) + count) % count;

  return (
    <div className="sm:hidden flex flex-col items-center gap-3.5 select-none w-full">
      {/* 
        Hardware-Accelerated Touch Track:
        - Exactly 1 card per swipe (never skips multiple cards)
        - translate3d with cubic-bezier deceleration
        - Touch-pan-y allows smooth vertical page scrolling
      */}
      <div
        ref={containerRef}
        className="w-full overflow-hidden select-none touch-pan-y cursor-grab active:cursor-grabbing"
        dir="ltr"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onClickCapture={onClickCapture}
      >
        <div
          className="flex"
          style={{
            width: `${bufferList.length * currentCardWidth}px`,
            transform: `translate3d(${currentTranslate}px, 0, 0)`,
            transition: isTransitioning
              ? "transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)"
              : "none",
            willChange: "transform",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {bufferList.map(({ item, originalIndex, setIndex }, idx) => {
            const isActive = originalIndex === activeDotIndex;

            return (
              <div
                key={`${item?._id || item?.title || item?.slug || "card"}-set${setIndex}-${originalIndex}`}
                style={{ width: `${currentCardWidth}px`, flexShrink: 0 }}
                className="px-2"
                dir={language === "ur" ? "rtl" : "ltr"}
              >
                {renderCard(item, originalIndex, isActive)}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dots indicator */}
      <div
        className="flex items-center justify-center gap-1.5 mt-1 select-none"
        dir="ltr"
        role="tablist"
        aria-label="سلائیڈر نیویگیشن"
      >
        {items.map((_, index) => {
          const isActive = activeDotIndex === index;

          return (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => goToIndex(index)}
              className="rounded-full transition-all duration-300 cursor-pointer"
              style={{
                width: isActive ? "20px" : "8px",
                height: "8px",
                backgroundColor: isActive ? activeDotColor : dotColor,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
