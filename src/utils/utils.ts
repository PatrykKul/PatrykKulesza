// ==========================================
// 🛠️ UTILITY FUNCTIONS
// ==========================================

// ==========================================
// 📱 ANIMATION CONFIGURATION
// ==========================================
export const ANIMATION_CONFIG = {
  COOLDOWN_SECONDS: 300,
  DRAG_MULTIPLIER: 1.5,
  FRAME_THROTTLE: 16,
  DECELERATION: 0.95,
  MIN_VELOCITY: 0.1
} as const;

// ==========================================
// 🧭 MENU CONFIGURATION
// ==========================================
export const MENU_ITEMS = [
  { label: 'Start', href: '#hero' },
  { label: 'O mnie', href: '#about' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Opinie', href: '#testimonials' },
  { label: 'Materiały', href: '#materials' },
  { label: 'Usługi', href: '#services' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Kontakt', href: '#contact' }
];

// ==========================================
// 🔍 STRUCTURED DATA FUNCTIONS
// ==========================================

import type { FaqItem, TestimonialData } from '../types/types';

export const generateFAQStructuredData = (faqItems: FaqItem[]) => {
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

export const generateReviewsStructuredData = (testimonials: TestimonialData[]) => {
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