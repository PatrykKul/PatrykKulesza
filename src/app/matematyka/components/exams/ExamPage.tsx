'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, Clock, Award, FileText, Download, Eye, EyeOff, CheckCircle, RotateCcw, PenTool, X, Delete, Plus, Minus, Divide, MessageSquare } from 'lucide-react';
import MathText, { MathSolutionStep } from '../MathText';
import { useImageScan } from '@/hooks/useImageScan';
import WhiteboardCanvas from '../whiteboard/WhiteboardCanvas';
import ConfettiModal from './ConfettiModal';
import { useExamContext } from '@/app/matematyka/components/exams/ExamContext';

// Types
export interface MathProblem {
  id: string;
  question?: string;  // Opcjonalne dla starych egzaminów
  formula?: string;
  image?: string;
  images?: string[];
  options?: string[];
  answer: string;
  solution?: string[];
  solutionImages?: string[];
  points?: number;  // Opcjonalne dla starych egzaminów
  category?: string;  // Opcjonalne dla starych egzaminów
}

export interface ExamData {
  title: string;
  date: string;
  duration: number;
  maxPoints: number;
  problems: MathProblem[];
  examPdfUrl?: string;    // Ścieżka do oryginalnego arkusza
  answerKeyUrl?: string;  // Ścieżka do klucza odpowiedzi
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
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showTimerNotification, setShowTimerNotification] = useState(true);
  const [splitSize, setSplitSize] = useState(50); // % width for left panel
  const [isDragging, setIsDragging] = useState(false);
  
  // 🔥 Refs do śledzenia widocznych zadań
  const problemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // ExamContext integration
  const {
    setCurrentProblem,
    setUserAnswer: setContextUserAnswer,
    setIsChecked: setContextIsChecked,
    setCanvasData: setContextCanvasData,
    setExamInfo,
    setTimeElapsed: setContextTimeElapsed,
    setTotalProblems,
    setCompletedProblems,
    setAllProblems
  } = useExamContext();

  const { imageData, loading: imagesLoading } = useImageScan(examType, year, type, level);
  
  // 🔥 Intersection Observer - automatyczne śledzenie aktualnego zadania
  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    
    // Poczekaj aż DOM się załaduje
    const timeoutId = setTimeout(() => {
      const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -20% 0px', // Środek ekranu
        threshold: 0.5 // 50% widoczności
      };

      const observerCallback = (entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const problemId = entry.target.getAttribute('data-problem-id');
            if (problemId) {
              const problem = examData.problems.find(p => p.id === problemId);
              if (problem) {
                setCurrentProblem(problem);
                setContextUserAnswer(userAnswers[problem.id] || []);
                setContextIsChecked(checkedAnswers[problem.id] || false);
              }
            }
          }
        });
      };

      observer = new IntersectionObserver(observerCallback, observerOptions);

      // Obserwuj wszystkie zadania
      const refs = Object.values(problemRefs.current);
      refs.forEach(ref => {
        if (ref) observer?.observe(ref);
      });
    }, 100); // Daj czas na renderowanie DOM

    return () => {
      clearTimeout(timeoutId);
      if (observer) observer.disconnect();
    };
  }, [examData.problems, userAnswers, checkedAnswers, setCurrentProblem, setContextUserAnswer, setContextIsChecked]);

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
    // Zwracamy po prostu tytuł z danych egzaminu
    return examData.title;
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
    
    // For multiple images, use letter suffix (a, b, c, etc.)
    if (imageIndex !== undefined) {
      const letterSuffix = String.fromCharCode(97 + imageIndex); // 97 = 'a'
      return `${basePath}${problemId}${letterSuffix}.png`;
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

  // Resizable split handlers
  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const newSize = (e.clientX / window.innerWidth) * 100;
    
    // Auto-collapse logic
    if (newSize < 25) {
      // Collapsing left panel (exam) - show only whiteboard
      setSplitSize(0);
    } else if (newSize > 85) {
      // Collapsing right panel (whiteboard) - show only exam
      setSplitSize(100);
    } else {
      // Normal resizing between 30% and 80%
      setSplitSize(Math.min(Math.max(newSize, 30), 80));
    }
  }, [isDragging]);








  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove]);

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

  // 🔥 KORKUŚ Integration Functions
  const buildProblemContext = useCallback((
    problem: MathProblem, 
    userAnswer: string[] | undefined,
    isChecked: boolean | undefined
  ) => {
    let context = `🎯 **ZADANIE ${problem.id}**\n\n`;
    
    // Kategoria i punkty
    context += `📚 **Kategoria:** ${problem.category || 'Ogólna'}\n`;
    context += `⭐ **Punkty:** ${problem.points || 1}\n\n`;
    
    // Treść zadania
    if (problem.question) {
      context += `📝 **Treść:**\n${problem.question}\n\n`;
    }
    
    // Formuła jeśli jest
    if (problem.formula) {
      context += `📐 **Wzór/Formuła:**\n${problem.formula}\n\n`;
    }
    
    // Opcje odpowiedzi
    if (problem.options && problem.options.length > 0) {
      context += `❓ **Opcje odpowiedzi:**\n`;
      problem.options.forEach(opt => {
        context += `  ${opt}\n`;
      });
      context += '\n';
    }
    
    // Status odpowiedzi ucznia
    if (userAnswer && userAnswer.length > 0) {
      context += `✍️ **Twoja odpowiedź:** ${userAnswer.join(', ')}\n`;
      if (isChecked) {
        const correct = isAnswerCorrect(problem.id, problem.answer);
        if (correct === true) {
          context += `✅ **Status:** Poprawna! Świetnie!\n`;
        } else if (correct === false) {
          context += `❌ **Status:** Niepoprawna - ale to okazja do nauki!\n`;
        }
      } else {
        context += `🤔 **Status:** Jeszcze nie sprawdzone\n`;
      }
      context += '\n';
    } else {
      context += `📝 **Status:** Jeszcze nie udzielono odpowiedzi\n\n`;
    }
    
    // Info o obrazach/diagramach
    if (problem.image || problem.images) {
      context += `🖼️ **Zadanie zawiera:** Diagram/wykres/ilustrację\n\n`;
    }
    
    // Canvas info
    const canvasData = localStorage.getItem(`canvas-data-${problem.id}`);
    if (canvasData) {
      try {
        const parsed = JSON.parse(canvasData);
        const shapes = parsed.shapes?.length || 0;
        const texts = parsed.textElements?.length || 0;
        
        context += `✏️ **Twoje notatki na canvas:** ${shapes} kształtów, ${texts} tekstów\n`;
        
        if (texts > 0) {
          const textContent = parsed.textElements.map((t: { text: string }) => t.text).join(' ');
          context += `📝 **Twoje zapiski:** "${textContent}"\n`;
        }
      } catch (e: unknown) {
        context += `✏️ **Canvas:** Pracujesz nad rozwiązaniem\n`;
      }
      context += '\n';
    }
    
    return context;
  }, [isAnswerCorrect]);

  const askKorkus = useCallback((problem: MathProblem) => {
    // Przygotuj smart context
    const context = buildProblemContext(
      problem, 
      userAnswers[problem.id], 
      checkedAnswers[problem.id]
    );
    
    // Przygotuj obrazy zadania
    const imageUrls: string[] = [];
    if (problem.image) {
      imageUrls.push(problem.image);
    }
    if (problem.images && problem.images.length > 0) {
      imageUrls.push(...problem.images);
    }
    
    // Ustaw current problem w kontekście
    setCurrentProblem(problem);
    setContextUserAnswer(userAnswers[problem.id] || []);
    setContextIsChecked(checkedAnswers[problem.id] || false);
    
    // Event do chatbota
    window.dispatchEvent(new CustomEvent('korkus:openWithProblem', {
      detail: { 
        context, 
        problemId: problem.id,
        imageUrls, // 🔥 Dodajemy obrazy
        examInfo: {
          title: examData.title,
          year,
          type,
          level: level || '',
          examType
        }
      }
    }));
  }, [userAnswers, checkedAnswers, buildProblemContext, setCurrentProblem, setContextUserAnswer, setContextIsChecked, examData.title, year, type, level, examType]);

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
        earned += problem.points || 1;  // Domyślnie 1 punkt
      }
    });
    return earned;
  }, [examData.problems, isAnswerCorrect]);

  const answeredCount = Object.keys(userAnswers).filter(key => userAnswers[key].length > 0).length;
  const checkedCount = Object.keys(checkedAnswers).filter(key => checkedAnswers[key]).length;
  const totalProblems = examData.problems.length;

  // Wykrycie ukończenia egzaminu
  const isExamCompleted = checkedCount === totalProblems && totalProblems > 0;
  const prevCompletedRef = useRef(false);

  // Automatyczne uruchamianie timera na początku
  useEffect(() => {
    // Timer zaczyna się automatycznie gdy komponent się załaduje
    setTimerActive(true);
    
    // Ukryj powiadomienie o timerze po 4 sekundach
    const timer = setTimeout(() => {
      setShowTimerNotification(false);
    }, 4000);
    
    return () => clearTimeout(timer);
  }, []); // Pusty dependency array = uruchom tylko raz na początku

  // ExamContext initialization
  useEffect(() => {
    // Inicjalizuj informacje o egzaminie
    setExamInfo({
      title: examData.title,
      level: level || '',
      year: year,
      type: type,
      examType: examType || 'egzamin'
    });
    
    // Ustaw liczbę zadań i wszystkie zadania
    setTotalProblems(examData.problems.length);
    setAllProblems(examData.problems); // 🔥 Przekaż wszystkie zadania
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examData.title, examData.problems.length, level, year, type, examType]);

  // Sync timeElapsed with context
  useEffect(() => {
    setContextTimeElapsed(timeElapsed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeElapsed]);

  // Sync completed problems
  useEffect(() => {
    const completed = Object.keys(checkedAnswers).filter(key => checkedAnswers[key]).length;
    setCompletedProblems(completed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedAnswers]);

  useEffect(() => {
    if (isExamCompleted && !prevCompletedRef.current) {
      // Egzamin został właśnie ukończony - zatrzymaj timer
      setTimerActive(false);
      
      setTimeout(() => {
        setShowCompletionModal(true);
      }, 500); // Małe opóźnienie dla lepszego UX
    }
    prevCompletedRef.current = isExamCompleted;
  }, [isExamCompleted]);

  // Calculator component
  const MathCalculator = () => {
    const [display, setDisplay] = useState('0');
    const [previousValue, setPreviousValue] = useState<number | null>(null);
    const [operation, setOperation] = useState<string | null>(null);
    const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  // Floating window state - better mobile positioning
  const getInitialPosition = () => {
    if (typeof window === 'undefined') return { x: 100, y: 100 };
    const isMobileDevice = window.innerWidth < 768;
    return {
      x: isMobileDevice ? 20 : 100,
      y: isMobileDevice ? 20 : 100
    };
  };
  const [position, setPosition] = useState(getInitialPosition);
  // Use refs for dragging to avoid render lag
  const positionRef = useRef(position);
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const calculatorRef = useRef<HTMLDivElement>(null);

  // Resize state
  const isResizingRef = useRef(false);
  const resizeStartRef = useRef({ width: 0, height: 0, x: 0, y: 0 });

  // Base dimensions and current size
  const BASE_WIDTH = 340;
  const BASE_HEIGHT = 540;
  const MIN_WIDTH = 280;
  const MIN_HEIGHT = 540;
  const MAX_WIDTH = 600;
  const MAX_HEIGHT = 800;

  // Initial size - smaller on mobile
  const getInitialSize = () => {
    if (typeof window === 'undefined') return { width: BASE_WIDTH, height: BASE_HEIGHT };
    const isMobileDevice = window.innerWidth < 768;
    return {
      width: isMobileDevice ? Math.min(280, window.innerWidth - 40) : BASE_WIDTH,
      height: isMobileDevice ? Math.min(400, window.innerHeight - 100) : BASE_HEIGHT
    };
  };
  const [currentSize, setCurrentSize] = useState(getInitialSize);
  
  // Mobile detection
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  // Calculate scale factors separately for width and height
  const scaleFactorWidth = currentSize.width / BASE_WIDTH;
  const scaleFactorHeight = currentSize.height / BASE_HEIGHT;
  // Use average of both factors so everything scales proportionally
  const scaleFactor = (scaleFactorWidth + scaleFactorHeight) / 2;

    const inputNumber = (num: string) => {
      if (waitingForNewValue) {
        setDisplay(num);
        setWaitingForNewValue(false);
      } else {
        setDisplay(display === '0' ? num : display + num);
      }
    };

    const inputDecimal = () => {
      if (waitingForNewValue) {
        setDisplay('0.');
        setWaitingForNewValue(false);
      } else if (display.indexOf('.') === -1) {
        setDisplay(display + '.');
      }
    };

    const clear = () => {
      setDisplay('0');
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(false);
    };

    const performOperation = (nextOperation: string) => {
      const inputValue = parseFloat(display);

      if (previousValue === null) {
        setPreviousValue(inputValue);
      } else if (operation) {
        const currentValue = previousValue || 0;
        let result = currentValue;

        switch (operation) {
          case '+':
            result = currentValue + inputValue;
            break;
          case '-':
            result = currentValue - inputValue;
            break;
          case '×':
            result = currentValue * inputValue;
            break;
          case '÷':
            result = inputValue !== 0 ? currentValue / inputValue : currentValue;
            break;
          case '^':
            result = Math.pow(currentValue, inputValue);
            break;
          case '=':
            result = inputValue;
            break;
          default:
            return;
        }



        setDisplay(String(result));
        setPreviousValue(result);
      }

      setWaitingForNewValue(true);
      setOperation(nextOperation);
    };

    const calculate = () => {
      performOperation('=');
      setOperation(null);
      setPreviousValue(null);
      setWaitingForNewValue(true);
    };

    const scientificFunction = (func: string) => {
      const value = parseFloat(display);
      let result: number;

      switch (func) {
        case '%':
          result = value / 100;
          break;
        default:
          return;
      }

      setDisplay(String(result));
      setWaitingForNewValue(true);
    };

    // Viewport constraint function
    const constrainToViewport = useCallback(() => {
      const margin = 24;
      const maxW = Math.min(currentSize.width, Math.max(MIN_WIDTH, window.innerWidth - margin));
      const maxH = Math.min(currentSize.height, Math.max(MIN_HEIGHT, window.innerHeight - margin));
      
      if (maxW !== currentSize.width || maxH !== currentSize.height) {
        setCurrentSize({ width: maxW, height: maxH });
      }
      
      // ensure position stays within viewport
      setPosition(prev => {
        const nx = Math.min(prev.x, Math.max(0, window.innerWidth - maxW));
        const ny = Math.min(prev.y, Math.max(0, window.innerHeight - maxH));
        positionRef.current = { x: nx, y: ny };
        return { x: nx, y: ny };
      });
    }, [currentSize.width, currentSize.height]);

    useEffect(() => {
      constrainToViewport();
      window.addEventListener('resize', constrainToViewport);
      return () => window.removeEventListener('resize', constrainToViewport);
    }, [constrainToViewport]);

    // Keep ref in sync
    useEffect(() => {
      positionRef.current = position;
    }, [position]);

    // Get coordinates from mouse or touch event
    const getEventCoords = (e: MouseEvent | TouchEvent) => {
      if ('touches' in e) {
        return { x: e.touches[0]?.clientX || 0, y: e.touches[0]?.clientY || 0 };
      }
      return { x: e.clientX, y: e.clientY };
    };

    // Document-level handlers for both mouse and touch
    const onDocMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current && !isResizingRef.current) return;
      e.preventDefault();
      
      const coords = getEventCoords(e);
      
      if (isDraggingRef.current && calculatorRef.current) {
        // Dragging - użyj bezpośredniej manipulacji DOM
        const newX = Math.max(0, Math.min(window.innerWidth - currentSize.width, coords.x - dragOffsetRef.current.x));
        const newY = Math.max(0, Math.min(window.innerHeight - currentSize.height, coords.y - dragOffsetRef.current.y));
        
        // Bezpośrednia manipulacja DOM - brak opóźnienia
        calculatorRef.current.style.left = `${newX}px`;
        calculatorRef.current.style.top = `${newY}px`;
        
        positionRef.current = { x: newX, y: newY };
      } else if (isResizingRef.current) {
        // Resizing
        const deltaX = coords.x - resizeStartRef.current.x;
        const deltaY = coords.y - resizeStartRef.current.y;
        
        const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, resizeStartRef.current.width + deltaX));
        const newHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, resizeStartRef.current.height + deltaY));
        
        setCurrentSize({ width: newWidth, height: newHeight });
      }
    };

    const onDocEnd = () => {
      // Zsynchronizuj stan po zakończeniu przeciągania
      if (isDraggingRef.current) {
        setPosition(positionRef.current);
      }
      
      isDraggingRef.current = false;
      isResizingRef.current = false;
      // Remove both mouse and touch listeners
      document.removeEventListener('mousemove', onDocMove);
      document.removeEventListener('mouseup', onDocEnd);
      document.removeEventListener('touchmove', onDocMove);
      document.removeEventListener('touchend', onDocEnd);
    };

    const handleResizeStart = (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      isResizingRef.current = true;
      
      const coords = 'touches' in e ? 
        { x: e.touches[0]?.clientX || 0, y: e.touches[0]?.clientY || 0 } :
        { x: e.clientX, y: e.clientY };
      
      resizeStartRef.current = {
        width: currentSize.width,
        height: currentSize.height,
        x: coords.x,
        y: coords.y,
      };
      
      // Add both mouse and touch listeners
      document.addEventListener('mousemove', onDocMove);
      document.addEventListener('mouseup', onDocEnd);
      document.addEventListener('touchmove', onDocMove, { passive: false });
      document.addEventListener('touchend', onDocEnd);
    };

    const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('drag-handle')) {
        isDraggingRef.current = true;
        
        const coords = 'touches' in e ? 
          { x: e.touches[0]?.clientX || 0, y: e.touches[0]?.clientY || 0 } :
          { x: e.clientX, y: e.clientY };
        
        dragOffsetRef.current = {
          x: coords.x - position.x,
          y: coords.y - position.y,
        };
        
        // Add both mouse and touch listeners
        document.addEventListener('mousemove', onDocMove);
        document.addEventListener('mouseup', onDocEnd);
        document.addEventListener('touchmove', onDocMove, { passive: false });
        document.addEventListener('touchend', onDocEnd);
      }
    };

    return (
      <div
        ref={calculatorRef}
        className="fixed bg-[#161b22] border border-[#30363d] rounded-lg shadow-2xl z-50 select-none"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${currentSize.width}px`,
          height: `${currentSize.height}px`,
        }}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        <div className="flex flex-col h-full">
          {/* Header - Draggable */}
          <div className="flex items-center justify-between p-3 bg-[#21262d] rounded-t-lg drag-handle cursor-move border-b border-[#30363d]">
            <div className="flex items-center gap-2 drag-handle">
              <Calculator className="w-4 h-4 text-[#58a6ff] pointer-events-none" />
              <h3 className="text-sm font-semibold text-white pointer-events-none">Kalkulator</h3>
            </div>
            <button
              onClick={() => setShowCalculator(false)}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-[#30363d] rounded transition-colors"
              title="Zamknij"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-col overflow-hidden" style={{ 
            height: `${currentSize.height - 60}px`, // subtract header height
            padding: `${Math.max(8, 12 * scaleFactor)}px`
          }}>

          {/* Display */}
          <div className="bg-[#0d1117] border border-[#30363d] rounded-lg flex-shrink-0" style={{ 
            padding: `${Math.max(8, 12 * scaleFactor)}px`, 
            marginBottom: `${Math.max(8, 12 * scaleFactor)}px`,
            minHeight: `${Math.max(40, 60 * scaleFactor)}px`,
            display: 'flex',
            alignItems: 'center'
          }}>
            <div className="text-right font-mono text-white break-all w-full" style={{ fontSize: `${Math.max(14, 20 * scaleFactor)}px` }}>
              {display}
            </div>
          </div>

          {/* Main calculator */}
          <div className="grid grid-cols-4 flex-1 min-h-0" style={{ 
            gap: `${Math.max(4, 6 * scaleFactor)}px`
          }}>
            {/* Row 1 */}
            <button
              onClick={clear}
              className="bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-lg font-semibold transition-colors col-span-2"
              style={{ 
                minHeight: `${Math.max(24, 40 * scaleFactor)}px`, 
                fontSize: `${Math.max(10, 14 * scaleFactor)}px`,
                padding: `${Math.max(4, 8 * scaleFactor)}px ${Math.max(6, 12 * scaleFactor)}px`
              }}
            >
              Clear
            </button>
            <button
              onClick={() => scientificFunction('%')}
              className="bg-[#6b7280] hover:bg-[#4b5563] text-white rounded-lg font-semibold transition-colors"
              style={{ 
                minHeight: `${Math.max(24, 40 * scaleFactor)}px`, 
                fontSize: `${Math.max(10, 14 * scaleFactor)}px`,
                padding: `${Math.max(4, 8 * scaleFactor)}px ${Math.max(6, 12 * scaleFactor)}px`
              }}
            >
              %
            </button>
            <button
              onClick={() => performOperation('÷')}
              className="bg-[#f59e0b] hover:bg-[#d97706] text-white rounded-lg font-semibold transition-colors"
              style={{ 
                minHeight: `${Math.max(24, 40 * scaleFactor)}px`, 
                fontSize: `${Math.max(10, 14 * scaleFactor)}px`,
                padding: `${Math.max(4, 8 * scaleFactor)}px ${Math.max(6, 12 * scaleFactor)}px`
              }}
            >
              ÷
            </button>

            {/* Row 2 */}
            <button onClick={() => inputNumber('7')} className="bg-[#374151] hover:bg-[#4b5563] text-white rounded-lg font-semibold transition-colors" style={{ minHeight: `${Math.max(24, 40 * scaleFactor)}px`, fontSize: `${Math.max(10, 14 * scaleFactor)}px`, padding: `${Math.max(4, 8 * scaleFactor)}px ${Math.max(6, 12 * scaleFactor)}px` }}>7</button>
            <button onClick={() => inputNumber('8')} className="bg-[#374151] hover:bg-[#4b5563] text-white rounded-lg font-semibold transition-colors" style={{ minHeight: `${Math.max(24, 40 * scaleFactor)}px`, fontSize: `${Math.max(10, 14 * scaleFactor)}px`, padding: `${Math.max(4, 8 * scaleFactor)}px ${Math.max(6, 12 * scaleFactor)}px` }}>8</button>
            <button onClick={() => inputNumber('9')} className="bg-[#374151] hover:bg-[#4b5563] text-white rounded-lg font-semibold transition-colors" style={{ minHeight: `${Math.max(24, 40 * scaleFactor)}px`, fontSize: `${Math.max(10, 14 * scaleFactor)}px`, padding: `${Math.max(4, 8 * scaleFactor)}px ${Math.max(6, 12 * scaleFactor)}px` }}>9</button>
            <button
              onClick={() => performOperation('×')}
              className="bg-[#f59e0b] hover:bg-[#d97706] text-white rounded-lg font-semibold transition-colors"
              style={{ 
                minHeight: `${Math.max(24, 40 * scaleFactor)}px`, 
                fontSize: `${Math.max(10, 14 * scaleFactor)}px`,
                padding: `${Math.max(4, 8 * scaleFactor)}px ${Math.max(6, 12 * scaleFactor)}px`
              }}
            >
              ×
            </button>

            {/* Row 3 */}
            <button onClick={() => inputNumber('4')} className="bg-[#374151] hover:bg-[#4b5563] text-white rounded-lg font-semibold transition-colors" style={{ minHeight: `${Math.max(24, 40 * scaleFactor)}px`, fontSize: `${Math.max(10, 14 * scaleFactor)}px`, padding: `${Math.max(4, 8 * scaleFactor)}px ${Math.max(6, 12 * scaleFactor)}px` }}>4</button>
            <button onClick={() => inputNumber('5')} className="bg-[#374151] hover:bg-[#4b5563] text-white rounded-lg font-semibold transition-colors" style={{ minHeight: `${Math.max(24, 40 * scaleFactor)}px`, fontSize: `${Math.max(10, 14 * scaleFactor)}px`, padding: `${Math.max(4, 8 * scaleFactor)}px ${Math.max(6, 12 * scaleFactor)}px` }}>5</button>
            <button onClick={() => inputNumber('6')} className="bg-[#374151] hover:bg-[#4b5563] text-white rounded-lg font-semibold transition-colors" style={{ minHeight: `${Math.max(24, 40 * scaleFactor)}px`, fontSize: `${Math.max(10, 14 * scaleFactor)}px`, padding: `${Math.max(4, 8 * scaleFactor)}px ${Math.max(6, 12 * scaleFactor)}px` }}>6</button>
            <button
              onClick={() => performOperation('-')}
              className="bg-[#f59e0b] hover:bg-[#d97706] text-white rounded-lg font-semibold transition-colors"
              style={{ 
                minHeight: `${Math.max(24, 40 * scaleFactor)}px`, 
                fontSize: `${Math.max(10, 14 * scaleFactor)}px`,
                padding: `${Math.max(4, 8 * scaleFactor)}px ${Math.max(6, 12 * scaleFactor)}px`
              }}
            >
              −
            </button>

            {/* Row 4 */}
            <button onClick={() => inputNumber('1')} className="bg-[#374151] hover:bg-[#4b5563] text-white rounded-lg font-semibold transition-colors" style={{ minHeight: `${Math.max(24, 40 * scaleFactor)}px`, fontSize: `${Math.max(10, 14 * scaleFactor)}px`, padding: `${Math.max(4, 8 * scaleFactor)}px ${Math.max(6, 12 * scaleFactor)}px` }}>1</button>
            <button onClick={() => inputNumber('2')} className="bg-[#374151] hover:bg-[#4b5563] text-white rounded-lg font-semibold transition-colors" style={{ minHeight: `${Math.max(24, 40 * scaleFactor)}px`, fontSize: `${Math.max(10, 14 * scaleFactor)}px`, padding: `${Math.max(4, 8 * scaleFactor)}px ${Math.max(6, 12 * scaleFactor)}px` }}>2</button>
            <button onClick={() => inputNumber('3')} className="bg-[#374151] hover:bg-[#4b5563] text-white rounded-lg font-semibold transition-colors" style={{ minHeight: `${Math.max(24, 40 * scaleFactor)}px`, fontSize: `${Math.max(10, 14 * scaleFactor)}px`, padding: `${Math.max(4, 8 * scaleFactor)}px ${Math.max(6, 12 * scaleFactor)}px` }}>3</button>
            <button
              onClick={() => performOperation('+')}
              className="bg-[#f59e0b] hover:bg-[#d97706] text-white rounded-lg font-semibold transition-colors"
              style={{ 
                minHeight: `${Math.max(24, 40 * scaleFactor)}px`, 
                fontSize: `${Math.max(10, 14 * scaleFactor)}px`,
                padding: `${Math.max(4, 8 * scaleFactor)}px ${Math.max(6, 12 * scaleFactor)}px`
              }}
            >
              +
            </button>

            {/* Row 5 */}
            <button onClick={() => inputNumber('0')} className="bg-[#374151] hover:bg-[#4b5563] text-white rounded-lg font-semibold transition-colors col-span-2" style={{ minHeight: `${Math.max(24, 40 * scaleFactor)}px`, fontSize: `${Math.max(10, 14 * scaleFactor)}px`, padding: `${Math.max(4, 8 * scaleFactor)}px ${Math.max(6, 12 * scaleFactor)}px` }}>0</button>
            <button onClick={inputDecimal} className="bg-[#374151] hover:bg-[#4b5563] text-white rounded-lg font-semibold transition-colors" style={{ minHeight: `${Math.max(24, 40 * scaleFactor)}px`, fontSize: `${Math.max(10, 14 * scaleFactor)}px`, padding: `${Math.max(4, 8 * scaleFactor)}px ${Math.max(6, 12 * scaleFactor)}px` }}>.</button>
            <button
              onClick={calculate}
              className="bg-[#059669] hover:bg-[#047857] text-white rounded-lg font-semibold transition-colors"
              style={{ 
                minHeight: `${Math.max(24, 40 * scaleFactor)}px`, 
                fontSize: `${Math.max(10, 14 * scaleFactor)}px`,
                padding: `${Math.max(4, 8 * scaleFactor)}px ${Math.max(6, 12 * scaleFactor)}px`
              }}
            >
              =
            </button>
          </div>

          </div>

        {/* Resize handle - bottom right corner */}
        <div 
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-[#30363d] hover:bg-[#58a6ff] transition-colors opacity-50 hover:opacity-100"
          onMouseDown={handleResizeStart}
          onTouchStart={handleResizeStart}
          style={{
            clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
            borderBottomRightRadius: '8px'
          }}
        />

        </div>
      </div>
    );
  };

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

      {/* Split Layout: Left = Exam, Right = Whiteboard */}
      <div className="flex h-screen relative overflow-hidden">
      {/* Expand Left Panel Button (when collapsed) */}
      {splitSize === 0 && (
        <button
          onClick={() => setSplitSize(50)}
          className="fixed left-0 top-1/2 -translate-y-1/2 bg-[#58a6ff] hover:bg-[#4493f8] text-white p-2 rounded-r-lg shadow-lg z-50 transition-all"
          title="Rozwiń panel egzaminu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Expand Right Panel Button (when collapsed) */}
      {splitSize === 100 && (
        <button
          onClick={() => setSplitSize(50)}
          className="fixed right-0 top-1/2 -translate-y-1/2 bg-[#58a6ff] hover:bg-[#4493f8] text-white p-2 rounded-l-lg shadow-lg z-50 transition-all"
          title="Rozwiń whiteboard"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}


        {/* LEFT SIDE - Exam Content (resizable) */}
        {splitSize > 0 && (
        <main 
          className="overflow-y-auto overflow-x-hidden border-r border-[#30363d] flex flex-col"
          style={{ width: `${splitSize}%` }}
        >
          {/* Header - Only over exam side - SIMPLIFIED */}
          <header className="sticky top-0 z-20 border-b border-[#30363d] bg-[#161b22] shadow-lg">
            <div className="px-3 py-2">
              <div className="flex items-center justify-between gap-3">
                {/* Powrót */}
                <Link 
                  href={basePath}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] hover:border-[#58a6ff] rounded-lg text-[#58a6ff] hover:text-white transition-all duration-200 font-medium text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Powrót</span>
                </Link>

                {/* Kompaktowe statystyki */}
                <div className="flex items-center gap-2 text-xs font-medium">
                  {/* Timer controls */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setTimerActive(!timerActive)}
                      className={`p-1 rounded transition-all ${
                        timerActive 
                          ? 'bg-yellow-900/50 text-yellow-300 hover:bg-yellow-900/70' 
                          : 'bg-green-900/50 text-green-300 hover:bg-green-900/70'
                      }`}
                      title={timerActive ? 'Zatrzymaj timer' : 'Uruchom timer'}
                    >
                      {timerActive ? (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setTimeElapsed(0);
                        setTimerActive(false);
                      }}
                      className="p-1 rounded bg-red-900/50 text-red-300 hover:bg-red-900/70 transition-all"
                      title="Zresetuj timer"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="text-gray-400">|</span>

                  {/* Timer */}
                  <div className="flex items-center gap-1">
                    <Clock className={`w-3 h-3 ${timerActive ? 'text-yellow-300' : isExamCompleted ? 'text-green-400' : 'text-[#58a6ff]'}`} />
                    <span className={`${timerActive ? 'text-yellow-300' : isExamCompleted ? 'text-green-400' : 'text-gray-300'}`}>
                      {formatTime(timeElapsed)}
                      <span className="hidden sm:inline">/{examData.duration}min</span>
                    </span>
                  </div>

                  <span className="text-gray-400 hidden sm:inline">|</span>

                  {/* Zadania */}
                  <div className="hidden sm:flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-[#58a6ff]" />
                    <span className="text-gray-300">
                      {checkedCount}/{totalProblems}
                    </span>
                  </div>

                  <span className="text-gray-400 hidden sm:inline">|</span>

                  {/* Punkty */}
                  <div className="flex items-center gap-1">
                    <Award className="w-3 h-3 text-[#58a6ff]" />
                    <span className="font-bold text-[#58a6ff]">
                      {totalScore}/{examData.maxPoints}
                    </span>
                  </div>

                  {/* Reset */}
                  {(answeredCount > 0 || checkedCount > 0) && (
                    <>
                      <span className="text-gray-400">|</span>
                      <button
                        onClick={resetAllProblems}
                        className="p-1 text-gray-400 hover:text-red-300 hover:bg-red-900/30 rounded transition-colors"
                        title="Zacznij od nowa"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </header>

          <div className="container mx-auto px-4 py-8 flex-1">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#1f6feb] to-[#58a6ff] rounded-full mb-6">
                  <Calculator className="w-10 h-10 text-white" />
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#58a6ff] via-[#1f6feb] to-[#0969da] bg-clip-text text-transparent">
                  {getExtendedTitle()}
                </h1>
                
                {/* Przyciski pobierania - pod tytułem */}
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  {examData.examPdfUrl && (
                    <button
                      onClick={() => window.open(examData.examPdfUrl, '_blank')}
                      className="inline-flex items-center gap-2 bg-[#238636] hover:bg-[#2ea043] border border-[#238636] px-4 py-2 rounded-lg transition-colors font-medium text-sm"
                      title="Pobierz oryginalny arkusz egzaminacyjny"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Pobierz arkusz</span>
                    </button>
                  )}
                  
                  {examData.answerKeyUrl && (
                    <button
                      onClick={() => window.open(examData.answerKeyUrl, '_blank')}
                      className="inline-flex items-center gap-2 bg-[#8b5cf6] hover:bg-[#7c3aed] border border-[#8b5cf6] px-4 py-2 rounded-lg transition-colors font-medium text-sm"
                      title="Pobierz klucz odpowiedzi"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Klucz odpowiedzi</span>
                    </button>
                  )}
                </div>
                
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

              {/* Powiadomienie o automatycznym uruchomieniu timera */}
              {showTimerNotification && (
                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-l-4 border-yellow-400 rounded-lg p-4 mb-6 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <Clock className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-yellow-400 font-semibold text-lg">Timer został uruchomiony!</h3>
                      <p className="text-yellow-200 text-sm">
                        Egzamin rozpoczął się automatycznie. Timer zatrzyma się po ukończeniu wszystkich zadań.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowTimerNotification(false)}
                      className="flex-shrink-0 p-1 text-yellow-400 hover:text-yellow-200 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

          <div className="space-y-8">
            {examData.problems.map((problem, index) => {
              const userAnswer = userAnswers[problem.id] || [];
              const isChecked = checkedAnswers[problem.id];
              const isCorrect = isAnswerCorrect(problem.id, problem.answer);
              const isMultiChoice = problem.options && hasMultipleAnswers(problem.answer);
              
              return (
                <div 
                  key={problem.id}
                  ref={el => { problemRefs.current[problem.id] = el; }}
                  data-problem-id={problem.id}
                  className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl font-bold text-[#58a6ff]">
                        {problem.id}.
                      </span>
                      <div>
                        <span className="text-sm text-gray-400 block mb-1">
                          {problem.category || 'Ogólna'}
                        </span>
                        <span className="text-sm text-gray-400">
                          {problem.points || 1} {(problem.points || 1) === 1 ? 'punkt' : (problem.points || 1) < 5 ? 'punkty' : 'punktów'}
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
                    {problem.question && (
                      <p className="text-lg text-white mb-4">
                        {renderOption(problem.question)}
                      </p>
                    )}
                    
                    {problem.formula && (
                      <div className="bg-[#21262d] border border-[#30363d] rounded-lg p-4 mb-4 overflow-x-auto">
                        <MathText>{`$$${problem.formula}$$`}</MathText>
                      </div>
                    )}

                    {(() => {
                      // Handle multiple images
                      if (problem.images && problem.images.length > 0) {
                        return (
                          <div className="space-y-4 mb-4">
                            {problem.images.map((imageSrc, index) => (
                              <div key={index} className="bg-[#21262d] border border-[#30363d] rounded-lg p-4">
                                <img 
                                  src={imageSrc || getImagePath(problem.id, 'problem', index)}
                                  alt={`Ilustracja do zadania ${problem.id} - część ${String.fromCharCode(97 + index)}`}
                                  className="max-w-full h-auto mx-auto rounded-lg"
                                  loading="lazy"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        );
                      }

                      // Handle single image
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

                    {/* 🔥 KORKUŚ Help Button */}
                    <button
                      onClick={() => askKorkus(problem)}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-[#ff6b6b] to-[#ff8e53] hover:from-[#ff5252] hover:to-[#ff7a3d] text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
                      title="Otwórz KORKUŚ z kontekstem tego zadania"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Pytaj KORKUŚ
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
                                  {scannedSolutionImages.map((solutionIndex: number, arrayIndex: number) => (
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
          </div>
        </main>

                )}

        {/* RESIZER - Draggable Divider */}
        {splitSize > 0 && splitSize < 100 && (
        <div
          onMouseDown={handleMouseDown}
          className={`w-1 bg-[#30363d] hover:bg-[#58a6ff] cursor-col-resize transition-colors relative group ${isDragging ? 'bg-[#58a6ff]' : ''}`}
          style={{ cursor: 'col-resize' }}
        >
          {/* Visual indicator */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-12 bg-[#58a6ff] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

                )}

        {/* RIGHT SIDE - Whiteboard Canvas (wypełnia resztę przestrzeni) */}
        <aside 
          className="flex-1 bg-[#161b22] relative overflow-hidden"
          style={{ display: splitSize >= 100 ? 'none' : 'flex' }}
        >
          <WhiteboardCanvas  className="w-full h-full" />
        </aside>
      </div>

      {/* Confetti Modal */}
      <ConfettiModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        totalScore={totalScore}
        maxPoints={examData.maxPoints}
        timeElapsed={timeElapsed}
        examTitle={examData.title}
        duration={examData.duration}
      />
    </div>
  );
}