"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAdvancedInView } from "../hooks/hooks";
import { ArrowRight, ArrowUpRight, Calculator, BookOpenCheck, Code, Globe, Award, Bot } from "lucide-react";
import type { HomePageData } from '../types/types';

export const ServicesSection = ({ data }: { data: HomePageData }) => {
  const [ref, inView] = useAdvancedInView();
  const [visibleServices, setVisibleServices] = useState<number[]>([]);
  const [activeService, setActiveService] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [animatedElements, setAnimatedElements] = useState<string[]>([]);

  const handleBookService = (serviceTitle: string) => {
    const serviceMapping: { [key: string]: string } = {
      'Matematyka': 'matematyka',
      'Angielski': 'angielski', 
      'Programowanie': 'programowanie',
      'Strony Internetowe': 'strony-internetowe',
      'Integracja AI': 'integracja-ai'
    };
    
    const serviceValue = serviceMapping[serviceTitle] || serviceTitle.toLowerCase();
    
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        window.location.hash = `contact-${serviceValue}`;
        contactSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
        window.dispatchEvent(new CustomEvent('autoFillService', {
          detail: { service: serviceValue }
        }));
      }
    }
  };

  useEffect(() => {
    if (inView) {
      data.unifiedServices.services.forEach((_, index) => {
        setTimeout(() => {
          setVisibleServices(prev => [...prev, index]);
        }, index * 200);
      });
    } else {
      setVisibleServices([]);
    }
  }, [inView, data.unifiedServices.services]);

  const changeActiveService = (newIndex: number) => {
    if (newIndex === activeService) return;
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      setActiveService(newIndex);
      setTimeout(() => {
        setIsTransitioning(false);
        
        setAnimatedElements([]);
        const elements = ['title', 'subtitle', 'description', 'features', 'cta'];
        elements.forEach((element, i) => {
          setTimeout(() => {
            setAnimatedElements(prev => [...prev, element]);
          }, i * 150);
        });
      }, 50);
    }, 150);
  };

  useEffect(() => {
    if (inView) {
      setTimeout(() => {
        const elements = ['title', 'subtitle', 'description', 'features', 'cta'];
        elements.forEach((element, i) => {
          setTimeout(() => {
            setAnimatedElements(prev => [...prev, element]);
          }, i * 150 + 500);
        });
      }, 300);
    }
  }, [inView]);

  const serviceIcons = [Calculator, BookOpenCheck, Code, Globe, Bot];
  const currentService = data.unifiedServices.services[activeService];


  
  return (
    <motion.section 
      ref={ref} 
      id="services" 
      className="py-16 bg-[#161b22] relative overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#1f6feb]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-[#58a6ff]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="container mx-auto px-6 mb-16">
        <div className="text-center">
         
          
          <div className="overflow-hidden">
            <h2 className="pb-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 md:mb-8 bg-gradient-to-r from-[#58a6ff] via-[#1f6feb] to-[#0969da] bg-clip-text text-transparent">
              Moje Usługi
            </h2>
          </div>
          <div className="">
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#c9d1d9] max-w-4xl mx-auto leading-relaxed">
              Profesjonalne korepetycje z matematyki, angielskiego i programowania oraz tworzenie nowoczesnych stron internetowych. 
              <span className="font-bold"> {data.unifiedServices.stats.experience} lat doświadczenia</span>, <span className="font-bold">
                {data.unifiedServices.stats.students} zadowolonych uczniów <br/></span>
              <span className="font-bold"> oraz ponad {data.unifiedServices.stats.projects} zrealizowanych projektów.</span>
            </p>
          </div>
        </div>
      </div>


      {/* Bento Grid - Desktop */}
      <div className="hidden lg:block">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-3 gap-6 min-h-[600px]">
            
            {/* Services Menu - Left Column */}
            <div className="col-span-1 row-span-2">
              <div 
                className="rounded-3xl p-8 shadow-xl h-full"
                style={{ background: '#f0f6fc' }}
              >
                <div className="mb-8 flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl text-[#0d1117] font-bold">WYBIERZ USŁUGĘ</h3>
                  </div>
                  <div>
                    <span className="text-xl font-bold text-[#0d1117]">
                      {currentService?.price || '60-80 zł/h'}
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  {data.unifiedServices.services.map((service, index) => {
                    const IconComponent = serviceIcons[index];
                    const isActive = index === activeService;
                    const isVisible = visibleServices.includes(index);
                    
                    return (
                      <div
                        key={service.id}
                        className={`
                          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                          transition-all duration-800 ease-out
                        `}
                        style={{ transitionDelay: `${index * 200}ms` }}
                      >
                        <button
                          onClick={() => changeActiveService(index)}
                          className="w-full text-left transition-all duration-300 ease-out hover:scale-102 cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <IconComponent className="w-5 h-5 text-[#0d1117]" />
                              <div className="flex-1">
                                <span className="text-[#0d1117] text-sm block tracking-wide font-semibold">
                                  {service.title.toUpperCase()}
                                </span>
                              </div>
                              <span className="text-xs text-[#656d76] ml-auto">
                                {service.price.toUpperCase()}
                              </span>
                            </div>
                            {isActive ? (
                              <ArrowUpRight className="w-4 h-4 text-[#1f6feb] ml-3 transition-all duration-300 scale-110" />
                            ) : (
                              <ArrowRight className="w-4 h-4 text-[#0d1117] ml-3 transition-all duration-300 hover:translate-x-1" />
                            )}
                          </div>
                          <div className={`h-px w-full transition-colors duration-300 ${isActive ? 'bg-[#1f6feb]' : 'bg-[#0d1117]/20'}`}></div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Service Details - Right Side */}
            <div className="col-span-2 row-span-3">
              <div 
                className="rounded-3xl p-10 shadow-xl h-full relative overflow-hidden"
                style={{ background: '#0d1117' }}
              >
                <div className={`w-full transition-all duration-300 ease-out ${
                  isTransitioning 
                    ? 'opacity-0 translate-x-8' 
                    : 'opacity-100 translate-x-0'
                }`}>
                  <div className="space-y-8 relative z-10">
                    
                    <div className="overflow-hidden">
                      <h3 
                        className={`text-4xl lg:text-5xl text-[#f0f6fc] leading-tight transition-all duration-700 ease-out font-bold ${
                          animatedElements.includes('title') 
                            ? 'translate-y-0 opacity-100' 
                            : 'translate-y-full opacity-0'
                        }`}
                      >
                        {currentService.title}
                      </h3>
                    </div>

                    <div className="overflow-hidden">
                      <p 
                        className={`text-2xl text-[#1f6feb] transition-all duration-700 ease-out ${
                          animatedElements.includes('subtitle') 
                            ? 'translate-y-0 opacity-100' 
                            : 'translate-y-full opacity-0'
                        }`}
                      >
                        {currentService.subtitle}
                      </p>
                    </div>

                    <div className="overflow-hidden">
                      <p 
                        className={`text-[#c9d1d9] text-lg leading-relaxed transition-all duration-700 ease-out ${
                          animatedElements.includes('description') 
                            ? 'translate-y-0 opacity-100' 
                            : 'translate-y-full opacity-0'
                        }`}
                      >
                        {currentService.description}
                      </p>
                    </div>

                    <div className="overflow-hidden">
                      <div 
                        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-700 ease-out ${
                          animatedElements.includes('features') 
                            ? 'translate-y-0 opacity-100' 
                            : 'translate-y-full opacity-0'
                        }`}
                      >
                        {currentService.features.slice(0, 6).map((feature, index) => (
                          <div key={index} className="flex items-start gap-3 p-4 bg-[#f0f6fc]/5 rounded-lg hover:bg-[#f0f6fc]/8 transition-colors">
                            <div className="w-1.5 h-1.5 bg-[#1f6feb] rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-[#c9d1d9] text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="overflow-hidden">
                      <div 
                        className={`flex flex-wrap gap-2 transition-all duration-700 ease-out ${
                          animatedElements.includes('features') 
                            ? 'translate-y-0 opacity-100' 
                            : 'translate-y-full opacity-0'
                        }`}
                      >
                        {currentService.levels.map((level, index) => (
                          <span key={index} className="px-3 py-1 bg-[#1f6feb]/20 text-[#58a6ff] rounded-full text-sm border border-[#1f6feb]/30">
                            {level}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="overflow-hidden">
                      <div 
                        className={`transition-all duration-700 ease-out ${
                          animatedElements.includes('cta') 
                            ? 'translate-y-0 opacity-100' 
                            : 'translate-y-full opacity-0'
                        }`}
                      >
                        <button
                          onClick={() => handleBookService(currentService.title)}
                          className="inline-block group cursor-pointer"
                        >
                          <div className="m-2 cursor-pointer flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] text-white font-medium text-base transition-all duration-150 hover:scale-105 active:scale-100 focus:outline-none focus:ring-4 focus:ring-[#1f6feb]/30 shadow-lg hover:shadow-xl">
                            {currentService.ctaText}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Package 10h - Bottom Left */}
            <div className="col-span-1 row-span-1">
              <div 
                className="rounded-3xl p-6 shadow-xl h-full relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #1f6feb, #58a6ff)' }}
              >
                <div className={`${
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                } transition-all duration-700 ease-out delay-700 h-full flex flex-col justify-center`}>
                  
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <Award className="w-12 h-12 text-white animate-pulse" />
                    </div>
                    
                    <h3 className="text-xl text-white font-bold">
                      Pakiet 10 godzin
                    </h3>
                    
                    <p className="text-white/90 text-sm">
                      Oszczędź <span className="font-bold">20%</span> przy zakupie pakietu 10 godzin z góry!
                    </p>
                    
                    <div className="text-white/90 font-bold text-lg">
                      Oszczędzasz do 120 zł!
                    </div>
                    
                    <button
                      onClick={() => handleBookService('pakiet')}
                      className="cursor-pointer w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm backdrop-blur-sm border border-white/20 hover:border-white/40"
                    >
                      Umów pakiet 10h
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Mobile layout */}
      <div className="lg:hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 gap-2 sm:gap-4 md:gap-6">
            {data.unifiedServices.services.map((service, index) => (
              <div
                key={service.id}
                className={`
                  ${visibleServices.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                  transition-all duration-800 ease-out
                  ${service.highlighted ? 'bg-gradient-to-br from-[#1f6feb]/10 to-transparent border-[#1f6feb]/30' : 'bg-[#0d1117]/80 border-[#30363d]'}
                  border rounded-2xl p-3 sm:p-6 backdrop-blur-md
                `}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    {React.createElement(serviceIcons[index], { 
                      className: "w-8 h-8 sm:w-12 sm:h-12 text-[#1f6feb]" 
                    })}
                  </div>
                  
                  <div>
                    <span className="text-sm sm:text-lg text-[#1f6feb] bg-[#0d1117]/80 px-2 sm:px-3 py-1 rounded-full border border-[#1f6feb]/30 font-semibold">
                      {service.price}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="text-lg sm:text-xl text-[#f0f6fc] mb-1 font-bold">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#1f6feb]">
                      {service.subtitle}
                    </p>
                  </div>
                  
                  <p className="text-[#c9d1d9] text-xs sm:text-sm leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 justify-center">
                    {service.levels.map((level, levelIndex) => (
                      <span key={levelIndex} className="px-2 py-1 bg-[#1f6feb]/10 text-[#58a6ff] rounded text-xs border border-[#1f6feb]/20">
                        {level}
                      </span>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => handleBookService(service.title)}
                    className="group inline-flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] text-white px-3 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm transition-all duration-300 hover:scale-105 cursor-pointer font-semibold"
                  >
                    {service.ctaText}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
            
            {/* Package 10h - Mobile */}
            <div className="col-span-2">
              <div className="bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] rounded-2xl p-4 sm:p-6 text-center">
                <Award className="w-8 h-8 sm:w-10 sm:h-10 text-white mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl text-white font-bold mb-2">Pakiet 10 godzin</h3>
                <p className="text-white/90 text-xs sm:text-sm mb-3 sm:mb-4">Oszczędź 20% przy zakupie pakietu!</p>
                <button
                  onClick={() => handleBookService('pakiet')}
                  className="bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg transition-all duration-300 text-sm"
                >
                  Umów pakiet 10h
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ServicesSection;
