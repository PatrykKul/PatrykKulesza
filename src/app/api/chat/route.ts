import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  getFallbackResponse, 
  detectIntent, 
  isEducationRelated, 
  getDefaultResponse,
  type UserIntent
} from '@/components/chatbot/fallback';

interface ChatButton {
  text: string;
  href?: string;
  onClick?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: string;
}

// History interface do przechowywania konwersacji
interface ConversationHistory {
  messages: {
    role: 'user' | 'model';
    parts: string;
  }[];
  lastUpdated: number;
}

// Rate limiting - prosty cache (w produkcji użyj Redis)
const requestCache = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT = 20; // 20 zapytań na IP
const WINDOW_MS = 15 * 60 * 1000; // 15 minut

// Cache odpowiedzi
const responseCache = new Map<string, { response: string; timestamp: number; buttons?: ChatButton[] }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minut

// Storage dla historii konwersacji
const conversationStore = new Map<string, ConversationHistory>();
const HISTORY_TTL = 30 * 60 * 1000; // 30 minut przechowywania historii

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = requestCache.get(ip);
  
  if (!userLimit || now - userLimit.lastReset > WINDOW_MS) {
    requestCache.set(ip, { count: 1, lastReset: now });
    return true;
  }
  
  if (userLimit.count >= RATE_LIMIT) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

function getCachedResponse(message: string) {
  const cached = responseCache.get(message.toLowerCase().trim());
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached;
  }
  return null;
}

function setCachedResponse(message: string, response: string, buttons?: ChatButton[]) {
  responseCache.set(message.toLowerCase().trim(), {
    response,
    buttons,
    timestamp: Date.now()
  });
}

// Funkcja obsługująca historię konwersacji
function getOrCreateConversationHistory(sessionId: string): ConversationHistory {
  const now = Date.now();
  
  // Czyścimy stare konwersacje
  for (const [id, conversation] of conversationStore.entries()) {
    if (now - conversation.lastUpdated > HISTORY_TTL) {
      conversationStore.delete(id);
    }
  }
  
  // Zwracamy istniejącą historię lub tworzymy nową
  if (!conversationStore.has(sessionId)) {
    conversationStore.set(sessionId, {
      messages: [],
      lastUpdated: now
    });
  }
  
  return conversationStore.get(sessionId)!;
}

// Funkcja dodająca wiadomość do historii
function addMessageToHistory(sessionId: string, role: 'user' | 'model', message: string) {
  const history = getOrCreateConversationHistory(sessionId);
  history.messages.push({ role, parts: message });
  history.lastUpdated = Date.now();
  
  // Limituję historię do 10 ostatnich wiadomości (5 rund)
  if (history.messages.length > 10) {
    history.messages = history.messages.slice(-10);
  }
}

