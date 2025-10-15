# 🔍 PROMPT DLA CLAUDE - GLOBALNA WYSZUKIWARKA

## 📋 ZADANIE

Zaimplementuj **globalną wyszukiwarkę** dla strony korepetycji Next.js 15 + TypeScript. Wyszukiwarka ma być **zawsze widoczna w headerze**, działać na **wszystkich stronach**, i być **łatwo rozszerzalna** (dodawanie nowych materiałów, sekcji bez modyfikacji logiki).

---

## 🎯 SPECYFIKACJA FUNKCJONALNA

### 1. **HEADER - ZAWSZE MOBILNY STYL**

- **Desktop i mobile**: Zawsze hamburger menu + wyszukiwarka (jak na załączonym zdjęciu)
- **Logo** po lewej stronie
- **Search input** na środku/prawo (duży, widoczny)
- **Hamburger menu** po prawej (nawigacja w overlay)
- **Responsywność**: Mobile-first design

### 2. **GLOBALNA WYSZUKIWARKA**

#### Funkcjonalność:

- **Autocomplete w czasie rzeczywistym** (po wpisaniu 1+ znaków)
- **Kategoryzacja wyników**:
  - 🤖 **AI Asystent** - ZAWSZE na górze (KORKUŚ chatbot)
  - 🏠 **Nawigacja** - strona główna, usługi, kontakt, o mnie, opinie
  - 📚 **Materiały** - matematyka (ułamki, równania, etc.), matura, egzamin-8
  - 💻 **Przedmioty** - matematyka, angielski, programowanie
- **Podświetlanie match'ów** (bold query w title/description)
- **Ikony + opisy** dla każdego wyniku
- **Keyboard navigation** (strzałki, Enter, Escape)
- **Click outside** = zamknięcie
- **Przekierowania**:
  - Zwykłe items → `router.push(path)`
  - AI Asystent → otwórz chatbota (event: `korkus:open`)

#### UI/UX:

- **Modal/Dropdown** pod input search
- **Max 10 wyników** jednocześnie
- **Kategoryzacja wizualna** (nagłówki kategorii: "🤖 AI", "🏠 Nawigacja", etc.)
- **Brak wyników** → "Nie znaleziono. Spróbuj: matematyka, kontakt, AI"
- **Loading state** (opcjonalnie)

### 3. **INTEGRACJA Z KORKUŚ AI**

#### Scenariusz:

Użytkownik w KORKUŚ chatbocie pisze: _"gdzie znajdę ułamki?"_

#### Oczekiwane zachowanie:

1. **KORKUŚ odpowiada**: "Sprawdzam... 🔍"
2. **KORKUŚ triggeruje wyszukiwarkę**:
   - Event: `window.dispatchEvent(new CustomEvent('korkus:triggerSearch', { detail: { query: 'ułamki' } }))`
3. **Wyszukiwarka się otwiera** (automatycznie)
4. **Typing effect** - widać jak KORKUŚ pisze "ułamki" litera po literze (50ms/litera)
5. **Wyniki pojawiają się** w czasie rzeczywistym
6. **KORKUŚ odpowiada**: "Znalazłem! 📚 Ułamki zwykłe (kliknij aby przejść)"

#### Implementacja:

- **Listener w GlobalSearch**: `useEffect(() => { window.addEventListener('korkus:triggerSearch', ...) })`
- **Typing effect**: `setInterval` w SearchContext
- **Chatbot integracja**: Dodaj logikę w Chatbot.tsx (detekcja "gdzie znajdę X", trigger search)

### 4. **ŁATWE ROZSZERZANIE**

#### System rejestracji fraz (już gotowy w `searchRegistry.ts`):

```typescript
// Przykład - dodawanie nowego materiału:
{
  id: 'math-rownania-kwadratowe',
  title: 'Równania kwadratowe',
  description: 'Delta, pierwiastki, postać kanoniczna',
  keywords: ['rownania kwadratowe', 'delta', 'pierwiastki', 'kwadraty', 'liceum'],
  path: '/matematyka?category=liceum-podstawowy&topic=rownania-kwadratowe',
  category: 'materials',
  icon: '📐',
  priority: 6
}
```

- **Jeden plik** (`searchRegistry.ts`) → wszystkie frazy
- **Automatyczne** dodawanie do wyszukiwarki (zero zmian w komponencie)

---

## 📂 PLIKI DO MODYFIKACJI

### ✅ **GOTOWE (nie modyfikuj):**

