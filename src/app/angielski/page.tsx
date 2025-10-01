'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Languages, Search, ChevronDown, ChevronUp, BookOpen, Calendar, Target, Award, Globe } from 'lucide-react';

// Typy
type EnglishItem = {
  title: string;
  description: string;
  href: string;
  action?: () => void;
};

type EnglishTopic = {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  items: EnglishItem[];
};

type EnglishTopics = {
  [key: string]: EnglishTopic;
};

// Dane dla każdego poziomu angielskiego
const getEnglishTopics = (handleContentChange: (content: string) => void): EnglishTopics => ({
  'Poziom A1 (Podstawowy)': {
    icon: BookOpen,
    color: 'bg-green-600',
    items: [
      { title: 'Podstawowe zwroty', description: 'Powitania, pożegnania, podstawowe zwroty grzecznościowe', href: '/angielski/a1/podstawowe-zwroty' },
      { title: 'Alfabet i liczby', description: 'Nauka alfabetu, liczby 1-100, pisownia', href: '/angielski/a1/alfabet-liczby' },
      { title: 'Przedstawianie się', description: 'Jak się przedstawić, podać swoje dane osobowe', href: '/angielski/a1/przedstawianie' },
      { title: 'Rodzina i przyjaciele', description: 'Słownictwo dotyczące rodziny i relacji', href: '/angielski/a1/rodzina' },
      { title: 'Dom i mieszkanie', description: 'Pokoje, meble, podstawowe przedmioty domowe', href: '/angielski/a1/dom' },
      { title: 'Czas Present Simple', description: 'Podstawowy czas teraźniejszy, czasownik "to be"', href: '/angielski/a1/present-simple' },
      { title: 'Kolory i kształty', description: 'Podstawowe kolory, kształty geometryczne', href: '/angielski/a1/kolory-ksztalty' },
      { title: 'Jedzenie i napoje', description: 'Podstawowe słownictwo kulinarne', href: '/angielski/a1/jedzenie' }
    ]
  },
  'Poziom A2 (Podstawowy+)': {
    icon: BookOpen,
    color: 'bg-blue-600',
    items: [
      { title: 'Past Simple', description: 'Czas przeszły prosty, czasowniki regularne i nieregularne', href: '/angielski/a2/past-simple' },
      { title: 'Future Simple', description: 'Czas przyszły prosty, konstrukcje will/going to', href: '/angielski/a2/future-simple' },
      { title: 'Zakupy i usługi', description: 'Rozmowy w sklepach, restauracjach, hotelach', href: '/angielski/a2/zakupy-uslugi' },
      { title: 'Podróżowanie', description: 'Transport, kierunki, rezerwacje', href: '/angielski/a2/podrozowanie' },
      { title: 'Praca i zawody', description: 'Nazwy zawodów, miejsce pracy, czynności zawodowe', href: '/angielski/a2/praca-zawody' },
      { title: 'Zdrowie i ciało', description: 'Części ciała, dolegliwości, wizyta u lekarza', href: '/angielski/a2/zdrowie' },
      { title: 'Pogoda i pory roku', description: 'Określenia pogodowe, miesiące, dni tygodnia', href: '/angielski/a2/pogoda' },
      { title: 'Hobby i zainteresowania', description: 'Sport, rozrywka, czas wolny', href: '/angielski/a2/hobby' }
    ]
  },
  'Poziom B1 (Średniozaawansowany)': {
    icon: Target,
    color: 'bg-orange-600',
    items: [
      { title: 'Present Perfect', description: 'Czas teraźniejszy dokonany, różnice z Past Simple', href: '/angielski/b1/present-perfect' },
      { title: 'Conditional sentences', description: 'Tryb warunkowy (0, 1, 2 typ)', href: '/angielski/b1/conditional' },
      { title: 'Passive Voice', description: 'Strona bierna w różnych czasach', href: '/angielski/b1/passive-voice' },
      { title: 'Reported Speech', description: 'Mowa zależna, przekazywanie informacji', href: '/angielski/b1/reported-speech' },
      { title: 'Modal verbs', description: 'Czasowniki modalne: can, must, should, may, might', href: '/angielski/b1/modal-verbs' },
      { title: 'Phrasal verbs', description: 'Czasowniki frazowe w życiu codziennym', href: '/angielski/b1/phrasal-verbs' },
      { title: 'Business English', description: 'Podstawy angielskiego biznesowego', href: '/angielski/b1/business' },
      { title: 'Kultura i tradycje', description: 'Świętowanie, tradycje krajów anglojęzycznych', href: '/angielski/b1/kultura' }
    ]
  },
  'Poziom B2 (Średniozaawansowany+)': {
    icon: Target,
    color: 'bg-red-600',
    items: [
      { title: 'Perfect Continuous', description: 'Czasy Perfect Continuous we wszystkich aspektach', href: '/angielski/b2/perfect-continuous' },
      { title: 'Advanced Conditionals', description: 'Tryb warunkowy 3 typ, mixed conditionals', href: '/angielski/b2/advanced-conditionals' },
      { title: 'Gerunds vs Infinitives', description: 'Użycie form -ing i to + infinitive', href: '/angielski/b2/gerunds-infinitives' },
      { title: 'Advanced Vocabulary', description: 'Synonimy, kolokacje, wyrażenia idiomatyczne', href: '/angielski/b2/advanced-vocabulary' },
      { title: 'Formal Writing', description: 'Pisanie oficjalne: listy, raporty, eseje', href: '/angielski/b2/formal-writing' },
      { title: 'Presentations', description: 'Prezentacje, wystąpienia publiczne', href: '/angielski/b2/presentations' },
      { title: 'Job Interviews', description: 'Rozmowy kwalifikacyjne, CV, list motywacyjny', href: '/angielski/b2/job-interviews' },
      { title: 'Media i technologia', description: 'Słownictwo z dziedziny IT, mediów, internetu', href: '/angielski/b2/media-tech' }
    ]
  },
  'Poziom C1 (Zaawansowany)': {
    icon: Award,
    color: 'bg-purple-600',
    items: [
      { title: 'Advanced Grammar', description: 'Złożone struktury gramatyczne, inversion', href: '/angielski/c1/advanced-grammar' },
      { title: 'Academic Writing', description: 'Pisanie akademickie, argumentacja, dyskusja', href: '/angielski/c1/academic-writing' },
      { title: 'Professional English', description: 'Zaawansowany angielski biznesowy i zawodowy', href: '/angielski/c1/professional' },
      { title: 'Literature & Culture', description: 'Literatura, analiza tekstów, kontekst kulturowy', href: '/angielski/c1/literature-culture' },
      { title: 'Debate & Discussion', description: 'Debaty, dyskusje, wyrażanie opinii', href: '/angielski/c1/debate-discussion' },
      { title: 'Exam Preparation', description: 'Przygotowanie do egzaminów CAE, IELTS, TOEFL', href: '/angielski/c1/exam-prep' },
      { title: 'Specialized Vocabulary', description: 'Słownictwo specjalistyczne różnych dziedzin', href: '/angielski/c1/specialized-vocab' },
      { title: 'Pronunciation', description: 'Zaawansowana wymowa, akcent, intonacja', href: '/angielski/c1/pronunciation' }
    ]
  },
  'Poziom C2 (Biegły)': {
    icon: Award,
    color: 'bg-indigo-600',
    items: [
      { title: 'Mastery Grammar', description: 'Perfekcyjne opanowanie gramatyki', href: '/angielski/c2/mastery-grammar' },
      { title: 'Native-like Fluency', description: 'Płynność na poziomie native speakera', href: '/angielski/c2/native-fluency' },
      { title: 'Complex Texts', description: 'Analiza złożonych tekstów literackich i naukowych', href: '/angielski/c2/complex-texts' },
      { title: 'Proficiency Exams', description: 'Cambridge Proficiency, IELTS 8.0+', href: '/angielski/c2/proficiency-exams' },
      { title: 'Teaching Skills', description: 'Umiejętności nauczania języka angielskiego', href: '/angielski/c2/teaching' },
      { title: 'Translation', description: 'Tłumaczenia specjalistyczne, interpretacja', href: '/angielski/c2/translation' },
      { title: 'Cultural Nuances', description: 'Subtelności kulturowe, humor, ironia', href: '/angielski/c2/cultural-nuances' },
      { title: 'Research & Publishing', description: 'Pisanie naukowe, publikacje w języku angielskim', href: '/angielski/c2/research-publishing' }
    ]
  },
  'Matura z Angielskiego': {
    icon: Calendar,
    color: 'bg-green-700',
    items: [
      { title: 'Matura 2025', description: 'Materiały i zadania maturalne 2025', href: '/angielski/matura/2025' },
      { title: 'Matura 2024', description: 'Arkusze i rozwiązania z 2024', href: '/angielski/matura/2024' },
      { title: 'Matura próbna', description: 'Próbne egzaminy maturalne', href: '/angielski/matura/probna' },
      { title: 'Rozumienie słuchowe', description: 'Ćwiczenia listening, strategie', href: '/angielski/matura/listening' },
      { title: 'Rozumienie pisemne', description: 'Reading comprehension, techniki czytania', href: '/angielski/matura/reading' },
      { title: 'Wypowiedź pisemna', description: 'Writing: email, rozprawka, opowiadanie', href: '/angielski/matura/writing' },
      { title: 'Wypowiedź ustna', description: 'Speaking: prezentacja, rozmowa, dyskusja', href: '/angielski/matura/speaking' },
      { title: 'Znajomość funkcji językowych', description: 'Use of English, gramatyka, słownictwo', href: '/angielski/matura/use-of-english' }
    ]
  },
  'Certyfikaty Językowe': {
    icon: Globe,
    color: 'bg-blue-700',
    items: [
      { title: 'Cambridge Certificates', description: 'KET, PET, FCE, CAE, CPE', href: '/angielski/certyfikaty/cambridge' },
      { title: 'IELTS', description: 'International English Language Testing System', href: '/angielski/certyfikaty/ielts' },
      { title: 'TOEFL', description: 'Test of English as a Foreign Language', href: '/angielski/certyfikaty/toefl' },
      { title: 'TOEIC', description: 'Test of English for International Communication', href: '/angielski/certyfikaty/toeic' },
      { title: 'Trinity Exams', description: 'Trinity College London qualifications', href: '/angielski/certyfikaty/trinity' },
      { title: 'Business Certificates', description: 'BEC Preliminary, Vantage, Higher', href: '/angielski/certyfikaty/business' },
      { title: 'Przygotowanie strategiczne', description: 'Techniki zdawania, zarządzanie czasem', href: '/angielski/certyfikaty/strategie' },
      { title: 'Mock exams', description: 'Egzaminy próbne wszystkich typów', href: '/angielski/certyfikaty/mock-exams' }
    ]
  }
});

