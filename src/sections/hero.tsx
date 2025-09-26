import { motion } from 'framer-motion';
import Image from 'next/image';
import { HomePageData } from '../types/types';
import { useAdvancedInView } from '../hooks/hooks';

export const HeroSection = ({ data }: { data: HomePageData }) => {
  const [ref, inView] = useAdvancedInView();

  return (
    <section
      ref={ref}
      id="hero"
      className="min-h-screen flex items-center bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#1f6feb]/20 relative overflow-hidden pt-16 md:pt-20"
    >
      {/* Background Pattern */}
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

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        
        {/* MAIN CONTENT - RESPONSIVE LAYOUT */}
        <div className="flex flex-col lg:grid lg:grid-cols-5 gap-8 lg:gap-12 items-center mb-8 lg:mb-4">
          
          {/* LEFT COLUMN - TEXT CONTENT */}
          <div className="w-full lg:col-span-3 text-center lg:text-left">
            
            {/* H1 - Main Title - Responsive Typography */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 sm:mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-[#f0f6fc] via-[#1f6feb] to-[#58a6ff] bg-clip-text text-transparent">
                Twój sukces,
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#58a6ff] via-[#1f6feb] to-[#f0f6fc] bg-clip-text text-transparent">
                nasze wspólne dzieło
              </span>
            </motion.h1>

            {/* H2 - SEO Optimized Subtitle - Mobile Responsive */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl text-[#c9d1d9] font-medium mb-4 sm:mb-6 tracking-wide px-2 lg:px-0"
            >
              Korepetycje Białystok, Zambrów i okolice • Matematyka • Angielski • Programowanie
              
            </motion.h2>

            {/* Description - Mobile Optimized */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#f0f6fc] mb-4 sm:mb-6 leading-relaxed font-light px-2 lg:px-0"
            >
              Specjalizuję się w korepetycjach z{' '}
              <span className="text-[#1f6feb] font-semibold">matematyki</span>,{' '}
              <span className="text-[#1f6feb] font-semibold">angielskiego</span>,{' '}
              <span className="text-[#1f6feb] font-semibold">programowania</span> ,a także tworzę{' '}
              <span className="text-[#1f6feb] font-semibold">strony internetowe</span>.
              <br className="hidden sm:block" />
              <span className="text-[#58a6ff] block sm:inline mt-2 sm:mt-0">
                Indywidualne podejście = gwarantowane rezultaty.
              </span>
            </motion.p>

            {/* Enhanced Credentials - Mobile Responsive */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mb-6 lg:mb-0"
            >
              <div className="text-xs sm:text-sm md:text-base lg:text-xl text-[#cae2ea] font-light px-2 lg:px-0">
                👨‍🏫 Private Tutor • 🔬 Data Science • 💻 Web Development • 🎯 Zambrów & Białystok
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN - BRAIN IMAGE - FULLY RESPONSIVE */}
          <div className="w-full lg:col-span-2 flex justify-center lg:justify-end order-first lg:order-last">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
            >
              {/* Floating Animation Container */}
              <motion.div
                animate={{ 
                  y: [-10, 10, -10],
                  rotate: [-1, 1, -1]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                {/* Glow Effect - Responsive */}
                <div className="absolute inset-0 bg-[#1f6feb]/20 rounded-full blur-2xl sm:blur-3xl scale-110"></div>
                
                {/* Brain Image - RESPONSIVE with aspect ratio */}
                <div className="relative w-full aspect-square">
                  <Image
                    src={`${process.env.NODE_ENV === 'production' ? '/korepetycje' : ''}/_resources/brain.png`}
                    alt="Neural Network Brain - Korepetycje Programowanie i Matematyka" 
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                    sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, (max-width: 1024px) 400px, (max-width: 1280px) 480px, 550px"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* STATISTICS - FULLY RESPONSIVE */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 max-w-5xl mx-auto"
        >
          <div className="bg-[#161b22]/50 backdrop-blur-sm border border-[#30363d]/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 hover:border-[#1f6feb]/50 transition-all duration-300 text-center">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#1f6feb] mb-1 sm:mb-2">
              {data.hero.stats.experience}
            </div>
            <div className="text-[#c9d1d9] text-xs sm:text-sm uppercase tracking-wider font-medium">
              lat doświadczenia
            </div>
          </div>
          
          <div className="bg-[#161b22]/50 backdrop-blur-sm border border-[#30363d]/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 hover:border-[#1f6feb]/50 transition-all duration-300 text-center">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#1f6feb] mb-1 sm:mb-2">
              {data.hero.stats.students}
            </div>
            <div className="text-[#c9d1d9] text-xs sm:text-sm uppercase tracking-wider font-medium">
              zadowolonych uczniów
            </div>
          </div>
          
          <div className="bg-[#161b22]/50 backdrop-blur-sm border border-[#30363d]/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 hover:border-[#1f6feb]/50 transition-all duration-300 text-center sm:col-span-1 col-span-1">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#1f6feb] mb-1 sm:mb-2">
              {data.hero.stats.successRate}
            </div>
            <div className="text-[#c9d1d9] text-xs sm:text-sm uppercase tracking-wider font-medium">
              zdawalność egzaminów
            </div>
          </div>
        </motion.div>

        {/* CTA BUTTONS - RESPONSIVE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 px-4 sm:px-0"
        >
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] text-white font-bold rounded-xl sm:rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#1f6feb]/25 text-base sm:text-lg text-center"
          >
            <span className="relative z-10 flex items-center justify-center">
              {data.hero.cta}
              <svg 
                className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </motion.a>

          <motion.a
            href="#services"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-[#1f6feb] text-[#1f6feb] font-bold rounded-xl sm:rounded-2xl hover:bg-[#1f6feb] hover:text-white transition-all duration-300 text-base sm:text-lg text-center"
          >
            Zobacz usługi
          </motion.a>
        </motion.div>

        {/* TRUST INDICATORS - RESPONSIVE */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="pb-4 flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-6 lg:gap-8 text-[#c9d1d9] px-4 sm:px-0"
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#1f6feb] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-bold text-sm sm:text-base lg:text-lg">Online i stacjonarnie</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#1f6feb] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-bold text-sm sm:text-base lg:text-lg">Materiały własne</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;