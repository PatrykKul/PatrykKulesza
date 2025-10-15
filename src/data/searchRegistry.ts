// searchRegistry.ts - System rejestracji wszystkich fraz/ścieżek dla globalnej wyszukiwarki
// ŁATWO ROZSZERZALNY - dodaj nowe frazy, sekcje, materiały bez modyfikacji logiki

export interface SearchItem {
  id: string;
  title: string; // Co pokazać w wynikach
  description?: string; // Opcjonalny opis
  keywords: string[]; // Frazy do wyszukiwania (lowercase)
  path?: string; // Ścieżka do przekierowania (jeśli null, to akcja specjalna)
  category: 'navigation' | 'materials' | 'ai' | 'services' | 'contact' | 'other';
  icon?: string; // Opcjonalna ikona (emoji lub lucide icon name)
  action?: 'open-ai' | 'navigate' | 'scroll-to'; // Specjalna akcja
  priority?: number; // Priorytet w wynikach (wyższy = ważniejszy)
}

// ==========================================
// NAVIGATION - Główne sekcje strony
// ==========================================
const navigationItems: SearchItem[] = [
  {
    id: 'nav-home',
    title: 'Strona główna',
    keywords: ['strona', 'glowna', 'home', 'start', 'poczatek'],
    path: '/',
    category: 'navigation',
    icon: '🏠',
    priority: 10
  },
  {
    id: 'nav-services',
    title: 'Usługi',
    keywords: ['uslugi', 'services', 'oferta', 'co oferuje', 'korepetycje'],
    path: '/#services',
    category: 'navigation',
    icon: '📚',
    priority: 9
  },
  {
    id: 'nav-contact',
    title: 'Kontakt',
    keywords: ['kontakt', 'contact', 'napisz', 'email', 'telefon'],
    path: '/#contact',
    category: 'navigation',
    icon: '📧',
    priority: 9
  },
  {
    id: 'nav-about',
    title: 'O mnie',
    keywords: ['o mnie', 'about', 'kim jestem', 'patryk', 'kulesza'],
    path: '/#about',
    category: 'navigation',
    icon: '👨‍🏫',
    priority: 8
  },
  {
    id: 'nav-testimonials',
    title: 'Opinie',
    keywords: ['opinie', 'testimonials', 'recenzje', 'co mowia', 'studenci'],
    path: '/#testimonials',
    category: 'navigation',
    icon: '⭐',
    priority: 7
  }
];

// ==========================================
// AI ASSISTANT - KORKUŚ zawsze na górze
// ==========================================
const aiItems: SearchItem[] = [
  {
    id: 'ai-korkus',
    title: '🤖 Asystent AI - KORKUŚ',
    description: 'Zadaj pytanie AI, umów korepetycje',
    keywords: ['ai', 'asystent', 'korkus', 'chatbot', 'bot', 'pytanie', 'pomoc', 'zapytaj'],
    path: undefined,
    category: 'ai',
    icon: '🤖',
    action: 'open-ai',
    priority: 100 // NAJWYŻSZY priorytet
  }
];

