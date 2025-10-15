/**
 * 🧪 KORKUŚ CHATBOT - COMPREHENSIVE TEST SUITE
 * 
 * 100 scenariuszy testowych pokrywających wszystkie ścieżki konwersacji
 * Uruchom: npx ts-node tests/chatbot-comprehensive-test.ts
 */

interface TestCase {
  id: number;
  category: string;
  input: string;
  expectedIntent: string;
  expectedFeatures: string[];
  priority: 'critical' | 'high' | 'medium' | 'low';
}

const testCases: TestCase[] = [
  // ==================== BOOKING FLOW (Critical) ====================
  {
    id: 1,
    category: 'Booking',
    input: 'Chcę umówić korepetycje',
    expectedIntent: 'booking',
    expectedFeatures: ['triggerBooking', 'subject selection buttons'],
    priority: 'critical'
  },
  {
    id: 2,
    category: 'Booking',
    input: 'Jak się zapisać na lekcje?',
    expectedIntent: 'booking',
    expectedFeatures: ['triggerBooking'],
    priority: 'critical'
  },
  {
    id: 3,
    category: 'Booking',
    input: 'Chciałbym zarezerwować termin',
    expectedIntent: 'booking',
    expectedFeatures: ['triggerBooking'],
    priority: 'critical'
  },
  {
    id: 4,
    category: 'Booking',
    input: 'Jak mogę się umówić?',
    expectedIntent: 'booking',
    expectedFeatures: ['triggerBooking'],
    priority: 'critical'
  },
  {
    id: 5,
    category: 'Booking',
    input: 'zapisz mnie na korepetycje',
    expectedIntent: 'booking',
    expectedFeatures: ['triggerBooking'],
    priority: 'critical'
  },

  // ==================== ZADANIA - AUTO DETECTION (Critical) ====================
  {
    id: 6,
    category: 'Problem Help - Auto',
    input: 'pomóż mi z zadaniem',
    expectedIntent: 'help_with_current_problem',
    expectedFeatures: ['auto-detect current problem', 'use ExamContext', 'helpMode'],
    priority: 'critical'
  },
  {
    id: 7,
    category: 'Problem Help - Auto',
    input: 'jak rozwiązać to zadanie?',
    expectedIntent: 'help_with_current_problem',
    expectedFeatures: ['auto-detect', 'ExamContext.currentProblem'],
    priority: 'critical'
  },
  {
    id: 8,
    category: 'Problem Help - Auto',
    input: 'nie rozumiem tego',
    expectedIntent: 'help_with_current_problem',
    expectedFeatures: ['auto-detect', 'problem context'],
    priority: 'critical'
  },
  {
    id: 9,
    category: 'Problem Help - Auto',
    input: 'wyjaśnij mi to',
    expectedIntent: 'help_with_current_problem',
    expectedFeatures: ['auto-detect', 'tutoring mode'],
    priority: 'critical'
  },
  {
    id: 10,
    category: 'Problem Help - Auto',
    input: 'podpowiedź',
    expectedIntent: 'help_with_current_problem',
    expectedFeatures: ['auto-detect', 'hints first'],
    priority: 'critical'
  },

  // ==================== ZADANIA - SPECIFIC NUMBER (High) ====================
  {
    id: 11,
    category: 'Problem Help - Specific',
    input: 'jak rozwiązać zadanie 5?',
    expectedIntent: 'help_with_specific_problem',
    expectedFeatures: ['extract problem number', 'find problem in allProblems', 'helpMode'],
    priority: 'high'
  },
  {
    id: 12,
    category: 'Problem Help - Specific',
    input: 'pomóż z zadaniem nr 12',
    expectedIntent: 'help_with_specific_problem',
    expectedFeatures: ['regex detection', 'problem 12'],
    priority: 'high'
  },
  {
    id: 13,
    category: 'Problem Help - Specific',
    input: 'zadanie 3 nie wychodzi',
    expectedIntent: 'help_with_specific_problem',
    expectedFeatures: ['extract number 3'],
    priority: 'high'
  },
  {
    id: 14,
    category: 'Problem Help - Specific',
    input: 'wyjaśnij zadanie numer 8',
    expectedIntent: 'help_with_specific_problem',
    expectedFeatures: ['problem 8', 'tutoring'],
    priority: 'high'
  },
  {
    id: 15,
    category: 'Problem Help - Specific',
    input: 'jak zrobić zadanie 21?',
    expectedIntent: 'help_with_specific_problem',
    expectedFeatures: ['problem 21'],
    priority: 'high'
  },

  // ==================== ZADANIA - FULL SOLUTION (High) ====================
  {
    id: 16,
    category: 'Problem Help - Full Solution',
    input: 'pokaż pełne rozwiązanie',
    expectedIntent: 'request_full_solution',
    expectedFeatures: ['full solution', 'step by step', 'LaTeX'],
    priority: 'high'
  },
  {
    id: 17,
    category: 'Problem Help - Full Solution',
    input: 'daj kompletne rozwiązanie',
    expectedIntent: 'request_full_solution',
    expectedFeatures: ['complete solution'],
    priority: 'high'
  },
  {
    id: 18,
    category: 'Problem Help - Full Solution',
    input: 'chcę zobaczyć wzorcowe rozwiązanie',
    expectedIntent: 'request_full_solution',
    expectedFeatures: ['model solution'],
    priority: 'high'
  },

  // ==================== OFF-TOPIC podczas HELP MODE (High) ====================
  {
    id: 19,
    category: 'Context Switch',
    input: 'nie chodzi mi o zadanie, chcę się umówić',
    expectedIntent: 'booking',
    expectedFeatures: ['detect off-topic', 'switch from help mode', 'booking'],
    priority: 'high'
  },
  {
    id: 20,
    category: 'Context Switch',
    input: 'to nie o to pytam, ile kosztują korepetycje?',
    expectedIntent: 'price',
    expectedFeatures: ['detect topic change', 'pricing info'],
    priority: 'high'
  },
  {
    id: 21,
    category: 'Context Switch',
    input: 'zmiana tematu - kto to Patryk Kulesza?',
    expectedIntent: 'about',
    expectedFeatures: ['context switch', 'about tutor'],
    priority: 'high'
  },

  // ==================== FAQ (Medium) ====================
  {
    id: 22,
    category: 'FAQ',
    input: 'Jakie przedmioty uczysz?',
    expectedIntent: 'faq',
    expectedFeatures: ['subjects list', 'fallback response'],
    priority: 'medium'
  },
  {
    id: 23,
    category: 'FAQ',
    input: 'Czy robisz korepetycje online?',
    expectedIntent: 'faq',
    expectedFeatures: ['online lessons info'],
    priority: 'medium'
  },
  {
    id: 24,
    category: 'FAQ',
    input: 'Jak długo trwa lekcja?',
    expectedIntent: 'faq',
    expectedFeatures: ['lesson duration'],
    priority: 'medium'
  },
  {
    id: 25,
    category: 'FAQ',
    input: 'Czy pomagasz w egzaminach?',
    expectedIntent: 'faq',
    expectedFeatures: ['exam preparation'],
    priority: 'medium'
  },

  // ==================== PRICING (High) ====================
  {
    id: 26,
    category: 'Pricing',
    input: 'Ile kosztuje korepetycje?',
    expectedIntent: 'price',
    expectedFeatures: ['pricing info', 'call to action'],
    priority: 'high'
  },
  {
    id: 27,
    category: 'Pricing',
    input: 'Jaki jest cennik?',
    expectedIntent: 'price',
    expectedFeatures: ['pricing'],
    priority: 'high'
  },
  {
    id: 28,
    category: 'Pricing',
    input: 'Ile płacę za lekcję?',
    expectedIntent: 'price',
    expectedFeatures: ['lesson price'],
    priority: 'high'
  },

  // ==================== CONTACT (High) ====================
  {
    id: 29,
    category: 'Contact',
    input: 'Jak mogę się skontaktować?',
    expectedIntent: 'contact',
    expectedFeatures: ['phone', 'email', 'contact buttons'],
    priority: 'high'
  },
  {
    id: 30,
    category: 'Contact',
    input: 'Jaki masz numer telefonu?',
    expectedIntent: 'contact',
    expectedFeatures: ['phone number: +48 662 581 368'],
    priority: 'high'
  },
  {
    id: 31,
    category: 'Contact',
    input: 'Daj mi email',
    expectedIntent: 'contact',
    expectedFeatures: ['email'],
    priority: 'high'
  },

  // ==================== SERVICES - MATH (Medium) ====================
  {
    id: 32,
    category: 'Services - Math',
    input: 'Czego uczysz w matematyce?',
    expectedIntent: 'service_math',
    expectedFeatures: ['math topics', 'exam preparation'],
    priority: 'medium'
  },
  {
    id: 33,
    category: 'Services - Math',
    input: 'Pomagasz w maturze z matmy?',
    expectedIntent: 'service_math',
    expectedFeatures: ['matura preparation'],
    priority: 'medium'
  },

  // ==================== SERVICES - ENGLISH (Medium) ====================
  {
    id: 34,
    category: 'Services - English',
    input: 'Uczysz angielskiego?',
    expectedIntent: 'service_english',
    expectedFeatures: ['English lessons', 'C2 certificate'],
    priority: 'medium'
  },
  {
    id: 35,
    category: 'Services - English',
    input: 'Czy pomagasz w rozmówkach po angielsku?',
    expectedIntent: 'service_english',
    expectedFeatures: ['conversation practice'],
    priority: 'medium'
  },

  // ==================== SERVICES - PROGRAMMING (Medium) ====================
  {
    id: 36,
    category: 'Services - Programming',
    input: 'Uczysz programowania?',
    expectedIntent: 'service_programming',
    expectedFeatures: ['Python', 'JavaScript', 'React'],
    priority: 'medium'
  },
  {
    id: 37,
    category: 'Services - Programming',
    input: 'Czy mogę nauczyć się Pythona?',
    expectedIntent: 'service_programming',
    expectedFeatures: ['Python course'],
    priority: 'medium'
  },

  // ==================== MATH QUESTIONS (High) ====================
  {
    id: 38,
    category: 'Math Question',
    input: 'Jak rozwiązać równanie kwadratowe?',
    expectedIntent: 'math_question',
    expectedFeatures: ['Gemini API', 'LaTeX', 'math explanation'],
    priority: 'high'
  },
  {
    id: 39,
    category: 'Math Question',
    input: 'Co to jest pochodna?',
    expectedIntent: 'math_question',
    expectedFeatures: ['derivative explanation'],
    priority: 'high'
  },
  {
    id: 40,
    category: 'Math Question',
    input: 'Jak obliczyć pole trójkąta?',
    expectedIntent: 'math_question',
    expectedFeatures: ['triangle area formula'],
    priority: 'high'
  },

  // ==================== ENGLISH QUESTIONS (Medium) ====================
  {
    id: 41,
    category: 'English Question',
    input: 'Kiedy używać Present Perfect?',
    expectedIntent: 'english_question',
    expectedFeatures: ['grammar explanation', 'examples'],
    priority: 'medium'
  },
  {
    id: 42,
    category: 'English Question',
    input: 'Jak przetłumaczyć "already"?',
    expectedIntent: 'english_question',
    expectedFeatures: ['translation', 'usage examples'],
    priority: 'medium'
  },

  // ==================== PROGRAMMING QUESTIONS (Medium) ====================
  {
    id: 43,
    category: 'Programming Question',
    input: 'Jak działa pętla for w Pythonie?',
    expectedIntent: 'programming_question',
    expectedFeatures: ['Python syntax', 'code example'],
    priority: 'medium'
  },
  {
    id: 44,
    category: 'Programming Question',
    input: 'Co to jest React Hook?',
    expectedIntent: 'programming_question',
    expectedFeatures: ['React explanation'],
    priority: 'medium'
  },

  // ==================== MATERIALS (Medium) ====================
  {
    id: 45,
    category: 'Materials',
    input: 'Gdzie znajdę materiały?',
    expectedIntent: 'materials',
    expectedFeatures: ['materials links', 'navigation buttons'],
    priority: 'medium'
  },
  {
    id: 46,
    category: 'Materials',
    input: 'Masz jakieś zadania do ćwiczeń?',
    expectedIntent: 'materials',
    expectedFeatures: ['practice problems'],
    priority: 'medium'
  },

  // ==================== TESTIMONIALS (Low) ====================
  {
    id: 47,
    category: 'Testimonials',
    input: 'Jakie są opinie o tobie?',
    expectedIntent: 'testimonials',
    expectedFeatures: ['reviews', 'testimonials'],
    priority: 'low'
  },
  {
    id: 48,
    category: 'Testimonials',
    input: 'Co mówią twoi uczniowie?',
    expectedIntent: 'testimonials',
    expectedFeatures: ['student feedback'],
    priority: 'low'
  },

  // ==================== ABOUT TUTOR (Medium) ====================
  {
    id: 49,
    category: 'About',
    input: 'Kim jest Patryk Kulesza?',
    expectedIntent: 'about',
    expectedFeatures: ['tutor bio', 'qualifications'],
    priority: 'medium'
  },
  {
    id: 50,
    category: 'About',
    input: 'Jakie masz kwalifikacje?',
    expectedIntent: 'about',
    expectedFeatures: ['credentials'],
    priority: 'medium'
  },

  // ==================== EDGE CASES (Critical) ====================
  {
    id: 51,
    category: 'Edge Case',
    input: '',
    expectedIntent: 'error',
    expectedFeatures: ['validation error', '400 status'],
    priority: 'critical'
  },
  {
    id: 52,
    category: 'Edge Case',
    input: '   ',
    expectedIntent: 'error',
    expectedFeatures: ['empty message handling'],
    priority: 'critical'
  },
  {
    id: 53,
    category: 'Edge Case',
    input: 'a'.repeat(10000),
    expectedIntent: 'handled',
    expectedFeatures: ['long input handling', 'no crash'],
    priority: 'critical'
  },
  {
    id: 54,
    category: 'Edge Case',
    input: '<script>alert("XSS")</script>',
    expectedIntent: 'sanitized',
    expectedFeatures: ['XSS protection', 'sanitization'],
    priority: 'critical'
  },
  {
    id: 55,
    category: 'Edge Case',
    input: 'помощь с задачей', // Cyrylica
    expectedIntent: 'handled',
    expectedFeatures: ['unicode support'],
    priority: 'medium'
  },

  // ==================== CONTEXT PERSISTENCE (High) ====================
  {
    id: 56,
    category: 'Context',
    input: 'jak rozwiązać równanie?',
    expectedIntent: 'math_question',
    expectedFeatures: ['conversation history', 'sessionId'],
    priority: 'high'
  },
  {
    id: 57,
    category: 'Context',
    input: 'a co z tym które pytałem wcześniej?',
    expectedIntent: 'context_reference',
    expectedFeatures: ['history awareness'],
    priority: 'high'
  },

  // ==================== RATE LIMITING (Critical) ====================
  {
    id: 58,
    category: 'Rate Limit',
    input: 'test',
    expectedIntent: 'rate_limited',
    expectedFeatures: ['429 status after 20 requests', 'cooldown message'],
    priority: 'critical'
  },

  // ==================== CACHE (Medium) ====================
  {
    id: 59,
    category: 'Cache',
    input: 'Ile kosztuje korepetycje?',
    expectedIntent: 'price',
    expectedFeatures: ['cached response', 'faster response time'],
    priority: 'medium'
  },

  // ==================== ERROR HANDLING (Critical) ====================
  {
    id: 60,
    category: 'Error Handling',
    input: 'test without API key',
    expectedIntent: 'graceful_error',
    expectedFeatures: ['500 status', 'friendly error message', 'contact fallback'],
    priority: 'critical'
  },

  // ==================== MULTI-LANGUAGE (Low) ====================
  {
    id: 61,
    category: 'Multi-Language',
    input: 'How much does tutoring cost?',
    expectedIntent: 'price',
    expectedFeatures: ['English input handled', 'Polish response'],
    priority: 'low'
  },

  // ==================== LATEX RENDERING (High) ====================
  {
    id: 62,
    category: 'LaTeX',
    input: 'Pokaż wzór na deltę',
    expectedIntent: 'math_question',
    expectedFeatures: ['LaTeX formula', '$$ ... $$', 'proper rendering'],
    priority: 'high'
  },

  // ==================== IMAGE SUPPORT (High) ====================
  {
    id: 63,
    category: 'Images',
    input: 'pomóż z zadaniem',
    expectedIntent: 'help_with_images',
    expectedFeatures: ['image URLs in payload', 'multimodal Gemini', 'image analysis'],
    priority: 'high'
  },

  // ==================== EXAM CONTEXT (Critical) ====================
  {
    id: 64,
    category: 'Exam Context',
    input: 'pomóż z zadaniem',
    expectedIntent: 'help_with_exam_context',
    expectedFeatures: ['examInfo in payload', 'exam title', 'year', 'type'],
    priority: 'critical'
  },

  // ==================== CANVAS DATA (Medium) ====================
  {
    id: 65,
    category: 'Canvas',
    input: 'pomóż z zadaniem',
    expectedIntent: 'help_with_canvas',
    expectedFeatures: ['canvasData in context', 'user notes included'],
    priority: 'medium'
  },

  // ==================== USER ANSWER (High) ====================
  {
    id: 66,
    category: 'User Answer',
    input: 'czy moja odpowiedź jest dobra?',
    expectedIntent: 'check_answer',
    expectedFeatures: ['userAnswer in context', 'answer validation'],
    priority: 'high'
  },

  // ==================== NAVIGATION (Low) ====================
  {
    id: 67,
    category: 'Navigation',
    input: 'Gdzie znajdę zadania z matury?',
    expectedIntent: 'materials',
    expectedFeatures: ['link to /matematyka', 'navigation button'],
    priority: 'low'
  },

  // ==================== GREETINGS (Low) ====================
  {
    id: 68,
    category: 'Greeting',
    input: 'Cześć!',
    expectedIntent: 'greeting',
    expectedFeatures: ['friendly response', 'intro buttons'],
    priority: 'low'
  },
  {
    id: 69,
    category: 'Greeting',
    input: 'Hej',
    expectedIntent: 'greeting',
    expectedFeatures: ['welcome message'],
    priority: 'low'
  },

  // ==================== GOODBYE (Low) ====================
  {
    id: 70,
    category: 'Goodbye',
    input: 'Dziękuję, do widzenia',
    expectedIntent: 'goodbye',
    expectedFeatures: ['polite response', 'contact info'],
    priority: 'low'
  },

  // ==================== SPAM/GIBBERISH (Medium) ====================
  {
    id: 71,
    category: 'Spam',
    input: 'asdfghjkl',
    expectedIntent: 'unknown',
    expectedFeatures: ['default fallback', 'helpful redirect'],
    priority: 'medium'
  },
  {
    id: 72,
    category: 'Spam',
    input: '123456789',
    expectedIntent: 'unknown',
    expectedFeatures: ['default response'],
    priority: 'medium'
  },

  // ==================== POLITENESS (Low) ====================
  {
    id: 73,
    category: 'Politeness',
    input: 'Bardzo dziękuję za pomoc!',
    expectedIntent: 'gratitude',
    expectedFeatures: ['polite acknowledgment'],
    priority: 'low'
  },

  // ==================== COMPLAINTS (Medium) ====================
  {
    id: 74,
    category: 'Complaint',
    input: 'Nie rozumiem twojego wyjaśnienia',
    expectedIntent: 'complaint',
    expectedFeatures: ['empathy', 'offer alternative explanation'],
    priority: 'medium'
  },

  // ==================== MULTIPLE INTENTS (High) ====================
  {
    id: 75,
    category: 'Multiple Intents',
    input: 'Ile kosztuje korepetycje i jak się umówić?',
    expectedIntent: 'multiple',
    expectedFeatures: ['handle both price and booking'],
    priority: 'high'
  },

  // ==================== TYPOS (Medium) ====================
  {
    id: 76,
    category: 'Typo',
    input: 'jka rozwiazac zadnie?',
    expectedIntent: 'math_question',
    expectedFeatures: ['typo tolerance'],
    priority: 'medium'
  },

  // ==================== CASE SENSITIVITY (Medium) ====================
  {
    id: 77,
    category: 'Case Sensitivity',
    input: 'POMÓŻ MI Z ZADANIEM',
    expectedIntent: 'help_with_current_problem',
    expectedFeatures: ['case insensitive detection'],
    priority: 'medium'
  },

  // ==================== EMOJI (Low) ====================
  {
    id: 78,
    category: 'Emoji',
    input: '😊 Jak się umówić? 📅',
    expectedIntent: 'booking',
    expectedFeatures: ['emoji handling'],
    priority: 'low'
  },

  // ==================== MIXED CONTENT (Medium) ====================
  {
    id: 79,
    category: 'Mixed Content',
    input: 'Cześć! Jak rozwiązać x^2 + 5x + 6 = 0? Dzięki!',
    expectedIntent: 'math_question',
    expectedFeatures: ['extract math question'],
    priority: 'medium'
  },

  // ==================== FOLLOW-UP (High) ====================
  {
    id: 80,
    category: 'Follow-up',
    input: 'a co dalej?',
    expectedIntent: 'follow_up',
    expectedFeatures: ['context awareness', 'continue conversation'],
    priority: 'high'
  },

  // ==================== CLARIFICATION (Medium) ====================
  {
    id: 81,
    category: 'Clarification',
    input: 'Co masz na myśli?',
    expectedIntent: 'clarification',
    expectedFeatures: ['ask for more details'],
    priority: 'medium'
  },

  // ==================== COMPLEX MATH (High) ====================
  {
    id: 82,
    category: 'Complex Math',
    input: 'Wyjaśnij całki nieoznaczone',
    expectedIntent: 'math_question',
    expectedFeatures: ['advanced topic', 'detailed explanation'],
    priority: 'high'
  },

  // ==================== EXAM SPECIFIC (High) ====================
  {
    id: 83,
    category: 'Exam Specific',
    input: 'Jak przygotować się do matury rozszerzonej?',
    expectedIntent: 'exam_prep',
    expectedFeatures: ['matura advice', 'study plan'],
    priority: 'high'
  },
  {
    id: 84,
    category: 'Exam Specific',
    input: 'Egzamin ósmoklasisty - od czego zacząć?',
    expectedIntent: 'exam_prep',
    expectedFeatures: ['egzamin-8 guidance'],
    priority: 'high'
  },

  // ==================== TIME-RELATED (Medium) ====================
  {
    id: 85,
    category: 'Time',
    input: 'Kiedy masz wolne terminy?',
    expectedIntent: 'availability',
    expectedFeatures: ['booking suggestion'],
    priority: 'medium'
  },

  // ==================== LOCATION (Medium) ====================
  {
    id: 86,
    category: 'Location',
    input: 'Gdzie odbywają się korepetycje?',
    expectedIntent: 'location',
    expectedFeatures: ['Białystok', 'Zambrów', 'online'],
    priority: 'medium'
  },

  // ==================== AGE-SPECIFIC (Low) ====================
  {
    id: 87,
    category: 'Age',
    input: 'Uczysz dzieci w podstawówce?',
    expectedIntent: 'target_audience',
    expectedFeatures: ['age range info'],
    priority: 'low'
  },

  // ==================== PAYMENT (Medium) ====================
  {
    id: 88,
    category: 'Payment',
    input: 'Jak płacić za lekcje?',
    expectedIntent: 'payment',
    expectedFeatures: ['payment methods'],
    priority: 'medium'
  },

  // ==================== CANCELLATION (Medium) ====================
  {
    id: 89,
    category: 'Cancellation',
    input: 'Co jeśli muszę odwołać lekcję?',
    expectedIntent: 'cancellation',
    expectedFeatures: ['cancellation policy'],
    priority: 'medium'
  },

  // ==================== GROUP LESSONS (Low) ====================
  {
    id: 90,
    category: 'Group Lessons',
    input: 'Robisz zajęcia grupowe?',
    expectedIntent: 'group_lessons',
    expectedFeatures: ['group lesson info'],
    priority: 'low'
  },

  // ==================== RECOMMENDATIONS (Low) ====================
  {
    id: 91,
    category: 'Recommendations',
    input: 'Jakie podręczniki polecasz?',
    expectedIntent: 'recommendations',
    expectedFeatures: ['book recommendations'],
    priority: 'low'
  },

  // ==================== MOTIVATION (Low) ====================
  {
    id: 92,
    category: 'Motivation',
    input: 'Nie wiem czy dam radę zdać maturę',
    expectedIntent: 'motivation',
    expectedFeatures: ['motivational response', 'success rate'],
    priority: 'low'
  },

  // ==================== TECHNICAL ISSUES (Medium) ====================
  {
    id: 93,
    category: 'Technical',
    input: 'Nie działa mi strona',
    expectedIntent: 'technical_issue',
    expectedFeatures: ['technical support', 'contact info'],
    priority: 'medium'
  },

  // ==================== ACCESSIBILITY (Low) ====================
  {
    id: 94,
    category: 'Accessibility',
    input: 'Czy możesz pomóc osobie z dysleksją?',
    expectedIntent: 'accessibility',
    expectedFeatures: ['special needs support'],
    priority: 'low'
  },

  // ==================== COMPETITORS (Low) ====================
  {
    id: 95,
    category: 'Competitors',
    input: 'Czym różnisz się od innych korepetytorów?',
    expectedIntent: 'unique_value',
    expectedFeatures: ['USP', 'advantages'],
    priority: 'low'
  },

  // ==================== SUCCESS STORIES (Low) ====================
  {
    id: 96,
    category: 'Success Stories',
    input: 'Czy twoi uczniowie zdają egzaminy?',
    expectedIntent: 'success_rate',
    expectedFeatures: ['100% pass rate', 'testimonials'],
    priority: 'low'
  },

  // ==================== TRIAL LESSON (Medium) ====================
  {
    id: 97,
    category: 'Trial',
    input: 'Czy jest lekcja próbna?',
    expectedIntent: 'trial_lesson',
    expectedFeatures: ['trial info'],
    priority: 'medium'
  },

  // ==================== HOMEWORK HELP (Medium) ====================
  {
    id: 98,
    category: 'Homework',
    input: 'Pomożesz mi z pracą domową?',
    expectedIntent: 'homework_help',
    expectedFeatures: ['homework assistance'],
    priority: 'medium'
  },

  // ==================== STUDY TIPS (Low) ====================
  {
    id: 99,
    category: 'Study Tips',
    input: 'Jak się uczyć efektywnie?',
    expectedIntent: 'study_tips',
    expectedFeatures: ['learning strategies'],
    priority: 'low'
  },

  // ==================== COMPLEX SCENARIO (Critical) ====================
  {
    id: 100,
    category: 'Complex Scenario',
    input: 'Jestem na zadaniu 15 z matury 2024 rozszerzonej, nie rozumiem jak obliczyć pole pod wykresem funkcji kwadratowej, mam już wyznaczone miejsce zerowe, co dalej?',
    expectedIntent: 'complex_help',
    expectedFeatures: [
      'auto-detect problem 15',
      'exam context (matura 2024 rozszerzona)',
      'understand multi-part question',
      'continuation from previous steps',
      'integral/area calculation help'
    ],
    priority: 'critical'
  }
];

// Funkcja uruchamiająca testy
async function runTests() {
  console.log('🧪 KORKUŚ CHATBOT - COMPREHENSIVE TEST SUITE\n');
  console.log(`📊 Total test cases: ${testCases.length}\n`);

  const results = {
    passed: 0,
    failed: 0,
    skipped: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0
  };

  const failedTests: TestCase[] = [];

  for (const testCase of testCases) {
    // Grupuj po priorytetach
    results[testCase.priority]++;

    console.log(`\n[${testCase.id}/100] ${testCase.category}: "${testCase.input.substring(0, 50)}${testCase.input.length > 50 ? '...' : ''}"`);
    console.log(`   Priority: ${testCase.priority.toUpperCase()}`);
    console.log(`   Expected: ${testCase.expectedIntent}`);
    console.log(`   Features: ${testCase.expectedFeatures.join(', ')}`);
    
    // TODO: Implement actual API call and verification
    // For now, mark as skipped
    console.log(`   Status: ⏭️  SKIPPED (awaiting implementation)`);
    results.skipped++;
  }

  // Podsumowanie
  console.log('\n\n' + '='.repeat(80));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total: ${testCases.length}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`⏭️  Skipped: ${results.skipped}`);
  console.log('\nBy Priority:');
  console.log(`🔴 Critical: ${results.critical}`);
  console.log(`🟠 High: ${results.high}`);
  console.log(`🟡 Medium: ${results.medium}`);
  console.log(`🟢 Low: ${results.low}`);

  if (failedTests.length > 0) {
    console.log('\n\n❌ FAILED TESTS:');
    failedTests.forEach(test => {
      console.log(`   [${test.id}] ${test.category}: ${test.input}`);
    });
  }
}

// Export dla użycia jako moduł
export { testCases, runTests };

// Uruchom jeśli wywołane bezpośrednio
if (require.main === module) {
  runTests();
}
