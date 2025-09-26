import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Check, Award } from 'lucide-react';
import { ServiceData, HomePageData } from '../types/types';
import { useMobileDetection, useAdvancedInView } from '../hooks/hooks';

export const ServicesSection = ({ data }: { data: HomePageData }) => {
  const [ref, inView] = useAdvancedInView();
  
  // ==========================================
  // 🎯 STATES FOR DRAG SCROLLING & MOBILE DETECTION
  // ==========================================
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const isMobile = useMobileDetection();

  
  // ==========================================
  // 🆕 STAN DLA ZAWSZE AKTYWNEJ KARTY
  // ==========================================
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0); // Domyślnie pierwsza karta
  const [dragHoveredCardIndex, setDragHoveredCardIndex] = useState<number | null>(null);

  
  // ==========================================
  // 🚀 MOMENTUM SCROLLING STATES
  // ==========================================
  const [velocity, setVelocity] = useState(0);
  const [lastX, setLastX] = useState(0);
  const [lastTime, setLastTime] = useState(0);
  const momentumAnimationRef = useRef<number | null>(null);
  const lastCallTime = useRef<number>(0);

  const handleBookService = (serviceTitle: string) => {
    // Map service titles to form values
    const serviceMapping: { [key: string]: string } = {
      'Matematyka': 'matematyka',
      'Angielski': 'angielski', 
      'Programowanie': 'programowanie',
      'Strony Internetowe': 'strony-internetowe'
    };
    
    const serviceValue = serviceMapping[serviceTitle] || serviceTitle.toLowerCase();
    
    // Sprawdź czy jesteś w przeglądarce
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      // Scroll to contact section with service parameter
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        // Add service to URL hash for auto-fill
        window.location.hash = `contact-${serviceValue}`;
        
        // Smooth scroll to contact
        contactSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
        
        // Trigger custom event for form auto-fill
        window.dispatchEvent(new CustomEvent('autoFillService', {
          detail: { service: serviceValue }
        }));
      }
    }
  };

  // ==========================================
  // 🆕 FUNKCJA DO WYKRYWANIA KARTY POD KURSOREM
  // ==========================================
  const getCardIndexUnderCursor = useCallback((clientX: number, clientY: number) => {
    // Sprawdź czy document istnieje
    if (typeof document === 'undefined') return null;
    
    const elements = document.elementsFromPoint(clientX, clientY);
    for (const element of elements) {
      const cardElement = element.closest('.service-card');
      if (cardElement) {
        const cardIndex = parseInt(cardElement.getAttribute('data-card-index') || '-1');
        if (cardIndex >= 0) return cardIndex;
      }
    }
    return null;
  }, []);

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
    
    // 🆕 Ustaw drag hover ale nie zmieniaj aktywnej karty jeszcze
    const cardIndex = getCardIndexUnderCursor(e.clientX, e.clientY);
    setDragHoveredCardIndex(cardIndex);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      startMomentumAnimation(velocity);
      
      // 🆕 Jeśli kończymy drag na jakiejś karcie, ustaw ją jako aktywną
      if (dragHoveredCardIndex !== null) {
        setActiveCardIndex(dragHoveredCardIndex);
      }
    }
    setIsDragging(false);
    setDragHoveredCardIndex(null);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      startMomentumAnimation(velocity);
    }
    setIsDragging(false);
    setDragHoveredCardIndex(null);
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
    
    // 🆕 Aktualizuj drag hover podczas ruchu
    const cardIndex = getCardIndexUnderCursor(e.clientX, e.clientY);
    setDragHoveredCardIndex(cardIndex);
    
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
  }, [isDragging, startX, scrollLeft, lastTime, lastX, getCardIndexUnderCursor, isMobile]);

  // ==========================================
  // 🆕 FUNKCJA DO USTAWIANIA AKTYWNEJ KARTY
  // ==========================================
  const handleCardHover = useCallback((index: number) => {
    if (!isDragging) {
      setActiveCardIndex(index);
    }
  }, [isDragging]);

  // ==========================================
  // 🆕 FUNKCJA DO OBLICZANIA Z-INDEX - RESPONSIVE
  // ==========================================
  const getCardZIndex = useCallback((index: number) => {
    // Na mobile wszystkie karty mają równy z-index
    if (isMobile) return 10;
    
    // Desktop: Aktywna karta zawsze na wierzchu
    if (activeCardIndex === index) return 100;
    
    // Podczas drag pokazuj również drag hover na wierzchu
    if (isDragging && dragHoveredCardIndex === index) return 99;
    
    // Pozostałe karty w normalnej kolejności
    return data.services.length - index;
  }, [activeCardIndex, dragHoveredCardIndex, isDragging, data.services.length, isMobile]);

  // ==========================================
  // 🆕 FUNKCJA DO OBLICZANIA SCALE - RESPONSIVE
  // ==========================================
  const getCardScale = useCallback((index: number) => {
    // Na mobile wyłącz scaling
    if (isMobile) return 1;
    
    // Desktop: Aktywna karta zawsze powiększona
    if (activeCardIndex === index) {
      return 1.0;
    }
    
    // Podczas drag, karta pod kursorem może być lekko powiększona
    if (isDragging && dragHoveredCardIndex === index) {
      return 1.05;
    }
    
    // Pozostałe karty pomniejszone
    return 0.8;
  }, [activeCardIndex, dragHoveredCardIndex, isDragging, isMobile]);

  // ==========================================
  // 🆕 FUNKCJA DO SPRAWDZANIA CZY KARTA JEST HIGHLIGHTED
  // ==========================================
  const isCardHighlighted = useCallback((index: number) => {
    // Na mobile nie ma highlight effect
    if (isMobile) return false;
    
    return activeCardIndex === index || (isDragging && dragHoveredCardIndex === index);
  }, [activeCardIndex, dragHoveredCardIndex, isDragging, isMobile]);

  // ==========================================
  // 🆕 RESPONSIVE MARGIN CALCULATION
  // ==========================================
  const getCardMargin = useCallback((index: number) => {
    // Na mobile: normalne spacing
    if (isMobile) return '0px';
    
    // Desktop: overlap effect
    return index > 0 ? '-200px' : '0px';
  }, [isMobile]);

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
        .services-scroll-container {
          cursor: ${isMobile ? 'default' : `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'%3E%3Ccircle cx='24' cy='24' r='22' fill='%23000000' fill-opacity='0.8' stroke='%231f6feb' stroke-width='2'/%3E%3Cpath d='M14 24l6-6m-6 6l6 6m-6-6h20m-6-6l6 6m-6 6l6-6' stroke='%231f6feb' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") 24 24, grab`};
        }
        .services-scroll-container.dragging {
          cursor: ${isMobile ? 'default' : `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'%3E%3Ccircle cx='24' cy='24' r='22' fill='%23000000' fill-opacity='0.95' stroke='%231f6feb' stroke-width='2'/%3E%3Cpath d='M14 24l6-6m-6 6l6 6m-6-6h20m-6-6l6 6m-6 6l6-6' stroke='%231f6feb' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") 24 24, grabbing`};
        }
        .services-scroll-container::-webkit-scrollbar {
          display: none;
        }
        .services-scroll-container.dragging {
          user-select: none;
        }
        .services-scroll-container.dragging * {
          cursor: inherit !important;
        }
        
        /* Credit Card Overlap Effect - RESPONSIVE */
        .service-card {
          transform-style: preserve-3d;
          transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
          transform-origin: center center;
        }
        
        .service-card.highlighted {
          transform: translateY(-20px) translateZ(50px) rotateY(-5deg) scale(1.02);
        }
        
        /* Smooth scaling dla wszystkich kart */
        .service-card-content {
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          transform-origin: center center;
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
          .service-card.highlighted {
            transform: none;
          }
          
          .service-card-content {
            transition: all 0.4s ease-out;
            transform: scale(1) !important;
          }
          
          .services-scroll-container {
            overflow-x: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
        }
      `}</style>

      <section 
        ref={ref} 
        id="services" 
        className="py-12 sm:py-16 md:py-20 bg-[#161b22] overflow-hidden"
      >
        <div className="w-full">
          {/* ==========================================
              📝 HEADER SECTION - RESPONSIVE
              ========================================== */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <div className="container mx-auto px-4 sm:px-6">
              <h2 className="text-3xl sm:text-4xl pb-4 md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 md:mb-8 bg-gradient-to-r from-[#f0f6fc] via-[#1f6feb] to-[#58a6ff] bg-clip-text text-transparent">
                Usługi
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#c9d1d9] max-w-3xl mx-auto px-2 sm:px-0">
                Specjalizuję się w korepetycjach z matematyki, angielskiego, programowania i tworzenia stron internetowych.
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
              className={`services-scroll-container flex ${isMobile ? 'gap-4' : 'gap-0'} overflow-x-auto scrollbar-hide py-4 sm:py-6 md:py-8 px-4 sm:px-6 md:px-8 lg:px-12 ${isDragging ? 'dragging' : ''}`}
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
              // Desktop events
              onMouseDown={!isMobile ? handleMouseDown : undefined}
              onMouseUp={!isMobile ? handleMouseUp : undefined}
              onMouseLeave={!isMobile ? handleMouseLeave : undefined}
              onMouseMove={!isMobile ? handleMouseMove : undefined}
              // Mobile touch events
              onTouchStart={isMobile ? (e) => {
                const touch = e.touches[0];
                const cardIndex = getCardIndexUnderCursor(touch.clientX, touch.clientY);
                if (cardIndex !== null) {
                  setActiveCardIndex(cardIndex);
                }
              } : undefined}
            >
              {/* ==========================================
                  💳 SERVICE CARDS MAP - FULLY RESPONSIVE
                  ========================================== */}
              {data.services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ x: 100 + (index * 50), opacity: 0, rotateY: 15 }}
                  animate={inView ? { x: 0, opacity: 1, rotateY: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className={`service-card flex-shrink-0 group ${isCardHighlighted(index) ? 'highlighted' : ''}`}
                  data-card-index={index}
                  style={{
                    marginLeft: getCardMargin(index),
                    zIndex: getCardZIndex(index),
                  }}
                  onMouseEnter={!isMobile ? () => handleCardHover(index) : undefined}
                >
                  {/* ==========================================
                      💳 CREDIT CARD DESIGN - RESPONSIVE DIMENSIONS
                      ========================================== */}
                  <div 
                    className={`service-card-content relative min-w-[320px] w-[95vw] sm:w-[400px] md:w-[500px] lg:w-[700px] xl:w-[800px] 2xl:w-[900px] h-auto min-h-[400px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[550px] xl:min-h-[600px] bg-gradient-to-br ${
                      index % 2 === 0 
                        ? 'from-[#1f6feb] via-[#0d1117] to-[#58a6ff]'
                        : 'from-[#58a6ff] via-[#0d1117] to-[#1f6feb]'
                    } border border-[#30363d] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl hover:shadow-[#1f6feb]/25 transition-all duration-500 flex flex-col`}
                    style={{
                      transform: `scale(${getCardScale(index)})`,
                    }}
                  >
                    
                    {/* Card Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div 
                        className="absolute inset-0" 
                        style={{
                          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.15) 1px, transparent 0)',
                          backgroundSize: '40px 40px'
                        }}
                      />
                    </div>

                    {/* Card Content - RESPONSIVE PADDING */}
                    <div className="relative z-10 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 h-full flex flex-col">
                      
                      {/* Top Section - Icon & Title - RESPONSIVE */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6 md:mb-8 gap-4">
                        <div className="flex items-center">
                          <div className="text-white/90 mr-3 sm:mr-4 md:mr-6 transform group-hover:scale-110 transition-transform duration-300">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center">
                              {service.icon}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-white mb-1 sm:mb-2 leading-tight">
                              {service.title}
                            </h3>
                          </div>
                        </div>
                        
                        {/* Price Tag - RESPONSIVE */}
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 text-center border border-white/30 flex-shrink-0">
                          <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-white mb-0.5 sm:mb-1">
                            {service.price}
                          </div>
                          <div className="text-white/70 text-xs sm:text-sm md:text-base lg:text-xl">
                            {service.title === 'Strony Internetowe' ? 'za projekt' : 'za godzinę'}
                          </div>
                        </div>
                      </div>

                      {/* Middle Section - Description & Levels - RESPONSIVE */}
                      <div className="flex-grow mb-4 sm:mb-6 md:mb-8">
                        <p className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-3 sm:mb-4 md:mb-6">
                          {service.description}
                        </p>
                        
                        <div className="mb-3 sm:mb-4 md:mb-6">
                          <div className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base md:text-lg lg:text-xl">Poziomy:</div>
                          <div className="flex flex-wrap gap-1 sm:gap-2 md:gap-3">
                            {service.levels.map((level, idx) => (
                              <span
                                key={idx}
                                className="px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 bg-white/20 text-white rounded-full text-xs sm:text-sm md:text-base lg:text-xl font-medium border border-white/30 backdrop-blur-sm"
                              >
                                {level}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Features List - RESPONSIVE */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 sm:gap-2 md:gap-3">
                          {service.features.slice(0, isMobile ? 4 : 6).map((feature, idx) => (
                            <div key={idx} className="flex items-center text-white/80">
                              <Check className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white mr-2 sm:mr-3 flex-shrink-0" />
                              <span className="text-xs sm:text-sm md:text-base lg:text-xl leading-tight">{feature}</span>
                            </div>
                          ))}
                          {service.features.length > (isMobile ? 4 : 6) && (
                            <div className="flex items-center text-white/60">
                              <span className="text-xs sm:text-sm md:text-base lg:text-xl">
                                +{service.features.length - (isMobile ? 4 : 6)} więcej...
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Bottom Section - CTA Button - RESPONSIVE */}
                      <div className="flex justify-center mt-auto">
                        <motion.button
                          onClick={() => handleBookService(service.title)}
                          whileHover={{ scale: 1.05, y: -3 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-white text-[#1f6feb] font-bold py-2 sm:py-3 md:py-4 px-4 sm:px-6 md:px-8 rounded-lg sm:rounded-xl md:rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center group/btn cursor-pointer text-sm sm:text-base md:text-lg"
                        >
                          <span className="mr-1 sm:mr-2">
                            {service.title === 'Strony Internetowe' ? 'Zamów stronę' : `Umów ${service.title.toLowerCase()}`}
                          </span>
                          <svg 
                            className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover/btn:translate-x-1" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </motion.button>
                      </div>

                      {/* Card Number Style Decoration - RESPONSIVE */}
                      <div className="absolute bottom-2 sm:bottom-4 md:bottom-6 left-3 sm:left-6 md:left-12 text-white/30 font-mono text-xs sm:text-sm md:text-base lg:text-lg tracking-wider">
                        {`**** **** **** ${String(service.id).padStart(4, '0')}`}
                      </div>
                    </div>

                    {/* Hover Glow Effect - DESKTOP ONLY */}
                    {!isMobile && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl sm:rounded-3xl">
                        <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent rounded-2xl sm:rounded-3xl" />
                        <div className="absolute inset-0 shadow-2xl shadow-white/10 rounded-2xl sm:rounded-3xl" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* ==========================================
                  🎁 PACKAGE DEAL CARD - RESPONSIVE
                  ========================================== */}
              <motion.div
                initial={{ x: 100, opacity: 0, rotateY: 15 }}
                animate={inView ? { x: 0, opacity: 1, rotateY: 0 } : {}}
                transition={{ duration: 0.8, delay: 1 }}
                className="service-card flex-shrink-0"
                data-card-index={data.services.length}
                style={{
                  marginLeft: getCardMargin(data.services.length),
                  zIndex: getCardZIndex(data.services.length),
                }}
                onMouseEnter={!isMobile ? () => handleCardHover(data.services.length) : undefined}
              >
                <div 
                  className="service-card-content min-w-[320px] w-[95vw] sm:w-[400px] md:w-[500px] lg:w-[700px] xl:w-[800px] 2xl:w-[900px] h-auto min-h-[400px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[550px] xl:min-h-[600px] bg-gradient-to-br from-[#58a6ff]/20 to-[#1f6feb]/20 border border-[#1f6feb]/30 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center text-center p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 backdrop-blur-sm"
                  style={{
                    transform: `scale(${getCardScale(data.services.length)})`,
                  }}
                >
                  
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] rounded-full flex items-center justify-center mb-4 sm:mb-6 md:mb-8"
                  >
                    <Award className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                  </motion.div>
                  
                  <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#f0f6fc] mb-3 sm:mb-4 md:mb-6 leading-tight">
                    Pakiet 10 godzin
                  </h3>
                  
                  <p className="text-[#c9d1d9] mb-4 sm:mb-6 md:mb-8 leading-relaxed text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl">
                    Zapisz się na 10 godzin z góry i otrzymaj 20% rabatu! Idealne dla systematycznej nauki.
                  </p>
                  
                  <div className="text-xl sm:text-2xl md:text-3xl text-[#1f6feb] font-black mb-4 sm:mb-6 md:mb-8">
                    Oszczędzasz do 120 zł!
                  </div>
                  
                  <motion.button
                    onClick={() => handleBookService('pakiet')}
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="cursor-pointer bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] text-white font-bold py-2 sm:py-3 md:py-4 px-4 sm:px-6 md:px-8 rounded-lg sm:rounded-xl md:rounded-2xl transition-all duration-300 text-sm sm:text-base md:text-lg lg:text-xl shadow-lg hover:shadow-xl"
                  >
                    Umów pakiet 10h
                  </motion.button>
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
                Przesuń palcem aby zobaczyć wszystkie usługi
                <span className="ml-2">👉</span>
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
};

export default ServicesSection;