import React, { useState, useEffect, useRef } from "react";

export default function SeamlessMobileSlider({
  items = [],
  renderCard,
  language = "ur",
  enableScale = false,
  duration = 500,
  activeDotColor = "#7A4A28",
  dotColor = "#E6D7C8",
}) {
  if (!items || items.length === 0) return null;

  const count = items.length;

  // If only 1 item, render statically
  if (count <= 1) {
    return (
      <div className="w-full select-none" dir={language === "ur" ? "rtl" : "ltr"}>
        {renderCard(items[0], 0, true)}
      </div>
    );
  }

  // Virtual list with clones at edges: [Last, ...items, First]
  const virtualList = [items[count - 1], ...items, items[0]];

  // Index 1 corresponds to items[0]
  const [virtualIndex, setVirtualIndex] = useState(1);
  const [withTransition, setWithTransition] = useState(true);
  const touchStartX = useRef(0);

  // Active dot index (0-based in original items array)
  const activeDotIndex = (virtualIndex - 1 + count) % count;

  // Handle transition end for seamless infinite wrap without rewind
  const handleTransitionEnd = () => {
    if (virtualIndex === 0) {
      setWithTransition(false);
      setVirtualIndex(count);
    } else if (virtualIndex === count + 1) {
      setWithTransition(false);
      setVirtualIndex(1);
    }
  };

  // Re-enable transitions after instant snap
  useEffect(() => {
    if (!withTransition) {
      const frame = requestAnimationFrame(() => {
        setWithTransition(true);
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [withTransition]);

  // Standard touch swipe gestures (Swipe Left -> Next, Swipe Right -> Prev)
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - endX;

    // Swipe Left (drag towards left): Next card comes from right
    if (diff > 40) {
      setVirtualIndex((prev) => prev + 1);
    }
    // Swipe Right (drag towards right): Prev card comes from left
    else if (diff < -40) {
      setVirtualIndex((prev) => prev - 1);
    }
  };

  // Jump to specific dot
  const handleDotClick = (targetIndex) => {
    setWithTransition(true);
    setVirtualIndex(targetIndex + 1);
  };

  return (
    <div className="sm:hidden flex flex-col items-center gap-5 select-none w-full">
      <div
        className="w-full overflow-hidden touch-pan-y"
        dir="ltr"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex"
          onTransitionEnd={handleTransitionEnd}
          style={{
            transform: `translateX(-${virtualIndex * 100}%)`,
            transition: withTransition
              ? `transform ${duration}ms cubic-bezier(0.25, 1, 0.5, 1)`
              : "none",
          }}
        >
          {virtualList.map((item, idx) => {
            const isActive = idx === virtualIndex;
            return (
              <div
                key={idx}
                className="w-full shrink-0 px-2 origin-center"
                style={{
                  transform: enableScale
                    ? isActive
                      ? "scale(1)"
                      : "scale(0.88)"
                    : "none",
                  opacity: enableScale ? (isActive ? 1 : 0.6) : 1,
                  transition:
                    enableScale && withTransition
                      ? `transform ${duration}ms cubic-bezier(0.25, 1, 0.5, 1), opacity ${duration}ms ease`
                      : "none",
                }}
                dir={language === "ur" ? "rtl" : "ltr"}
              >
                {renderCard(item, (idx - 1 + count) % count, isActive)}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dots indicator */}
      <div
        className="flex items-center justify-center gap-2 mt-2"
        dir="ltr"
      >
        {items.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => handleDotClick(index)}
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
