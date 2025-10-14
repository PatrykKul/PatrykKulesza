// examData.ts - Dane wszystkich egzaminów maturalnych z matematyki (podstawowa i rozszerzona)

import { examDataPodstawowa } from './examDataP';
import { examDataRozszerzona } from './examDataR';

export interface MathProblem {
  id: string;
  image?: string; // Zdjęcie całego zadania (pojedyncze)
  images?: string[]; // Wiele zdjęć dla jednego zadania
  options?: string[]; // Opcje wielokrotnego wyboru (dla zadań zamkniętych)
  answer: string;
  solution: string[]; // Kroki rozwiązania
  points?: number; // Maksymalna liczba punktów za zadanie
  category?: string; // Kategoria zadania (np. "Algebra", "Geometria")
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

export const examData: Record<string, Record<string, Record<string, ExamData>>> = {
  'podstawowa': examDataPodstawowa,
  'rozszerzona': examDataRozszerzona 
};