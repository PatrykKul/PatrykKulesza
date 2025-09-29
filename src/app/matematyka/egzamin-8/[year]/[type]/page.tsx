'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, Clock, Award, FileText, Download } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

// Interfejsy
interface MathProblem {
  id: string;
  question: string;
  formula?: string;
  options?: string[];
  answer: string;
  solution?: string[];
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

interface ExamData {
  title: string;
  date: string;
  duration: number; // w minutach
  maxPoints: number;
  problems: MathProblem[];
  pdfUrl?: string;
  answerKeyUrl?: string;
}

// Dane egzaminów - TUTAJ DODAWAĆ NOWE LATA
const examData: Record<string, Record<string, ExamData>> = {
  '2023': {
    'glowny': {
      title: 'Egzamin Ósmoklasisty - Matematyka',
      date: '24 maja 2023',
      duration: 100,
      maxPoints: 20,
      pdfUrl: '/pdfs/egzamin-8-2023-glowny.pdf',
      answerKeyUrl: '/pdfs/egzamin-8-2023-glowny-odpowiedzi.pdf',
      problems: [
        {
          id: '1',
          question: 'Oblicz wartość wyrażenia:',
          formula: '3 \\cdot 2^2 - 4 \\cdot 3 + 5',
          options: ['A) 5', 'B) 7', 'C) 9', 'D) 11'],
          answer: 'A) 5',
          solution: [
            'Obliczamy potęgę: 2^2 = 4',
            'Mnożenie: 3 \\cdot 4 = 12 \\text{ i } 4 \\cdot 3 = 12',
            'Podstawiamy: 12 - 12 + 5 = 5'
          ],
          points: 1,
          difficulty: 'easy',
          category: 'Działania na liczbach'
        },
        {
          id: '2',
          question: 'Rozwiąż równanie:',
          formula: '2x + 5 = 13',
          options: ['A) x = 3', 'B) x = 4', 'C) x = 5', 'D) x = 6'],
          answer: 'B) x = 4',
          solution: [
            'Przenosimy 5 na prawą stronę: 2x = 13 - 5',
            'Obliczamy: 2x = 8',
            'Dzielimy przez 2: x = 4'
          ],
          points: 1,
          difficulty: 'easy',
          category: 'Równania liniowe'
        },
        {
          id: '3',
          question: 'Oblicz pole prostokąta o bokach:',
          formula: 'a = 3\\sqrt{2}\\text{ cm}, \\quad b = 2\\sqrt{8}\\text{ cm}',
          options: ['A) 12 cm²', 'B) 24 cm²', 'C) 6√16 cm²', 'D) 12√2 cm²'],
          answer: 'B) 24 cm²',
          solution: [
            'Upraszczas drugi bok: b = 2\\sqrt{8} = 2\\sqrt{4 \\cdot 2} = 2 \\cdot 2\\sqrt{2} = 4\\sqrt{2}',
            'Pole: P = a \\cdot b = 3\\sqrt{2} \\cdot 4\\sqrt{2}',
            'Obliczamy: P = 12 \\cdot (\\sqrt{2})^2 = 12 \\cdot 2 = 24 \\text{ cm²}'
          ],
          points: 2,
          difficulty: 'medium',
          category: 'Geometria'
        }
      ]
    },
    'probny': {
      title: 'Egzamin Próbny Ósmoklasisty - Matematyka',
      date: 'Marzec 2023',
      duration: 100,
      maxPoints: 20,
      problems: [
        {
          id: '1',
          question: 'Oblicz wartość wyrażenia dla x = 2:',
          formula: 'x^2 + 3x - 1',
          options: ['A) 7', 'B) 8', 'C) 9', 'D) 10'],
          answer: 'C) 9',
          solution: [
            'Podstawiamy x = 2: (2)^2 + 3 \\cdot 2 - 1',
            'Obliczamy: 4 + 6 - 1 = 9'
          ],
          points: 1,
          difficulty: 'easy',
          category: 'Wyrażenia algebraiczne'
        }
      ]
    }
  },
  '2022': {
    'glowny': {
      title: 'Egzamin Ósmoklasisty - Matematyka',
      date: '25 maja 2022',
      duration: 100,
      maxPoints: 20,
      problems: [
        {
          id: '1',
          question: 'Które z podanych liczb jest największe?',
          formula: 'A) \\frac{3}{4}, \\quad B) 0.7, \\quad C) 75\\%, \\quad D) \\frac{7}{10}',
          answer: 'C) 75%',
          solution: [
            'Zamieniamy wszystkie na ułamki dziesiętne:',
            '\\frac{3}{4} = 0.75',
            '0.7 = 0.7', 
            '75\\% = 0.75',
            '\\frac{7}{10} = 0.7',
            'Największe: \\frac{3}{4} \\text{ i } 75\\% \\text{ (oba równe 0.75)}'
          ],
          points: 1,
          difficulty: 'easy',
          category: 'Ułamki i procenty'
        }
      ]
    },
    'probny': {
      title: 'Egzamin Próbny Ósmoklasisty - Matematyka',
      date: 'Marzec 2022',
      duration: 100,
      maxPoints: 20,
      problems: [
        {
          id: '1',
          question: 'Oblicz 20% z liczby 150:',
          answer: '30',
          solution: [
            '20\\% \\text{ z } 150 = \\frac{20}{100} \\cdot 150',
            '= 0.2 \\cdot 150 = 30'
          ],
          points: 1,
          difficulty: 'easy',
          category: 'Procenty'
        }
      ]
    }
  },
  '2024': {
    'glowny': {
      title: 'Egzamin Ósmoklasisty - Matematyka',
      date: '21 maja 2024',
      duration: 100,
      maxPoints: 20,
      problems: [
        {
          id: '1',
          question: 'Oblicz wartość wyrażenia:',
          formula: '5^2 - 3 \\cdot 4 + 7',
          options: ['A) 20', 'B) 21', 'C) 22', 'D) 23'],
          answer: 'A) 20',
          solution: [
            'Obliczamy potęgę: 5^2 = 25',
            'Mnożenie: 3 \\cdot 4 = 12',
            'Podstawiamy: 25 - 12 + 7 = 20'
          ],
          points: 1,
          difficulty: 'easy',
          category: 'Działania na liczbach'
        }
      ]
    },
    'probny': {
      title: 'Egzamin Próbny Ósmoklasisty - Matematyka',
      date: 'Marzec 2024',
      duration: 100,
      maxPoints: 20,
      problems: [
        {
          id: '1',
          question: 'Rozwiąż równanie:',
          formula: '3x - 7 = 14',
          options: ['A) x = 7', 'B) x = 6', 'C) x = 8', 'D) x = 5'],
          answer: 'A) x = 7',
          solution: [
            'Przenosimy -7 na prawą stronę: 3x = 14 + 7',
            'Obliczamy: 3x = 21',
            'Dzielimy przez 3: x = 7'
          ],
          points: 1,
          difficulty: 'easy',
          category: 'Równania liniowe'
        }
      ]
    }
  },
  '2025': {
    'glowny': {
      title: 'Egzamin Ósmoklasisty - Matematyka',
      date: '20 maja 2025',
      duration: 100,
      maxPoints: 20,
      problems: [
        {
          id: '1',
          question: 'Zadanie będzie dostępne po egzaminie w maju 2025.',
          answer: 'Wkrótce dostępne',
          solution: [],
          points: 1,
          difficulty: 'easy',
          category: 'Informacja'
        }
      ]
    },
    'probny': {
      title: 'Egzamin Próbny Ósmoklasisty - Matematyka',
      date: 'Marzec 2025',
      duration: 100,
      maxPoints: 20,
      problems: [
        {
          id: '1',
          question: 'Zadanie próbne będzie dostępne w marcu 2025.',
          answer: 'Wkrótce dostępne',
          solution: [],
          points: 1,
          difficulty: 'easy',
          category: 'Informacja'
        }
      ]
    }
  }
};

// Główny komponent
export default function EgzaminPage({ 
  params 
}: { 
  params: Promise<{ year: string; type: string }> 
}) {
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);
  const [showSolutions, setShowSolutions] = useState(false);

