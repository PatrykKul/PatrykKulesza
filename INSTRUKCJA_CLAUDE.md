# 📦 PLIKI DO WYSŁANIA CLAUDE

## ✅ GOTOWE PLIKI (wysłać w całości)

### 1. **CLAUDE_PROMPT_GLOBAL_SEARCH.md**

**Lokalizacja**: `c:\Users\Patryk\Desktop\Projekty\Portfolio\korepetycje\CLAUDE_PROMPT_GLOBAL_SEARCH.md`

- Pełna specyfikacja zadania
- Design guidelines
- Checklist funkcjonalności
- **WYŚLIJ JAKO PIERWSZY!**

### 2. **src/data/searchRegistry.ts**

**Lokalizacja**: `c:\Users\Patryk\Desktop\Projekty\Portfolio\korepetycje\src\data\searchRegistry.ts`

- ✅ System rejestracji fraz (100+ items)
- AI Asystent (priority 100)
- Nawigacja, usługi, materiały matematyczne
- Helper functions: searchItems(), getItemById()
- **Claude NIE MODYFIKUJE - tylko używa**

### 3. **src/contexts/SearchContext.tsx**

**Lokalizacja**: `c:\Users\Patryk\Desktop\Projekty\Portfolio\korepetycje\src\contexts\SearchContext.tsx`

- ✅ Context API (state, typing effect, AI trigger)
- Functions: openSearch, closeSearch, setQuery, triggerSearchFromAI
- Typing effect (50ms/letter)
- **Claude NIE MODYFIKUJE - tylko używa**

---

## 🔧 PLIKI DO MODYFIKACJI (wysłać obecną wersję)

### 4. **src/components/GlobalSearch.tsx**

**Lokalizacja**: `c:\Users\Patryk\Desktop\Projekty\Portfolio\korepetycje\src\components\GlobalSearch.tsx`

- ⚠️ Placeholder - **Claude IMPLEMENTUJE pełny UI/UX**
- Autocomplete, kategoryzacja, keyboard nav
- Click outside, przekierowania

### 5. **src/sections/header.tsx**

**Lokalizacja**: `c:\Users\Patryk\Desktop\Projekty\Portfolio\korepetycje\src\sections\header.tsx`

- ⚠️ Obecny header - **Claude REFAKTORYZUJE**
- Zmiana: zawsze mobilny styl (hamburger + search)
- Dodanie: search input z useSearchContext

### 6. **src/components/chatbot/Chatbot.tsx**

**Lokalizacja**: `c:\Users\Patryk\Desktop\Projekty\Portfolio\korepetycje\src\components\chatbot\Chatbot.tsx`

- ⚠️ Obecny chatbot - **Claude DODAJE integrację**
- Detekcja: "gdzie znajdę X" → trigger wyszukiwarki
- Event: `window.dispatchEvent(new CustomEvent('korkus:triggerSearch', ...))`

### 7. **src/app/layout.tsx**

**Lokalizacja**: `c:\Users\Patryk\Desktop\Projekty\Portfolio\korepetycje\src\app\layout.tsx`

- ⚠️ Obecny layout - **Claude DODAJE providers**
- Dodanie: SearchContextProvider + GlobalSearch component

---

## 📋 INSTRUKCJA DLA UŻYTKOWNIKA

### Krok 1: Skopiuj prompt

Otwórz: `CLAUDE_PROMPT_GLOBAL_SEARCH.md`
Skopiuj całą zawartość → wklej w nowej konwersacji z Claude

### Krok 2: Wyślij pliki gotowe (copy-paste całe pliki)

```
Oto pliki gotowe (NIE MODYFIKUJ, tylko użyj):

--- FILE: src/data/searchRegistry.ts ---
[wklej zawartość searchRegistry.ts]

--- FILE: src/contexts/SearchContext.tsx ---
[wklej zawartość SearchContext.tsx]
```

### Krok 3: Wyślij pliki do modyfikacji (copy-paste całe pliki)

```
Oto pliki do modyfikacji (ZAIMPLEMENTUJ według specyfikacji):

--- FILE: src/components/GlobalSearch.tsx ---
[wklej zawartość GlobalSearch.tsx - placeholder]

--- FILE: src/sections/header.tsx ---
[wklej zawartość header.tsx - obecny header]

--- FILE: src/components/chatbot/Chatbot.tsx ---
[wklej zawartość Chatbot.tsx - obecny chatbot]

--- FILE: src/app/layout.tsx ---
[wklej zawartość layout.tsx - obecny layout]
```

