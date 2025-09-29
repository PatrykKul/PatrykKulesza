// ==========================================
// 🗂️ WEBSITE DATA CONSTANTS
// ==========================================

import React from 'react';
import { Calculator, BookOpen, Code, Globe, FileText, Edit3, Award, Brain } from 'lucide-react';
import type { HomePageData, Skill, PortfolioItem, EducationStat, Certificate } from '../types/types';

// ==========================================
// 🎨 PORTFOLIO DATA
// ==========================================
export const PROJECT_EXAMPLES: PortfolioItem[] = [
  {
    id: 1,
    title: "Wieslawski Studio",
    description: "Profesjonalna strona internetowa dla studia fotograficznego. Nowoczesny design z galerią prac i systemem rezerwacji.",
    image: "wieslawskiStudio.webp",
    liveUrl: "https://wieslawskistudio.pl",
    href: "https://wieslawskistudio.pl"
  },
  {
    id: 2,
    title: "Patryk Kul - Portfolio", 
    description: "Osobiste portfolio prezentujące projekty i umiejętności. Responsywny design z animacjami i nowoczesnym interfejsem.",
    image: "patrykkul.webp",
    liveUrl: "https://patrykkul.pl",
    href: "https://patrykkul.pl"
  }
];

// ==========================================
// 🎓 ABOUT SECTION DATA
// ==========================================
export const educationStats = [
  {
    title: "Średnia na studiach",
    value: "4.76",
    description: "Stypendium rektorskie 3 lata z rzędu",
    icon: React.createElement(Award, { className: "w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" })
  },
  {
    title: "Matura matematyka",
    value: "93%",
    description: "Poziom rozszerzony",
    icon: React.createElement(Calculator, { className: "w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" })
  },
  {
    title: "Angielski EF SET",
    value: "C2", 
    description: "75/100 i 71/100 - Oba poziom biegły",
    icon: React.createElement(BookOpen, { className: "w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" })
  },
  {
    title: "Lat doświadczenia",
    value: "5+",
    description: "Ponad 60 uczniów",
    icon: React.createElement(Brain, { className: "w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" })
  }
];

export const certificates = [
  {
    title: "Angielski C2 Proficient",
    issuer: "EF SET",
    images: [ "efset-certificate-2.png", "efset-certificate.png"],
    links: [ "https://cert.efset.org/en/r3Hft9","https://cert.efset.org/en/r3Hft9"]
  },
  {
    title: "AutoCAD",
    issuer: "Autodesk",
    images: ["autocad-level1.png", "autocad-level2.png", "autocad-general.png"]
  },
  {
    title: "Programowanie drukarek 3D",
    issuer: "Kwalifikacje zawodowe",
    images: ["3d-printer-cert.png"]
  },
  {
    title: "Kwalifikacje zawodowe",
    issuer: "Technik informatyk",
    images: ["inf02-cert.png", "inf03-cert.png", "diploma.png"]
  }
];

