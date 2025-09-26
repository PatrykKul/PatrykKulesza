import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { TestimonialData } from '../types/types';
import { useAdvancedInView, useMobileDetection } from '../hooks/hooks';
import { generateReviewsStructuredData } from '../utils/utils';
import { HomePageData } from '../types/types';

export const TestimonialsSection = ({ data }: { data: HomePageData }) => {
  const [ref, inView] = useAdvancedInView();
  const isMobile = useMobileDetection();
  
  // ==========================================
  // 📊 STATES DLA DRAG SCROLLING
  // ==========================================
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  // ==========================================
  // 🚀 MOMENTUM SCROLLING STATES
  // ==========================================
  const [velocity, setVelocity] = useState(0);
  const [lastX, setLastX] = useState(0);
  const [lastTime, setLastTime] = useState(0);
  const momentumAnimationRef = useRef<number | null>(null);
  const lastCallTime = useRef<number>(0);

  // ==========================================
  // 🚀 MOMENTUM ANIMATION FUNCTION
  // ==========================================
  const startMomentumAnimation = useCallback((initialVelocity: number) => {
    if (!scrollContainerRef.current || Math.abs(initialVelocity) < 0.1) return;
    
    let currentVelocity = initialVelocity;
    const deceleration = 0.95;
    const minVelocity = 0.1;
    
    const animate = () => {
      if (!scrollContainerRef.current) return;
      
      const currentScrollLeft = scrollContainerRef.current.scrollLeft;
      const newScrollLeft = currentScrollLeft + currentVelocity;
      
      const maxScroll = scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth;
      const clampedScrollLeft = Math.max(0, Math.min(maxScroll, newScrollLeft));
      
      scrollContainerRef.current.scrollLeft = clampedScrollLeft;
      currentVelocity *= deceleration;
      
      if (Math.abs(currentVelocity) > minVelocity && 
          clampedScrollLeft > 0 && 
          clampedScrollLeft < maxScroll) {
        momentumAnimationRef.current = requestAnimationFrame(animate);
      } else {
        momentumAnimationRef.current = null;
      }
    };
    
    momentumAnimationRef.current = requestAnimationFrame(animate);
  }, []);

  // ==========================================
  // 🛑 STOP MOMENTUM FUNCTION
  // ==========================================
  const stopMomentumAnimation = useCallback(() => {
    if (momentumAnimationRef.current) {
      cancelAnimationFrame(momentumAnimationRef.current);
      momentumAnimationRef.current = null;
    }
  }, []);

  // ==========================================
  // 🖱️ MOUSE EVENT HANDLERS - DESKTOP ONLY
  // ==========================================
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current || isMobile) return;
    
    stopMomentumAnimation();
    
    setIsDragging(true);
    setStartX(e.pageX);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    
    setLastX(e.pageX);
    setLastTime(Date.now());
    setVelocity(0);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      startMomentumAnimation(velocity);
    }
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      startMomentumAnimation(velocity);
    }
    setIsDragging(false);
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current || isMobile) return;
    
    const now = Date.now();
    if (now - lastCallTime.current < 16) return;
    lastCallTime.current = now;
    
    e.preventDefault();
    
    const x = e.pageX;
    const walk = (x - startX) * 1.5;
    
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    
    const currentTime = Date.now();
    const currentX = e.pageX;
    
    const timeDiff = currentTime - lastTime;
    const xDiff = currentX - lastX;
    
    if (timeDiff > 0) {
      const newVelocity = (xDiff / timeDiff) * -1.5 * 16;
      setVelocity(newVelocity);
    }
    
    setLastX(currentX);
    setLastTime(currentTime);
  }, [isDragging, startX, scrollLeft, lastTime, lastX, isMobile]);

  // ==========================================
  // 🎯 CLEANUP
  // ==========================================
  useEffect(() => {
    return () => stopMomentumAnimation();
  }, [stopMomentumAnimation]);

  return (
    <>
      {/* ==========================================
          🎨 CUSTOM CURSOR STYLES - RESPONSIVE
          ========================================== */}
      <style jsx>{`
        .testimonials-scroll-container {
          cursor: ${isMobile ? 'default' : `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'%3E%3Ccircle cx='24' cy='24' r='22' fill='%23000000' fill-opacity='0.8' stroke='%231f6feb' stroke-width='2'/%3E%3Cpath d='M14 24l6-6m-6 6l6 6m-6-6h20m-6-6l6 6m-6 6l6-6' stroke='%231f6feb' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") 24 24, grab`};
        }
        .testimonials-section.dragging {
          cursor: ${isMobile ? 'default' : `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'%3E%3Ccircle cx='24' cy='24' r='22' fill='%23000000' fill-opacity='0.95' stroke='%231f6feb' stroke-width='2'/%3E%3Cpath d='M14 24l6-6m-6 6l6 6m-6-6h20m-6-6l6 6m-6 6l6-6' stroke='%231f6feb' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") 24 24, grabbing`};
        }
        .testimonials-scroll-container::-webkit-scrollbar {
          display: none;
        }
        .testimonials-section.dragging {
          user-select: none;
        }
        .testimonials-section * {
          cursor: inherit !important;
        }
        
        /* Mobile scroll indicators */
        @media (max-width: 768px) {
          .testimonials-scroll-container {
            overflow-x: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
        }
      `}</style>

      <section 
        ref={ref} 
        id="testimonials" 
        className="py-12 sm:py-16 md:py-20 bg-[#161b22] overflow-hidden"
      >
        {/* Structured data dla opinii */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateReviewsStructuredData(data.testimonials))
          }}
        />
        
        <div className="w-full">
          {/* ==========================================
              📝 HEADER SEKCJI - RESPONSIVE
              ========================================== */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-6 sm:mb-8"
          >
            <div className="container mx-auto px-4 sm:px-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 md:mb-8 bg-gradient-to-r from-[#f0f6fc] via-[#1f6feb] to-[#58a6ff] bg-clip-text text-transparent">
                Opinie Uczniów
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-[#c9d1d9] max-w-3xl mx-auto px-2 sm:px-0">
                Zobacz co mówią o mnie uczniowie i ich rodzice.
              </p>
            </div>
          </motion.div>

          {/* ==========================================
              🎬 HORIZONTAL SCROLLING CONTAINER - RESPONSIVE
              ========================================== */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div
              ref={scrollContainerRef}
              className={`testimonials-scroll-container flex gap-4 sm:gap-6 md:gap-8 lg:gap-12 overflow-x-auto scrollbar-hide py-4 sm:py-6 md:py-8 px-4 sm:px-6 md:px-8 lg:px-12 ${isDragging ? 'dragging' : ''}`}
              onMouseDown={!isMobile ? handleMouseDown : undefined}
              onMouseUp={!isMobile ? handleMouseUp : undefined}
              onMouseLeave={!isMobile ? handleMouseLeave : undefined}
              onMouseMove={!isMobile ? handleMouseMove : undefined}
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {/* ==========================================
                  💬 MAPA OPINII - FULLY RESPONSIVE CARDS
                  ========================================== */}
              {data.testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ x: 100, opacity: 0 }}
                  animate={inView ? { x: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex-shrink-0 group"
                  whileHover={!isMobile ? { y: -10, scale: 1.02 } : {}}
                >
                  {/* ==========================================
                      💬 KARTA OPINII - RESPONSIVE DIMENSIONS
                      ========================================== */}
                  <div className="relative min-w-[280px] w-[85vw] sm:w-[400px] md:w-[500px] lg:w-[600px] xl:w-[700px] h-auto min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[450px] bg-[#0d1117] border border-[#30363d] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 hover:border-[#1f6feb]/50 transition-all duration-300 shadow-lg hover:shadow-xl group-hover:shadow-[#1f6feb]/10 flex flex-col">

                    {/* Rating Stars - RESPONSIVE */}
                    <div className="flex items-center mb-4 sm:mb-6 md:mb-8">
                      <div className="flex text-yellow-400 mr-3 sm:mr-4 md:mr-6">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 fill-current mr-0.5 sm:mr-1" />
                        ))}
                      </div>
                      <div className="text-[#1f6feb] font-semibold text-xs sm:text-sm md:text-base lg:text-lg bg-[#1f6feb]/10 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full">
                        {testimonial.rating}/5
                      </div>
                    </div>

                    {/* Opinion Text - RESPONSIVE TYPOGRAPHY */}
                    <div className="mb-4 sm:mb-6 md:mb-8 lg:mb-12 flex-grow">
                      <p className="text-[#c9d1d9] leading-relaxed text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-light">
                        &ldquo;{testimonial.opinion}&rdquo;
                      </p>
                    </div>

                    {/* Bottom Info - RESPONSIVE LAYOUT */}
                    <div className="border-t border-[#30363d] pt-3 sm:pt-4 md:pt-6 lg:pt-8 mt-auto">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-[#f0f6fc] text-base sm:text-lg md:text-xl lg:text-2xl mb-1 sm:mb-2 truncate">
                            {testimonial.name}
                          </div>
                          <div className="text-xs sm:text-sm md:text-base lg:text-lg text-[#8b949e] mb-2 sm:mb-0">
                            {testimonial.grade}
                          </div>
                        </div>
                        
                        {/* Result Badge - RESPONSIVE */}
                        <div className="flex-shrink-0 text-left sm:text-right">
                          <div className="text-xs sm:text-sm text-[#8b949e] mb-1 sm:mb-2">Wynik:</div>
                          <div className="bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] text-white font-bold px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base md:text-lg inline-block">
                            {testimonial.result}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hover Glow Effect - DESKTOP ONLY */}
                    {!isMobile && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl sm:rounded-3xl">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1f6feb]/5 to-transparent rounded-2xl sm:rounded-3xl" />
                        <div className="absolute inset-0 shadow-2xl shadow-[#1f6feb]/25 rounded-2xl sm:rounded-3xl" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* ==========================================
                  📊 PODSUMOWANIE NA KOŃCU - RESPONSIVE
                  ========================================== */}
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={inView ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex-shrink-0"
              >
                <div className="min-w-[280px] w-[85vw] sm:w-[400px] md:w-[500px] lg:w-[600px] xl:w-[700px] h-auto min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[450px] bg-gradient-to-br from-[#1f6feb]/10 to-[#58a6ff]/10 border border-[#1f6feb]/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 flex flex-col items-center justify-center text-center">
                  
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] rounded-full flex items-center justify-center mb-4 sm:mb-6 md:mb-8"
                  >
                    <Star className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white fill-current" />
                  </motion.div>
                  
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#f0f6fc] mb-3 sm:mb-4 md:mb-6 leading-tight">
                    100% zadowolonych uczniów!
                  </h3>
                  
                  <p className="text-[#c9d1d9] mb-4 sm:mb-6 md:mb-8 leading-relaxed text-sm sm:text-base md:text-lg lg:text-xl">
                    Każdy uczeń osiągnął swoje cele. Dołącz do grona zadowolonych uczniów!
                  </p>
                  
                  <motion.a
                    href="#contact"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] text-white font-bold py-2 sm:py-3 md:py-4 px-4 sm:px-6 md:px-8 rounded-lg sm:rounded-xl transition-all duration-300 text-sm sm:text-base md:text-lg"
                  >
                    Umów konsultację
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* ==========================================
              📱 MOBILE SCROLL HINT
              ========================================== */}
          {isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 1 }}
              className="text-center mt-4 md:hidden"
            >
              <p className="text-xs text-[#8b949e] flex items-center justify-center">
                <span className="mr-2">👈</span>
                Przesuń palcem aby zobaczyć więcej opinii
                <span className="ml-2">👉</span>
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
};

export default TestimonialsSection;