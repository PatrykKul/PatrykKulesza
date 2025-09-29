// ==========================================
// 🎯 TYPESCRIPT INTERFACES & TYPES
// ==========================================

import React from 'react';

// ==========================================
// 🏠 HERO SECTION TYPES
// ==========================================
export interface HeroData {
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  stats: {
    experience: string;
    students: string;
    successRate: string;
    websites: string;
  };
}

// ==========================================
// 💼 SERVICE TYPES
// ==========================================
export interface ServiceData {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  levels: string[];
  price: string;
  features: string[];
}

// ==========================================
// 🎨 PORTFOLIO TYPES
// ==========================================
export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  image?: string;
  demoUrl?: string;
  technologies: string[];
  type: 'web' | 'desktop' | 'game' | 'ml' | 'tool';
  category: string;
}

// ==========================================
// ⭐ TESTIMONIAL TYPES
// ==========================================
export interface TestimonialData {
  id: number;
  name: string;
  grade: string;
  result: string;
  opinion: string;
  rating: number;
}

// ==========================================
// ❓ FAQ TYPES
// ==========================================
export interface FaqItem {
  question: string;
  answer: string;
}

// ==========================================
// 📞 CONTACT FORM TYPES
// ==========================================
export interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

// ==========================================
// 🎓 ABOUT SECTION TYPES
// ==========================================
export interface EducationStat {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}

export interface SkillItem {
  name: string;
  description?: string; // Opcjonalny opis dla cinematic slidera
}

export interface Skill {
  category: string;
  items: SkillItem[];
  color: string;
}

export interface Certificate {
  title: string;
  issuer: string;
  images: string[];
  links?: string[]; // Opcjonalny link dla certyfikatów online
}

export interface ExpertiseCategory {
  id: string;
  title: string;
  color: string;
  gradient: string;
  icon: React.ReactNode;
  skills: string[];
  achievements: string[];
  symbols: string[];
}

// ==========================================
// 🏠 MAIN PAGE DATA TYPE
// ==========================================
// ==========================================
// 📚 MATERIALS SECTION TYPES
// ==========================================
export interface MaterialItem {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  files: number;
  rating: number;
  hasVideo: boolean;
}

export interface MaterialsData {
  math: MaterialItem[];
  english: MaterialItem[];
  programming: MaterialItem[];
}

// ==========================================
// 🌐 WEB DEVELOPMENT SECTION TYPES
// ==========================================
export interface WebDevService {
  title: string;
  description: string;
  price: string;
  features: string[];
}

export interface WebDevData {
  title: string;
  subtitle: string;
  description: string;
  services: WebDevService[];
  teamUrl: string;
  stats: {
    projects: string;
    clients: string;
    experience: string;
  };
}

// ==========================================
// 🎯 UNIFIED SERVICES SECTION TYPES (BENTO GRID)
// ==========================================
export interface UnifiedService {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  description: string;
  features: string[];
  levels: string[];
  ctaText: string;
  highlighted?: boolean;
  category: 'korepetycje' | 'webdev';
}

export interface UnifiedServicesData {
  title: string;
  subtitle: string;
  description: string;
  services: UnifiedService[];
  stats: {
    experience: string;
    students: string;
    projects: string;
  };
}

// ==========================================
// 🏠 MAIN PAGE DATA TYPE
// ==========================================
export interface HomePageData {
  hero: HeroData;
  services: ServiceData[];
  materials: MaterialsData;
  webdev: WebDevData;
  unifiedServices: UnifiedServicesData; // New unified services data
  testimonials: TestimonialData[];
  faq: FaqItem[];
  contact: {
    phone: string;
    email: string;
    location: string;
  };
}