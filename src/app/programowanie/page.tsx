'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Code, Search, ChevronDown, ChevronUp, Monitor, Smartphone, Database, Cpu, Zap, Settings, Layers } from 'lucide-react';

// Typy
type ProgrammingItem = {
  title: string;
  description: string;
  href: string;
  action?: () => void;
};

type ProgrammingTopic = {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  items: ProgrammingItem[];
};

type ProgrammingTopics = {
  [key: string]: ProgrammingTopic;
};

// Dane dla każdej specjalizacji programistycznej
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getProgrammingTopics = (handleContentChange: (content: string) => void): ProgrammingTopics => ({
  'Frontend Development': {
    icon: Monitor,
    color: 'bg-blue-600',
    items: [
      { title: 'HTML5 & CSS3', description: 'Semantyczny HTML, nowoczesny CSS, Flexbox, Grid', href: '/programowanie/frontend/html-css' },
      { title: 'JavaScript ES6+', description: 'Nowoczesny JavaScript, async/await, modules', href: '/programowanie/frontend/javascript' },
      { title: 'React.js', description: 'Hooks, Context API, komponenty funkcyjne', href: '/programowanie/frontend/react' },
      { title: 'Vue.js', description: 'Composition API, Vuex, Vue Router', href: '/programowanie/frontend/vue' },
      { title: 'Angular', description: 'TypeScript, Services, RxJS, NgRx', href: '/programowanie/frontend/angular' },
      { title: 'TypeScript', description: 'Statyczne typowanie, interfaces, generyki', href: '/programowanie/frontend/typescript' },
      { title: 'Sass/SCSS', description: 'Preprocessory CSS, mixins, funkcje', href: '/programowanie/frontend/sass' },
      { title: 'Webpack & Vite', description: 'Bundlery, optymalizacja, hot reload', href: '/programowanie/frontend/bundlers' }
    ]
  },
  'Backend Development': {
    icon: Database,
    color: 'bg-green-600',
    items: [
      { title: 'Node.js & Express', description: 'Server-side JavaScript, REST API, middleware', href: '/programowanie/backend/nodejs' },
      { title: 'Python & Django', description: 'Web framework, ORM, REST framework', href: '/programowanie/backend/python-django' },
      { title: 'Python & Flask', description: 'Mikroframework, SQLAlchemy, JWT', href: '/programowanie/backend/python-flask' },
      { title: 'Java & Spring', description: 'Spring Boot, Spring Security, JPA', href: '/programowanie/backend/java-spring' },
      { title: 'C# & .NET', description: 'ASP.NET Core, Entity Framework, Web API', href: '/programowanie/backend/dotnet' },
      { title: 'PHP & Laravel', description: 'Eloquent ORM, Artisan, Blade templating', href: '/programowanie/backend/php-laravel' },
      { title: 'Bazy danych', description: 'SQL, NoSQL, MongoDB, PostgreSQL, MySQL', href: '/programowanie/backend/databases' },
      { title: 'Docker & Kubernetes', description: 'Konteneryzacja, orkiestracja, DevOps', href: '/programowanie/backend/docker-k8s' }
    ]
  },
  'Mobile Development': {
    icon: Smartphone,
    color: 'bg-purple-600',
    items: [
      { title: 'React Native', description: 'Cross-platform development, Expo, Navigation', href: '/programowanie/mobile/react-native' },
      { title: 'Flutter & Dart', description: 'Google framework, widgets, state management', href: '/programowanie/mobile/flutter' },
      { title: 'Android & Kotlin', description: 'Native Android, Jetpack Compose, MVVM', href: '/programowanie/mobile/android-kotlin' },
      { title: 'iOS & Swift', description: 'Native iOS, SwiftUI, Core Data, Combine', href: '/programowanie/mobile/ios-swift' },
      { title: 'Xamarin', description: 'Microsoft cross-platform, C#, XAML', href: '/programowanie/mobile/xamarin' },
      { title: 'Ionic', description: 'Hybrid apps, Angular/React/Vue integration', href: '/programowanie/mobile/ionic' },
      { title: 'PWA', description: 'Progressive Web Apps, Service Workers', href: '/programowanie/mobile/pwa' },
      { title: 'App Store deployment', description: 'Publikacja, optymalizacja, monetyzacja', href: '/programowanie/mobile/deployment' }
    ]
  },
  'Data Science & AI': {
    icon: Cpu,
    color: 'bg-orange-600',
    items: [
      { title: 'Python dla DS', description: 'NumPy, Pandas, Matplotlib, Seaborn', href: '/programowanie/data-science/python-ds' },
      { title: 'Machine Learning', description: 'Scikit-learn, algorytmy ML, feature engineering', href: '/programowanie/data-science/machine-learning' },
      { title: 'Deep Learning', description: 'TensorFlow, Keras, PyTorch, sieci neuronowe', href: '/programowanie/data-science/deep-learning' },
      { title: 'Data Analysis', description: 'Eksploracja danych, wizualizacja, statystyka', href: '/programowanie/data-science/data-analysis' },
      { title: 'Big Data', description: 'Apache Spark, Hadoop, distributed computing', href: '/programowanie/data-science/big-data' },
      { title: 'SQL dla DS', description: 'Zaawansowane zapytania, window functions', href: '/programowanie/data-science/sql-advanced' },
      { title: 'R Programming', description: 'Analiza statystyczna, ggplot2, tidyverse', href: '/programowanie/data-science/r-programming' },
      { title: 'MLOps', description: 'Model deployment, monitoring, CI/CD for ML', href: '/programowanie/data-science/mlops' }
    ]
  },
  'DevOps & Cloud': {
    icon: Settings,
    color: 'bg-red-600',
    items: [
      { title: 'AWS Services', description: 'EC2, S3, RDS, Lambda, CloudFormation', href: '/programowanie/devops/aws' },
      { title: 'Azure Cloud', description: 'Virtual Machines, App Service, Azure Functions', href: '/programowanie/devops/azure' },
      { title: 'Google Cloud', description: 'Compute Engine, Cloud Functions, BigQuery', href: '/programowanie/devops/gcp' },
      { title: 'Docker', description: 'Konteneryzacja, Dockerfile, Docker Compose', href: '/programowanie/devops/docker' },
      { title: 'Kubernetes', description: 'Orkiestracja kontenerów, pods, services', href: '/programowanie/devops/kubernetes' },
      { title: 'CI/CD', description: 'Jenkins, GitLab CI, GitHub Actions', href: '/programowanie/devops/cicd' },
      { title: 'Infrastructure as Code', description: 'Terraform, Ansible, CloudFormation', href: '/programowanie/devops/iac' },
      { title: 'Monitoring', description: 'Prometheus, Grafana, ELK Stack, APM', href: '/programowanie/devops/monitoring' }
    ]
  },
  'Game Development': {
    icon: Zap,
    color: 'bg-indigo-600',
    items: [
      { title: 'Unity & C#', description: '2D/3D games, physics, animations, scripting', href: '/programowanie/gamedev/unity' },
      { title: 'Unreal Engine', description: 'Blueprints, C++, rendering, multiplayer', href: '/programowanie/gamedev/unreal' },
      { title: 'Godot Engine', description: 'GDScript, nodes, scenes, cross-platform', href: '/programowanie/gamedev/godot' },
      { title: 'HTML5 Games', description: 'Canvas API, WebGL, Phaser.js, Three.js', href: '/programowanie/gamedev/html5' },
      { title: 'Mobile Gaming', description: 'Touch controls, performance, monetization', href: '/programowanie/gamedev/mobile' },
      { title: 'Game Design', description: 'Mechanics, level design, user experience', href: '/programowanie/gamedev/design' },
      { title: 'Graphics Programming', description: 'Shaders, rendering pipelines, optimization', href: '/programowanie/gamedev/graphics' },
      { title: 'Multiplayer', description: 'Networking, synchronization, servers', href: '/programowanie/gamedev/multiplayer' }
    ]
  },
  'Cybersecurity': {
    icon: Layers,
    color: 'bg-gray-600',
    items: [
      { title: 'Ethical Hacking', description: 'Penetration testing, vulnerability assessment', href: '/programowanie/cybersecurity/ethical-hacking' },
      { title: 'Web Security', description: 'OWASP Top 10, XSS, SQL injection, CSRF', href: '/programowanie/cybersecurity/web-security' },
      { title: 'Network Security', description: 'Firewalls, IDS/IPS, network protocols', href: '/programowanie/cybersecurity/network-security' },
      { title: 'Cryptography', description: 'Encryption, hashing, digital signatures', href: '/programowanie/cybersecurity/cryptography' },
      { title: 'Malware Analysis', description: 'Reverse engineering, sandboxing, forensics', href: '/programowanie/cybersecurity/malware-analysis' },
      { title: 'Incident Response', description: 'SIEM, threat hunting, forensic analysis', href: '/programowanie/cybersecurity/incident-response' },
      { title: 'Compliance', description: 'GDPR, ISO 27001, PCI DSS, audit', href: '/programowanie/cybersecurity/compliance' },
      { title: 'Security Tools', description: 'Kali Linux, Burp Suite, Wireshark, Nmap', href: '/programowanie/cybersecurity/tools' }
    ]
  },
  'Dla Początkujących': {
    icon: Code,
    color: 'bg-green-500',
    items: [
      { title: 'Podstawy programowania', description: 'Algorytmy, struktury danych, logika', href: '/programowanie/podstawy/algorytmy' },
      { title: 'Pierwszy język - Python', description: 'Składnia, zmienne, pętle, funkcje', href: '/programowanie/podstawy/python-start' },
      { title: 'Git i GitHub', description: 'Kontrola wersji, repozytoria, collaboration', href: '/programowanie/podstawy/git-github' },
      { title: 'Środowiska programistyczne', description: 'IDE, edytory kodu, debugging', href: '/programowanie/podstawy/ide-tools' },
      { title: 'Praca z terminalem', description: 'Linia komend, bash, automatyzacja', href: '/programowanie/podstawy/terminal' },
      { title: 'Projektowanie aplikacji', description: 'Architektura, wzorce projektowe', href: '/programowanie/podstawy/design-patterns' },
      { title: 'Testowanie kodu', description: 'Unit testy, TDD, debugging', href: '/programowanie/podstawy/testing' },
      { title: 'Pierwsze projekty', description: 'Portfolio, GitHub, praktyczne ćwiczenia', href: '/programowanie/podstawy/projekty' }
    ]
  }
});

