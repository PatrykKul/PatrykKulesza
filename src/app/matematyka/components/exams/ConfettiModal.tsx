'use client';

import React, { useEffect, useState } from 'react';
import { X, Award, Trophy, Star, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ConfettiModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalScore: number;
  maxPoints: number;
  timeElapsed: number;
  examTitle: string;
  duration: number; // w minutach
}

const ConfettiModal: React.FC<ConfettiModalProps> = ({
  isOpen,
  onClose,
  totalScore,
  maxPoints,
  timeElapsed,
  examTitle,
  duration
}) => {
  const [showModal, setShowModal] = useState(false);

  const percentage = Math.round((totalScore / maxPoints) * 100);

  // Funkcja do uruchamiania konfetti
  const fireConfetti = () => {
    const colors = ['#58a6ff', '#1f6feb', '#238636', '#f59e0b', '#8b5cf6', '#da3633'];
    
    // Konfetti z lewej strony
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0, y: 0.6 },
      colors: colors
    });
    
    // Konfetti z prawej strony
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 1, y: 0.6 },
      colors: colors
    });

    // Główne konfetti ze środka
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { x: 0.5, y: 0.3 },
        colors: colors,
        shapes: ['star', 'circle'],
        scalar: 1.2
      });
    }, 200);

    // Dodatkowe konfetti dla wysokiego wyniku
    if (percentage >= 80) {
      setTimeout(() => {
        confetti({
          particleCount: 200,
          spread: 120,
          origin: { x: 0.5, y: 0.4 },
          colors: ['#ffd700', '#ffed4a', '#f59e0b'],
          shapes: ['star'],
          scalar: 1.5
        });
      }, 600);
    }
  };

  // Formatowanie czasu
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Komunikat w zależności od wyniku
  const getResultMessage = () => {
    if (percentage >= 90) {
      return {
        title: "Doskonale!",
        message: "Fantastyczny wynik! Jesteś mistrzem matematyki!",
        icon: Trophy,
        color: "text-yellow-400",
        bgColor: "from-yellow-500/20 to-orange-500/20",
        borderColor: "border-yellow-400"
      };
    } else if (percentage >= 80) {
      return {
        title: "Świetnie!",
        message: "Bardzo dobry wynik! Masz świetne umiejętności matematyczne!",
        icon: Award,
        color: "text-blue-400",
        bgColor: "from-blue-500/20 to-purple-500/20",
        borderColor: "border-blue-400"
      };
    } else if (percentage >= 60) {
      return {
        title: "Dobra robota!",
        message: "Niezły wynik! Z małą pracą będziesz jeszcze lepszy!",
        icon: Star,
        color: "text-green-400",
        bgColor: "from-green-500/20 to-blue-500/20",
        borderColor: "border-green-400"
      };
    } else {
      return {
        title: "Nie poddawaj się!",
        message: "To dopiero początek! Każdy błąd to okazja do nauki!",
        icon: Zap,
        color: "text-orange-400",
        bgColor: "from-orange-500/20 to-red-500/20",
        borderColor: "border-orange-400"
      };
    }
  };

  const result = getResultMessage();
  const IconComponent = result.icon;

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
      // Opóźnienie dla lepszego efektu
      setTimeout(() => {
        fireConfetti();
      }, 300);
    } else {
      setShowModal(false);
    }
  }, [isOpen, percentage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop z blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className={`relative bg-gradient-to-br ${result.bgColor} border-2 ${result.borderColor} rounded-3xl p-8 m-4 max-w-lg w-full transform transition-all duration-500 ${
          showModal 
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-90 opacity-0 translate-y-8'
        }`}
        style={{
          background: 'linear-gradient(145deg, #161b22 0%, #0d1117 50%, #161b22 100%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        }}
      >
        {/* Przycisk zamknięcia */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Ikona wyniku */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-20 h-20 ${result.color} bg-current/10 rounded-full mb-4 animate-pulse`}>
            <IconComponent className="w-10 h-10" />
          </div>
          
          <h2 className={`text-3xl font-bold ${result.color} mb-2 animate-bounce`}>
            {result.title}
          </h2>
          
          <p className="text-gray-300 text-lg">
            {result.message}
          </p>
        </div>

        {/* Wynik */}
        <div className="text-center mb-6">
          <div className="text-6xl font-bold text-white mb-2">
            {totalScore}
            <span className="text-2xl text-gray-400">/{maxPoints}</span>
          </div>
          
          <div className={`text-2xl font-semibold ${result.color} mb-4`}>
            {percentage}% poprawnych odpowiedzi
          </div>

          {/* Pasek postępu */}
          <div className="w-full bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out`}
              style={{ 
                width: showModal ? `${percentage}%` : '0%',
                background: percentage >= 80 
                  ? 'linear-gradient(90deg, #ffd700, #f59e0b)' 
                  : percentage >= 60
                  ? 'linear-gradient(90deg, #10b981, #06b6d4)'
                  : 'linear-gradient(90deg, #f59e0b, #ef4444)'
              }}
            />
          </div>
        </div>

        {/* Dodatkowe statystyki */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-black/20 rounded-lg p-3 text-center border border-white/10">
            <div className="text-sm text-gray-400">Twój czas</div>
            <div className="text-lg font-semibold text-white">{formatTime(timeElapsed)}</div>
          </div>
          
          <div className="bg-black/20 rounded-lg p-3 text-center border border-white/10">
            <div className="text-sm text-gray-400">Status czasowy</div>
            <div className={`text-sm font-semibold ${timeElapsed <= duration * 60 ? 'text-green-400' : 'text-orange-400'}`}>
              {timeElapsed <= duration * 60 ? '✓ W czasie!' : '⚠ Przekroczony'}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Limit: {duration} min
            </div>
          </div>
        </div>

        {/* Przyciski akcji */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              fireConfetti();
            }}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            🎉 Więcej konfetti!
          </button>
          
          <button
            onClick={onClose}
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Zamknij
          </button>
        </div>

        {/* Dodatkowa motywacja */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            {(() => {
              const isInTime = timeElapsed <= duration * 60;
              if (percentage >= 90 && isInTime) return "🏆 Perfekcyjnie! Jesteś gotowy na prawdziwy egzamin!";
              if (percentage >= 80 && isInTime) return "� Świetnie! Ukończyłeś w czasie z doskonałym wynikiem!";
              if (percentage >= 80) return "🎯 Świetny wynik! Następnym razem spróbuj być szybszy!";
              if (percentage >= 60 && isInTime) return "� Dobry wynik w odpowiednim czasie! Tak trzymaj!";
              if (percentage >= 60) return "📈 Dobry wynik! Popracuj nad szybkością rozwiązywania!";
              if (isInTime) return "⏰ Dobry czas! Teraz popracuj nad dokładnością!";
              return "💪 Nie poddawaj się! Każde ćwiczenie to krok do przodu!";
            })()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfettiModal;