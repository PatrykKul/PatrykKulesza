/**
 * Fallback responses dla chatbota KORKUŚ
 * 
 * System odpowiedzi awaryjnych dla podstawowych pytań o korepetycje
 * bez potrzeby użycia Gemini API
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

/**
 * Sprawdza czy wiadomość dotyczy korepetycji i zwraca odpowiedni fallback
 */
export function getFallbackResponse(message: string): FallbackResponse | null {
  const lowerMessage = message.toLowerCase();
  
  // Matematyka - tylko ogólne pytania o usługę, nie konkretne zadania
  if ((lowerMessage.includes('matematyka') || lowerMessage.includes('matma')) && !lowerMessage.match(/\d/)) {
    return {
      response: '🧮 **Świetnie! Matematyka to moja mocna strona!**\n\nMogę pomóc Ci z:\n• Równania i nierówności\n• Funkcje i wykresy\n• Geometria i trygonometria\n• Zadania tekstowe\n• Przygotowanie do egzaminów\n\n📚 **Patryk Kulesza** ma doświadczenie w nauczaniu matematyki na wszystkich poziomach!',
      buttons: [
        {
          text: '📖 Materiały z matmy',
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
      ]
    };
  }
  
  // Angielski - tylko ogólne pytania, nie konkretne tłumaczenia
  if ((lowerMessage.includes('angielski') || lowerMessage.includes('english')) && !lowerMessage.includes('przetłumacz') && !lowerMessage.includes('translate')) {
    return {
      response: '🇬🇧 **Excellent! Let\'s learn English together!**\n\nPomogę Ci z:\n• Gramatyka i składnia\n• Tłumaczenia tekstów\n• Przygotowanie do egzaminów\n• Konwersacje i wymowa\n• Słownictwo tematyczne\n\n🎓 **Patryk Kulesza** prowadzi korepetycje angielskiego dla wszystkich poziomów!',
      buttons: [
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
      ]
    };
  }
  
  // Programowanie - tylko ogólne pytania, nie konkretne zadania kodowe
  if (lowerMessage.includes('programowanie') && !lowerMessage.includes('jak') && !lowerMessage.includes('napisać')) {
    return {
      response: '💻 **Coding time! Programowanie to przyszłość!**\n\nNauczę Cię:\n• Python - od podstaw do zaawansowanych\n• JavaScript i rozwój web\n• Algorytmy i struktury danych\n• Projekty praktyczne\n• Przygotowanie do pracy\n\n🚀 **Patryk Kulesza** - doświadczony programista i nauczyciel!',
      buttons: [
        {
          text: '💾 Materiały programowanie',
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
      ]
    };
  }
  
  // Ogólne pytania o korepetycje
  if (lowerMessage.includes('korepetycje') || lowerMessage.includes('nauka') || lowerMessage.includes('pomoc') || lowerMessage.includes('nauczyciel')) {
    return {
      response: '🎓 **Witaj w świecie korepetycji z Patrykiem Kuleszą!**\n\nOfuruję profesjonalne korepetycje z:\n• 🧮 **Matematyki** - wszystkie poziomy\n• 🇬🇧 **Angielskiego** - od podstaw do B2+\n• 💻 **Programowania** - Python, JS, algorytmy\n\n✨ **Dlaczego ja?**\n• Indywidualne podejście\n• Materiały dostosowane do Ciebie\n• Doświadczenie i pasja\n• Elastyczne terminy',
      buttons: [
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
      ]
    };
  }
  
  // Kontakt/ceny - tylko pytania o cenę/kontakt, nie matematyczne "ile"
  if (lowerMessage.includes('kontakt') || lowerMessage.includes('cena') || lowerMessage.includes('koszt') || (lowerMessage.includes('ile') && (lowerMessage.includes('kosztuje') || lowerMessage.includes('płacę') || lowerMessage.includes('zł'))) || lowerMessage.includes('umów')) {
    return {
      response: '📞 **Skontaktuj się ze mną!**\n\n💰 **Ceny korepetycji:**\n• Matematyka: od 60zł/h\n• Angielski: od 60zł/h\n• Programowanie: od 80zł/h\n\n📅 **Elastyczne terminy:**\n• Lekcje online i stacjonarne\n• Dostosowanie do Twojego harmonogramu\n• Pierwsze spotkanie diagnostyczne\n\n🎁 **Bonus:** Materiały i ćwiczenia gratis!',
      buttons: [
        {
          text: '📞 Zadzwoń teraz',
          href: 'tel:+48123456789',
          variant: 'primary',
          icon: '📞'
        },
        {
          text: '📧 Napisz email',
          href: 'mailto:patryk@example.com',
          variant: 'secondary',
          icon: '📧'
        }
      ]
    };
  }
  
  // Brak dopasowania - nie ma fallback
  return null;
}

/**
 * Sprawdza czy wiadomość jest związana z korepetycjami
 */
export function isEducationRelated(message: string): boolean {
  const educationKeywords = [
    'matematyka', 'matma', 'równanie', 'zadanie', 'liczenie',
    'angielski', 'english', 'tłumacz', 'gramatyka', 'słówka',
    'programowanie', 'python', 'javascript', 'kod', 'algorytm',
    'korepetycje', 'nauka', 'pomoc', 'nauczyciel', 'egzamin',
    'kontakt', 'cena', 'koszt', 'umów', 'lekcje'
  ];
  
  const lowerMessage = message.toLowerCase();
  return educationKeywords.some(keyword => lowerMessage.includes(keyword));
}

/**
 * Domyślna odpowiedź dla pytań niezwiązanych z korepetycjami
 */
export function getDefaultResponse(): FallbackResponse {
  return {
    response: '🤔 **Hmm, nie jestem pewny jak Ci z tym pomóc...**\n\nJestem KORKUŚ - specjalizuję się w korepetycjach!\n\n🎯 **Zapytaj mnie o:**\n• 🧮 Zadania z matematyki\n• 🇬🇧 Naukę angielskiego\n• 💻 Programowanie i kod\n• 📚 Materiały do nauki\n\n👨‍🏫 **Patryk Kulesza** chętnie Ci pomoże!',
    buttons: [
      {
        text: '🧮 Pomoc z matmą',
        onClick: 'handleQuickMessage("Pomóż mi z zadaniem z matematyki")',
        variant: 'primary',
        icon: '🧮'
      },
      {
        text: '🇬🇧 Nauka angielskiego',
        onClick: 'handleQuickMessage("Chcę się uczyć angielskiego")',
        variant: 'secondary',
        icon: '🇬🇧'
      },
      {
        text: '💻 Programowanie',
        onClick: 'handleQuickMessage("Pomóż mi z programowaniem")',
        variant: 'outline',
        icon: '💻'
      }
    ]
  };
}