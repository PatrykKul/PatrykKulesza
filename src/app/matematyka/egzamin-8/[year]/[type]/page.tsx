'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, Clock, Award, FileText, Download, Eye, EyeOff, CheckCircle, RotateCcw } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

// Import danych egzaminów
import { examData } from './examData';

export default function EgzaminPage({ 
  params 
}: { 
  params: Promise<{ year: string; type: string }> 
}) {
  const [visibleSolutions, setVisibleSolutions] = useState<Record<string, boolean>>({});
  const [userAnswers, setUserAnswers] = useState<Record<string, string[]>>({});
  const [checkedAnswers, setCheckedAnswers] = useState<Record<string, boolean>>({});

  const { year, type } = React.use(params);
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

  const toggleSolution = (problemId: string) => {
    setVisibleSolutions(prev => ({
      ...prev,
      [problemId]: !prev[problemId]
    }));
  };

  // Sprawdź czy zadanie ma wiele poprawnych odpowiedzi (AD, PP, itp.)
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

  // Funkcja resetowania całego egzaminu
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
    
    const problem = examInfo.problems.find(p => p.id === problemId);
    
    // Self-assessment dla zadań otwartych
    if (userAnswer[0] === 'SELF_YES') {
      return true;
    }
    if (userAnswer[0] === 'SELF_NO') {
      return false;
    }
    
    // Dla zadań P/F sprawdzamy format "0:P", "1:F"
    if (problem?.options && isTrueFalseQuestion(problem.options)) {
      const userPF = userAnswer
        .sort((a, b) => parseInt(a.split(':')[0]) - parseInt(b.split(':')[0]))
        .map(a => a.split(':')[1])
        .join('');
      return userPF === correctAnswer;
    }
    
    // Dla odpowiedzi typu "AD" lub "PP"
    if (hasMultipleAnswers(correctAnswer)) {
      const correctLetters = correctAnswer.split('');
      const userLetters = userAnswer.map(opt => opt.charAt(0)).sort();
      return correctLetters.sort().join('') === userLetters.join('');
    }
    
    // Dla pojedynczych odpowiedzi
    const normalizedUser = userAnswer[0].trim().toLowerCase();
    const normalizedCorrect = correctAnswer.trim().toLowerCase();
    
    return normalizedUser === normalizedCorrect;
  };

  // Sprawdź czy to zadanie P/F
  const isTrueFalseQuestion = (options: string[]) => {
    return options.some(opt => opt.includes('P/F') || opt.includes('- P F'));
  };

  // Wyciągnij statement z opcji P/F
  const extractStatement = (option: string) => {
    return option.replace(/\s*-?\s*P\s*\/?\s*F\s*$/i, '').trim();
  };

  const renderOption = (option: string) => {
    // Lepszy regex dla LaTeX - obsługuje potęgi, ułamki, pierwiastki itp.
    const latexPattern = /(\d+\s*\^\s*\{\d+\}|\d+\^\d+|\\frac\{[^}]*\}\{[^}]*\}|\\sqrt\{[^}]*\}|\\text\{[^}]*\}|\\cdot|\\quad|P_[a-z]|[A-Z]\))/g;
    
    const parts = option.split(latexPattern);
    
    return (
      <span className="inline-flex items-center gap-1 flex-wrap">
        {parts.map((part, idx) => {
          if (!part) return null;
          
          // Wykryj potęgi typu 27^{11} lub 3^5
          if (/\d+\s*\^\s*\{?\d+\}?/.test(part)) {
            const cleaned = part.replace(/\s/g, '');
            return (
              <span key={idx} className="inline-block">
                <InlineMath math={cleaned} />
              </span>
            );
          }
          
          // Inne LaTeX
          if (part.includes('\\') || /P_[a-z]/.test(part)) {
            return (
              <span key={idx} className="inline-block">
                <InlineMath math={part} />
              </span>
            );
          }
          
          return <span key={idx}>{part}</span>;
        })}
      </span>
    );
  };

  // Obliczanie punktów
  const totalScore = useMemo(() => {
    let earned = 0;
    examInfo.problems.forEach(problem => {
      if (isAnswerCorrect(problem.id, problem.answer) === true) {
        earned += problem.points;
      }
    });
    return earned;
  }, [userAnswers, checkedAnswers, examInfo.problems]);

  const answeredCount = Object.keys(userAnswers).filter(key => userAnswers[key].length > 0).length;
  const checkedCount = Object.keys(checkedAnswers).filter(key => checkedAnswers[key]).length;
  const totalProblems = examInfo.problems.length;

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      {/* Header - sticky */}
      <header className="sticky top-0 z-20 border-b border-[#30363d] bg-[#161b22] shadow-lg">
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
          </div>

          {/* Licznik postępu - sticky */}
          <div className="sticky top-20 z-10 mb-8 flex justify-center">
            <div className="bg-[#161b22] border-2 border-[#30363d] rounded-xl px-6 py-4 shadow-2xl backdrop-blur-sm bg-opacity-95">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">
                    Sprawdzone: {checkedCount} / {totalProblems}
                  </div>
                  <div className="text-2xl font-bold text-[#58a6ff]">
                    Twój wynik: {totalScore} / {examInfo.maxPoints} pkt
                  </div>
                </div>
                
                {/* Przycisk reset - pokazuje się tylko gdy coś już zaznaczono */}
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
            {examInfo.problems.map((problem, index) => {
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

                    {/* Wskaźnik poprawności */}
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
                      {problem.question}
                    </p>
                    
                    {problem.formula && (
                      <div className="bg-[#21262d] border border-[#30363d] rounded-lg p-4 mb-4">
                        <BlockMath 
                          math={problem.formula}
                          renderError={(error) => (
                            <span className="text-red-400">Błąd renderowania formuły</span>
                          )}
                        />
                      </div>
                    )}

                    {/* Wskazówka dla wielokrotnego wyboru */}
                    {isMultiChoice && !isChecked && (
                      <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-3 mb-4">
                        <p className="text-blue-400 text-sm">
                          💡 To zadanie ma więcej niż jedną poprawną odpowiedź. Zaznacz wszystkie.
                        </p>
                      </div>
                    )}

                    {/* Self-assessment dla zadań otwartych (bez opcji) */}
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

                    {/* Opcje odpowiedzi */}
                    {problem.options && (
                      <>
                        {isTrueFalseQuestion(problem.options) ? (
                          // Format P/F - każde pytanie z przyciskami P i F
                          <div className="space-y-4 mt-4">
                            {problem.options.map((option, optIndex) => {
                              const statement = extractStatement(option);
                              const questionKey = `${problem.id}-${optIndex}`;
                              const selectedValue = userAnswer.find(a => a.startsWith(`${optIndex}:`))?.split(':')[1];
                              
                              return (
                                <div key={optIndex} className="bg-[#21262d] border border-[#30363d] rounded-lg p-4">
                                  <p className="text-white mb-3">{renderOption(statement)}</p>
                                  <div className="flex gap-3">
                                    <button
                                      onClick={() => {
                                        const newAnswer = userAnswer.filter(a => !a.startsWith(`${optIndex}:`));
                                        selectSingleAnswer(problem.id, '');
                                        setUserAnswers(prev => ({
                                          ...prev,
                                          [problem.id]: [...newAnswer, `${optIndex}:P`]
                                        }));
                                      }}
                                      disabled={isChecked}
                                      className={`px-6 py-2 rounded-lg font-semibold transition-all disabled:cursor-not-allowed ${
                                        selectedValue === 'P'
                                          ? 'bg-[#58a6ff] text-black ring-2 ring-[#58a6ff]'
                                          : 'bg-[#30363d] text-white hover:bg-[#40464d]'
                                      }`}
                                    >
                                      Prawda (P)
                                    </button>
                                    <button
                                      onClick={() => {
                                        const newAnswer = userAnswer.filter(a => !a.startsWith(`${optIndex}:`));
                                        selectSingleAnswer(problem.id, '');
                                        setUserAnswers(prev => ({
                                          ...prev,
                                          [problem.id]: [...newAnswer, `${optIndex}:F`]
                                        }));
                                      }}
                                      disabled={isChecked}
                                      className={`px-6 py-2 rounded-lg font-semibold transition-all disabled:cursor-not-allowed ${
                                        selectedValue === 'F'
                                          ? 'bg-[#58a6ff] text-black ring-2 ring-[#58a6ff]'
                                          : 'bg-[#30363d] text-white hover:bg-[#40464d]'
                                      }`}
                                    >
                                      Fałsz (F)
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          // Format normalny - checkboxy lub radio buttons
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
                    {/* Przycisk sprawdź odpowiedź - tylko dla zadań z opcjami */}
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

                    {/* Przycisk spróbuj ponownie */}
                    {isChecked && isCorrect === false && (
                      <button
                        onClick={() => resetProblem(problem.id)}
                        className="inline-flex items-center gap-2 bg-[#f85149] hover:bg-[#da3633] text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Spróbuj ponownie
                      </button>
                    )}

                    {/* Przycisk pokaż/ukryj rozwiązanie */}
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

                  {/* Odpowiedź i rozwiązanie */}
                  {visibleSolutions[problem.id] && (
                    <div className="border-t border-[#30363d] pt-6 mt-6">
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
                                    <span>{step}</span>
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
                {totalScore} / {examInfo.maxPoints}
              </div>
              <p className="text-xl text-white/90">
                {Math.round((totalScore / examInfo.maxPoints) * 100)}% poprawnych odpowiedzi
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