### Krok 4: Poczekaj na kod

Claude wyśle gotowy kod do wklejenia dla każdego pliku.

### Krok 5: Wklej kod

Skopiuj kod od Claude → wklej do odpowiednich plików.

---

## ⚡ SZYBKIE KOPIOWANIE (PowerShell)

Jeśli chcesz szybko skopiować wszystkie pliki do schowka:

```powershell
# Skopiuj prompt
Get-Content "c:\Users\Patryk\Desktop\Projekty\Portfolio\korepetycje\CLAUDE_PROMPT_GLOBAL_SEARCH.md" | Set-Clipboard

# Skopiuj searchRegistry
Get-Content "c:\Users\Patryk\Desktop\Projekty\Portfolio\korepetycje\src\data\searchRegistry.ts" | Set-Clipboard

# Skopiuj SearchContext
Get-Content "c:\Users\Patryk\Desktop\Projekty\Portfolio\korepetycje\src\contexts\SearchContext.tsx" | Set-Clipboard

# Skopiuj GlobalSearch
Get-Content "c:\Users\Patryk\Desktop\Projekty\Portfolio\korepetycje\src\components\GlobalSearch.tsx" | Set-Clipboard

# Skopiuj header
Get-Content "c:\Users\Patryk\Desktop\Projekty\Portfolio\korepetycje\src\sections\header.tsx" | Set-Clipboard

# Skopiuj Chatbot
Get-Content "c:\Users\Patryk\Desktop\Projekty\Portfolio\korepetycje\src\components\chatbot\Chatbot.tsx" | Set-Clipboard

# Skopiuj layout
Get-Content "c:\Users\Patryk\Desktop\Projekty\Portfolio\korepetycje\src\app\layout.tsx" | Set-Clipboard
```

---

## 🎯 OCZEKIWANY OUTPUT OD CLAUDE

Claude wyśle kod w formacie:

```typescript
// ==========================================
// FILE: src/components/GlobalSearch.tsx
// ==========================================
"use client";

import { useSearchContext } from "@/contexts/SearchContext";
// ... pełna implementacja ...

export default function GlobalSearch() {
  // ... kod ...
}

// ==========================================
// FILE: src/sections/header.tsx
// ==========================================
// ... refaktoryzacja headera ...

// ==========================================
// FILE: src/components/chatbot/Chatbot.tsx
// ==========================================
// DODAJ W FUNKCJI sendMessage (linia ~400):
const searchPatterns = [
  /gdzie znajd[ęe] (.+)/i,
  // ... integracja ...
];

// ==========================================
// FILE: src/app/layout.tsx
// ==========================================
// DODAJ IMPORTS:
import { SearchContextProvider } from "@/contexts/SearchContext";
import GlobalSearch from "@/components/GlobalSearch";

// ZMIEŃ <body>:
<SearchContextProvider>
  <ExamContextProvider>
    {children}
    <Chatbot />
    <GlobalSearch /> {/* DODANE */}
  </ExamContextProvider>
</SearchContextProvider>;
```

---

## ✅ CO SPRAWDZIĆ PO WKLEJENIU KODU

1. **Build** kompiluje się: `npm run build`
2. **Header** wygląda mobilnie (hamburger + search)
3. **Wyszukiwarka** otwiera się po kliknięciu search input
4. **Autocomplete** działa w czasie rzeczywistym
5. **AI Asystent** zawsze na górze wyników
6. **Przekierowania** działają (matematyka, kontakt, etc.)
7. **Chatbot** triggeruje search (test: "gdzie znajdę ułamki")
8. **Typing effect** działa (po trigger z AI)
9. **Keyboard nav** działa (ArrowUp/Down, Enter, Escape)
10. **Click outside** zamyka wyszukiwarkę

---

## 🚀 GOTOWE!

Masz wszystko przygotowane. Teraz:

1. Otwórz nową konwersację z Claude
2. Wklej prompt + wszystkie 7 plików
3. Poczekaj na kod
4. Wklej kod do projektu
5. Testuj!

**POWODZENIA! 🎉**
