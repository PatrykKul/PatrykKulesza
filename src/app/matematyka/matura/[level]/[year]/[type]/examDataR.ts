// examDataR.ts - Dane egzaminów maturalnych z matematyki - poziom rozszerzony

import { MathProblem, ExamData } from './examData';

export const examDataRozszerzona: Record<string, Record<string, ExamData>> = {
  // Struktura: rok -> typ (np. 'glowna', 'poprawkowa') -> ExamData
  
  // Przykład struktury:
  // '2024': {
  //   'glowna': {
  //     title: 'Matura z matematyki - poziom rozszerzony (sesja główna)',
  //     date: '2024-05-14',
  //     duration: 180,
  //     maxPoints: 70,
  //     problems: [
  //       {
  //         id: '1', // Zadanie zamknięte
  //         image: '/math_resources/matura/rozszerzona/2024/glowna/1.png',
  //         options: ['A) opcja1', 'B) opcja2', 'C) opcja3', 'D) opcja4'],
  //         answer: 'C) opcja3',
  //         solution: [
  //           'Krok 1: Analiza funkcji',
  //           'Krok 2: Obliczenie pochodnej',
  //           'Krok 3: Znalezienie ekstremów',
  //           'Odpowiedź: C) opcja3'
  //         ]
  //       },
  //       {
  //         id: '2', // Zadanie otwarte
  //         image: '/math_resources/matura/rozszerzona/2024/glowna/2.png',
  //         answer: 'f(x) = 2x + 3',
  //         solution: ['Rozwiązanie zadania otwartego']
  //       }
  //     ]
  //   }
  // }
};