export async function POST(req: NextRequest) {
  console.log('🤖 API Chat endpoint called');
  
  try {
    // Rozszerzamy obiekt request o sessionId, helpMode i imageUrls
    const { 
      message, 
      sessionId = crypto.randomUUID(),
      helpMode = false,
      problemContext = '',
      problemId = '',
      imageUrls = [],
      examInfo = null
    } = await req.json();
    
    console.log('📝 Received message:', message);
    console.log('🆔 Session ID:', sessionId);
    
    if (helpMode) {
      console.log('🎯 HELP MODE ACTIVATED for problem:', problemId);
      console.log('📚 Exam Info:', examInfo);
      console.log('🖼️ Images:', imageUrls);
    }
    
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { response: 'Proszę napisać wiadomość! 😊', sessionId },
        { status: 400 }
      );
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    
    // Rate limiting
    if (!checkRateLimit(ip)) {
      return NextResponse.json({
        response: '⏰ **Zbyt wiele pytań!**\n\nPoczekaj chwilę przed kolejnym pytaniem.\n\n💡 W międzyczasie sprawdź moje materiały!',
        buttons: [
          { text: '📖 Matematyka', href: '/matematyka', variant: 'primary', icon: '📖' },
          { text: '📚 Angielski', href: '/angielski', variant: 'secondary', icon: '📚' },
          { text: '💾 Programowanie', href: '/programowanie', variant: 'outline', icon: '💾' }
        ],
        sessionId
      }, { status: 429 });
    }

    // Pobieramy historię konwersacji
    const conversationHistory = getOrCreateConversationHistory(sessionId);
    
    // Dodajemy wiadomość użytkownika do historii
    addMessageToHistory(sessionId, 'user', message);
    
    // 🔥 HELP MODE - specjalny tutoring system z wsparciem obrazów
    if (helpMode && problemContext) {
      console.log('🎓 Activating tutoring mode with problem context');
      
      // 🔥 DETEKCJA ZMIANY TEMATU - użytkownik chce wyjść z trybu pomocy z zadaniem
      const offTopicKeywords = [
        'nie chodzi mi o zadanie',
        'nie o to pytam',
        'inna sprawa',
        'inne pytanie',
        'zmiana tematu',
        'patryk',
        'korepetycje online',
        'jak się umówić',
        'cennik',
        'kontakt',
        'email',
        'telefon',
        'numer',
        'ile kosztuje',
        'cena',
        'koszt',
        'zadzwoń',
        'korepetycje',
        'mail',
        'o tobie',
        'kto to',
        'kim jesteś'
      ];
      
      const isOffTopic = offTopicKeywords.some(keyword => 
        message.toLowerCase().includes(keyword)
      );
      
      // Jeśli użytkownik zmienia temat, przełącz na normalny tryb
      if (isOffTopic) {
        console.log('🔄 User changing topic - switching to normal mode');
        // Będzie przetwarzane przez normalny flow poniżej
      } else {
        // Kontynuuj z tutoring mode
      
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash-exp',
        generationConfig: {
          temperature: 0.8,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 1000,
        }
      });

      // Tworzenie specjalnego system prompta dla tutoringu
      let tutorSystemPrompt = `Jesteś KORKUŚ - AI tutor matematyczny. Pomagasz uczniom przygotowującym się do egzaminów z Patrykiem Kuleszą.

🎯 **TRYB: POMOC Z ZADANIEM EGZAMINACYJNYM**

📋 **KONTEKST ZADANIA:**
${problemContext}

📚 **INFORMACJE O EGZAMINIE:**
${examInfo ? `- Tytuł: ${examInfo.title}\n- Rok: ${examInfo.year}\n- Typ: ${examInfo.type}\n- Poziom: ${examInfo.level}` : 'Brak dodatkowych informacji'}`;

      // 🔥 Dodaj info o obrazach jeśli są
      if (imageUrls && imageUrls.length > 0) {
        tutorSystemPrompt += `\n\n🖼️ **OBRAZY/DIAGRAMY:**\nZadanie zawiera ${imageUrls.length} ${imageUrls.length === 1 ? 'obraz' : 'obrazów'} - analizuj je uważnie, aby pomóc uczniowi zrozumieć diagram/wykres/ilustrację.`;
      }

      tutorSystemPrompt += `\n\n⚠️ **ZASADY TUTORINGU (ELASTYCZNE):**

🎯 **STRATEGIA POMOCY:**
1. **NAJPIERW - PODPOWIEDZI** - zacznij od pytań naprowadzających i wskazówek
2. **OBSERWUJ REAKCJĘ** - jak uczeń reaguje na podpowiedzi
3. **DOSTOSUJ SIĘ** - jeśli uczeń wyraźnie prosi o pełne rozwiązanie, pokaż je!

📚 **KIEDY DAWAĆ PODPOWIEDZI:**
- Gdy uczeń pyta "jak zacząć?", "nie wiem od czego zacząć"
- Zadawaj pytania: "Co wiesz o...", "Jakie dane masz?", "Jaki wzór możemy użyć?"
- Wskazuj kierunek bez podawania gotowca
- Zachęcaj do myślenia: "Spróbuj...", "Zastanów się..."

✅ **KIEDY DAWAĆ PEŁNE ROZWIĄZANIE:**
- Gdy uczeń wyraźnie prosi: "pokaż rozwiązanie", "jak to rozwiązać?", "daj pełną odpowiedź"
- Gdy uczeń utknął mimo podpowiedzi
- Gdy uczeń chce zobaczyć wzorcowe rozwiązanie do nauki
- WTEDY: Pokaż pełne, szczegółowe rozwiązanie krok po kroku z komentarzami!

💡 **FORMAT PEŁNEGO ROZWIĄZANIA:**
- Wypisz każdy krok obliczeniowy
- Dodaj komentarze wyjaśniające "dlaczego tak robimy"
- Użyj LaTeX dla wszystkich wzorów
- Podsumuj końcową odpowiedź
- PRZYKŁAD:
  **Krok 1:** Rozwijamy $(3x+2)^2$ używając wzoru $(a+b)^2 = a^2 + 2ab + b^2$
  $$$(3x+2)^2 = (3x)^2 + 2 \\cdot 3x \\cdot 2 + 2^2 = 9x^2 + 12x + 4$$$
  
🎓 **TWOJA ROLA:**
- Jesteś profesjonalnym tutorem, który umie DOSTOSOWAĆ podejście
- Domyślnie pomagasz myśleć samodzielnie
- Ale gdy potrzeba - dajesz pełne, wzorcowe rozwiązanie
- Zawsze wyjaśniaj "dlaczego" - rozwijaj zrozumienie
- **NIE używaj imion uczniów** - nie znasz ich imienia
- Chwal postępy i buduj pewność siebie

📐 **FORMATOWANIE MATEMATYCZNE:**
- **ZAWSZE używaj LaTeX dla wzorów matematycznych**
- Wzory inline: otocz w pojedyncze $ np. $x^2 + 5$
- Wzory w osobnej linii: otocz w podwójne $$ np. $$\\frac{a}{b}$$
- Pierwiastki: $\\sqrt{x}$ lub $\\sqrt[3]{x}$
- Ułamki: $\\frac{licznik}{mianownik}$
- Potęgi: $x^2$, indeksy dolne: $x_1$
- PRZYKŁAD: "Liczba $(\\sqrt{32} - \\sqrt{2})^2$ jest równa..."

📝 **PYTANIE/PROŚBA UCZNIA:**
"${message}"

💡 **ODPOWIEDZ PROFESJONALNIE:**
- Krótko i zwięźle (max 300 słów dla podpowiedzi, więcej jeśli pełne rozwiązanie)
- Po polsku
- Z emotikonami 🧮📐✨
- UŻYWAJ LaTeX dla wszystkich wzorów
- Jeśli uczeń prosi o rozwiązanie → pokaż pełne rozwiązanie krok po kroku
- Jeśli uczeń nie wie jak zacząć → zadaj pytania naprowadzające
- Zawsze wyjaśniaj "dlaczego" robisz dany krok`;

      try {
        // 🔥 Przygotuj parts - text + obrazy
        const parts: any[] = [{ text: tutorSystemPrompt }];
        
        // Dodaj obrazy jeśli są (Gemini wspiera inline data)
        if (imageUrls && imageUrls.length > 0) {
          for (const imageUrl of imageUrls) {
            try {
              // Konwertuj path to URL dla serwera
              const fullImagePath = imageUrl.startsWith('http') 
                ? imageUrl 
                : `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${imageUrl}`;
              
              console.log('📸 Fetching image:', fullImagePath);
              
              const imageResponse = await fetch(fullImagePath);
              const imageBuffer = await imageResponse.arrayBuffer();
              const base64Image = Buffer.from(imageBuffer).toString('base64');
              
              parts.push({
                inlineData: {
                  mimeType: 'image/png',
                  data: base64Image
                }
              });
            } catch (imgError) {
              console.error('❌ Error loading image:', imageUrl, imgError);
            }
          }
        }

        const chat = model.startChat({
          history: conversationHistory.messages.slice(0, -1).map(msg => ({
            role: msg.role,
            parts: [{ text: msg.parts }]
          })),
          generationConfig: {
            temperature: 0.8,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 1000,
          }
        });

        const result = await chat.sendMessage(parts);
        const response = result.response.text();

        console.log('✅ Tutoring response generated (with images)');
        addMessageToHistory(sessionId, 'model', response);

        return NextResponse.json({
          response,
          sessionId,
          helpMode: true,
          problemId
        });
      } catch (error) {
        console.error('❌ Error in help mode:', error);
        return NextResponse.json({
          response: '😅 **Przepraszam, mam problem z połączeniem...**\n\nSpróbuj jeszcze raz za chwilę, albo skontaktuj się bezpośrednio z Patrykiem: **+48 662 581 368**',
          sessionId
        }, { status: 500 });
      }
      } // Zamknięcie else (tutoring mode)
    }
    
    // Używamy cache tylko gdy nie ma wcześniejszej historii
    if (conversationHistory.messages.length <= 1) {
      const cached = getCachedResponse(message);
      if (cached) {
        console.log('📦 Returning cached response');
        
        // Dodajemy odpowiedź z cache do historii
        addMessageToHistory(sessionId, 'model', cached.response);
        
        return NextResponse.json({
          response: cached.response,
          buttons: cached.buttons || [],
          cached: true,
          sessionId
        });
      }
    }

    // Detect user intent
    const intent = detectIntent(message);
    console.log(`🎯 Detected intent: ${intent}`);

    // 1. BOOKING - zwróć specjalną odpowiedź która wywoła booking w frontend
    if (intent === 'booking') {
      console.log('🎯 Booking intent detected in API - triggering frontend booking');
      
      const bookingResponse = '🎯 **Świetnie! Zarezerwujmy termin.**\n\n📚 **Z jakiego przedmiotu potrzebujesz pomocy?**';
      
      // Dodajemy odpowiedź do historii
      addMessageToHistory(sessionId, 'model', bookingResponse);
      
      return NextResponse.json({
        response: bookingResponse,
        triggerBooking: true, // Specjalny flag dla frontend
        buttons: [
          { text: '🧮 Matematyka', onClick: 'selectSubject("Matematyka")', variant: 'primary', icon: '🧮' },
          { text: '🇬🇧 Angielski', onClick: 'selectSubject("Angielski")', variant: 'secondary', icon: '🇬🇧' },
          { text: '💻 Programowanie', onClick: 'selectSubject("Programowanie")', variant: 'outline', icon: '💻' }
        ],
        sessionId
      });
    }

    // 2. FAQ, PRICES, CONTACT, SERVICES, TESTIMONIALS, MATERIALS - użyj fallback
    const fallbackIntents: UserIntent[] = [
      'faq', 'price', 'contact', 
      'service_math', 'service_english', 'service_programming', 
      'service_webdev', 'service_ai',
      'testimonials', 'materials'
    ];

    if (fallbackIntents.includes(intent)) {
      console.log('💾 Using fallback response');
      const fallbackResponse = getFallbackResponse(message);
      
      if (fallbackResponse) {
        // Dodajemy odpowiedź do historii
        addMessageToHistory(sessionId, 'model', fallbackResponse.response);
        
        // Cache tylko jeśli to pierwsze pytanie
        if (conversationHistory.messages.length <= 2) {
          setCachedResponse(message, fallbackResponse.response, fallbackResponse.buttons);
        }
        
        return NextResponse.json({
          response: fallbackResponse.response,
          buttons: fallbackResponse.buttons || [],
          fallback: true,
          sessionId
        });
      }
    }

    // 3. MATH_QUESTION, ENGLISH_QUESTION, PROGRAMMING_QUESTION - użyj Gemini
    const geminiIntents: UserIntent[] = ['math_question', 'english_question', 'programming_question'];
    
    if (geminiIntents.includes(intent) || intent === 'unknown') {
      console.log('🤖 Using Gemini API');

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash-exp',
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 800,
        }
      });
      
      // Tworzenie kontekstu z historii
      const chatHistory = conversationHistory.messages.slice(0, -1); // bez ostatniej wiadomości
      
      let chat;
      let systemPrompt = '';
      
      // Jeśli mamy historię, używamy chat.sendMessage zamiast generateContent
      if (chatHistory.length > 0) {
        chat = model.startChat({
          history: chatHistory.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.parts }]
          })),
          generationConfig: {
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 800,
          }
        });
      }

      // Przygotowanie systemPrompt zgodnie z intencją
      switch (intent) {
        case 'math_question':
          systemPrompt = `Jesteś KORKUŚ - AI asystent korepetycji MATEMATYKI Patryka Kuleszy.

TWOJA ROLA:
- Pomagasz rozwiązywać zadania matematyczne
- Wyjaśniasz kroki rozwiązania
- Pokazujesz wzory i metody

ZASADY:
1. ZAWSZE wspominaj o Patryku Kuleszy jako nauczycielu matematyki
2. Odpowiadaj po polsku
3. Pokazuj szczegółowe kroki rozwiązania
4. Używaj emotikonów 🧮📐📊
5. Zachęcaj do umówienia korepetycji

📐 **FORMATOWANIE MATEMATYCZNE:**
- ZAWSZE używaj LaTeX dla wzorów matematycznych
- Wzory inline: $x^2 + 5$, $\\frac{a}{b}$, $\\sqrt{x}$
- Wzory display: $$\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$
- Przykłady: $2x + 3 = 7$, $\\sin(x)$, $x^{2n+1}$
- UŻYWAJ LaTeX dla wszystkich wzorów matematycznych!

Pytanie ucznia: "${message}"

Odpowiedz krótko (max 300 słów) i praktycznie.`;
          break;

        case 'english_question':
          systemPrompt = `Jesteś KORKUŚ - AI asystent korepetycji ANGIELSKIEGO Patryka Kuleszy.

TWOJA ROLA:
- Pomagasz z angielskim (gramatyka, tłumaczenia, konwersacje)
- Wyjaśniasz reguły gramatyczne
- Dajesz przykłady użycia

ZASADY:
1. ZAWSZE wspominaj o Patryku Kuleszy (certyfikat C2) jako nauczycielu angielskiego
2. Odpowiadaj po polsku (chyba że pytanie wymaga angielskiego)
3. Dawaj konkretne przykłady
4. Używaj emotikonów 🇬🇧📚✍️
5. Zachęcaj do umówienia korepetycji

Pytanie ucznia: "${message}"

Odpowiedz krótko (max 300 słów) i praktycznie.`;
          break;

        case 'programming_question':
          systemPrompt = `Jesteś KORKUŚ - AI asystent korepetycji PROGRAMOWANIA Patryka Kuleszy.

TWOJA ROLA:
- Pomagasz z programowaniem (Python, JavaScript, React, Next.js)
- Wyjaśniasz kod i algorytmy
- Pokazujesz best practices

ZASADY:
1. ZAWSZE wspominaj o Patryku Kuleszy (technik informatyk) jako nauczycielu programowania
2. Odpowiadaj po polsku
3. Dawaj konkretne przykłady kodu
4. Używaj emotikonów 💻🐍⚛️
5. Zachęcaj do umówienia korepetycji

Pytanie ucznia: "${message}"

Odpowiedz krótko (max 300 słów) i praktycznie.`;
          break;

        default: // unknown
          systemPrompt = `Jesteś KORKUŚ - AI chatbot asystent korepetycji Patryka Kuleszy.

TWOJA ROLA:
- Pomagasz w matematyce, angielskim i programowaniu
- Promuj korepetycje Patryka Kuleszy
- Kieruj na odpowiednie strony

WAŻ NE ZASADY:
1. ZAWSZE wspominaj o Patryku Kuleszy jako autorze i nauczycielu
2. Odpowiadaj po polsku (chyba że pytanie dotyczy angielskiego)
3. Bądź pomocny, cierpliwy i motywujący
4. Dla zadań matematycznych: pokazuj kroki rozwiązania
5. Dla angielskiego: wyjaśniaj gramatykę i podawaj przykłady
6. Dla programowania: dawaj konkretne przykłady kodu
7. Kieruj na odpowiednie strony (/matematyka, /angielski, /programowanie)
8. Używaj emotikonów 📚🧮💻

TEMATYKA: korepetycje, edukacja, nauka
UNIKAJ: tematów niezwiązanych z edukacją

Pytanie ucznia: "${message}"

Odpowiedz krótko (max 300 słów) i praktycznie.`;
      }

      // Wywołanie odpowiedniego API w zależności od historii
      let result;
      if (chat && chatHistory.length > 0) {
        // Używamy czatu z historią konwersacji
        result = await chat.sendMessage(message);
      } else {
        // Używamy jednorazowego generowania
        result = await model.generateContent(systemPrompt);
      }

      const response = result.response;
      const aiResponse = response.text();

      // Dodajemy odpowiedź do historii
      addMessageToHistory(sessionId, 'model', aiResponse);

      // Inteligentne przyciski na podstawie intencji
      let smartButtons: ChatButton[] = [];
      
      switch (intent) {
        case 'math_question':
          smartButtons = [
            { text: '📖 Więcej materiałów', href: '/matematyka', variant: 'primary', icon: '📖' },
            { text: '📅 Umów korepetycje', onClick: 'startBooking()', variant: 'secondary', icon: '📅' }
          ];
          break;

        case 'english_question':
          smartButtons = [
            { text: '📚 Materiały angielski', href: '/angielski', variant: 'primary', icon: '📚' },
            { text: '📅 Umów lekcje', onClick: 'startBooking()', variant: 'secondary', icon: '📅' }
          ];
          break;

        case 'programming_question':
          smartButtons = [
            { text: '💾 Materiały IT', href: '/programowanie', variant: 'primary', icon: '💾' },
            { text: '📅 Umów korepetycje', onClick: 'startBooking()', variant: 'secondary', icon: '📅' }
          ];
          break;

        default:
          smartButtons = [
            { text: '🧮 Matematyka', href: '/matematyka', variant: 'primary', icon: '🧮' },
            { text: '🇬🇧 Angielski', href: '/angielski', variant: 'secondary', icon: '🇬🇧' },
            { text: '💻 Programowanie', href: '/programowanie', variant: 'outline', icon: '💻' }
          ];
      }

      // Cache response tylko jeśli to pierwsze pytanie
      if (conversationHistory.messages.length <= 2) {
        setCachedResponse(message, aiResponse, smartButtons);
      }

      return NextResponse.json({
        response: aiResponse,
        buttons: smartButtons,
        apiUsed: true,
        sessionId
      });
    }

    // 4. Fallback dla wszystkiego innego
    console.log('💾 Using default fallback');
    const defaultResponse = getDefaultResponse();
    
    // Dodajemy odpowiedź do historii
    addMessageToHistory(sessionId, 'model', defaultResponse.response);
    
    // Cache tylko jeśli to pierwsze pytanie
    if (conversationHistory.messages.length <= 2) {
      setCachedResponse(message, defaultResponse.response, defaultResponse.buttons);
    }
    
    return NextResponse.json({
      response: defaultResponse.response,
      buttons: defaultResponse.buttons || [],
      fallback: true,
      sessionId
    });

  } catch (error) {
    console.error('❌ Błąd chatbota:', error);

    // Error fallback
    try {
      const { message, sessionId = crypto.randomUUID() } = await req.json().catch(() => ({ message: '', sessionId: crypto.randomUUID() }));
      
      if (isEducationRelated(message)) {
        const fallback = getFallbackResponse(message) || getDefaultResponse();
        return NextResponse.json({
          response: fallback.response,
          buttons: fallback.buttons || [],
          fallback: true,
          sessionId
        }, { status: 200 });
      }
      
      return NextResponse.json({
        response: '😅 **Ups! Coś poszło nie tak...**\n\nSpróbuj ponownie za chwilę lub skontaktuj się bezpośrednio z **Patrykiem Kuleszą**!',
        buttons: [
          { text: '🔄 Spróbuj ponownie', onClick: 'location.reload()', variant: 'primary', icon: '🔄' },
          { text: '📞 Kontakt bezpośredni', href: 'tel:+48662581368', variant: 'secondary', icon: '📞' }
        ],
        sessionId
      }, { status: 500 });
    } catch {
      return NextResponse.json({
        response: '😅 **Ups! Coś poszło nie tak...**\n\nSpróbuj ponownie za chwilę lub skontaktuj się bezpośrednio z **Patrykiem Kuleszą**!',
        buttons: [
          { text: '🔄 Spróbuj ponownie', onClick: 'location.reload()', variant: 'primary', icon: '🔄' },
          { text: '📞 Kontakt bezpośredni', href: 'tel:+48662581368', variant: 'secondary', icon: '📞' }
        ]
      }, { status: 500 });
    }
  }
}