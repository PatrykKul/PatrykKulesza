'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, Search, ChevronDown, BookOpen, Calendar, Target, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MathTopic {
  title: string;
  description: string;
  href: string;
  submenu?: MathTopic[];
}

interface TopicSection {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  items: MathTopic[];
}

// Dane dla każdego poziomu
const mathTopicsData: Record<string, TopicSection> = {
  'Szkoła podstawowa': {
    icon: BookOpen,
    color: 'bg-blue-600',
    items: [
      { 
        title: 'Liczby naturalne', 
        description: 'Działania na liczbach naturalnych, własności', 
        href: '/szkola/podstawowa/liczby-naturalne' 
      },
      { 
        title: 'Ułamki zwykłe', 
        description: 'Dodawanie, odejmowanie, mnożenie i dzielenie ułamków', 
        href: '/szkola/podstawowa/ulamki-zwykle' 
      },
      { 
        title: 'Ułamki dziesiętne', 
        description: 'Działania na ułamkach dziesiętnych, zaokrąglanie', 
        href: '/szkola/podstawowa/ulamki-dziesietne' 
      },
      { 
        title: 'Procenty', 
        description: 'Obliczanie procentów, zadania tekstowe', 
        href: '/szkola/podstawowa/procenty' 
      },
      { 
        title: 'Równania', 
        description: 'Równania liniowe z jedną niewiadomą', 
        href: '/szkola/podstawowa/rownania' 
      },
      { 
        title: 'Geometria płaska', 
        description: 'Figury płaskie, obwody i pola', 
        href: '/szkola/podstawowa/geometria-plaska' 
      },
      { 
        title: 'Geometria przestrzenna', 
        description: 'Bryły, objętości i pola powierzchni', 
        href: '/szkola/podstawowa/geometria-przestrzenna' 
      },
      { 
        title: 'Funkcje', 
        description: 'Podstawowe funkcje, wykresy', 
        href: '/szkola/podstawowa/funkcje' 
      },
      { 
        title: 'Wyrażenia algebraiczne', 
        description: 'Przekształcanie wyrażeń, równania', 
        href: '/szkola/podstawowa/wyrazenia' 
      },
      { 
        title: 'Elementy statystyki', 
        description: 'Średnia, mediana, prawdopodobieństwo', 
        href: '/szkola/podstawowa/statystyka' 
      }
    ]
  },
  'Liceum podstawowy': {
    icon: BookOpen,
    color: 'bg-green-600',
    items: [
      { 
        title: 'Funkcje', 
        description: 'Funkcje liniowe, kwadratowe, wykładnicze', 
        href: '/szkola/liceum-podstawowy/funkcje' 
      },
      { 
        title: 'Równania i nierówności', 
        description: 'Różne typy równań i nierówności', 
        href: '/szkola/liceum-podstawowy/rownania' 
      },
      { 
        title: 'Ciągi', 
        description: 'Ciągi arytmetyczne i geometryczne', 
        href: '/szkola/liceum-podstawowy/ciagi' 
      },
      { 
        title: 'Trygonometria', 
        description: 'Podstawy trygonometrii, funkcje trygonometryczne', 
        href: '/szkola/liceum-podstawowy/trygonometria' 
      },
      { 
        title: 'Planimetria', 
        description: 'Geometria analityczna na płaszczyźnie', 
        href: '/szkola/liceum-podstawowy/planimetria' 
      },
      { 
        title: 'Stereometria', 
        description: 'Geometria w przestrzeni', 
        href: '/szkola/liceum-podstawowy/stereometria' 
      },
      { 
        title: 'Kombinatoryka', 
        description: 'Podstawy kombinatoryki i prawdopodobieństwa', 
        href: '/szkola/liceum-podstawowy/kombinatoryka' 
      },
      { 
        title: 'Prawdopodobieństwo', 
        description: 'Prawdopodobieństwo klasyczne i geometryczne', 
        href: '/szkola/liceum-podstawowy/prawdopodobienstwo' 
      },
      { 
        title: 'Statystyka', 
        description: 'Analiza danych, średnie, odchylenia', 
        href: '/szkola/liceum-podstawowy/statystyka' 
      }
    ]
  },
  'Liceum rozszerzony': {
    icon: Target,
    color: 'bg-purple-600',
    items: [
      { 
        title: 'Analiza matematyczna', 
        description: 'Granice, pochodne, całki', 
        href: '/szkola/liceum-rozszerzony/analiza' 
      },
      { 
        title: 'Funkcje zaawansowane', 
        description: 'Funkcje złożone, odwrotne, parametryczne', 
        href: '/szkola/liceum-rozszerzony/funkcje' 
      },
      { 
        title: 'Równania różniczkowe', 
        description: 'Podstawy równań różniczkowych', 
        href: '/szkola/liceum-rozszerzony/rownania-rozniczkowe' 
      },
      { 
        title: 'Geometria analityczna', 
        description: 'Zaawansowane zagadnienia geometrii', 
        href: '/szkola/liceum-rozszerzony/geometria' 
      },
      { 
        title: 'Rachunek prawdopodobieństwa', 
        description: 'Prawdopodobieństwo warunkowe, rozkłady', 
        href: '/szkola/liceum-rozszerzony/prawdopodobienstwo' 
      },
      { 
        title: 'Liczby zespolone', 
        description: 'Działania na liczbach zespolonych', 
        href: '/szkola/liceum-rozszerzony/liczby-zespolone' 
      },
      { 
        title: 'Wielomiany', 
        description: 'Zaawansowane zagadnienia wielomianów', 
        href: '/szkola/liceum-rozszerzony/wielomiany' 
      },
      { 
        title: 'Optymalizacja', 
        description: 'Zadania optymalizacyjne', 
        href: '/szkola/liceum-rozszerzony/optymalizacja' 
      }
    ]
  },
  'Studia': {
    icon: Award,
    color: 'bg-orange-600',
    items: [
      { 
        title: 'Analiza matematyczna', 
        description: 'Szeregi, funkcje wielu zmiennych, całki wielokrotne', 
        href: '/studia/analiza' 
      },
      { 
        title: 'Algebra liniowa', 
        description: 'Macierze, wektory, przestrzenie liniowe', 
        href: '/studia/algebra' 
      },
      { 
        title: 'Metody probabilistyczne', 
        description: 'Zaawansowane prawdopodobieństwo i statystyka', 
        href: '/studia/probabilistyka' 
      },
      { 
        title: 'Matematyka dyskretna', 
        description: 'Teoria grafów, kombinatoryka, logika', 
        href: '/studia/dyskretna' 
      },
      { 
        title: 'Równania różniczkowe', 
        description: 'Równania różniczkowe zwyczajne i cząstkowe', 
        href: '/studia/rownania-rozniczkowe' 
      },
      { 
        title: 'Analiza numeryczna', 
        description: 'Metody numeryczne, aproximacja', 
        href: '/studia/numeryczna' 
      },
      { 
        title: 'Optymalizacja', 
        description: 'Programowanie liniowe, metody optymalizacji', 
        href: '/studia/optymalizacja' 
      },
      { 
        title: 'Statystyka matematyczna', 
        description: 'Testy statystyczne, estymacja parametrów', 
        href: '/studia/statystyka' 
      }
    ]
  },
  'Matura podstawowa': {
    icon: Calendar,
    color: 'bg-green-700',
    items: [
      { 
        title: 'Matura 2025', 
        description: 'Materiały i zadania maturalne 2025', 
        href: '#',
        submenu: [
          { title: 'Sesja główna', description: 'Arkusze z sesji głównej maj 2025', href: '/matematyka/matura/podstawowa/2025/glowna' },
          { title: 'Sesja próbna', description: 'Arkusze próbne 2025', href: '/matematyka/matura/podstawowa/2025/probna' },
          { title: 'Sesja poprawkowa', description: 'Arkusze z sesji poprawkowej sierpień 2025', href: '/matematyka/matura/podstawowa/2025/poprawkowa' }
        ]
      },
      { 
        title: 'Matura 2024', 
        description: 'Arkusze i rozwiązania z 2024', 
        href: '#',
        submenu: [
          { title: 'Sesja główna', description: 'Arkusze z sesji głównej maj 2024', href: '/matematyka/matura/podstawowa/2024/glowna' },
          { title: 'Sesja próbna', description: 'Arkusze próbne 2024', href: '/matematyka/matura/podstawowa/2024/probna' },
          { title: 'Sesja poprawkowa', description: 'Arkusze z sesji poprawkowej sierpień 2024', href: '/matematyka/matura/podstawowa/2024/poprawkowa' }
        ]
      },
      { 
        title: 'Matura 2023', 
        description: 'Arkusze i rozwiązania z 2023', 
        href: '#',
        submenu: [
          { title: 'Sesja główna', description: 'Arkusze z sesji głównej maj 2023', href: '/matematyka/matura/podstawowa/2023/glowna' },
          { title: 'Sesja próbna', description: 'Arkusze próbne 2023', href: '/matematyka/matura/podstawowa/2023/probna' },
          { title: 'Sesja poprawkowa', description: 'Arkusze z sesji poprawkowej sierpień 2023', href: '/matematyka/matura/podstawowa/2023/poprawkowa' }
        ]
      },
      { 
        title: 'Matura 2022', 
        description: 'Arkusze i rozwiązania z 2022', 
        href: '#',
        submenu: [
          { title: 'Sesja główna', description: 'Arkusze z sesji głównej maj 2022', href: '/matematyka/matura/podstawowa/2022/glowna' },
          { title: 'Sesja próbna', description: 'Arkusze próbne 2022', href: '/matematyka/matura/podstawowa/2022/probna' },
          { title: 'Sesja poprawkowa', description: 'Arkusze z sesji poprawkowej sierpień 2022', href: '/matematyka/matura/podstawowa/2022/poprawkowa' }
        ]
      }
    ]
  },
  'Matura rozszerzona': {
    icon: Target,
    color: 'bg-red-700',
    items: [
      { 
        title: 'Matura 2025', 
        description: 'Materiały rozszerzone 2025', 
        href: '#',
        submenu: [
          { title: 'Sesja główna', description: 'Arkusze rozszerzone z sesji głównej maj 2025', href: '/matematyka/matura/rozszerzona/2025/glowna' },
          { title: 'Sesja próbna', description: 'Arkusze próbne poziom rozszerzony 2025', href: '/matematyka/matura/rozszerzona/2025/probna' },
          { title: 'Sesja poprawkowa', description: 'Arkusze rozszerzone z sesji poprawkowej sierpień 2025', href: '/matematyka/matura/rozszerzona/2025/poprawkowa' }
        ]
      },
      { 
        title: 'Matura 2024', 
        description: 'Arkusze rozszerzone z 2024', 
        href: '#',
        submenu: [
          { title: 'Sesja główna', description: 'Arkusze rozszerzone z sesji głównej maj 2024', href: '/matematyka/matura/rozszerzona/2024/glowna' },
          { title: 'Sesja próbna', description: 'Arkusze próbne poziom rozszerzony 2024', href: '/matematyka/matura/rozszerzona/2024/probna' },
          { title: 'Sesja poprawkowa', description: 'Arkusze rozszerzone z sesji poprawkowej sierpień 2024', href: '/matematyka/matura/rozszerzona/2024/poprawkowa' }
        ]
      },
      { 
        title: 'Matura 2023', 
        description: 'Arkusze rozszerzone z 2023', 
        href: '#',
        submenu: [
          { title: 'Sesja główna', description: 'Arkusze rozszerzone z sesji głównej maj 2023', href: '/matematyka/matura/rozszerzona/2023/glowna' },
          { title: 'Sesja próbna', description: 'Arkusze próbne poziom rozszerzony 2023', href: '/matematyka/matura/rozszerzona/2023/probna' },
          { title: 'Sesja poprawkowa', description: 'Arkusze rozszerzone z sesji poprawkowej sierpień 2023', href: '/matematyka/matura/rozszerzona/2023/poprawkowa' }
        ]
      },
      { 
        title: 'Matura 2022', 
        description: 'Arkusze rozszerzone z 2022', 
        href: '#',
        submenu: [
          { title: 'Sesja główna', description: 'Arkusze rozszerzone z sesji głównej maj 2022', href: '/matematyka/matura/rozszerzona/2022/glowna' },
          { title: 'Sesja próbna', description: 'Arkusze próbne poziom rozszerzony 2022', href: '/matematyka/matura/rozszerzona/2022/probna' },
          { title: 'Sesja poprawkowa', description: 'Arkusze rozszerzone z sesji poprawkowej sierpień 2022', href: '/matematyka/matura/rozszerzona/2022/poprawkowa' }
        ]
      }
    ]
  },
  'Egzamin 8 klasisty': {
    icon: BookOpen,
    color: 'bg-blue-700',
    items: [
      { 
        title: 'Egzamin 2025', 
        description: 'Zadania i rozwiązania z 2025', 
        href: '#',
        submenu: [
          { title: 'Egzamin główny', description: 'Oficjalny egzamin maj 2025', href: '/matematyka/egzamin-8/2025/glowny' },
          { title: 'Egzamin dodatkowy', description: 'Dodatkowy egzamin 2025', href: '/matematyka/egzamin-8/2025/dodatkowy' }
        ]
      },
      { 
        title: 'Egzamin 2024', 
        description: 'Zadania i rozwiązania z 2024', 
        href: '#',
        submenu: [
          { title: 'Egzamin główny', description: 'Oficjalny egzamin maj 2024', href: '/matematyka/egzamin-8/2024/glowny' },
          { title: 'Egzamin dodatkowy', description: 'Dodatkowy egzamin 2024', href: '/matematyka/egzamin-8/2024/dodatkowy' }
        ]
      },
      { 
        title: 'Egzamin 2023', 
        description: 'Zadania i rozwiązania z 2023', 
        href: '#',
        submenu: [
          { title: 'Egzamin główny', description: 'Oficjalny egzamin maj 2023', href: '/matematyka/egzamin-8/2023/glowny' },
          { title: 'Egzamin dodatkowy', description: 'Dodatkowy egzamin 2023', href: '/matematyka/egzamin-8/2023/dodatkowy' }
        ]
      },
      { 
        title: 'Egzamin 2022', 
        description: 'Zadania i rozwiązania z 2022', 
        href: '#',
        submenu: [
          { title: 'Egzamin główny', description: 'Oficjalny egzamin maj 2022', href: '/matematyka/egzamin-8/2022/glowny' },
          { title: 'Egzamin dodatkowy', description: 'Dodatkowy egzamin 2022', href: '/matematyka/egzamin-8/2022/dodatkowy' }
        ]
      }
    ]
  }
};

export default function MatematikaPage() {
  const [isSchoolMenuOpen, setIsSchoolMenuOpen] = useState(false);
  const [isMaturaMenuOpen, setIsMaturaMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentContent, setCurrentContent] = useState('Szkoła podstawowa');
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [lastAutoSwitch, setLastAutoSwitch] = useState<string>('');

  const toggleSchoolMenu = () => {
    setIsSchoolMenuOpen(!isSchoolMenuOpen);
  };

  const toggleMaturaMenu = () => {
    setIsMaturaMenuOpen(!isMaturaMenuOpen);
  };

  const toggleItem = useCallback((index: number) => {
    setOpenItems(prev => 
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  }, []);

  const handleContentChange = (content: string) => {
    setCurrentContent(content);
    setIsSchoolMenuOpen(false);
    setIsMaturaMenuOpen(false);
    setOpenItems([]);
    // Nie czyść searchQuery przy automatycznym przełączaniu
    if (!searchQuery || !lastAutoSwitch) {
      setSearchQuery('');
    }
  };

  // Inteligentne wykrywanie kategorii i automatyczne przełączanie
  const detectCategoryAndSwitch = useCallback((query: string) => {
    const lower = query.toLowerCase().trim();
    
    // Słowa kluczowe dla każdej kategorii
    const categoryKeywords = {
      'Matura podstawowa': ['matura', 'matur', 'matura podstawow', 'matura podstaw', 'matura podst'],
      'Matura rozszerzona': ['matura rozszerzon', 'rozszerzon', 'matura rozsz', 'rozsz', 'matura rozs'],
      'Egzamin 8 klasisty': ['egzamin', 'ósmoklas', '8 klas', 'ósmy', '8-klas', 'ósmoklasist', 'egzamin ósmoklas', 'egzamin 8', 'egzamin ósmy'],
      'Studia': ['studi', 'uniwers', 'wyższ', 'wyzs', 'uczel', 'uniwersytet', 'politechnik', 'akademi'],
      'Szkoła podstawowa': ['szkol podstaw', 'szkoła podstaw', 'podstawow', 'podstaw', 'szkol podst', 'szkoła podst', 'klasa', 'podstawówka', 'podst'],
      'Liceum podstawowy': ['liceum', 'lice', 'średni', 'sredn', 'liceum podstaw', 'lo podstaw', 'technikum podstaw'],
      'Liceum rozszerzony': ['liceum rozszerzon', 'liceum rozs', 'lo rozszerzon', 'lo rozs', 'rozszerzon', 'zaawansowan', 'technikum rozszerzon']
    };

    // Sprawdź czy query zawiera słowa kluczowe jakiejś kategorii
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => lower.includes(keyword))) {
        // Jeśli znaleziono kategorię różną od aktualnej - przełącz
        if (category !== currentContent) {
          console.log(`🔍 Auto-switching to: ${category} (detected from: "${query}")`);
          setLastAutoSwitch(`Automatycznie przełączono na "${category}"`);
          handleContentChange(category);
          return category;
        }
        break;
      }
    }

    return currentContent;
  }, [currentContent, handleContentChange]);

  // Filtrowanie treści w czasie rzeczywistym z inteligentnym przełączaniem
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) {
      // Brak zapytania - zwróć wszystkie elementy z aktualnej kategorii
      if (!mathTopicsData[currentContent]) {
        return [];
      }
      return mathTopicsData[currentContent].items;
    }

    // Wykryj kategorię i przełącz jeśli potrzeba
    const targetCategory = detectCategoryAndSwitch(searchQuery);
    
    if (!mathTopicsData[targetCategory]) {
      return [];
    }

    const items = mathTopicsData[targetCategory].items;
    const lower = searchQuery.toLowerCase();

    // Filtruj wyniki w docelowej kategorii
    return items.filter((item: MathTopic) => 
      item.title.toLowerCase().includes(lower) ||
      item.description.toLowerCase().includes(lower) ||
      (item.submenu && item.submenu.some(sub => 
        sub.title.toLowerCase().includes(lower) ||
        sub.description.toLowerCase().includes(lower)
      ))
    );
  }, [currentContent, searchQuery, detectCategoryAndSwitch]);

  const currentTopic = mathTopicsData[currentContent as keyof typeof mathTopicsData];

  // Dzielimy na dwie kolumny jak w FAQ
  const leftColumnItems = filteredItems.filter((_, index) => index % 2 === 0);
  const rightColumnItems = filteredItems.filter((_, index) => index % 2 === 1);

  // Handle item click
  const handleItemClick = (item: MathTopic, index: number) => {
    if (item.submenu && item.submenu.length > 0) {
      // Ma submenu - toggle rozwijanie
      toggleItem(index);
    } else if (item.href && item.href !== '#') {
      // Przekierowanie
      window.location.href = item.href;
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      {/* Header z powrotem i Navigation - Sticky */}
      <header className="sticky top-0 z-50 border-b border-[#30363d] bg-[#161b22] shadow-lg">
        <div className="container mx-auto px-4 py-4">
          {/* Powrót do strony głównej */}
          <div className="mb-4">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-[#58a6ff] hover:text-[#1f6feb] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Powrót do strony głównej
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="bg-[#0d1117] rounded-2xl p-4 border border-[#30363d]">
            <div className="flex flex-wrap justify-center gap-3">
              {/* Szkoła - Dropdown Menu */}
              <div className="relative">
                <button
                  onClick={toggleSchoolMenu}
                  className="inline-flex items-center gap-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] px-4 py-2 rounded-lg transition-colors font-medium text-sm"
                >
                  Szkoła
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isSchoolMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isSchoolMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-[#21262d] border border-[#30363d] rounded-lg shadow-xl z-50 min-w-[250px]">
                    <div className="p-2">
                      <button
                        onClick={() => handleContentChange('Szkoła podstawowa')}
                        className="block w-full text-left px-4 py-2 hover:bg-[#30363d] rounded-md transition-colors text-sm"
                      >
                        Szkoła podstawowa
                      </button>
                      <button
                        onClick={() => handleContentChange('Liceum podstawowy')}
                        className="block w-full text-left px-4 py-2 hover:bg-[#30363d] rounded-md transition-colors text-sm"
                      >
                        Liceum podstawowy
                      </button>
                      <button
                        onClick={() => handleContentChange('Liceum rozszerzony')}
                        className="block w-full text-left px-4 py-2 hover:bg-[#30363d] rounded-md transition-colors text-sm"
                      >
                        Liceum rozszerzony
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Studia */}
              <button
                onClick={() => handleContentChange('Studia')}
                className="inline-flex items-center gap-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] px-4 py-2 rounded-lg transition-colors font-medium text-sm"
              >
                Studia
              </button>

              {/* Matura - Dropdown Menu */}
              <div className="relative">
                <button
                  onClick={toggleMaturaMenu}
                  className="inline-flex items-center gap-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] px-4 py-2 rounded-lg transition-colors font-medium text-sm"
                >
                  Matura
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isMaturaMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isMaturaMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-[#21262d] border border-[#30363d] rounded-lg shadow-xl z-50 min-w-[200px]">
                    <div className="p-2">
                      <button
                        onClick={() => handleContentChange('Matura podstawowa')}
                        className="block w-full text-left px-4 py-2 hover:bg-[#30363d] rounded-md transition-colors text-sm"
                      >
                        Podstawowa
                      </button>
                      <button
                        onClick={() => handleContentChange('Matura rozszerzona')}
                        className="block w-full text-left px-4 py-2 hover:bg-[#30363d] rounded-md transition-colors text-sm"
                      >
                        Rozszerzona
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Egzamin 8 klasisty */}
              <button
                onClick={() => handleContentChange('Egzamin 8 klasisty')}
                className="inline-flex items-center gap-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] px-4 py-2 rounded-lg transition-colors font-medium text-sm"
              >
                Egzamin 8-klasisty
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#1f6feb] to-[#58a6ff] rounded-full mb-6">
              <Calculator className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-[#58a6ff] via-[#1f6feb] to-[#0969da] bg-clip-text text-transparent">
              Korepetycje z Matematyki
            </h1>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Profesjonalne korepetycje z matematyki dostosowane do Twoich potrzeb
            </p>
          </div>



          {/* Main Content Area */}
          <div className="text-center">
            {currentTopic ? (
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
                    {currentContent.includes('Szkoła') || currentContent.includes('Studia') ? 
                      'Wybierz temat, z którym potrzebujesz pomocy' : 
                      'Wybierz rok i sesję egzaminacyjną'
                    }
                  </p>
                </div>

                {/* Wyszukiwarka */}
                <div className="max-w-2xl mx-auto mb-8">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Szukaj"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        // Wyczyść informację o automatycznym przełączeniu przy nowym wyszukiwaniu
                        if (e.target.value !== searchQuery) {
                          setLastAutoSwitch('');
                        }
                      }}
                      className="w-full pl-12 pr-4 py-3 bg-[#21262d] border border-[#30363d] rounded-xl text-white placeholder-gray-400 focus:border-[#58a6ff] focus:outline-none transition-colors duration-300"
                    />
                  </div>
                  
                  {searchQuery && (
                    <div className="text-center text-sm mt-2 space-y-1">
                      <div className="text-gray-400">
                        Znaleziono {filteredItems.length} {filteredItems.length === 1 ? 'wynik' : 'wyników'} 
                      </div>
                      {lastAutoSwitch && (
                        <div className="text-[#58a6ff] font-medium">
                          ✨ {lastAutoSwitch}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Treści */}
                {filteredItems.length > 0 ? (
                  <>
                    {/* Mobile: Single column */}
                    <div className="lg:hidden max-w-5xl mx-auto space-y-6">
                      {filteredItems.map((item: MathTopic, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          className="bg-[#21262d] border border-[#30363d] rounded-xl overflow-hidden hover:border-[#58a6ff]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#58a6ff]/10"
                        >
                          <button
                            onClick={() => handleItemClick(item, index)}
                            className="w-full px-6 py-6 text-left group focus:outline-none cursor-pointer"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-lg font-semibold text-white group-hover:text-[#58a6ff] transition-colors">
                                {item.title}
                              </h3>
                              
                              {item.submenu && (
                                <motion.div
                                  animate={{ rotate: openItems.includes(index) ? 180 : 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="flex-shrink-0"
                                >
                                  <ChevronDown className="w-5 h-5 text-[#58a6ff]" />
                                </motion.div>
                              )}
                            </div>
                            
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                              {item.description}
                            </p>
                            
                            <div className="flex items-center gap-2 text-[#58a6ff] text-sm font-semibold group-hover:gap-3 transition-all duration-300">
                              <span>
                                {item.submenu ? 'Rozwiń opcje' : 
                                 (currentContent.includes('Szkoła') || currentContent.includes('Studia') ? 
                                  'Przejdź do materiałów' : 'Rozwiń sesje')}
                              </span>
                              <ArrowLeft className="w-4 h-4 rotate-180" />
                            </div>
                          </button>

                          {/* Submenu */}
                          <AnimatePresence>
                            {item.submenu && openItems.includes(index) && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden"
                              >
                                <div className="border-t border-[#30363d]">
                                  <motion.div
                                    initial={{ y: -10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                    className="p-4 space-y-3"
                                  >
                                    {item.submenu.map((subItem: MathTopic, subIndex: number) => (
                                      <div
                                        key={subIndex}
                                        className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 hover:border-[#58a6ff]/30 transition-all duration-300 cursor-pointer group"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (subItem.href && subItem.href !== '#') {
                                            window.location.href = subItem.href;
                                          }
                                        }}
                                      >
                                        <div className="text-left">
                                          <h4 className="text-md font-medium text-white mb-2 group-hover:text-[#58a6ff] transition-colors">
                                            {subItem.title}
                                          </h4>
                                          <p className="text-gray-400 text-sm leading-relaxed mb-2">
                                            {subItem.description}
                                          </p>
                                          <div className="flex items-center gap-2 text-[#58a6ff] text-xs font-medium">
                                            <span>Przejdź do zadań</span>
                                            <ArrowLeft className="w-3 h-3 rotate-180" />
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </motion.div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </div>

                    {/* Desktop: Two columns */}
                    <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8 max-w-7xl mx-auto">
                      {/* Left Column */}
                      <div className="space-y-6">
                        {leftColumnItems.map((item) => {
                          const originalIndex = filteredItems.findIndex(mathItem => mathItem === item);
                          return (
                            <motion.div
                              key={originalIndex}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, delay: originalIndex * 0.1 }}
                              className="bg-[#21262d] border border-[#30363d] rounded-xl overflow-hidden hover:border-[#58a6ff]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#58a6ff]/10"
                            >
                              <button
                                onClick={() => handleItemClick(item, originalIndex)}
                                className="w-full px-6 py-6 text-left group focus:outline-none cursor-pointer"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <h3 className="text-lg font-semibold text-white group-hover:text-[#58a6ff] transition-colors">
                                    {item.title}
                                  </h3>
                                  
                                  {item.submenu && (
                                    <motion.div
                                      animate={{ rotate: openItems.includes(originalIndex) ? 180 : 0 }}
                                      transition={{ duration: 0.3 }}
                                      className="flex-shrink-0"
                                    >
                                      <ChevronDown className="w-5 h-5 text-[#58a6ff]" />
                                    </motion.div>
                                  )}
                                </div>
                                
                                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                  {item.description}
                                </p>
                                
                                <div className="flex items-center gap-2 text-[#58a6ff] text-sm font-semibold group-hover:gap-3 transition-all duration-300">
                                  <span>
                                    {item.submenu ? 'Rozwiń opcje' : 
                                     (currentContent.includes('Szkoła') || currentContent.includes('Studia') ? 
                                      'Przejdź do materiałów' : 'Rozwiń sesje')}
                                  </span>
                                  <ArrowLeft className="w-4 h-4 rotate-180" />
                                </div>
                              </button>

                              {/* Submenu */}
                              <AnimatePresence>
                                {item.submenu && openItems.includes(originalIndex) && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                  >
                                    <div className="border-t border-[#30363d]">
                                      <motion.div
                                        initial={{ y: -10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.3, delay: 0.1 }}
                                        className="p-4 space-y-3"
                                      >
                                        {item.submenu.map((subItem: MathTopic, subIndex: number) => (
                                          <div
                                            key={subIndex}
                                            className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 hover:border-[#58a6ff]/30 transition-all duration-300 cursor-pointer group"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              if (subItem.href && subItem.href !== '#') {
                                                window.location.href = subItem.href;
                                              }
                                            }}
                                          >
                                            <div className="text-left">
                                              <h4 className="text-md font-medium text-white mb-2 group-hover:text-[#58a6ff] transition-colors">
                                                {subItem.title}
                                              </h4>
                                              <p className="text-gray-400 text-sm leading-relaxed mb-2">
                                                {subItem.description}
                                              </p>
                                              <div className="flex items-center gap-2 text-[#58a6ff] text-xs font-medium">
                                                <span>Przejdź do zadań</span>
                                                <ArrowLeft className="w-3 h-3 rotate-180" />
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </motion.div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Right Column */}
                      <div className="space-y-6">
                        {rightColumnItems.map((item) => {
                          const originalIndex = filteredItems.findIndex(mathItem => mathItem === item);
                          return (
                            <motion.div
                              key={originalIndex}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, delay: originalIndex * 0.1 }}
                              className="bg-[#21262d] border border-[#30363d] rounded-xl overflow-hidden hover:border-[#58a6ff]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#58a6ff]/10"
                            >
                              <button
                                onClick={() => handleItemClick(item, originalIndex)}
                                className="w-full px-6 py-6 text-left group focus:outline-none cursor-pointer"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <h3 className="text-lg font-semibold text-white group-hover:text-[#58a6ff] transition-colors">
                                    {item.title}
                                  </h3>
                                  
                                  {item.submenu && (
                                    <motion.div
                                      animate={{ rotate: openItems.includes(originalIndex) ? 180 : 0 }}
                                      transition={{ duration: 0.3 }}
                                      className="flex-shrink-0"
                                    >
                                      <ChevronDown className="w-5 h-5 text-[#58a6ff]" />
                                    </motion.div>
                                  )}
                                </div>
                                
                                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                  {item.description}
                                </p>
                                
                                <div className="flex items-center gap-2 text-[#58a6ff] text-sm font-semibold group-hover:gap-3 transition-all duration-300">
                                  <span>
                                    {item.submenu ? 'Rozwiń opcje' : 
                                     (currentContent.includes('Szkoła') || currentContent.includes('Studia') ? 
                                      'Przejdź do materiałów' : 'Rozwiń sesje')}
                                  </span>
                                  <ArrowLeft className="w-4 h-4 rotate-180" />
                                </div>
                              </button>

                              {/* Submenu */}
                              <AnimatePresence>
                                {item.submenu && openItems.includes(originalIndex) && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                  >
                                    <div className="border-t border-[#30363d]">
                                      <motion.div
                                        initial={{ y: -10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.3, delay: 0.1 }}
                                        className="p-4 space-y-3"
                                      >
                                        {item.submenu.map((subItem: MathTopic, subIndex: number) => (
                                          <div
                                            key={subIndex}
                                            className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 hover:border-[#58a6ff]/30 transition-all duration-300 cursor-pointer group"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              if (subItem.href && subItem.href !== '#') {
                                                window.location.href = subItem.href;
                                              }
                                            }}
                                          >
                                            <div className="text-left">
                                              <h4 className="text-md font-medium text-white mb-2 group-hover:text-[#58a6ff] transition-colors">
                                                {subItem.title}
                                              </h4>
                                              <p className="text-gray-400 text-sm leading-relaxed mb-2">
                                                {subItem.description}
                                              </p>
                                              <div className="flex items-center gap-2 text-[#58a6ff] text-xs font-medium">
                                                <span>Przejdź do zadań</span>
                                                <ArrowLeft className="w-3 h-3 rotate-180" />
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </motion.div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </>) : searchQuery ? (
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
            © 2024 Patryk Kulesza - Korepetycje z Matematyki. Wszystkie prawa zastrzeżone.
          </p>
        </div>
      </footer>
    </div>
  );
}