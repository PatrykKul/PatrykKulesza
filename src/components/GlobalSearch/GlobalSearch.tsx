// ==========================================
// FILE: src/components/GlobalSearch.tsx
// ==========================================
// Globalna wyszukiwarka - Autocomplete w czasie rzeczywistym
// Keyboard navigation, kategoryzacja, AI Asystent na górze
// ✅ FIXED: handleSelect defined before use

'use client';

import { useSearchContext } from '@/components/GlobalSearch/SearchContext';
import { searchItems, type SearchItem } from '@/components/GlobalSearch/searchRegistry';
import { useRouter } from 'next/navigation';
import { Search, X, Sparkles, ChevronRight, Home, BookOpen, Briefcase, Mail } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GlobalSearch() {
  const { searchContext, closeSearch, setQuery, setResults, triggerSearchFromAI } = useSearchContext();
  const { isOpen, query, isTypingEffect } = searchContext;
  const router = useRouter();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const searchResultsRef = useRef<SearchItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // ==========================================
  // HANDLERS - Define BEFORE useEffects that use them
  // ==========================================

  const handleSelect = useCallback((item: SearchItem) => {
    console.log('🎯 GlobalSearch: Selecting item:', item.id, item.path, item.action);
    closeSearch();

    if (item.action === 'open-ai') {
      // Trigger chatbot
      console.log('🤖 Opening AI chatbot');
      window.dispatchEvent(new CustomEvent('korkus:open'));
    } else if (item.path) {
      // Navigate
      console.log('🔗 Navigating to:', item.path);
      router.push(item.path);
    } else {
      console.warn('⚠️ No action or path for item:', item.id);
    }
  }, [closeSearch, router]);

  const scrollToSelected = useCallback((index: number) => {
    if (resultsRef.current) {
      const selected = resultsRef.current.children[index] as HTMLElement;
      if (selected) {
        selected.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, []);

  const handleInputChange = useCallback((value: string) => {
    if (!isTypingEffect) {
      setQuery(value);
    }
  }, [isTypingEffect, setQuery]);

  // ==========================================
  // EFFECTS
  // ==========================================

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current && !isTypingEffect) {
      inputRef.current.focus();
    }
  }, [isOpen, isTypingEffect]);

  // Search in real-time
  useEffect(() => {
    if (query.trim()) {
      const results = searchItems(query, 10);
      setSearchResults(results);
      searchResultsRef.current = results;
      setResults(results);
      setSelectedIndex(0); // Reset selection
    } else {
      setSearchResults([]);
      searchResultsRef.current = [];
      setResults([]);
      setSelectedIndex(0);
    }
  }, [query, setResults]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        closeSearch();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => {
          const newIndex = prev < searchResultsRef.current.length - 1 ? prev + 1 : prev;
          setTimeout(() => scrollToSelected(newIndex), 0);
          return newIndex;
        });
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => {
          const newIndex = prev > 0 ? prev - 1 : prev;
          setTimeout(() => scrollToSelected(newIndex), 0);
          return newIndex;
        });
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        setSelectedIndex(prev => {
          const selected = searchResultsRef.current[prev];
          if (selected) {
            handleSelect(selected);
          }
          return prev;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeSearch, handleSelect, scrollToSelected]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        closeSearch();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, closeSearch]);

  // Listen for AI trigger event
  useEffect(() => {
    const handleAITrigger = (event: CustomEvent) => {
      const { query: aiQuery } = event.detail;
      if (aiQuery) {
        triggerSearchFromAI(aiQuery);
      }
    };

    window.addEventListener('korkus:triggerSearch', handleAITrigger as EventListener);
    return () => {
      window.removeEventListener('korkus:triggerSearch', handleAITrigger as EventListener);
    };
  }, [triggerSearchFromAI]);

  // ==========================================
  // HELPER FUNCTIONS
  // ==========================================

  const getCategoryIcon = (category: SearchItem['category']) => {
    switch (category) {
      case 'ai': return <Sparkles className="w-4 h-4" />;
      case 'navigation': return <Home className="w-4 h-4" />;
      case 'materials': return <BookOpen className="w-4 h-4" />;
      case 'services': return <Briefcase className="w-4 h-4" />;
      case 'contact': return <Mail className="w-4 h-4" />;
      default: return <ChevronRight className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = (category: SearchItem['category']) => {
    switch (category) {
      case 'ai': return '🤖 AI Asystent';
      case 'navigation': return '🏠 Nawigacja';
      case 'materials': return '📚 Materiały';
      case 'services': return '💼 Usługi';
      case 'contact': return '📧 Kontakt';
      default: return '🔍 Inne';
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <strong key={i} className="font-bold text-[#1f6feb]">{part}</strong>
        : part
    );
  };

  // Group results by category
  const groupedResults = searchResults.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, SearchItem[]>);

  // Sort categories: AI first, then others
  const sortedCategories = Object.keys(groupedResults).sort((a, b) => {
    if (a === 'ai') return -1;
    if (b === 'ai') return 1;
    return 0;
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl bg-[#0d1117] border border-[#30363d] rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-[#30363d]">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Szukaj materiałów, tematów, usług..."
              className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-lg"
              disabled={isTypingEffect}
            />
            {isTypingEffect && (
              <div className="text-xs text-gray-500 animate-pulse">
                AI pisze...
              </div>
            )}
            <button
              onClick={closeSearch}
              className="p-2 hover:bg-[#21262d] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[500px] overflow-y-auto" ref={resultsRef}>
            {query.trim() === '' ? (
              <div className="p-8 text-center text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-lg">Zacznij wpisywać aby wyszukać...</p>
                <p className="text-sm mt-2">Spróbuj: matematyka, kontakt, AI</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-lg">Nie znaleziono wyników</p>
                <p className="text-sm mt-2">Spróbuj: matematyka, kontakt, AI</p>
              </div>
            ) : (
              <div className="p-2">
                {sortedCategories.map((category, catIndex) => (
                  <div key={category} className="mb-4 last:mb-0">
                    {/* Category Header */}
                    <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {getCategoryIcon(category as SearchItem['category'])}
                      {getCategoryLabel(category as SearchItem['category'])}
                    </div>

                    {/* Items in this category */}
                    {groupedResults[category].map((item, itemIndex) => {
                      // Calculate global index for keyboard navigation
                      let globalIndex = 0;
                      for (let i = 0; i < catIndex; i++) {
                        globalIndex += groupedResults[sortedCategories[i]].length;
                      }
                      globalIndex += itemIndex;

                      const isSelected = globalIndex === selectedIndex;
                      const isAI = item.category === 'ai';

                      return (
                        <motion.button
                          key={item.id}
                          onClick={() => handleSelect(item)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                            isAI
                              ? isSelected
                                ? 'bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] text-white'
                                : 'bg-gradient-to-r from-[#1f6feb]/20 to-[#58a6ff]/20 text-white hover:from-[#1f6feb]/30 hover:to-[#58a6ff]/30'
                              : isSelected
                              ? 'bg-[#21262d] text-white'
                              : 'text-gray-300 hover:bg-[#161b22]'
                          }`}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {/* Icon */}
                          <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                            isAI ? 'bg-white/20' : 'bg-[#21262d]'
                          }`}>
                            {item.icon ? (
                              <span className="text-xl">{item.icon}</span>
                            ) : (
                              getCategoryIcon(item.category)
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className={`font-semibold truncate ${
                              isAI ? 'text-white' : isSelected ? 'text-white' : 'text-gray-200'
                            }`}>
                              {highlightMatch(item.title, query)}
                            </div>
                            {item.description && (
                              <div className={`text-sm truncate ${
                                isAI ? 'text-white/80' : isSelected ? 'text-gray-300' : 'text-gray-500'
                              }`}>
                                {item.description}
                              </div>
                            )}
                          </div>

                          {/* Arrow */}
                          <div className="flex-shrink-0">
                            <ChevronRight className={`w-5 h-5 ${
                              isAI ? 'text-white' : isSelected ? 'text-white' : 'text-gray-600'
                            }`} />
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#30363d] bg-[#161b22] text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-[#21262d] border border-[#30363d] rounded">↑</kbd>
                <kbd className="px-2 py-1 bg-[#21262d] border border-[#30363d] rounded">↓</kbd>
                <span>Nawigacja</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-[#21262d] border border-[#30363d] rounded">Enter</kbd>
                <span>Wybierz</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-[#21262d] border border-[#30363d] rounded">Esc</kbd>
                <span>Zamknij</span>
              </div>
            </div>
            <div className="text-gray-600">
              {searchResults.length} {searchResults.length === 1 ? 'wynik' : 'wyników'}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}