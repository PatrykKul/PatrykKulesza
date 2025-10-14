'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MessageSquare, X, Send, GripVertical, Maximize2, Minimize2 } from 'lucide-react';
import emailjs from '@emailjs/browser';
import MathText from '@/app/matematyka/components/MathText';

interface ChatButton {
  text: string;
  href?: string;
  onClick?: (() => void) | string;
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: string;
}

interface Message {
  role: 'user' | 'bot';
  content: string;
  buttons?: ChatButton[];
}

type ConversationState = 
  | 'initial' 
  | 'asking_subject' 
  | 'asking_name' 
  | 'asking_phone' 
  | 'asking_email' 
  | 'asking_message'
  | 'confirming'
  | 'normal';

interface BookingData {
  subject: string;
  name: string;
  phone: string;
  email: string;
  message: string;
}

/**
 * ✅ Chatbot Component - KORKUŚ v3.0 - PROFESSIONAL & FIXED
 * 
 * FIXES:
 * ✅ Race condition naprawiony (useRef + state sync)
 * ✅ Asynchroniczne aktualizacje poprawione
 * ✅ Booking process zawsze działa
 * ✅ useCallback dla wszystkich funkcji
 * ✅ Auto-scroll do nowych wiadomości
 * ✅ Integracja z zaawansowanym fallback
 */