  // Unwrap params using React.use()
  const { year, type } = use(params);
  const examInfo = examData[year]?.[type];

  if (!examInfo) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-400">Egzamin nie znaleziony</h1>
          <p className="text-gray-400 mb-6">
            Egzamin z roku {year} ({type}) nie istnieje.
          </p>
          <Link
            href="/matematyka"
            className="text-[#58a6ff] hover:text-[#1f6feb] transition-colors"
          >
            ← Powrót do materiałów
          </Link>
        </div>
      </div>
    );
  }

  const difficultyColors = {
    easy: 'bg-green-600',
    medium: 'bg-yellow-600', 
    hard: 'bg-red-600'
  };

  const difficultyLabels = {
    easy: 'Łatwe',
    medium: 'Średnie',
    hard: 'Trudne'
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      {/* Header */}
      <header className="border-b border-[#30363d] bg-[#161b22]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/matematyka"
              className="inline-flex items-center gap-2 text-[#58a6ff] hover:text-[#1f6feb] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Powrót do materiałów
            </Link>
            
            <div className="flex gap-4">
              {examInfo.pdfUrl && (
                <a
                  href={examInfo.pdfUrl}
                  className="inline-flex items-center gap-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] px-4 py-2 rounded-lg transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="w-4 h-4" />
                  Pobierz PDF
                </a>
              )}
              
              {examInfo.answerKeyUrl && (
                <a
                  href={examInfo.answerKeyUrl}
                  className="inline-flex items-center gap-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] px-4 py-2 rounded-lg transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileText className="w-4 h-4" />
                  Klucz odpowiedzi
                </a>
              )}
            </div>
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
              {examInfo.title}
            </h1>
            
            <div className="flex flex-wrap justify-center gap-6 text-gray-300 mb-6">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#58a6ff]" />
                <span>Czas: {examInfo.duration} minut</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#58a6ff]" />
                <span>Punkty: {examInfo.maxPoints}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#58a6ff]" />
                <span>Data: {examInfo.date}</span>
              </div>
            </div>

            <button
              onClick={() => setShowSolutions(!showSolutions)}
              className="bg-[#58a6ff] hover:bg-[#4493f8] text-black px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              {showSolutions ? 'Ukryj rozwiązania' : 'Pokaż rozwiązania'}
            </button>
          </div>

          {/* Zadania */}
          <div className="space-y-8">
            {examInfo.problems.map((problem, index) => (
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
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${difficultyColors[problem.difficulty]}`}>
                          {difficultyLabels[problem.difficulty]}
                        </span>
                        <span className="text-sm text-gray-400">
                          {problem.points} {problem.points === 1 ? 'punkt' : 'punkty'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Treść zadania */}
                <div className="mb-6">
                  <p className="text-lg text-white mb-4">
                    {problem.question}
                  </p>
                  
                  {problem.formula && (
                    <div className="bg-[#21262d] border border-[#30363d] rounded-lg p-4 mb-4">
                      <BlockMath 
                        math={problem.formula}
                        renderError={(error) => (
                          <span className="text-red-400">Błąd renderowania formuły: {problem.formula}</span>
                        )}
                      />
                    </div>
                  )}

                  {problem.options && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                      {problem.options.map((option, optIndex) => (
                        <div 
                          key={optIndex}
                          className="bg-[#21262d] border border-[#30363d] rounded-lg p-3 text-white"
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Odpowiedź */}
                {showSolutions && (
                  <div className="border-t border-[#30363d] pt-6">
                    <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4 mb-4">
                      <h4 className="text-green-400 font-semibold mb-2">Odpowiedź:</h4>
                      <p className="text-white">{problem.answer}</p>
                    </div>

                    {problem.solution && problem.solution.length > 0 && (
                      <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
                        <h4 className="text-blue-400 font-semibold mb-3">Rozwiązanie:</h4>
                        <ol className="space-y-2">
                          {problem.solution.map((step, stepIndex) => (
                            <li key={stepIndex} className="text-white">
                              <span className="text-blue-400 mr-2">{stepIndex + 1}.</span>
                              <InlineMath 
                                math={step}
                                renderError={(error) => (
                                  <span className="text-red-400">{step}</span>
                                )}
                              />
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

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