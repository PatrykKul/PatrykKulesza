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

// Rate limiting - prosty cache (w produkcji użyj Redis)
const requestCache = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT = 20; // 20 zapytań na IP
const WINDOW_MS = 15 * 60 * 1000; // 15 minut

// Cache odpowiedzi
const responseCache = new Map<string, { response: string; timestamp: number; buttons?: ChatButton[] }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minut

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

export async function POST(req: NextRequest) {
  console.log('🤖 API Chat endpoint called');
  
  try {
    const { message } = await req.json();
    console.log('📝 Received message:', message);
    
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { response: 'Proszę napisać wiadomość! 😊' },
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
        ]
      }, { status: 429 });
    }

    // Cache check
    const cached = getCachedResponse(message);
    if (cached) {
      console.log('📦 Returning cached response');
      return NextResponse.json({
        response: cached.response,
        buttons: cached.buttons || [],
        cached: true
      });
    }

    // Detect user intent
    const intent = detectIntent(message);
    console.log(`🎯 Detected intent: ${intent}`);

    // 1. BOOKING - nie obsługuj tutaj, to jest w frontendzie
    if (intent === 'booking') {
      // To nie powinno się zdarzyć bo booking jest wykrywany w frontendzie
      // Ale gdyby dotarło tutaj, zwróć fallback
      const fallback = getFallbackResponse(message);
      if (fallback) {
        return NextResponse.json({
          response: fallback.response,
          buttons: fallback.buttons || [],
          fallback: true
        });
      }
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
        setCachedResponse(message, fallbackResponse.response, fallbackResponse.buttons);
        return NextResponse.json({
          response: fallbackResponse.response,
          buttons: fallbackResponse.buttons || [],
          fallback: true
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

      // Prompt dostosowany do intencji
      let systemPrompt = '';
      
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

      const result = await model.generateContent(systemPrompt);
      const response = result.response;
      const aiResponse = response.text();

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

      // Cache response
      setCachedResponse(message, aiResponse, smartButtons);

      return NextResponse.json({
        response: aiResponse,
        buttons: smartButtons,
        apiUsed: true
      });
    }

    // 4. Fallback dla wszystkiego innego
    console.log('💾 Using default fallback');
    const defaultResponse = getDefaultResponse();
    
    setCachedResponse(message, defaultResponse.response, defaultResponse.buttons);
    
    return NextResponse.json({
      response: defaultResponse.response,
      buttons: defaultResponse.buttons || [],
      fallback: true
    });

  } catch (error) {
    console.error('❌ Błąd chatbota:', error);

    // Error fallback
    try {
      const { message } = await req.json().catch(() => ({ message: '' }));
      
      if (isEducationRelated(message)) {
        const fallback = getFallbackResponse(message) || getDefaultResponse();
        return NextResponse.json({
          response: fallback.response,
          buttons: fallback.buttons || [],
          fallback: true
        }, { status: 200 });
      }
    } catch {}

    return NextResponse.json({
      response: '😅 **Ups! Coś poszło nie tak...**\n\nSpróbuj ponownie za chwilę lub skontaktuj się bezpośrednio z **Patrykiem Kuleszą**!',
      buttons: [
        { text: '🔄 Spróbuj ponownie', onClick: 'location.reload()', variant: 'primary', icon: '🔄' },
        { text: '📞 Kontakt bezpośredni', href: 'tel:+48662581368', variant: 'secondary', icon: '📞' }
      ]
    }, { status: 500 });
  }
}