'use client';

import { useState } from 'react';
import { MessageSquare, X, Send, Calculator, BookOpen, Code } from 'lucide-react';

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

/**
 * Chatbot Component - KORKUŚ
 * 
 * AI Chatbot dla korepetycji Patryka Kuleszy
 * Specjalizacje: Matematyka, Angielski, Programowanie
 */
export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'bot', 
      content: '👋 Cześć! Jestem **KORKUŚ** - Twój AI asystent korepetycji!\n\n📚 Mogę pomóc Ci w:\n• 🧮 **Matematyce** - rozwiązywanie zadań, wyjaśnienia\n• 🇬🇧 **Angielskim** - tłumaczenia, gramatyka, nauka\n• 💻 **Programowaniu** - kod, algorytmy, języki\n\nAutor: **Patryk Kulesza** 🎓',
      buttons: [
        {
          text: '🧮 Pomoc z matmą',
          onClick: () => handleQuickMessage('Pomóż mi z zadaniem z matematyki'),
          variant: 'primary',
          icon: '🧮'
        },
        {
          text: '🇬🇧 Nauka angielskiego',
          onClick: () => handleQuickMessage('Chcę się uczyć angielskiego'),
          variant: 'secondary',
          icon: '🇬🇧'
        },
        {
          text: '💻 Programowanie',
          onClick: () => handleQuickMessage('Pomóż mi z programowaniem'),
          variant: 'outline',
          icon: '💻'
        }
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuickMessage = (message: string) => {
    setInput(message);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput })
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
          content: data.response || '😅 Ups, coś poszło nie tak... Spróbuj ponownie!',
          buttons: data.buttons || []
        }]);
      }
      
    } catch (error) {
      console.error('❌ Błąd chatbota:', error);
      
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: '😅 **Nie mogę się połączyć z serwerem...**\n\n💡 Ale możesz skontaktować się ze mną bezpośrednio!\n\n📞 **Patryk Kulesza** - Twój korepetytor',
        buttons: [
          {
            text: '📞 Kontakt bezpośredni',
            href: '/kontakt',
            variant: 'primary'
          }
        ]
      }]);
    }
    
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ==========================================
  // 🎨 FLOATING BUTTON (zamknięty chatbot)
  // ==========================================
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setIsOpen(true)}
          className="group relative bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
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
          <div className="absolute bottom-full right-0 mb-3 px-4 py-2 bg-gray-900 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap transform translate-y-2 group-hover:translate-y-0">
            💬 Zapytaj KORKUŚ o pomoc!
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </button>
      </div>
    );
  }

  // ==========================================
  // 💬 CHAT WINDOW (otwarty chatbot)
  // ==========================================
  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
      
      {/* ==========================================
          HEADER
          ========================================== */}
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
          <button 
            onClick={() => setIsOpen(false)}
            className="text-blue-100 hover:text-white hover:bg-white/10 rounded-xl p-2 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ==========================================
          MESSAGES CONTAINER
          ========================================== */}
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
                  // Basic markdown support
                  let processedLine = line
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>');
                  
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
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
              <p className="text-gray-400 text-xs mt-2">Analizuję Twoje pytanie...</p>
            </div>
          </div>
        )}
      </div>

      {/* ==========================================
          INPUT AREA
          ========================================== */}
      <div className="p-4 bg-white border-t border-gray-200">
        
        {/* Input field + send button */}
        <div className="flex gap-3 mb-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Zadaj pytanie..."
            className="text-black flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            disabled={loading}
            maxLength={500}
          />
          <button 
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className={`p-3 rounded-xl transition-all duration-200 ${
              loading || !input.trim()
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
        
        {/* Quick action buttons */}
        <div className="flex gap-2 mb-3 flex-wrap text-sm">
          <button 
            onClick={() => handleQuickMessage("Pomóż mi rozwiązać równanie kwadratowe")}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-all duration-200"
            disabled={loading}
          >
            <Calculator className="w-4 h-4" />
            Matematyka
          </button>
          <button 
            onClick={() => handleQuickMessage("Przetłumacz zdanie na angielski")}
            className="flex items-center gap-1 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-all duration-200"
            disabled={loading}
          >
            <BookOpen className="w-4 h-4" />
            Angielski
          </button>
          <button 
            onClick={() => handleQuickMessage("Jak napisać Hello World w Pythonie?")}
            className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-all duration-200"
            disabled={loading}
          >
            <Code className="w-4 h-4" />
            Kod
          </button>
        </div>
        
        {/* Footer */}
        <div className="text-xs text-gray-500 text-center">
          🎓 <strong>Patryk Kulesza</strong> - Matematyka • Angielski • Programowanie
        </div>
      </div>
    </div>
  );
}