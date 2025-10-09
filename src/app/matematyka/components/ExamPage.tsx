'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, Clock, Award, FileText, Download, Eye, EyeOff, CheckCircle, RotateCcw, PenTool, Eraser, Trash2, Type, X, Shapes } from 'lucide-react';
import MathText, { MathSolutionStep } from '@/app/matematyka/components/MathText';
import { useImageScan } from '@/hooks/useImageScan';
import AdvancedCanvas from './AdvancedCanvas';

// Types
export interface MathProblem {
  id: string;
  question: string;
  formula?: string;
  image?: string;
  options?: string[];
  answer: string;
  solution?: string[];
  solutionImages?: string[];
  points: number;
  category: string;
}

export interface ExamData {
  title: string;
  date: string;
  duration: number;
  maxPoints: number;
  problems: MathProblem[];
  pdfUrl?: string;
  answerKeyUrl?: string;
}

interface ExamPageProps {
  examData: ExamData;
  year: string;
  type: string;
  examType?: string;
  basePath?: string;
  level?: string;
}

type Shape = {
  id: string;
  type: 'circle' | 'rectangle' | 'triangle' | 'line' | 'arrow' | 'axes';
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  endX?: number;
  endY?: number;
  color: string;
  strokeWidth: number;
};

export default function ExamPage({ 
  examData, 
  year, 
  type,
  examType = 'egzamin',
  basePath = '/matematyka',
  level
}: ExamPageProps) {
  const [visibleSolutions, setVisibleSolutions] = useState<Record<string, boolean>>({});
  const [userAnswers, setUserAnswers] = useState<Record<string, string[]>>({});
  const [checkedAnswers, setCheckedAnswers] = useState<Record<string, boolean>>({});
  const [showCanvas, setShowCanvas] = useState<Record<string, boolean>>({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const { imageData, loading: imagesLoading } = useImageScan(examType, year, type, level);

  useEffect(() => {
    if (!timerActive) return;
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getExtendedTitle = () => {
    const baseTitle = examData.title;
    
    const formatType = (type: string) => {
      const typeMap: Record<string, string> = {
        'glowny': 'Maj',
        'dodatkowy': 'Czerwiec', 
        'podstawowa': 'Podstawowa',
        'rozszerzona': 'Rozszerzona'
      };
      return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1);
    };

    const formatExamType = (examType: string) => {
      const examTypeMap: Record<string, string> = {
        'egzamin-8': 'Egzamin Ósmoklasisty',
        'matura': 'Matura'
      };
      return examTypeMap[examType] || examType;
    };

    const titleParts = baseTitle.split(' - ');
    
    const formattedExamType = formatExamType(examType || 'egzamin');
    if (!baseTitle.includes('Egzamin') && !baseTitle.includes('Matura')) {
      titleParts.push(formattedExamType);
    }
    
    const formattedMonth = formatType(type);
    if (!baseTitle.includes(formattedMonth)) {
      titleParts.push(formattedMonth);
    }

    titleParts.push(year);
    
    if (level && examType === 'matura') {
      const formattedLevel = formatType(level);
      if (!baseTitle.includes(formattedLevel)) {
        titleParts.push(formattedLevel);
      }
    }

    const hasYear = baseTitle.includes(year);
    const hasType = baseTitle.toLowerCase().includes(type.toLowerCase());
    
    if (hasYear && hasType) {
      return baseTitle;
    }

    if (titleParts.length > 0) {
      return `${baseTitle}  ${titleParts.join(' ')}`;
    }
    
    return baseTitle;
  };

  const getImagePath = (problemId: string, imageType: 'problem' | 'solution' = 'problem', imageIndex?: number): string => {
    let basePath = '/math_resources/';
    
    if (examType === 'egzamin-8') {
      basePath += `egzamin-8/${year}/${type}/`;
    } else if (examType === 'matura' && level) {
      basePath += `matura/${level}/${year}/${type}/`;
    }
    
    if (imageType === 'solution' && imageIndex !== undefined) {
      return `${basePath}${problemId}-solution-${imageIndex + 1}.png`;
    }
    
    return `${basePath}${problemId}.png`;
  };

  const toggleSolution = (problemId: string) => {
    setVisibleSolutions(prev => ({
      ...prev,
      [problemId]: !prev[problemId]
    }));
  };

  const toggleCanvas = (problemId: string) => {
    setShowCanvas(prev => ({
      ...prev,
      [problemId]: !prev[problemId]
    }));
  };

  const hasMultipleAnswers = (answer: string) => {
    return answer.length === 2 && !answer.includes(')') && !answer.includes(' ');
  };

  const toggleAnswer = (problemId: string, option: string) => {
    setUserAnswers(prev => {
      const current = prev[problemId] || [];
      if (current.includes(option)) {
        return {
          ...prev,
          [problemId]: current.filter(a => a !== option)
        };
      } else {
        return {
          ...prev,
          [problemId]: [...current, option]
        };
      }
    });
  };

  const selectSingleAnswer = (problemId: string, option: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [problemId]: [option]
    }));
  };

  const checkAnswer = (problemId: string) => {
    setCheckedAnswers(prev => ({
      ...prev,
      [problemId]: true
    }));
  };

  const resetProblem = (problemId: string) => {
    setUserAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[problemId];
      return newAnswers;
    });
    setCheckedAnswers(prev => {
      const newChecked = { ...prev };
      delete newChecked[problemId];
      return newChecked;
    });
    localStorage.removeItem(`canvas-${problemId}`);
    localStorage.removeItem(`canvas-data-${problemId}`);
  };

  const resetAllProblems = () => {
    if (confirm('Czy na pewno chcesz zresetować wszystkie odpowiedzi i zacząć od początku?')) {
      setUserAnswers({});
      setCheckedAnswers({});
      setVisibleSolutions({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isAnswerCorrect = useCallback((problemId: string, correctAnswer: string) => {
    const userAnswer = userAnswers[problemId];
    if (!userAnswer || userAnswer.length === 0) return null;
    if (!checkedAnswers[problemId]) return null;
    
    const problem = examData.problems.find(p => p.id === problemId);
    
    if (userAnswer[0] === 'SELF_YES') {
      return true;
    }
    if (userAnswer[0] === 'SELF_NO') {
      return false;
    }
    
    if (problem?.options && isMultiLevelQuestion(problem.options)) {
      const userResponse = userAnswer
        .sort((a, b) => parseInt(a.split(':')[0]) - parseInt(b.split(':')[0]))
        .map(a => a.split(':')[1])
        .join('');
      return userResponse === correctAnswer;
    }
    
    if (hasMultipleAnswers(correctAnswer)) {
      const correctLetters = correctAnswer.split('');
      const userLetters = userAnswer.map(opt => opt.charAt(0)).sort();
      return correctLetters.sort().join('') === userLetters.join('');
    }
    
    const normalizedUser = userAnswer[0].trim().toLowerCase();
    const normalizedCorrect = correctAnswer.trim().toLowerCase();
    
    return normalizedUser === normalizedCorrect;
  }, [userAnswers, checkedAnswers, examData.problems]);

  const isMultiLevelQuestion = (options: string[]) => {
    return options.some(opt => 
      opt.includes('P/F') || opt.includes('- P F') ||
      opt.includes('A/B') || opt.includes('C/D') ||
      opt.includes('1/2/3') || opt.includes('- 1/2/3')
    );
  };

  const extractStatement = (option: string) => {
    return option
      .replace(/\s*-?\s*P\s*\/?\s*F\s*$/i, '')
      .replace(/\s*-?\s*A\s*\/?\s*B\s*$/i, '')
      .replace(/\s*-?\s*C\s*\/?\s*D\s*$/i, '')
      .replace(/\s*-?\s*1\s*\/?\s*2\s*\/?\s*3\s*$/i, '')
      .trim();
  };

  const getQuestionOptions = (option: string) => {
    if (option.includes('P/F') || option.includes('- P F')) {
      return ['P', 'F'];
    }
    if (option.includes('A/B')) {
      return ['A', 'B'];
    }
    if (option.includes('C/D')) {
      return ['C', 'D'];
    }
    if (option.includes('1/2/3') || option.includes('- 1/2/3')) {
      return ['1', '2', '3'];
    }
    return [];
  };

  const renderOption = (option: string) => {
    return <MathText inline>{option}</MathText>;
  };

  const renderSolutionStep = (step: string) => {
    return <MathSolutionStep>{step}</MathSolutionStep>;
  };

  // Komponent Canvas do rysowania


  const totalScore = useMemo(() => {
    let earned = 0;
    examData.problems.forEach(problem => {
      if (isAnswerCorrect(problem.id, problem.answer) === true) {
        earned += problem.points;
      }
    });
    return earned;
  }, [examData.problems, isAnswerCorrect]);

  const answeredCount = Object.keys(userAnswers).filter(key => userAnswers[key].length > 0).length;
  const checkedCount = Object.keys(checkedAnswers).filter(key => checkedAnswers[key]).length;
  const totalProblems = examData.problems.length;

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
<style>{`
  @media print {
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body { background-color: #0d1117 !important; }
    header, footer, .no-print { display: none !important; }
  }

  body { 
    font-size: 22px !important;
    line-height: 1.75 !important;
    letter-spacing: 0.01em;
  }

  /* Formuły - bardzo duże */
  .math-content .katex {
    font-size: 2.2em !important;
    font-weight: 500;
    letter-spacing: 0.02em;
  }

  .math-content .katex-display {
    font-size: 2.6em !important;
    margin: 1.5em 0;
  }

  /* Rozwiązania - wyraźnie widoczne */
  .solution-container .katex {
    font-size: 1.4em !important;
    color: #f0f6fc !important;
    font-weight: 500 !important;
  }

  /* Indeksy - duże i czytelne */
  .katex .msupsub {
    font-size: 0.9em !important;
    font-weight: 500 !important;
  }

  .katex sup, .katex sub {
    font-size: 0.86em !important;
    line-height: 0;
    vertical-align: baseline;
    position: relative;
  }

  .katex sup { top: -0.5em; }
  .katex sub { top: 0.3em; }

  /* Operatory matematyczne */
  .katex .mbin, .katex .mrel {
    padding: 0 0.3em;
  }

  /* Przyciski - responsywne */
  button {
    font-size: 0.9rem !important;
    padding: 0.75rem 1.2rem !important;
    min-height: 2.8rem !important;
    font-weight: 500;
    letter-spacing: 0.02em;
    transition: all 0.2s ease;
  }

  button:hover {
    transform: translateY(-1px);
  }

  @media (min-width: 640px) {
    button {
      font-size: 1rem !important;
      padding: 0.9rem 1.5rem !important;
      min-height: 3.2rem !important;
    }
  }

  @media (min-width: 1024px) {
    button {
      font-size: 1.2rem !important;
      padding: 1.15rem 2rem !important;
      min-height: 4rem !important;
    }
  }

  button .katex {
    font-size: 1.6em !important;
  }

  /* Pytania z formułami - bardzo duże */
  p .katex {
    font-size: 2.4em !important;
  }

  .bg-\[#21262d\] .katex {
    font-size: 2.6em !important;
  }

  /* Numeracja w rozwiązaniach */
  .solution-container li {
    margin-bottom: 1.1rem;
    line-height: 1.9;
    font-size: 1.05em;
  }

  .solution-container li > span:first-child {
    font-size: 1.25em;
    font-weight: 600;
    color: #58a6ff;
  }

  /* Opcje odpowiedzi - responsywne */
  div[class*="grid"] button,
  button[class*="rounded-lg"] {
    font-size: 0.95rem !important;
    min-height: 3rem !important;
    padding: 0.8rem 1rem !important;
  }

  @media (min-width: 640px) {
    div[class*="grid"] button,
    button[class*="rounded-lg"] {
      font-size: 1.1rem !important;
      min-height: 3.6rem !important;
      padding: 1rem 1.4rem !important;
    }
  }

  @media (min-width: 1024px) {
    div[class*="grid"] button,
    button[class*="rounded-lg"] {
      font-size: 1.25rem !important;
      min-height: 4.2rem !important;
      padding: 1.2rem 1.7rem !important;
    }
  }

  /* Ułamki - bardziej widoczne */
  .katex .frac-line {
    border-bottom-width: 0.08em !important;
  }

  .katex .frac .vlist-t {
    line-height: 1.4 !important;
  }

  /* Nawiasy i symbole */
  .katex .delimsizing {
    font-size: 1.08em !important;
  }

  /* Pierwiastki */
  .katex .sqrt > .vlist-t {
    line-height: 1.3 !important;
  }

  /* Tekst w pytaniach */
  .text-lg {
    font-size: 1.3rem !important;
  }

  /* Kategoria i punkty */
  .text-sm {
    font-size: 1rem !important;
  }

  /* Numer zadania */
  .text-3xl {
    font-size: 2.2rem !important;
  }

  @media (max-width: 1024px) {
    body { font-size: 20px !important; }
    .math-content .katex { font-size: 2em !important; }
    .solution-container .katex { font-size: 1.25em !important; }
    button { font-size: 1.1rem !important; }
    p .katex { font-size: 2.2em !important; }
  }

  @media (max-width: 767px) {
    body { font-size: 18px !important; }
    .math-content .katex { font-size: 1.7em !important; }
    .solution-container .katex { font-size: 1.15em !important; }
    button { 
      font-size: 0.85rem !important; 
      padding: 0.7rem 1rem !important;
      min-height: 2.5rem !important;
    }
    div[class*="grid"] button,
    button[class*="rounded-lg"] {
      font-size: 0.9rem !important;
      min-height: 2.8rem !important;
      padding: 0.75rem 0.9rem !important;
    }
    p .katex { font-size: 1.9em !important; }
  }
}`}</style>
      
      <header className="sticky top-0 z-20 border-b border-[#30363d] bg-[#161b22] shadow-lg">
        <div className="container mx-auto px-2 py-2 md:px-4 md:py-4 relative">
          <div className="flex items-center justify-between">
            <Link 
              href={basePath}
              className="inline-flex items-center gap-1 md:gap-2 text-[#58a6ff] hover:text-[#1f6feb] transition-colors text-sm md:text-base"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Powrót do materiałów</span>
              <span className="sm:hidden">Powrót</span>
            </Link>
            
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1 md:gap-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] px-2 py-1.5 md:px-4 md:py-2 rounded-lg transition-colors text-sm md:text-base"
            >
              <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Pobierz PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>
          </div>
          
          {/* Stats panel nakładający się na header - zawsze widoczny */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="bg-[#161b22] border-2 border-[#30363d] rounded-xl px-2 py-1.5 md:px-4 md:py-2 shadow-2xl backdrop-blur-sm bg-opacity-95 pointer-events-auto">
              <div className="flex items-center gap-2 md:gap-4">
                {/* Timer controls */}
                <div className="flex items-center gap-1 md:gap-2 pr-2 md:pr-4 border-r border-[#30363d]">
                  <button
                    onClick={() => setTimerActive(!timerActive)}
                    className={`p-1 md:p-1.5 rounded-lg transition-all ${
                      timerActive 
                        ? 'bg-yellow-900/30 text-yellow-400 hover:bg-yellow-900/50 border border-yellow-500/30' 
                        : 'bg-green-900/30 text-green-400 hover:bg-green-900/50 border border-green-500/30'
                    }`}
                    title={timerActive ? 'Zatrzymaj timer' : 'Uruchom timer'}
                  >
                    {timerActive ? (
                      <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setTimeElapsed(0);
                      setTimerActive(false);
                    }}
                    className="p-1 md:p-1.5 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-900/50 transition-all border border-red-500/30"
                    title="Zresetuj timer"
                  >
                    <RotateCcw className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-1.5 md:gap-4 text-xs md:text-sm">
                  <div className="flex items-center gap-1 md:gap-2">
                    <Clock className={`w-3 h-3 md:w-4 md:h-4 ${timerActive ? 'text-yellow-400 animate-pulse' : 'text-[#58a6ff]'}`} />
                    <span className={`${timerActive ? 'text-yellow-400 font-semibold' : 'text-gray-400'}`}>
                      {formatTime(timeElapsed)}
                      <span className="hidden sm:inline"> / {examData.duration} min</span>
                    </span>
                  </div>
                  <span className="text-gray-400 hidden sm:inline">Sprawdzone: {checkedCount} / {totalProblems}</span>
                  <span className="sm:hidden text-gray-400">{checkedCount}/{totalProblems}</span>
                  <span className="font-bold text-[#58a6ff]">
                    <span className="hidden sm:inline">Wynik: </span>
                    {totalScore} / {examData.maxPoints} pkt
                  </span>
                </div>

                {(answeredCount > 0 || checkedCount > 0) && (
                  <button
                    onClick={resetAllProblems}
                    className="ml-1 md:ml-2 p-1 md:p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Zacznij od nowa"
                  >
                    <RotateCcw className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#1f6feb] to-[#58a6ff] rounded-full mb-6">
              <Calculator className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#58a6ff] via-[#1f6feb] to-[#0969da] bg-clip-text text-transparent">
              {getExtendedTitle()}
            </h1>
            
            <div className="flex flex-wrap justify-center gap-6 text-gray-300 mb-6">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#58a6ff]" />
                <span>Czas: {examData.duration} minut</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#58a6ff]" />
                <span>Punkty: {examData.maxPoints}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#58a6ff]" />
                <span>Data: {examData.date}</span>
              </div>
            </div>
          </div>



          <div className="space-y-8">
            {examData.problems.map((problem, index) => {
              const userAnswer = userAnswers[problem.id] || [];
              const isChecked = checkedAnswers[problem.id];
              const isCorrect = isAnswerCorrect(problem.id, problem.answer);
              const isMultiChoice = problem.options && hasMultipleAnswers(problem.answer);
              
              return (
                <div 
                  key={problem.id}
                  className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl font-bold text-[#58a6ff]">
                        {index + 1}.
                      </span>
                      <div>
                        <span className="text-sm text-gray-400 block mb-1">
                          {problem.category}
                        </span>
                        <span className="text-sm text-gray-400">
                          {problem.points} {problem.points === 1 ? 'punkt' : problem.points < 5 ? 'punkty' : 'punktów'}
                        </span>
                      </div>
                    </div>

                    {isChecked && isCorrect !== null && (
                      <div className={`px-4 py-2 rounded-lg font-semibold ${
                        isCorrect 
                          ? 'bg-green-900/30 text-green-400 border border-green-500'
                          : 'bg-red-900/30 text-red-400 border border-red-500'
                      }`}>
                        {isCorrect ? `✓ +${problem.points} pkt` : '✗ 0 pkt'}
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <p className="text-lg text-white mb-4">
                      {renderOption(problem.question)}
                    </p>
                    
                    {problem.formula && (
                      <div className="bg-[#21262d] border border-[#30363d] rounded-lg p-4 mb-4 overflow-x-auto">
                        <MathText>{`$$${problem.formula}$$`}</MathText>
                      </div>
                    )}

                    {(() => {
                      const hasScannedImage = !imagesLoading && imageData.problemImages.includes(parseInt(problem.id));
                      const imageSrc = problem.image || (hasScannedImage ? getImagePath(problem.id) : null);
                      
                      if (!imageSrc) return null;
                      
                      return (
                        <div className="bg-[#21262d] border border-[#30363d] rounded-lg p-4 mb-4">
                          <img 
                            src={imageSrc} 
                            alt={`Ilustracja do zadania ${problem.id}`}
                            className="max-w-full h-auto mx-auto rounded-lg"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      );
                    })()}

                    {isMultiChoice && !isChecked && (
                      <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-3 mb-4">
                        <p className="text-blue-400 text-sm">
                          💡 Zaznacz wszystkie prawidłowe odpowiedzi.
                        </p>
                      </div>
                    )}

                    {!problem.options && (
                      <div className="bg-[#21262d] border border-[#30363d] rounded-lg p-6 mt-4">
                        <p className="text-white text-lg mb-4">
                          Czy wykonałeś to zadanie poprawnie?
                        </p>
                        <p className="text-gray-400 text-sm mb-4">
                          Sprawdź swoje rozwiązanie z odpowiedzią poniżej i oceń samodzielnie.
                        </p>
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              selectSingleAnswer(problem.id, 'SELF_YES');
                              checkAnswer(problem.id);
                            }}
                            disabled={isChecked}
                            className={`px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 rounded-lg font-semibold transition-all disabled:cursor-not-allowed text-sm sm:text-base lg:text-lg ${
                              userAnswer[0] === 'SELF_YES' && isChecked
                                ? 'bg-green-600 text-white ring-2 ring-green-500'
                                : 'bg-[#238636] hover:bg-[#2ea043] text-white'
                            }`}
                          >
                            <span className="sm:hidden">✓ Tak</span>
                            <span className="hidden sm:inline">✓ Tak, mam dobrze</span>
                          </button>
                          <button
                            onClick={() => {
                              selectSingleAnswer(problem.id, 'SELF_NO');
                              checkAnswer(problem.id);
                            }}
                            disabled={isChecked}
                            className={`px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 rounded-lg font-semibold transition-all disabled:cursor-not-allowed text-sm sm:text-base lg:text-lg ${
                              userAnswer[0] === 'SELF_NO' && isChecked
                                ? 'bg-red-600 text-white ring-2 ring-red-500'
                                : 'bg-[#da3633] hover:bg-[#b52a26] text-white'
                            }`}
                          >
                            <span className="sm:hidden">✗ Nie</span>
                            <span className="hidden sm:inline">✗ Nie, mam źle</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {problem.options && (
                      <>
                        {isMultiLevelQuestion(problem.options) ? (
                          <div className="space-y-4 mt-4">
                            {problem.options.map((option, optIndex) => {
                              const statement = extractStatement(option);
                              const selectedValue = userAnswer.find(a => a.startsWith(`${optIndex}:`))?.split(':')[1];
                              const availableOptions = getQuestionOptions(option);
                              
                              const correctAnswerForPart = problem.answer.charAt(optIndex);
                              const isPartCorrect = isChecked && selectedValue === correctAnswerForPart;
                              const isPartIncorrect = isChecked && selectedValue && selectedValue !== correctAnswerForPart;
                              
                              return (
                                <div key={optIndex} className={`border rounded-lg p-4 ${
                                  isPartCorrect ? 'bg-green-900/20 border-green-500' :
                                  isPartIncorrect ? 'bg-red-900/20 border-red-500' :
                                  'bg-[#21262d] border-[#30363d]'
                                }`}>
                                  <p className="text-white mb-3">{renderOption(statement)}</p>
                                  <div className="flex gap-3 flex-wrap">
                                    {availableOptions.map((optionValue) => {
                                      const getOptionLabel = (value: string) => {
                                        switch(value) {
                                          case 'P': return 'Prawda (P)';
                                          case 'F': return 'Fałsz (F)';
                                          case 'A': return 'A';
                                          case 'B': return 'B';
                                          case 'C': return 'C';
                                          case 'D': return 'D';
                                          case '1': return '1';
                                          case '2': return '2';
                                          case '3': return '3';
                                          default: return value;
                                        }
                                      };
                                      
                                      let buttonClass = '';
                                      if (selectedValue === optionValue) {
                                        if (isChecked) {
                                          if (optionValue === correctAnswerForPart) {
                                            buttonClass = 'bg-green-600 text-white ring-2 ring-green-500';
                                          } else {
                                            buttonClass = 'bg-red-600 text-white ring-2 ring-red-500';
                                          }
                                        } else {
                                          buttonClass = 'bg-[#58a6ff] text-black ring-2 ring-[#58a6ff]';
                                        }
                                      } else {
                                        buttonClass = 'bg-[#30363d] text-white hover:bg-[#40464d]';
                                      }
                                      
                                      return (
                                        <button
                                          key={optionValue}
                                          onClick={() => {
                                            const newAnswer = userAnswer.filter(a => !a.startsWith(`${optIndex}:`));
                                            selectSingleAnswer(problem.id, '');
                                            setUserAnswers(prev => ({
                                              ...prev,
                                              [problem.id]: [...newAnswer, `${optIndex}:${optionValue}`]
                                            }));
                                          }}
                                          disabled={isChecked}
                                          className={`px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 rounded-lg font-semibold transition-all disabled:cursor-not-allowed text-xs sm:text-sm lg:text-base ${buttonClass}`}
                                        >
                                          {getOptionLabel(optionValue)}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                            {problem.options.map((option, optIndex) => {
                              const isSelected = userAnswer.includes(option);
                              const isCorrectOption = problem.answer.includes(option.charAt(0)) || 
                                                    problem.answer === option;
                              
                              let borderColor = 'border-[#30363d]';
                              let bgColor = 'bg-[#21262d]';
                              
                              if (isChecked) {
                                if (isCorrectOption) {
                                  borderColor = 'border-green-500';
                                  bgColor = 'bg-green-900/20';
                                } else if (isSelected) {
                                  borderColor = 'border-red-500';
                                  bgColor = 'bg-red-900/20';
                                }
                              } else if (isSelected) {
                                borderColor = 'border-[#58a6ff]';
                                bgColor = 'bg-[#30363d]';
                              }
                              
                              return (
                                <button
                                  key={optIndex}
                                  onClick={() => isMultiChoice 
                                    ? toggleAnswer(problem.id, option)
                                    : selectSingleAnswer(problem.id, option)
                                  }
                                  disabled={isChecked}
                                  className={`${bgColor} border-2 ${borderColor} rounded-lg p-2 sm:p-3 lg:p-4 text-left text-white transition-all hover:bg-[#30363d] disabled:cursor-not-allowed text-sm sm:text-base lg:text-lg min-h-[2.5rem] sm:min-h-[3rem] lg:min-h-[3.5rem] ${
                                    isSelected ? 'ring-2 ring-[#58a6ff] ring-opacity-50' : ''
                                  }`}
                                >
                                  <div className="flex items-start gap-1.5 sm:gap-2">
                                    {isMultiChoice && (
                                      <div className={`mt-0.5 sm:mt-1 w-3 h-3 sm:w-4 sm:h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                                        isSelected ? 'bg-[#58a6ff] border-[#58a6ff]' : 'border-gray-500'
                                      }`}>
                                        {isSelected && (
                                          <svg className="w-2 h-2 sm:w-3 sm:h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                          </svg>
                                        )}
                                      </div>
                                    )}
                                    <div className="flex-1">
                                      {renderOption(option)}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {problem.options && !isChecked && (
                      <button
                        onClick={() => checkAnswer(problem.id)}
                        disabled={userAnswer.length === 0}
                        className="inline-flex items-center gap-2 bg-[#238636] hover:bg-[#2ea043] disabled:bg-[#21262d] disabled:text-gray-500 text-white px-4 py-2 rounded-lg transition-colors disabled:cursor-not-allowed"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Sprawdź odpowiedź
                      </button>
                    )}

                    {isChecked && isCorrect === false && (
                      <button
                        onClick={() => resetProblem(problem.id)}
                        className="inline-flex items-center gap-2 bg-[#f85149] hover:bg-[#da3633] text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Spróbuj ponownie
                      </button>
                    )}

                    <button
                      onClick={() => toggleCanvas(problem.id)}
                      className="inline-flex items-center gap-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      <PenTool className="w-4 h-4" />
                      {showCanvas[problem.id] ? 'Ukryj rozwiązywanie' : 'Rozwiązuj'}
                    </button>

                    <button
                      onClick={() => toggleSolution(problem.id)}
                      className="inline-flex items-center gap-2 bg-[#58a6ff] hover:bg-[#4493f8] text-black px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      {visibleSolutions[problem.id] ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          Ukryj rozwiązanie
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          Pokaż rozwiązanie
                        </>
                      )}
                    </button>
                  </div>

                  {showCanvas[problem.id] && <AdvancedCanvas problemId={problem.id} />}
                  {visibleSolutions[problem.id] && (
                    <div className="border-t border-[#30363d] pt-6 mt-6">
                      <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4 mb-4">
                        <h4 className="text-green-400 font-semibold mb-2">Odpowiedź:</h4>
                        <div className="text-white">
                          {renderOption(problem.answer)}
                        </div>
                      </div>

                      {problem.solution && problem.solution.length > 0 && (
                        <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4 solution-container">
                          <h4 className="text-blue-400 font-semibold mb-3">Rozwiązanie:</h4>
                          <ol className="space-y-2 solution-container">
                           {problem.solution.map((step, stepIndex) => (
                              <li key={stepIndex} className="text-white solution-container">
                                <span className="text-blue-400 mr-2">{stepIndex + 1}.</span>
                                <span className="inline-block solution-container">
                                  {renderSolutionStep(step)}
                                </span>
                              </li>
                            ))}
                          </ol>
                          
                          {(() => {
                            if (problem.solutionImages && problem.solutionImages.length > 0) {
                              return (
                                <div className="mt-4 space-y-3">
                                  {problem.solutionImages.map((imageSrc, imageIndex) => (
                                    <div key={imageIndex} className="bg-[#21262d] border border-[#30363d] rounded-lg p-3">
                                      <img 
                                        src={imageSrc} 
                                        alt={`Ilustracja rozwiązania ${imageIndex + 1}`}
                                        className="max-w-full h-auto mx-auto rounded-lg"
                                        loading="lazy"
                                      />
                                    </div>
                                  ))}
                                </div>
                              );
                            }
                            
                            const problemId = parseInt(problem.id);
                            const scannedSolutionImages = !imagesLoading && imageData.solutionImages[problemId];
                            
                            if (scannedSolutionImages && scannedSolutionImages.length > 0) {
                              return (
                                <div className="mt-4 space-y-3">
                                  {scannedSolutionImages.map((solutionIndex, arrayIndex) => (
                                    <div key={arrayIndex} className="bg-[#21262d] border border-[#30363d] rounded-lg p-3">
                                      <img 
                                        src={getImagePath(problem.id, 'solution', solutionIndex - 1)} 
                                        alt={`Ilustracja rozwiązania ${solutionIndex}`}
                                        className="max-w-full h-auto mx-auto rounded-lg"
                                        loading="lazy"
                                      />
                                    </div>
                                  ))}
                                </div>
                              );
                            }
                            
                            return null;
                          })()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {checkedCount === totalProblems && (
            <div className="mt-12 bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] rounded-2xl p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Gratulacje! Ukończyłeś egzamin
              </h2>
              <div className="text-5xl font-bold text-white mb-2">
                {totalScore} / {examData.maxPoints}
              </div>
              <p className="text-xl text-white/90">
                {Math.round((totalScore / examData.maxPoints) * 100)}% poprawnych odpowiedzi
              </p>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] hover:from-[#1a5fcf] hover:to-[#4493f8] text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Potrzebujesz pomocy z tymi zadaniami? Umów korepetycje!
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-[#30363d] bg-[#161b22] mt-20">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-400">
            © 2024 Patryk Kulesza - Korepetycje z Matematyki. Wszystkie prawa zastrzeżone.
          </p>
        </div>
      </footer>
    </div>
  );
}