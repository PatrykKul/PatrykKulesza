// ==========================================
// 🎯 CUSTOM HOOKS
// ==========================================

import { useState, useRef, useEffect } from 'react';
import { useInView } from 'framer-motion';

// ==========================================
// 📱 MOBILE DETECTION HOOK
// ==========================================
export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth <= 768);
      }
    };
    
    checkMobile();
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  return isMobile;
};

// ==========================================
// 🎯 ADVANCED INTERSECTION OBSERVER HOOK
// ==========================================
export const useAdvancedInView = (threshold: number = 0.1) => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { 
    amount: threshold,
    once: true 
  });
  return [ref, isInView] as const;
};