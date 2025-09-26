import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { FaqItem, HomePageData } from '../types/types';
import { useAdvancedInView } from '../hooks/hooks';
import { generateFAQStructuredData } from '../utils/utils';

export const FaqSection = ({ data }: { data: HomePageData }) => {
  const [ref, inView] = useAdvancedInView();
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = useCallback((index: number) => {
    setOpenItems(prev => 
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  }, []);

  // Dzielimy FAQ na dwie kolumny
  const leftColumnItems = data.faq.filter((_, index) => index % 2 === 0);
  const rightColumnItems = data.faq.filter((_, index) => index % 2 === 1);

  const renderFAQItem = (item: FaqItem, originalIndex: number) => (
    <motion.div
      key={originalIndex}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: originalIndex * 0.1 }}
      className="bg-[#161b22] border border-[#30363d] rounded-lg sm:rounded-xl overflow-hidden hover:border-[#1f6feb]/50 transition-all duration-300 shadow-lg hover:shadow-xl"
    >
      <button
        onClick={() => toggleItem(originalIndex)}
        className="w-full px-4 sm:px-6 md:px-8 lg:px-6 py-4 sm:py-6 md:py-8 lg:py-6 text-left flex items-center justify-between group focus:outline-none cursor-pointer"
      >
        <h3 className="text-base sm:text-lg md:text-xl lg:text-lg font-semibold text-[#1f6feb] group-hover:text-[#58a6ff] transition-colors duration-300 pr-3 sm:pr-4 md:pr-6 lg:pr-3 leading-relaxed">
          {item.question}
        </h3>
        
        <motion.div
          animate={{ rotate: openItems.includes(originalIndex) ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-5 lg:h-5 text-[#1f6feb]" />
        </motion.div>
      </button>

      <AnimatePresence>
        {openItems.includes(originalIndex) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-6 md:px-8 lg:px-6 pb-4 sm:pb-6 md:pb-8 lg:pb-6 border-t border-[#30363d]">
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="pt-3 sm:pt-4 md:pt-6 lg:pt-4"
              >
                <p className="text-[#f0f6fc] text-sm sm:text-base md:text-lg lg:text-base leading-relaxed whitespace-pre-line">
                  {item.answer}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

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

        {/* Mobile: Single column */}
        <div className="lg:hidden max-w-5xl mx-auto space-y-3 sm:space-y-4 md:space-y-6">
          {data.faq.map((item, index) => renderFAQItem(item, index))}
        </div>

        {/* Desktop: Two columns */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8 max-w-7xl mx-auto">
          {/* Left Column */}
          <div className="space-y-6">
            {leftColumnItems.map((item, index) => {
              const originalIndex = data.faq.findIndex(faqItem => faqItem === item);
              return renderFAQItem(item, originalIndex);
            })}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {rightColumnItems.map((item, index) => {
              const originalIndex = data.faq.findIndex(faqItem => faqItem === item);
              return renderFAQItem(item, originalIndex);
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
export default FaqSection;