// ==========================================
// MATERIALS - Matematyka
// ==========================================
const mathMaterialsItems: SearchItem[] = [
  // Szkoła podstawowa
  {
    id: 'math-liczby-naturalne',
    title: 'Liczby naturalne',
    description: 'Działania, własności',
    keywords: ['liczby naturalne', 'dzialania', 'wlasnosci', 'podstawowa', 'liczby', 'naturalne'],
    path: '/matematyka#szkola-podstawowa',
    category: 'materials',
    icon: '🔢',
    priority: 5
  },
  {
    id: 'math-ulamki-zwykle',
    title: 'Ułamki zwykłe',
    description: 'Dodawanie, odejmowanie, mnożenie',
    keywords: ['ulamki', 'zwykle', 'ulamek', 'dzialania na ulamkach', 'podstawowa', 'ulamki zwykle'],
    path: '/matematyka#szkola-podstawowa',
    category: 'materials',
    icon: '➗',
    priority: 5
  },
  {
    id: 'math-ulamki-dziesietne',
    title: 'Ułamki dziesiętne',
    description: 'Zaokrąglanie, działania',
    keywords: ['ulamki dziesietne', 'przecinek', 'zaokraglanie', 'podstawowa', 'dziesietne'],
    path: '/matematyka#szkola-podstawowa',
    category: 'materials',
    icon: '🔟',
    priority: 5
  },
  {
    id: 'math-procenty',
    title: 'Procenty',
    description: 'Obliczanie procentów',
    keywords: ['procenty', 'procent', 'obliczanie', 'podstawowa', '%'],
    path: '/matematyka#szkola-podstawowa',
    category: 'materials',
    icon: '%',
    priority: 5
  },
  {
    id: 'math-rownania',
    title: 'Równania',
    description: 'Równania liniowe',
    keywords: ['rownania', 'liniowe', 'niewiadoma', 'podstawowa', 'równania', 'rownanie'],
    path: '/matematyka#szkola-podstawowa',
    category: 'materials',
    icon: '🔤',
    priority: 5
  },
  {
    id: 'math-geometria-plaska',
    title: 'Geometria płaska',
    description: 'Figury, obwody, pola',
    keywords: ['geometria', 'plaska', 'figury', 'obwod', 'pole', 'podstawowa', 'płaska'],
    path: '/matematyka#szkola-podstawowa',
    category: 'materials',
    icon: '📐',
    priority: 5
  },
  {
    id: 'math-geometria-przestrzenna',
    title: 'Geometria przestrzenna',
    description: 'Bryły, objętości',
    keywords: ['geometria', 'przestrzenna', 'bryły', 'bryly', 'objetosc', 'objętość', 'podstawowa'],
    path: '/matematyka#szkola-podstawowa',
    category: 'materials',
    icon: '📦',
    priority: 5
  },
  {
    id: 'math-wyrazenia',
    title: 'Wyrażenia algebraiczne',
    description: 'Przekształcanie wyrażeń',
    keywords: ['wyrazenia', 'algebraiczne', 'wyrażenia', 'algebra', 'podstawowa'],
    path: '/matematyka#szkola-podstawowa',
    category: 'materials',
    icon: '🔠',
    priority: 5
  },
  {
    id: 'math-statystyka-podstawowa',
    title: 'Statystyka',
    description: 'Średnia, mediana, prawdopodobieństwo',
    keywords: ['statystyka', 'srednia', 'średnia', 'mediana', 'podstawowa', 'prawdopodobienstwo'],
    path: '/matematyka#szkola-podstawowa',
    category: 'materials',
    icon: '�',
    priority: 5
  },

  // Liceum podstawowy
  {
    id: 'math-liceum-funkcje',
    title: 'Funkcje (liceum)',
    description: 'Funkcje liniowe, kwadratowe',
    keywords: ['funkcje', 'liniowe', 'kwadratowe', 'wykladnicze', 'liceum', 'podstawowy', 'funkcja'],
    path: '/matematyka#liceum-podstawowy',
    category: 'materials',
    icon: '📈',
    priority: 6
  },
  {
    id: 'math-liceum-ciagi',
    title: 'Ciągi',
    description: 'Arytmetyczne, geometryczne',
    keywords: ['ciagi', 'arytmetyczny', 'geometryczny', 'liceum', 'podstawowy', 'ciąg', 'ciągi'],
    path: '/matematyka#liceum-podstawowy',
    category: 'materials',
    icon: '🔢',
    priority: 6
  },
  {
    id: 'math-liceum-trygonometria',
    title: 'Trygonometria',
    description: 'Funkcje trygonometryczne',
    keywords: ['trygonometria', 'sinus', 'cosinus', 'tangens', 'liceum', 'podstawowy', 'sin', 'cos', 'tg'],
    path: '/matematyka#liceum-podstawowy',
    category: 'materials',
    icon: '📊',
    priority: 6
  },
  {
    id: 'math-liceum-planimetria',
    title: 'Planimetria',
    description: 'Geometria analityczna na płaszczyźnie',
    keywords: ['planimetria', 'geometria', 'analityczna', 'płaszczyzna', 'liceum', 'podstawowy'],
    path: '/matematyka#liceum-podstawowy',
    category: 'materials',
    icon: '📐',
    priority: 6
  },
  {
    id: 'math-liceum-kombinatoryka',
    title: 'Kombinatoryka',
    description: 'Permutacje, kombinacje',
    keywords: ['kombinatoryka', 'permutacje', 'kombinacje', 'silnia', 'liceum', 'podstawowy'],
    path: '/matematyka#liceum-podstawowy',
    category: 'materials',
    icon: '🎲',
    priority: 6
  },

  // Liceum rozszerzony
  {
    id: 'math-liceum-rozs-analiza',
    title: 'Analiza matematyczna',
    description: 'Granice, pochodne, całki',
    keywords: ['analiza', 'granice', 'pochodne', 'calki', 'całki', 'liceum', 'rozszerzony'],
    path: '/matematyka#liceum-rozszerzony',
    category: 'materials',
    icon: '∫',
    priority: 7
  },
  {
    id: 'math-liceum-rozs-liczby-zespolone',
    title: 'Liczby zespolone',
    description: 'Działania na liczbach zespolonych',
    keywords: ['liczby zespolone', 'zespolone', 'urojone', 'moduł', 'liceum', 'rozszerzony'],
    path: '/matematyka#liceum-rozszerzony',
    category: 'materials',
    icon: 'ℂ',
    priority: 7
  },
  {
    id: 'math-liceum-rozs-wielomiany',
    title: 'Wielomiany',
    description: 'Zaawansowane zagadnienia wielomianów',
    keywords: ['wielomiany', 'wielomian', 'pierwiastki', 'rozklad', 'liceum', 'rozszerzony'],
    path: '/matematyka#liceum-rozszerzony',
    category: 'materials',
    icon: '�',
    priority: 7
  },

  // Studia
  {
    id: 'math-studia-algebra',
    title: 'Algebra liniowa',
    description: 'Macierze, wektory, przestrzenie',
    keywords: ['algebra', 'liniowa', 'macierze', 'wektory', 'studia', 'macierz', 'wektor'],
    path: '/matematyka#studia',
    category: 'materials',
    icon: '🔢',
    priority: 6
  },
  {
    id: 'math-studia-analiza',
    title: 'Analiza matematyczna (studia)',
    description: 'Szeregi, funkcje wielu zmiennych',
    keywords: ['analiza', 'szeregi', 'funkcje wielu zmiennych', 'studia', 'calki wielokrotne'],
    path: '/matematyka#studia',
    category: 'materials',
    icon: '∫',
    priority: 6
  },

  // ==========================================
  // MATURA PODSTAWOWA - WSZYSTKIE LATA
  // ==========================================
  {
    id: 'matura-podstawowa-main',
    title: 'Matura podstawowa',
    description: 'Wszystkie arkusze podstawowe',
    keywords: ['matura', 'podstawowa', 'arkusze', 'egzamin', 'podstaw', 'podst'],
    path: '/matematyka#matura-podstawowa',
    category: 'materials',
    icon: '📝',
    priority: 8
  },
  // 2025
  {
    id: 'matura-podst-2025-glowna',
    title: 'Matura podstawowa 2025 - Główna',
    description: 'Sesja główna maj 2025',
    keywords: ['matura', 'podstawowa', '2025', 'glowna', 'główna', 'maj', 'arkusz'],
    path: '/matematyka/matura/podstawowa/2025/glowna',
    category: 'materials',
    icon: '📝',
    priority: 9
  },
  // 2024
  {
    id: 'matura-podst-2024-glowna',
    title: 'Matura podstawowa 2024 - Główna',
    description: 'Sesja główna maj 2024',
    keywords: ['matura', 'podstawowa', '2024', 'glowna', 'główna', 'maj', 'arkusz'],
    path: '/matematyka/matura/podstawowa/2024/glowna',
    category: 'materials',
    icon: '📝',
    priority: 9
  },
  // 2023
  {
    id: 'matura-podst-2023-glowna',
    title: 'Matura podstawowa 2023 - Główna',
    description: 'Sesja główna maj 2023',
    keywords: ['matura', 'podstawowa', '2023', 'glowna', 'główna', 'maj', 'arkusz'],
    path: '/matematyka/matura/podstawowa/2023/glowna',
    category: 'materials',
    icon: '📝',
    priority: 9
  },
  // 2022
  {
    id: 'matura-podst-2022-glowna',
    title: 'Matura podstawowa 2022 - Główna',
    description: 'Sesja główna maj 2022',
    keywords: ['matura', 'podstawowa', '2022', 'glowna', 'główna', 'maj', 'arkusz'],
    path: '/matematyka/matura/podstawowa/2022/glowna',
    category: 'materials',
    icon: '📝',
    priority: 9
  },

  // ==========================================
  // MATURA ROZSZERZONA - WSZYSTKIE LATA
  // ==========================================
  {
    id: 'matura-rozszerzona-main',
    title: 'Matura rozszerzona',
    description: 'Wszystkie arkusze rozszerzone',
    keywords: ['matura', 'rozszerzona', 'arkusze', 'egzamin', 'rozsz', 'rozs', 'rozszerz'],
    path: '/matematyka#matura-rozszerzona',
    category: 'materials',
    icon: '🎓',
    priority: 8
  },
  // 2025
  {
    id: 'matura-rozs-2025-glowna',
    title: 'Matura rozszerzona 2025 - Główna',
    description: 'Sesja główna maj 2025',
    keywords: ['matura', 'rozszerzona', '2025', 'glowna', 'główna', 'maj', 'arkusz', 'rozsz'],
    path: '/matematyka/matura/rozszerzona/2025/glowna',
    category: 'materials',
    icon: '🎓',
    priority: 9
  },
  // 2024
  {
    id: 'matura-rozs-2024-glowna',
    title: 'Matura rozszerzona 2024 - Główna',
    description: 'Sesja główna maj 2024',
    keywords: ['matura', 'rozszerzona', '2024', 'glowna', 'główna', 'maj', 'arkusz', 'rozsz'],
    path: '/matematyka/matura/rozszerzona/2024/glowna',
    category: 'materials',
    icon: '🎓',
    priority: 9
  },
  // 2023
  {
    id: 'matura-rozs-2023-glowna',
    title: 'Matura rozszerzona 2023 - Główna',
    description: 'Sesja główna maj 2023',
    keywords: ['matura', 'rozszerzona', '2023', 'glowna', 'główna', 'maj', 'arkusz', 'rozsz'],
    path: '/matematyka/matura/rozszerzona/2023/glowna',
    category: 'materials',
    icon: '🎓',
    priority: 9
  },
  // 2022
  {
    id: 'matura-rozs-2022-glowna',
    title: 'Matura rozszerzona 2022 - Główna',
    description: 'Sesja główna maj 2022',
    keywords: ['matura', 'rozszerzona', '2022', 'glowna', 'główna', 'maj', 'arkusz', 'rozsz'],
    path: '/matematyka/matura/rozszerzona/2022/glowna',
    category: 'materials',
    icon: '🎓',
    priority: 9
  },

  // ==========================================
  // EGZAMIN ÓSMOKLASISTY - WSZYSTKIE LATA
  // ==========================================
  {
    id: 'egzamin-8-main',
    title: 'Egzamin 8-klasisty',
    description: 'Wszystkie arkusze egzaminacyjne',
    keywords: ['egzamin', 'osmoklasista', '8 klasisty', 'osmy', 'arkusze', '8', 'ósmok klasista', 'ósmoklasista'],
    path: '/matematyka#egzamin-8',
    category: 'materials',
    icon: '📋',
    priority: 8
  },
  // 2025
  {
    id: 'egzamin-8-2025-glowny',
    title: 'Egzamin 8-klasisty 2025 - Główny',
    description: 'Oficjalny egzamin maj 2025',
    keywords: ['egzamin', '8', 'osmy', '2025', 'glowny', 'główny', 'maj', 'ósmoklasista'],
    path: '/matematyka/egzamin-8/2025/glowny',
    category: 'materials',
    icon: '📋',
    priority: 9
  },
  {
    id: 'egzamin-8-2025-dodatkowy',
    title: 'Egzamin 8-klasisty 2025 - Dodatkowy',
    description: 'Dodatkowy egzamin 2025',
    keywords: ['egzamin', '8', 'osmy', '2025', 'dodatkowy', 'ósmoklasista'],
    path: '/matematyka/egzamin-8/2025/dodatkowy',
    category: 'materials',
    icon: '📋',
    priority: 9
  },
  // 2024
  {
    id: 'egzamin-8-2024-glowny',
    title: 'Egzamin 8-klasisty 2024 - Główny',
    description: 'Oficjalny egzamin maj 2024',
    keywords: ['egzamin', '8', 'osmy', '2024', 'glowny', 'główny', 'maj', 'ósmoklasista'],
    path: '/matematyka/egzamin-8/2024/glowny',
    category: 'materials',
    icon: '📋',
    priority: 9
  },
  {
    id: 'egzamin-8-2024-dodatkowy',
    title: 'Egzamin 8-klasisty 2024 - Dodatkowy',
    description: 'Dodatkowy egzamin 2024',
    keywords: ['egzamin', '8', 'osmy', '2024', 'dodatkowy', 'ósmoklasista'],
    path: '/matematyka/egzamin-8/2024/dodatkowy',
    category: 'materials',
    icon: '📋',
    priority: 9
  },
  // 2023
  {
    id: 'egzamin-8-2023-glowny',
    title: 'Egzamin 8-klasisty 2023 - Główny',
    description: 'Oficjalny egzamin maj 2023',
    keywords: ['egzamin', '8', 'osmy', '2023', 'glowny', 'główny', 'maj', 'ósmoklasista'],
    path: '/matematyka/egzamin-8/2023/glowny',
    category: 'materials',
    icon: '📋',
    priority: 9
  },
  {
    id: 'egzamin-8-2023-dodatkowy',
    title: 'Egzamin 8-klasisty 2023 - Dodatkowy',
    description: 'Dodatkowy egzamin 2023',
    keywords: ['egzamin', '8', 'osmy', '2023', 'dodatkowy', 'ósmoklasista'],
    path: '/matematyka/egzamin-8/2023/dodatkowy',
    category: 'materials',
    icon: '📋',
    priority: 9
  },
  // 2022
  {
    id: 'egzamin-8-2022-glowny',
    title: 'Egzamin 8-klasisty 2022 - Główny',
    description: 'Oficjalny egzamin maj 2022',
    keywords: ['egzamin', '8', 'osmy', '2022', 'glowny', 'główny', 'maj', 'ósmoklasista'],
    path: '/matematyka/egzamin-8/2022/glowny',
    category: 'materials',
    icon: '📋',
    priority: 9
  },
  {
    id: 'egzamin-8-2022-dodatkowy',
    title: 'Egzamin 8-klasisty 2022 - Dodatkowy',
    description: 'Dodatkowy egzamin 2022',
    keywords: ['egzamin', '8', 'osmy', '2022', 'dodatkowy', 'ósmoklasista'],
    path: '/matematyka/egzamin-8/2022/dodatkowy',
    category: 'materials',
    icon: '📋',
    priority: 9
  },

  // ==========================================
  // OGÓLNE - MATERIAŁY
  // ==========================================
  {
    id: 'materialy-general',
    title: 'Materiały edukacyjne',
    description: 'Zobacz wszystkie dostępne materiały',
    keywords: ['materialy', 'materiały', 'edukacyjne', 'nauka', 'pomoce', 'teoria'],
    path: '/matematyka',
    category: 'materials',
    icon: '📚',
    priority: 7
  }
];