export const aboutSkills = [
  {
    category: "Programowanie",
    items: [
      { 
        name: "Python & Data Science",
        description: "Analiza danych, machine learning, pandas, numpy i scikit-learn"
      },
      { 
        name: "React, Next.js & TypeScript",
        description: "Nowoczesne frameworki do budowy interaktywnych aplikacji webowych"
      },
      { 
        name: "HTML, CSS & JavaScript",
        description: "Fundamenty web developmentu - solidne podstawy dla każdego developera"
      },
      { 
        name: "PHP & SQL",
        description: "Backend development i zarządzanie bazami danych"
      },
      { 
        name: "C, C++ & C#",
        description: "Języki niskiego poziomu i programowanie systemowe"
      }
    ],
    color: "from-blue-500 to-blue-600"
  },
  {
    category: "Matematyka",
    items: [
      { 
        name: "Analiza Matematyczna",
        description: "Granice, pochodne, całki i szeregi - fundament matematyki wyższej"
      },
      { 
        name: "Algebra Liniowa",
        description: "Macierze, przestrzenie wektorowe i przekształcenia liniowe"
      },
      { 
        name: "Matematyka Dyskretna",
        description: "Teoria grafów, kombinatoryka i algorytmy dyskretne"
      },
      { 
        name: "Statystyka",
        description: "Analiza danych statystycznych i wnioskowanie statystyczne"
      },
      { 
        name: "Metody Probabilistyczne",
        description: "Rachunek prawdopodobieństwa i procesy stochastyczne"
      },
      { 
        name: "Równania Różniczkowe",
        description: "Modelowanie zjawisk fizycznych i procesów dynamicznych"
      }
    ],
    color: "from-green-500 to-green-600"
  },
  {
    category: "Angielski",
    items: [
      { 
        name: "2 Certyfikaty C2 EF SET",
        description: "Najwyższy poziom biegłości językowej potwierdzony certyfikatami"
      },
      { 
        name: "Konwersacje",
        description: "Płynna komunikacja w języku angielskim na każdy temat"
      },
      { 
        name: "Gramatyka",
        description: "Kompleksowa znajomość struktur gramatycznych i ich zastosowania"
      },
      { 
        name: "Matura podstawowa",
        description: "Przygotowanie do egzaminu maturalnego - poziom podstawowy"
      },
      { 
        name: "Matura rozszerzona",
        description: "Zaawansowane przygotowanie do matury rozszerzonej"
      },
      { 
        name: "Pisanie rozprawek",
        description: "Techniki pisania esejów, argumentacji i strukturyzacji tekstu"
      }
    ],
    color: "from-purple-500 to-purple-600"
  },
  {
    category: "Strony Internetowe",
    items: [
      { 
        name: "Next.js & React",
        description: "Nowoczesne frameworki do budowy szybkich aplikacji webowych"
      },
      { 
        name: "Hostinger Builder",
        description: "Szybkie tworzenie stron bez kodowania dla klientów biznesowych"
      },
      { 
        name: "WordPress & WooCommerce",
        description: "Najpopularniejszy CMS i platforma e-commerce na świecie"
      },
      { 
        name: "Strapi CMS",
        description: "Headless CMS do zarządzania treścią i API"
      },
      { 
        name: "SEO & Performance",
        description: "Optymalizacja pod wyszukiwarki i szybkość ładowania"
      },
      { 
        name: "Responsywny Design",
        description: "Strony działające idealnie na wszystkich urządzeniach"
      }
    ],
    color: "from-orange-500 to-red-600"
  }
];

