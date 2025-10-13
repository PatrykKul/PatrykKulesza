/**
 * 🚀 ADVANCED FALLBACK SYSTEM - KORKUŚ Chatbot v3.0
 * 
 * Kompletny system odpowiedzi awaryjnych z:
 * - FAQ (8 pytań)
 * - Usługi (korepetycje, strony, AI)
 * - Ceny i kontakt
 * - Opinie klientów
 * - Materiały do nauki
 * - Inteligentna detekcja intencji
 */

interface FallbackResponse {
  response: string;
  buttons?: Array<{
    text: string;
    href?: string;
    onClick?: string;
    variant?: 'primary' | 'secondary' | 'outline';
    icon?: string;
  }>;
}

// ==========================================
// 🎯 INTENCJE I KATEGORIE
// ==========================================

/**
 * Główne kategorie intencji użytkownika
 */
export type UserIntent = 
  | 'booking'           // Chce umówić korepetycje
  | 'faq'               // Zadaje pytanie z FAQ
  | 'price'             // Pyta o ceny
  | 'contact'           // Chce się skontaktować
  | 'service_math'      // Pyta o matematykę
  | 'service_english'   // Pyta o angielski
  | 'service_programming' // Pyta o programowanie
  | 'service_webdev'    // Pyta o strony internetowe
  | 'service_ai'        // Pyta o integrację AI
  | 'testimonials'      // Chce zobaczyć opinie
  | 'materials'         // Pyta o materiały
  | 'math_question'     // Konkretne zadanie z matematyki (Gemini)
  | 'english_question'  // Konkretne pytanie o angielski (Gemini)
  | 'programming_question' // Konkretne pytanie o programowanie (Gemini)
  | 'unknown';          // Nieznana intencja

/**
 * Wykrywa intencję użytkownika na podstawie wiadomości
 */
