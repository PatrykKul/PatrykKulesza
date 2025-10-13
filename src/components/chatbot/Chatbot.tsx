'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, GripVertical, Maximize2, Minimize2 } from 'lucide-react';
import emailjs from '@emailjs/browser';

interface ChatButton {
  text: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: string;
}

interface Message {
  role: 'user' | 'bot';
  content: string;
  buttons?: ChatButton[];
}

// Typy dla stanu konwersacji
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
 * Chatbot Component - KORKUŚ v2.0
 * 
 * Ulepszona wersja z:
 * - Możliwością zmiany rozmiaru
 * - Wieloetapowym procesem umówienia korepetycji
 * - Wysyłaniem emaili przez EmailJS
 * - Kontekstem zadań matematycznych (będzie dodane w kolejnym etapie)
 */
export default function ChatbotNew() {
  // Stan podstawowy
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Stan konwersacji z umówieniem
  const [conversationState, setConversationState] = useState<ConversationState>('initial');
  const [bookingData, setBookingData] = useState<BookingData>({
    subject: '',
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  // Stan rozmiaru okna
  const [chatSize, setChatSize] = useState({ width: 384, height: 600 });
  const [isResizing, setIsResizing] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const resizeStartPos = useRef({ x: 0, y: 0, width: 0, height: 0 });

  // Inicjalizacja EmailJS
  useEffect(() => {
    emailjs.init('7K0ksAqXHemL_xEgT');
  }, []);

  // Pierwsza wiadomość - zachęcająca do umówienia korepetycji
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: 'bot',
          content: '👋 **Cześć! Jestem KORKUŚ** - Twój AI asystent!\n\n🎓 **Gotowy na zmianę?** Umów się na korepetycje z **Patrykiem Kuleszą** już dziś!\n\n✨ **Specjalizacje:**\n• 🧮 Matematyka - od podstaw po studia\n• 🇬🇧 Angielski - konwersacje i egzaminy\n• 💻 Programowanie - Python, Web Dev, AI\n\n💡 **Co mogę dla Ciebie zrobić?**',
          buttons: [
            {
              text: '📅 Umów korepetycje',
              onClick: () => startBooking(),
              variant: 'primary',
              icon: '📅'
            },
            {
              text: '🧮 Pomoc z zadaniem',
              onClick: () => handleQuickMessage('Pomóż mi z zadaniem'),
              variant: 'secondary',
              icon: '🧮'
            },
            {
              text: '💬 Zadaj pytanie',
              onClick: () => handleQuickMessage('Mam pytanie o korepetycje'),
              variant: 'outline',
              icon: '💬'
            }
          ]
        }
      ]);
    }
  }, []);

  // ==========================================
  // FUNKCJE UMÓWIENIA KOREPETYCJI
  // ==========================================

  const startBooking = () => {
    setConversationState('asking_subject');
    setMessages(prev => [...prev, 
      { 
        role: 'user', 
        content: '📅 Chcę umówić korepetycje' 
      },
      {
        role: 'bot',
        content: '🎯 **Świetnie! Zarezerwujmy dla Ciebie termin.**\n\n📚 Z jakiego przedmiotu potrzebujesz pomocy?',
        buttons: [
          {
            text: '🧮 Matematyka',
            onClick: () => selectSubject('matematyka'),
            variant: 'primary'
          },
          {
            text: '🇬🇧 Angielski',
            onClick: () => selectSubject('angielski'),
            variant: 'primary'
          },
          {
            text: '💻 Programowanie',
            onClick: () => selectSubject('programowanie'),
            variant: 'primary'
          }
        ]
      }
    ]);
  };

  const selectSubject = (subject: string) => {
    setBookingData(prev => ({ ...prev, subject }));
    setConversationState('asking_name');
    
    const subjectEmojis: { [key: string]: string } = {
      'matematyka': '🧮',
      'angielski': '🇬🇧',
      'programowanie': '💻'
    };

    setMessages(prev => [...prev,
      {
        role: 'user',
        content: `${subjectEmojis[subject]} ${subject.charAt(0).toUpperCase() + subject.slice(1)}`
      },
      {
        role: 'bot',
        content: `✅ Super! Korepetycje z **${subject}**.\n\n👤 **Jak się nazywasz?**\n\n_(Podaj imię i nazwisko)_`
      }
    ]);
  };

  const handleBookingStep = (userInput: string) => {
    switch (conversationState) {
      case 'asking_name':
        // Walidacja imienia (minimum 2 znaki)
        if (userInput.trim().length < 2) {
          setMessages(prev => [...prev,
            {
              role: 'bot',
              content: '⚠️ Imię i nazwisko musi mieć minimum 2 znaki. Spróbuj ponownie:'
            }
          ]);
          return;
        }
        
        setBookingData(prev => ({ ...prev, name: userInput.trim() }));
        setConversationState('asking_phone');
        setMessages(prev => [...prev,
          {
            role: 'bot',
            content: `Cześć **${userInput.trim()}**! 👋\n\n📱 **Jaki jest Twój numer telefonu?**\n\n_(Najlepiej format: 123 456 789)_`
          }
        ]);
        break;

      case 'asking_phone':
        // Walidacja telefonu (minimum 9 cyfr)
        const digits = userInput.replace(/\D/g, '');
        if (digits.length < 9) {
          setMessages(prev => [...prev,
            {
              role: 'bot',
              content: '⚠️ Numer telefonu musi mieć minimum 9 cyfr. Spróbuj ponownie:'
            }
          ]);
          return;
        }
        
        setBookingData(prev => ({ ...prev, phone: userInput.trim() }));
        setConversationState('asking_email');
        setMessages(prev => [...prev,
          {
            role: 'bot',
            content: '📧 **Podaj swój adres email:**\n\n_(Potrzebny do potwierdzenia spotkania)_'
          }
        ]);
        break;

      case 'asking_email':
        // Walidacja email
        if (!/\S+@\S+\.\S+/.test(userInput)) {
          setMessages(prev => [...prev,
            {
              role: 'bot',
              content: '⚠️ To nie wygląda na poprawny email. Spróbuj ponownie:'
            }
          ]);
          return;
        }
        
        setBookingData(prev => ({ ...prev, email: userInput.trim() }));
        setConversationState('asking_message');
        setMessages(prev => [...prev,
          {
            role: 'bot',
            content: '💬 **Ostatnie pytanie!**\n\nOpisz krótko:\n• Jaki jest Twój poziom?\n• Kiedy chciałbyś zacząć?\n• Do czego się przygotowujesz?\n\n_(Opcjonalnie - możesz pominąć pisząc "brak")_'
          }
        ]);
        break;

      case 'asking_message':
        const finalMessage = userInput.toLowerCase() === 'brak' ? 
          'Brak dodatkowych informacji' : userInput.trim();
        
        setBookingData(prev => ({ ...prev, message: finalMessage }));
        setConversationState('confirming');
        
        // Pokaż podsumowanie
        showBookingSummary(finalMessage);
        break;
    }
  };

  const showBookingSummary = (finalMessage: string) => {
    const summary = `
📋 **Podsumowanie:**

📚 **Przedmiot:** ${bookingData.subject.charAt(0).toUpperCase() + bookingData.subject.slice(1)}
👤 **Imię:** ${bookingData.name}
📱 **Telefon:** ${bookingData.phone}
📧 **Email:** ${bookingData.email}
💬 **Wiadomość:** ${finalMessage}

✅ **Czy wszystko się zgadza?**
    `.trim();

    setMessages(prev => [...prev,
      {
        role: 'bot',
        content: summary,
        buttons: [
          {
            text: '✅ Tak, wyślij!',
            onClick: () => confirmAndSendBooking(),
            variant: 'primary'
          },
          {
            text: '🔄 Zacznij od nowa',
            onClick: () => resetBooking(),
            variant: 'outline'
          }
        ]
      }
    ]);
  };

  const confirmAndSendBooking = async () => {
    setLoading(true);
    setMessages(prev => [...prev,
      {
        role: 'user',
        content: '✅ Tak, wyślij!'
      },
      {
        role: 'bot',
        content: '⏳ Wysyłam wiadomość...'
      }
    ]);

    try {
      // Wysyłanie przez EmailJS (taki sam service jak w formularzu kontaktowym)
      await emailjs.send(
        'service_ax6r24o',
        'template_iay34wr', 
        {
          from_name: bookingData.name,
          from_email: bookingData.email,
          phone: bookingData.phone,
          subject: bookingData.subject,
          message: `UMÓWIENIE PRZEZ CHATBOTA:\n\n${bookingData.message}`
        }
      );

      // Sukces!
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: 'bot',
          content: '🎉 **Sukces!**\n\nTwoja wiadomość została wysłana!\n\n📞 **Patryk Kulesza** skontaktuje się z Tobą wkrótce.\n\n✨ W międzyczasie możesz:',
          buttons: [
            {
              text: '📖 Zobacz materiały',
              href: '/matematyka',
              variant: 'primary'
            },
            {
              text: '💬 Zadaj pytanie',
              onClick: () => handleQuickMessage('Mam pytanie'),
              variant: 'secondary'
            }
          ]
        };
        return newMessages;
      });

      // Reset stanu
      resetBooking(false);

    } catch (error) {
      console.error('Błąd wysyłania:', error);
      
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: 'bot',
          content: '❌ **Ups! Coś poszło nie tak...**\n\nSpróbuj ponownie lub zadzwoń bezpośrednio:\n📞 +48 662 581 368',
          buttons: [
            {
              text: '🔄 Spróbuj ponownie',
              onClick: () => confirmAndSendBooking(),
              variant: 'primary'
            },
            {
              text: '📞 Zadzwoń',
              href: 'tel:+48662581368',
              variant: 'secondary'
            }
          ]
        };
        return newMessages;
      });
    } finally {
      setLoading(false);
    }
  };

  const resetBooking = (showMessage: boolean = true) => {
    setConversationState('normal');
    setBookingData({
      subject: '',
      name: '',
      phone: '',
      email: '',
      message: ''
    });

    if (showMessage) {
      setMessages(prev => [...prev,
        {
          role: 'user',
          content: '🔄 Zacznij od nowa'
        },
        {
          role: 'bot',
          content: '✨ Okej, zaczynamy od początku!\n\nCo chcesz zrobić?',
          buttons: [
            {
              text: '📅 Umów korepetycje',
              onClick: () => startBooking(),
              variant: 'primary'
            },
            {
              text: '💬 Zadaj pytanie',
              onClick: () => handleQuickMessage('Mam pytanie'),
              variant: 'secondary'
            }
          ]
        }
      ]);
    }
  };

  // ==========================================
  // OBSŁUGA WIADOMOŚCI
  // ==========================================

  const handleQuickMessage = (message: string) => {
    setInput(message);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');

    // Dodaj wiadomość użytkownika
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    // Jeśli jesteśmy w trakcie umówienia, obsłuż to oddzielnie
    if (conversationState !== 'normal' && conversationState !== 'initial') {
      handleBookingStep(userMessage);
      return;
    }

    // Normalny tryb - wysyłanie do API
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await res.json();

      if (res.ok) {
        setMessages(prev => [...prev, {
          role: 'bot',
          content: data.response,
          buttons: data.buttons || []
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'bot',
          content: data.response || '😅 Ups, coś poszło nie tak...',
          buttons: data.buttons || []
        }]);
      }

    } catch (error) {
      console.error('❌ Błąd chatbota:', error);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: '😅 **Nie mogę się połączyć...**\n\nZadzwoń bezpośrednio: **+48 662 581 368**',
        buttons: [
          {
            text: '📞 Zadzwoń',
            href: 'tel:+48662581368',
            variant: 'primary'
          }
        ]
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ==========================================
  // OBSŁUGA RESIZOWANIA
  // ==========================================

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    resizeStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      width: chatSize.width,
      height: chatSize.height
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const deltaX = resizeStartPos.current.x - e.clientX;
      const deltaY = resizeStartPos.current.y - e.clientY;

      const newWidth = Math.max(320, Math.min(800, resizeStartPos.current.width + deltaX));
      const newHeight = Math.max(400, Math.min(900, resizeStartPos.current.height + deltaY));

      setChatSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  // ==========================================
  // FLOATING BUTTON
  // ==========================================

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
          aria-label="Otwórz AI asystenta KORKUŚ"
        >
          <MessageSquare className="w-6 h-6 relative z-10" />

          {/* Pulse animation */}
          <div className="absolute inset-0 bg-blue-400/50 rounded-2xl animate-ping opacity-20"></div>

          {/* AI badge */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold text-white animate-bounce">
            AI
          </div>

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-3 px-4 py-2 bg-gray-900 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap transform translate-y-2 group-hover:translate-y-0 pointer-events-none">
            💬 Umów korepetycje z KORKUŚ!
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </button>
      </div>
    );
  }

  // ==========================================
  // CHAT WINDOW
  // ==========================================

  const chatStyle = isMaximized
    ? { width: '100vw', height: '100vh', maxWidth: '100vw', maxHeight: '100vh' }
    : { width: `${chatSize.width}px`, height: `${chatSize.height}px`, maxWidth: 'calc(100vw - 3rem)', maxHeight: 'calc(100vh - 3rem)' };

  return (
    <div
      ref={chatRef}
      className={`fixed z-50 bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden ${
        isMaximized ? 'top-0 right-0' : 'bottom-6 right-6'
      } ${isResizing ? 'select-none' : ''}`}
      style={chatStyle}
    >
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
                Asystent korepetycji
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Maximize/Minimize button */}
            <button
              onClick={toggleMaximize}
              className="text-blue-100 hover:text-white hover:bg-white/10 rounded-xl p-2 transition-all duration-200"
              title={isMaximized ? 'Przywróć rozmiar' : 'Maksymalizuj'}
            >
              {isMaximized ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </button>

            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="text-blue-100 hover:text-white hover:bg-white/10 rounded-xl p-2 transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* MESSAGES CONTAINER */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] p-4 rounded-2xl whitespace-pre-line break-words shadow-sm ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-br-md'
                : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
            }`}>

              {/* Bot message header */}
              {msg.role === 'bot' && (
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">KORKUŚ</span>
                </div>
              )}

              {/* Message content with markdown support */}
              <div className={msg.role === 'user' ? 'text-white' : 'text-gray-800'}>
                {msg.content.split('\n').map((line, lineIndex) => {
                  let processedLine = line
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/_(.*?)_/g, '<em>$1</em>');

                  return (
                    <p key={lineIndex} className="mb-2 last:mb-0" dangerouslySetInnerHTML={{ __html: processedLine }} />
                  );
                })}
              </div>

              {/* Dynamic buttons */}
              {msg.role === 'bot' && msg.buttons && msg.buttons.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
                  {msg.buttons.map((button, btnIndex) => (
                    button.href ? (
                      <a
                        key={btnIndex}
                        href={button.href}
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          button.variant === 'primary'
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : button.variant === 'secondary'
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'border border-gray-300 text-gray-600 hover:border-gray-400'
                        }`}
                      >
                        <span>{button.icon}</span>
                        {button.text}
                      </a>
                    ) : (
                      <button
                        key={btnIndex}
                        onClick={button.onClick}
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          button.variant === 'primary'
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : button.variant === 'secondary'
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'border border-gray-300 text-gray-600 hover:border-gray-400'
                        }`}
                      >
                        <span>{button.icon}</span>
                        {button.text}
                      </button>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
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

      {/* INPUT AREA */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-3 mb-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              conversationState === 'asking_name' ? 'Wpisz imię i nazwisko...' :
              conversationState === 'asking_phone' ? 'Wpisz numer telefonu...' :
              conversationState === 'asking_email' ? 'Wpisz email...' :
              conversationState === 'asking_message' ? 'Opisz swoje potrzeby... (lub "brak")' :
              'Zadaj pytanie...'
            }
            className="text-black flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            disabled={loading || conversationState === 'confirming'}
            maxLength={500}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim() || conversationState === 'confirming'}
            className={`p-3 rounded-xl transition-all duration-200 ${
              loading || !input.trim() || conversationState === 'confirming'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? (
              <div className="animate-spin w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Resize handle - tylko gdy nie maksymalizowany */}
        {!isMaximized && (
          <div
            onMouseDown={startResize}
            className="absolute top-0 left-0 w-8 h-8 cursor-nwse-resize flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
            title="Przeciągnij aby zmienić rozmiar"
          >
            <GripVertical className="w-4 h-4 rotate-45" />
          </div>
        )}

        {/* Footer */}
        <div className="text-xs text-gray-500 text-center mt-2">
          🎓 <strong>Patryk Kulesza</strong> - Matematyka • Angielski • Programowanie
        </div>
      </div>
    </div>
  );
}