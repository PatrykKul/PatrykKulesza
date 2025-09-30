# Obrazy dla Matury 2024 - Podstawowa - Główna

Umieść tutaj obrazy w formacie:

- `1.png` - obraz do zadania 1
- `2.png` - obraz do zadania 2
- `3.png` - obraz do zadania 3
- ...i tak dalej

## Obrazy rozwiązań (opcjonalne):

- `1-solution-1.png` - pierwszy obraz rozwiązania zadania 1
- `1-solution-2.png` - drugi obraz rozwiązania zadania 1
- `2-solution-1.png` - pierwszy obraz rozwiązania zadania 2
- ...i tak dalej

## Struktura folderów dla matury:

- `/math_resources/matura/podstawowa/{rok}/{typ}/` - np. `/math_resources/matura/podstawowa/2024/glowna/`
- `/math_resources/matura/rozszerzona/{rok}/{typ}/` - np. `/math_resources/matura/rozszerzona/2024/glowna/`

## Jak to działa:

1. Jeśli zadanie ma zdefiniowane pole `image` w examData.ts, zostanie użyte to pole
2. Jeśli nie ma pola `image`, system automatycznie spróbuje załadować obraz z pliku `{numer_zadania}.png`
3. Jeśli obraz nie istnieje, nie będzie wyświetlony (dzięki obsłudze błędów onError)
4. Obrazy rozwiązań działają podobnie - jeśli nie ma pola `solutionImages`, system sprawdza automatyczne ścieżki