1. **`src/data/searchRegistry.ts`** - System rejestracji fraz (100+ items)
2. **`src/contexts/SearchContext.tsx`** - Context API (state, typing effect, AI trigger)

### 🔧 **DO IMPLEMENTACJI (Twoje zadanie):**

#### 1. **`src/components/GlobalSearch.tsx`**

- **TODO**: Implementuj UI/UX wyszukiwarki
- **Wymagania**:

  ```typescript
  // Imports
  import { useSearchContext } from "@/contexts/SearchContext";
  import { searchItems, type SearchItem } from "@/data/searchRegistry";
  import { useRouter } from "next/navigation";
  import { Search, X, Sparkles } from "lucide-react";
  import { useEffect, useRef, useState } from "react";

  // Funkcjonalność:
  // - useEffect: nasłuchuj 'korkus:triggerSearch' event
  // - useEffect: search w czasie rzeczywistym (searchItems(query))
  // - handleSelect: przekierowanie lub akcja (AI = trigger chatbot)
  // - Keyboard navigation (ArrowUp/Down, Enter, Escape)
  // - Click outside (useRef + document.addEventListener)

  // UI:
  // - Modal/Dropdown (Tailwind: fixed/absolute, z-50, backdrop-blur)
  // - Input search (autofocus, value=query, onChange=setQuery)
  // - Kategoryzacja wyników (group by category)
  // - Ikony + bold query w title
  // - "AI Asystent" zawsze na górze (bg-gradient, sparkles icon)
  ```

#### 2. **`src/sections/header.tsx`**

- **TODO**: Refaktoryzacja na mobilny styl (zawsze hamburger + search)
- **Wymagania**:

  ```typescript
  // Imports
  import { useSearchContext } from "@/contexts/SearchContext";
  import { Search } from "lucide-react";

  // Zmiany:
  // 1. USUŃ: Desktop menu (lg:flex menu items)
  // 2. DODAJ: Search input na środku/prawo
  //    - onClick: openSearch() z SearchContext
  //    - Icon: <Search /> lucide-react
  //    - Placeholder: "Szukaj materiałów, tematów, usług..."
  //    - Tailwind: px-4 py-2, rounded-xl, bg-[#21262d], border-[#30363d]
  // 3. ZACHOWAJ: Logo + hamburger menu (mobile overlay)
  // 4. Responsywność: Mobile-first (search pełna szerokość na mobile)

  // Layout:
  // Desktop: [Logo] [Search Input --------] [Hamburger]
  // Mobile:  [Logo] [Search ----] [Menu]
  ```

#### 3. **`src/components/chatbot/Chatbot.tsx`**

- **TODO**: Integracja z wyszukiwarką (detekcja "gdzie znajdę X")
- **Wymagania**:

  ```typescript
  // W funkcji sendMessage (przed API call):

  // Detekcja "gdzie znajdę X" lub "szukam X"
  const searchPatterns = [
    /gdzie znajd[ęe] (.+)/i,
    /szukam (.+)/i,
    /gdzie jest (.+)/i,
    /pokaz mi (.+)/i,
  ];

  for (const pattern of searchPatterns) {
    const match = input.match(pattern);
    if (match && match[1]) {
      const query = match[1].trim();

      // Trigger wyszukiwarki
      window.dispatchEvent(
        new CustomEvent("korkus:triggerSearch", {
          detail: { query },
        })
      );

      // Bot odpowiada
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: `🔍 Sprawdzam "${query}"... Otwieram wyszukiwarkę!`,
        },
      ]);

      return; // Nie wysyłaj do API
    }
  }

  // Normalny flow API...
  ```

#### 4. **`src/app/layout.tsx`**

- **TODO**: Dodaj SearchContextProvider
- **Wymagania**:

  ```typescript
  import { SearchContextProvider } from "@/contexts/SearchContext";
  import GlobalSearch from "@/components/GlobalSearch";

  // W <body>:
  <SearchContextProvider>
    <ExamContextProvider>
      {children}
      <Chatbot />
      <GlobalSearch /> {/* Dodaj tutaj */}
    </ExamContextProvider>
  </SearchContextProvider>;
  ```

---

## 🎨 DESIGN GUIDELINES

### Kolory (Tailwind classes):

- **Background**: `bg-[#0d1117]`, `bg-[#161b22]`, `bg-[#21262d]`
- **Borders**: `border-[#30363d]`, `border-[#1f6feb]`
- **Text**: `text-white`, `text-gray-300`, `text-[#58a6ff]`
- **Gradient**: `from-[#1f6feb] to-[#58a6ff]`
- **Hover**: `hover:bg-[#30363d]`, `hover:border-[#58a6ff]`