export function detectIntent(message: string): UserIntent {
  const lower = message.toLowerCase().trim();
  
  // 1. BOOKING - najwyższy priorytet dla umówienia
  const bookingVerbs = ['umów', 'umow', 'rezerwuj', 'zarezerwuj', 'zapisz'];
  const lessonWords = ['korepetycje', 'korepetycj', 'korki', 'lekcj', 'spotkanie', 'zajęcia', 'wizyta'];
  const hasBookingVerb = bookingVerbs.some(verb => lower.includes(verb));
  const hasLessonWord = lessonWords.some(word => lower.includes(word));
  
  // Modalne kombinacje z czasownikami umawiania
  const modalBookingPatterns = [
    /można\s+umów/i, /mozna\s+umow/i,
    /można\s+rezerwuj/i, /mozna\s+rezerwuj/i,
    /chcę\s+umów/i, /chce\s+umow/i,
    /chcę\s+się\s+umów/i, /chce\s+sie\s+umow/i
  ];
  const hasModalBooking = modalBookingPatterns.some(pattern => pattern.test(lower));
  
  if ((hasBookingVerb && hasLessonWord) || hasModalBooking) {
    return 'booking';
  }
  
  // 2. FAQ - sprawdzanie konkretnych pytań
  if (detectFAQQuestion(lower)) {
    return 'faq';
  }
  
  // 3. CENY - PRZED sprawdzaniem usług!
  const priceKeywords = ['cena', 'cen', 'koszt', 'cennik', 'płacę', 'płace', 'zł', 'złotych'];
  const hasPriceWord = priceKeywords.some(word => lower.includes(word));
  const hasIleKoszt = lower.includes('ile') && lower.includes('koszt');
  
  if (hasPriceWord || hasIleKoszt) {
    return 'price';
  }
  
  // 4. KONTAKT
  const contactKeywords = ['kontakt', 'telefon', 'email', 'mail', 'numer', 'zadzwoń', 'napisz'];
  if (contactKeywords.some(word => lower.includes(word))) {
    return 'contact';
  }
  
  // 5. OPINIE
  const testimonialKeywords = ['opinie', 'opini', 'recenzje', 'recenzj', 'polecenia', 'polecają', 'zadowoleni'];
  if (testimonialKeywords.some(word => lower.includes(word))) {
    return 'testimonials';
  }
  
  // 6. MATERIAŁY
  const materialKeywords = ['materiały', 'materiał', 'pliki', 'pdf', 'ściąga', 'notatki', 'zadania'];
  if (materialKeywords.some(word => lower.includes(word))) {
    return 'materials';
  }
  
  // 7. USŁUGI - sprawdzanie kategorii
  // MATEMATYKA (zadanie vs. ogólne pytanie)
  if (lower.includes('matemat') || lower.includes('matm')) {
    // Czy to konkretne zadanie? (liczby, równania, wzory)
    if (/\d/.test(message) || lower.includes('równanie') || lower.includes('zadanie') || 
        lower.includes('rozwiąż') || lower.includes('oblicz') || lower.includes('ile wynosi')) {
      return 'math_question'; // Gemini
    }
    return 'service_math'; // Fallback
  }
  
  // ANGIELSKI (tłumaczenie vs. ogólne pytanie)
  if (lower.includes('angielski') || lower.includes('english')) {
    if (lower.includes('przetłumacz') || lower.includes('translate') || 
        lower.includes('jak powiedzieć') || lower.includes('co znaczy')) {
      return 'english_question'; // Gemini
    }
    return 'service_english'; // Fallback
  }
  
  // PROGRAMOWANIE (konkretne pytanie o kod vs. ogólne)
  if (lower.includes('programowanie') || lower.includes('python') || lower.includes('javascript') || 
      lower.includes('react') || lower.includes('next') || lower.includes('kod')) {
    if (lower.includes('jak') || lower.includes('napisać') || lower.includes('zrobić') ||
        lower.includes('błąd') || lower.includes('error') || lower.includes('działa')) {
      return 'programming_question'; // Gemini
    }
    return 'service_programming'; // Fallback
  }
  
  // STRONY INTERNETOWE
  if (lower.includes('stron') || lower.includes('www') || lower.includes('website') || 
      lower.includes('sklep') || lower.includes('e-commerce')) {
    return 'service_webdev';
  }
  
  // INTEGRACJA AI
  if (lower.includes('ai') || lower.includes('sztuczna inteligencja') || 
      lower.includes('chatbot') || lower.includes('automatyzacja')) {
    return 'service_ai';
  }
  
  return 'unknown';
}

/**
 * Wykrywa konkretne pytanie z FAQ
 */
function detectFAQQuestion(lower: string): string | null {
  const faqPatterns = [
    { keywords: ['online', 'zajęcia', 'jak wyglądają'], id: 'online' },
    { keywords: ['stacjonarne', 'u ciebie', 'dojadę'], id: 'stacjonarne' },
    { keywords: ['grupowe', 'grupa', 'więcej osób'], id: 'grupowe' },
    { keywords: ['szybko', 'kiedy', 'terminy'], id: 'terminy' },
    { keywords: ['egzamin', 'matura', 'przygotowanie'], id: 'egzaminy' },
    { keywords: ['pierwsza', 'lekcja', 'spotkanie'], id: 'pierwsza' },
    { keywords: ['materiały', 'wysyłasz', 'notatki'], id: 'materialy' }
  ];
  
  for (const pattern of faqPatterns) {
    if (pattern.keywords.every(keyword => lower.includes(keyword))) {
      return pattern.id;
    }
  }
  
  return null;
}

// ==========================================
// 📋 FAQ RESPONSES
// ==========================================

