# 📸 Math Resources - Instrukcja dodawania zdjęć

## 📁 Struktura folderów

```
public/math_resources/
├── egzamin-8/
│   ├── [rok]/
│   │   ├── glowny/
│   │   └── dodatkowy/
└── matura/
    ├── podstawowa/
    │   └── [rok]/
    │       ├── glowna/
    │       ├── poprawkowa/
    │       └── probna/
    └── rozszerzona/
        └── [rok]/
            ├── glowna/
            ├── poprawkowa/
            └── probna/
```

## 🏷️ Nazewnictwo plików

### **Format podstawowy:**

- `zadanie_{numer}.{rozszerzenie}`

### **Przykłady:**

- `zadanie_1.jpg` - podstawowe zdjęcie zadania 1
- `zadanie_5.png` - zadanie 5
- `zadanie_12_wykres.jpg` - zadanie 12 z wykresem
- `zadanie_8_diagram.png` - zadanie 8 z diagramem
- `zadanie_15_schemat.jpg` - zadanie 15 ze schematem

### **Rozszerzenia:**

- `.jpg` - dla zdjęć arkuszy, skanów
- `.png` - dla diagramów, wykresów z przezroczystością
- `.svg` - dla schematów wektorowych (opcjonalnie)

## 💻 Użycie w kodzie

### **Dodanie zdjęcia do zadania:**

```typescript
{
  id: '1',
  question: 'Treść zadania...',
  image: '/math_resources/egzamin-8/2022/glowny/zadanie_1.jpg',
  // reszta właściwości...
}
```

### **Dodanie zdjęć do rozwiązania:**

```typescript
{
  id: '5',
  question: 'Zadanie z wykresem...',
  image: '/math_resources/matura/podstawowa/2024/glowna/zadanie_5.jpg',
  solution: [
    'Krok 1: Analizujemy wykres',
    'Krok 2: Obliczamy...'
  ],
  solutionImages: [
    '/math_resources/matura/podstawowa/2024/glowna/zadanie_5_wykres_rozwiazanie.jpg',
    '/math_resources/matura/podstawowa/2024/glowna/zadanie_5_final.png'
  ],
  // reszta właściwości...
}
```

## 📋 Checklist przy dodawaniu zdjęć

- [ ] Plik w odpowiednim folderze (`egzamin-8` lub `matura`)
- [ ] Poprawna nazwa: `zadanie_{numer}.{rozszerzenie}`
- [ ] Dobra jakość (czytelne, nie za duże pliki)
- [ ] Zaktualizowany examData.ts z ścieżką do zdjęcia
- [ ] Sprawdzenie czy zdjęcie wyświetla się poprawnie

## 🎨 Wskazówki techniczne

- **Maksymalny rozmiar:** 500KB na zdjęcie
- **Optymalne wymiary:** 800-1200px szerokości
- **Kompresja:** użyj narzędzi do kompresji przed dodaniem
- **Alt text:** automatycznie generowany na podstawie numeru zadania

## 📝 Przykłady użycia

### Egzamin ósmoklasisty:

```
/math_resources/egzamin-8/2022/glowny/zadanie_1.jpg
/math_resources/egzamin-8/2023/dodatkowy/zadanie_8_diagram.png
```

### Matura:

```
/math_resources/matura/podstawowa/2024/glowna/zadanie_15.jpg
/math_resources/matura/rozszerzona/2023/poprawkowa/zadanie_3_wykres.png
```