### Ikony (Lucide React):

- Search, X, Sparkles, ChevronRight, ArrowRight

### Animacje (Framer Motion):

```typescript
import { motion, AnimatePresence } from "framer-motion";

// Modal fade-in
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      {/* Content */}
    </motion.div>
  )}
</AnimatePresence>;
```

---

## 📦 CO PRZYGOTUJĘ DLA CIEBIE

### Pliki do wysłania:

1. **`src/data/searchRegistry.ts`** - System rejestracji (już gotowy)
2. **`src/contexts/SearchContext.tsx`** - Context API (już gotowy)
3. **`src/sections/header.tsx`** - Obecny header (do refaktoryzacji)
4. **`src/app/layout.tsx`** - Layout (do modyfikacji)
5. **`src/components/chatbot/Chatbot.tsx`** - Chatbot (do integracji)
6. **`src/components/GlobalSearch.tsx`** - Placeholder (do implementacji)
7. **Ten prompt** - Pełna specyfikacja

### Struktura projektu:

```
src/
├── app/
│   ├── layout.tsx          # Dodaj SearchContextProvider + GlobalSearch
│   └── page.tsx            # Strona główna (bez zmian)
├── components/
│   ├── GlobalSearch.tsx    # TODO: Implementuj UI/UX
│   └── chatbot/
│       └── Chatbot.tsx     # TODO: Dodaj detekcję "gdzie znajdę X"
├── contexts/
│   ├── SearchContext.tsx   # ✅ Gotowe (Context API)
│   └── ExamContext.tsx     # Bez zmian
├── data/
│   └── searchRegistry.ts   # ✅ Gotowe (100+ items)
└── sections/
    └── header.tsx          # TODO: Refaktoryzacja (mobilny styl + search)
```

---

## ✅ CHECKLIST - CO MA DZIAŁAĆ

- [ ] **Header**: Zawsze mobilny styl (hamburger + search input)
- [ ] **GlobalSearch**: Modal z autocomplete, kategorizacja, ikony
- [ ] **Keyboard nav**: ArrowUp/Down, Enter, Escape
- [ ] **Click outside**: Zamknięcie wyszukiwarki
- [ ] **Przekierowania**: `router.push(path)` lub trigger chatbota
- [ ] **AI Asystent**: Zawsze na górze wyników (priority 100)
- [ ] **Typing effect**: Gdy trigger z KORKUŚ (50ms/litera)
- [ ] **Chatbot integracja**: Detekcja "gdzie znajdę X" → trigger search
- [ ] **Łatwe rozszerzanie**: Dodanie nowego item w searchRegistry.ts = automatycznie w search

---

## 🚀 PRZYKŁAD WYNIKU

### Użytkownik wpisuje: "ułamki"

```
🔍 Wyniki wyszukiwania (3):

━━━━━━━━━━━━━━━━━━━━━━━
🤖 AI Asystent
━━━━━━━━━━━━━━━━━━━━━━━
[✨] Asystent AI - KORKUŚ
     Zadaj pytanie AI, umów korepetycje

━━━━━━━━━━━━━━━━━━━━━━━
📚 Materiały
━━━━━━━━━━━━━━━━━━━━━━━
[➗] Ułamki zwykłe
     Dodawanie, odejmowanie, mnożenie

[🔟] Ułamki dziesiętne
     Zaokrąglanie, działania
```

---

## 📞 WSPARCIE

Jeśli coś niejasne:

- **searchRegistry.ts** - przykłady jak dodawać items
- **SearchContext.tsx** - funkcje: openSearch, triggerSearchFromAI, setQuery
- **Typing effect** - już w SearchContext (triggerSearchFromAI)

---

## 🎯 OCZEKIWANY OUTPUT

**Wyślij mi kod do wklejenia** dla:

1. `src/components/GlobalSearch.tsx` (pełna implementacja)
2. `src/sections/header.tsx` (refaktoryzacja)
3. `src/components/chatbot/Chatbot.tsx` (integracja - dodaj fragment kodu)
4. `src/app/layout.tsx` (dodaj providers - dodaj fragment kodu)

**Format**: Gotowy kod TypeScript/React/Next.js, **copy-paste ready**, z komentarzami.

---

**POWODZENIA! 🚀**
