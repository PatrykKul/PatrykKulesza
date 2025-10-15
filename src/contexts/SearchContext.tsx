// SearchContext.tsx - Context dla globalnej wyszukiwarki
// Zarządza stanem wyszukiwarki (otwarcie, query, wyniki, trigger z AI)

'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { SearchItem } from '@/data/searchRegistry';

interface SearchContextData {
  isOpen: boolean;
  query: string;
  results: SearchItem[];
  isTypingEffect: boolean; // Czy aktualnie trwa efekt pisania (trigger z AI)
  triggerSource: 'user' | 'ai' | null; // Kto otworzył wyszukiwarkę
}

interface SearchContextType {
  searchContext: SearchContextData;
  openSearch: (source?: 'user' | 'ai') => void;
  closeSearch: () => void;
  setQuery: (query: string) => void;
  setResults: (results: SearchItem[]) => void;
  triggerSearchFromAI: (query: string) => void; // Specjalna funkcja dla AI
  setIsTypingEffect: (isTyping: boolean) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

const initialState: SearchContextData = {
  isOpen: false,
  query: '',
  results: [],
  isTypingEffect: false,
  triggerSource: null
};

export function SearchContextProvider({ children }: { children: ReactNode }) {
  const [searchContext, setSearchContext] = useState<SearchContextData>(initialState);

  const openSearch = useCallback((source: 'user' | 'ai' = 'user') => {
    setSearchContext(prev => ({ 
      ...prev, 
      isOpen: true,
      triggerSource: source
    }));
  }, []);

  const closeSearch = useCallback(() => {
    setSearchContext(prev => ({ 
      ...prev, 
      isOpen: false,
      query: '',
      results: [],
      isTypingEffect: false,
      triggerSource: null
    }));
  }, []);

  const setQuery = useCallback((query: string) => {
    setSearchContext(prev => ({ ...prev, query }));
  }, []);

  const setResults = useCallback((results: SearchItem[]) => {
    setSearchContext(prev => ({ ...prev, results }));
  }, []);

  const setIsTypingEffect = useCallback((isTyping: boolean) => {
    setSearchContext(prev => ({ ...prev, isTypingEffect: isTyping }));
  }, []);

  const triggerSearchFromAI = useCallback((query: string) => {
    // Otwórz wyszukiwarkę, ustaw query, uruchom typing effect
    setSearchContext(prev => ({
      ...prev,
      isOpen: true,
      query: '',
      triggerSource: 'ai',
      isTypingEffect: true
    }));

    // Typing effect - pisz query po literze
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < query.length) {
        setSearchContext(prev => ({
          ...prev,
          query: query.slice(0, currentIndex + 1)
        }));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setSearchContext(prev => ({
          ...prev,
          isTypingEffect: false
        }));
      }
    }, 50); // 50ms per letter
  }, []);

  return (
    <SearchContext.Provider value={{
      searchContext,
      openSearch,
      closeSearch,
      setQuery,
      setResults,
      triggerSearchFromAI,
      setIsTypingEffect
    }}>
      {children}
    </SearchContext.Provider>
  );
}

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchContext must be used within SearchContextProvider');
  }
  return context;
};