const faqResponses: { [key: string]: FallbackResponse } = {
  online: {
    response: '💻 **Zajęcia online z KORKUŚ:**\n\n✨ Używam:\n• Interaktywnych tablic (Whiteboard, Miro)\n• Teams, Google Meet lub Zoom\n• Tabletu graficznego do pisania\n\n📝 Po każdych zajęciach:\n• Kompletne notatki PDF\n• Zadania do samodzielnej pracy\n• Materiały dodatkowe\n\n🎯 **Jakość identyczna jak stacjonarne!**',
    buttons: [
      { text: '📅 Umów zajęcia online', onClick: 'startBooking()', variant: 'primary', icon: '📅' },
      { text: '📚 Zobacz materiały', href: '/matematyka', variant: 'secondary', icon: '📚' }
    ]
  },
  
  stacjonarne: {
    response: '🏠 **Zajęcia stacjonarne - tak!**\n\n📍 Lokalizacje:\n• Białystok i okolice\n• Zambrów i okolice\n\n🚗 Opcje:\n• U mnie w domu\n• Mogę przyjechać do Ciebie\n• Miejsce wybrane przez Ciebie (np. kawiarnia)\n\n💡 **Elastyczne podejście!**',
    buttons: [
      { text: '📅 Umów stacjonarne', onClick: 'startBooking()', variant: 'primary', icon: '📅' },
      { text: '📞 Zadzwoń', href: 'tel:+48662581368', variant: 'secondary', icon: '📞' }
    ]
  },
  
  grupowe: {
    response: '👥 **Zajęcia grupowe - dostępne!**\n\n✅ Grupy 2-4 osobowe\n💰 Niższa cena za osobę\n📈 Wyższa efektywność (wspólne rozwiązywanie)\n🎯 Podobny poziom uczestników\n\n**Idealne dla:**\n• Kolegów/koleżanek z klasy\n• Przygotowania do tego samego egzaminu\n• Wspólnej nauki przed testem',
    buttons: [
      { text: '📅 Umów grupówkę', onClick: 'startBooking()', variant: 'primary', icon: '📅' },
      { text: '💬 Zapytaj o szczegóły', onClick: 'handleQuickMessage("Chcę zapytać o zajęcia grupowe")', variant: 'outline', icon: '💬' }
    ]
  },
  
  terminy: {
    response: '⚡ **Szybkie terminy!**\n\n🗓️ Zazwyczaj:\n• 2-3 dni na umówienie zajęć\n• Elastyczne godziny (również wieczory)\n• Weekendy możliwe\n\n🚨 **Pilne przypadki:**\n• Egzamin za tydzień? → Mogę tego samego dnia!\n• Kartkówka jutro? → Dzwońmy!\n\n📞 **+48 662 581 368**',
    buttons: [
      { text: '📅 Umów teraz', onClick: 'startBooking()', variant: 'primary', icon: '📅' },
      { text: '📞 Zadzwoń', href: 'tel:+48662581368', variant: 'secondary', icon: '📞' }
    ]
  },
  
  egzaminy: {
    response: '🎓 **Przygotowanie do egzaminów - SPECJALNOŚĆ!**\n\n✅ Moje doświadczenie:\n• Egzamin 8-klasisty (100% matma, 98% angielski)\n• Matura podstawowa i rozszerzona\n• Kwalifikacje zawodowe (INF.02, INF.03)\n• Egzaminy na studia (Statystyka, Metody Probabilistyczne)\n\n📚 **Co dostajesz:**\n• Sprawdzone metody\n• Materiały egzaminacyjne\n• Rozwiązywanie zadań maturalnych\n• Stres? Nie ma sprawy!',
    buttons: [
      { text: '📅 Przygotuj się ze mną', onClick: 'startBooking()', variant: 'primary', icon: '📅' },
      { text: '⭐ Zobacz opinie', onClick: 'handleQuickMessage("Pokaż opinie")', variant: 'secondary', icon: '⭐' }
    ]
  },
  
  pierwsza: {
    response: '🎯 **Pierwsza lekcja:**\n\n1️⃣ **Poznajemy się** (5 min)\n• Twoje cele i potrzeby\n• Co sprawia Ci trudność?\n\n2️⃣ **Test poziomu** (10 min)\n• Sprawdzam Twoją wiedzę\n• Identyfikuję luki\n\n3️⃣ **Plan nauki** (10 min)\n• Dopasowany do Ciebie\n• Realistyczne cele\n\n4️⃣ **Pierwsze zagadnienie** (reszta czasu)\n• Zaczynamy naukę!\n\n💡 **To bardziej konsultacja niż lekcja**',
    buttons: [
      { text: '📅 Umów pierwszą lekcję', onClick: 'startBooking()', variant: 'primary', icon: '📅' },
      { text: '💰 Sprawdź ceny', onClick: 'handleQuickMessage("Ile kosztują korepetycje?")', variant: 'outline', icon: '💰' }
    ]
  },
  
  materialy: {
    response: '📦 **Materiały po zajęciach:**\n\n✅ Zawsze dostajesz:\n• Skany wszystkich notatek (PDF)\n• Zadania do samodzielnej pracy\n• Materiały dodatkowe (wzory, ściągi)\n• Linki do filmów/artykułów\n\n☁️ **Dostęp 24/7:**\n• Google Drive\n• Email\n• WhatsApp\n\n🎁 **BONUS:** Własne materiały i zadania!',
    buttons: [
      { text: '📚 Zobacz przykłady', href: '/matematyka', variant: 'primary', icon: '📚' },
      { text: '📅 Umów zajęcia', onClick: 'startBooking()', variant: 'secondary', icon: '📅' }
    ]
  }
};

