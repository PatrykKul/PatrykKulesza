'use client';

import Image from 'next/image';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { 
  ExternalLink,
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  BookOpen, 
  Calculator, 
  Code, 
  Globe,  
  Brain, 
  ChevronDown,
  Menu,
  X,
  Github,
  Linkedin,
  Check,
  Award,
  Send,
  Facebook,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// ==========================================
// 🎯 TYPESCRIPT INTERFACES
// ==========================================
interface HeroData {
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  stats: {
    experience: string;
    students: string;
    successRate: string;
  };
}

interface ServiceData {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  levels: string[];
  price: string;
  features: string[];
}

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  image?: string;
  demoUrl?: string;
  technologies: string[];
  type: 'web' | 'desktop' | 'game' | 'ml' | 'tool';
  category: string;
}

interface TestimonialData {
  id: number;
  name: string;
  grade: string;
  result: string;
  opinion: string;
  rating: number;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

interface HomePageData {
  hero: HeroData;
  services: ServiceData[];
  portfolio: PortfolioItem[];
  testimonials: TestimonialData[];
  faq: FaqItem[];
  contact: {
    phone: string;
    email: string;
    location: string;
  };
}

// ==========================================
// 📱 CONSTANTS
// ==========================================
const ANIMATION_CONFIG = {
  COOLDOWN_SECONDS: 300,
  DRAG_MULTIPLIER: 1.5,
  FRAME_THROTTLE: 16,
  DECELERATION: 0.95,
  MIN_VELOCITY: 0.1
} as const;

// ==========================================
// 📱 CUSTOM HOOK - MOBILE DETECTION
// ==========================================
const useMobileDetection = () => {
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
// 🎯 STRUCTURED DATA FUNCTIONS  
// ==========================================
const generateFAQStructuredData = (faqItems: FaqItem[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };
};

const generateReviewsStructuredData = (testimonials: TestimonialData[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Patryk Kulesza - Korepetycje",
    "review": testimonials.map(testimonial => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": testimonial.name
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": testimonial.rating,
        "bestRating": "5"
      },
      "reviewBody": testimonial.opinion
    }))
  };
};

// ==========================================
// 🎯 CUSTOM HOOK - INTERSECTION OBSERVER
// ==========================================
const useAdvancedInView = (threshold: number = 0.1) => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { 
    amount: threshold,
    once: true 
  });
  return [ref, isInView] as const;
};

