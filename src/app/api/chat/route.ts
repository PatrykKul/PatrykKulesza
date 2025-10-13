import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getFallbackResponse, isEducationRelated, getDefaultResponse } from '@/components/chatbot/fallback';

// Definicja typu dla przycisku
interface ChatButton {
  text: string;
  href?: string;
  onClick?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: string;
}

// Rate limiting - prosty cache w pamięci (w produkcji użyj Redis)
const requestCache = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT = 10; // 10 zapytań na IP
const WINDOW_MS = 15 * 60 * 1000; // 15 minut

// Cache odpowiedzi (opcjonalne)
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
    console.log('📝 Otrzymano wiadomość:', message);
    
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
          {
            text: '📖 Matematyka',
            href: '/matematyka',
            variant: 'primary',
            icon: '📖'
          },
          {
            text: '📚 Angielski',
            href: '/angielski',
            variant: 'secondary',
            icon: '📚'
          },
          {
            text: '💾 Programowanie',
            href: '/programowanie',
            variant: 'outline',
            icon: '💾'
          }
        ]
      }, { status: 429 });
    }

    // Cache check
    const cached = getCachedResponse(message);
    if (cached) {
      return NextResponse.json({
        response: cached.response,
        buttons: cached.buttons || [],
        cached: true
      });
    }

    // Fallback check - jeśli pytanie dotyczy korepetycji
    const fallbackResponse = getFallbackResponse(message);
    if (fallbackResponse) {
      console.log('💾 Używam fallback response');
      setCachedResponse(message, fallbackResponse.response, fallbackResponse.buttons);
      return NextResponse.json({
        response: fallbackResponse.response,
        buttons: fallbackResponse.buttons || [],
        fallback: true
      });
    }

    console.log('🤖 Używam Gemini API');

    // Gemini API dla bardziej złożonych pytań
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 500,
      }
    });

    const prompt = `Jesteś KORKUŚ - AI chatbot asystent korepetycji Patryka Kuleszy.

TWOJA ROLA:
- Pomagasz w matematyce (równania, zadania, wyjaśnienia)
- Uczysz angielskiego (gramatyka, tłumaczenia, konwersacje)  
- Wspomagasz w programowaniu (Python, JavaScript, algorytmy, kod)
- Promuj korepetycje Patryka Kuleszy

WAŻNE ZASADY:
1. ZAWSZE wspominaj o Patryku Kuleszy jako autorze i nauczycielu
2. Odpowiadaj po polsku (chyba że pytanie dotyczy angielskiego)
3. Bądź pomocny, cierpliwy i motywujący
4. Dla zadań matematycznych: pokazuj kroki rozwiązania
5. Dla angielskiego: wyjaśniaj gramatykę i podawaj przykłady
6. Dla programowania: dawaj konkretne przykłady kodu
7. Kieruj na odpowiednie strony (/matematyka, /angielski, /programowanie)

TEMATYKA: korepetycje, edukacja, nauka
UNIKAJ: tematów niezwiązanych z edukacją

Pytanie ucznia: "${message}"

Odpowiedz krótko (max 200 słów) i praktycznie. Używaj emotikonów 📚🧮💻`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const aiResponse = response.text();

    // Inteligentne przyciski na podstawie treści pytania
    let smartButtons: ChatButton[] = [];
    
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('matematyka') || lowerMessage.includes('równanie') || lowerMessage.includes('zadanie')) {
      smartButtons = [
        {
          text: '📖 Więcej materiałów',
          href: '/matematyka',
          variant: 'primary',
          icon: '📖'
        },
        {
          text: '📞 Umów korepetycje',
          href: '/kontakt',
          variant: 'secondary',
          icon: '📞'
        }
      ];
    } else if (lowerMessage.includes('angielski') || lowerMessage.includes('english') || lowerMessage.includes('tłumacz')) {
      smartButtons = [
        {
          text: '📚 Materiały angielski',
          href: '/angielski',
          variant: 'primary',
          icon: '📚'
        },
        {
          text: '📞 Umów lekcje',
          href: '/kontakt',
          variant: 'secondary',
          icon: '📞'
        }
      ];
    } else if (lowerMessage.includes('programowanie') || lowerMessage.includes('python') || lowerMessage.includes('javascript') || lowerMessage.includes('kod')) {
      smartButtons = [
        {
          text: '💾 Materiały IT',
          href: '/programowanie',
          variant: 'primary',
          icon: '💾'
        },
        {
          text: '📞 Umów korepetycje',
          href: '/kontakt',
          variant: 'secondary',
          icon: '📞'
        }
      ];
    } else {
      // Domyślne przyciski dla ogólnych pytań
      smartButtons = [
        {
          text: '🧮 Matematyka',
          href: '/matematyka',
          variant: 'primary',
          icon: '🧮'
        },
        {
          text: '🇬🇧 Angielski',
          href: '/angielski',
          variant: 'secondary',
          icon: '🇬🇧'
        },
        {
          text: '💻 Programowanie',
          href: '/programowanie',
          variant: 'outline',
          icon: '💻'
        }
      ];
    }

    // Cache response
    setCachedResponse(message, aiResponse, smartButtons);

    return NextResponse.json({
      response: aiResponse,
      buttons: smartButtons,
      apiUsed: true
    });

  } catch (error) {
    console.error('❌ Błąd chatbota:', error);

    // Error fallback - sprawdź czy pytanie dotyczy edukacji
    const { message } = await req.json().catch(() => ({ message: '' }));
    
    if (isEducationRelated(message)) {
      const fallback = getFallbackResponse(message) || getDefaultResponse();
      return NextResponse.json({
        response: fallback.response,
        buttons: fallback.buttons || [],
        fallback: true
      }, { status: 200 });
    }

    return NextResponse.json({
      response: '😅 **Ups! Coś poszło nie tak...**\n\nSpróbuj ponownie za chwilę lub skontaktuj się bezpośrednio z **Patrykiem Kuleszą**!',
      buttons: [
        {
          text: '🔄 Spróbuj ponownie',
          onClick: 'location.reload()',
          variant: 'primary',
          icon: '🔄'
        },
        {
          text: '📞 Kontakt bezpośredni',
          href: '/kontakt',
          variant: 'secondary',
          icon: '📞'
        }
      ]
    }, { status: 500 });
  }
}