export default function ChatbotNew() {
  // Stan podstawowy
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // 🔥 KORKUŚ Problem Help Mode
  const [helpingWithProblem, setHelpingWithProblem] = useState(false);
  const [problemContext, setProblemContext] = useState<string>('');
  const [currentProblemId, setCurrentProblemId] = useState<string>('');
  const [problemImageUrls, setProblemImageUrls] = useState<string[]>([]);
  const [examInfo, setExamInfo] = useState<{
    title: string;
    year: string;
    type: string;
    level: string;
    examType: string;
  } | null>(null);

  // Stan konwersacji - CRITICAL FIX: ref + state
  const [conversationState, setConversationState] = useState<ConversationState>('initial');
  const conversationStateRef = useRef<ConversationState>('initial');
  
  // SessionId dla kontekstu rozmowy
  const [sessionId, setSessionId] = useState<string>('');
  
  const [bookingData, setBookingData] = useState<BookingData>({
    subject: '',
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const bookingDataRef = useRef<BookingData>(bookingData);

  // Stan rozmiaru okna
  const [chatSize, setChatSize] = useState({ width: 384, height: 600 });
  const [isResizing, setIsResizing] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const resizeStartPos = useRef({ x: 0, y: 0, width: 0, height: 0 });

  // CRITICAL: Synchronizuj state z ref
  useEffect(() => {
    conversationStateRef.current = conversationState;
  }, [conversationState]);

  useEffect(() => {
    bookingDataRef.current = bookingData;
  }, [bookingData]);

  // Auto-scroll
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Inicjalizacja EmailJS
  useEffect(() => {
    emailjs.init('7K0ksAqXHemL_xEgT');
  }, []);

  // 🔥 Listener dla pomocy z zadaniem z ExamPage
  useEffect(() => {
    const handleProblemHelp = (event: CustomEvent) => {
      const { context, problemId, imageUrls = [], examInfo: examData } = event.detail;
      
      console.log('🎯 KORKUŚ received problem help request:', { problemId, imageUrls, examData });
      
      // Ustaw tryb pomocy
      setHelpingWithProblem(true);
      setProblemContext(context);
      setCurrentProblemId(problemId);
      setProblemImageUrls(imageUrls); // 🔥 Zapisz URLs obrazów
      setExamInfo(examData);
      
      // Otwórz chatbot
      setIsOpen(true);
      
      // Reset konwersacji do normal mode
      setConversationState('normal');
      conversationStateRef.current = 'normal';
      
      // Dodaj wiadomość startową z kontekstem
      setMessages(prev => [
        ...prev,
        {
          role: 'bot',
          content: `Jak mogę pomóc Ci z zadaniem ${problemId}?`,
        }
      ]);
    };

    window.addEventListener('korkus:openWithProblem', handleProblemHelp as EventListener);
    
    return () => {
      window.removeEventListener('korkus:openWithProblem', handleProblemHelp as EventListener);
    };
  }, []);

  // Pierwsza wiadomość
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: 'bot',
          content: '👋 **Cześć! Jestem KORKUŚ** - Twój AI asystent!\n\n🎓 **Gotowy na zmianę?** Umów się na korepetycje z **Patrykiem Kuleszą** już dziś!\n\n✨ **Specjalizacje:**\n• 🧮 Matematyka - od podstaw po studia\n• 🇬🇧 Angielski - konwersacje i egzaminy\n• 💻 Programowanie - Python, Web Dev, AI\n\n💡 **Co mogę dla Ciebie zrobić?**',
          buttons: [
            { text: '📅 Umów korepetycje', onClick: () => startBooking(), variant: 'primary', icon: '📅' },
            { text: '🧮 Pomoc z zadaniem', onClick: () => handleQuickMessage('Pomóż mi z zadaniem'), variant: 'secondary', icon: '🧮' },
            { text: '💬 Zadaj pytanie', onClick: () => handleQuickMessage('Mam pytanie'), variant: 'outline', icon: '💬' }
          ]
        }
      ]);
    }
  }, []);

  // ==========================================
  // BOOKING FUNCTIONS
  // ==========================================

  const startBooking = useCallback(() => {
    console.log('🎯 Starting booking');
    
    setConversationState('asking_subject');
    conversationStateRef.current = 'asking_subject';
    
    setMessages(prev => [...prev, 
      { role: 'user', content: '📅 Chcę umówić korepetycje' },
      {
        role: 'bot',
        content: '🎯 **Świetnie! Zarezerwujmy termin.**\n\n📚 Z jakiego przedmiotu potrzebujesz pomocy?',
        buttons: [
          { text: '🧮 Matematyka', onClick: () => selectSubject('matematyka'), variant: 'primary' },
          { text: '🇬🇧 Angielski', onClick: () => selectSubject('angielski'), variant: 'primary' },
          { text: '💻 Programowanie', onClick: () => selectSubject('programowanie'), variant: 'primary' }
        ]
      }
    ]);
  }, []);

  const selectSubject = useCallback((subject: string) => {
    const newData = { ...bookingDataRef.current, subject };
    setBookingData(newData);
    bookingDataRef.current = newData;
    
    setConversationState('asking_name');
    conversationStateRef.current = 'asking_name';
    
    const emojis: Record<string, string> = { 'matematyka': '🧮', 'angielski': '🇬🇧', 'programowanie': '💻' };

    setMessages(prev => [...prev,
      { role: 'user', content: `${emojis[subject]} ${subject.charAt(0).toUpperCase() + subject.slice(1)}` },
      { role: 'bot', content: `✅ Super! Korepetycje z **${subject}**.\n\n👤 **Jak się nazywasz?**\n\n_(Podaj imię i nazwisko)_` }
    ]);
  }, []);

  const handleBookingStep = useCallback((userInput: string) => {
    const state = conversationStateRef.current;
    const data = bookingDataRef.current;
    
    console.log(`📝 Step: ${state}, input: "${userInput}"`);
    
    switch (state) {
      case 'asking_subject': {
        const lower = userInput.toLowerCase().trim();
        let subject = '';
        
        if (lower.includes('mat') || lower.includes('math')) subject = 'matematyka';
        else if (lower.includes('ang') || lower.includes('eng')) subject = 'angielski';
        else if (lower.includes('prog') || lower.includes('kod') || lower.includes('python')) subject = 'programowanie';
        
        if (!subject) {
          setMessages(prev => [...prev, { role: 'bot', content: '🤔 **Nie rozpoznałem przedmiotu...**\n\nWybierz:\n• 🧮 Matematyka\n• 🇬🇧 Angielski\n• 💻 Programowanie' }]);
          return;
        }
        selectSubject(subject);
        break;
      }

      case 'asking_name': {
        if (userInput.trim().length < 2) {
          setMessages(prev => [...prev, { role: 'bot', content: '⚠️ Imię musi mieć min. 2 znaki. Spróbuj ponownie:' }]);
          return;
        }
        const newData = { ...data, name: userInput.trim() };
        setBookingData(newData);
        bookingDataRef.current = newData;
        setConversationState('asking_phone');
        conversationStateRef.current = 'asking_phone';
        setMessages(prev => [...prev, { role: 'bot', content: `Cześć **${userInput.trim()}**! 👋\n\n📱 **Jaki jest Twój numer telefonu?**` }]);
        break;
      }

      case 'asking_phone': {
        const digits = userInput.replace(/\D/g, '');
        if (digits.length < 9) {
          setMessages(prev => [...prev, { role: 'bot', content: '⚠️ Numer musi mieć min. 9 cyfr. Spróbuj ponownie:' }]);
          return;
        }
        const newData = { ...data, phone: userInput.trim() };
        setBookingData(newData);
        bookingDataRef.current = newData;
        setConversationState('asking_email');
        conversationStateRef.current = 'asking_email';
        setMessages(prev => [...prev, { role: 'bot', content: '📧 **Podaj swój email:**' }]);
        break;
      }

      case 'asking_email': {
        if (!/\S+@\S+\.\S+/.test(userInput)) {
          setMessages(prev => [...prev, { role: 'bot', content: '⚠️ To nie jest poprawny email. Spróbuj ponownie:' }]);
          return;
        }
        const newData = { ...data, email: userInput.trim() };
        setBookingData(newData);
        bookingDataRef.current = newData;
        setConversationState('asking_message');
        conversationStateRef.current = 'asking_message';
        setMessages(prev => [...prev, { role: 'bot', content: '💬 **Ostatnie pytanie!**\n\nOpisz:\n• Twój poziom\n• Kiedy chcesz zacząć\n• Do czego się przygotowujesz\n\n_(Lub napisz "brak")_' }]);
        break;
      }

      case 'asking_message': {
        const msg = userInput.toLowerCase() === 'brak' ? 'Brak dodatkowych informacji' : userInput.trim();
        const newData = { ...data, message: msg };
        setBookingData(newData);
        bookingDataRef.current = newData;
        setConversationState('confirming');
        conversationStateRef.current = 'confirming';
        showSummary(newData);
        break;
      }

      case 'confirming': {
        const lower = userInput.toLowerCase().trim();
        const yes = ['tak', 'yes', 'ok', 'wyślij', 'wyslij', 'potwierdzam', 'zgadza', 'dawaj', 'dobrze', 'super'];
        const no = ['nie', 'no', 'zmień', 'zmien', 'popraw', 'reset', 'anuluj'];
        
        if (yes.some(a => lower.includes(a))) confirmBooking();
        else if (no.some(a => lower.includes(a))) resetBooking();
        else setMessages(prev => [...prev, { role: 'bot', content: '🤔 **Nie zrozumiałem...**\n\nNapisz:\n• "tak" / "wyślij" - potwierdź\n• "nie" / "zmień" - od nowa' }]);
        break;
      }
    }
  }, []);

  const showSummary = useCallback((data: BookingData) => {
    setMessages(prev => [...prev, {
      role: 'bot',
      content: `📋 **Podsumowanie:**\n\n📚 **Przedmiot:** ${data.subject.charAt(0).toUpperCase() + data.subject.slice(1)}\n👤 **Imię:** ${data.name}\n📱 **Telefon:** ${data.phone}\n📧 **Email:** ${data.email}\n💬 **Wiadomość:** ${data.message}\n\n✅ **Zgadza się?**`,
      buttons: [
        { text: '✅ Tak, wyślij!', onClick: () => confirmBooking(), variant: 'primary' },
        { text: '🔄 Od nowa', onClick: () => resetBooking(), variant: 'outline' }
      ]
    }]);
  }, []);

  const confirmBooking = useCallback(async () => {
    setLoading(true);
    setMessages(prev => [...prev,
      { role: 'user', content: '✅ Tak, wyślij!' },
      { role: 'bot', content: '⏳ Wysyłam...' }
    ]);

    try {
      const data = bookingDataRef.current;
      await emailjs.send('service_ax6r24o', 'template_iay34wr', {
        from_name: data.name,
        from_email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: `UMÓWIENIE PRZEZ CHATBOTA:\n\n${data.message}`
      });

      setMessages(prev => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1] = {
          role: 'bot',
          content: '🎉 **Sukces!**\n\nWiadomość wysłana!\n\n📞 **Patryk Kulesza** skontaktuje się wkrótce.',
          buttons: [
            { text: '📖 Materiały', href: '/matematyka', variant: 'primary' },
            { text: '💬 Pytanie', onClick: () => handleQuickMessage('Mam pytanie'), variant: 'secondary' }
          ]
        };
        return newMsgs;
      });

      resetBooking(false);
    } catch (error) {
      console.error('❌ Error:', error);
      setMessages(prev => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1] = {
          role: 'bot',
          content: '❌ **Błąd!**\n\nSpróbuj ponownie lub zadzwoń:\n📞 +48 662 581 368',
          buttons: [
            { text: '🔄 Ponów', onClick: () => confirmBooking(), variant: 'primary' },
            { text: '📞 Zadzwoń', href: 'tel:+48662581368', variant: 'secondary' }
          ]
        };
        return newMsgs;
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const resetBooking = useCallback((showMsg = true) => {
    setConversationState('normal');
    conversationStateRef.current = 'normal';
    const empty = { subject: '', name: '', phone: '', email: '', message: '' };
    setBookingData(empty);
    bookingDataRef.current = empty;

    if (showMsg) {
      setMessages(prev => [...prev,
        { role: 'user', content: '🔄 Od nowa' },
        { role: 'bot', content: '✨ Zaczynamy od początku!\n\nCo chcesz zrobić?', buttons: [
          { text: '📅 Umów korepetycje', onClick: () => startBooking(), variant: 'primary' },
          { text: '💬 Pytanie', onClick: () => handleQuickMessage('Mam pytanie'), variant: 'secondary' }
        ]}
      ]);
    }
  }, [startBooking]);

  // ==========================================
  // MESSAGE HANDLING
  // ==========================================

  const handleQuickMessage = useCallback((msg: string) => {
    setInput(msg);
  }, []);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');

    console.log(`💬 Sending: "${userMsg}", state: ${conversationStateRef.current}`);

    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);

    const state = conversationStateRef.current;
    
    // If in booking process, handle it
    if (state !== 'normal' && state !== 'initial') {
      console.log(`🎯 Handling booking step`);
      handleBookingStep(userMsg);
      return;
    }

    // Detect booking intent
    const lower = userMsg.toLowerCase();
    const bookingVerbs = ['umów', 'umow', 'rezerwuj', 'zarezerwuj', 'zapisz'];
    const lessonWords = ['korepetycje', 'korepetycj', 'korki', 'lekcje', 'lekcj', 'spotkanie', 'zajęcia', 'zajęć', 'zajec'];
    const hasBookingVerb = bookingVerbs.some(v => lower.includes(v));
    const hasLessonWord = lessonWords.some(w => lower.includes(w));
    const modalPatterns = [/można\s+umów/i, /mozna\s+umow/i, /chcę\s+umów/i, /chce\s+umow/i, /chcę\s+się\s+umów/i];
    const hasModal = modalPatterns.some(p => p.test(lower));
    
    if ((hasBookingVerb && hasLessonWord) || hasModal) {
      console.log('🎯 Booking intent detected');
      startBooking();
      return;
    }

    // Normal mode - send to API
    setLoading(true);

    try {
      // 🔥 Przygotuj payload z problemContext jeśli jesteśmy w trybie pomocy
      const payload: {
        message: string;
        sessionId: string;
        helpMode?: boolean;
        problemContext?: string;
        problemId?: string;
        imageUrls?: string[];
        examInfo?: typeof examInfo;
      } = { 
        message: userMsg, 
        sessionId 
      };
      
      if (helpingWithProblem && problemContext) {
        payload.helpMode = true;
        payload.problemContext = problemContext;
        payload.problemId = currentProblemId;
        payload.imageUrls = problemImageUrls; // 🔥 Przekaż obrazy
        payload.examInfo = examInfo;
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      // Zapamiętaj sessionId z odpowiedzi
      if (data.sessionId) {
        setSessionId(data.sessionId);
      }

      // Sprawdź czy API chce wywołać booking
      if (data.triggerBooking) {
        console.log('🎯 API triggered booking - setting booking state');
        // API już obsłużyło pierwszy krok booking - ustaw stan
        setConversationState('asking_subject');
        conversationStateRef.current = 'asking_subject';
        
        // Dodaj wiadomość z przyciskami wyboru przedmiotu
        setMessages(prev => [...prev, {
          role: 'bot',
          content: data.response || '😅 Ups...',
          buttons: data.buttons || []
        }]);
        return;
      }

      setMessages(prev => [...prev, {
        role: 'bot',
        content: data.response || '😅 Ups...',
        buttons: data.buttons || []
      }]);
    } catch (error) {
      console.error('❌ Error:', error);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: '😅 **Nie mogę się połączyć...**\n\nZadzwoń: **+48 662 581 368**',
        buttons: [{ text: '📞 Zadzwoń', href: 'tel:+48662581368', variant: 'primary' }]
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, handleBookingStep, startBooking]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  // ==========================================
  // RESIZING
  // ==========================================

  const startResize = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsResizing(true);
    
    const coords = 'touches' in e ? 
      { x: e.touches[0]?.clientX || 0, y: e.touches[0]?.clientY || 0 } :
      { x: e.clientX, y: e.clientY };
    
    resizeStartPos.current = { x: coords.x, y: coords.y, width: chatSize.width, height: chatSize.height };
  }, [chatSize]);

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isResizing) return;
      e.preventDefault();
      
      const coords = 'touches' in e ? 
        { x: e.touches[0]?.clientX || 0, y: e.touches[0]?.clientY || 0 } :
        { x: e.clientX, y: e.clientY };
      
      const dx = resizeStartPos.current.x - coords.x;
      const dy = resizeStartPos.current.y - coords.y;
      const w = Math.max(320, Math.min(800, resizeStartPos.current.width + dx));
      const h = Math.max(400, Math.min(900, resizeStartPos.current.height + dy));
      setChatSize({ width: w, height: h });
    };

    const handleUp = () => setIsResizing(false);

    if (isResizing) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleUp);
      document.addEventListener('touchmove', handleMove, { passive: false });
      document.addEventListener('touchend', handleUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleUp);
    };
  }, [isResizing]);

  const toggleMaximize = useCallback(() => setIsMaximized(prev => !prev), []);

  // ==========================================
  // RENDER
  // ==========================================

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-2xl shadow-2xl hover:scale-105 transition-all"
        >
          <MessageSquare className="w-6 h-6 relative z-10" />
          <div className="absolute inset-0 bg-blue-400/50 rounded-2xl animate-ping opacity-20"></div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold text-white animate-bounce">AI</div>
          <div className="absolute bottom-full right-0 mb-3 px-4 py-2 bg-gray-900 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap transform translate-y-2 group-hover:translate-y-0 pointer-events-none">
            💬 Umów korepetycje!
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </button>
      </div>
    );
  }

  const chatStyle = isMaximized
    ? { width: '100vw', height: '100vh', maxWidth: '100vw', maxHeight: '100vh' }
    : { width: `${chatSize.width}px`, height: `${chatSize.height}px`, maxWidth: 'calc(100vw - 3rem)', maxHeight: 'calc(100vh - 3rem)' };

  return (
    <div ref={chatRef} className={`fixed z-50 bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden ${isMaximized ? 'top-0 right-0' : 'bottom-6 right-6'} ${isResizing ? 'select-none' : ''}`} style={chatStyle}>
      
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">KORKUŚ AI</h3>
              <div className="flex items-center gap-2 text-xs text-blue-100">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                {helpingWithProblem ? (
                  <div className="flex items-center gap-1">
                    <span className="bg-yellow-400 text-black px-2 py-0.5 rounded-full font-semibold text-[10px]">
                      🎯 POMOC Z ZADANIEM {currentProblemId}
                    </span>
                  </div>
                ) : (
                  <span>Asystent korepetycji</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleMaximize} className="text-blue-100 hover:text-white hover:bg-white/10 rounded-xl p-2 transition-all">
              {isMaximized ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsOpen(false)} className="text-blue-100 hover:text-white hover:bg-white/10 rounded-xl p-2 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* MESSAGES */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl whitespace-pre-line break-words shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-md' : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'}`}>
              
              {msg.role === 'bot' && (
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">KORKUŚ</span>
                </div>
              )}

              <div className={msg.role === 'user' ? 'text-white' : 'text-black'}>
                {msg.role === 'bot' ? (
                  // Bot messages - render with MathText for LaTeX support
                  msg.content.split('\n').map((line, idx) => {
                    // Check if line has LaTeX (contains $ or $$)
                    if (line.includes('$')) {
                      return (
                        <div key={idx} className="mb-2 last:mb-0 text-black">
                          <MathText>{line}</MathText>
                        </div>
                      );
                    }
                    // Regular text with markdown
                    return (
                      <p key={idx} className="mb-2 last:mb-0 text-black" dangerouslySetInnerHTML={{
                        __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/_(.*?)_/g, '<em>$1</em>')
                      }} />
                    );
                  })
                ) : (
                  // User messages - simple text
                  msg.content.split('\n').map((line, idx) => (
                    <p key={idx} className="mb-2 last:mb-0">
                      {line}
                    </p>
                  ))
                )}
              </div>

              {msg.role === 'bot' && msg.buttons && msg.buttons.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
                  {msg.buttons.map((btn, idx) => (
                    btn.href ? (
                      <a key={idx} href={btn.href} className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${btn.variant === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700' : btn.variant === 'secondary' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'border border-gray-300 text-gray-600 hover:border-gray-400'}`}>
                        <span>{btn.icon}</span>{btn.text}
                      </a>
                    ) : (
                      <button 
                        key={idx} 
                        onClick={() => {
                          if (typeof btn.onClick === 'string') {
                            // Handle string onClick
                            if (btn.onClick === 'location.reload()') {
                              window.location.reload();
                            } else if (btn.onClick === 'startBooking()') {
                              startBooking();
                            } else if (btn.onClick.startsWith('selectSubject(')) {
                              // Extract subject from selectSubject("Matematyka")
                              const match = btn.onClick.match(/selectSubject\("([^"]*)"\)/);
                              if (match) {
                                const subject = match[1];
                                // Set subject and start booking process
                                setBookingData(prev => ({ ...prev, subject }));
                                setConversationState('asking_name');
                                conversationStateRef.current = 'asking_name';
                                
                                // Add bot message asking for name
                                setMessages(prev => [...prev, {
                                  role: 'bot',
                                  content: `✅ **Super! Korepetycje z ${subject.toLowerCase()}a.**\n\n👤 **Jak się nazywasz?**\n\n(Podaj imię i nazwisko)`,
                                  buttons: []
                                }]);
                              }
                            } else {
                              // Eval jako ostateczność (ostrożnie!)
                              try {
                                eval(btn.onClick);
                              } catch (e) {
                                console.error('Error executing onClick:', e);
                              }
                            }
                          } else if (typeof btn.onClick === 'function') {
                            btn.onClick();
                          }
                        }}
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${btn.variant === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700' : btn.variant === 'secondary' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'border border-gray-300 text-gray-600 hover:border-gray-400'}`}>
                        <span>{btn.icon}</span>{btn.text}
                      </button>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-bl-md shadow-sm">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center animate-pulse">
                  <MessageSquare className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs text-gray-500 font-medium">KORKUŚ myśli...</span>
              </div>
              <div className="flex space-x-1 mt-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* INPUT */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-3 mb-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              conversationStateRef.current === 'asking_name' ? 'Imię i nazwisko...' :
              conversationStateRef.current === 'asking_phone' ? 'Numer telefonu...' :
              conversationStateRef.current === 'asking_email' ? 'Email...' :
              conversationStateRef.current === 'asking_message' ? 'Opisz... (lub "brak")' :
              conversationStateRef.current === 'confirming' ? '"tak" lub "nie"...' :
              'Zadaj pytanie...'
            }
            className="text-black flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            disabled={loading}
            maxLength={500}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className={`p-3 rounded-xl transition-all ${loading || !input.trim() ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            {loading ? <div className="animate-spin w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full"></div> : <Send className="w-5 h-5" />}
          </button>
        </div>

        {!isMaximized && (
          <div 
            onMouseDown={startResize}
            onTouchStart={startResize}
            className="absolute top-0 left-0 w-8 h-8 cursor-nwse-resize flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <GripVertical className="w-4 h-4 rotate-45" />
          </div>
        )}

        <div className="text-xs text-gray-500 text-center mt-2">
          🎓 <strong>Patryk Kulesza</strong> - Matematyka • Angielski • Programowanie
        </div>
      </div>
    </div>
  );
}