// ==========================================
// 💰 CENY I KONTAKT
// ==========================================

export function getPriceResponse(): FallbackResponse {
  return {
    response: '💰 **CENNIK KOREPETYCJI:**\n\n🧮 **Matematyka:** 60-80 zł/h\n• Podstawówka, liceum, studia\n• Przygotowanie do egzaminów\n\n🇬🇧 **Angielski:** 60-80 zł/h\n• Konwersacje, gramatyka\n• Matura, certyfikaty\n\n💻 **Programowanie:** 70-100 zł/h\n• Python, JavaScript, React\n• Projekty praktyczne\n\n🎁 **PAKIET 10h:** -20% (oszczędzasz do 160 zł!)\n\n📞 **Kontakt:** +48 662 581 368\n📧 **Email:** patryk27_2003@o2.pl',
    buttons: [
      { text: '📅 Umów teraz', onClick: 'startBooking()', variant: 'primary', icon: '📅' },
      { text: '📞 Zadzwoń', href: 'tel:+48662581368', variant: 'secondary', icon: '📞' },
      { text: '📧 Napisz email', href: 'mailto:patryk27_2003@o2.pl', variant: 'outline', icon: '📧' }
    ]
  };
}

export function getContactResponse(): FallbackResponse {
  return {
    response: '📞 **SKONTAKTUJ SIĘ ZE MNĄ:**\n\n**Najszybciej:**\n☎️ +48 662 581 368\n_(oddzwaniam w ciągu 1h)_\n\n**Email:**\n📧 patryk27_2003@o2.pl\n\n**Lokalizacje:**\n📍 Białystok i okolice\n📍 Zambrów i okolice\n\n💬 **Lub umów się przez chatbota!**',
    buttons: [
      { text: '📞 Zadzwoń teraz', href: 'tel:+48662581368', variant: 'primary', icon: '📞' },
      { text: '📧 Napisz email', href: 'mailto:patryk27_2003@o2.pl', variant: 'secondary', icon: '📧' },
      { text: '📅 Umów przez chat', onClick: 'startBooking()', variant: 'outline', icon: '📅' }
    ]
  };
}

// ==========================================
// 🎓 USŁUGI - KOREPETYCJE
// ==========================================

export function getServiceMathResponse(): FallbackResponse {
  return {
    response: '🧮 **MATEMATYKA - Moja mocna strona!**\n\n📊 **Doświadczenie:**\n• Średnia 4.76 na studiach (Informatyka)\n• 93% na maturze rozszerzonej\n• 5+ lat nauczania, 60+ uczniów\n\n✅ **Czego uczę:**\n• Równania i nierówności\n• Funkcje i wykresy\n• Geometria i trygonometria\n• Analiza matematyczna (studia)\n• Algebra liniowa\n• Statystyka i prawdopodobieństwo\n\n🎯 **Poziomy:** Podstawówka → Studia\n💰 **Cena:** 60-80 zł/h',
    buttons: [
      { text: '📅 Umów matematykę', onClick: 'startBooking()', variant: 'primary', icon: '📅' },
      { text: '📖 Materiały', href: '/matematyka', variant: 'secondary', icon: '📖' },
      { text: '🧮 Zadaj pytanie', onClick: 'handleQuickMessage("Pomóż mi z zadaniem z matematyki")', variant: 'outline', icon: '🧮' }
    ]
  };
}

