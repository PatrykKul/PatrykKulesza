// ==========================================
// 📚 MATERIALS SECTION - Educational Resources
// ==========================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  BookOpen, 
  Code,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Download,
  Play,
  FileText,
  Star
} from 'lucide-react';
import { useAdvancedInView } from '../hooks/hooks';
import type { MaterialsData } from '../types/types';

interface MaterialsSectionProps {
  data: MaterialsData;
}

// Kategorie materiałów z kolorami spójnymi z ekspertyzą
const materialCategories = [
  {
    id: 'math',
    name: 'Matematyka',
    icon: Calculator,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    hoverBorderColor: 'hover:border-green-500'
  },
  {
    id: 'english', 
    name: 'Angielski',
    icon: BookOpen,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    hoverBorderColor: 'hover:border-purple-500'
  },
  {
    id: 'programming',
    name: 'Programowanie',
    icon: Code,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    hoverBorderColor: 'hover:border-blue-500'
  }
];

export const MaterialsSection = ({ data }: MaterialsSectionProps) => {
  const [ref, inView] = useAdvancedInView();
  const [activeCategory, setActiveCategory] = useState<'math' | 'english' | 'programming'>('math');



  return (
    <section ref={ref} id="materials" className="py-20 bg-[#0d1117] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#1f6feb] rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#58a6ff] rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 md:mb-8 bg-gradient-to-r from-[#f0f6fc] via-[#1f6feb] to-[#58a6ff] bg-clip-text text-transparent">
            Materiały Edukacyjne
          </h2>
          <p className="text-xl text-[#c9d1d9] max-w-3xl mx-auto">
            Sprawdzone materiały, które pomogą Ci osiągnąć sukces. Wszystko czego potrzebujesz w jednym miejscu.
          </p>
        </motion.div>

        {/* Main Content - Left Menu & Right Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid lg:grid-cols-3 gap-8 mb-16"
        >
          {/* Left Menu - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-[#30363d] rounded-2xl p-6 h-fit sticky top-8">
              <h3 className="text-xl font-bold mb-6 flex items-center text-[#f0f6fc]">
                <BookOpen className="w-6 h-6 mr-3 text-[#1f6feb]" />
                Kategorie materiałów
              </h3>
              
              <div className="space-y-3">
                {materialCategories.map((category) => {
                  const IconComponent = category.icon;
                  const isActive = activeCategory === category.id;
                  
                  return (
                    <motion.button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id as 'math' | 'english' | 'programming')}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                        isActive 
                          ? `bg-gradient-to-r ${category.color} text-white border-transparent shadow-lg`
                          : `${category.bgColor} text-[#f0f6fc] ${category.borderColor} ${category.hoverBorderColor}`
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <IconComponent className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-current'}`} />
                          <span className="font-semibold">{category.name}</span>
                        </div>
                        {isActive ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
              
              <div className="mt-6 pt-6 border-t border-[#30363d]">
                <p className="text-sm text-[#8b949e] mb-3">
                  Wszystkie materiały dostępne za darmo
                </p>
                <div className="flex items-center text-xs text-[#1f6feb]">
                  <Star className="w-4 h-4 mr-2" />
                  Sprawdzona jakość
                </div>
              </div>
            </div>
          </div>

{/* Right Content - Category Details */}
<div className="lg:col-span-2">
  <AnimatePresence mode="wait">
    <motion.div
      key={activeCategory}
      initial={{ 
        opacity: 0, 
        clipPath: 'inset(0 100% 0 0)',
        transform: 'translateX(50px)'
      }}
      animate={{ 
        opacity: 1, 
        clipPath: 'inset(0 0% 0 0)',
        transform: 'translateX(0px)'
      }}
      exit={{ 
        opacity: 0, 
        clipPath: 'inset(0 0 0 100%)', 
        transform: 'translateX(-50px)'
      }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 30,
        opacity: { duration: 0.2 }
      }}
      className="h-full origin-right overflow-hidden"
    >
      {(() => {
        const currentCategory = materialCategories.find(cat => cat.id === activeCategory);
        const IconComponent = currentCategory?.icon || BookOpen;
        
        return (
          <motion.div
            className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-[#30363d] rounded-2xl p-8 h-full flex flex-col justify-center items-center text-center min-h-[400px]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              transition: {
                delay: 0.1,
                duration: 0.3
              }
            }}
          >
            {/* Large Icon - Added animation */}
            <motion.div 
              className={`w-24 h-24 bg-gradient-to-r ${currentCategory?.color} rounded-2xl flex items-center justify-center mb-8 shadow-lg`}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <IconComponent className="w-12 h-12 text-white" />
            </motion.div>

            {/* Category Title - Added animation */}
            <motion.h3 
              className="text-4xl font-bold mb-4 text-[#f0f6fc]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              {currentCategory?.name}
            </motion.h3>

            {/* Description - Added animation */}
            <motion.p 
              className="text-lg text-[#8b949e] mb-8 max-w-md leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              {activeCategory === 'math' && "Wzory, zadania i poradniki matematyczne. Od podstaw po zaawansowane zagadnienia uniwersyteckie."}
              {activeCategory === 'english' && "Gramatyka, słownictwo i przykładowe eseje. Przygotowanie do matury i certyfikatów międzynarodowych."}
              {activeCategory === 'programming' && "Python, Web Development i Data Science. Praktyczne projekty i kursy programowania od podstaw."}
            </motion.p>

            {/* Materials Count - Added animation */}
            <motion.div 
              className="flex items-center text-[#c9d1d9] mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <FileText className="w-5 h-5 mr-2" />
              <span>{data[activeCategory]?.length || 0} dostępnych materiałów</span>
            </motion.div>

            {/* Action Button - Enhanced animation */}
            <motion.button
              onClick={() => window.open(`/${activeCategory === 'math' ? 'matematyka' : activeCategory === 'english' ? 'angielski' : 'programowanie'}`, '_blank')}
              className={`flex items-center px-8 py-4 bg-gradient-to-r ${currentCategory?.color} text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Zobacz wszystkie materiały</span>
              <ArrowRight className="w-5 h-5 ml-3" />
            </motion.button>

            {/* Additional Info - Added animation */}
            <motion.div 
              className="mt-6 flex items-center text-sm text-[#8b949e]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.3 }}
            >
              <Star className="w-4 h-4 mr-2 text-yellow-400" />
              <span>Darmowe materiały edukacyjne</span>
            </motion.div>
          </motion.div>
        );
      })()}
    </motion.div>
  </AnimatePresence>
</div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-[#161b22] to-[#0d1117] border border-[#1f6feb]/30 rounded-2xl p-8">
            <h3 className="text-3xl font-bold mb-4 text-[#f0f6fc]">
              Potrzebujesz więcej materiałów?
            </h3>
            <p className="text-[#8b949e] mb-6 max-w-2xl mx-auto">
              Jako mój uczeń otrzymasz dostęp do ekskluzywnych materiałów, zadań i rozwiązań dostosowanych do Twojego poziomu.
            </p>
            <motion.a
              href="#contact"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#1f6feb]/25 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Umów konsultację
              <ArrowRight className="w-5 h-5 ml-2" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MaterialsSection;