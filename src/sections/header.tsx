import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import { MENU_ITEMS } from '../utils/utils';

export const Header = () => {
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
              className="flex items-center cursor-pointer"
              onClick={() => handleMenuClick('#hero')}
            >
              <motion.div 
                className="relative w-30 h-12 md:w-60 md:h-12"
                whileHover={{ rotate: 5 }}
              >
                <Image
                  src="/_resources/logo-PatrykKulesza.webp"
                  alt="Patryk Kulesza - Logo"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 840px, 200px"
                  priority
                />
              </motion.div>
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