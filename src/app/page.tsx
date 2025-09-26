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

// Import utility functions
import { 
  ANIMATION_CONFIG, 
  MENU_ITEMS, 
  generateFAQStructuredData, 
  generateReviewsStructuredData
} from '../utils/utils';

// Import types
import type {
  HeroData,
  ServiceData,
  PortfolioItem,
  TestimonialData,
  FaqItem,
  FormErrors,
  HomePageData,
  EducationStat,
  SkillItem,
  Skill,
  Certificate
} from '../types/types';

// Import custom hooks
import { useMobileDetection, useAdvancedInView } from '../hooks/hooks';

// Import section components
import  Header from '../sections/header';
import HeroSection from '../sections/hero';
import AboutSection from '../sections/about';
import TestimonialsSection from '@/sections/testimonials';
import PortfolioSection from '@/sections/portfolio';
import ServicesSection from '@/sections/service';
import FaqSection from '@/sections/faq';
import ContactSection from '@/sections/contact';
import Footer from '../sections/footer';

// Import website data
import { websiteData } from '../data/data';

// ==========================================
// 🏠 MAIN PAGE COMPONENT
// ==========================================
export default function HomePage() {
  // Use imported website data
  const data = websiteData;

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
        {/* <PortfolioSection data={data} /> */}

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