// ==========================================
// 🏠 MAIN WEBSITE DATA
// ==========================================
export const websiteData: HomePageData = {
  hero: {
    title: "Patryk Kulesza",
    subtitle: "Twój sukces, nasze wspólne dzieło",
    description: "Matematyka • Angielski • Programowanie • Student informatyki z 5-letnim doświadczeniem w korepetycjach. Specjalizuję się w Data Science i tworzeniu stron internetowych. Pomagam uczniom osiągnąć sukces na każdym poziomie nauki.",
    cta: "Umów bezpłatną konsultację",
    stats: {
      experience: "5+",
      students: "60+",
      successRate: "100%",
      websites: "10+"
    }
  },
  
  services: [
    {
      id: 1,
      title: "Matematyka",
      description: "Od podstaw po zaawansowane zagadnienia uniwersyteckie. Przygotowanie do egzaminów i olimpiad.",
      icon: React.createElement(Calculator, { className: "w-12 h-12" }),
      levels: ["Podstawówka", "Liceum", "Matura", "Studia"],
      price: "60-80 zł",
      features: [
        "Indywidualne podejście do ucznia",
        "Materiały własne i zadania",
        "Przygotowanie do egzaminów",
        "Analiza matematyczna na studiach",
        "Geometria liniowa i algebry",
        "Statystyka i prawdopodobieństwo"
      ]
    },
    {
      id: 2,
      title: "Angielski",
      description: "Konwersacje, gramatyka, przygotowanie do egzaminów. Podstawa i rozszerzenie na maturze.",
      icon: React.createElement(BookOpen, { className: "w-12 h-12" }),
      levels: ["Podstawówka", "Liceum", "Matura", "Konwersacje"],
      price: "60-80 zł",
      features: [
        "Konwersacje",  
        "Przygotowanie do matury",
        "Gramatyka i słownictwo",
        "Pisanie rozprawek",
        "Listening i reading",
        "Certyfikaty międzynarodowe"
      ]
    },
    {
      id: 3,
      title: "Programowanie",
      description: "Python, Next.js, Strapi, Buildery Online, web development od podstaw. Także starsze technologie jak XAMPP.",
      icon: React.createElement(Code, { className: "w-12 h-12" }),
      levels: ["Podstawy", "Średniozaawansowany", "Projekty"],
      price: "70-100 zł",
      features: [
        "Python i Data Science",
        "Next.js i React",
        "Strapi i CMS",
        "FastAPI i backend",
        "Bazy danych SQL/NoSQL",
        "Deploy i hosting"
      ]
    }
  ],

  materials: {
    math: [
      {
        id: 1,
        title: "Wzory Maturalne",
        description: "Kompletny zbiór wzorów matematycznych potrzebnych na maturze podstawowej i rozszerzonej.",
        icon: React.createElement(Calculator, { className: "w-8 h-8 text-white" }),
        features: [
          "Algebra i funkcje",
          "Geometria i trygonometria", 
          "Analiza matematyczna",
          "Statystyka i prawdopodobieństwo"
        ],
        files: 15,
        rating: 4.9,
        hasVideo: true
      },
      {
        id: 2,
        title: "Zadania z Rozwiązaniami",
        description: "Ponad 200 zadań maturalnych z szczegółowymi rozwiązaniami krok po krok.",
        icon: React.createElement(FileText, { className: "w-8 h-8 text-white" }),
        features: [
          "Zadania podstawowe",
          "Zadania rozszerzone",
          "Szczegółowe rozwiązania",
          "Wskazówki i tricks"
        ],
        files: 25,
        rating: 4.8,
        hasVideo: false
      },
      {
        id: 3,
        title: "Poradniki Krok po Krok",
        description: "Kompleksowe przewodniki przez najtrudniejsze tematy matematyczne.",
        icon: React.createElement(BookOpen, { className: "w-8 h-8 text-white" }),
        features: [
          "Funkcje i ich właściwości",
          "Geometria analityczna",
          "Ciągi i szeregi",
          "Rachunek różniczkowy"
        ],
        files: 12,
        rating: 4.9,
        hasVideo: true
      }
    ],
    english: [
      {
        id: 1,
        title: "Gramatyka Angielska",
        description: "Kompletny przewodnik po gramatyce angielskiej z przykładami i ćwiczeniami.",
        icon: React.createElement(BookOpen, { className: "w-8 h-8 text-white" }),
        features: [
          "Wszystkie czasy angielskie",
          "Mowa zależna",
          "Tryb warunkowy",
          "Ćwiczenia praktyczne"
        ],
        files: 18,
        rating: 4.8,
        hasVideo: true
      },
      {
        id: 2,
        title: "Słownictwo Maturalne",
        description: "2000+ najważniejszych słów i wyrażeń potrzebnych na maturze z angielskiego.",
        icon: React.createElement(Globe, { className: "w-8 h-8 text-white" }),
        features: [
          "Słownictwo tematyczne",
          "Phrasal verbs",
          "Idiomy i wyrażenia",
          "Karty do nauki"
        ],
        files: 22,
        rating: 4.7,
        hasVideo: false
      },
      {
        id: 3,
        title: "Przykładowe Eseje",
        description: "Wzorcowe rozprawki i eseje z różnych tematów maturalnych.",
        icon: React.createElement(Edit3, { className: "w-8 h-8 text-white" }),
        features: [
          "Eseje opinii",
          "Eseje za i przeciw",
          "Listy formalne",
          "Raporty i artykuły"
        ],
        files: 10,
        rating: 4.9,
        hasVideo: true
      }
    ],
    programming: [
      {
        id: 1,
        title: "Python od Podstaw",
        description: "Kompletny kurs Pythona od podstaw po zaawansowane tematy - idealne wprowadzenie do programowania.",
        icon: React.createElement(Code, { className: "w-8 h-8 text-white" }),
        features: [
          "Składnia i podstawy języka",
          "Struktury danych",
          "Programowanie objektowe",
          "Biblioteki standardowe"
        ],
        files: 20,
        rating: 4.9,
        hasVideo: true
      },
      {
        id: 2,
        title: "Web Development",
        description: "Tworzenie stron internetowych z Next.js, React i Strapi CMS. Od podstaw do zaawansowanych projektów.",
        icon: React.createElement(Globe, { className: "w-8 h-8 text-white" }),
        features: [
          "HTML, CSS, JavaScript",
          "React i Next.js",
          "Strapi CMS",
          "Deployment i hosting"
        ],
        files: 30,
        rating: 4.8,
        hasVideo: true
      },
      {
        id: 3,
        title: "Data Science i AI",
        description: "Analiza danych, uczenie maszynowe i sztuczna inteligencja z Pythonem - praktyczne projekty.",
        icon: React.createElement(Calculator, { className: "w-8 h-8 text-white" }),
        features: [
          "Pandas i NumPy",
          "Matplotlib i Seaborn",
          "Scikit-learn",
          "Projekty z życia wzięte"
        ],
        files: 25,
        rating: 4.9,
        hasVideo: true
      }
    ]
  },

  webdev: {
    title: "Web Development",
    subtitle: "Profesjonalne strony internetowe",
    description: "Oprócz korepetycji, zajmuję się również tworzeniem nowoczesnych stron internetowych. Specjalizuję się w najnowszych technologiach i zapewniam kompleksową obsługę od projektu po wdrożenie.",
    portfolioUrl: "#portfolio",
    stats: {
      projects: "50",
      clients: "30", 
      experience: "3"
    },
    services: [
      {
        title: "Strony Wizytówkowe",
        description: "Profesjonalne strony prezentujące Twoją firmę lub usługi. Responsywne, szybkie i zoptymalizowane pod SEO.",
        price: "od 1000 zł",
        features: [
          "Responsywny design",
          "Optymalizacja SEO",
          "Panel administracyjny",
          "Hosting i domena w cenie"
        ]
      },
      {
        title: "Sklepy Internetowe",
        description: "Zaawansowane platformy e-commerce z systemem płatności, zarządzaniem produktami i analityką.",
        price: "od 3000 zł",
        features: [
          "Integracja z płatnościami",
          "Zarządzanie produktami",
          "System zamówień",
          "Analityka sprzedaży"
        ]
      },
      {
        title: "Aplikacje Webowe",
        description: "Dedykowane aplikacje dostosowane do specyficznych potrzeb Twojego biznesu.",
        price: "od 5000 zł",
        features: [
          "Indywidualny rozwój",
          "Zaawansowana funkcjonalność",
          "Integracje z API",
          "Wsparcie techniczne"
        ]
      }
    ]
  },

  testimonials: [
    {
      id: 1,
      name: "Mateusz M.",
      grade: "Statystyka i Metody Probabilistyczne",
      result: "Zaliczenie Sesji",
      opinion: "Czasami spotykasz osobę, która zmienia bieg twojego życia w kilka dni. Patryk to jeden z tych ludzi - ratuje nie tylko przed sesją, ale potrafi w kilka godzin nauczyć tego, czego nie ogarnąłeś przez cały semestr.",
      rating: 5
    },
    {
      id: 2,
      name: "Julia Z.",
      grade: "Kwalifikacja Zawodowa INF.02 i INF.03", 
      result: "95% i 85%",
      opinion: "Przełamałam stereotypy o dziewczynach w IT dzięki korepetycjom z Patrykiem. Jego cierpliwość i świetne tłumaczenie pomogły mi osiągnąć znakomite wyniki na egzaminach zawodowych.",
      rating: 5
    },
    {
      id: 3,
      name: "Dominika A.",
      grade: "4 klasa technikum",
      result: "Znaczna poprawa ocen",
      opinion: "Cały rok przygotowywałam się z Patrykiem do sprawdzianów z matmy. Rezultat? Wszystkie zdane! Polecam w 100%.",
      rating: 5
    },
    {
      id: 4,
      name: "Rodzice Amelii",
      grade: "Egzamin 8-klasisty",
      result: "100% matematyka, 98% angielski", 
      opinion: "Perfekcyjne przygotowanie do egzaminu ósmoklasisty. Amelia osiągnęła znakomite wyniki dzięki Panu Patrykowi.",
      rating: 5
    },
    {
      id: 5,
      name: "Dominik G.",
      grade: "Matura",
      result: "50% matematyka, 52% angielski",
      opinion: "Świetny korepetytor - potrafi w prosty sposób wytłumaczyć nawet najtrudniejsze zagadnienia w bardzo krótkim czasie. Dzięki jego pomocy dobrze przygotowałem się z matematyki i angielskiego, a nauka była przyjemna i skuteczna.",
      rating: 5
    }
  ],
  
  faq: [
    {
      question: "Jak wyglądają zajęcia online?",
      answer: "Zajęcia online prowadzę za pomocą interaktywnych narzędzi cyfrowych - najczęściej używam wirtualnych tablic (whiteboard, Miro), które możemy wspólnie edytować w czasie rzeczywistym. Do komunikacji wykorzystujemy platformy wybrane przez ucznia: Teams, Google Meet czy Zoom. Podczas zajęć korzystam z tabletu graficznego, dzielę się ekranem i po każdych zajęciach wysyłam kompletne notatki. Dzięki takiemu podejściu jakość nauczania jest identyczna jak przy zajęciach stacjonarnych."
    },
    {
      question: "Czy prowadzisz zajęcia stacjonarne?",
      answer: "Tak, prowadzę zajęcia stacjonarne w Białymstoku, Zambrowie oraz okolicach. Mamy kilka opcji do wyboru: zajęcia u mnie w domu, mogę przyjechać do ucznia lub spotkać się w miejscu wybranym przez ucznia."
    },
    {
      question: "Jakie są ceny korepetycji?",
      answer: "Matematyka: 60-80 zł/h, Angielski: 60-80 zł/h, Programowanie: 70-100 zł/h. Cena zależy od poziomu i typu zajęć. Pakiet 10 godzin z rabatem 20%."
    },
    {
      question: "Czy oferujesz zajęcia grupowe?",
      answer: "Tak, prowadzę zajęcia dla grup 2-4 osobowych. Cena za osobę jest wtedy niższa, a efektywność nauki często wyższa dzięki wspólnemu rozwiązywaniu problemów."
    },
    {
      question: "Jak szybko można umówić zajęcia?",
      answer: "Zazwyczaj mogę zorganizować zajęcia w ciągu 2-3 dni. W przypadkach pilnych (np. egzamin za tydzień) staram się pomóc nawet tego samego dnia."
    },
    {
      question: "Czy pomagasz z przygotowaniem do egzaminów?",
      answer: "Oczywiście! Specjalizuję się w przygotowaniu do egzaminu ósmoklasisty, matury podstawowej i rozszerzonej oraz egzaminów na studia. Mam sprawdzone metody i materiały."
    },
    {
      question: "Jak wygląda pierwsza lekcja?",
      answer: "Pierwsza lekcja przypomina konsultację, podczas której poznajemy się, ustalamy cele, sprawdzam poziom i dostosowuję plan nauki do Twoich potrzeb."
    },
    {
      question: "Czy wysyłasz materiały po zajęciach?",
      answer: "Tak, po każdych zajęciach wysyłam skany notatek, zadania do samodzielnego rozwiązania i dodatkowe materiały. Uczniowie mają dostęp do wszystkiego 24/7."
    }
  ],

  unifiedServices: {
    title: "Moje Usługi",
    subtitle: "Edukacja i Technologie",
    description: "Profesjonalne korepetycje z matematyki, angielskiego i programowania oraz tworzenie nowoczesnych stron internetowych.",
    stats: {
      experience: "5+",
      students: "60+",
      projects: "50+"
    },
    services: [
      {
        id: "matematyka",
        title: "Matematyka",
        subtitle: "Od podstaw po studia",
        price: "60-80 zł/h",
        description: "Kompleksowe korepetycje z matematyki na każdym poziomie. Przygotowanie do egzaminów, matur i olimpiad. Indywidualne podejście i sprawdzone metody nauczania.",
        features: [
          "Indywidualne podejście do ucznia",
          "Materiały własne i zadania",
          "Przygotowanie do egzaminów",
          "Analiza matematyczna na studiach",
          "Geometria i algebra liniowa",
          "Statystyka i prawdopodobieństwo"
        ],
        levels: ["Podstawówka", "Liceum", "Matura", "Studia"],
        ctaText: "Umów lekcję matematyki",
        highlighted: true,
        category: 'korepetycje' as const
      },
      {
        id: "angielski",
        title: "Angielski",
        subtitle: "Konwersacje i egzaminy",
        price: "60-80 zł/h",
        description: "Nauka angielskiego z naciskiem na praktyczne umiejętności. Konwersacje, gramatyka, przygotowanie do matury i certyfikatów międzynarodowych.",
        features: [
          "Konwersacje z native speakerem",
          "Przygotowanie do matury",
          "Gramatyka i słownictwo",
          "Pisanie rozprawek i esejów",
          "Listening i reading comprehension",
          "Certyfikaty Cambridge i IELTS"
        ],
        levels: ["Podstawówka", "Liceum", "Matura", "Konwersacje"],
        ctaText: "Zacznij naukę angielskiego",
        category: 'korepetycje' as const
      },
      {
        id: "programowanie",
        title: "Programowanie",
        subtitle: "Python, Web Development, Data Science",
        price: "70-100 zł/h",
        description: "Korepetycje z programowania prowadzone przez technika informatyka z kwalifikacjami EE.08 i EE.09. Od podstaw do zaawansowanych projektów - Python, JavaScript, React, Next.js i wiele więcej.",
        features: [
          "Python i Data Science",
          "Next.js i React development",
          "Strapi i systemy CMS",
          "FastAPI i backend development",
          "Bazy danych SQL/NoSQL",
          "Deploy, hosting i DevOps"
        ],
        levels: ["Podstawy", "Średniozaawansowany", "Projekty komercyjne"],
        ctaText: "Naucz się programować",
        category: 'korepetycje' as const
      },
      {
        id: "strony-internetowe",
        title: "Strony Internetowe",
        subtitle: "Profesjonalne rozwiązania webowe",
        price: "od 1000 zł",
        description: "Tworzenie nowoczesnych, responsywnych stron internetowych. Od prostych wizytówek po zaawansowane sklepy internetowe i aplikacje webowe.",
        features: [
          "Responsywny design",
          "Optymalizacja SEO",
          "Panel administracyjny CMS",
          "Integracja z płatnościami",
          "Hosting i domena w cenie",
          "Wsparcie techniczne"
        ],
        levels: ["Strony wizytówkowe", "Sklepy internetowe", "Aplikacje webowe"],
        ctaText: "Zamów stronę internetową",
        category: 'webdev' as const
      }
    ]
  },
  
  contact: {
    phone: "+48 662 581 368",
    email: "patryk27_2003@o2.pl",
    location: "Białystok i okolice, Zambrów i okolice"
  }
};

