// ==========================================
// FILE: src/sections/header.tsx
// ==========================================
// Header - ZAWSZE MOBILNY STYL (hamburger + search)
// Refaktoryzacja: Desktop menu usunięte, search input dodany

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search } from 'lucide-react';
import Image from 'next/image';
import { MENU_ITEMS } from '../utils/utils';
import { useSearchContext } from '@/contexts/SearchContext';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  
  // 🔥 Search Context
  const { openSearch } = useSearchContext();

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
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center cursor-pointer flex-shrink-0"
              onClick={() => handleMenuClick('#hero')}
            >
              <motion.div 
                className="relative w-24 h-10 sm:w-40 sm:h-12 md:w-52 md:h-14"
                whileHover={{ rotate: 5 }}
              >
                <Image
                  src="/_resources/logo-PatrykKulesza.webp"
                  alt="Patryk Kulesza - Logo"
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 96px, (max-width: 768px) 160px, 208px"
                  priority
                />
              </motion.div>
            </motion.div>

            {/* 🔥 SEARCH INPUT - Zawsze widoczny */}
            <motion.button
              onClick={() => openSearch('user')}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 max-w-md flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#21262d] border border-[#30363d] hover:border-[#1f6feb] transition-all duration-300 group"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-[#1f6feb] transition-colors flex-shrink-0" />
              <span className="text-sm sm:text-base text-gray-400 group-hover:text-gray-300 transition-colors truncate">
                Szukaj materiałów...
              </span>
              <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs bg-[#161b22] border border-[#30363d] rounded text-gray-500 ml-auto">
                <span className="text-xs">⌘</span>K
              </kbd>
            </motion.button>

            {/* Hamburger Menu Button */}
            <motion.button
              className="p-2 sm:p-3 rounded-xl bg-[#1f6feb]/10 border border-[#1f6feb]/20 text-[#1f6feb] hover:bg-[#1f6feb]/20 transition-all duration-300 flex-shrink-0"
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
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0d1117]/90 backdrop-blur-lg"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Menu Content - From Right */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-gradient-to-br from-[#161b22] to-[#0d1117] border-l border-[#1f6feb]/20 shadow-2xl"
            >
              <div className="flex flex-col h-full pt-24 pb-8 px-6">
                
                {/* Logo in mobile menu */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="flex items-center justify-center mb-8 pb-6 border-b border-[#30363d] cursor-pointer"
                  onClick={() => handleMenuClick('#hero')}
                >
                  <div className="relative w-24 h-24">
                    <Image
                      src="/_resources/logo-PatrykKulesza.webp"
                      alt="Patryk Kulesza - Logo"
                      fill
                      className="object-contain"
                      sizes="96px"
                    />
                  </div>
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

export default Header;