// ==========================================
// 🎯 ODWOLANIA DLA MENU
// ==========================================
const MENU_ITEMS = [
  { label: 'Start', href: '#hero' },
  { label: 'O mnie', href: '#about' },
  { label: 'Opinie', href: '#testimonials' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Usługi', href: '#services' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Kontakt', href: '#contact' }
];

// ==========================================
// 🧭 IMPROVED HEADER/NAVBAR COMPONENT
// ==========================================
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === 'undefined') return;
      
      setIsScrolled(window.scrollY > 50);
      
      // Active section tracking
      const sections = MENU_ITEMS.map(item => item.href.substring(1));
      const current = sections.find(section => {
        if (typeof document === 'undefined') return false;
        
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (current) {
        setActiveSection(current);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);


  // Smooth scroll handler
  const handleMenuClick = (href: string) => {
    setIsMenuOpen(false);
    
    if (href.startsWith('#') && typeof document !== 'undefined') {
      const element = document.getElementById(href.substring(1));
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  return (
    <>
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#0d1117]/95 backdrop-blur-lg border-b border-[#1f6feb]/30 shadow-lg shadow-[#1f6feb]/10' 
            : 'bg-[#0d1117]/80 backdrop-blur-sm border-b border-[#30363d]'
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            
            {/* Enhanced Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <motion.div 
                className="w-10 h-10 bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] text-white text-sm font-black flex items-center justify-center rounded-xl shadow-lg"
                whileHover={{ rotate: 5 }}
              >
                PK
              </motion.div>
              <motion.span 
                className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#f0f6fc] to-[#1f6feb] bg-clip-text text-transparent"
                whileHover={{ x: 3 }}
              >
                Patryk Kulesza
              </motion.span>
            </motion.div>

            {/* Enhanced Desktop Menu */}
            <nav className="hidden lg:flex items-center space-x-1">
              {MENU_ITEMS.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleMenuClick(item.href);
                  }}
                  className={`relative px-5 py-3 rounded-full font-semibold text-lg transition-all duration-300 ${
                    activeSection === item.href.substring(1)
                      ? 'text-white bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] shadow-lg shadow-[#1f6feb]/30'
                      : 'text-[#f0f6fc] hover:text-[#1f6feb] hover:bg-[#1f6feb]/10'
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -2
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                  
                  {/* Active indicator */}
                  {activeSection === item.href.substring(1) && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute inset-0 bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.a>
              ))}
            </nav>

            {/* Enhanced Mobile Menu Button */}
            <motion.button
              className="lg:hidden p-3 rounded-xl bg-[#1f6feb]/10 border border-[#1f6feb]/20 text-[#1f6feb] hover:bg-[#1f6feb]/20 transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Enhanced Mobile Menu - Side Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0d1117]/90 backdrop-blur-lg"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Menu Content - From Right Side */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 h-full w-80 bg-gradient-to-br from-[#161b22] to-[#0d1117] border-l border-[#1f6feb]/20 shadow-2xl"
            >
              <div className="flex flex-col h-full pt-24 pb-8 px-6">
                
                {/* Logo in mobile menu */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="flex items-center space-x-3 mb-8 pb-6 border-b border-[#30363d]"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] text-white text-xs font-black flex items-center justify-center rounded-lg">
                    PK
                  </div>
                  <span className="text-lg font-bold text-[#f0f6fc]">
                    Patryk Kulesza
                  </span>
                </motion.div>

                {/* Menu Items */}
                <div className="flex-1 space-y-2">
                  {MENU_ITEMS.map((item, index) => (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleMenuClick(item.href);
                      }}
                      className={`block w-full text-left px-6 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                        activeSection === item.href.substring(1)
                          ? 'bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] text-white shadow-lg'
                          : 'text-[#f0f6fc] hover:bg-[#1f6feb]/10 hover:text-[#1f6feb]'
                      }`}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ x: 10, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {item.label}
                    </motion.a>
                  ))}
                </div>
                
                {/* Mobile Contact Info */}
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="border-t border-[#30363d] pt-6 space-y-3"
                >
                  <div className="text-center text-[#8b949e] text-sm">
                    Skontaktuj się ze mną
                  </div>
                  <div className="text-center">
                    <a 
                      href="mailto:patryk27_2003@o2.pl"
                      className="text-[#1f6feb] hover:text-[#58a6ff] transition-colors text-sm"
                    >
                      patryk27_2003@o2.pl
                    </a>
                  </div>
                  <div className="text-center">
                    <a 
                      href="tel:+48662581368"
                      className="text-[#1f6feb] hover:text-[#58a6ff] transition-colors text-sm"
                    >
                      +48 662 581 368
                    </a>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ==========================================
// 🚀 RESPONSIVE HERO SECTION - Mobile First
// ==========================================
const HeroSection = ({ data }: { data: HomePageData }) => {
  const [ref, inView] = useAdvancedInView();

  return (
    <section
      ref={ref}
      id="hero"
      className="min-h-screen flex items-center bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#1f6feb]/20 relative overflow-hidden pt-16 md:pt-20"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1f6feb]/5 to-transparent" />
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(31, 111, 235, 0.15) 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        
        {/* MAIN CONTENT - RESPONSIVE LAYOUT */}
        <div className="flex flex-col lg:grid lg:grid-cols-5 gap-8 lg:gap-12 items-center mb-8 lg:mb-4">
          
          {/* LEFT COLUMN - TEXT CONTENT */}
          <div className="w-full lg:col-span-3 text-center lg:text-left">
            
            {/* H1 - Main Title - Responsive Typography */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 sm:mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-[#f0f6fc] via-[#1f6feb] to-[#58a6ff] bg-clip-text text-transparent">
                Twój sukces,
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#58a6ff] via-[#1f6feb] to-[#f0f6fc] bg-clip-text text-transparent">
                nasze wspólne dzieło
              </span>
            </motion.h1>

            {/* H2 - SEO Optimized Subtitle - Mobile Responsive */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl text-[#c9d1d9] font-medium mb-4 sm:mb-6 tracking-wide px-2 lg:px-0"
            >
              Korepetycje Białystok, Zambrów i okolice • Matematyka • Angielski • Programowanie
              
            </motion.h2>

            {/* Description - Mobile Optimized */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#f0f6fc] mb-4 sm:mb-6 leading-relaxed font-light px-2 lg:px-0"
            >
              Specjalizuję się w korepetycjach z{' '}
              <span className="text-[#1f6feb] font-semibold">matematyki</span>,{' '}
              <span className="text-[#1f6feb] font-semibold">angielskiego</span>,{' '}
              <span className="text-[#1f6feb] font-semibold">programowania</span> ,a także tworzę{' '}
              <span className="text-[#1f6feb] font-semibold">strony internetowe</span>.
              <br className="hidden sm:block" />
              <span className="text-[#58a6ff] block sm:inline mt-2 sm:mt-0">
                Indywidualne podejście = gwarantowane rezultaty.
              </span>
            </motion.p>

            {/* Enhanced Credentials - Mobile Responsive */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mb-6 lg:mb-0"
            >
              <div className="text-xs sm:text-sm md:text-base lg:text-xl text-[#cae2ea] font-light px-2 lg:px-0">
                👨‍🏫 Private Tutor • 🔬 Data Science • 💻 Web Development • 🎯 Zambrów & Białystok
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN - BRAIN IMAGE - FULLY RESPONSIVE */}
          <div className="w-full lg:col-span-2 flex justify-center lg:justify-end order-first lg:order-last">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
            >
              {/* Floating Animation Container */}
              <motion.div
                animate={{ 
                  y: [-10, 10, -10],
                  rotate: [-1, 1, -1]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                {/* Glow Effect - Responsive */}
                <div className="absolute inset-0 bg-[#1f6feb]/20 rounded-full blur-2xl sm:blur-3xl scale-110"></div>
                
                {/* Brain Image - RESPONSIVE with aspect ratio */}
                <div className="relative w-full aspect-square">
                  <Image
                    src={`${process.env.NODE_ENV === 'production' ? '/korepetycje' : ''}/_resources/brain.png`}
                    alt="Neural Network Brain - Korepetycje Programowanie i Matematyka" 
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                    sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, (max-width: 1024px) 400px, (max-width: 1280px) 480px, 550px"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* STATISTICS - FULLY RESPONSIVE */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 max-w-5xl mx-auto"
        >
          <div className="bg-[#161b22]/50 backdrop-blur-sm border border-[#30363d]/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 hover:border-[#1f6feb]/50 transition-all duration-300 text-center">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#1f6feb] mb-1 sm:mb-2">
              {data.hero.stats.experience}
            </div>
            <div className="text-[#c9d1d9] text-xs sm:text-sm uppercase tracking-wider font-medium">
              lat doświadczenia
            </div>
          </div>
          
          <div className="bg-[#161b22]/50 backdrop-blur-sm border border-[#30363d]/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 hover:border-[#1f6feb]/50 transition-all duration-300 text-center">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#1f6feb] mb-1 sm:mb-2">
              {data.hero.stats.students}
            </div>
            <div className="text-[#c9d1d9] text-xs sm:text-sm uppercase tracking-wider font-medium">
              zadowolonych uczniów
            </div>
          </div>
          
          <div className="bg-[#161b22]/50 backdrop-blur-sm border border-[#30363d]/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 hover:border-[#1f6feb]/50 transition-all duration-300 text-center sm:col-span-1 col-span-1">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#1f6feb] mb-1 sm:mb-2">
              {data.hero.stats.successRate}
            </div>
            <div className="text-[#c9d1d9] text-xs sm:text-sm uppercase tracking-wider font-medium">
              zdawalność egzaminów
            </div>
          </div>
        </motion.div>

        {/* CTA BUTTONS - RESPONSIVE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 px-4 sm:px-0"
        >
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] text-white font-bold rounded-xl sm:rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#1f6feb]/25 text-base sm:text-lg text-center"
          >
            <span className="relative z-10 flex items-center justify-center">
              {data.hero.cta}
              <svg 
                className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </motion.a>

          <motion.a
            href="#services"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-[#1f6feb] text-[#1f6feb] font-bold rounded-xl sm:rounded-2xl hover:bg-[#1f6feb] hover:text-white transition-all duration-300 text-base sm:text-lg text-center"
          >
            Zobacz usługi
          </motion.a>
        </motion.div>

        {/* TRUST INDICATORS - RESPONSIVE */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="pb-4 flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-6 lg:gap-8 text-[#c9d1d9] px-4 sm:px-0"
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#1f6feb] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-bold text-sm sm:text-base lg:text-lg">Online i stacjonarnie</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#1f6feb] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-bold text-sm sm:text-base lg:text-lg">Materiały własne</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ==========================================
// 🎓 RESPONSIVE ABOUT SECTION - Mobile First
// ==========================================

// ==========================================
// 🎯 TYPESCRIPT INTERFACES
// ==========================================
interface EducationStat {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}

interface SkillItem {
  name: string;
}

interface Skill {
  category: string;
  items: SkillItem[];
  color: string;
}

interface Certificate {
  title: string;
  issuer: string;
  images: string[];
  links?: string[]; // Opcjonalny link dla certyfikatów online
}

const AboutSection = () => {
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

// ==========================================
// ⭐ RESPONSIVE TESTIMONIALS SECTION - Mobile First
// ==========================================
const TestimonialsSection = ({ data }: { data: HomePageData }) => {
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

// ==========================================
// 🎨 RESPONSIVE PORTFOLIO SECTION - Mobile First
// ==========================================
const PortfolioSection = ({ data }: { data: HomePageData }) => {
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

// ==========================================
// 💼 RESPONSIVE SERVICES SECTION - Money Maker Mobile First 💰
// ==========================================
const ServicesSection = ({ data }: { data: HomePageData }) => {
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

// ==========================================
// ❓ RESPONSIVE FAQ SECTION - Mobile First
// ==========================================
const FaqSection = ({ data }: { data: HomePageData }) => {
  const [ref, inView] = useAdvancedInView();
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = useCallback((index: number) => {
    setOpenItems(prev => 
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  }, []);

  return (
    <section ref={ref} id="faq" className="py-12 sm:py-16 md:py-20 bg-[#0d1117]">
      {/* Structured data dla FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQStructuredData(data.faq))
        }}
      />
      
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 md:mb-8 bg-gradient-to-r from-[#f0f6fc] via-[#1f6feb] to-[#58a6ff] bg-clip-text text-transparent">
            FAQ
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#8b949e] max-w-3xl mx-auto px-2 sm:px-0">
            Najczęściej zadawane pytania o korepetycje
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto space-y-3 sm:space-y-4 md:space-y-6">
          {data.faq.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-[#161b22] border border-[#30363d] rounded-lg sm:rounded-xl overflow-hidden hover:border-[#1f6feb]/50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6 md:py-8 text-left flex items-center justify-between group focus:outline-none cursor-pointer"
              >
                <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-[#1f6feb] group-hover:text-[#58a6ff] transition-colors duration-300 pr-3 sm:pr-4 md:pr-6 leading-relaxed">
                  {item.question}
                </h3>
                
                <motion.div
                  animate={{ rotate: openItems.includes(index) ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#1f6feb]" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openItems.includes(index) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 sm:px-6 md:px-8 lg:px-10 pb-4 sm:pb-6 md:pb-8 border-t border-[#30363d]">
                      <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="pt-3 sm:pt-4 md:pt-6"
                      >
                        <p className="text-[#f0f6fc] text-sm sm:text-base md:text-lg leading-relaxed whitespace-pre-line">
                          {item.answer}
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 📞 CONTACT SECTION - walidacja
// ==========================================
const ContactSection = ({ data }: { data: HomePageData }) => {
  const [ref, inView] = useAdvancedInView();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    website: '' // Honeypot field - anty-bot
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [cooldownTime, setCooldownTime] = useState(0);

  // Inicjalizacja EmailJS
  useEffect(() => {
    emailjs.init('7K0ksAqXHemL_xEgT');
  }, []);

// Timer cooldown
useEffect(() => {
  // Sprawdź localStorage tylko w przeglądarce
  if (typeof window !== 'undefined') {
    const lastSent = window.localStorage ? localStorage.getItem('email_sent_time') : null;
    if (lastSent) {
      const timePassed = Date.now() - parseInt(lastSent);
      const minutesPassed = timePassed / (1000 * 60);
      if (minutesPassed < 5) {
        const remainingSeconds = ANIMATION_CONFIG.COOLDOWN_SECONDS - Math.floor(timePassed / 1000);
        if (remainingSeconds > 0) {
          setCooldownTime(remainingSeconds);
        }
      }
    }
  }

    let interval: NodeJS.Timeout;
    if (cooldownTime > 0) {
      interval = setInterval(() => {
        setCooldownTime(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [cooldownTime]);

  // ==========================================
  // 🔍 FUNKCJE WALIDACJI - PROSTE ALE SKUTECZNE
  // ==========================================
  
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Imię i nazwisko jest wymagane';
        if (value.trim().length < 2) return 'Minimum 2 znaki';
        if (value.trim().length > 50) return 'Maximum 50 znaków';
        if (!/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s\-']+$/.test(value.trim())) return 'Tylko litery, spacje i myślniki';

        return '';

      case 'email':
        if (!value.trim()) return 'Email jest wymagany';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Nieprawidłowy format email';
        return '';

      case 'phone':
        if (!value.trim()) return 'Telefon jest wymagany';
        const digits = value.replace(/\D/g, '');
        if (digits.length < 9) return 'Minimum 9 cyfr';
        return '';

      case 'subject':
        if (!value) return 'Wybierz opcję';
        return '';

      case 'message':
        if (!value.trim()) return 'Wiadomość jest wymagana';
        if (value.trim().length < 10) return 'Minimum 10 znaków';
        if (value.length > 1000) return 'Maximum 1000 znaków';
        return '';

      default:
        return '';
    }
  };

  // Sprawdź czy cały formularz jest ważny
  const isFormValid = () => {
    const requiredFields = ['name', 'email', 'phone', 'subject', 'message'];
    
    // Sprawdź czy wszystkie pola są wypełnione
    const hasAllFields = requiredFields.every(field => {
      const value = formData[field as keyof typeof formData];
      return value && value.trim() !== '';
    });
    
    // Sprawdź czy nie ma błędów w wypełnionych polach
    const hasNoErrors = requiredFields.every(field => {
      const value = formData[field as keyof typeof formData];
      if (!value || value.trim() === '') return true; // Puste pole = brak błędu na tym etapie
      return validateField(field, value) === '';
    });
    
    return hasAllFields && hasNoErrors;
  };

  // Sprawdź czy można wysłać formularz (uwzględnia cooldown)
  const canSubmit = () => {
    return isFormValid() && !isSubmitting && cooldownTime === 0;
  };

  // ==========================================
  // 📝 OBSŁUGA FORMULARZA
  // ==========================================
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Formatowanie telefonu w locie
    let formattedValue = value;
    if (name === 'phone') {
      const digits = value.replace(/\D/g, '');
      if (digits.length <= 3) {
        formattedValue = digits;
      } else if (digits.length <= 6) {
        formattedValue = `${digits.slice(0, 3)} ${digits.slice(3)}`;
      } else if (digits.length <= 9) {
        formattedValue = `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
      } else {
        formattedValue = `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Walidacja po zmianie (tylko jeśli pole było już dotknięte)
    if (touchedFields.has(name)) {
      const error = validateField(name, formattedValue);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }

    // Reset submit status gdy użytkownik zaczyna pisać ponownie
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Oznacz pole jako dotknięte
    setTouchedFields(prev => new Set(prev).add(name));
    
    // Waliduj pole
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const scrollToContact = () => {
    if (typeof document !== 'undefined') {
      const contactElement = document.getElementById('contact');
      if (contactElement) {
        contactElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sprawdź honeypot (anty-bot)
    if (formData.website) {
      console.log('Bot detected');
      return;
    }

    // Sprawdź cooldown
    if (cooldownTime > 0) {
      return;
    }

    // Waliduj wszystkie pola
    const newErrors: FormErrors = {};
    ['name', 'email', 'phone', 'subject', 'message'].forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) newErrors[field as keyof FormErrors] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouchedFields(new Set(['name', 'email', 'phone', 'subject', 'message']));
      scrollToContact();
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message
      };

    await emailjs.send(
      'service_ax6r24o',
      'template_iay34wr',
      templateParams
    );

      setSubmitStatus('success');
      
       // Sprawdź localStorage przed zapisem
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('email_sent_time', Date.now().toString());
      }

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        website: ''
      });
      setErrors({});
      setTouchedFields(new Set());

      // Ustaw cooldown na 300 sekund
      setCooldownTime(ANIMATION_CONFIG.COOLDOWN_SECONDS);
      
      // Zostań w sekcji contact
      setTimeout(() => {
        scrollToContact();
      }, 100);
      
  } catch (error: unknown) {
    console.error('Email send failed:', error);
    
    // Sprawdź czy error ma właściwości których potrzebujesz
    let errorMessage = 'Wystąpił błąd. Spróbuj ponownie lub zadzwoń bezpośrednio.';
    
    // Type guard - sprawdź czy error to obiekt z właściwością status
    if (error && typeof error === 'object' && 'status' in error) {
      const emailError = error as { status: number; text?: string };
      
      if (emailError.status === 429) {
        errorMessage = 'Za dużo zapytań. Poczekaj chwilę i spróbuj ponownie.';
      } else if (emailError.status === 400) {
        errorMessage = 'Nieprawidłowe dane w formularzu. Sprawdź wszystkie pola.';
      }
    }
    
    // Sprawdź czy error ma właściwość text
    if (error && typeof error === 'object' && 'text' in error) {
      const textError = error as { text: string };
      if (textError.text?.includes('network')) {
        errorMessage = 'Problem z połączeniem internetowym. Sprawdź sieć.';
      }
    }
    
    setErrors({ message: errorMessage });
    setSubmitStatus('error');
    scrollToContact();
  } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-fill service from URL hash or custom event
  useEffect(() => {
  const checkHash = () => {
    // Sprawdź czy window istnieje
    if (typeof window === 'undefined') return;
    
    const hash = window.location.hash;
    if (hash.startsWith('#contact-')) {
      const service = hash.replace('#contact-', '');
      setFormData(prev => ({ ...prev, subject: service }));
    }
  };

  const handleAutoFill = (event: CustomEvent) => {
    const { service } = event.detail;
    
    let message = '';
    
    if (service === 'pakiet') {
      message = 'Jestem zainteresowany/a pakietem 10 godzin z rabatem 20%. Proszę o kontakt w sprawie szczegółów.';
    } else if (service === 'strony-internetowe') {
      message = 'Jestem zainteresowany/a zamówieniem strony internetowej. Proszę o kontakt w sprawie szczegółów projektu, wyceny i terminu realizacji.';
    } else {
      message = `Jestem zainteresowany/a korepetycjami z przedmiotu: ${service}. Proszę o kontakt.`;
    }
    
    setFormData(prev => ({ 
      ...prev, 
      subject: service,
      message: message
    }));

    setTouchedFields(prev => new Set(prev).add('subject').add('message'));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.subject;
      delete newErrors.message;
      return newErrors;
    });
  };
  
  checkHash();
  
  // Sprawdź czy window istnieje przed dodaniem event listenerów
  if (typeof window !== 'undefined') {
    window.addEventListener('hashchange', checkHash);
    window.addEventListener('autoFillService', handleAutoFill as EventListener);

    return () => {
      window.removeEventListener('hashchange', checkHash);
      window.removeEventListener('autoFillService', handleAutoFill as EventListener);
    };
  }
  }, []);

  return (
    <section ref={ref} id="contact" className="py-20 bg-[#161b22]">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-extrabold mb-8 bg-gradient-to-r from-[#f0f6fc] via-[#1f6feb] to-[#58a6ff] bg-clip-text text-transparent">
            Kontakt
          </h2>
          <p className="text-xl text-[#c9d1d9] max-w-3xl mx-auto">
            Gotowy na rozpoczęcie nauki lub zamówienie strony? Skontaktuj się ze mną już dziś!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-[#f0f6fc] mb-8">Informacje kontaktowe</h3>
            
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#1f6feb]/20 rounded-lg flex items-center justify-center mr-4">
                  <Phone className="w-6 h-6 text-[#1f6feb]" />
                </div>
                <div>
                  <div className="text-[#f0f6fc] font-semibold">Telefon</div>
                  <a 
                    href={`tel:${data.contact.phone}`}
                    className="text-[#c9d1d9] hover:text-[#1f6feb] transition-colors"
                  >
                    {data.contact.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#1f6feb]/20 rounded-lg flex items-center justify-center mr-4">
                  <Mail className="w-6 h-6 text-[#1f6feb]" />
                </div>
                <div>
                  <div className="text-[#f0f6fc] font-semibold">Email</div>
                  <a 
                    href={`mailto:${data.contact.email}`}
                    className="text-[#c9d1d9] hover:text-[#1f6feb] transition-colors"
                  >
                    {data.contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#1f6feb]/20 rounded-lg flex items-center justify-center mr-4">
                  <MapPin className="w-6 h-6 text-[#1f6feb]" />
                </div>
                <div>
                  <div className="text-[#f0f6fc] font-semibold">Lokalizacja</div>
                  <div className="text-[#c9d1d9]">{data.contact.location}</div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex space-x-4">
              <a
                href="https://www.linkedin.com/in/patryk-kulesza-788397354"
                className="w-12 h-12 bg-[#1f6feb]/20 rounded-lg flex items-center justify-center hover:bg-[#1f6feb]/30 transition-colors"
              >
                <Linkedin className="w-6 h-6 text-[#1f6feb]" />
              </a>
              <a
                href="https://github.com/PatrykKul"
                className="w-12 h-12 bg-[#1f6feb]/20 rounded-lg flex items-center justify-center hover:bg-[#1f6feb]/30 transition-colors"
              >
                <Github className="w-6 h-6 text-[#1f6feb]" />
              </a>
              <a
                href="https://www.facebook.com/patryk.kulesza.790"
                className="w-12 h-12 bg-[#1f6feb]/20 rounded-lg flex items-center justify-center hover:bg-[#1f6feb]/30 transition-colors"
              >
                <Facebook className="w-6 h-6 text-[#1f6feb]" />
              </a>
            </div>

            {/* Quick Contact Actions */}
            <div className="mt-8 space-y-3">
              <h4 className="text-xl font-semibold text-[#f0f6fc]">Szybki kontakt:</h4>
              <div className="flex flex-col space-y-2">
                <a
                  href={`tel:${data.contact.phone}`}
                  className="flex items-center px-4 py-2 bg-[#1f6feb]/10 rounded-lg hover:bg-[#1f6feb]/20 transition-colors text-[#1f6feb]"
                >
                  <Phone className="w-6 h-6 mr-3" />
                  <span className="text-xl font-medium">
                    Zadzwoń teraz
                  </span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot field - ukryte pole anty-bot */}
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg"
                >
                  ✅ Wiadomość została wysłana! Odpowiem w ciągu 24 godzin.
                </motion.div>
              )}
              
              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg"
                >
                  ❌ Wystąpił błąd. Spróbuj ponownie lub zadzwoń bezpośrednio.
                </motion.div>
              )}

              {/* Cooldown Message */}
              {cooldownTime > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-blue-500/20 border border-blue-500/50 text-blue-400 px-4 py-3 rounded-lg"
                >
                  ⏱️ Poczekaj {cooldownTime} sekund przed wysłaniem kolejnej wiadomości.
                </motion.div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div>
                  <label className="block text-[#f0f6fc] font-semibold mb-2">
                    Imię i nazwisko <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 bg-[#0d1117] border rounded-lg text-[#f0f6fc] focus:outline-none transition-colors placeholder-[#8b949e] disabled:opacity-50 ${
                      errors.name 
                        ? 'border-red-500 focus:border-red-400' 
                        : formData.name && !errors.name
                        ? 'border-green-500 focus:border-green-400'
                        : 'border-[#30363d] focus:border-[#1f6feb]'
                    }`}
                    placeholder="Jan Kowalski"
                  />
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm mt-1 flex items-center"
                    >
                      <span className="mr-1">⚠️</span>
                      {errors.name}
                    </motion.p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-[#f0f6fc] font-semibold mb-2">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 bg-[#0d1117] border rounded-lg text-[#f0f6fc] focus:outline-none transition-colors placeholder-[#8b949e] disabled:opacity-50 ${
                      errors.email 
                        ? 'border-red-500 focus:border-red-400' 
                        : formData.email && !errors.email
                        ? 'border-green-500 focus:border-green-400'
                        : 'border-[#30363d] focus:border-[#1f6feb]'
                    }`}
                    placeholder="jan@example.com"
                  />
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm mt-1 flex items-center"
                    >
                      <span className="mr-1">⚠️</span>
                      {errors.email}
                    </motion.p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Phone Field */}
                <div>
                  <label className="block text-[#f0f6fc] font-semibold mb-2">
                    Telefon <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 bg-[#0d1117] border rounded-lg text-[#f0f6fc] focus:outline-none transition-colors placeholder-[#8b949e] disabled:opacity-50 ${
                      errors.phone 
                        ? 'border-red-500 focus:border-red-400' 
                        : formData.phone && !errors.phone
                        ? 'border-green-500 focus:border-green-400'
                        : 'border-[#30363d] focus:border-[#1f6feb]'
                    }`}
                    placeholder="123 456 789"
                  />
                  {errors.phone && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm mt-1 flex items-center"
                    >
                      <span className="mr-1">⚠️</span>
                      {errors.phone}
                    </motion.p>
                  )}
                </div>

                {/* Subject Field - DODANA OPCJA STRONY */}
                <div>
                  <label className="block text-[#f0f6fc] font-semibold mb-2">
                    Przedmiot/Usługa <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 bg-[#0d1117] border rounded-lg text-[#f0f6fc] focus:outline-none transition-colors disabled:opacity-50 ${
                      errors.subject 
                        ? 'border-red-500 focus:border-red-400' 
                        : formData.subject && !errors.subject
                        ? 'border-green-500 focus:border-green-400'
                        : 'border-[#30363d] focus:border-[#1f6feb]'
                    }`}
                  >
                    <option value="">Wybierz opcję</option>
                    <option value="matematyka">Matematyka</option>
                    <option value="angielski">Angielski</option>
                    <option value="programowanie">Programowanie</option>
                    <option value="strony-internetowe">Strony Internetowe</option>
                    <option value="pakiet">Pakiet 10 godzin</option>
                    <option value="inne">Inne</option>
                  </select>
                  {errors.subject && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm mt-1 flex items-center"
                    >
                      <span className="mr-1">⚠️</span>
                      {errors.subject}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-[#f0f6fc] font-semibold mb-2">
                  Wiadomość <span className="text-red-400">*</span>
                  <span className={`text-sm font-normal ml-2 ${
                    formData.message.length > 900 ? 'text-orange-400' : 'text-[#8b949e]'
                  }`}>
                    ({formData.message.length}/1000)
                  </span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={5}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 bg-[#0d1117] border rounded-lg text-[#f0f6fc] focus:outline-none transition-colors resize-vertical placeholder-[#8b949e] disabled:opacity-50 ${
                    errors.message 
                      ? 'border-red-500 focus:border-red-400' 
                      : formData.message && !errors.message
                      ? 'border-green-500 focus:border-green-400'
                      : 'border-[#30363d] focus:border-[#1f6feb]'
                  }`}
                  placeholder="Opisz swoje potrzeby, poziom zaawansowania, cele... (dla stron: typ strony, funkcjonalności, budżet)"
                  maxLength={1000}
                ></textarea>
                {errors.message && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm mt-1 flex items-center"
                  >
                    <span className="mr-1">⚠️</span>
                    {errors.message}
                  </motion.p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={!canSubmit()}
                whileHover={canSubmit() ? { scale: 1.02 } : {}}
                whileTap={canSubmit() ? { scale: 0.98 } : {}}
                className={`w-full flex items-center justify-center px-8 py-4 font-bold rounded-xl transition-all duration-300 shadow-lg ${
                  canSubmit()
                    ? 'bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] text-white hover:shadow-xl hover:shadow-[#1f6feb]/25 cursor-pointer'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Wysyłanie...
                  </>
                ) : cooldownTime > 0 ? (
                  <>
                    <div className="w-5 h-5 mr-2">⏱️</div>
                    Poczekaj {cooldownTime}s
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Wyślij wiadomość
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 🦶 FOOTER
// ==========================================
const Footer = () => {
  return (
    <footer className="bg-[#0d1117] border-t border-[#30363d] py-8">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-[#1f6feb] mb-4">Patryk Kulesza</div>
          <p className="text-[#8b949e] mb-4">
            Korepetycje z pasją • Matematyka • Angielski • Programowanie 
          </p>
          <div className="text-sm text-[#8b949e]">
            © 2024 Patryk Kulesza. Wszystkie prawa zastrzeżone.
          </div>
        </div>
      </div>
    </footer>
  );
};

// ==========================================
// 🏠 MAIN PAGE COMPONENT
// ==========================================
export default function HomePage() {
  // Hardcoded data for the tutoring website
  const data: HomePageData = {
    hero: {
      title: "Patryk Kulesza",
      subtitle: "Twój sukces, nasze wspólne dzieło",
      description: "Matematyka • Angielski • Programowanie • Student informatyki z 5-letnim doświadczeniem w korepetycjach. Specjalizuję się w Data Science i tworzeniu stron internetowych. Pomagam uczniom osiągnąć sukces na każdym poziomie nauki.",
      cta: "Umów bezpłatną konsultację",
      stats: {
        experience: "5+",
        students: "60+",
        successRate: "100%"
      }
    },
    services: [
      {
        id: 1,
        title: "Matematyka",
        description: "Od podstaw po zaawansowane zagadnienia uniwersyteckie. Przygotowanie do egzaminów i olimpiad.",
        icon: <Calculator className="w-12 h-12" />,
        levels: ["Podstawówka", "Liceum", "Matura", "Studia"],
        price: "60-80 zł",
        features: [
          "Indywidualne podejście do ucznia",
          "Materiały własne i zadania",
          "Przygotowanie do egzaminów",
          "Analiza matematyczna na studiach",
          "Geometria liniowa i algebry",
          "Statystyka i prawdopodobieństwo"
        ]
      },
      {
        id: 2,
        title: "Angielski",
        description: "Konwersacje, gramatyka, przygotowanie do egzaminów. Podstawa i rozszerzenie na maturze.",
        icon: <BookOpen className="w-12 h-12" />,
        levels: ["Podstawówka", "Liceum", "Matura", "Konwersacje"],
        price: "60-80 zł",
        features: [
          "Konwersacje",
          "Przygotowanie do matury",
          "Gramatyka i słownictwo",
          "Pisanie rozprawek",
          "Listening i reading",
          "Certyfikaty międzynarodowe"
        ]
      },
      {
        id: 3,
        title: "Programowanie",
        description: "Python, Next.js, Strapi, Buildery Online, web development od podstaw. Także starsze technologie jak XAMPP.",
        icon: <Code className="w-12 h-12" />,
        levels: ["Podstawy", "Średniozaawansowany", "Projekty"],
        price: "70-100 zł",
        features: [
          "Python i Data Science",
          "Next.js i React",
          "Strapi i CMS",
          "FastAPI i backend",
          "Bazy danych SQL/NoSQL",
          "Deploy i hosting"
        ]
      },
      {
      id: 4,
      title: "Strony Internetowe",
      description: "Profesjonalne strony internetowe z nowoczesnych technologii. Od prostych wizytówek po zaawansowane aplikacje webowe.",
      icon: <Globe className="w-12 h-12" />,
      levels: ["Wizytówka", "Sklep online", "Portfolio", "Aplikacja webowa"],
      price: "od 1000 zł",
      features: [
        "Next.js & TypeScript",
        "Tailwind CSS design",
        "Strapi CMS",
        "SEO optymalizacja", 
        "Hosting i domena",
        "Website builders"
      ]
    } 
    ],
   portfolio: [
      {
      id: 1,
      title: "Audio Compressor",
      description: "Profesjonalny kompresor audio stworzony w Juce framework. Zaawansowane algorytmy DSP z real-time processing.",
      image: "compressor-preview.png",
      technologies: ["Juce", "C++", "DSP", "Audio Processing"],
      type: "desktop",
      category: "Audio Software"
    },
    {
      id: 2,
      title: "Weather Chatbot AI",
      description: "Inteligentny chatbot pogodowy z machine learning, rozpoznawaniem mowy i dynamicznymi animacjami zależnymi od pogody.",
      image: "weather-chatbot-preview.png",  
      technologies: ["Python", "PyQt5", "OpenWeather API", "scikit-learn", "TensorFlow", "Speech Recognition"],
      type: "desktop",
      category: "AI & Machine Learning"
    },
    {
      id: 3,
      title: "Macro Recorder Pro",
      description: "Zaawansowane narzędzie do nagrywania i odtwarzania makr. Precyzyjne rejestrowanie ruchów myszy, kliknięć i skrótów klawiszowych.",
      image: "macro-recorder-preview.png",  
      technologies: ["Python", "PyQt5", "Win32API", "Automation"],
      type: "tool",
      category: "Productivity Tools"
    },
    {
      id: 4,
      title: "Bezier Curves Visualizer",
      description: "Interaktywny wizualizator krzywych Beziera z możliwością manipulacji punktów kontrolnych w czasie rzeczywistym.",
      image: "bezier-preview.png",  
      technologies: ["JavaScript", "Canvas API", "Mathematical Algorithms"],
      type: "web",
      category: "Mathematical Visualization"
    },
    {
      id: 5,
      title: "Spaceship Shooter",
      description: "Klasyczna gra arcade typu space shooter z proceduralnymi wrogami i systemem power-upów.",
      image: "spaceship-game-preview.png",  
      technologies: ["Python", "Pygame"],
      type: "game",
      category: "Pygame"
    },
    {
      id: 6,
      title: "FPS Shooting Game",
      description: "Pierwszoosobowa strzelanka z zaawansowaną mechaniką broni i systemem AI przeciwników.",
      image: "fps-game-preview.png",  
      technologies: ["Unity", "C#", "AI Pathfinding", "3D Graphics"],
      type: "game",
      category: "Unity Games"
    },
    {
      id: 7,
      title: "Racing Car Simulator",
      description: "Realistyczny symulator wyścigów samochodowych z fizyką pojazdów i różnymi torami.",
      image: "racing-game-preview.png",
      technologies: ["Unity", "C#", "Physics Simulation", "Vehicle Dynamics"],
      type: "game",
      category: "Unity Games"
    },
    {
      id: 8,
      title: "Image Processing Suite",
      description: "Zaawansowany pakiet do przetwarzania obrazów z algorytmami Computer Vision i filtrami real-time.",
      image: "image-processing-preview.png", 
      technologies: ["Python", "OpenCV", "NumPy", "PIL", "Computer Vision"],
      type: "tool",
      category: "Image Processing"
    }
  ],
    testimonials: [
      {
        id: 1,
        name: "Mateusz M.",
        grade: "Statystyka i Metody Probabilistyczne",
        result: "Zaliczenie Sesji",
        opinion: "Czasami spotykasz osobę, która zmienia bieg twojego życia w kilka dni. Patryk to jeden z tych ludzi - ratuje nie tylko przed sesją, ale potrafi w kilka godzin nauczyć tego, czego nie ogarnąłeś przez cały semestr.",
        rating: 5
      },
      {
        id: 2,
        name: "Julia Z.",
        grade: "Kwalifikacja Zawodowa INF.02 i INF.03", 
        result: "95% i 85%",
        opinion: "Przełamałam stereotypy o dziewczynach w IT dzięki korepetycjom z Patrykiem. Jego cierpliwość i świetne tłumaczenie pomogły mi osiągnąć znakomite wyniki na egzaminach zawodowych.",
        rating: 5
      },
      {
        id: 3,
        name: "Dominika A.",
        grade: "4 klasa technikum",
        result: "Znaczna poprawa ocen",
        opinion: "Cały rok przygotowywałam się z Patrykiem do sprawdzianów z matmy. Rezultat? Wszystkie zdane! Polecam w 100%.",
        rating: 5
      },
      {
        id: 4,
        name: "Rodzice Amelii",
        grade: "Egzamin 8-klasisty",
        result: "100% matematyka, 98% angielski", 
        opinion: "Perfekcyjne przygotowanie do egzaminu ósmoklasisty. Amelia osiągnęła znakomite wyniki dzięki Panu Patrykowi.",
        rating: 5
      },
      {
        id: 5,
        name: "Dominik G.",
        grade: "Matura",
        result: "50% matematyka, 52% angielski",
        opinion: "Świetny korepetytor - potrafi w prosty sposób wytłumaczyć nawet najtrudniejsze zagadnienia w bardzo krótkim czasie. Dzięki jego pomocy dobrze przygotowałem się z matematyki i angielskiego, a nauka była przyjemna i skuteczna.",
        rating: 5
      }
    ],
    faq: [
      {
        question: "Jak wyglądają zajęcia online?",
        answer: "Zajęcia online prowadzę za pomocą interaktywnych narzędzi cyfrowych - najczęściej używam wirtualnych tablic (whiteboard, Miro), które możemy wspólnie edytować w czasie rzeczywistym. Do komunikacji wykorzystujemy platformy wybrane przez ucznia: Teams, Google Meet czy Zoom. Podczas zajęć korzystam z tabletu graficznego, dzielę się ekranem i po każdych zajęciach wysyłam kompletne notatki. Dzięki takiemu podejściu jakość nauczania jest identyczna jak przy zajęciach stacjonarnych."
      },
      {
        question: "Czy prowadzisz zajęcia stacjonarne?",
        answer: "Tak, prowadzę zajęcia stacjonarne w Białymstoku, Zambrowie oraz okolicach. Mamy kilka opcji do wyboru: zajęcia u mnie w domu, mogę przyjechać do ucznia lub spotkać się w miejscu wybranym przez ucznia."
      },
      {
        question: "Jakie są ceny korepetycji?",
        answer: "Matematyka: 60-80 zł/h, Angielski: 60-80 zł/h, Programowanie: 70-100 zł/h. Cena zależy od poziomu i typu zajęć. Pakiet 10 godzin z rabatem 20%."
      },
      {
        question: "Czy oferujesz zajęcia grupowe?",
        answer: "Tak, prowadzę zajęcia dla grup 2-4 osobowych. Cena za osobę jest wtedy niższa, a efektywność nauki często wyższa dzięki wspólnemu rozwiązywaniu problemów."
      },
      {
        question: "Jak szybko można umówić zajęcia?",
        answer: "Zazwyczaj mogę zorganizować zajęcia w ciągu 2-3 dni. W przypadkach pilnych (np. egzamin za tydzień) staram się pomóc nawet tego samego dnia."
      },
      {
        question: "Czy pomagasz z przygotowaniem do egzaminów?",
        answer: "Oczywiście! Specjalizuję się w przygotowaniu do egzaminu ósmoklasisty, matury podstawowej i rozszerzonej oraz egzaminów na studia. Mam sprawdzone metody i materiały."
      },
      {
        question: "Jak wygląda pierwsza lekcja?",
        answer: "Pierwsza lekcja przypomina konsultację, podczas której poznajemy się, ustalamy cele, sprawdzam poziom i dostosowuję plan nauki do Twoich potrzeb."
      },
      {
        question: "Czy wysyłasz materiały po zajęciach?",
        answer: "Tak, po każdych zajęciach wysyłam skany notatek, zadania do samodzielnego rozwiązania i dodatkowe materiały. Uczniowie mają dostęp do wszystkiego 24/7."
      }
    ],
    contact: {
      phone: "+48 662 581 368",
      email: "patryk27_2003@o2.pl",
      location: "Białystok i okolice, Zambrów i okolice"
    }
  };

  return (
    <>
      <style jsx global>{`
        :root {
          --primary-bg: #0d1117;
          --secondary-bg: #161b22;
          --accent-blue: #1f6feb;
          --text-primary: #f0f6fc;
          --text-secondary: #8b949e;
          --border: #30363d;
        }
        
        .dark {
          color-scheme: dark;
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        body {
          background-color: var(--primary-bg);
          color: var(--text-primary);
          font-family: var(--font-poppins), system-ui, sans-serif;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: var(--secondary-bg);
        }
        
        ::-webkit-scrollbar-thumb {
          background: var(--accent-blue);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #58a6ff;
        }
      `}</style>

      <main className="min-h-screen bg-[#0d1117]">
          {/* 🧭 HEADER NAVIGATION */}
        <Header />

          {/* 🚀 SEKCJA HERO */}
        <HeroSection data={data} />

          {/* 🎓 SEKCJA O MNIE */}
        <AboutSection />

          {/* ⭐ SEKCJA OPINIE */}
        <TestimonialsSection data={data} />

          {/* 🎨 SEKCJA PORTFOLIO */}
        <PortfolioSection data={data} />

          {/* 💼 SEKCJA USŁUGI */}
        <ServicesSection data={data} />

          {/* ❓ SEKCJA FAQ */}
        <FaqSection data={data} />

          {/* 📞 SEKCJA KONTAKT */}
        <ContactSection data={data} />

        {/* 🦶 FOOTER */}
        <Footer />
      </main>
    </>
  );
}