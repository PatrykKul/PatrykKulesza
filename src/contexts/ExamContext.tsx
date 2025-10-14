'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MathProblem } from '@/app/matematyka/components/ExamPage';

interface ExamContextData {
  currentProblem: MathProblem | null;
  userAnswer: string[];
  isChecked: boolean;
  canvasData: string | null;
  examInfo: {
    title: string;
    level?: string;
    year: string;
    type: string;
    examType: string; // 'egzamin-8' | 'matura'
  } | null;
  timeElapsed: number;
  totalProblems: number;
  completedProblems: number;
  allProblems: MathProblem[]; // 🔥 Lista wszystkich zadań
}

interface ExamContextType {
  examContext: ExamContextData;
  setCurrentProblem: (problem: MathProblem) => void;
  setUserAnswer: (answer: string[]) => void;
  setIsChecked: (checked: boolean) => void;
  setCanvasData: (data: string | null) => void;
  setExamInfo: (info: {
    title: string;
    level?: string;
    year: string;
    type: string;
    examType: string;
  }) => void;
  setTimeElapsed: (time: number) => void;
  setTotalProblems: (total: number) => void;
  setCompletedProblems: (completed: number) => void;
  setAllProblems: (problems: MathProblem[]) => void; // 🔥 Dodaj wszystkie zadania
  clearContext: () => void;
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

const initialState: ExamContextData = {
  currentProblem: null,
  userAnswer: [],
  isChecked: false,
  canvasData: null,
  examInfo: null,
  timeElapsed: 0,
  totalProblems: 0,
  completedProblems: 0,
  allProblems: [] // 🔥 Inicjalizacja
};

export function ExamContextProvider({ children }: { children: ReactNode }) {
  const [examContext, setExamContext] = useState<ExamContextData>(initialState);

  const setCurrentProblem = (problem: MathProblem) => {
    setExamContext(prev => ({ ...prev, currentProblem: problem }));
  };

  const setUserAnswer = (answer: string[]) => {
    setExamContext(prev => ({ ...prev, userAnswer: answer }));
  };

  const setIsChecked = (checked: boolean) => {
    setExamContext(prev => ({ ...prev, isChecked: checked }));
  };

  const setCanvasData = (data: string | null) => {
    setExamContext(prev => ({ ...prev, canvasData: data }));
  };

  const setExamInfo = (info: {
    title: string;
    level?: string;
    year: string;
    type: string;
    examType: string;
  }) => {
    setExamContext(prev => ({ ...prev, examInfo: info }));
  };

  const setTimeElapsed = (time: number) => {
    setExamContext(prev => ({ ...prev, timeElapsed: time }));
  };

  const setTotalProblems = (total: number) => {
    setExamContext(prev => ({ ...prev, totalProblems: total }));
  };

  const setCompletedProblems = (completed: number) => {
    setExamContext(prev => ({ ...prev, completedProblems: completed }));
  };
  
  const setAllProblems = (problems: MathProblem[]) => {
    setExamContext(prev => ({ ...prev, allProblems: problems }));
  };

  const clearContext = () => {
    setExamContext(initialState);
  };

  return (
    <ExamContext.Provider value={{
      examContext,
      setCurrentProblem,
      setUserAnswer,
      setIsChecked,
      setCanvasData,
      setExamInfo,
      setTimeElapsed,
      setTotalProblems,
      setCompletedProblems,
      setAllProblems,
      clearContext
    }}>
      {children}
    </ExamContext.Provider>
  );
}

export const useExamContext = () => {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error('useExamContext must be used within ExamContextProvider');
  }
  return context;
};

// Helper functions dla łatwiejszego użycia
export const useCurrentProblem = () => {
  const { examContext } = useExamContext();
  return examContext.currentProblem;
};

export const useExamProgress = () => {
  const { examContext } = useExamContext();
  return {
    total: examContext.totalProblems,
    completed: examContext.completedProblems,
    current: examContext.currentProblem?.id,
    percentage: examContext.totalProblems > 0 
      ? Math.round((examContext.completedProblems / examContext.totalProblems) * 100)
      : 0
  };
};