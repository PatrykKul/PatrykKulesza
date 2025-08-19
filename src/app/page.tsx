'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

import { 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  BookOpen, 
  Calculator, 
  Code, 
  Globe,  
  ExternalLink, 
  Monitor,
  Gamepad2,
  Brain, 
  Wrench, 
  ChevronDown,
  Menu,
  X,
  Github,
  Linkedin,
  Check,
  Award,
  Send
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
// 🧭 IMPROVED HEADER/NAVBAR COMPONENT
// ==========================================
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);

  const menuItems = [
    { label: 'Start', href: '#hero' },
    { label: 'Usługi', href: '#services' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Opinie', href: '#testimonials' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Kontakt', href: '#contact' }
  ];

  // Track scroll position and active section
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Active section tracking
      const sections = menuItems.map(item => item.href.substring(1));
      const current = sections.find(section => {
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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll handler
  const handleMenuClick = (href: string) => {
    setIsMenuOpen(false);
    
    if (href.startsWith('#')) {
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
              {menuItems.map((item, index) => (
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
                  {menuItems.map((item, index) => (
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
// 🚀 CLEAN HERO SECTION - 2 COLUMN LAYOUT
// ==========================================
const HeroSection = ({ data }: { data: HomePageData }) => {
  const [ref, inView] = useAdvancedInView();

  return (
    <section
      ref={ref}
      id="hero"
      className="min-h-screen flex items-center bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#1f6feb]/20 relative overflow-hidden pt-20"
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

      <div className="container mx-auto px-6 relative z-10 pb-4 mb-4">
        
        {/* MAIN CONTENT - 2 COLUMNS */}
        <div className="grid lg:grid-cols-5 gap-12 items-center mb-16">
          
          {/* LEFT COLUMN - TEXT CONTENT (60%) */}
          <div className="lg:col-span-3">
            
            {/* H1 - Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-[#f0f6fc] via-[#1f6feb] to-[#58a6ff] bg-clip-text text-transparent">
                Twój sukces,
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#58a6ff] via-[#1f6feb] to-[#f0f6fc] bg-clip-text text-transparent">
                nasze wspólne dzieło
              </span>
            </motion.h1>

            {/* H2 - SEO Optimized Subtitle */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-[#c9d1d9] font-medium mb-6 tracking-wide"
            >
              Korepetycje Białystok, Zambrów i okolice • Matematyka • Angielski • Programowanie
            </motion.h2>

            {/* Description - Shortened */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl md:text-2xl text-[#f0f6fc] mb-6 leading-relaxed font-light"
            >
              Specjalizuję się w korepetycjach z{' '}
              <span className="text-[#1f6feb] font-semibold">matematyki</span>,{' '}
              <span className="text-[#1f6feb] font-semibold">angielskiego</span> i{' '}
              <span className="text-[#1f6feb] font-semibold">programowania</span>.
              <br />
              <span className="text-[#58a6ff]">Indywidualne podejście = gwarantowane rezultaty.</span>
            </motion.p>

            {/* Enhanced Credentials */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="space-y-2"
            >
              <div className="text-lg md:text-2xl text-[#1f6feb] font-semibold">
                📚 Student Informatyki 3 roku | 5+ lat doświadczenia
              </div>
              <div className="text-md md:text-xl text-[#cae2ea] font-light">
                🔬 Data Science • 💻 Web Development • 🎯 Zambrów & Białystok
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN - BRAIN IMAGE (40%) */}
          <div className="lg:col-span-2 flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              className="relative"
            >
              {/* Floating Animation Container */}
              <motion.div
                animate={{ 
                  y: [-20, 20, -20],
                  rotate: [-2, 2, -2]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-[#1f6feb]/20 rounded-full blur-3xl scale-110"></div>
                
                {/* Brain Image */}
                <div className="relative w-96 h-96 md:w-[500px] md:h-[500px] lg:w-[550px] lg:h-[550px]">
                  <img 
                    src={`${process.env.NODE_ENV === 'production' ? '/korepetycje' : ''}/_resources/brain.png`}
                    alt="Neural Network Brain - Korepetycje Programowanie i Matematyka" 
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* STATISTICS - FULL WIDTH */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto"
        >
          <div className="bg-[#161b22]/50 backdrop-blur-sm border border-[#30363d]/50 rounded-2xl p-8 hover:border-[#1f6feb]/50 transition-all duration-300 text-center">
            <div className="text-5xl md:text-6xl font-black text-[#1f6feb] mb-2">
              {data.hero.stats.experience}
            </div>
            <div className="text-[#c9d1d9] text-sm uppercase tracking-wider font-medium">
              lat doświadczenia
            </div>
          </div>
          
          <div className="bg-[#161b22]/50 backdrop-blur-sm border border-[#30363d]/50 rounded-2xl p-8 hover:border-[#1f6feb]/50 transition-all duration-300 text-center">
            <div className="text-5xl md:text-6xl font-black text-[#1f6feb] mb-2">
              {data.hero.stats.students}
            </div>
            <div className="text-[#c9d1d9] text-sm uppercase tracking-wider font-medium">
              zadowolonych uczniów
            </div>
          </div>
          
          <div className="bg-[#161b22]/50 backdrop-blur-sm border border-[#30363d]/50 rounded-2xl p-8 hover:border-[#1f6feb]/50 transition-all duration-300 text-center">
            <div className="text-5xl md:text-6xl font-black text-[#1f6feb] mb-2">
              {data.hero.stats.successRate}
            </div>
            <div className="text-[#c9d1d9] text-sm uppercase tracking-wider font-medium">
              zdawalność egzaminów
            </div>
          </div>
        </motion.div>

        {/* CTA BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-8 py-4 bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] text-white font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#1f6feb]/25 text-lg"
          >
            <span className="relative z-10 flex items-center">
              {data.hero.cta}
              <svg 
                className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
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
            className="px-8 py-4 border-2 border-[#1f6feb] text-[#1f6feb] font-bold rounded-2xl hover:bg-[#1f6feb] hover:text-white transition-all duration-300 text-lg"
          >
            Zobacz usługi
          </motion.a>
        </motion.div>

        {/* TRUST INDICATORS - Enhanced */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="flex flex-wrap justify-center items-center gap-8 text-[#c9d1d9] text-sm"
        >
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-[#1f6feb]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-bold text-lg">Online i stacjonarnie</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#1f6feb]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-bold text-lg">Materiały własne</span>
          </div>
          
        </motion.div>
      </div>
    </section>
  );
};

// ==========================================
// 💼 SERVICES SECTION - Enhanced with CTA buttons
// ==========================================
const ServicesSection = ({ data }: { data: HomePageData }) => {
  const [ref, inView] = useAdvancedInView();

  // Function to handle service booking
  const handleBookService = (serviceTitle: string) => {
    // Map service titles to form values
    const serviceMapping: { [key: string]: string } = {
      'Matematyka': 'matematyka',
      'Angielski': 'angielski', 
      'Programowanie': 'programowanie'
    };
    
    const serviceValue = serviceMapping[serviceTitle] || serviceTitle.toLowerCase();
    
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
  };

  return (
    <section ref={ref} id="services" className="py-20 bg-[#161b22]">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-extrabold mb-8 pb-4 bg-gradient-to-r from-[#f0f6fc] via-[#1f6feb] to-[#58a6ff] bg-clip-text text-transparent">
            Usługi
          </h2>
          <p className="text-xl text-[#8b949e] max-w-3xl mx-auto">
            Specjalizuję się w korepetycjach z matematyki, angielskiego i programowania. 
            Każde zajęcia dostosowuję do indywidualnych potrzeb ucznia.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-[#0d1117] border border-[#30363d] rounded-xl p-8 hover:border-[#1f6feb]/50 transition-all duration-300 shadow-lg hover:shadow-xl flex flex-col"
            >
              <div className="text-[#1f6feb] mb-6">
                {service.icon}
              </div>
              
              <h3 className="text-2xl font-bold text-[#f0f6fc] mb-4">{service.title}</h3>
              <p className="text-[#8b949e] mb-6">{service.description}</p>
              
              <div className="mb-6">
                <div className="text-lg font-semibold text-[#1f6feb] mb-2">Poziomy:</div>
                <div className="flex flex-wrap gap-2">
                  {service.levels.map((level, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-[#1f6feb]/20 text-[#58a6ff] rounded-full text-sm"
                    >
                      {level}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="text-2xl font-bold text-[#1f6feb] mb-2">{service.price}</div>
                <div className="text-sm text-[#8b949e]">za godzinę zajęć</div>
              </div>

              <ul className="space-y-2 mb-8 flex-grow">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-[#8b949e]">
                    <Check className="w-4 h-4 text-[#1f6feb] mr-2 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <motion.button
                onClick={() => handleBookService(service.title)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer w-full bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#1f6feb]/25"
              >
                <span className="flex items-center justify-center ">
                  Umów korepetycje
                  <svg 
                    className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Package Deal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 text-center bg-gradient-to-r from-[#1f6feb]/20 to-[#58a6ff]/20 border border-[#1f6feb]/30 rounded-xl p-8"
        >
          <Award className="w-12 h-12 text-[#1f6feb] mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-[#f0f6fc] mb-4">Pakiet 10 godzin</h3>
          <p className="text-[#8b949e] mb-4">Zapisz się na 10 godzin z góry i otrzymaj 20% rabatu!</p>
          <div className="text-lg text-[#1f6feb] font-semibold mb-6">Oszczędzasz do 120 zł!</div>
          
          {/* Package CTA */}
          <motion.button
            onClick={() => handleBookService('pakiet')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] text-white font-bold py-3 px-8 rounded-xl transition-all duration-300"
          >
            Umów pakiet 10h
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

// ==========================================
// 🎨 PORTFOLIO SECTION - ZDJĘCIE JAKO TŁO Z OVERLAY
// ==========================================
const PortfolioSection = ({ data }: { data: HomePageData }) => {
  const [ref, inView] = useAdvancedInView();
  
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
  // 🖱️ MOUSE EVENT HANDLERS
  // ==========================================
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current || isModalOpen) return;
    
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

    if (!isDragging || !scrollContainerRef.current || isModalOpen) return; // ← Dodaj isModalOpen
    
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
  }, [isDragging, startX, scrollLeft, lastTime]);

  // ==========================================
// 🔒 BLOKOWANIE SCROLLOWANIA W TLE PODCZAS MODALA
// ==========================================
useEffect(() => {
  if (isModalOpen) {
    // Dodaj klasę do body która zablokuje scroll i zmieni cursor
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
  } else {
    // Usuń klasę i przywróć scroll
    document.body.classList.remove('modal-open');
    document.body.style.overflow = 'unset';
  }

  // Cleanup - na wszelki wypadek
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
    if (!hasMoved) { // Tylko jeśli nie było przeciągania
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
          🎨 CUSTOM CURSOR STYLES - NIEBIESKI
          ========================================== */}
      <style jsx>{`
        .portfolio-section {
          cursor: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'%3E%3Ccircle cx='24' cy='24' r='22' fill='%23000000' fill-opacity='0.8' stroke='%231f6feb' stroke-width='2'/%3E%3Cpath d='M14 24l6-6m-6 6l6 6m-6-6h20m-6-6l6 6m-6 6l6-6' stroke='%231f6feb' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") 24 24, grab;
        }
        .portfolio-section.dragging {
          cursor: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'%3E%3Ccircle cx='24' cy='24' r='22' fill='%23000000' fill-opacity='0.95' stroke='%231f6feb' stroke-width='2'/%3E%3Cpath d='M14 24l6-6m-6 6l6 6m-6-6h20m-6-6l6 6m-6 6l6-6' stroke='%231f6feb' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") 24 24, grabbing;
        }
        
        .portfolio-scroll-container::-webkit-scrollbar {
          display: none;
        }
        .portfolio-section.dragging {
          user-select: none;
        }
        .portfolio-section * {
          cursor: inherit !important;
        }
      `}</style>

      <section 
        ref={ref} 
        id="portfolio" 
        className={`portfolio-section py-20 bg-[#0d1117] overflow-hidden ${isDragging ? 'dragging' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <div className="w-full">
          {/* ==========================================
              📝 HEADER SEKCJI
              ========================================== */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="container mx-auto px-6">
              <h2 className="text-5xl md:text-6xl font-extrabold mb-8 bg-gradient-to-r from-[#f0f6fc] via-[#1f6feb] to-[#58a6ff] bg-clip-text text-transparent">
                Portfolio
              </h2>
              <p className="text-xl text-[#c9d1d9] max-w-3xl mx-auto">
                Projekty - od stron po aplikacje webowe, desktopowe, gry, narzędzia AI.
              </p>
            </div>
          </motion.div>

          {/* ==========================================
              🎬 HORIZONTAL SCROLLING CONTAINER
              ========================================== */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div
              ref={scrollContainerRef}
              className="portfolio-scroll-container flex gap-12 overflow-x-auto scrollbar-hide py-8 px-6 md:px-12"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {/* ==========================================
                  🎴 MAPA PROJEKTÓW - OVERLAY DESIGN
                  ========================================== */}
              {data.portfolio.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ x: 100, opacity: 0 }}
                  animate={inView ? { x: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex-shrink-0 group"
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  {/* ==========================================
                      🎬 KARTA PROJEKTU - PODZIELONA NA DWA OBSZARY
                      ========================================== */}
                  <div 
                    className="relative w-[600px] md:w-[700px] lg:w-[800px] h-[600px] md:h-[650px] bg-[#161b22] border border-[#30363d] rounded-3xl overflow-hidden hover:border-[#1f6feb]/50 transition-all duration-300 shadow-lg hover:shadow-xl group-hover:shadow-[#1f6feb]/10 cursor-pointer"
                    onClick={() => openModal(project)}
                  >
                    
                    {/* ==========================================
                        🖼️ GÓRNY OBSZAR - ZDJĘCIE
                        ========================================== */}
                    <div className="h-[400px] md:h-[420px] relative overflow-hidden">
                      
                      {project.image ? (
                        <img
                          src={`${process.env.NODE_ENV === 'production' ? '/korepetycje' : ''}/_resources/${project.image}`}
                          alt={project.title}
                          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                          draggable={false}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#1f6feb]/30 to-[#58a6ff]/30 flex items-center justify-center">
                          <div className="text-center">
                            <Code className="w-16 h-16 text-[#1f6feb] mx-auto mb-3" />
                            <div className="text-[#c9d1d9] text-base">Projekt w trakcie dokumentacji</div>
                          </div>
                        </div>
                      )}

                      {/* Kategoria w prawym górnym rogu */}
                      <div className="absolute top-4 right-4">
                        <span className="bg-[#1f6feb]/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold border border-[#1f6feb]/50">
                          {project.category}
                        </span>
                      </div>

                      {/* Tytuł na dole zdjęcia */}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-6">
                        <h3 className="text-2xl md:text-3xl font-bold text-white">
                          {project.title}
                        </h3>
                      </div>
                    </div>

                    {/* ==========================================
                        📝 DOLNY OBSZAR - INFORMACJE
                        ========================================== */}
                    <div className="h-[200px] md:h-[230px] p-6 flex flex-col">
                      
                      {/* Opis projektu */}
                      <div className="mb-4">
                        <h4 className="text-lg font-bold text-[#f0f6fc] mb-2">O projekcie:</h4>
                        <p className="text-[#c9d1d9] leading-relaxed text-sm">
                          {project.description}
                        </p>
                      </div>

                      {/* Technologie */}
                      <div className="flex-grow">
                        <h4 className="text-lg font-bold text-[#f0f6fc] mb-3">Technologie:</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-[#1f6feb]/20 text-[#58a6ff] rounded-full text-sm font-medium border border-[#1f6feb]/30"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1f6feb]/5 to-transparent rounded-3xl" />
                      <div className="absolute inset-0 shadow-2xl shadow-[#1f6feb]/25 rounded-3xl" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          🖼️ MODAL Z WIĘKSZYM OBRAZKIEM - POZA SEKCJĄ PORTFOLIO!
          ========================================== */}
      <AnimatePresence>
        {isModalOpen && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ cursor: 'default' }} // Dodatkowe zabezpieczenie
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-lg"
              onClick={closeModal}
              style={{ cursor: 'default' }}
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative bg-[#161b22] border border-[#30363d] rounded-3xl overflow-hidden max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              style={{ cursor: 'default' }}
            >
              
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all duration-300 border border-white/20"
                style={{ cursor: 'pointer' }}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image Section */}
              <div className="h-[60vh] relative bg-gradient-to-br from-[#1f6feb]/20 via-[#161b22] to-[#58a6ff]/20">
                {selectedProject.image ? (
                  <img
                    src={`${process.env.NODE_ENV === 'production' ? '/korepetycje' : ''}/_resources/${selectedProject.image}`}
                    alt={selectedProject.title}
                    className="w-full h-full object-contain"
                    draggable={false}
                    style={{ cursor: 'default' }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Code className="w-24 h-24 text-[#1f6feb] mx-auto mb-4" />
                      <div className="text-[#c9d1d9] text-xl">Projekt w trakcie dokumentacji</div>
                    </div>
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-[#1f6feb]/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold border border-[#1f6feb]/50">
                    {selectedProject.category}
                  </span>
                </div>
              </div>

              {/* Info Section */}
              <div className="p-8 flex-grow overflow-y-auto">
                
                {/* Title */}
                <h2 className="text-3xl md:text-4xl font-bold text-[#f0f6fc] mb-6">
                  {selectedProject.title}
                </h2>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-[#1f6feb] mb-3">O projekcie:</h3>
                  <p className="text-[#c9d1d9] leading-relaxed text-lg">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Technologies */}
                <div>
                  <h3 className="text-xl font-bold text-[#1f6feb] mb-4">Technologie:</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedProject.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-[#1f6feb]/20 text-[#58a6ff] rounded-full text-base font-medium border border-[#1f6feb]/30"
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
// ⭐ TESTIMONIALS SECTION - HORIZONTAL SCROLLING
// ==========================================
const TestimonialsSection = ({ data }: { data: HomePageData }) => {
  const [ref, inView] = useAdvancedInView();
  
  // ==========================================
  // 📊 STATES DLA DRAG SCROLLING
  // ==========================================
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);
  
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
  // 🖱️ MOUSE EVENT HANDLERS
  // ==========================================
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    
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
    if (!isDragging || !scrollContainerRef.current) return;
    
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
  }, [isDragging, startX, scrollLeft, lastTime]);

  // ==========================================
  // 🎯 CLEANUP
  // ==========================================
  useEffect(() => {
    return () => stopMomentumAnimation();
  }, [stopMomentumAnimation]);

  return (
    <>
      {/* ==========================================
          🎨 CUSTOM CURSOR STYLES - NIEBIESKI
          ========================================== */}
      <style jsx>{`
        .testimonials-section {
          cursor: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'%3E%3Ccircle cx='24' cy='24' r='22' fill='%23000000' fill-opacity='0.8' stroke='%231f6feb' stroke-width='2'/%3E%3Cpath d='M14 24l6-6m-6 6l6 6m-6-6h20m-6-6l6 6m-6 6l6-6' stroke='%231f6feb' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") 24 24, grab;
        }
        .testimonials-section.dragging {
          cursor: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'%3E%3Ccircle cx='24' cy='24' r='22' fill='%23000000' fill-opacity='0.95' stroke='%231f6feb' stroke-width='2'/%3E%3Cpath d='M14 24l6-6m-6 6l6 6m-6-6h20m-6-6l6 6m-6 6l6-6' stroke='%231f6feb' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") 24 24, grabbing;
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
      `}</style>

      <section 
        ref={ref} 
        id="testimonials" 
        className={`testimonials-section py-20 bg-[#161b22] overflow-hidden ${isDragging ? 'dragging' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
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
              📝 HEADER SEKCJI
              ========================================== */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <div className="container mx-auto px-6">
              <h2 className="text-5xl md:text-6xl font-extrabold mb-8 bg-gradient-to-r from-[#f0f6fc] via-[#1f6feb] to-[#58a6ff] bg-clip-text text-transparent">
                Opinie Uczniów
              </h2>
              <p className="text-2xl text-[#c9d1d9] max-w-3xl mx-auto">
                Zobacz co mówią o mnie uczniowie i ich rodzice.
              </p>
              
            </div>
          </motion.div>

          {/* ==========================================
              🎬 HORIZONTAL SCROLLING CONTAINER
              ========================================== */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div
              ref={scrollContainerRef}
              className="testimonials-scroll-container flex gap-12 overflow-x-auto scrollbar-hide py-8 px-6 md:px-12"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {/* ==========================================
                  💬 MAPA OPINII
                  ========================================== */}
              {data.testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ x: 100, opacity: 0 }}
                  animate={inView ? { x: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex-shrink-0 group"
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  {/* ==========================================
                      💬 KARTA OPINII - DUŻA
                      ========================================== */}
                  <div className="relative w-[600px] md:w-[700px] lg:w-[800px] h-[400px] md:h-[450px] bg-[#0d1117] border border-[#30363d] rounded-3xl p-12 hover:border-[#1f6feb]/50 transition-all duration-300 shadow-lg hover:shadow-xl group-hover:shadow-[#1f6feb]/10">
                    
                    {/* Rating Stars */}
                    <div className="flex items-center mb-8">
                      <div className="flex text-yellow-400 mr-6">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-7 h-7 fill-current mr-1" />
                        ))}
                      </div>
                      <div className="text-[#1f6feb] font-semibold text-lg bg-[#1f6feb]/10 px-4 py-2 rounded-full">
                        {testimonial.rating}/5
                      </div>
                    </div>

                    {/* Opinion Text */}
                    <div className="mb-12 flex-grow">
                      <p className="text-[#c9d1d9] leading-relaxed text-2xl md:text-3xl font-light">
                        &quot;{testimonial.opinion}&quot;
                      </p>
                    </div>

                    {/* Bottom Info */}
                    <div className="absolute bottom-12 left-12 right-12">
                      <div className="border-t border-[#30363d] pt-8">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold text-[#f0f6fc] text-2xl mb-2">
                              {testimonial.name}
                            </div>
                            <div className="text-lg text-[#8b949e] mb-2">
                              {testimonial.grade}
                            </div>
                          </div>
                          
                          {/* Result Badge */}
                          <div className="text-right">
                            <div className="text-sm text-[#8b949e] mb-2">Wynik:</div>
                            <div className="bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] text-white font-bold px-6 py-3 rounded-xl text-lg">
                              {testimonial.result}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1f6feb]/5 to-transparent rounded-3xl" />
                      <div className="absolute inset-0 shadow-2xl shadow-[#1f6feb]/25 rounded-3xl" />
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* ==========================================
                  📊 PODSUMOWANIE NA KOŃCU
                  ========================================== */}
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={inView ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex-shrink-0"
              >
                <div className="w-[600px] md:w-[700px] lg:w-[800px] h-[400px] md:h-[450px] bg-gradient-to-br from-[#1f6feb]/10 to-[#58a6ff]/10 border border-[#1f6feb]/30 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
                  
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-20 h-20 bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] rounded-full flex items-center justify-center mb-8"
                  >
                    <Star className="w-10 h-10 text-white fill-current" />
                  </motion.div>
                  
                  <h3 className="text-3xl md:text-4xl font-bold text-[#f0f6fc] mb-6">
                    100% zadowolonych uczniów!
                  </h3>
                  
                  <p className="text-[#c9d1d9] mb-8 leading-relaxed text-xl">
                    Każdy uczeń osiągnął swoje cele. Dołącz do grona zadowolonych uczniów!
                  </p>
                  
                  <motion.a
                    href="#contact"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 text-lg"
                  >
                    Umów konsultację
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

// ==========================================
// ❓ FAQ SECTION - Enhanced with larger text
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
    <section ref={ref} id="faq" className="py-20 bg-[#0d1117]">
      {/* Structured data dla FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQStructuredData(data.faq))
        }}
      />
      
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-extrabold mb-8 bg-gradient-to-r from-[#f0f6fc] via-[#1f6feb] to-[#58a6ff] bg-clip-text text-transparent">
            FAQ
          </h2>
          <p className="text-xl text-[#8b949e] max-w-3xl mx-auto">
            Najczęściej zadawane pytania o korepetycje
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto space-y-6 ">
          {data.faq.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden hover:border-[#1f6feb]/50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-10 py-8 text-left flex items-center justify-between group focus:outline-none cursor-pointer"
              >
                <h3 className="text-xl md:text-2xl font-semibold text-[#1f6feb] group-hover:text-[#58a6ff] transition-colors duration-300 pr-6 leading-relaxed">
                  {item.question}
                </h3>
                
                <motion.div
                  animate={{ rotate: openItems.includes(index) ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-7 h-7 text-[#1f6feb]" />
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
                    <div className="px-10 pb-8 border-t border-[#30363d]">
                      <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="pt-6"
                      >
                        <p className="text-[#f0f6fc] text-lg leading-relaxed whitespace-pre-line">
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
// 📞 CONTACT SECTION - Enhanced with auto-fill
// ==========================================
const ContactSection = ({ data }: { data: HomePageData }) => {
  const [ref, inView] = useAdvancedInView();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  // Auto-fill service from URL hash or custom event
  useEffect(() => {
    // Check URL hash on mount
    const checkHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#contact-')) {
        const service = hash.replace('#contact-', '');
        setFormData(prev => ({ ...prev, subject: service }));
      }
    };

    // Listen for custom auto-fill events
    const handleAutoFill = (event: CustomEvent) => {
      const { service } = event.detail;
      setFormData(prev => ({ 
        ...prev, 
        subject: service,
        message: service === 'pakiet' 
          ? 'Jestem zainteresowany/a pakietem 10 godzin z rabatem 20%. Proszę o kontakt w sprawie szczegółów.'
          : `Jestem zainteresowany/a korepetycjami z przedmiotu: ${service}. Proszę o kontakt.`
      }));
    };

    // Check hash on component mount
    checkHash();

    // Listen for hash changes and custom events
    window.addEventListener('hashchange', checkHash);
    window.addEventListener('autoFillService', handleAutoFill as EventListener);

    return () => {
      window.removeEventListener('hashchange', checkHash);
      window.removeEventListener('autoFillService', handleAutoFill as EventListener);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // EmailJS integration will go here
    console.log('Form submitted:', formData);
    
    // Show success message (you can implement toast notification)
    alert('Dziękuję za wiadomość! Odpowiem w ciągu 24 godzin.');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    
    // Clear hash
    window.location.hash = '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

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
            Gotowy na rozpoczęcie nauki? Skontaktuj się ze mną już dziś!
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
                href="#"
                className="w-12 h-12 bg-[#1f6feb]/20 rounded-lg flex items-center justify-center hover:bg-[#1f6feb]/30 transition-colors"
              >
                <Linkedin className="w-6 h-6 text-[#1f6feb]" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-[#1f6feb]/20 rounded-lg flex items-center justify-center hover:bg-[#1f6feb]/30 transition-colors"
              >
                <Github className="w-6 h-6 text-[#1f6feb]" />
              </a>
            </div>

            {/* Quick Contact Actions */}
            <div className="mt-8 space-y-3">
              <h4 className="text-lg font-semibold text-[#f0f6fc]">Szybki kontakt:</h4>
              <div className="flex flex-col space-y-2">
                <a
                  href={`tel:${data.contact.phone}`}
                  className="flex items-center px-4 py-2 bg-[#1f6feb]/10 rounded-lg hover:bg-[#1f6feb]/20 transition-colors text-[#1f6feb]"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Zadzwoń teraz
                </a>
                <a
                  href={`mailto:${data.contact.email}?subject=Zapytanie o korepetycje`}
                  className="flex items-center px-4 py-2 bg-[#1f6feb]/10 rounded-lg hover:bg-[#1f6feb]/20 transition-colors text-[#1f6feb]"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Wyślij email
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
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#f0f6fc] font-semibold mb-2">
                    Imię i nazwisko <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#f0f6fc] focus:border-[#1f6feb] focus:outline-none transition-colors placeholder-[#8b949e]"
                    placeholder="Jan Kowalski"
                  />
                </div>
                <div>
                  <label className="block text-[#f0f6fc] font-semibold mb-2">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#f0f6fc] focus:border-[#1f6feb] focus:outline-none transition-colors placeholder-[#8b949e]"
                    placeholder="jan@example.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#f0f6fc] font-semibold mb-2">
                    Telefon <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#f0f6fc] focus:border-[#1f6feb] focus:outline-none transition-colors placeholder-[#8b949e]"
                    placeholder="+48 123 456 789"
                  />
                </div>
                <div>
                  <label className="block text-[#f0f6fc] font-semibold mb-2">
                    Przedmiot <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#f0f6fc] focus:border-[#1f6feb] focus:outline-none transition-colors"
                  >
                    <option value="">Wybierz przedmiot</option>
                    <option value="matematyka">Matematyka</option>
                    <option value="angielski">Angielski</option>
                    <option value="programowanie">Programowanie</option>
                    <option value="pakiet">Pakiet 10 godzin</option>
                    <option value="inne">Inne</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#f0f6fc] font-semibold mb-2">
                  Wiadomość <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  required
                  className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#f0f6fc] focus:border-[#1f6feb] focus:outline-none transition-colors resize-vertical placeholder-[#8b949e]"
                  placeholder="Opisz swoje potrzeby, poziom zaawansowania, cele..."
                ></textarea>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer w-full flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#1f6feb]/25"
              >
                <Send className="w-5 h-5 mr-2 "  />
                Wyślij wiadomość
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
        price: "50-70 zł",
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
      //image: "macro-recorder-preview.png",  
      technologies: ["Python", "PyQt5", "Win32API", "Automation"],
      type: "tool",
      category: "Productivity Tools"
    },
    {
      id: 4,
      title: "Bezier Curves Visualizer",
      description: "Interaktywny wizualizator krzywych Beziera z możliwością manipulacji punktów kontrolnych w czasie rzeczywistym.",
      //image: "bezier-preview.png",  
      technologies: ["JavaScript", "Canvas API", "Mathematical Algorithms"],
      type: "web",
      category: "Mathematical Visualization"
    },
    {
      id: 5,
      title: "Spaceship Shooter",
      description: "Klasyczna gra arcade typu space shooter z proceduralnymi wrogami i systemem power-upów.",
      //image: "spaceship-game-preview.png",  
      technologies: ["Python", "Pygame"],
      type: "game",
      category: "Pygame"
    },
    {
      id: 6,
      title: "FPS Shooting Game",
      description: "Pierwszoosobowa strzelanka z zaawansowaną mechaniką broni i systemem AI przeciwników.",
      //image: "fps-game-preview.png",  
      technologies: ["Unity", "C#", "AI Pathfinding", "3D Graphics"],
      type: "game",
      category: "Unity Games"
    },
    {
      id: 7,
      title: "Racing Car Simulator",
      description: "Realistyczny symulator wyścigów samochodowych z fizyką pojazdów i różnymi torami.",
      //image: "racing-game-preview.png",
      technologies: ["Unity", "C#", "Physics Simulation", "Vehicle Dynamics"],
      type: "game",
      category: "Unity Games"
    },
    {
      id: 8,
      title: "Image Processing Suite",
      description: "Zaawansowany pakiet do przetwarzania obrazów z algorytmami Computer Vision i filtrami real-time.",
      //image: "image-processing-preview.png", 
      technologies: ["Python", "OpenCV", "NumPy", "PIL", "Computer Vision"],
      type: "tool",
      category: "Image Processing"
    }
  ],
    testimonials: [
      {
        id: 1,
        name: "Anna K.",
        grade: "Matura rozszerzona 2024",
        result: "100%",
        opinion: "Dzięki Patrykowi zdałam maturę na 100%! Świetnie tłumaczysz trudne zagadnienia i zawsze cierpliwie odpowiadasz na pytania. Polecam każdemu!",
        rating: 5
      },
      {
        id: 2,
        name: "Michał W.",
        grade: "Egzamin ósmoklasisty 2024",
        result: "95%",
        opinion: "Patryk pomógł mi przygotować się do egzaminu z matematyki. Dzięki jego metodom nauka stała się przyjemna i efektywna.",
        rating: 5
      },
      {
        id: 3,
        name: "Rodzice Kai",
        grade: "Klasa 7, podstawówka",
        result: "Znaczna poprawa ocen",
        opinion: "Kaja ma dyskalkulię i miała duże problemy z matematyką. Po zajęciach z Patrykiem jej oceny znacznie się poprawiły. Dziękujemy!",
        rating: 5
      },
      {
        id: 4,
        name: "Jakub M.",
        grade: "Student informatyki",
        result: "Zaliczenie sesji",
        opinion: "Pomoc z analizą matematyczną na studiach była nieoceniona. Patryk ma świetne podejście do tłumaczenia skomplikowanych zagadnień.",
        rating: 5
      },
      {
        id: 5,
        name: "Marlena S.",
        grade: "Matura podstawowa 2024",
        result: "90%",
        opinion: "Angielski z Patrykiem to była przyjemność! Konwersacje pomogły mi przełamać barierę językową i pewnie zdać maturę.",
        rating: 5
      },
      {
        id: 6,
        name: "Tomek R.",
        grade: "Nauka programowania",
        result: "Pierwsza praca w IT",
        opinion: "Dzięki kursom Pythona z Patrykiem znalazłem pierwszą pracę w IT! Praktyczne podejście i realne projekty to było to czego potrzebowałem.",
        rating: 5
      }
    ],
    faq: [
      {
        question: "Jak wyglądają zajęcia online?",
        answer: "Zajęcia prowadzę przez Google Meet lub Zoom. Używam tabletu graficznego do pisania, dzielę się ekranem i wysyłam notatki po zajęciach. Jakość jest identyczna jak przy zajęciach stacjonarnych."
      },
      {
        question: "Czy prowadzisz zajęcia stacjonarne?",
        answer: "Tak, prowadzę zajęcia stacjonarne w Białymstoku i Zambrowie oraz okolicach. Mogę dojechać do ucznia lub spotkać się w bibliotece/kawiarni."
      },
      {
        question: "Jakie są ceny korepetycji?",
        answer: "Matematyka: 60-80 zł/h, Angielski: 50-70 zł/h, Programowanie: 70-100 zł/h. Cena zależy od poziomu i typu zajęć. Pakiet 10 godzin z rabatem 20%."
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
        answer: "Pierwsza lekcja to bezpłatna konsultacja (30 min), podczas której poznajemy się, ustalamy cele, sprawdzam poziom i dostosowuję plan nauki do Twoich potrzeb."
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

        {/* 💼 SEKCJA USŁUGI */}
        <ServicesSection data={data} />

        {/* 🎨 SEKCJA PORTFOLIO */}
        <PortfolioSection data={data} />

        {/* ⭐ SEKCJA OPINIE */}
        <TestimonialsSection data={data} />

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