export default function AngielskiPage() {
  const [isLevelMenuOpen, setIsLevelMenuOpen] = useState(false);
  const [isCertMenuOpen, setIsCertMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentContent, setCurrentContent] = useState('Hello');

  const toggleLevelMenu = () => {
    setIsLevelMenuOpen(!isLevelMenuOpen);
  };

  const toggleCertMenu = () => {
    setIsCertMenuOpen(!isCertMenuOpen);
  };

  const handleContentChange = (content: string) => {
    setCurrentContent(content);
    setIsLevelMenuOpen(false);
    setIsCertMenuOpen(false);
  };

  // Pobieramy dane z funkcją handleContentChange
  const englishTopics = getEnglishTopics(handleContentChange);

  // Filtrowanie treści w czasie rzeczywistym
  const filteredItems = useMemo(() => {
    if (currentContent === 'Hello' || !englishTopics[currentContent]) {
      return [];
    }

    const items = englishTopics[currentContent].items;
    
    if (!searchQuery.trim()) {
      return items;
    }

    return items.filter((item: EnglishItem) => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [currentContent, searchQuery, englishTopics]);

  const currentTopic = englishTopics[currentContent];

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      {/* Header z powrotem */}
      <header className="border-b border-[#30363d] bg-[#161b22]">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-[#58a6ff] hover:text-[#1f6feb] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Powrót do strony głównej
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#1f6feb] to-[#58a6ff] rounded-full mb-6">
              <Languages className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-[#58a6ff] via-[#1f6feb] to-[#0969da] bg-clip-text text-transparent">
              Korepetycje z Angielskiego
            </h1>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Profesjonalne korepetycje z języka angielskiego - od podstaw do poziomu zaawansowanego
            </p>
          </div>

          {/* Navigation Menu */}
          <nav className="mb-8">
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6">
              <div className="flex flex-wrap justify-center gap-4">
                {/* Poziomy - Dropdown Menu */}
                <div className="relative">
                  <button
                    onClick={toggleLevelMenu}
                    className="inline-flex items-center gap-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] px-6 py-3 rounded-lg transition-colors font-medium"
                  >
                    Poziomy językowe
                    {isLevelMenuOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  
                  {isLevelMenuOpen && (
                    <div className="absolute top-full left-0 mt-2 bg-[#21262d] border border-[#30363d] rounded-lg shadow-xl z-50 min-w-[280px]">
                      <div className="p-2">
                        <div className="px-4 py-2 text-sm font-medium text-[#58a6ff]">
                          Poziomy CEFR:
                        </div>
                        <button
                          onClick={() => handleContentChange('Poziom A1 (Podstawowy)')}
                          className="block w-full text-left px-4 py-2 hover:bg-[#30363d] rounded-md transition-colors text-sm"
                        >
                          A1 - Podstawowy
                        </button>
                        <button
                          onClick={() => handleContentChange('Poziom A2 (Podstawowy+)')}
                          className="block w-full text-left px-4 py-2 hover:bg-[#30363d] rounded-md transition-colors text-sm"
                        >
                          A2 - Podstawowy+
                        </button>
                        <button
                          onClick={() => handleContentChange('Poziom B1 (Średniozaawansowany)')}
                          className="block w-full text-left px-4 py-2 hover:bg-[#30363d] rounded-md transition-colors text-sm"
                        >
                          B1 - Średniozaawansowany
                        </button>
                        <button
                          onClick={() => handleContentChange('Poziom B2 (Średniozaawansowany+)')}
                          className="block w-full text-left px-4 py-2 hover:bg-[#30363d] rounded-md transition-colors text-sm"
                        >
                          B2 - Średniozaawansowany+
                        </button>
                        <button
                          onClick={() => handleContentChange('Poziom C1 (Zaawansowany)')}
                          className="block w-full text-left px-4 py-2 hover:bg-[#30363d] rounded-md transition-colors text-sm"
                        >
                          C1 - Zaawansowany
                        </button>
                        <button
                          onClick={() => handleContentChange('Poziom C2 (Biegły)')}
                          className="block w-full text-left px-4 py-2 hover:bg-[#30363d] rounded-md transition-colors text-sm"
                        >
                          C2 - Biegły
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Matura */}
                <button
                  onClick={() => handleContentChange('Matura z Angielskiego')}
                  className="inline-flex items-center gap-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] px-6 py-3 rounded-lg transition-colors font-medium"
                >
                  Matura
                </button>

                {/* Certyfikaty - Dropdown Menu */}
                <div className="relative">
                  <button
                    onClick={toggleCertMenu}
                    className="inline-flex items-center gap-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] px-6 py-3 rounded-lg transition-colors font-medium"
                  >
                    Certyfikaty
                    {isCertMenuOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  
                  {isCertMenuOpen && (
                    <div className="absolute top-full left-0 mt-2 bg-[#21262d] border border-[#30363d] rounded-lg shadow-xl z-50 min-w-[200px]">
                      <div className="p-2">
                        <button
                          onClick={() => handleContentChange('Certyfikaty Językowe')}
                          className="block w-full text-left px-4 py-2 hover:bg-[#30363d] rounded-md transition-colors"
                        >
                          Wszystkie certyfikaty
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Business English */}
                <button
                  onClick={() => handleContentChange('Poziom B1 (Średniozaawansowany)')}
                  className="inline-flex items-center gap-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] px-6 py-3 rounded-lg transition-colors font-medium"
                >
                  Business English
                </button>
              </div>
            </div>
          </nav>

          {/* Main Content Area */}
          <div className="text-center">
            {currentContent === 'Hello' ? (
              <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-12">
                <h2 className="text-4xl font-bold mb-6 text-[#58a6ff]">
                  Wybierz swój poziom angielskiego
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
                  Oferujemy korepetycje na wszystkich poziomach - od podstawowego A1 do biegłego C2.
                  Przygotowujemy także do egzaminów maturalnych i certyfikatów językowych.
                </p>

                {/* Quick Level Assessment */}
                <div className="bg-[#21262d] border border-[#30363d] rounded-xl p-6 mb-8 max-w-2xl mx-auto">
                  <h3 className="text-lg font-semibold mb-4 text-[#58a6ff]">Nie znasz swojego poziomu?</h3>
                  <p className="text-gray-400 mb-4">Wykonaj szybki test i dowiedz się, na jakim poziomie jesteś!</p>
                  <button className="bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] hover:from-[#1a5fcf] hover:to-[#4493f8] text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300">
                    Wykonaj test poziomujący
                  </button>
                </div>
                
                <div className="mt-8">
                  <Link
                    href="#contact"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] hover:from-[#1a5fcf] hover:to-[#4493f8] text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Umów się na pierwszą lekcję
                  </Link>
                </div>
              </div>
            ) : currentTopic ? (
              <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8">
                {/* Header sekcji */}
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${currentTopic.color} rounded-full mb-4`}>
                    <currentTopic.icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4 text-[#58a6ff]">
                    {currentContent}
                  </h2>
                  <p className="text-gray-400 mb-6">
                    Wybierz temat, z którym potrzebujesz pomocy
                  </p>
                </div>

                {/* Wyszukiwarka */}
                <div className="max-w-2xl mx-auto mb-8">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Szukaj tematów..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-[#21262d] border border-[#30363d] rounded-xl text-white placeholder-gray-400 focus:border-[#58a6ff] focus:outline-none transition-colors duration-300"
                    />
                  </div>
                  
                  {searchQuery && (
                    <div className="text-gray-400 text-sm mt-2">
                      Znaleziono {filteredItems.length} {filteredItems.length === 1 ? 'temat' : 'tematów'}
                    </div>
                  )}
                </div>

                {/* Treści */}
                {filteredItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {filteredItems.map((item: EnglishItem, index: number) => (
                      <div
                        key={index}
                        className="bg-[#21262d] border border-[#30363d] rounded-xl p-6 hover:border-[#58a6ff]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#58a6ff]/10 cursor-pointer group"
                        onClick={() => item.action ? item.action() : window.location.href = item.href}
                      >
                        <div className="text-left">
                          <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-[#58a6ff] transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-gray-400 text-sm leading-relaxed mb-4">
                            {item.description}
                          </p>
                          <div className="flex items-center gap-2 text-[#58a6ff] text-sm font-semibold group-hover:gap-3 transition-all duration-300">
                            <span>Przejdź do materiałów</span>
                            <ArrowLeft className="w-4 h-4 rotate-180" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : searchQuery ? (
                  <div className="text-center py-12">
                    <div className="text-gray-500 mb-4">
                      <Search className="w-16 h-16 mx-auto mb-4" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">
                      Brak wyników
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Nie znaleziono tematów pasujących do &ldquo;{searchQuery}&rdquo;
                    </p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="bg-[#58a6ff] text-black px-6 py-3 rounded-xl font-semibold hover:bg-[#4493f8] transition-colors duration-300"
                    >
                      Wyczyść wyszukiwanie
                    </button>
                  </div>
                ) : null}

                {/* CTA */}
                <div className="mt-12 text-center">
                  <Link
                    href="#contact"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] hover:from-[#1a5fcf] hover:to-[#4493f8] text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Umów się na lekcję z tego tematu
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#30363d] bg-[#161b22] mt-20">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-400">
            © 2024 Patryk Kulesza - Korepetycje z Języka Angielskiego. Wszystkie prawa zastrzeżone.
          </p>
        </div>
      </footer>
    </div>
  );
}