export function getServiceEnglishResponse(): FallbackResponse {
  return {
    response: '🇬🇧 **ANGIELSKI - Let\'s learn English!**\n\n🏆 **Certyfikaty:**\n• 2x EF SET C2 (75/100 i 71/100)\n• Najwyższy poziom biegłości\n\n✅ **Czego uczę:**\n• Konwersacje (C2 level)\n• Gramatyka i składnia\n• Przygotowanie do matury\n• Pisanie rozprawek i esejów\n• Listening & Reading\n• Certyfikaty Cambridge, IELTS\n\n🎯 **Poziomy:** Podstawówka → C2\n💰 **Cena:** 60-80 zł/h',
    buttons: [
      { text: '📅 Umów angielski', onClick: 'startBooking()', variant: 'primary', icon: '📅' },
      { text: '📚 Materiały', href: '/angielski', variant: 'secondary', icon: '📚' },
      { text: '🇬🇧 Zapytaj po angielsku', onClick: 'handleQuickMessage("I have a question about English")', variant: 'outline', icon: '🇬🇧' }
    ]
  };
}

export function getServiceProgrammingResponse(): FallbackResponse {
  return {
    response: '💻 **PROGRAMOWANIE - Coding time!**\n\n👨‍💻 **Kwalifikacje:**\n• Technik informatyk (EE.08, EE.09)\n• 5+ lat doświadczenia komercyjnego\n• 50+ projektów zrealizowanych\n\n✅ **Czego uczę:**\n• Python i Data Science\n• JavaScript, React, Next.js\n• Strapi CMS i backend\n• Bazy danych (SQL, NoSQL)\n• Algorytmy i struktury danych\n• Deploy, hosting, DevOps\n\n🎯 **Poziomy:** Podstawy → Projekty komercyjne\n💰 **Cena:** 70-100 zł/h',
    buttons: [
      { text: '📅 Umów programowanie', onClick: 'startBooking()', variant: 'primary', icon: '📅' },
      { text: '💾 Materiały', href: '/programowanie', variant: 'secondary', icon: '💾' },
      { text: '💻 Pomoc z kodem', onClick: 'handleQuickMessage("Pomóż mi z kodem")', variant: 'outline', icon: '💻' }
    ]
  };
}

// ==========================================
// 🌐 USŁUGI - WEBDEV & AI
// ==========================================

export function getServiceWebdevResponse(): FallbackResponse {
  return {
    response: '🌐 **STRONY INTERNETOWE**\n\n🚀 **Oferuję:**\n• Strony wizytówkowe (od 1000 zł)\n• Sklepy internetowe (WooCommerce)\n• Aplikacje webowe (Next.js, React)\n• SEO i optymalizacja\n• Hosting i domena w cenie\n\n✅ **Portfolio:**\n• 50+ zrealizowanych projektów\n• wieslawskistudio.pl\n• patrykkul.pl\n\n⚡ **Technologie:**\n• Next.js, React, TypeScript\n• WordPress, Strapi CMS\n• Responsywny design\n• Wsparcie techniczne',
    buttons: [
      { text: '🌐 Zobacz portfolio', href: '#portfolio', variant: 'primary', icon: '🌐' },
      { text: '📞 Zamów stronę', onClick: 'startBooking()', variant: 'secondary', icon: '📞' },
      { text: '💬 Zapytaj o projekt', onClick: 'handleQuickMessage("Chcę zapytać o stronę internetową")', variant: 'outline', icon: '💬' }
    ]
  };
}

