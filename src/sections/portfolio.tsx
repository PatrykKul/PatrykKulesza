// ==========================================
// 🎨 PORTFOLIO SECTION - Project Gallery
// ==========================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ExternalLink, Code, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdvancedInView, useMobileDetection } from '../hooks/hooks';

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  technologies: string[];
  liveUrl?: string;
  codeUrl?: string;
}

const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: "Wieslawski Studio",
    description: "Profesjonalna strona internetowa dla studia fotograficznego. Nowoczesny design z galerią prac i systemem rezerwacji.",
    image: "wieslawskiStudio.webp",
    category: "Web Development",
    technologies: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    liveUrl: "https://wieslawskistudio.pl"
  },
  {
    id: 2,
    title: "Patryk Kul - Portfolio", 
    description: "Osobiste portfolio prezentujące projekty i umiejętności. Responsywny design z animacjami i nowoczesnym interfejsem.",
    image: "patrykkul.webp",
    category: "Web Development",
    technologies: ["Next.js", "React", "Framer Motion", "Tailwind CSS"],
    liveUrl: "https://patrykkul.pl"
  }
];

export const PortfolioSection = () => {
  const [ref, inView] = useAdvancedInView();
  const isMobile = useMobileDetection();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animatingDirection, setAnimatingDirection] = useState<'left' | 'right' | null>(null);
  
  // Drag scroll states
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);

  const currentProject = portfolioItems[activeIndex];
  const backgroundImage = currentProject?.image;

  // Momentum scrolling
  const [velocity, setVelocity] = useState(0);
  const [lastX, setLastX] = useState(0);
  const [lastTime, setLastTime] = useState(0);
  const momentumAnimationRef = useRef<number | null>(null);

  // Drag handlers with momentum
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current || isMobile) return;
    
    // Stop any ongoing momentum
    if (momentumAnimationRef.current) {
      cancelAnimationFrame(momentumAnimationRef.current);
      momentumAnimationRef.current = null;
    }
    
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    setDragDistance(0);
    setLastX(e.pageX);
    setLastTime(Date.now());
    setVelocity(0);
  };

  const handleMouseUp = () => {
    if (isDragging && Math.abs(velocity) > 0.5) {
      startMomentumScroll(velocity);
    }
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    if (isDragging && Math.abs(velocity) > 0.5) {
      startMomentumScroll(velocity);
    }
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    
    const currentTime = Date.now();
    const currentX = e.pageX;
    const x = currentX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.8;
    
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    setDragDistance(Math.abs(walk));
    
    // Calculate velocity
    const timeDiff = currentTime - lastTime;
    if (timeDiff > 0) {
      const xDiff = currentX - lastX;
      const newVelocity = (xDiff / timeDiff) * 16;
      setVelocity(newVelocity);
    }
    
    setLastX(currentX);
    setLastTime(currentTime);
  };

  const startMomentumScroll = (initialVelocity: number) => {
    if (!scrollContainerRef.current) return;
    
    let currentVelocity = initialVelocity;
    const deceleration = 0.95;
    const minVelocity = 0.5;
    
    const animate = () => {
      if (!scrollContainerRef.current) return;
      
      const currentScrollLeft = scrollContainerRef.current.scrollLeft;
      const newScrollLeft = currentScrollLeft - currentVelocity;
      
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
  };

  // Cleanup momentum on unmount
  useEffect(() => {
    return () => {
      if (momentumAnimationRef.current) {
        cancelAnimationFrame(momentumAnimationRef.current);
      }
    };
  }, []);

  // Update active index based on scroll position
  const updateActiveIndex = useCallback(() => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    const cards = container.querySelectorAll('.scroll-item');
    
    let closestIndex = 0;
    let closestDistance = Infinity;
    
    cards.forEach((card, index) => {
      const cardElement = card as HTMLElement;
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardElement.offsetLeft + cardRect.width / 2;
      const distance = Math.abs(cardCenter - containerCenter);
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });
    
    if (closestIndex !== activeIndex && !isAnimating) {
      setActiveIndex(closestIndex);
    }
  }, [activeIndex, isAnimating]);

  // Track scrolling
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updateActiveIndex, 100);
    };
    
    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [updateActiveIndex]);

  const handleProjectClick = (item: PortfolioItem) => {
    if (dragDistance > 5) return;
    if (item.liveUrl) {
      window.open(item.liveUrl, '_blank');
    }
  };

  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current || isAnimating) return;
    
    setIsAnimating(true);
    setAnimatingDirection(index > activeIndex ? 'right' : 'left');
    setActiveIndex(index);

    const container = scrollContainerRef.current;
    const targetCard = container.querySelector(`.scroll-item:nth-child(${index + 1})`) as HTMLElement;
    
    if (targetCard) {
      const containerCenter = container.clientWidth / 2;
      const cardCenter = targetCard.offsetLeft + targetCard.clientWidth / 2;
      const scrollLeft = cardCenter - containerCenter;
      
      container.scrollTo({ 
        left: Math.max(0, scrollLeft), 
        behavior: 'smooth' 
      });
    }

    setTimeout(() => {
      setIsAnimating(false);
      setAnimatingDirection(null);
    }, 200);
  };

  const scrollLeftBtn = () => {
    if (activeIndex > 0) {
      scrollToIndex(activeIndex - 1);
    }
  };

  const scrollRightBtn = () => {
    if (activeIndex < portfolioItems.length - 1) {
      scrollToIndex(activeIndex + 1);
    }
  };

  const handleDotClick = (index: number) => {
    scrollToIndex(index);
  };

  return (
    <section
      ref={ref}
      id="portfolio"
      className="py-12 sm:py-16 md:py-20 relative overflow-hidden bg-[#0d1117]"
    >
      {/* Dynamic background */}
      <div
        className="absolute inset-0 transition-all duration-1000 ease-out"
        style={{
          backgroundImage: backgroundImage 
            ? `url(${process.env.NODE_ENV === 'production' ? '/korepetycje' : ''}/_resources/${backgroundImage})` 
            : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(20px) brightness(0.25)',
          transform: 'scale(1.1)',
        }}
      />

      <div className="absolute inset-0 bg-black/70" />

      {/* Side gradients */}
      <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-[#0d1117] to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-[#0d1117] to-transparent z-20 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-[#f0f6fc] via-[#1f6feb] to-[#58a6ff] bg-clip-text text-transparent">
                Portfolio
              </span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#c9d1d9] max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
              Wybrane projekty i realizacje - strony internetowe i aplikacje webowe.
            </p>
          </motion.div>
        </div>

        {/* Projects scroll container */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className={`flex gap-4 sm:gap-6 md:gap-8 lg:gap-12 overflow-x-auto py-6 px-4 sm:px-6 scroll-smooth ${
              isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
            }`}
            onMouseDown={!isMobile ? handleMouseDown : undefined}
            onMouseUp={!isMobile ? handleMouseUp : undefined}
            onMouseLeave={!isMobile ? handleMouseLeave : undefined}
            onMouseMove={!isMobile ? handleMouseMove : undefined}
            style={{
              paddingLeft: 'calc(50% - min(85vw, 600px) / 2)',
              paddingRight: 'calc(50% - min(85vw, 600px) / 2)',
              scrollSnapType: 'x mandatory',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {portfolioItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 50 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="scroll-item flex-shrink-0 group cursor-pointer"
                onClick={() => handleProjectClick(item)}
                style={{ scrollSnapAlign: 'center' }}
              >
                <div
                  className="relative min-w-[320px] w-[85vw] sm:w-[75vw] md:w-[65vw] lg:w-[600px] overflow-hidden rounded-[30px] sm:rounded-[40px] md:rounded-[50px] bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-[#30363d] hover:border-[#1f6feb]/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#1f6feb]/10"
                  style={{ 
                    transform: isDragging ? 'scale(1)' : 'scale(1)',
                  }}
                >
                  {/* Image Container */}
                  <div className="relative h-64 sm:h-72 md:h-80 overflow-hidden">
                    <Image
                      src={`${process.env.NODE_ENV === 'production' ? '/korepetycje' : ''}/_resources/${item.image}`}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 85vw, (max-width: 768px) 75vw, (max-width: 1024px) 65vw, 600px"
                      quality={85}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    {/* Overlay buttons - desktop only */}
                    {!isMobile && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                          {item.liveUrl && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(item.liveUrl, '_blank');
                              }}
                              className="flex items-center px-3 py-2 bg-[#1f6feb] text-white rounded-lg text-sm font-medium hover:bg-[#58a6ff] transition-colors"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Zobacz stronę
                            </button>
                          )}
                          {item.codeUrl && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(item.codeUrl, '_blank');
                              }}
                              className="flex items-center px-3 py-2 bg-[#161b22] text-white rounded-lg text-sm font-medium hover:bg-[#30363d] transition-colors"
                            >
                              <Code className="w-4 h-4 mr-2" />
                              Kod
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Mobile external link indicator */}
                    {isMobile && item.liveUrl && (
                      <div className="absolute bottom-4 right-4 z-20">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white shadow-lg backdrop-blur-sm pointer-events-none">
                          <ExternalLink className="w-5 h-5" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5 md:p-6">
                    {/* Category */}
                    <div className="text-xs sm:text-sm text-[#1f6feb] font-medium mb-2">
                      {item.category}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-bold text-[#f0f6fc] mb-2 sm:mb-3 group-hover:text-[#1f6feb] transition-colors leading-tight">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-[#8b949e] mb-3 sm:mb-4 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2">
                      {item.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 sm:px-3 py-1 bg-[#1f6feb]/10 text-[#1f6feb] text-xs sm:text-sm rounded-full border border-[#1f6feb]/20"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Hover effect - desktop only */}
                  {!isMobile && (
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none rounded-[30px] sm:rounded-[40px] md:rounded-[50px]">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1f6feb]/5 via-transparent to-transparent" />
                      <div className="absolute inset-0 ring-1 ring-white/10 rounded-[30px] sm:rounded-[40px] md:rounded-[50px]" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Navigation indicators - ENHANCED */}
          <div className="flex justify-center items-center gap-3 sm:gap-4 mt-6 sm:mt-8 pb-4">
            <button
              onClick={scrollLeftBtn}
              disabled={activeIndex === 0}
              className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center transition-all duration-300 border border-white/10 ${
                activeIndex === 0 
                  ? 'text-white/20 cursor-not-allowed opacity-50' 
                  : 'text-white/70 hover:text-white hover:bg-white/20 hover:border-white/20 hover:scale-110 cursor-pointer shadow-lg shadow-black/20'
              }`}
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md rounded-2xl px-5 sm:px-6 py-3 sm:py-3.5 flex items-center gap-2.5 sm:gap-3 relative overflow-hidden border border-white/10 shadow-lg shadow-black/20">
              {portfolioItems.map((_, index) => (
                <button
                  key={`dot-${index}`}
                  onClick={() => handleDotClick(index)}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
                    index === activeIndex 
                      ? 'bg-white/40 scale-110' 
                      : 'bg-white/25 hover:bg-white/40 hover:scale-110'
                  } cursor-pointer`}
                  aria-label={`Przejdź do projektu ${index + 1}`}
                />
              ))}
              
              {/* Active indicator with smooth animation */}
              <div
                className={`absolute w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white rounded-full pointer-events-none transition-all ease-out shadow-lg shadow-white/50 ${
                  isAnimating ? 'duration-150 scale-150' : 'duration-300 scale-100'
                }`}
                style={{
                  left: `${20 + (activeIndex * (isMobile ? 20 : 22))}px`,
                  transform: isAnimating
                    ? `translateX(${animatingDirection === 'right' ? '6px' : '-6px'})`
                    : 'translateX(0)',
                  transformOrigin: 'center',
                }}
              />
            </div>

            <button
              onClick={scrollRightBtn}
              disabled={activeIndex === portfolioItems.length - 1}
              className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center transition-all duration-300 border border-white/10 ${
                activeIndex === portfolioItems.length - 1
                  ? 'text-white/20 cursor-not-allowed opacity-50'
                  : 'text-white/70 hover:text-white hover:bg-white/20 hover:border-white/20 hover:scale-110 cursor-pointer shadow-lg shadow-black/20'
              }`}
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12 sm:mt-16 container mx-auto px-4 sm:px-6"
        >
          <p className="text-sm sm:text-base text-[#8b949e] mb-4 sm:mb-6">
            Masz pomysł na projekt? Stwórzmy coś razem!
          </p>
          <motion.a
            href="#contact"
            className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] text-white text-sm sm:text-base font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#1f6feb]/25 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Porozmawiajmy o Twoim projekcie
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default PortfolioSection;