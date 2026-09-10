import React, { createContext, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SmoothScrollContext = createContext(null);

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

export function SmoothScrollProvider({ children }) {
  const location = useLocation();

  // Instant native scroll-to-top on route change without blocking main thread
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <SmoothScrollContext.Provider value={null}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

export default SmoothScrollProvider;