// ==========================================
// SERVICES - Przedmioty
// ==========================================
const servicesItems: SearchItem[] = [
  {
    id: 'service-math',
    title: 'Matematyka',
    description: 'Korepetycje z matematyki',
    keywords: ['matematyka', 'mat', 'math', 'liczby', 'zadania'],
    path: '/matematyka',
    category: 'services',
    icon: '🧮',
    priority: 9
  },
  {
    id: 'service-english',
    title: 'Angielski',
    description: 'Korepetycje z angielskiego',
    keywords: ['angielski', 'english', 'jezyk', 'konwersacje'],
    path: '/angielski',
    category: 'services',
    icon: '🇬🇧',
    priority: 9
  },
  {
    id: 'service-programming',
    title: 'Programowanie',
    description: 'Korepetycje z programowania',
    keywords: ['programowanie', 'programming', 'python', 'web', 'ai', 'kod'],
    path: '/programowanie',
    category: 'services',
    icon: '💻',
    priority: 9
  }
];

// ==========================================
// EXPORT - Wszystkie items razem
// ==========================================
export const ALL_SEARCH_ITEMS: SearchItem[] = [
  ...aiItems,        // AI zawsze na górze (priority 100)
  ...navigationItems,
  ...servicesItems,
  ...mathMaterialsItems
];

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Wyszukaj items po query (case-insensitive, fuzzy matching)
 */
export function searchItems(query: string, maxResults: number = 10): SearchItem[] {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase().trim();
  
  // Filtruj items które pasują do query
  const matches = ALL_SEARCH_ITEMS.filter(item => {
    // Sprawdź czy query występuje w title
    if (item.title.toLowerCase().includes(lowerQuery)) return true;
    
    // Sprawdź czy query występuje w keywords
    return item.keywords.some(keyword => keyword.includes(lowerQuery));
  });

  // Sortuj po priority (descending)
  matches.sort((a, b) => (b.priority || 0) - (a.priority || 0));

  return matches.slice(0, maxResults);
}

/**
 * Pobierz item po ID
 */
export function getItemById(id: string): SearchItem | undefined {
  return ALL_SEARCH_ITEMS.find(item => item.id === id);
}

/**
 * Pobierz items po kategorii
 */
export function getItemsByCategory(category: SearchItem['category']): SearchItem[] {
  return ALL_SEARCH_ITEMS.filter(item => item.category === category);
}