export default function ProgramowaniePage() {
  const [isFrontendMenuOpen, setIsFrontendMenuOpen] = useState(false);
  const [isBackendMenuOpen, setIsBackendMenuOpen] = useState(false);
  const [isSpecialtyMenuOpen, setIsSpecialtyMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentContent, setCurrentContent] = useState('Hello');

  const toggleFrontendMenu = () => {
    setIsFrontendMenuOpen(!isFrontendMenuOpen);
  };

  const toggleBackendMenu = () => {
    setIsBackendMenuOpen(!isBackendMenuOpen);
  };

  const toggleSpecialtyMenu = () => {
    setIsSpecialtyMenuOpen(!isSpecialtyMenuOpen);
  };

  const handleContentChange = (content: string) => {
    setCurrentContent(content);
    setIsFrontendMenuOpen(false);
    setIsBackendMenuOpen(false);
    setIsSpecialtyMenuOpen(false);
  };

  // Pobieramy dane z funkcją handleContentChange
  const programmingTopics = getProgrammingTopics(handleContentChange);

  // Filtrowanie treści w czasie rzeczywistym
  const filteredItems = useMemo(() => {
    if (currentContent === 'Hello' || !programmingTopics[currentContent]) {
      return [];
    }

    const items = programmingTopics[currentContent].items;
    
    if (!searchQuery.trim()) {
      return items;
    }

    return items.filter((item: ProgrammingItem) => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [currentContent, searchQuery, programmingTopics]);

  const currentTopic = programmingTopics[currentContent];

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
              <Code className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-[#58a6ff] via-[#1f6feb] to-[#0969da] bg-clip-text text-transparent">
              Korepetycje z Programowania
            </h1>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Profesjonalne korepetycje z programowania - od podstaw do zaawansowanych technologii
            </p>
          </div>

          {/* Navigation Menu */}
          <nav className="mb-8">
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6">
              <div className="flex flex-wrap justify-center gap-4">
                
                {/* Dla początkujących */}
                <button
                  onClick={() => handleContentChange('Dla Początkujących')}
                  className="inline-flex items-center gap-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] px-6 py-3 rounded-lg transition-colors font-medium"
                >
                  Dla początkujących
                </button>

                {/* Frontend - Dropdown Menu */}
                <div className="relative">
                  <button
                    onClick={toggleFrontendMenu}
                    className="inline-flex items-center gap-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] px-6 py-3 rounded-lg transition-colors font-medium"
                  >
                    Frontend
                    {isFrontendMenuOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  
                  {isFrontendMenuOpen && (
                    <div className="absolute top-full left-0 mt-2 bg-[#21262d] border border-[#30363d] rounded-lg shadow-xl z-50 min-w-[200px]">
                      <div className="p-2">
                        <button
                          onClick={() => handleContentChange('Frontend Development')}
                          className="block w-full text-left px-4 py-2 hover:bg-[#30363d] rounded-md transition-colors"
                        >
                          Wszystkie technologie
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Backend - Dropdown Menu */}
                <div className="relative">
                  <button
                    onClick={toggleBackendMenu}
                    className="inline-flex items-center gap-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] px-6 py-3 rounded-lg transition-colors font-medium"
                  >
                    Backend
                    {isBackendMenuOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  
                  {isBackendMenuOpen && (
                    <div className="absolute top-full left-0 mt-2 bg-[#21262d] border border-[#30363d] rounded-lg shadow-xl z-50 min-w-[200px]">
                      <div className="p-2">
                        <button
                          onClick={() => handleContentChange('Backend Development')}
                          className="block w-full text-left px-4 py-2 hover:bg-[#30363d] rounded-md transition-colors"
                        >
                          Wszystkie technologie
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile */}
                <button
                  onClick={() => handleContentChange('Mobile Development')}
                  className="inline-flex items-center gap-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] px-6 py-3 rounded-lg transition-colors font-medium"
                >
                  Mobile
                </button>

                {/* Specjalizacje - Dropdown Menu */}
                <div className="relative">
                  <button
                    onClick={toggleSpecialtyMenu}
                    className="inline-flex items-center gap-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] px-6 py-3 rounded-lg transition-colors font-medium"
                  >
                    Specjalizacje
                    {isSpecialtyMenuOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  
                  {isSpecialtyMenuOpen && (
                    <div className="absolute top-full left-0 mt-2 bg-[#21262d] border border-[#30363d] rounded-lg shadow-xl z-50 min-w-[200px]">
                      <div className="p-2">
                        <button
                          onClick={() => handleContentChange('Data Science & AI')}
                          className="block w-full text-left px-4 py-2 hover:bg-[#30363d] rounded-md transition-colors text-sm"
                        >
                          Data Science & AI
                        </button>
                        <button
                          onClick={() => handleContentChange('DevOps & Cloud')}
                          className="block w-full text-left px-4 py-2 hover:bg-[#30363d] rounded-md transition-colors text-sm"
                        >
                          DevOps & Cloud
                        </button>
                        <button
                          onClick={() => handleContentChange('Game Development')}
                          className="block w-full text-left px-4 py-2 hover:bg-[#30363d] rounded-md transition-colors text-sm"
                        >
                          Game Development
                        </button>
                        <button
                          onClick={() => handleContentChange('Cybersecurity')}
                          className="block w-full text-left px-4 py-2 hover:bg-[#30363d] rounded-md transition-colors text-sm"
                        >
                          Cybersecurity
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content Area */}
          <div className="text-center">
            {currentContent === 'Hello' ? (
              <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-12">
                <h2 className="text-4xl font-bold mb-6 text-[#58a6ff]">
                  Wybierz swoją ścieżkę programistyczną
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
                  Od podstaw programowania po zaawansowane specjalizacje - pomożemy Ci opanować 
                  dowolną technologię i rozwinąć karierę w IT.
                </p>

                {/* Technology highlights */}
                <div className="grid md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
                  <div className="bg-[#21262d] border border-[#30363d] rounded-xl p-6">
                    <Monitor className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Frontend</h3>
                    <p className="text-gray-400 text-sm">React, Vue, Angular, TypeScript</p>
                  </div>
                  
                  <div className="bg-[#21262d] border border-[#30363d] rounded-xl p-6">
                    <Database className="w-8 h-8 text-green-400 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Backend</h3>
                    <p className="text-gray-400 text-sm">Node.js, Python, Java, .NET</p>
                  </div>
                  
                  <div className="bg-[#21262d] border border-[#30363d] rounded-xl p-6">
                    <Smartphone className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Mobile</h3>
                    <p className="text-gray-400 text-sm">React Native, Flutter, Swift</p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Link
                    href="#contact"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] hover:from-[#1a5fcf] hover:to-[#4493f8] text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Zacznij swoją przygodę z kodem
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
                    Wybierz technologię, którą chcesz opanować
                  </p>
                </div>

                {/* Wyszukiwarka */}
                <div className="max-w-2xl mx-auto mb-8">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Szukaj technologii..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-[#21262d] border border-[#30363d] rounded-xl text-white placeholder-gray-400 focus:border-[#58a6ff] focus:outline-none transition-colors duration-300"
                    />
                  </div>
                  
                  {searchQuery && (
                    <div className="text-gray-400 text-sm mt-2">
                      Znaleziono {filteredItems.length} {filteredItems.length === 1 ? 'technologię' : 'technologii'}
                    </div>
                  )}
                </div>

                {/* Treści */}
                {filteredItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {filteredItems.map((item: ProgrammingItem, index: number) => (
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
                            <span>Rozpocznij naukę</span>
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
                      Nie znaleziono technologii pasującej do &ldquo;{searchQuery}&rdquo;
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
                    Umów się na lekcję z tej technologii
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
            © 2024 Patryk Kulesza - Korepetycje z Programowania. Wszystkie prawa zastrzeżone.
          </p>
        </div>
      </footer>
    </div>
  );
}