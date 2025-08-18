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
  ChevronRight, 
  ExternalLink, 
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
  image: string;
  liveUrl: string;
  githubUrl: string;
  technologies: string[];
  type: 'web' | 'mobile' | 'demo';
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
// 🧭 HEADER/NAVBAR COMPONENT
// ==========================================
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Start', href: '#hero' },
    { label: 'Usługi', href: '#services' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Opinie', href: '#testimonials' },
    { label: 'Kontakt', href: '#contact' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0d1117]/95 backdrop-blur-sm border-b border-[#30363d]">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-[#1f6feb]"
          >
            PK
          </motion.div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[#f0f6fc] hover:text-[#1f6feb] transition-colors duration-300"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-[#161b22] text-[#f0f6fc]"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pb-4 border-t border-[#30363d] pt-4"
            >
              {menuItems.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="block py-2 text-[#f0f6fc] hover:text-[#1f6feb] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </motion.a>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

// ==========================================
// 🚀 HERO SECTION
// ==========================================
const HeroSection = ({ data }: { data: HomePageData }) => {
  const [ref, inView] = useAdvancedInView();

  return (
    <section
      ref={ref}
      id="hero"
      className="min-h-screen flex items-center bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#1f6feb]/20 relative overflow-hidden pt-20"
    >
      {/* Background Pattern - CLEAN CSS ONLY */}
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

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          
          {/* GŁÓWNY H1 - semantycznie i wizualnie najważniejszy */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-none"
          >
            <span className="bg-gradient-to-r from-[#f0f6fc] via-[#1f6feb] to-[#58a6ff] bg-clip-text text-transparent">
              Twój sukces,
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#58a6ff] via-[#1f6feb] to-[#f0f6fc] bg-clip-text text-transparent">
              nasze wspólne dzieło
            </span>
          </motion.h1>

          {/* H2 - podtytuł SEO */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-lg md:text-xl text-[#8b949e] font-medium mb-4 tracking-wide"
          >
            Korepetycje Matematyka • Angielski • Programowanie - Patryk Kulesza
          </motion.h2>

          {/* Subtitle with typing effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-8"
          >
            <div className="text-2xl md:text-3xl text-[#1f6feb] font-semibold mb-2">
              Student informatyki | 5+ lat doświadczenia
            </div>
            <div className="text-lg md:text-xl text-[#8b949e] font-light">
              Data Science • Web Development • Indywidualne podejście
            </div>
          </motion.div>

          {/* Enhanced description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-xl md:text-2xl text-[#f0f6fc] mb-12 leading-relaxed max-w-4xl mx-auto font-light"
          >
            Specjalizuję się w korepetycjach z{' '}
            <span className="text-[#1f6feb] font-semibold">matematyki</span>,{' '}
            <span className="text-[#1f6feb] font-semibold">angielskiego</span> i{' '}
            <span className="text-[#1f6feb] font-semibold">programowania</span>.
            <br />
            Pomagam uczniom osiągnąć sukces na każdym poziomie nauki.
          </motion.p>

          {/* Enhanced Stats with icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-3xl mx-auto"
          >
            <div className="bg-[#161b22]/50 backdrop-blur-sm border border-[#30363d]/50 rounded-2xl p-6 hover:border-[#1f6feb]/50 transition-all duration-300">
              <div className="text-4xl md:text-5xl font-black text-[#1f6feb] mb-2">
                {data.hero.stats.experience}
              </div>
              <div className="text-[#8b949e] text-sm uppercase tracking-wider font-medium">
                lat doświadczenia
              </div>
            </div>
            
            <div className="bg-[#161b22]/50 backdrop-blur-sm border border-[#30363d]/50 rounded-2xl p-6 hover:border-[#1f6feb]/50 transition-all duration-300">
              <div className="text-4xl md:text-5xl font-black text-[#1f6feb] mb-2">
                {data.hero.stats.students}
              </div>
              <div className="text-[#8b949e] text-sm uppercase tracking-wider font-medium">
                zadowolonych uczniów
              </div>
            </div>
            
            <div className="bg-[#161b22]/50 backdrop-blur-sm border border-[#30363d]/50 rounded-2xl p-6 hover:border-[#1f6feb]/50 transition-all duration-300">
              <div className="text-4xl md:text-5xl font-black text-[#1f6feb] mb-2">
                {data.hero.stats.successRate}
              </div>
              <div className="text-[#8b949e] text-sm uppercase tracking-wider font-medium">
                zdawalność egzaminów
              </div>
            </div>
          </motion.div>

          {/* Enhanced CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {/* Primary CTA */}
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
              <div className="absolute inset-0 bg-gradient-to-r from-[#58a6ff] to-[#1f6feb] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.a>

            {/* Secondary CTA */}
            <motion.a
              href="#services"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-[#1f6feb] text-[#1f6feb] font-bold rounded-2xl hover:bg-[#1f6feb] hover:text-white transition-all duration-300 text-lg"
            >
              Zobacz usługi
            </motion.a>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="mt-16 flex flex-wrap justify-center items-center gap-8 text-[#8b949e] text-sm"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#1f6feb]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Pierwsza lekcja gratis
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#1f6feb]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Online i stacjonarnie
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#1f6feb]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Materiały własne
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#1f6feb]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Białystok • Zambrów
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 💼 SERVICES SECTION
// ==========================================
const ServicesSection = ({ data }: { data: HomePageData }) => {
  const [ref, inView] = useAdvancedInView();

  return (
    <section ref={ref} id="services" className="py-20 bg-[#161b22]">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-extrabold mb-8 bg-gradient-to-r from-[#f0f6fc] via-[#1f6feb] to-[#58a6ff] bg-clip-text text-transparent">
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
              className="bg-[#0d1117] border border-[#30363d] rounded-xl p-8 hover:border-[#1f6feb]/50 transition-all duration-300 shadow-lg hover:shadow-xl"
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

              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-[#8b949e]">
                    <Check className="w-4 h-4 text-[#1f6feb] mr-2 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
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
          <div className="text-lg text-[#1f6feb] font-semibold">Oszczędzasz do 120 zł!</div>
        </motion.div>
      </div>
    </section>
  );
};

// ==========================================
// 🎨 PORTFOLIO SECTION
// ==========================================
const PortfolioSection = ({ data }: { data: HomePageData }) => {
  const [ref, inView] = useAdvancedInView();
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);

  return (
    <>
      <section ref={ref} id="portfolio" className="py-20 bg-[#0d1117]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-extrabold mb-8 bg-gradient-to-r from-[#f0f6fc] via-[#1f6feb] to-[#58a6ff] bg-clip-text text-transparent">
              Portfolio
            </h2>
            <p className="text-xl text-[#8b949e] max-w-3xl mx-auto">
              Projekty które stworzyłem podczas nauki programowania i pracy z klientami.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.portfolio.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden hover:border-[#1f6feb]/50 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="h-48 bg-gradient-to-br from-[#1f6feb]/20 to-[#58a6ff]/20 flex items-center justify-center">
                  <Globe className="w-16 h-16 text-[#1f6feb]" />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#f0f6fc] mb-3">{project.title}</h3>
                  <p className="text-[#8b949e] mb-4">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-[#1f6feb]/20 text-[#58a6ff] rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1f6feb] hover:text-[#58a6ff] transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1f6feb] hover:text-[#58a6ff] transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-[#f0f6fc]">{selectedProject.title}</h3>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 hover:bg-[#30363d] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-[#8b949e]" />
                </button>
              </div>
              
              <p className="text-[#8b949e] mb-6">{selectedProject.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedProject.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-[#1f6feb]/20 text-[#58a6ff] rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                <a
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#1f6feb] text-white rounded-lg hover:bg-[#58a6ff] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Zobacz Live
                </a>
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#30363d] text-[#f0f6fc] rounded-lg hover:bg-[#484f58] transition-colors"
                >
                  <Github className="w-4 h-4" />
                  Zobacz Kod
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ==========================================
// ⭐ TESTIMONIALS SECTION
// ==========================================
const TestimonialsSection = ({ data }: { data: HomePageData }) => {
  const [ref, inView] = useAdvancedInView();

    return (
      <section ref={ref} id="testimonials" className="py-20 bg-[#161b22]">
        {/* Structured data dla opinii */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateReviewsStructuredData(data.testimonials))
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
            Opinie Uczniów
          </h2>
          <p className="text-xl text-[#8b949e] max-w-3xl mx-auto">
            Zobacz co mówią o mnie uczniowie i ich rodzice.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-[#0d1117] border border-[#30363d] rounded-xl p-6 hover:border-[#1f6feb]/50 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>

              <p className="text-[#8b949e] mb-6 leading-relaxed">"{testimonial.opinion}"</p>

              <div className="border-t border-[#30363d] pt-4">
                <div className="font-semibold text-[#f0f6fc] mb-1">{testimonial.name}</div>
                <div className="text-sm text-[#8b949e] mb-1">{testimonial.grade}</div>
                <div className="text-[#1f6feb] font-semibold text-sm">Wynik: {testimonial.result}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// ❓ FAQ SECTION
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

        <div className="max-w-4xl mx-auto space-y-4">
          {data.faq.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden hover:border-[#1f6feb]/50 transition-all duration-300"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between group focus:outline-none"
              >
                <h3 className="text-lg md:text-xl font-semibold text-[#1f6feb] group-hover:text-[#58a6ff] transition-colors duration-300 pr-4">
                  {item.question}
                </h3>
                
                <motion.div
                  animate={{ rotate: openItems.includes(index) ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-6 h-6 text-[#1f6feb]" />
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
                    <div className="px-8 pb-6 border-t border-[#30363d]">
                      <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="pt-4"
                      >
                        <p className="text-[#f0f6fc] leading-relaxed whitespace-pre-line">
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
// 📞 CONTACT SECTION
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // EmailJS integration will go here
    console.log('Form submitted:', formData);
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
          <p className="text-xl text-[#8b949e] max-w-3xl mx-auto">
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
                  <div className="text-[#8b949e]">{data.contact.phone}</div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#1f6feb]/20 rounded-lg flex items-center justify-center mr-4">
                  <Mail className="w-6 h-6 text-[#1f6feb]" />
                </div>
                <div>
                  <div className="text-[#f0f6fc] font-semibold">Email</div>
                  <div className="text-[#8b949e]">{data.contact.email}</div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#1f6feb]/20 rounded-lg flex items-center justify-center mr-4">
                  <MapPin className="w-6 h-6 text-[#1f6feb]" />
                </div>
                <div>
                  <div className="text-[#f0f6fc] font-semibold">Lokalizacja</div>
                  <div className="text-[#8b949e]">{data.contact.location}</div>
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
                  <label className="block text-[#f0f6fc] font-semibold mb-2">Imię i nazwisko</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#f0f6fc] focus:border-[#1f6feb] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[#f0f6fc] font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#f0f6fc] focus:border-[#1f6feb] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#f0f6fc] font-semibold mb-2">Telefon</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#f0f6fc] focus:border-[#1f6feb] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[#f0f6fc] font-semibold mb-2">Przedmiot</label>
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
                    <option value="inne">Inne</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#f0f6fc] font-semibold mb-2">Wiadomość</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  required
                  className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#f0f6fc] focus:border-[#1f6feb] focus:outline-none transition-colors resize-vertical"
                  placeholder="Opisz swoje potrzeby, poziom zaawansowania, cele..."
                ></textarea>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center px-8 py-4 bg-[#1f6feb] text-white font-semibold rounded-lg hover:bg-[#58a6ff] transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Send className="w-5 h-5 mr-2" />
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
          "Konwersacje z native speakerem",
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
        description: "Python, Next.js, Strapi, web development od podstaw. Także starsze technologie XAMPP.",
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
        title: "Weather App",
        description: "Aplikacja pogodowa z API OpenWeather, geolokalizacją i prognozą 5-dniową.",
        image: "/placeholder-weather.jpg",
        liveUrl: "https://weather-app-demo.vercel.app",
        githubUrl: "https://github.com/patryk/weather-app",
        technologies: ["React", "TypeScript", "OpenWeather API", "Tailwind CSS"],
        type: "web"
      },
      {
        id: 2,
        title: "Task Manager",
        description: "System zarządzania zadaniami z kalendarzem i powiadomieniami.",
        image: "/placeholder-tasks.jpg",
        liveUrl: "#",
        githubUrl: "https://github.com/patryk/task-manager",
        technologies: ["PHP", "MySQL", "Bootstrap", "JavaScript"],
        type: "demo"
      },
      {
        id: 3,
        title: "Chatbot AI",
        description: "Inteligentny chatbot wykorzystujący AI do odpowiadania na pytania.",
        image: "/placeholder-chat.jpg",
        liveUrl: "https://chatbot-demo.vercel.app",
        githubUrl: "https://github.com/patryk/ai-chatbot",
        technologies: ["Python", "FastAPI", "OpenAI API", "React"],
        type: "web"
      }
    ],
    testimonials: [
      {
        id: 1,
        name: "Anna K.",
        grade: "Matura rozszerzona 2024",
        result: "100%",
        opinion: "Dzięki Patryko zdałam maturę na 100%! Świetnie tłumaczysz trudne zagadnienia i zawsze cierpliwie odpowiadasz na pytania. Polecam każdemu!",
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
        opinion: "Angielski z Patryko to była przyjemność! Konwersacje pomogły mi przełamać barierę językową i pewnie zdać maturę.",
        rating: 5
      },
      {
        id: 6,
        name: "Tomek R.",
        grade: "Nauka programowania",
        result: "Pierwsza praca w IT",
        opinion: "Dzięki kursom Pythona z Patryko znalazłem pierwszą pracę w IT! Praktyczne podejście i realne projekty to było to czego potrzebowałem.",
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