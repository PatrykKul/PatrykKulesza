import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Award, BookOpen, Brain, Calculator, X, ExternalLink, ChevronLeft, ChevronRight, Code, Globe } from 'lucide-react';
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
  // 🎯 CINEMATIC SLIDER STATES
  // ==========================================
  const [activeCategory, setActiveCategory] = useState<string>("Matematyka");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

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
        { 
          name: "Python & Data Science",
          description: "Analiza danych, machine learning, pandas, numpy i scikit-learn"
        },
        { 
          name: "React, Next.js & TypeScript",
          description: "Nowoczesne frameworki do budowy interaktywnych aplikacji webowych"
        },
        { 
          name: "HTML, CSS & JavaScript",
          description: "Fundamenty web developmentu - solidne podstawy dla każdego developera"
        },
        { 
          name: "Java",
          description: "Programowanie obiektowe i aplikacje enterprise"
        },
        { 
          name: "PHP & SQL",
          description: "Backend development i zarządzanie bazami danych"
        },
        { 
          name: "C, C++ & C#",
          description: "Języki niskiego poziomu i programowanie systemowe"
        }
      ],
      color: "from-green-500 to-green-600"
    },
    {
      category: "Matematyka",
      items: [
        { 
          name: "Analiza Matematyczna",
          description: "Granice, pochodne, całki i szeregi - fundament matematyki wyższej"
        },
        { 
          name: "Algebra Liniowa",
          description: "Macierze, przestrzenie wektorowe i przekształcenia liniowe"
        },
        { 
          name: "Matematyka Dyskretna",
          description: "Teoria grafów, kombinatoryka i algorytmy dyskretne"
        },
        { 
          name: "Statystyka",
          description: "Analiza danych statystycznych i wnioskowanie statystyczne"
        },
        { 
          name: "Metody Probabilistyczne",
          description: "Rachunek prawdopodobieństwa i procesy stochastyczne"
        },
        { 
          name: "Równania Różniczkowe",
          description: "Modelowanie zjawisk fizycznych i procesów dynamicznych"
        }
      ],
      color: "from-blue-500 to-blue-600"
    },
    {
      category: "Angielski",
      items: [
        { 
          name: "2 Certyfikaty C2 EF SET",
          description: "Najwyższy poziom biegłości językowej potwierdzony certyfikatami"
        },
        { 
          name: "Konwersacje",
          description: "Płynna komunikacja w języku angielskim na każdy temat"
        },
        { 
          name: "Gramatyka",
          description: "Kompleksowa znajomość struktur gramatycznych i ich zastosowania"
        },
        { 
          name: "Matura podstawowa",
          description: "Przygotowanie do egzaminu maturalnego - poziom podstawowy"
        },
        { 
          name: "Matura rozszerzona",
          description: "Zaawansowane przygotowanie do matury rozszerzonej"
        },
        { 
          name: "Pisanie rozprawek",
          description: "Techniki pisania esejów, argumentacji i strukturyzacji tekstu"
        },
        { 
          name: "Listening & Reading",
          description: "Rozumienie ze słuchu i czytanie ze zrozumieniem"
        }
      ],
      color: "from-purple-500 to-purple-600"
    },
    {
      category: "Strony Internetowe",
      items: [
        { 
          name: "Next.js & React",
          description: "Nowoczesne frameworki do budowy szybkich aplikacji webowych"
        },
        { 
          name: "Hostinger Builder",
          description: "Szybkie tworzenie stron bez kodowania dla klientów biznesowych"
        },
        { 
          name: "WordPress & WooCommerce",
          description: "Najpopularniejszy CMS i platforma e-commerce na świecie"
        },
        { 
          name: "Strapi CMS",
          description: "Headless CMS do zarządzania treścią i API"
        },
        { 
          name: "SEO & Performance",
          description: "Optymalizacja pod wyszukiwarki i szybkość ładowania"
        },
        { 
          name: "Responsywny Design",
          description: "Strony działające idealnie na wszystkich urządzeniach"
        }
      ],
      color: "from-orange-500 to-red-600"
    }
  ];

  // ==========================================
  // 🎬 CINEMATIC SLIDER FUNCTIONS
  // ==========================================
  const getCurrentSkillsData = () => {
    return skills.find(s => s.category === activeCategory) || skills[0];
  };

  const nextSlide = () => {
    const currentData = getCurrentSkillsData();
    setCurrentSlide((prev) => (prev + 1) % currentData.items.length);
  };

  const prevSlide = () => {
    const currentData = getCurrentSkillsData();
    setCurrentSlide((prev) => (prev - 1 + currentData.items.length) % currentData.items.length);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentSlide(0);
    setIsAutoPlaying(true);
  };

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && inView) {
      autoPlayRef.current = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, inView, activeCategory, currentSlide]);

  const handleSlideInteraction = () => {
    setIsAutoPlaying(false);
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  // Icon mapping
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case "Matematyka":
        return <Calculator className="w-5 h-5" />;
      case "Programowanie":
        return <Code className="w-5 h-5" />;
      case "Angielski":
        return <Globe className="w-5 h-5" />;
      case "Strony Internetowe":
        return <Globe className="w-5 h-5" />;
      default:
        return <Brain className="w-5 h-5" />;
    }
  };

  const openModal = (cert: Certificate) => {
    setSelectedCertificate(cert);
    setCurrentImageIndex(0);
    setModalOpen(true);
  };

  const handleCertificateClick = (cert: Certificate) => {
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

{/* Stats Grid - ENHANCED & RESPONSIVE */}
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={inView ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 0.8, delay: 0.2 }}
  className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 mb-12 sm:mb-16 px-2 sm:px-0"
>
  {educationStats.map((stat, index) => (
    <motion.div
      key={stat.title}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
      className="relative bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-[#30363d] rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-5 md:p-6 hover:border-[#1f6feb]/70 transition-all duration-500 group overflow-hidden"
      whileHover={!isMobile ? { y: -8, scale: 1.02 } : {}}
      whileTap={isMobile ? { scale: 0.98 } : {}}
    >
      {/* Glow effect - only desktop */}
      {!isMobile && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1f6feb]/0 via-[#1f6feb]/5 to-[#58a6ff]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}
      
      {/* Icon with animated background */}
      <div className="relative mb-3 sm:mb-4 flex items-center justify-center sm:justify-start">
        <div className="absolute inset-0 bg-[#1f6feb]/20 blur-xl rounded-full scale-150 group-hover:scale-200 transition-transform duration-500 w-12 h-12 sm:w-auto sm:h-auto" />
        <div className="relative text-[#1f6feb] group-hover:text-[#58a6ff] transition-colors duration-300 group-hover:scale-110 transform transition-transform">
          {stat.icon}
        </div>
      </div>
      
      {/* Content wrapper for better mobile layout */}
      <div className="text-center sm:text-left">
        {/* Value with gradient */}
        <div className="text-2xl sm:text-3xl md:text-4xl font-black mb-1 sm:mb-2 bg-gradient-to-r from-[#f0f6fc] to-[#1f6feb] bg-clip-text text-transparent leading-tight">
          {stat.value}
        </div>
        
        {/* Title */}
        <div className="text-xs sm:text-base md:text-lg font-bold text-[#1f6feb] mb-1 sm:mb-2 leading-tight">
          {stat.title}
        </div>
        
        {/* Description */}
        <div className="text-xs sm:text-sm text-[#8b949e] leading-relaxed">
          {stat.description}
        </div>
      </div>

      {/* Decorative corner - only desktop */}
      {!isMobile && (
        <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#1f6feb]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}
      
      {/* Mobile subtle border highlight */}
      {isMobile && (
        <div className="absolute inset-0 border border-[#1f6feb]/20 rounded-xl opacity-0 group-active:opacity-100 transition-opacity duration-200 pointer-events-none" />
      )}
    </motion.div>
  ))}
</motion.div>

          {/* Certificates Section with Drag Scrolling  */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`mb-12 sm:mb-16 certificates-section ${isDragging ? 'dragging' : ''}`}
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-center mb-4">
              <span className="bg-gradient-to-r from-[#f0f6fc] via-[#1f6feb] to-[#58a6ff] bg-clip-text text-transparent">
                Certyfikaty i kwalifikacje
              </span>
            </h3>
            <p className="text-center text-[#8b949e] mb-8 sm:mb-12 text-sm sm:text-base">
              Potwierdzone umiejętności i osiągnięcia
            </p>
            
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
                  whileHover={!isMobile ? { y: -8, scale: 1.02 } : {}}
                >
                  <div 
                    className="relative min-w-[280px] w-[85vw] sm:w-[320px] md:w-[360px] lg:w-[400px] h-[340px] sm:h-[380px] md:h-[420px] bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-[#30363d] rounded-2xl overflow-hidden hover:border-[#1f6feb]/70 transition-all duration-500 shadow-lg group-hover:shadow-2xl group-hover:shadow-[#1f6feb]/20 cursor-pointer flex flex-col"
                    onClick={() => handleCertificateClick(cert)}
                  >
                    {/* Certificate Image Section */}
                    <div className="h-[220px] sm:h-[260px] relative overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#1f6feb]/10 via-[#161b22] to-[#58a6ff]/10">
                      <Image
                        src={`${process.env.NODE_ENV === 'production' ? '/korepetycje' : ''}/_resources/${cert.images[0]}`}
                        alt={`${cert.title} - certyfikat`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 768px) 85vw, (max-width: 1024px) 400px, 400px"
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent" />
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 p-4 sm:p-5 flex flex-col justify-center text-center relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1f6feb]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <h4 className="relative text-lg sm:text-xl font-bold text-[#f0f6fc] mb-2 leading-tight">
                        {cert.title}
                      </h4>
                      
                      <p className="relative font-semibold text-[#1f6feb] text-sm sm:text-base mb-3">
                        {cert.issuer}
                      </p>
                      
                      <div className="relative text-xs sm:text-sm text-[#8b949e] group-hover:text-[#1f6feb] transition-colors duration-300">
                        Kliknij aby zobaczyć szczegóły
                      </div>
                    </div>

                    {!isMobile && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1f6feb]/10 via-transparent to-transparent" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-center mt-4 md:hidden"
              >
                <p className="text-xs text-[#8b949e]">
                  Przesuń aby zobaczyć więcej certyfikatów
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* CINEMATIC SLIDER - NEW EXPERTISE SECTION */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-12 sm:mb-16"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-center mb-4">
              <span className="bg-gradient-to-r from-[#f0f6fc] via-[#1f6feb] to-[#58a6ff] bg-clip-text text-transparent">
                Moja ekspertyza
              </span>
            </h3>
            <p className="text-center text-[#8b949e] mb-8 sm:mb-12 text-sm sm:text-base">
              Wybierz kategorię aby zobaczyć szczegóły
            </p>

            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
              {skills.map((skill) => (
                <motion.button
                  key={skill.category}
                  onClick={() => handleCategoryChange(skill.category)}
                  className={`
                    px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base
                    transition-all duration-300 flex items-center gap-2
                    ${activeCategory === skill.category 
                      ? `bg-gradient-to-r ${skill.color} text-white shadow-lg scale-105` 
                      : 'bg-[#161b22] text-[#8b949e] border border-[#30363d] hover:border-[#1f6feb]/50 hover:text-[#f0f6fc]'
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {getCategoryIcon(skill.category)}
                  <span>{skill.category}</span>
                </motion.button>
              ))}
            </div>

            {/* Cinematic Slider */}
            <div className="relative max-w-6xl mx-auto">
              <div className="relative h-[400px] sm:h-[500px] md:h-[600px] rounded-3xl overflow-hidden bg-[#161b22] border border-[#30363d]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeCategory}-${currentSlide}`}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    {/* Background Image/Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${getCurrentSkillsData().color} opacity-20`} />
                    <div 
                      className="absolute inset-0 opacity-30"
                      style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-${
                          activeCategory === 'Matematyka' ? '1635070041078-e2b19650cd33' :
                          activeCategory === 'Programowanie' ? '1461749280684-6dad0a0fb56f' :
                          activeCategory === 'Angielski' ? '1546410531-bb4caa6b424d' :
                          '1460925895917-afdab827c52f'
                        }?w=1200&h=800&fit=crop')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/80 to-[#0d1117]/60" />
                    
                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-end p-6 sm:p-8 md:p-12">
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                      >
                        <h4 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#f0f6fc] mb-3 sm:mb-4 leading-tight">
                          {getCurrentSkillsData().items[currentSlide].name}
                        </h4>
                        <p className="text-base sm:text-lg md:text-xl text-[#c9d1d9] max-w-3xl leading-relaxed">
                          {getCurrentSkillsData().items[currentSlide].description}
                        </p>
                      </motion.div>

                      {/* Progress Indicators */}
                      <div className="flex gap-2 mt-6 sm:mt-8">
                        {getCurrentSkillsData().items.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setCurrentSlide(idx);
                              handleSlideInteraction();
                            }}
                            className={`h-1 rounded-full transition-all duration-300 ${
                              idx === currentSlide 
                                ? `bg-gradient-to-r ${getCurrentSkillsData().color} w-12` 
                                : 'bg-[#30363d] w-8 hover:w-10'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                <button
                  onClick={() => {
                    prevSlide();
                    handleSlideInteraction();
                  }}
                  className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all duration-300 border border-white/20 z-10 backdrop-blur-sm"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                
                <button
                  onClick={() => {
                    nextSlide();
                    handleSlideInteraction();
                  }}
                  className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all duration-300 border border-white/20 z-10 backdrop-blur-sm"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-lg"
              onClick={closeModal}
            />
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative bg-[#161b22] border border-[#30363d] rounded-3xl overflow-hidden w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
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

              <div className="flex-1 relative">
                {selectedCertificate.images.length > 1 && (
                  <div className="text-center py-2 sm:py-3 bg-[#0d1117]/50 border-b border-[#30363d]">
                    <span className="text-sm text-[#8b949e]">
                      {currentImageIndex + 1} z {selectedCertificate.images.length}
                    </span>
                  </div>
                )}
                
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