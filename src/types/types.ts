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

// ==========================================
// 🏠 MAIN PAGE DATA TYPE
// ==========================================
export interface HomePageData {
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