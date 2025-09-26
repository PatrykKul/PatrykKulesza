import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Award, BookOpen, Brain, Calculator, X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdvancedInView, useMobileDetection } from '../hooks/hooks';
import { Certificate, EducationStat, Skill } from '../types/types';


export const AboutSection = () => {
  const [ref, inView] = useAdvancedInView();
  const isMobile = useMobileDetection();
  // ==========================================
  // 🎨 MODAL STATES
  // ==========================================
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // ==========================================
  // 📊 STATES DLA DRAG SCROLLING
  // ==========================================
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);
  
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
    setStartY(e.pageY);
    setDragDistance(0);
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
    const y = e.pageY;
    const walk = (x - startX) * 1.5;
    
    // Oblicz dystans przeciągnięcia
    const distance = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));
    setDragDistance(distance);
    
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
  }, [isDragging, startX, startY, scrollLeft, lastTime, lastX, isMobile]);

  // ==========================================
  // 🎯 CLEANUP
  // ==========================================
  useEffect(() => {
    return () => stopMomentumAnimation();
  }, [stopMomentumAnimation]);

  const educationStats: EducationStat[] = [
    {
      title: "Średnia na studiach",
      value: "4.76",
      description: "Stypendium rektorskie 3 lata z rzędu",
      icon: <Award className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
    },
    {
      title: "Matura matematyka",
      value: "93%",
      description: "Poziom rozszerzony",
      icon: <Calculator className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
    },
    {
      title: "Angielski EF SET",
      value: "C2", 
      description: "75/100 i 71/100 - Oba poziom biegły",
      icon: <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
    },
    {
      title: "Lat doświadczenia",
      value: "5+",
      description: "Ponad 60 uczniów",
      icon: <Brain className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
    }
  ];

  const certificates: Certificate[] = [
        {
      title: "Angielski C2 Proficient",
      issuer: "EF SET",
      images: [ "efset-certificate-2.png", "efset-certificate.png"],
      links: [ "https://cert.efset.org/en/r3Hft9","https://cert.efset.org/en/r3Hft9"]
    },
    {
      title: "AutoCAD",
      issuer: "Autodesk",
      images: ["autocad-level1.png", "autocad-level2.png", "autocad-general.png"]
    },
    {
      title: "Programowanie drukarek 3D",
      issuer: "Kwalifikacje zawodowe",
      images: ["3d-printer-cert.png"]
    },
    {
      title: "Kwalifikacje zawodowe",
      issuer: "Technik informatyk",
      images: ["inf02-cert.png", "inf03-cert.png", "diploma.png"]
    }
  ];

  const skills: Skill[] = [
    {
      category: "Programowanie",
      items: [
        { name: "Python"},
        { name: "React, Next.js, Strapi, Tailwind CSS & TypeScript"},
        { name: "HTML, CSS, JavaScript"},
        { name: "Java"},
        { name: "PHP, SQL"},
        { name: "C, C++ i C#"}
      ],
      color: "from-green-500 to-green-600"
    },
    {
      category: "Matematyka",
      items: [
        { name: "Analiza Matematyczna" },
        { name: "Algebra Liniowa" },
        { name: "Matematyka Dyskretna" },
        { name: "Statystyka" },
        { name: "Metody Probabilistyczne" },
        { name: "Równania Różniczkowe" }
      ],
      color: "from-blue-500 to-blue-600"
    },
      {
    category: "Angielski",
    items: [
      { name: "2 Certyfikaty C2 EF SET"},
      { name: "Konwersacje"},
      { name: "Gramatyka"},
      { name: "Matura podstawowa"},
      { name: "Matura rozszerzona"},
      { name: "Pisanie rozprawek"},
      { name: "Listening & Reading"},
    ],
    color: "from-purple-500 to-purple-600"
  }
  ];

  const openModal = (cert: Certificate) => {
    setSelectedCertificate(cert);
    setCurrentImageIndex(0);
    setModalOpen(true);
  };

  const handleCertificateClick = (cert: Certificate) => {
    // Jeśli dystans przeciągnięcia jest większy niż 5px, to nie otwieraj modala
    if (dragDistance > 5) {
      return;
    }
    openModal(cert);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCertificate(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (!selectedCertificate) return;
    setCurrentImageIndex((prev) => 
      prev === selectedCertificate.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!selectedCertificate) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? selectedCertificate.images.length - 1 : prev - 1
    );
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!modalOpen) return;
      
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [modalOpen]);

  return (
    <>
      {/* ==========================================
          🎨 CUSTOM CURSOR STYLES - RESPONSIVE
          ========================================== */}
      <style jsx>{`
        .certificates-scroll-container {
          cursor: ${isMobile ? 'default' : `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'%3E%3Ccircle cx='24' cy='24' r='22' fill='%23000000' fill-opacity='0.8' stroke='%231f6feb' stroke-width='2'/%3E%3Cpath d='M14 24l6-6m-6 6l6 6m-6-6h20m-6-6l6 6m-6 6l6-6' stroke='%231f6feb' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") 24 24, grab`};
        }
        .certificates-section.dragging {
          cursor: ${isMobile ? 'default' : `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'%3E%3Ccircle cx='24' cy='24' r='22' fill='%23000000' fill-opacity='0.95' stroke='%231f6feb' stroke-width='2'/%3E%3Cpath d='M14 24l6-6m-6 6l6 6m-6-6h20m-6-6l6 6m-6 6l6-6' stroke='%231f6feb' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") 24 24, grabbing`};
        }
        .certificates-scroll-container::-webkit-scrollbar {
          display: none;
        }
        .certificates-section.dragging {
          user-select: none;
        }
        .certificates-section * {
          cursor: inherit !important;
        }
        
        /* Mobile scroll indicators */
        @media (max-width: 768px) {
          .certificates-scroll-container {
            overflow-x: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
        }
      `}</style>

      <section ref={ref} id="about" className="py-12 sm:py-16 md:py-20 bg-[#0d1117] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(31, 111, 235, 0.15) 1px, transparent 0)',
              backgroundSize: '32px 32px'
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 md:mb-8 bg-gradient-to-r from-[#f0f6fc] via-[#1f6feb] to-[#58a6ff] bg-clip-text text-transparent">
              O mnie
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#c9d1d9] max-w-4xl mx-auto leading-relaxed px-2 sm:px-0">
              Student informatyki III roku z pasją do nauczania. Specjalizuję się w Data Science i web developmencie, 
              pomagając uczniom osiągać sukcesy od <span className="text-[#1f6feb] font-semibold">5 lat</span>.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16"
          >
            {educationStats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="bg-[#161b22] border border-[#30363d] rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 hover:border-[#1f6feb]/50 transition-all duration-300 group"
                whileHover={{ y: -5 }}
              >
                <div className="text-[#1f6feb] mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#f0f6fc] mb-1 sm:mb-2">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base md:text-lg font-semibold text-[#1f6feb] mb-1">
                  {stat.title}
                </div>
                <div className="text-xs sm:text-sm text-[#8b949e] leading-relaxed">
                  {stat.description}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Certificates Section with Drag Scrolling */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`mb-12 sm:mb-16 certificates-section ${isDragging ? 'dragging' : ''}`}
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-center text-[#f0f6fc] mb-8 sm:mb-12">
              Certyfikaty i kwalifikacje
            </h3>
            
            <div
              ref={scrollContainerRef}
              className="certificates-scroll-container flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto scrollbar-hide py-4 sm:py-6 px-4 sm:px-6"
              onMouseDown={!isMobile ? handleMouseDown : undefined}
              onMouseUp={!isMobile ? handleMouseUp : undefined}
              onMouseLeave={!isMobile ? handleMouseLeave : undefined}
              onMouseMove={!isMobile ? handleMouseMove : undefined}
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {certificates.map((cert, index) => (
                <motion.div
                  key={cert.title}
                  initial={{ x: 100, opacity: 0 }}
                  animate={inView ? { x: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  className="flex-shrink-0 group"
                  whileHover={!isMobile ? { y: -5, scale: 1.02 } : {}}
                >
                  <div 
                    className="relative min-w-[280px] w-[85vw] sm:w-[320px] md:w-[360px] lg:w-[400px] h-[320px] sm:h-[360px] md:h-[400px] bg-[#161b22] border border-[#30363d] rounded-xl sm:rounded-2xl overflow-hidden hover:border-[#1f6feb]/50 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:shadow-[#1f6feb]/10 cursor-pointer flex flex-col"
                    onClick={() => handleCertificateClick(cert)}
                  >
                    
                    {/* Certificate Image Section */}
                    <div className="h-[200px] sm:h-[240px] relative overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#1f6feb]/10 to-[#58a6ff]/10">
                      <Image
                        src={`${process.env.NODE_ENV === 'production' ? '/korepetycje' : ''}/_resources/${cert.images[0]}`}
                        alt={`${cert.title} - certyfikat`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 85vw, (max-width: 1024px) 400px, 400px"
                      />
                      
                      {/* Gradient overlay for better text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 p-3 sm:p-4 md:p-5 flex flex-col justify-center text-center">
                      <h4 className="text-lg sm:text-xl font-bold text-[#f0f6fc] mb-2 leading-tight">
                        {cert.title}
                      </h4>
                      
                      <p className="font-semibold text-[#1f6feb] text-sm sm:text-base mb-4">
                        {cert.issuer}
                      </p>
                      
                      {/* Action hint */}
                      <div className="text-xs sm:text-sm">
                        <span className="text-[#8b949e] group-hover:text-[#1f6feb] transition-colors">
                          Kliknij aby zobaczyć
                        </span>
                      </div>
                    </div>

                    {/* Hover Effect - DESKTOP ONLY */}
                    {!isMobile && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl sm:rounded-2xl">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1f6feb]/5 to-transparent rounded-xl sm:rounded-2xl" />
                        <div className="absolute inset-0 shadow-2xl shadow-[#1f6feb]/25 rounded-xl sm:rounded-2xl" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mobile Scroll Hint */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-center mt-4 md:hidden"
              >
                <p className="text-xs text-[#8b949e] flex items-center justify-center">
                  <span className="mr-2">👈</span>
                  Przesuń aby zobaczyć więcej certyfikatów
                  <span className="ml-2">👉</span>
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Skills & Expertise */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-12 sm:mb-16"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-center text-[#f0f6fc] mb-8 sm:mb-12">
              Moja ekspertyza
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
              {skills.map((skill) => (
                <div
                  key={skill.category}
                  className="bg-[#161b22] border border-[#30363d] rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6"
                >
                  <div className={`inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r ${skill.color} text-white font-semibold mb-4 sm:mb-6 text-sm sm:text-base`}>
                    {skill.category}
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    {skill.items.map((item) => (
                      <div key={item.name} className="flex items-center">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#1f6feb] rounded-full mr-2 sm:mr-3"></div>
                        <span className="text-sm sm:text-base text-[#c9d1d9]">
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Personal Quote */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-[#1f6feb]/10 to-[#58a6ff]/10 border border-[#1f6feb]/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
              <div className="text-2xl sm:text-3xl md:text-4xl text-[#1f6feb] mb-2 sm:mb-4">&quot;</div>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#f0f6fc] leading-relaxed italic font-light mb-3 sm:mb-4 px-2 sm:px-0">
                Każdy uczeń ma potencjał na sukces. Moją rolą jest odkryć go i pomóc mu rozkwitnąć. 
                <span className="block sm:inline mt-2 sm:mt-0">
                  Nauka to nie tylko teoria - to budowanie pewności siebie i osiąganie celów.
                </span>
              </p>
              <div className="text-[#1f6feb] font-semibold text-sm sm:text-base">
                - Patryk Kulesza
              </div>
            </div>
          </motion.div>
        </div>

{/* Modal for Certificate Gallery */}
{modalOpen && selectedCertificate && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
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
    
    {/* Modal Content */}
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.8, opacity: 0, y: 50 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative bg-[#161b22] border border-[#30363d] rounded-2xl sm:rounded-3xl overflow-hidden w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] flex flex-col shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-[#30363d] flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#f0f6fc] leading-tight">
            {selectedCertificate.title}
          </h2>
          <p className="text-sm sm:text-base text-[#c9d1d9] mt-1">
            {selectedCertificate.issuer} 
          </p>
        </div>
        
        <button
          onClick={closeModal}
          className="w-8 h-8 sm:w-10 sm:h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all duration-300 border border-white/20 ml-4"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative">
        
        {/* Image Counter */}
        {selectedCertificate.images.length > 1 && (
          <div className="text-center py-2 sm:py-3 bg-[#0d1117]/50 border-b border-[#30363d]">
            <span className="text-sm text-[#8b949e]">
              {currentImageIndex + 1} z {selectedCertificate.images.length}
            </span>
          </div>
        )}
        
        {/* Image Display Area */}
        <div className="flex-1 relative bg-gradient-to-br from-[#1f6feb]/10 via-[#161b22] to-[#58a6ff]/10 p-4 sm:p-6 md:p-8" style={{minHeight: '400px'}}>
          <div className="w-full max-w-4xl mx-auto bg-[#0d1117] border border-[#30363d] rounded-lg relative group overflow-auto max-h-[60vh] sm:max-h-[70vh]">
            <div className="relative w-full">
              <Image
                src={`${process.env.NODE_ENV === 'production' ? '/korepetycje' : ''}/_resources/${selectedCertificate.images[currentImageIndex]}`}
                alt={`${selectedCertificate.title} - certyfikat`}
                width={1200}
                height={800}
                className="w-full h-auto rounded-lg"
                sizes="(max-width: 768px) 95vw, 80vw"
              />
            </div>
            
            {/* Floating Verification Button (appears on hover over image) */}
            {selectedCertificate.links && (
              <motion.a
                href={selectedCertificate.links[0]}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  transition: { delay: 0.5 }
                }}
                className="absolute top-4 right-4 px-3 py-2 bg-black/80 backdrop-blur-md text-white text-xs sm:text-sm rounded-lg border border-white/20 hover:bg-black/90 hover:border-green-400/50 hover:text-green-400 transition-all duration-300 opacity-0 group-hover:opacity-100 flex items-center gap-1.5 z-10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Weryfikuj online</span>
                <span className="sm:hidden">Weryfikuj</span>
              </motion.a>
            )}
          </div>
          
          {/* Navigation Arrows */}
          {selectedCertificate.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="cursor-pointer absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all duration-300 border border-white/20 z-10"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              
              <button
                onClick={nextImage}
                className="cursor-pointer absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all duration-300 border border-white/20 z-10"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  </motion.div>
)}
      </section>
    </>
  );
};

export default AboutSection;