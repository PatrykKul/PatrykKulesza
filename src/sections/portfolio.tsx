"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion } from "framer-motion";
import Image from "next/image";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { useAdvancedInView, useDragScroll, useScrollContainerStyles } from '../hooks/hooks';
import { PortfolioItem } from '../types/types';
import { PROJECT_EXAMPLES } from '../data/data';


export const PortfolioSection = () => {
  const [ref, inView] = useAdvancedInView();
  
  // Pagination state
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animatingDirection, setAnimatingDirection] = useState<'left' | 'right' | null>(null);
  
  // Use drag scroll hook
  const {
    scrollContainerRef,
    isDragging,
    isMobile,
    handleMouseDown,
    handleMouseUp,
    handleMouseLeave,
    handleMouseMove,
    handleItemClick
  } = useDragScroll<PortfolioItem>();

  // Use scroll container styles
  useScrollContainerStyles(isMobile);

  // Current project for background
  const currentProject = PROJECT_EXAMPLES[activeIndex];
  const backgroundImage = currentProject?.image;

  // Handle project click
  const handleProjectClick = (project: PortfolioItem) => {
    if (project.href) {
      window.open(project.href, '_blank');
    }
  };

  // Update active index - działa zawsze, także podczas drag
  const updateActiveIndex = useCallback(() => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    const cards = container.querySelectorAll('.scroll-item');
    
    let closestIndex = 0;
    let closestDistance = Infinity;
    
    cards.forEach((card, index) => {
      const cardElement = card as HTMLElement;
      const cardCenter = cardElement.offsetLeft + cardElement.offsetWidth / 2;
      const distance = Math.abs(cardCenter - containerCenter);
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });
    
    if (closestIndex !== activeIndex) {
      setActiveIndex(closestIndex);
    }
  }, [activeIndex, scrollContainerRef]);

  // Navigation functions - PRZED useEffect
  const scrollToIndex = useCallback((index: number) => {
    if (!scrollContainerRef.current || isAnimating) return;
    
    setIsAnimating(true);
    setAnimatingDirection(index > activeIndex ? 'right' : 'left');
    setActiveIndex(index);

    const container = scrollContainerRef.current;
    const targetCard = container.querySelector(`.scroll-item:nth-child(${index + 1})`) as HTMLElement;
    
    if (targetCard) {
      const containerCenter = container.clientWidth / 2;
      const cardCenter = targetCard.offsetLeft + targetCard.clientWidth / 2;
      const scrollLeftPosition = cardCenter - containerCenter;
      
      container.scrollTo({ 
        left: Math.max(0, scrollLeftPosition), 
        behavior: 'smooth' 
      });
    }

    setTimeout(() => {
      setIsAnimating(false);
      setAnimatingDirection(null);
    }, 300);
  }, [activeIndex, isAnimating, scrollContainerRef]);

  const scrollLeft = useCallback(() => {
    if (activeIndex > 0) {
      scrollToIndex(activeIndex - 1);
    }
  }, [activeIndex, scrollToIndex]);

  const scrollRight = useCallback(() => {
    if (activeIndex < PROJECT_EXAMPLES.length - 1) {
      scrollToIndex(activeIndex + 1);
    }
  }, [activeIndex, scrollToIndex]);

  const handleDotClick = useCallback((index: number) => {
    scrollToIndex(index);
  }, [scrollToIndex]);

  // Track scrolling - z detekcją końca momentum dla miękkiego centrowania
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    let scrollTimeout: NodeJS.Timeout;
    let isAutoScrolling = false; // Flaga zapobiegająca pętli
    
    const handleScroll = () => {
      // Aktualizuj kropki na bieżąco
      clearTimeout(scrollTimeout);
      updateActiveIndex();
      
      // Po zakończeniu scrollowania - automatyczne centrowanie
      scrollTimeout = setTimeout(() => {
        
        // Sprawdź czy nie trwa animacja, drag lub auto-scroll
        if (isAnimating || isDragging || isAutoScrolling) return;
        
        // Miękkie centrowanie po zakończeniu momentum
        const containerCenter = container.scrollLeft + container.clientWidth / 2;
        const cards = container.querySelectorAll('.scroll-item');
        
        let closestIndex = 0;
        let closestDistance = Infinity;
        
        cards.forEach((card, index) => {
          const cardElement = card as HTMLElement;
          const cardCenter = cardElement.offsetLeft + cardElement.offsetWidth / 2;
          const distance = Math.abs(cardCenter - containerCenter);
          
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });
        
        // Centruj jeśli karta nie jest wycentrowana (tolerancja 50px)
        if (closestDistance > 50) {
          console.log('Auto-centering from', container.scrollLeft, 'to index:', closestIndex);
          
          isAutoScrolling = true; // Zablokuj kolejne auto-scroll
          
          // Bezpośrednie centrowanie
          const targetCard = container.querySelector(`.scroll-item:nth-child(${closestIndex + 1})`) as HTMLElement;
          
          if (targetCard) {
            const containerCenterPos = container.clientWidth / 2;
            const cardCenter = targetCard.offsetLeft + targetCard.offsetWidth / 2;
            const scrollLeftPosition = cardCenter - containerCenterPos;
            
            container.scrollTo({ 
              left: Math.max(0, scrollLeftPosition), 
              behavior: 'smooth' 
            });
            
            // Odblokuj po 800ms (czas na smooth scroll)
            setTimeout(() => {
              isAutoScrolling = false;
            }, 800);
          }
        }
      }, 300); // Zwiększony czas dla lepszego wykrywania końca
    };
    
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [updateActiveIndex, isDragging, scrollToIndex, isAnimating, scrollContainerRef]);

  return (
    <section
      ref={ref}
      id="portfolio"
      className="py-12 sm:py-16 md:py-20 bg-black relative overflow-hidden"
    >
      {/* Minimal styles - tylko smooth behavior */}
      <style jsx>{`
        .scroll-container {
          -webkit-overflow-scrolling: touch;
        }
      `}</style>

      {/* Dynamic background z mniejszym blur - lepiej widoczny */}
      <div
        className="absolute inset-0 transition-all duration-1000 ease-out"
        style={{
          backgroundImage: backgroundImage 
            ? `url(/_resources/${backgroundImage})` 
            : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(10px) brightness(0.45)',
          transform: 'scale(1.1)',
        }}
      />

      {/* Lighter darkening layer - lepiej widoczny background */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Side gradients */}
      <div className="hidden md:block absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
      <div className="hidden md:block absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-12 sm:mb-12 md:mb-16"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="pb-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-6 sm:mb-8 tracking-tight bg-gradient-to-r from-[#58a6ff] via-[#1f6feb] to-[#0969da] bg-clip-text text-transparent">
              Moje Projekty
              <span className="block sm:inline"> Stron Internetowych</span>
            </h2>
            <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-4xl mx-auto leading-relaxed px-2 sm:px-0">
              <span className="block">Oprócz korepetycji, tworzę także nowoczesne strony internetowe.</span>
              <span className="block text-center">Każdy projekt to połączenie funkcjonalności z estetyką.</span>
            </p>
          </div>
        </motion.div>

        {/* Projects scroll container */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative"
        >
          <div
            ref={scrollContainerRef}
            className={`scroll-container flex gap-4 sm:gap-6 md:gap-8 lg:gap-12 overflow-x-auto py-6 px-4 sm:px-6 md:px-8 ${
              isDragging ? 'dragging' : ''
            }`}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            style={{
              paddingLeft: 'calc(50vw - min(42.5vw, 300px))',
              paddingRight: 'calc(50vw - min(42.5vw, 300px))',
            }}
          >
            {PROJECT_EXAMPLES.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: 50 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="scroll-item flex-shrink-0 group"
                onClick={() => handleItemClick(project, handleProjectClick)}
              >
                <div
                  className="relative min-w-[280px] w-[85vw] sm:w-[75vw] md:w-[70vw] lg:w-[65vw] xl:w-[60vw] aspect-[16/9] overflow-hidden cursor-pointer"
                  style={{ borderRadius: "32px" }}
                >
                  <div className="relative h-full overflow-hidden group" style={{ borderRadius: "32px" }}>
                    <Image
                      src={`/_resources/${project.image}`}
                      alt={`Projekt strony internetowej ${project.title} - Patryk Kulesza`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 85vw, (max-width: 768px) 75vw, (max-width: 1024px) 70vw, (max-width: 1280px) 65vw, 60vw"
                      quality={90}
                      priority={index === 0}
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 z-20">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-white/20 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-white/30 transition-all duration-300 backdrop-blur-sm transform hover:scale-110 active:scale-95 pointer-events-none">
                        <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 z-20 pointer-events-none">
                      <div className="text-white">
                        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-1 sm:mb-2 leading-tight">
                          {project.title}
                        </h3>
                        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300 leading-relaxed">
                          {project.description}
                        </p>
                        <div className="mt-2 sm:mt-3 md:mt-4 text-xs sm:text-sm md:text-base lg:text-lg text-gray-400 font-medium">
                          Zobacz Podgląd →
                        </div>
                      </div>
                    </div>

                    {!isMobile && (
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"
                        style={{ borderRadius: "32px" }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 via-purple-500/5 to-transparent" />
                        <div className="absolute inset-0 shadow-2xl shadow-blue-500/20" />
                        <div className="absolute inset-0 ring-1 ring-white/10" style={{ borderRadius: "32px" }} />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* macOS-style Page Indicator */}
          <div className="flex justify-center items-center gap-3 mt-8 pb-4">
            <button
              onClick={scrollLeft}
              disabled={activeIndex === 0}
              className={`w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 ${
                activeIndex === 0 
                  ? 'text-white/30 cursor-not-allowed' 
                  : 'text-white/60 hover:text-white cursor-pointer'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 relative overflow-hidden">
              {PROJECT_EXAMPLES.map((_, index) => (
                <button
                  key={`dot-${index}`}
                  onClick={() => handleDotClick(index)}
                  className="w-2 h-2 rounded-full bg-white/30 transition-all duration-200 hover:bg-white/50 cursor-pointer"
                  aria-label={`Przejdź do slajdu ${index + 1}`}
                />
              ))}
              
              <div
                className={`absolute w-2 h-2 bg-white pointer-events-none transition-all ease-out ${
                  isAnimating ? 'duration-150 rounded-lg' : 'duration-300 rounded-full'
                }`}
                style={{
                  left: `${16 + (activeIndex * 16)}px`,
                  transform: isAnimating
                    ? `translateX(${animatingDirection === 'right' ? '4px' : '-4px'}) scaleX(1.6)`
                    : 'translateX(0) scaleX(1)',
                  transformOrigin: 'center',
                }}
              />
            </div>

            <button
              onClick={scrollRight}
              disabled={activeIndex === PROJECT_EXAMPLES.length - 1}
              className={`w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 ${
                activeIndex === PROJECT_EXAMPLES.length - 1
                  ? 'text-white/30 cursor-not-allowed'
                  : 'text-white/60 hover:text-white cursor-pointer'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PortfolioSection;