export function getServiceAIResponse(): FallbackResponse {
  return {
    response: '🤖 **INTEGRACJA AI**\n\n✨ **Oferuję:**\n• Chatboty AI 24/7 (ChatGPT, Claude, Gemini)\n• Generowanie obrazów i video\n• Analiza i przetwarzanie tekstu\n• Automatyzacja dokumentów (OCR)\n• Rozpoznawanie obiektów\n• Pełna integracja z Twoją stroną\n\n💰 **Od 1000 zł**\n\n🎯 **Korzyści:**\n• Oszczędność czasu\n• Zwiększona efektywność\n• Zadowoleni klienci\n• Automatyzacja procesów',
    buttons: [
      { text: '🤖 Wdróż AI', onClick: 'startBooking()', variant: 'primary', icon: '🤖' },
      { text: '📞 Skontaktuj się', href: 'tel:+48662581368', variant: 'secondary', icon: '📞' },
      { text: '💬 Zapytaj o AI', onClick: 'handleQuickMessage("Chcę zapytać o integrację AI")', variant: 'outline', icon: '💬' }
    ]
  };
}

// ==========================================
// ⭐ OPINIE KLIENTÓW
// ==========================================

export function getTestimonialsResponse(): FallbackResponse {
  return {
    response: '⭐ **OPINIE KLIENTÓW** (5/5 gwiazdek!)\n\n**Mateusz M.** - Statystyka:\n_"Ratuje nie tylko przed sesją, ale potrafi w kilka godzin nauczyć tego, czego nie ogarnąłeś przez cały semestr."_\n\n**Julia Z.** - INF.02/INF.03 (95% i 85%):\n_"Przełamałam stereotypy o dziewczynach w IT dzięki korepetycjom z Patrykiem."_\n\n**Rodzice Amelii** - Egzamin 8-klasisty:\n_"100% matematyka, 98% angielski! Perfekcyjne przygotowanie."_\n\n**Dominik G.** - Matura:\n_"Świetny korepetytor - potrafi w prosty sposób wytłumaczyć nawet najtrudniejsze zagadnienia."_\n\n💯 **60+ zadowolonych uczniów, 100% skuteczność!**',
    buttons: [
      { text: '📅 Umów się ze mną', onClick: 'startBooking()', variant: 'primary', icon: '📅' },
      { text: '🌐 Więcej opinii', href: '#testimonials', variant: 'secondary', icon: '🌐' }
    ]
  };
}

// ==========================================
// 📚 MATERIAŁY DO NAUKI
// ==========================================

export function getMaterialsResponse(): FallbackResponse {
  return {
    response: '📚 **DARMOWE MATERIAŁY DO NAUKI:**\n\n🧮 **Matematyka:**\n• Wzory i formuły (15 plików)\n• Zadania praktyczne (25 plików)\n• Przewodniki tematyczne (12 plików)\n\n🇬🇧 **Angielski:**\n• Gramatyka i podstawy (18 plików)\n• Słownictwo i rozmowy (22 pliki)\n• Przykładowe eseje (10 plików)\n\n💻 **Programowanie:**\n• Python od zera (20 plików)\n• Tworzenie stron WWW (30 plików)\n• Data Science i AI (25 plików)\n\n🎁 **Dostęp 100% za darmo!**',
    buttons: [
      { text: '📖 Matematyka', href: '/matematyka', variant: 'primary', icon: '📖' },
      { text: '📚 Angielski', href: '/angielski', variant: 'secondary', icon: '📚' },
      { text: '💾 Programowanie', href: '/programowanie', variant: 'outline', icon: '💾' }
    ]
  };
}

// ==========================================
// 🎯 GŁÓWNA FUNKCJA FALLBACK
// ==========================================

/**
 * Zwraca fallback response na podstawie intencji
 */
