// examData.ts - Dane wszystkich egzaminów maturalnych z matematyki (podstawowa i rozszerzona)

import { examDataPodstawowa } from './examDataP';
import { examDataRozszerzona } from './examDataR';

export interface MathProblem {
  id: string;
  image: string; // Zdjęcie całego zadania
  options?: string[]; // Opcje wielokrotnego wyboru (dla zadań zamkniętych)
  answer: string;
  solution: string[]; // Kroki rozwiązania
}

export interface ExamData {
  title: string;
  date: string;
  duration: number;
  maxPoints: number;
  problems: MathProblem[];
}

export const examData: Record<string, Record<string, Record<string, ExamData>>> = {
  'podstawowa': examDataPodstawowa,
  'rozszerzona': examDataRozszerzona 
};