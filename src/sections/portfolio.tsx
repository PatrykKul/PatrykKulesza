import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, X } from 'lucide-react';
import { PortfolioItem, HomePageData } from '../types/types';
import { useMobileDetection, useAdvancedInView } from '../hooks/hooks';

export const PortfolioSection = ({ data }: { data: HomePageData }) => {
  const [ref, inView] = useAdvancedInView();
  const isMobile = useMobileDetection();
  
  // ==========================================
  // 📊 STATES DLA DRAG SCROLLING
  // ==========================================
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);
  
  // ==========================================
  // 🖼️ STATES DLA MODALA
  // ==========================================
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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
    if (!scrollContainerRef.current || isModalOpen || isMobile) return;
    
    stopMomentumAnimation();
    
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.pageX);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    
    setLastX(e.pageX);
    setLastTime(Date.now());
    setVelocity(0);
  };

  const handleMouseUp = () => {
    if (isModalOpen) return; 

    if (isDragging) {
      startMomentumAnimation(velocity);
    }
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    if (isModalOpen) return;
    if (isDragging) {
      startMomentumAnimation(velocity);
    }
    setIsDragging(false);
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current || isModalOpen || isMobile) return;
    
    const now = Date.now();
    if (now - lastCallTime.current < 16) return;
    lastCallTime.current = now;
    
    e.preventDefault();
    
    const x = e.pageX;
    const walk = (x - startX) * 1.5;
    
    if (Math.abs(walk) > 5) {
      setHasMoved(true);
    }

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
  }, [isDragging, startX, scrollLeft, lastTime, lastX, isModalOpen, isMobile]);

  // ==========================================
  // 🔒 BLOKOWANIE SCROLLOWANIA W TLE PODCZAS MODALA
  // ==========================================
  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  // ==========================================
  // 🎯 CLEANUP + MODAL HANDLERS
  // ==========================================
  useEffect(() => {
    return () => stopMomentumAnimation();
  }, [stopMomentumAnimation]);

  // Modal handlers
  const openModal = (project: PortfolioItem) => {
    if (!hasMoved || isMobile) { // Na mobile zawsze otwórz modal
      setSelectedProject(project);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  return (
    <>
      {/* ==========================================
          🎨 CUSTOM CURSOR STYLES - RESPONSIVE
          ========================================== */}
      <style jsx>{`
        .portfolio-scroll-container {
          cursor: ${isMobile ? 'default' : `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'%3E%3Ccircle cx='24' cy='24' r='22' fill='%23000000' fill-opacity='0.8' stroke='%231f6feb' stroke-width='2'/%3E%3Cpath d='M14 24l6-6m-6 6l6 6m-6-6h20m-6-6l6 6m-6 6l6-6' stroke='%231f6feb' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") 24 24, grab`};
        }
        .portfolio-section.dragging {
          cursor: ${isMobile ? 'default' : `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'%3E%3Ccircle cx='24' cy='24' r='22' fill='%23000000' fill-opacity='0.95' stroke='%231f6feb' stroke-width='2'/%3E%3Cpath d='M14 24l6-6m-6 6l6 6m-6-6h20m-6-6l6 6m-6 6l6-6' stroke='%231f6feb' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") 24 24, grabbing`};
        }

        /* Mobile scroll indicators */
        @media (max-width: 768px) {
          .portfolio-scroll-container {
            overflow-x: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
        }
      `}</style>

      <section 
        ref={ref} 
        id="portfolio" 
        className="py-12 sm:py-16 md:py-20 bg-[#0d1117] overflow-hidden"
      >
        <div className="w-full">
          {/* ==========================================
              📝 HEADER SEKCJI - RESPONSIVE
              ========================================== */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <div className="container mx-auto px-4 sm:px-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 md:mb-8 bg-gradient-to-r from-[#f0f6fc] via-[#1f6feb] to-[#58a6ff] bg-clip-text text-transparent">
                Portfolio
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#c9d1d9] max-w-3xl mx-auto px-2 sm:px-0">
                Projekty - od stron po aplikacje webowe, desktopowe, gry, narzędzia AI.
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
              className={`portfolio-scroll-container flex gap-4 sm:gap-6 md:gap-8 lg:gap-12 overflow-x-auto scrollbar-hide py-4 sm:py-6 md:py-8 px-4 sm:px-6 md:px-8 lg:px-12 ${isDragging ? 'dragging' : ''}`}
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
                  🎴 MAPA PROJEKTÓW - FULLY RESPONSIVE CARDS
                  ========================================== */}
              {data.portfolio.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ x: 100, opacity: 0 }}
                  animate={inView ? { x: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex-shrink-0 group"
                  whileHover={!isMobile ? { y: -10, scale: 1.02 } : {}}
                >
                  {/* ==========================================
                      🎬 KARTA PROJEKTU - RESPONSIVE DIMENSIONS
                      ========================================== */}
                  <div 
                    className="relative min-w-[300px] w-[90vw] sm:w-[400px] md:w-[500px] lg:w-[600px] xl:w-[700px] h-auto min-h-[400px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[550px] xl:min-h-[600px] bg-[#161b22] border border-[#30363d] rounded-2xl sm:rounded-3xl overflow-hidden hover:border-[#1f6feb]/50 transition-all duration-300 shadow-lg hover:shadow-xl group-hover:shadow-[#1f6feb]/10 cursor-pointer flex flex-col"
                    onClick={() => openModal(project)}
                  >
                    
                    {/* ==========================================
                        🖼️ GÓRNY OBSZAR - ZDJĘCIE - RESPONSIVE
                        ========================================== */}
                    <div className="h-[250px] sm:h-[280px] md:h-[320px] lg:h-[360px] xl:h-[400px] relative overflow-hidden flex-shrink-0">
                      
                      {project.image ? (
                        <Image
                          src={`${process.env.NODE_ENV === 'production' ? '/korepetycje' : ''}/_resources/${project.image}`}
                          alt={project.title}
                          fill
                          className="object-contain transition-transform duration-700 group-hover:scale-105"
                          draggable={false}
                          sizes="(max-width: 640px) 90vw, (max-width: 768px) 400px, (max-width: 1024px) 500px, (max-width: 1280px) 600px, 700px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#1f6feb]/30 to-[#58a6ff]/30 flex items-center justify-center">
                          <div className="text-center">
                            <Code className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-[#1f6feb] mx-auto mb-2 sm:mb-3" />
                            <div className="text-[#c9d1d9] text-sm sm:text-base">Projekt w trakcie dokumentacji</div>
                          </div>
                        </div>
                      )}

                      {/* Kategoria w prawym górnym rogu - RESPONSIVE */}
                      <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4">
                        <span className="bg-[#1f6feb]/90 backdrop-blur-sm text-white px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-xs sm:text-sm font-semibold border border-[#1f6feb]/50">
                          {project.category}
                        </span>
                      </div>

                      {/* Tytuł na dole zdjęcia - RESPONSIVE */}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-3 sm:p-4 md:p-6">
                        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white leading-tight">
                          {project.title}
                        </h3>
                      </div>
                    </div>

                    {/* ==========================================
                        📝 DOLNY OBSZAR - INFORMACJE - RESPONSIVE
                        ========================================== */}
                    <div className="flex-1 p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col min-h-0">
                      
                      {/* Opis projektu - RESPONSIVE */}
                      <div className="mb-3 sm:mb-4 flex-grow">
                        <h4 className="text-sm sm:text-base md:text-lg font-bold text-[#f0f6fc] mb-1 sm:mb-2">O projekcie:</h4>
                        <p className="text-[#c9d1d9] leading-relaxed text-xs sm:text-sm md:text-base line-clamp-3">
                          {project.description}
                        </p>
                      </div>

                      {/* Technologie - RESPONSIVE */}
                      <div className="mt-auto">
                        <h4 className="text-sm sm:text-base md:text-lg font-bold text-[#f0f6fc] mb-2 sm:mb-3">Technologie:</h4>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {project.technologies.slice(0, 6).map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-2 sm:px-3 py-1 bg-[#1f6feb]/20 text-[#58a6ff] rounded-full text-xs sm:text-sm font-medium border border-[#1f6feb]/30"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 6 && (
                            <span className="px-2 sm:px-3 py-1 bg-[#8b949e]/20 text-[#8b949e] rounded-full text-xs sm:text-sm font-medium">
                              +{project.technologies.length - 6}
                            </span>
                          )}
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
              Przesuń palcem aby zobaczyć więcej • Dotknij aby zobaczyć szczegóły
              <span className="ml-2">👉</span>
            </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ==========================================
          🖼️ RESPONSIVE MODAL
          ========================================== */}
      <AnimatePresence>
        {isModalOpen && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-lg"
              onClick={closeModal}
            />
            
            {/* Modal Content - RESPONSIVE */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative bg-[#161b22] border border-[#30363d] rounded-2xl sm:rounded-3xl overflow-hidden w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Close Button - RESPONSIVE */}
              <button
                onClick={closeModal}
                className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all duration-300 border border-white/20"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Image Section - RESPONSIVE */}
              <div className="h-[40vh] sm:h-[50vh] md:h-[60vh] relative bg-gradient-to-br from-[#1f6feb]/20 via-[#161b22] to-[#58a6ff]/20">
                {selectedProject.image ? (
                  <Image
                    src={`${process.env.NODE_ENV === 'production' ? '/korepetycje' : ''}/_resources/${selectedProject.image}`}
                    alt={selectedProject.title}
                    fill
                    className="object-contain"
                    draggable={false}
                    sizes="(max-width: 768px) 100vw, 90vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Code className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-[#1f6feb] mx-auto mb-2 sm:mb-4" />
                      <div className="text-[#c9d1d9] text-base sm:text-lg md:text-xl">Projekt w trakcie dokumentacji</div>
                    </div>
                  </div>
                )}

                {/* Category Badge - RESPONSIVE */}
                <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                  <span className="bg-[#1f6feb]/90 backdrop-blur-sm text-white px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-xs sm:text-sm font-semibold border border-[#1f6feb]/50">
                    {selectedProject.category}
                  </span>
                </div>
              </div>

              {/* Info Section - RESPONSIVE */}
              <div className="p-4 sm:p-6 md:p-8 flex-grow overflow-y-auto">
                
                {/* Title - RESPONSIVE */}
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#f0f6fc] mb-3 sm:mb-4 md:mb-6 leading-tight">
                  {selectedProject.title}
                </h2>

                {/* Description - RESPONSIVE */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#1f6feb] mb-2 sm:mb-3">O projekcie:</h3>
                  <p className="text-[#c9d1d9] leading-relaxed text-sm sm:text-base md:text-lg">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Technologies - RESPONSIVE */}
                <div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#1f6feb] mb-2 sm:mb-3 md:mb-4">Technologie:</h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {selectedProject.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 bg-[#1f6feb]/20 text-[#58a6ff] rounded-full text-xs sm:text-sm md:text-base font-medium border border-[#1f6feb]/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PortfolioSection;