// ==========================================
// 📚 MATERIALS SECTION - Educational Resources
// ==========================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  BookOpen, 
  Download, 
  FileText, 
  CheckCircle, 
  Star,
  ArrowRight,
  Play
} from 'lucide-react';
import { useAdvancedInView } from '../hooks/hooks';
import type { MaterialsData } from '../types/types';

interface MaterialsSectionProps {
  data: MaterialsData;
}

export const MaterialsSection = ({ data }: MaterialsSectionProps) => {
  const [ref, inView] = useAdvancedInView();
  const [activeTab, setActiveTab] = useState<'math' | 'english'>('math');

  const tabVariants = {
    inactive: { 
      backgroundColor: "rgba(31, 111, 235, 0.1)",
      scale: 1,
      y: 0
    },
    active: { 
      backgroundColor: "rgba(31, 111, 235, 1)",
      scale: 1.02,
      y: -2
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 }
  };

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
          <h2 className="text-5xl md:text-6xl font-extrabold mb-8 bg-gradient-to-r from-[#f0f6fc] via-[#1f6feb] to-[#58a6ff] bg-clip-text text-transparent">
            Materiały Edukacyjne
          </h2>
          <p className="text-xl text-[#c9d1d9] max-w-3xl mx-auto">
            Sprawdzone materiały, które pomogą Ci osiągnąć sukces. Wszystko czego potrzebujesz w jednym miejscu.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-[#161b22] p-2 rounded-2xl border border-[#30363d]">
            <div className="flex space-x-2">
              <motion.button
                variants={tabVariants}
                animate={activeTab === 'math' ? 'active' : 'inactive'}
                onClick={() => setActiveTab('math')}
                className="flex items-center px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Calculator className="w-6 h-6 mr-3" />
                Matematyka
              </motion.button>
              <motion.button
                variants={tabVariants}
                animate={activeTab === 'english' ? 'active' : 'inactive'}
                onClick={() => setActiveTab('english')}
                className="flex items-center px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <BookOpen className="w-6 h-6 mr-3" />
                Angielski
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {data[activeTab].map((material, index) => (
              <motion.div
                key={material.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-[#30363d] rounded-2xl p-6 hover:border-[#1f6feb]/50 transition-all duration-300 group hover:shadow-xl hover:shadow-[#1f6feb]/10"
                whileHover={{ y: -5, scale: 1.02 }}
              >
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {material.icon}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-[#f0f6fc] mb-3">
                  {material.title}
                </h3>
                <p className="text-[#8b949e] mb-6 leading-relaxed">
                  {material.description}
                </p>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {material.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                      <span className="text-[#c9d1d9]">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-3">
                  <button className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#1f6feb]/25 transition-all duration-300 group">
                    <Download className="w-5 h-5 mr-2" />
                    Pobierz materiały
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  {material.hasVideo && (
                    <button className="flex items-center justify-center px-6 py-3 border border-[#1f6feb] text-[#1f6feb] font-semibold rounded-xl hover:bg-[#1f6feb]/10 transition-all duration-300 group">
                      <Play className="w-5 h-5 mr-2" />
                      Zobacz wideo
                    </button>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#30363d]">
                  <div className="flex items-center text-sm text-[#8b949e]">
                    <FileText className="w-4 h-4 mr-1" />
                    {material.files} plików
                  </div>
                  <div className="flex items-center text-sm text-[#8b949e]">
                    <Star className="w-4 h-4 mr-1 text-yellow-400" />
                    {material.rating}/5
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-[#161b22] to-[#0d1117] border border-[#1f6feb]/30 rounded-2xl p-8">
            <h3 className="text-3xl font-bold text-[#f0f6fc] mb-4">
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