export function getFallbackResponse(message: string): FallbackResponse | null {
  const intent = detectIntent(message);
  const lower = message.toLowerCase();
  
  // Najpierw sprawdź FAQ (konkretne pytanie)
  const faqId = detectFAQQuestion(lower);
  if (faqId && faqResponses[faqId]) {
    return faqResponses[faqId];
  }
  
  // Potem obsłuż inne intencje
  switch (intent) {
    case 'booking':
      return null; // Nie zwracaj fallback - uruchom booking process
    
    case 'faq':
      // Ogólne pytanie o FAQ
      return {
        response: '❓ **NAJCZĘŚCIEJ ZADAWANE PYTANIA:**\n\n1️⃣ Jak wyglądają zajęcia online?\n2️⃣ Czy prowadzisz zajęcia stacjonarne?\n3️⃣ Jakie są ceny korepetycji?\n4️⃣ Czy oferujesz zajęcia grupowe?\n5️⃣ Jak szybko można umówić zajęcia?\n6️⃣ Czy pomagasz z przygotowaniem do egzaminów?\n7️⃣ Jak wygląda pierwsza lekcja?\n8️⃣ Czy wysyłasz materiały po zajęciach?\n\n💬 **Kliknij lub napisz numer pytania!**',
        buttons: [
          { text: '1️⃣ Zajęcia online', onClick: 'handleQuickMessage("Jak wyglądają zajęcia online?")', variant: 'outline', icon: '💻' },
          { text: '3️⃣ Ceny', onClick: 'handleQuickMessage("Ile kosztują korepetycje?")', variant: 'outline', icon: '💰' },
          { text: '📅 Umów zajęcia', onClick: 'startBooking()', variant: 'primary', icon: '📅' }
        ]
      };
    
    case 'price':
      return getPriceResponse();
    
    case 'contact':
      return getContactResponse();
    
    case 'service_math':
      return getServiceMathResponse();
    
    case 'service_english':
      return getServiceEnglishResponse();
    
    case 'service_programming':
      return getServiceProgrammingResponse();
    
    case 'service_webdev':
      return getServiceWebdevResponse();
    
    case 'service_ai':
      return getServiceAIResponse();
    
    case 'testimonials':
      return getTestimonialsResponse();
    
    case 'materials':
      return getMaterialsResponse();
    
    case 'math_question':
    case 'english_question':
    case 'programming_question':
      // Te pytania wymagają Gemini - nie zwracaj fallback
      return null;
    
    case 'unknown':
    default:
      return getDefaultResponse();
  }
}

/**
 * Sprawdza czy wiadomość jest związana z edukacją/korepetycjami
 */
export function isEducationRelated(message: string): boolean {
  const educationKeywords = [
    'matematyka', 'matma', 'równanie', 'zadanie', 'liczenie',
    'angielski', 'english', 'tłumacz', 'gramatyka', 'słówka',
    'programowanie', 'python', 'javascript', 'kod', 'algorytm',
    'korepetycje', 'nauka', 'pomoc', 'nauczyciel', 'egzamin',
    'kontakt', 'cena', 'koszt', 'umów', 'lekcje', 'strona', 'www', 'ai'
  ];
  
  const lowerMessage = message.toLowerCase();
  return educationKeywords.some(keyword => lowerMessage.includes(keyword));
}

/**
 * Domyślna odpowiedź dla pytań niezwiązanych z korepetycjami
 */
export function getDefaultResponse(): FallbackResponse {
  return {
    response: '🤔 **Hmm, nie jestem pewny jak Ci z tym pomóc...**\n\nJestem KORKUŚ - specjalizuję się w:\n\n🎓 **Korepetycjach:**\n• 🧮 Matematyka\n• 🇬🇧 Angielski\n• 💻 Programowanie\n\n🌐 **Tworzeniu stron:**\n• Strony internetowe\n• Sklepy online\n• Integracja AI\n\n💡 **Zapytaj mnie o:**\n• Ceny i terminy\n• Materiały do nauki\n• Opinie klientów\n• Konkretne zadanie',
    buttons: [
      { text: '📅 Umów korepetycje', onClick: 'startBooking()', variant: 'primary', icon: '📅' },
      { text: '🧮 Pomoc z zadaniem', onClick: 'handleQuickMessage("Pomóż mi z zadaniem")', variant: 'secondary', icon: '🧮' },
      { text: '🌐 Zamów stronę', onClick: 'handleQuickMessage("Chcę zamówić stronę")', variant: 'outline', icon: '🌐' }
    ]
  };
}