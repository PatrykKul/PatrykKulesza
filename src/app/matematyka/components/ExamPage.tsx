'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, Clock, Award, FileText, Download, Eye, EyeOff, CheckCircle, RotateCcw, PenTool, Eraser, Trash2 } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { useImageScan } from '@/hooks/useImageScan';

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
  
  // Automatyczne skanowanie folderów z obrazami
  const { imageData, loading: imagesLoading } = useImageScan(examType, year, type, level);

  // Funkcja do generowania rozszerzonego tytułu z rokiem i typem
  const getExtendedTitle = () => {
    const baseTitle = examData.title;
    
    // Funkcja do ładnego formatowania typu egzaminu
    const formatType = (type: string) => {
      const typeMap: Record<string, string> = {
        'glowny': 'Maj',
        'dodatkowy': 'Czerwiec', 
        'podstawowa': 'Podstawowa',
        'rozszerzona': 'Rozszerzona'
      };
      return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1);
    };

    // Funkcja do formatowania typu egzaminu
    const formatExamType = (examType: string) => {
      const examTypeMap: Record<string, string> = {
        'egzamin-8': 'Egzamin Ósmoklasisty',
        'matura': 'Matura'
      };
      return examTypeMap[examType] || examType;
    };

    let titleParts = [];
    
    // Dodaj typ egzaminu jeśli nie jest już w tytule
    const formattedExamType = formatExamType(examType || 'egzamin');
    if (!baseTitle.includes('Egzamin') && !baseTitle.includes('Matura')) {
      titleParts.push(formattedExamType);
    }
    
     // Dodaje Miesiąc
    const formattedMonth = formatType(type);
    if (!baseTitle.includes(formattedMonth)) {
      titleParts.push(formattedMonth);
    }

    // Dodaj rok
    titleParts.push(year);
    
    // Dodaj poziom dla matury
    if (level && examType === 'matura') {
      const formattedLevel = formatType(level);
      if (!baseTitle.includes(formattedLevel)) {
        titleParts.push(formattedLevel);
      }
    }

    // Jeśli tytuł już zawiera wszystkie informacje, zwróć go bez zmian
    const hasYear = baseTitle.includes(year);
    const hasType = baseTitle.toLowerCase().includes(type.toLowerCase());
    
    if (hasYear && hasType) {
      return baseTitle;
    }

    // W przeciwnym razie dodaj brakujące informacje
    if (titleParts.length > 0) {
      return `${baseTitle}  ${titleParts.join(' ')}`;
    }
    
    return baseTitle;
  };

  // Funkcja do automatycznego generowania ścieżki obrazu
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
  };

  const resetAllProblems = () => {
    if (confirm('Czy na pewno chcesz zresetować wszystkie odpowiedzi i zacząć od początku?')) {
      setUserAnswers({});
      setCheckedAnswers({});
      setVisibleSolutions({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isAnswerCorrect = (problemId: string, correctAnswer: string) => {
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
  };

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
    const parseTextSegments = (text: string) => {
      const segments: Array<{ type: 'text' | 'math', content: string }> = [];
      const mathPattern = /\\frac\{[^}]+\}\{[^}]+\}|\\sqrt\{[^}]+\}|\\[a-zA-Z]+(?:\{[^}]*\})*|\^\{[^}]+\}|\_{[^}]+}/g;
      
      let lastIndex = 0;
      let match;
      
      while ((match = mathPattern.exec(text)) !== null) {
        if (match.index > lastIndex) {
          const textSegment = text.substring(lastIndex, match.index);
          if (textSegment.trim()) {
            segments.push({ type: 'text', content: textSegment });
          }
        }
        
        segments.push({ type: 'math', content: match[0] });
        lastIndex = match.index + match[0].length;
      }
      
      if (lastIndex < text.length) {
        const textSegment = text.substring(lastIndex);
        if (textSegment.trim()) {
          segments.push({ type: 'text', content: textSegment });
        }
      }
      
      if (segments.length === 0) {
        segments.push({ type: 'text', content: text });
      }
      
      return segments;
    };

    const hasLatex = /\\[a-zA-Z]+|\\frac|\\sqrt|\{[^}]*\}|\\cdot|\\times|\\div|\^|\\_/.test(option);
    
    if (!hasLatex) {
      return <span>{option}</span>;
    }

    const processedOption = option.replace(/\{,\}/g, ',');
    const segments = parseTextSegments(processedOption);
    
    return (
      <span className="inline-flex items-baseline flex-wrap">
        {segments.map((segment, index) => {
          if (segment.type === 'text') {
            return <span key={index}>{segment.content}</span>;
          } else {
            return (
              <InlineMath 
                key={index}
                math={segment.content}
                renderError={(_error) => {
                  console.warn('LaTeX render error:', _error);
                  
                  const fallbackText = segment.content
                    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1/$2')
                    .replace(/\\cdot/g, '·')
                    .replace(/\\times/g, '×')
                    .replace(/\\div/g, '÷')
                    .replace(/\\approx/g, '≈')
                    .replace(/\\Rightarrow/g, '⇒')
                    .replace(/\\checkmark/g, '✓')
                    .replace(/\\text\{([^}]+)\}/g, '$1')
                    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
                    .replace(/\^?\{([^}]+)\}/g, '^$1')
                    .replace(/\\_\{([^}]+)\}/g, '_$1')
                    .replace(/\\/g, '');

                  return <span>{fallbackText}</span>;
                }}
              />
            );
          }
        })}
      </span>
    );
  };

  const renderSolutionStep = (step: string) => {
    if (step.includes(' | ')) {
      const [comment, math] = step.split(' | ', 2);
      return (
        <span className="inline-flex items-baseline flex-wrap gap-1">
          <span className="text-white">{comment.trim()}</span>
          <span className="text-blue-200">
            <InlineMath 
              math={math.trim().replace(/\{,\}/g, ',')}
              renderError={() => {
                const fallbackText = math.trim()
                  .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1/$2')
                  .replace(/\\cdot/g, '·')
                  .replace(/\\times/g, '×')
                  .replace(/\\div/g, '÷')
                  .replace(/\\approx/g, '≈')
                  .replace(/\\Rightarrow/g, '⇒')
                  .replace(/\\checkmark/g, '✓')
                  .replace(/\\text\{([^}]+)\}/g, '$1')
                  .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
                  .replace(/\^?\{([^}]+)\}/g, '^$1')
                  .replace(/\\_\{([^}]+)\}/g, '_$1')
                  .replace(/\\/g, '');

                return <span>{fallbackText}</span>;
              }}
            />
          </span>
        </span>
      );
    }
    
    return renderOption(step);
  };

  // Komponent Canvas do rysowania
  const DrawingCanvas = ({ problemId }: { problemId: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
    const [color, setColor] = useState('#000000');
    const [lineWidth, setLineWidth] = useState(2);

    useEffect(() => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      // Ustaw rozmiar canvas na rozmiar kontenera
      canvas.width = container.clientWidth;
      canvas.height = 500; // Stała wysokość

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Załaduj zapisany rysunek z localStorage
      const savedDrawing = localStorage.getItem(`canvas-${problemId}`);
      if (savedDrawing) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
        };
        img.src = savedDrawing;
      } else {
        // Narysuj białe tło
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Narysuj kratkę
        const gridSize = 10;
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 0.5;

        for (let x = 0; x <= canvas.width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }

        for (let y = 0; y <= canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }

        // Co 5 kratek - grubsza linia
        ctx.strokeStyle = '#d1d5db';
        ctx.lineWidth = 1;

        for (let x = 0; x <= canvas.width; x += gridSize * 5) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }

        for (let y = 0; y <= canvas.height; y += gridSize * 5) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
      }
    }, [problemId]);

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      setIsDrawing(true);
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (tool === 'eraser') {
        // Gumka - maluj białym kolorem
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = lineWidth * 4;
      } else {
        // Ołówek - maluj wybranym kolorem
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
      }

      ctx.lineTo(x, y);
      ctx.stroke();
    };

    const stopDrawing = () => {
      if (!isDrawing) return;
      setIsDrawing(false);

      const canvas = canvasRef.current;
      if (!canvas) return;

      // Zapisz rysunek do localStorage
      const dataURL = canvas.toDataURL();
      localStorage.setItem(`canvas-${problemId}`, dataURL);
    };

    const clearCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Wyczyść canvas
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Narysuj kratkę ponownie
      const gridSize = 10;
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 0.5;

      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      ctx.strokeStyle = '#d1d5db';
      ctx.lineWidth = 1;

      for (let x = 0; x <= canvas.width; x += gridSize * 5) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y <= canvas.height; y += gridSize * 5) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Usuń z localStorage
      localStorage.removeItem(`canvas-${problemId}`);
    };

    const colors = [
      { name: 'Czarny', value: '#000000' },
      { name: 'Niebieski', value: '#2563eb' },
      { name: 'Czerwony', value: '#dc2626' },
      { name: 'Zielony', value: '#16a34a' },
    ];

    const lineWidths = [
      { name: 'Cienka', value: 2 },
      { name: 'Średnia', value: 4 },
      { name: 'Gruba', value: 6 },
    ];

    return (
      <div className="bg-[#21262d] border border-[#30363d] rounded-lg p-4 mt-4">
        <div className="flex flex-wrap items-center gap-3 mb-4 pb-4 border-b border-[#30363d]">
          {/* Narzędzia */}
          <div className="flex gap-2">
            <button
              onClick={() => setTool('pen')}
              className={`p-2 rounded-lg transition-all ${
                tool === 'pen'
                  ? 'bg-[#58a6ff] text-black'
                  : 'bg-[#30363d] text-white hover:bg-[#40464d]'
              }`}
              title="Ołówek"
            >
              <PenTool className="w-5 h-5" />
            </button>
            <button
              onClick={() => setTool('eraser')}
              className={`p-2 rounded-lg transition-all ${
                tool === 'eraser'
                  ? 'bg-[#58a6ff] text-black'
                  : 'bg-[#30363d] text-white hover:bg-[#40464d]'
              }`}
              title="Gumka"
            >
              <Eraser className="w-5 h-5" />
            </button>
            <button
              onClick={clearCanvas}
              className="p-2 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-900/50 transition-all border border-red-500/30"
              title="Wyczyść wszystko"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          {/* Kolory */}
          {tool === 'pen' && (
            <div className="flex gap-2 pl-3 border-l border-[#30363d]">
              {colors.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  className={`w-8 h-8 rounded-lg transition-all ${
                    color === c.value ? 'ring-2 ring-[#58a6ff] ring-offset-2 ring-offset-[#21262d]' : ''
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          )}

          {/* Grubość linii */}
          {tool === 'pen' && (
            <div className="flex gap-2 pl-3 border-l border-[#30363d]">
              {lineWidths.map((lw) => (
                <button
                  key={lw.value}
                  onClick={() => setLineWidth(lw.value)}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    lineWidth === lw.value
                      ? 'bg-[#58a6ff] text-black'
                      : 'bg-[#30363d] text-white hover:bg-[#40464d]'
                  }`}
                >
                  {lw.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Canvas */}
        <div ref={containerRef} className="w-full">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="w-full border-2 border-[#30363d] rounded-lg cursor-crosshair shadow-lg bg-white"
            style={{ touchAction: 'none' }}
          />
        </div>
      </div>
    );
  };

  const totalScore = useMemo(() => {
    let earned = 0;
    examData.problems.forEach(problem => {
      if (isAnswerCorrect(problem.id, problem.answer) === true) {
        earned += problem.points;
      }
    });
    return earned;
  }, [userAnswers, checkedAnswers, examData.problems, isAnswerCorrect]);

  const answeredCount = Object.keys(userAnswers).filter(key => userAnswers[key].length > 0).length;
  const checkedCount = Object.keys(checkedAnswers).filter(key => checkedAnswers[key]).length;
  const totalProblems = examData.problems.length;

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      {/* Style dla drukowania - zachowaj kolory */}
      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          body {
            background-color: #0d1117 !important;
          }
          
          /* Ukryj elementy niepotrzebne w PDF */
          header,
          footer,
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      
      {/* Header - sticky */}
      <header className="sticky top-0 z-20 border-b border-[#30363d] bg-[#161b22] shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href={basePath}
              className="inline-flex items-center gap-2 text-[#58a6ff] hover:text-[#1f6feb] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Powrót do materiałów
            </Link>
            
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Pobierz PDF
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
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

          {/* Licznik postępu - sticky */}
          <div className="sticky top-20 z-10 mb-8 flex justify-center pointer-events-none">
            <div className="bg-[#161b22] border-2 border-[#30363d] rounded-xl px-6 py-4 shadow-2xl backdrop-blur-sm bg-opacity-95 pointer-events-auto max-w-fit">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <span className="text-sm text-gray-400 mb-1">
                              Sprawdzone: {checkedCount} / {totalProblems}
                            </span>  
                            <span className="text-lg font-bold text-[#58a6ff]"> Wynik: {totalScore} / {examData.maxPoints} pkt
                            </span>
                          </div>
                          
                          {(answeredCount > 0 || checkedCount > 0) && (
                            <button
                              onClick={resetAllProblems}
                              className="ml-4 p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Zacznij od nowa"
                            >
                              <RotateCcw className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

          {/* Zadania */}
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
                  {/* Header zadania */}
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

                  {/* Treść zadania */}
                  <div className="mb-6">
                    <p className="text-lg text-white mb-4">
                      {renderOption(problem.question)}
                    </p>
                    
                    {problem.formula && (
                      <div className="bg-[#21262d] border border-[#30363d] rounded-lg p-4 mb-4 overflow-x-auto">
                        <BlockMath 
                          math={problem.formula}
                          renderError={(error) => (
                            <span className="text-red-400 font-mono text-sm">
                              Błąd renderowania: {problem.formula}
                            </span>
                          )}
                        />
                      </div>
                    )}

                    {/* Renderowanie obrazu zadania */}
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
                            className={`px-8 py-3 rounded-lg font-semibold transition-all disabled:cursor-not-allowed ${
                              userAnswer[0] === 'SELF_YES' && isChecked
                                ? 'bg-green-600 text-white ring-2 ring-green-500'
                                : 'bg-[#238636] hover:bg-[#2ea043] text-white'
                            }`}
                          >
                            ✓ Tak, mam dobrze
                          </button>
                          <button
                            onClick={() => {
                              selectSingleAnswer(problem.id, 'SELF_NO');
                              checkAnswer(problem.id);
                            }}
                            disabled={isChecked}
                            className={`px-8 py-3 rounded-lg font-semibold transition-all disabled:cursor-not-allowed ${
                              userAnswer[0] === 'SELF_NO' && isChecked
                                ? 'bg-red-600 text-white ring-2 ring-red-500'
                                : 'bg-[#da3633] hover:bg-[#b52a26] text-white'
                            }`}
                          >
                            ✗ Nie, mam źle
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
                              
                              // Sprawdź poprawność tej części zadania
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
                                      
                                      // Określ kolory dla przycisków
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
                                          className={`px-6 py-2 rounded-lg font-semibold transition-all disabled:cursor-not-allowed ${buttonClass}`}
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
                              
                              let borderColor = 'border-[#30363d]';
                              let bgColor = 'bg-[#21262d]';
                              
                              if (isChecked && isSelected) {
                                if (isCorrect === true) {
                                  borderColor = 'border-green-500';
                                  bgColor = 'bg-green-900/20';
                                } else {
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
                                  className={`${bgColor} border-2 ${borderColor} rounded-lg p-3 text-left text-white transition-all hover:bg-[#30363d] disabled:cursor-not-allowed ${
                                    isSelected ? 'ring-2 ring-[#58a6ff] ring-opacity-50' : ''
                                  }`}
                                >
                                  <div className="flex items-start gap-2">
                                    {isMultiChoice && (
                                      <div className={`mt-1 w-4 h-4 rounded border-2 flex items-center justify-center ${
                                        isSelected ? 'bg-[#58a6ff] border-[#58a6ff]' : 'border-gray-500'
                                      }`}>
                                        {isSelected && (
                                          <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
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

                  {/* Przyciski akcji */}
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

                  {/* Canvas do rysowania */}
                  {showCanvas[problem.id] && <DrawingCanvas problemId={problem.id} />}

                  {/* Odpowiedź i rozwiązanie */}
                  {visibleSolutions[problem.id] && (
                    <div className="border-t border-[#30363d] pt-6 mt-6">
                      <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4 mb-4">
                        <h4 className="text-green-400 font-semibold mb-2">Odpowiedź:</h4>
                        <div className="text-white">
                          {renderOption(problem.answer)}
                        </div>
                      </div>

                      {problem.solution && problem.solution.length > 0 && (
                        <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
                          <h4 className="text-blue-400 font-semibold mb-3">Rozwiązanie:</h4>
                          <ol className="space-y-2">
                           {problem.solution.map((step, stepIndex) => (
                              <li key={stepIndex} className="text-white">
                                <span className="text-blue-400 mr-2">{stepIndex + 1}.</span>
                                <span className="inline-block">
                                  {renderSolutionStep(step)}
                                </span>
                              </li>
                            ))}
                          </ol>
                          
                          {/* Zdjęcia w rozwiązaniu */}
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

          {/* Podsumowanie na końcu */}
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

          {/* CTA */}
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

      {/* Footer */}
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