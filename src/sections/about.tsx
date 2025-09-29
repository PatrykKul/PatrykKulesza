import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Brain, Calculator, X, ExternalLink, ChevronLeft, ChevronRight, Code, Globe } from 'lucide-react';
import { useAdvancedInView, useDragScroll, useScrollContainerStyles } from '../hooks/hooks';
import { educationStats, certificates, aboutSkills } from '../data/data';
import { Certificate } from '../types/types';


export const AboutSection = () => {
  const [ref, inView] = useAdvancedInView();
  
  // ==========================================
  // 🎯 USE DRAG SCROLL HOOK FOR CERTIFICATES
  // ==========================================
  const {
    scrollContainerRef,
    isDragging,
    isMobile,
    handleMouseDown,
    handleMouseUp,
    handleMouseLeave,
    handleMouseMove,
    handleItemClick
  } = useDragScroll<Certificate>();

  // Use scroll container styles
  useScrollContainerStyles(isMobile);

  // ==========================================
  // 🎨 MODAL STATES
  // ==========================================
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // ==========================================
  // 🎯 CINEMATIC SLIDER STATES
  // ==========================================
  const [activeCategory, setActiveCategory] = useState<string>("Matematyka");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);


  // ==========================================
  // 🎬 CINEMATIC SLIDER FUNCTIONS
  // ==========================================
  const getCurrentSkillsData = () => {
    return aboutSkills.find(s => s.category === activeCategory) || aboutSkills[0];
  };

  const getBackgroundMedia = () => {
    const media = {
      "Matematyka": [
        { type: 'image', src: 'matematyka1.jpg' },
        { type: 'image', src: 'matematyka2.jpg' },
        { type: 'image', src: 'matematyka3.jpg' },
        { type: 'image', src: 'matematyka4.jpg' },
        { type: 'image', src: 'matematyka5.jpg' },
        { type: 'image', src: 'matematyka6.jpg' },
      ],
      "Programowanie": [
        { type: 'image', src: 'programowanie1.jpg' },
        { type: 'image', src: 'programowanie2.png' },
        { type: 'image', src: 'programowanie3.png' },
        { type: 'image', src: 'programowanie4.png' },
        { type: 'image', src: 'programowanie5.jpg' },
      ],
      "Angielski": [
        { type: 'image', src: 'english1.jpg' },
        { type: 'image', src: 'english2.jpg' },
        { type: 'image', src: 'english3.jpg' },
        { type: 'image', src: 'english4.jpg' },
        { type: 'image', src: 'english3.jpg' },
        { type: 'image', src: 'english1.jpg' },
      ],
      "Strony Internetowe": [
        { type: 'image', src: 'next.png' },
        { type: 'image', src: 'hostinger.png' },
        { type: 'image', src: 'woocommerce.png' },
        { type: 'image', src: 'strapi.png' },
        { type: 'video', src: 'responsive1.mp4' },
        { type: 'video', src: 'responsive1.mp4' },
      ],
    };
    
    return media[activeCategory as keyof typeof media] || media["Matematyka"];
  };


  const nextSlide = useCallback(() => {
    const currentData = getCurrentSkillsData();
    setCurrentSlide((prev) => (prev + 1) % currentData.items.length);
  }, [activeCategory]);

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
  }, [isAutoPlaying, inView, activeCategory, currentSlide, nextSlide]);

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
    openModal(cert);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCertificate(null);
    setCurrentImageIndex(0);
  };

  const nextImage = useCallback(() => {
    if (!selectedCertificate) return;
    setCurrentImageIndex((prev) => 
      prev === selectedCertificate.images.length - 1 ? 0 : prev + 1
    );
  }, [selectedCertificate]);

  const prevImage = useCallback(() => {
    if (!selectedCertificate) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? selectedCertificate.images.length - 1 : prev - 1
    );
  }, [selectedCertificate]);

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
  }, [modalOpen, nextImage, prevImage]);

  return (
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 md:mb-8 bg-gradient-to-r from-[#58a6ff] via-[#1f6feb] to-[#0969da] bg-clip-text text-transparent">
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
              {!isMobile && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#1f6feb]/0 via-[#1f6feb]/5 to-[#58a6ff]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              )}
              
              <div className="relative mb-3 sm:mb-4 flex items-center justify-center sm:justify-start">
                <div className="absolute inset-0 bg-[#1f6feb]/20 blur-xl rounded-full scale-150 group-hover:scale-200 transition-transform duration-500 w-12 h-12 sm:w-auto sm:h-auto" />
                <div className="relative text-[#1f6feb] group-hover:text-[#58a6ff] transition-colors duration-300 group-hover:scale-110 transform transition-transform">
                  {stat.icon}
                </div>
              </div>
              
              <div className="text-center sm:text-left">
                <div className="text-2xl sm:text-3xl md:text-4xl font-black mb-1 sm:mb-2 bg-gradient-to-r from-[#58a6ff] to-[#0969da] bg-clip-text text-transparent leading-tight">
                  {stat.value}
                </div>
                
                <div className="text-xs sm:text-base md:text-lg font-bold text-[#1f6feb] mb-1 sm:mb-2 leading-tight">
                  {stat.title}
                </div>
                
                <div className="text-xs sm:text-sm text-[#8b949e] leading-relaxed">
                  {stat.description}
                </div>
              </div>

              {!isMobile && (
                <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#1f6feb]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              )}
              
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
          className="mb-12 sm:mb-16"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-[#f0f6fc]">
            Certyfikaty i kwalifikacje
          </h3>
          <p className="text-center text-[#8b949e] mb-8 sm:mb-12 text-sm sm:text-base">
            Potwierdzone umiejętności i osiągnięcia
          </p>
          
          <div
            ref={scrollContainerRef}
            className={`scroll-container flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto py-4 sm:py-6 px-4 sm:px-6 ${isDragging ? 'dragging' : ''}`}
            style={{
              width: '100%'
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          >
            {certificates.map((cert, index) => (
              <motion.div
                key={cert.title}
                initial={{ x: 100, opacity: 0 }}
                animate={inView ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="scroll-item flex-shrink-0 group"
                onClick={() => handleItemClick(cert, handleCertificateClick)}
                whileHover={!isMobile ? { y: -8, scale: 1.02 } : {}}
              >
                <div 
                  className="relative min-w-[280px] w-[85vw] sm:w-[320px] md:w-[360px] lg:w-[400px] h-[340px] sm:h-[380px] md:h-[420px] bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-[#30363d] rounded-2xl overflow-hidden hover:border-[#1f6feb]/70 transition-all duration-500 shadow-lg group-hover:shadow-2xl group-hover:shadow-[#1f6feb]/20 cursor-pointer flex flex-col"
                >
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
          <h3 className="pb-4 text-2xl sm:text-3xl font-bold text-center mb-4 text-[#f0f6fc]">
            Moja ekspertyza
          </h3>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
            {aboutSkills.map((skill) => (
              <motion.button
                key={skill.category}
                onClick={() => handleCategoryChange(skill.category)}
                className={` cursor-pointer
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
                  <div className={`absolute inset-0 bg-gradient-to-br ${getCurrentSkillsData().color} opacity-20`} />
                     {(() => {
                              const currentMedia = getBackgroundMedia()[currentSlide] || getBackgroundMedia()[0];
                              const basePath = `${process.env.NODE_ENV === 'production' ? '/korepetycje' : ''}/_resources/`;
                              
                              if (currentMedia.type === 'video') {
                                return (
                                  <video 
                                    key={`${activeCategory}-${currentSlide}-video`}
                                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                  >
                                    <source src={`${basePath}${currentMedia.src}`} type="video/mp4" />
                                  </video>
                                );
                              } else {
                                return (
                                  <div 
                                    className="absolute inset-0 opacity-30"
                                    style={{
                                      backgroundImage: `url('${basePath}${currentMedia.src}')`,
                                      backgroundSize: 'cover',
                                      backgroundPosition: 'center'
                                    }}
                                  />
                                );
                              }
                            })()}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/80 to-[#0d1117]/60" />
                  
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
  );
};

export default AboutSection;