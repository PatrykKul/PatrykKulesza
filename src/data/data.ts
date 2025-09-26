// ==========================================
// 🗂️ WEBSITE DATA CONSTANTS
// ==========================================

import React from 'react';
import { Calculator, BookOpen, Code, Globe } from 'lucide-react';
import type { HomePageData } from '../types/types';

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
      successRate: "100%"
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
    },
    {
      id: 4,
      title: "Strony Internetowe",
      description: "Profesjonalne strony internetowe z nowoczesnych technologii. Od prostych wizytówek po zaawansowane aplikacje webowe.",
      icon: React.createElement(Globe, { className: "w-12 h-12" }),
      levels: ["Wizytówka", "Sklep online", "Portfolio", "Aplikacja webowa"],
      price: "od 1000 zł",
      features: [
        "Next.js & TypeScript",
        "Tailwind CSS design",
        "Strapi CMS",
        "SEO optymalizacja", 
        "Hosting i domena",
        "Website builders"
      ]
    }
  ],
  
  portfolio: [
    {
      id: 1,
      title: "Audio Compressor",
      description: "Profesjonalny kompresor audio stworzony w Juce framework. Zaawansowane algorytmy DSP z real-time processing.",
      image: "compressor-preview.png",
      technologies: ["Juce", "C++", "DSP", "Audio Processing"],
      type: "desktop",
      category: "Audio Software"
    },
    {
      id: 2,
      title: "Weather Chatbot AI",
      description: "Inteligentny chatbot pogodowy z machine learning, rozpoznawaniem mowy i dynamicznymi animacjami zależnymi od pogody.",
      image: "weather-chatbot-preview.png",  
      technologies: ["Python", "PyQt5", "OpenWeather API", "scikit-learn", "TensorFlow", "Speech Recognition"],
      type: "desktop",
      category: "AI & Machine Learning"
    },
    {
      id: 3,
      title: "Macro Recorder Pro",
      description: "Zaawansowane narzędzie do nagrywania i odtwarzania makr. Precyzyjne rejestrowanie ruchów myszy, kliknięć i skrótów klawiszowych.",
      image: "macro-recorder-preview.png",  
      technologies: ["Python", "PyQt5", "Win32API", "Automation"],
      type: "tool",
      category: "Productivity Tools"
    },
    {
      id: 4,
      title: "Bezier Curves Visualizer",
      description: "Interaktywny wizualizator krzywych Beziera z możliwością manipulacji punktów kontrolnych w czasie rzeczywistym.",
      image: "bezier-preview.png",  
      technologies: ["JavaScript", "Canvas API", "Mathematical Algorithms"],
      type: "web",
      category: "Mathematical Visualization"
    },
    {
      id: 5,
      title: "Spaceship Shooter",
      description: "Klasyczna gra arcade typu space shooter z proceduralnymi wrogami i systemem power-upów.",
      image: "spaceship-game-preview.png",  
      technologies: ["Python", "Pygame"],
      type: "game",
      category: "Pygame"
    },
    {
      id: 6,
      title: "FPS Shooting Game",
      description: "Pierwszoosobowa strzelanka z zaawansowaną mechaniką broni i systemem AI przeciwników.",
      image: "fps-game-preview.png",  
      technologies: ["Unity", "C#", "AI Pathfinding", "3D Graphics"],
      type: "game",
      category: "Unity Games"
    },
    {
      id: 7,
      title: "Racing Car Simulator",
      description: "Realistyczny symulator wyścigów samochodowych z fizyką pojazdów i różnymi torami.",
      image: "racing-game-preview.png",
      technologies: ["Unity", "C#", "Physics Simulation", "Vehicle Dynamics"],
      type: "game",
      category: "Unity Games"
    },
    {
      id: 8,
      title: "Image Processing Suite",
      description: "Zaawansowany pakiet do przetwarzania obrazów z algorytmami Computer Vision i filtrami real-time.",
      image: "image-processing-preview.png", 
      technologies: ["Python", "OpenCV", "NumPy", "PIL", "Computer Vision"],
      type: "tool",
      category: "Image Processing"
    }
  ],
  
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
  
  contact: {
    phone: "+48 662 581 368",
    email: "patryk27_2003@o2.pl",
    location: "Białystok i okolice, Zambrów i okolice"
  }
};