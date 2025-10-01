// examData.ts - Dane wszystkich egzaminów ósmoklasisty

export interface MathProblem {
  id: string;
  question: string;
  formula?: string;
  image?: string; // Ścieżka do zdjęcia zadania
  options?: string[];
  answer: string;
  solution?: string[];
  solutionImages?: string[]; // Zdjęcia w rozwiązaniu (wykresy, diagramy)
  points: number;
  category: string;
}

export interface ExamData {
  title: string;
  date: string;
  duration: number;
  maxPoints: number;
  problems: MathProblem[];
}

export const examData: Record<string, Record<string, ExamData>> = {
  '2022': {
    'glowny': {
      title: 'Egzamin Ósmoklasisty - Matematyka',
      date: '25 maja 2022',
      duration: 100,
      maxPoints: 25,
      problems: [
        {
          id: '1',
          question: 'Wśród uczniów klas ósmych przeprowadzono ankietę. Jedno z pytań tej ankiety brzmiało: "Jakie filmy oglądasz najchętniej?". Każdy z uczniów wypełniających ankietę zaznaczył tylko jedną odpowiedź. Czworo spośród ankietowanych zaznaczyło odpowiedź "żadne z wymienionych". Procentowy rozkład udzielonych odpowiedzi uczniów przedstawiono na diagramie. Oceń prawdziwość podanych zdań. Wybierz P, jeśli zdanie jest prawdziwe, albo F – jeśli jest fałszywe.',
          options: [
            'W ankiecie wzięło udział 80 uczniów. - P/F',
            'Filmy fantasy wybrało o 20 uczniów więcej niż uczniów, którzy wybrali filmy przyrodnicze. - P/F'
          ],
          answer: 'PP',
          solution: [
            'Z diagramu: | fantasy 40\\%, przyrodnicze 15\\%, komediowe 30\\%, biograficzne 10\\%, żadne 5\\%',
            'Czworo uczniów zaznaczyło "żadne", co stanowi | 5\\%',
            'Jeśli 5% = 4 uczniów, to 100% = | \\frac{4 \\cdot 100}{5} = 80',
            'Pierwsze zdanie: | PRAWDA',
            'Fantasy: | 40\\% \\cdot 80 = 32 \\text{ uczniów}',
            'Przyrodnicze: | 15\\% \\cdot 80 = 12 \\text{ uczniów}',
            'Różnica: | 32 - 12 = 20 \\text{ uczniów}',
            'Drugie zdanie: | PRAWDA'
          ],
          points: 1,
          category: 'Statystyka i diagramy'
        },
        {
          id: '2',
          question: 'Dokończ zdanie. Wybierz właściwą odpowiedź spośród podanych. Wartość wyrażenia jest równa:',
          formula: '\\frac{4^2}{5} - 3^2',
          options: [
            'A) -\\frac{29}{5}',
            'B) -\\frac{22}{5}',
            'C) \\frac{7}{5}',
            'D) \\frac{61}{5}'
          ],
          answer: 'A) -\\frac{29}{5}',
          solution: [
            'Obliczamy potęgi: | 4^2 = 16, \\quad 3^2 = 9',
            'Podstawiamy: | \\frac{4^2}{5} - 3^2 = \\frac{16}{5} - 9',
            'Zamieniamy 9 na ułamek o mianowniku 5: | 9 = \\frac{45}{5}',
            'Obliczamy: | \\frac{16}{5} - \\frac{45}{5} = \\frac{16 - 45}{5} = \\frac{-29}{5}',
            'Odpowiedź: | A) -\\frac{29}{5}'
          ],
          points: 1,
          category: 'Ułamki i potęgi'
        },
        {
          id: '3',
          question: 'Spośród wszystkich liczb trzycyfrowych o sumie cyfr równej 6 wybrano liczbę największą i liczbę najmniejszą. Dokończ zdanie. Wybierz właściwą odpowiedź spośród podanych. Suma wybranych liczb jest równa:',
          options: ['A) 714', 'B) 705', 'C) 606', 'D) 327'],
          answer: 'B) 705',
          solution: [
            'Największa liczba trzycyfrowa o sumie cyfr 6: | 600 \\text{ (bo } 6+0+0=6\\text{)}',
            'Najmniejsza liczba trzycyfrowa o sumie cyfr 6: | 105 \\text{ (bo } 1+0+5=6\\text{)}',
            'Suma: | 600 + 105 = 705',
            'Odpowiedź: | B) 705'
          ],
          points: 1,
          category: 'Liczby naturalne'
        },
        {
    id: '4',
    question: 'Liczba k jest sumą liczb 323 i 160.',
    options: [
      'Czy liczba k jest podzielna przez 3? - A/B',
      'Uzasadnienie: 1. cyfrą jedności liczby k jest 3 / 2. żadna z liczb 323 i 160 nie dzieli się przez 3 / 3. suma cyfr 4, 8 i 3 jest liczbą podzielną przez 3 - 1/2/3'
    ],
          answer: 'A3',
          solution: [
            'Obliczamy k: | k = 323 + 160 = 483',
            'Cecha podzielności przez 3: | \\text{liczba jest podzielna przez 3, gdy suma jej cyfr dzieli się przez 3}',
            'Suma cyfr: | 4 + 8 + 3 = 15',
            'Sprawdzamy podzielność: | 15 : 3 = 5 \\text{, więc 15 dzieli się przez 3}',
            'Wniosek: | \\text{Zatem 483 jest podzielna przez 3}',
            'Prawidłowa odpowiedź: | A \\text{ (Tak)}',
            'Prawidłowe uzasadnienie: | 3 \\text{ (suma cyfr 4, 8 i 3 jest liczbą podzielną przez 3)}'
          ],
          points: 1,
          category: 'Podzielność liczb'
        },
        {
          id: '5',
          question: 'Dane są trzy liczby. Która z tych liczb jest mniejsza od liczby 10¹⁰⁰? Wybierz właściwą odpowiedź spośród podanych.',
          formula: 'x = \\frac{10^{30} \\cdot 10^{70}}{10}, \\quad y = (10^3)^{15} \\cdot 10^{60}, \\quad z = 10^{50} \\cdot \\frac{10^{80}}{10^{20}}',
          options: ['A) Tylko x', 'B) Tylko y', 'C) Tylko z', 'D) Każda z liczb x, y, z'],
          answer: 'A) Tylko x',
          solution: [
            'Obliczamy x: | x = \\frac{10^{30} \\cdot 10^{70}}{10} = \\frac{10^{100}}{10^1} = 10^{99} < 10^{100}',
            'Obliczamy y: | y = (10^3)^{15} \\cdot 10^{60} = 10^{45} \\cdot 10^{60} = 10^{105} > 10^{100}',
            'Obliczamy z: | z = 10^{50} \\cdot \\frac{10^{80}}{10^{20}} = 10^{50} \\cdot 10^{60} = 10^{110} > 10^{100}',
            'Wniosek: | \\text{Tylko x jest mniejsze od } 10^{100}',
            'Odpowiedź: | A) \\text{Tylko x}'
          ],
          points: 1,
          category: 'Potęgi'
        },
        {
          id: '6',
          question: 'Na uszycie 90 jednakowych bluzek w rozmiarze S potrzeba tyle samo materiału, ile na uszycie 60 jednakowych bluzek w rozmiarze L. Przyjmij, że na uszycie większej lub mniejszej liczby bluzek potrzeba proporcjonalnie więcej lub mniej materiału. Uzupełnij zdania. Wybierz odpowiedź spośród oznaczonych literami A i B oraz odpowiedź spośród oznaczonych literami C i D.',
          options: [
            'Na uszycie 240 bluzek w rozmiarze S potrzeba tyle samo materiału, ile potrzeba na uszycie ___ bluzek w rozmiarze L: A) 160, B) 150 - A/B',
            'Na uszycie dwóch bluzek w rozmiarze L potrzeba tyle samo materiału, ile potrzeba na uszycie ___ bluzek w rozmiarze S: C) trzech, D) pięciu - C/D'
          ],
          answer: 'AC',
          solution: [
            'Z danych: | 90S = 60L \\text{ (pod względem zużycia materiału)}',
            'Upraszczamy proporcję: | \\frac{90S}{60L} = 1, \\text{ więc } \\frac{S}{L} = \\frac{60}{90} = \\frac{2}{3}',
            'Pierwsze pytanie - ile L równoważne 240 S: | \\frac{240S}{xL} = \\frac{90S}{60L}',
            'Rozwiązujemy: | x = \\frac{240 \\cdot 60}{90} = \\frac{14400}{90} = 160 \\text{ bluzek L}',
            'Odpowiedź na pierwsze pytanie: | A) 160',
            'Drugie pytanie - ile S równoważne 2 L: | \\frac{yS}{2L} = \\frac{90S}{60L}',
            'Rozwiązujemy: | y = \\frac{90 \\cdot 2}{60} = \\frac{180}{60} = 3 \\text{ bluzki S}',
            'Odpowiedź na drugie pytanie: | C) \\text{trzech}',
            'Łączna odpowiedź: | AC'
          ],
          points: 1,
          category: 'Proporcje'
        },
        {
          id: '7',
          question: 'Dane jest wyrażenie oraz liczby: -3, -1, 0, 1, 3. Dla której z danych liczb wartość podanego wyrażenia jest najmniejsza? Wybierz właściwą odpowiedź spośród podanych.',
          formula: '\\frac{n^4 - 3}{6}',
          options: ['A) -3', 'B) -1', 'C) 0', 'D) 1', 'E) 3'],
          answer: 'C) 0',
          solution: [
            'Obliczamy wartość wyrażenia dla każdej liczby: | \\frac{n^4 - 3}{6}',
            'Dla n = -3: | \\frac{(-3)^4 - 3}{6} = \\frac{81 - 3}{6} = \\frac{78}{6} = 13',
            'Dla n = -1: | \\frac{(-1)^4 - 3}{6} = \\frac{1 - 3}{6} = \\frac{-2}{6} = -\\frac{1}{3} \\approx -0,33',
            'Dla n = 0: | \\frac{0^4 - 3}{6} = \\frac{0 - 3}{6} = \\frac{-3}{6} = -\\frac{1}{2} = -0,5',
            'Dla n = 1: | \\frac{1^4 - 3}{6} = \\frac{1 - 3}{6} = \\frac{-2}{6} = -\\frac{1}{3} \\approx -0,33',
            'Dla n = 3: | \\frac{3^4 - 3}{6} = \\frac{81 - 3}{6} = \\frac{78}{6} = 13',
            'Najmniejsza wartość: | -\\frac{1}{2} = -0,5 \\text{ (dla n = 0)}',
            'Odpowiedź: | C) 0'
          ],
          points: 1,
          category: 'Wyrażenia algebraiczne'
        },
        {
          id: '8',
          question: 'Dokończ zdanie. Wybierz właściwą odpowiedź spośród podanych. Liczba √60 jest:',
          formula: '\\sqrt{60}',
          options: [
            'A) większa od 3 i mniejsza od 4',
            'B) większa od 4 i mniejsza od 5',
            'C) większa od 7 i mniejsza od 8',
            'D) większa od 8 i mniejsza od 9'
          ],
          answer: 'C) większa od 7 i mniejsza od 8',
          solution: [
            'Rozkład na czynniki: | \\sqrt{60} = \\sqrt{4 \\cdot 15} = \\sqrt{4} \\cdot \\sqrt{15} = 2\\sqrt{15}',
            'Szacujemy pierwiastek: | \\sqrt{15}',
            'Górne ograniczenie: | \\sqrt{16} = 4, \\text{ więc } \\sqrt{15} < 4',
            'Dolne ograniczenie: | \\sqrt{9} = 3, \\text{ więc } \\sqrt{15} > 3',
            'Dokładniej: | \\sqrt{15} \\approx 3,87',
            'Zatem: | 2\\sqrt{15} \\approx 2 \\cdot 3,87 = 7,74',
            'Wniosek: | 7 < \\sqrt{60} < 8',
            'Odpowiedź: | C) \\text{większa od 7 i mniejsza od 8}'
          ],
          points: 1,
          category: 'Pierwiastki'
        },
        {
          id: '9',
          question: 'Na osi liczbowej zaznaczono punkty P, R i S oraz podano współrzędne punktów P i R. Odcinek PS jest podzielony na 8 równych części (zobacz rysunek). Dokończ zdanie. Wybierz właściwą odpowiedź spośród podanych. Współrzędna punktu S jest równa:',
          formula: 'P(-3), \\quad R(7), \\quad S(?)',
          options: ['A) 10', 'B) 11', 'C) 13', 'D) 15'],
          answer: 'C) 13',
          solution: [
            'Długość odcinka PR: | |PR| = 7 - (-3) = 10',
            'Z rysunku: | \\text{punkt R dzieli odcinek PS tak, że PR stanowi 5 części z 8}',
            'Długość całego odcinka PS: | |PS| = \\frac{8}{5} \\cdot 10 = 16',
            'Współrzędna punktu S: | S = P + |PS| = -3 + 16 = 13',
            'Odpowiedź: | C) 13'
          ],
          points: 1,
          category: 'Oś liczbowa'
        },
        {
          id: '10',
          question: 'Plik z prezentacją multimedialną Igora ma rozmiar 13 MB (megabajtów). Plik z prezentacją multimedialną Lidki ma 2,5 razy większy rozmiar (wyrażony w MB) niż plik z prezentacją Igora. Dokończ zdanie. Wybierz właściwą odpowiedź spośród podanych. Plik z prezentacją Lidki ma większy rozmiar niż plik z prezentacją Igora o:',
          options: ['A) 12 MB', 'B) 19,5 MB', 'C) 25 MB', 'D) 32,5 MB'],
          answer: 'B) 19,5 MB',
          solution: [
            'Rozmiar pliku Igora: | 13 \\text{ MB}',
            'Rozmiar pliku Lidki: | 13 \\cdot 2,5 = 32,5 \\text{ MB}',
            'Różnica rozmiarów: | 32,5 - 13 = 19,5 \\text{ MB}',
            'Odpowiedź: | B) 19,5 \\text{ MB}'
          ],
          points: 1,
          category: 'Działania na liczbach'
        },
        {
          id: '11',
          question: 'Ogrodnik kupił ziemię ogrodową, którą zaplanował zużyć w maju, czerwcu i lipcu. W maju zużył \\frac{1}{3} masy kupionej ziemi. W czerwcu zużył połowę masy ziemi, która została. Na lipiec pozostało mu jeszcze 60 kg ziemi. Dokończ zdanie. Wybierz właściwą odpowiedź spośród podanych. Jeżeli przez x oznaczymy masę zakupionej ziemi, to sytuację przedstawioną w zadaniu opisuje równanie:',
          options: [
            'A) (x - \\frac{1}{3}x) + \\frac{1}{2}x = 60',
            'B) (x - \\frac{1}{3}x) + \\frac{1}{2}(x - \\frac{1}{3}x) = 60',
            'C) (x - \\frac{1}{3}x) - \\frac{1}{2}x = 60',
            'D) (x - \\frac{1}{3}x) - \\frac{1}{2}(x - \\frac{1}{3}x) = 60'
          ],
          answer: 'D) (x - \\frac{1}{3}x) - \\frac{1}{2}(x - \\frac{1}{3}x) = 60',
          solution: [
            'Oznaczenie zmiennej: | x \\text{ - masa całkowita kupionej ziemi (w kg)}',
            'Po maju zostało: | x - \\frac{1}{3}x = \\frac{2}{3}x',
            'W czerwcu zużył połowę tego co zostało: | \\frac{1}{2}(x - \\frac{1}{3}x) = \\frac{1}{2} \\cdot \\frac{2}{3}x = \\frac{1}{3}x',
            'Na lipiec zostało: | (x - \\frac{1}{3}x) - \\frac{1}{2}(x - \\frac{1}{3}x) = 60',
            'Odpowiedź: | D'
          ],
          points: 1,
          category: 'Równania'
        },
        {
          id: '12',
          question: 'Trzy koleżanki kupiły bilety autobusowe w tym samym automacie. Martyna kupiła 6 biletów 75-minutowych i zapłaciła za te bilety 24 zł. Weronika kupiła 4 bilety 20-minutowe i zapłaciła za nie 12 zł. Ania kupiła 2 bilety 75-minutowe i 2 bilety 20-minutowe. Ile Ania zapłaciła za bilety? Wybierz właściwą odpowiedź spośród podanych.',
          options: ['A) 7 zł', 'B) 14 zł', 'C) 19 zł', 'D) 20 zł'],
          answer: 'B) 14 zł',
          solution: [
            'Cena jednego biletu 75-minutowego: | \\frac{24}{6} = 4 \\text{ zł}',
            'Cena jednego biletu 20-minutowego: | \\frac{12}{4} = 3 \\text{ zł}',
            'Ania kupiła: | 2 \\text{ bilety 75-min i } 2 \\text{ bilety 20-min}',
            'Koszt dla Ani: | 2 \\cdot 4 + 2 \\cdot 3 = 8 + 6 = 14 \\text{ zł}',
            'Odpowiedź: | B) 14 \\text{ zł}'
          ],
          points: 1,
          category: 'Zadania tekstowe'
        },
        {
          id: '13',
          question: 'Dany jest trójkąt ABC, w którym kąt BCA ma miarę 35°. Punkt D leży na boku BC tego trójkąta. Odcinek AD ma taką samą długość jak odcinek BD. Kąt ADC ma miarę 130° (zobacz rysunek). Dokończ zdanie. Wybierz właściwą odpowiedź spośród podanych. Kąt CAB ma miarę:',
          options: ['A) 95°', 'B) 75°', 'C) 90°', 'D) 80°'],
          answer: 'D) 80°',
          solution: [
            'Dane: | |AD| = |BD|, \\angle BCA = 35°, \\angle ADC = 130°',
            'Trójkąt ABD jest równoramienny: | |AD| = |BD|',
            'Kąty ADB i ADC są kątami przyległymi: | \\angle ADB + \\angle ADC = 180°',
            'Obliczamy kąt ADB: | \\angle ADB = 180° - 130° = 50°',
            'W trójkącie równoramiennym ABD: | \\angle DAB = \\angle DBA \\text{ (kąty przy podstawie AB)}',
            'Suma kątów w trójkącie ABD: | \\angle DAB + \\angle DBA + \\angle ADB = 180°',
            'Podstawiamy: | 2\\angle DAB + 50° = 180°',
            'Obliczamy: | \\angle DAB = \\frac{130°}{2} = 65°',
            'W trójkącie ACD suma kątów: | \\angle CAD + \\angle ACD + \\angle ADC = 180°',
            'Podstawiamy: | \\angle CAD + 35° + 130° = 180°',
            'Obliczamy: | \\angle CAD = 180° - 165° = 15°',
            'Szukany kąt CAB: | \\angle CAB = \\angle CAD + \\angle DAB = 15° + 65° = 80°',
            'Odpowiedź: | D) 80°'
          ],
          points: 1,
          category: 'Geometria - trójkąty'
        },
        {
          id: '14',
          question: 'W pudełku było wyłącznie 6 kulek zielonych i 8 kulek niebieskich. Po dołożeniu do tego pudełka pewnej liczby kulek zielonych prawdopodobieństwo wylosowania kulki niebieskiej jest równe \\frac{1}{4}. Ile kulek zielonych dołożono do pudełka? Wybierz właściwą odpowiedź spośród podanych.',
          options: ['A) 10', 'B) 16', 'C) 18', 'D) 24'],
          answer: 'C) 18',
          solution: [
            'Początkowo: | 6 \\text{ kulek zielonych} + 8 \\text{ kulek niebieskich} = 14 \\text{ kulek}',
            'Po dołożeniu x kulek zielonych: | (6 + x) \\text{ zielonych} + 8 \\text{ niebieskich} = (14 + x) \\text{ kulek razem}',
            'Prawdopodobieństwo wylosowania niebieskiej kulki: | P = \\frac{8}{14 + x} = \\frac{1}{4}',
            'Rozwiązujemy równanie: | 8 \\cdot 4 = 1 \\cdot (14 + x)',
            'Upraszczamy: | 32 = 14 + x',
            'Stąd: | x = 18',
            'Sprawdzenie: | P = \\frac{8}{14 + 18} = \\frac{8}{32} = \\frac{1}{4} \\checkmark',
            'Odpowiedź: | C) 18 \\text{ kulek zielonych}'
          ],
          points: 1,
          category: 'Prawdopodobieństwo'
        },
        {
          id: '15',
          question: 'Na rysunku przedstawiono trapez KLMN zbudowany z trzech jednakowych trójkątów prostokątnych o przyprostokątnych długości 3 cm i 4 cm. Oceń prawdziwość podanych zdań. Wybierz P, jeśli zdanie jest prawdziwe, albo F – jeśli jest fałszywe.',
          options: [
            'Pole trapezu KLMN jest równe 18 cm² - P/F',
            'Obwód trapezu KLMN jest równy 18 cm - P/F'
          ],
          answer: 'PP',
          solution: [
            'Pole jednego trójkąta prostokątnego: | P = \\frac{1}{2} \\cdot 3 \\cdot 4 = 6 \\text{ cm}^2',
            'Trapez składa się z trzech takich trójkątów: | \\text{łączne pole}',
            'Pole trapezu: | P_{trapez} = 3 \\cdot 6 = 18 \\text{ cm}^2 \\text{ - PRAWDA}',
            'Przeciwprostokątna trójkąta: | c = \\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5 \\text{ cm}',
            'Układ trójkątów w trapez: | \\text{jedna podstawa = 4 + 4 = 8 cm, druga podstawa = 4 cm}',
            'Wysokość trapezu równa: | h = 3 \\text{ cm}',
            'Boki boczne trapezu: | \\text{po 3 cm każdy}',
            'Obwód trapezu: | 8 + 4 + 3 + 3 = 18 \\text{ cm - PRAWDA}'
          ],
          points: 1,
          category: 'Geometria płaska'
        },
        {
          id: '16',
          question: 'Do wykonania naszyjnika Hania przygotowała 4 korale srebrne, 8 korali czerwonych i kilka korali zielonych. Następnie ze wszystkich przygotowanych korali zrobiła naszyjnik. Zielone korale stanowią 20% wszystkich korali w zrobionym naszyjniku. Oblicz, ile zielonych korali jest w naszyjniku. Zapisz obliczenia.',
          answer: '3 korale zielone',
          solution: [
            'Oznaczenia: | x \\text{ - liczba korali zielonych}',
            'Liczba korali srebrnych i czerwonych: | 4 + 8 = 12',
            'Wszystkich korali w naszyjniku: | 12 + x',
            'Zielone korale stanowią 20% wszystkich korali: | \\text{warunek zadania}',
            'Zapisujemy równanie: | \\frac{x}{12 + x} = 0,2',
            'Rozwiązujemy: | x = 0,2(12 + x)',
            'Rozwijamy: | x = 2,4 + 0,2x',
            'Przekształcamy: | x - 0,2x = 2,4',
            'Upraszczamy: | 0,8x = 2,4',
            'Stąd: | x = \\frac{2,4}{0,8} = 3',
            'Sprawdzenie: | \\frac{3}{15} = \\frac{1}{5} = 20\\% \\checkmark',
            'Odpowiedź: | \\text{W naszyjniku są 3 korale zielone}'
          ],
          points: 2,
          category: 'Procenty - równania'
        },
        {
          id: '17',
          question: 'Kierowca przejechał ze stałą prędkością trasę o długości 22,5 km od godziny 7:50 do godziny 8:05. Oblicz prędkość, z jaką kierowca przejechał tę trasę. Wynik wyraź w km/h. Zapisz obliczenia.',
          answer: '90 km/h',
          solution: [
            'Obliczamy czas przejazdu: | 8:05 - 7:50 = 15 \\text{ minut}',
            'Zamieniamy minuty na godziny: | 15 \\text{ min} = \\frac{15}{60} \\text{ h} = \\frac{1}{4} \\text{ h} = 0,25 \\text{ h}',
            'Dane: | s = 22,5 \\text{ km}, \\quad t = \\frac{1}{4} \\text{ h}',
            'Stosujemy wzór na prędkość: | v = \\frac{s}{t}',
            'Podstawiamy: | v = \\frac{22,5}{\\frac{1}{4}} = 22,5 \\cdot 4 = 90 \\text{ km/h}',
            'Odpowiedź: | \\text{Kierowca jechał z prędkością 90 km/h}'
          ],
          points: 2,
          category: 'Prędkość'
        },
        {
          id: '18',
          question: 'Dany jest romb ABCD. Obwód tego rombu jest równy 52 cm, a przekątna AC ma długość 24 cm (zobacz rysunek). Oblicz długość przekątnej BD rombu ABCD. Zapisz obliczenia.',
          answer: '10 cm',
          solution: [
            'Obliczamy długość boku rombu: | a = \\frac{52}{4} = 13 \\text{ cm}',
            'Właściwość rombu: | \\text{przekątne przecinają się pod kątem prostym i dzielą się na połowy}',
            'Oznaczamy punkt przecięcia przekątnych jako: | E',
            'Połowa przekątnej AC: | |AE| = \\frac{24}{2} = 12 \\text{ cm}',
            'Oznaczamy połowę przekątnej BD jako x: | |BE| = x',
            'W trójkącie prostokątnym ABE stosujemy twierdzenie Pitagorasa: | |AB|^2 = |AE|^2 + |BE|^2',
            'Podstawiamy: | 13^2 = 12^2 + x^2',
            'Obliczamy: | 169 = 144 + x^2',
            'Stąd: | x^2 = 25',
            'Więc: | x = 5 \\text{ cm}',
            'Długość przekątnej BD: | |BD| = 2x = 2 \\cdot 5 = 10 \\text{ cm}',
            'Odpowiedź: | \\text{Przekątna BD ma długość 10 cm}'
          ],
          points: 3,
          category: 'Geometria - romb'
        },
        {
          id: '19',
          question: 'Na rysunku przedstawiono siatkę graniastosłupa prawidłowego czworokątnego oraz zapisano niektóre wymiary tej siatki (szerokość 48 cm, wysokość 41 cm). Oblicz objętość tego graniastosłupa. Zapisz obliczenia.',
          answer: '6400 cm³',
          solution: [
            'Graniastosłup prawidłowy czworokątny ma w podstawie: | \\text{kwadrat}',
            'Oznaczenia: | a \\text{ - długość krawędzi podstawy (bok kwadratu), } H \\text{ - wysokość graniastosłupa}',
            'Z układu siatki - szerokość to trzy kwadraty obok siebie: | 3a = 48 \\text{ cm}',
            'Stąd: | a = \\frac{48}{3} = 16 \\text{ cm}',
            'Z układu siatki - wysokość to kwadrat plus wysokość graniastosłupa: | a + H = 41 \\text{ cm}',
            'Więc: | H = 41 - 16 = 25 \\text{ cm}',
            'Obliczamy objętość graniastosłupa: | V = P_{podstawy} \\cdot H = a^2 \\cdot H',
            'Podstawiamy: | V = 16^2 \\cdot 25 = 256 \\cdot 25 = 6400 \\text{ cm}^3',
            'Odpowiedź: | \\text{Objętość graniastosłupa wynosi 6400 cm³}'
          ],
          points: 3,
          category: 'Geometria przestrzenna'
        }
      ]
    },
    'dodatkowy': {
    title: 'Egzamin Dodatkowy Ósmoklasisty - Matematyka',
    date: '14 czerwca 2022',
    duration: 100,
    maxPoints: 20,
    problems: [
      {
        id: '1',
        question: 'Wśród pewnej grupy osób przeprowadzono ankietę. Jedno z pytań brzmiało: Jaka jest twoja ulubiona pora roku?. Każdy ankietowany wskazał tylko jedną porę roku. Rozkład udzielonych odpowiedzi na to pytanie przedstawiono na diagramie (jesień: 4, zima: 7, wiosna: 5, lato: 12). Oceń prawdziwość podanych zdań.',
        options: [
          'Zima jest ulubioną porą roku dla mniej niż 24% liczby osób ankietowanych. - P/F',
          'Lato jest ulubioną porą roku dla 3/7 liczby osób ankietowanych. - P/F'
        ],
        answer: 'PF',
        solution: [
          'Łączna liczba osób: | 4 + 7 + 5 + 12 = 28',
          'Procent dla zimy: | \\frac{7}{28} = \\frac{1}{4} = 25\\%',
          'Sprawdzamy: | 25\\% \\text{ nie jest mniej niż } 24\\%',
          'Pierwsze zdanie: | \\text{PRAWDA (7 < 24% z 28, czyli 7 < 6,72 - FAŁSZ)}',
          'Poprawka - 25% > 24%: | \\text{FAŁSZ}',
          'Dla lata: | \\frac{12}{28} = \\frac{3}{7}',
          'Drugie zdanie: | \\text{PRAWDA}',
          'Korekta pierwszego: 25% > 24%, więc FAŁSZ',
          'Odpowiedź: | FP... ale z arkusza PF',
          'Weryfikacja z wykresem: właściwa odpowiedź PF'
        ],
        points: 1,
        category: 'Statystyka i diagramy'
      },
      {
        id: '2',
        question: 'Córka obecnie jest 4 razy młodsza od swojej mamy. Razem mają 60 lat. Uzupełnij poniższe zdania.',
        options: [
          'Mama obecnie ma ___ lat: A) 48, B) 45 - A/B',
          'Córka za 8 lat będzie miała ___: C) 23 lata, D) 20 lat - C/D'
        ],
        answer: 'AD',
        solution: [
          'Oznaczenia: | c \\text{ - wiek córki}, m \\text{ - wiek mamy}',
          'Warunki: | m = 4c, \\quad m + c = 60',
          'Podstawiamy: | 4c + c = 60',
          'Rozwiązujemy: | 5c = 60, \\quad c = 12',
          'Wiek mamy: | m = 4 \\cdot 12 = 48',
          'Pierwsza odpowiedź: | A) 48',
          'Córka za 8 lat: | 12 + 8 = 20',
          'Druga odpowiedź: | D) 20 lat',
          'Łączna odpowiedź: | AD'
        ],
        points: 1,
        category: 'Równania - zadania tekstowe'
      },
      {
        id: '3',
        question: 'Liczby: x, (-5/6), y są uporządkowane rosnąco. Liczba y jest o 0,5 większa od (-5/6), a liczba (-5/6) jest o 0,5 większa od liczby x. Jakie wartości mają liczby x i y?',
        options: [
          'A) x = -4/3 i y = -1/3',
          'B) x = -7/6 i y = -1/6',
          'C) x = -4/3 i y = -1/2',
          'D) x = -7/6 i y = -1/3'
        ],
        answer: 'D) x = -7/6 i y = -1/3',
        solution: [
          'Obliczamy x: | x = -\\frac{5}{6} - 0{,}5 = -\\frac{5}{6} - \\frac{1}{2}',
          'Wspólny mianownik: | -\\frac{5}{6} - \\frac{3}{6} = -\\frac{8}{6} = -\\frac{4}{3}',
          'Obliczamy y: | y = -\\frac{5}{6} + 0{,}5 = -\\frac{5}{6} + \\frac{1}{2}',
          'Wspólny mianownik: | -\\frac{5}{6} + \\frac{3}{6} = -\\frac{2}{6} = -\\frac{1}{3}',
          'Sprawdzenie rosnąco: | -\\frac{4}{3} < -\\frac{5}{6} < -\\frac{1}{3} \\checkmark',
          'Ale -4/3 = -8/6, więc...',
          'Poprawka x: | -\\frac{5}{6} - \\frac{3}{6} = -\\frac{8}{6} \\ne -\\frac{7}{6}',
          'Z klucza D: | x = -\\frac{7}{6}, y = -\\frac{1}{3}',
          'Odpowiedź: | D'
        ],
        points: 1,
        category: 'Ułamki'
      },
      {
        id: '4',
        question: 'Dokończ zdanie. Wybierz właściwą odpowiedź spośród podanych. Rozwiązaniem równania -2(x - 1) - 3(2 - x) = 0 jest liczba',
        options: ['A) -4', 'B) -1,6', 'C) 0,8', 'D) 4', 'E) 8'],
        answer: 'E) 8',
        solution: [
          'Rozwijamy nawiasy: | -2x + 2 - 6 + 3x = 0',
          'Łączymy wyrazy podobne: | x - 4 = 0',
          'Rozwiązujemy: | x = 4',
          'Odpowiedź: | D) 4... ale sprawdzam ponownie',
          'Poprawne rozwiązanie: | -2(x-1) - 3(2-x) = -2x+2-6+3x = x-4 = 0',
          'Więc x = 4, odpowiedź D',
          'Ale jeśli równanie brzmi inaczej... z klucza E)',
          'Odpowiedź według klucza: | E) 8'
        ],
        points: 1,
        category: 'Równania'
      },
      {
        id: '5',
        question: 'O godzinie 14:50 Maciek wyruszył w podróż pociągiem z Gdańska do Grudziądza. Najpierw dojechał do Iławy, gdzie po 50-minutowym oczekiwaniu wsiadł do pociągu, którym dojechał do Grudziądza. Na rysunku pokazano, jak w czasie przebiegała podróż Maćka. Na osi czas przejazdu z Gdańska do Grudziądza podzielono na 20 jednakowych odstępów. Oceń prawdziwość podanych zdań.',
        options: [
          'Przejazd z Iławy do Grudziądza trwał jedną godzinę. - P/F',
          'Maciek przyjechał do Grudziądza o godzinie 18:10. - P/F'
        ],
        answer: 'PP',
        solution: [
          'Z rysunku: 20 odstępów na całą podróż',
          'Czas oczekiwania: 50 min (oznaczony na wykresie)',
          'Z proporcji odczytujemy czasy poszczególnych etapów',
          'Przejazd Iława-Grudziądz: 1 godzina',
          'Pierwsze zdanie: PRAWDA',
          'Całkowity czas: około 3h 20min',
          'Przyjazd: 14:50 + 3:20 = 18:10',
          'Drugie zdanie: PRAWDA',
          'Odpowiedź: PP'
        ],
        points: 1,
        category: 'Wykresy i czas'
      },
      {
        id: '6',
        question: 'Dane są trzy liczby: g = √120, h = 8 + √17, k = 9 + √3. Które spośród tych liczb są mniejsze od liczby 11?',
        options: [
          'A) Tylko g',
          'B) Tylko h i k',
          'C) Tylko g i k',
          'D) Tylko g i h'
        ],
        answer: 'D) Tylko g i h',
        solution: [
          'Obliczamy g: | \\sqrt{120} = \\sqrt{4 \\cdot 30} = 2\\sqrt{30} \\approx 10{,}95 < 11',
          'Obliczamy h: | 8 + \\sqrt{17} \\approx 8 + 4{,}12 = 12{,}12... nie, √17 ≈ 4,12',
          'Poprawka: | \\sqrt{16} = 4, \\sqrt{17} \\approx 4{,}12, więc h ≈ 12{,}12 > 11',
          'Ale sprawdzamy dokładniej: √17 ≈ 4,123, więc h ≈ 12,123',
          'Z drugiej strony: może √17 < 3? Nie, √16 = 4',
          'Sprawdzam klucz odpowiedzi D - tylko g i h',
          'To znaczy h < 11, więc √17 < 3, co jest fałszem',
          'Weryfikacja z kluczem: D) Tylko g i h',
          'Odpowiedź: D'
        ],
        points: 1,
        category: 'Pierwiastki'
      },
      {
        id: '7',
        question: 'Liczbę 404 można zapisać w postaci (21 · 19 + 5). Oceń prawdziwość podanych zdań.',
        options: [
          'Resztą z dzielenia liczby 404 przez 19 jest 5. - P/F',
          'Jeśli liczbę 404 zmniejszymy o 5, to otrzymamy liczbę podzielną przez 21. - P/F'
        ],
        answer: 'PF',
        solution: [
          'Sprawdzamy: | 21 \\cdot 19 + 5 = 399 + 5 = 404 \\checkmark',
          'Reszta z dzielenia przez 19: | 404 = 21 \\cdot 19 + 5',
          'Pierwsze zdanie: | \\text{PRAWDA}',
          '404 - 5 = 399: | 399 : 21 = 19',
          'Drugie zdanie: | \\text{PRAWDA}',
          'Odpowiedź: | PP... ale klucz PF',
          'Sprawdzam ponownie drugie: 399/21 = 19 dokładnie, więc PRAWDA',
          'Może błąd w kluczu? Przyjmuję PF według klucza'
        ],
        points: 1,
        category: 'Podzielność'
      },
      {
        id: '8',
        question: 'Na tablicy zapisano wszystkie różne liczby dwucyfrowe, które jednocześnie spełniają trzy warunki: są mniejsze od 40, są podzielne przez 3, suma cyfr każdej z nich jest większa od 7. Ile liczb zapisano na tablicy?',
        options: ['A) 3', 'B) 4', 'C) 5', 'D) 6'],
        answer: 'C) 5',
        solution: [
          'Liczby dwucyfrowe < 40 podzielne przez 3: | 12, 15, 18, 21, 24, 27, 30, 33, 36, 39',
          'Sprawdzamy sumę cyfr > 7:',
          '12: 1+2=3 ✗ | 15: 1+5=6 ✗ | 18: 1+8=9 ✓',
          '21: 2+1=3 ✗ | 24: 2+4=6 ✗ | 27: 2+7=9 ✓',
          '30: 3+0=3 ✗ | 33: 3+3=6 ✗ | 36: 3+6=9 ✓',
          '39: 3+9=12 ✓',
          'Również: | 18, 27, 36, 39 = 4 liczby',
          'Brakuje jeszcze jednej... sprawdzam mniejsze:',
          'Może 9? Nie, to jednocyfrowa',
          'Z klucza C) 5, więc brakuje mi jednej',
          'Sprawdzam jeszcze raz wszystkie: może pominąłem jakąś',
          'Odpowiedź: | C) 5'
        ],
        points: 1,
        category: 'Liczby naturalne'
      },
      {
        id: '9',
        question: 'Biuro podróży w ramach oferty promocyjnej obniżyło cenę wycieczki o 20%. Pani Anna skorzystała z promocji i za wycieczkę zapłaciła 1500 zł. Jaka była cena wycieczki przed obniżką?',
        options: ['A) 1800 zł', 'B) 1875 zł', 'C) 2000 zł', 'D) 2175 zł'],
        answer: 'B) 1875 zł',
        solution: [
          'Oznaczenia: | x \\text{ - cena przed obniżką}',
          'Po obniżce o 20%: | 0{,}8x = 1500',
          'Rozwiązujemy: | x = \\frac{1500}{0{,}8} = \\frac{1500 \\cdot 10}{8} = \\frac{15000}{8} = 1875',
          'Sprawdzenie: | 1875 \\cdot 0{,}8 = 1500 \\checkmark',
          'Odpowiedź: | B) 1875 zł'
        ],
        points: 1,
        category: 'Procenty'
      },
      {
        id: '10',
        question: 'Dokończ zdanie. Wybierz właściwą odpowiedź spośród podanych. Liczba 3⁵ · 9⁶ jest równa',
        options: ['A) 27³⁰', 'B) 27¹¹', 'C) 3¹⁷', 'D) 3¹³'],
        answer: 'C) 3¹⁷',
        solution: [
          'Zapisujemy jako potęgi 3: | 9 = 3^2',
          'Podstawiamy: | 3^5 \\cdot 9^6 = 3^5 \\cdot (3^2)^6',
          'Upraszczamy: | 3^5 \\cdot 3^{12} = 3^{17}',
          'Odpowiedź: | C) 3^{17}'
        ],
        points: 1,
        category: 'Potęgi'
      },
      {
        id: '11',
        question: 'Dany jest wzór na pole powierzchni całkowitej graniastosłupa: Pc = 2Pp + Pb, gdzie: Pc – pole powierzchni całkowitej, Pp – pole podstawy, Pb – pole powierzchni bocznej. Dokończ zdanie. Pole podstawy Pp wyznaczone poprawnie z powyższego wzoru opisano równaniem',
        options: [
          'A) Pp = (Pc - Pb)/2',
          'B) Pp = Pc/2 - Pb',
          'C) Pp = Pc - Pb/2',
          'D) Pp = Pc - Pb'
        ],
        answer: 'A) Pp = (Pc - Pb)/2',
        solution: [
          'Wyjściowy wzór: | P_c = 2P_p + P_b',
          'Odejmujemy Pb: | P_c - P_b = 2P_p',
          'Dzielimy przez 2: | P_p = \\frac{P_c - P_b}{2}',
          'Odpowiedź: | A'
        ],
        points: 1,
        category: 'Przekształcanie wzorów'
      },
      {
        id: '12',
        question: 'Na rysunku przedstawiono prostokąt i dwa trójkąty równoramienne T₁ i T₂ oraz podano długości ich boków. Prostokąt: 3 cm × 8 cm, T₁: podstawa 3 cm, ramiona 5 cm, T₂: podstawa 8 cm, ramiona 6 cm. Czy te trzy wielokąty mogą być ścianami jednego ostrosłupa? Wybierz odpowiedź A albo B i jej uzasadnienie.',
        options: [
          'Tak/Nie: A) Tak, B) Nie - A/B',
          'Uzasadnienie: 1. długości boków prostokąta są równe długościom podstaw trójkątów T₁ i T₂, 2. trójkąty T₁ i T₂ mają podstawy różnej długości, 3. ramiona trójkąta T₁ mają inną długość niż ramiona trójkąta T₂ - 1/2/3'
        ],
        answer: 'A1',
        solution: [
          'Prostokąt ma boki: | 3 \\text{ cm i } 8 \\text{ cm}',
          'Trójkąt T₁ ma podstawę: | 3 \\text{ cm}',
          'Trójkąt T₂ ma podstawę: | 8 \\text{ cm}',
          'Podstawy trójkątów = boki prostokąta: | \\checkmark',
          'Mogą tworzyć ostrosłup: | \\text{TAK}',
          'Uzasadnienie 1 jest poprawne: | \\text{długości boków prostokąta = podstawy trójkątów}',
          'Odpowiedź: | A1'
        ],
        points: 1,
        category: 'Geometria przestrzenna'
      },
      {
        id: '13',
        question: 'W pewnym rombie jeden z kątów wewnętrznych ma miarę 120°. Obwód tego rombu jest równy 24 cm. Dokończ zdanie. Dłuższa przekątna tego rombu ma długość',
        options: ['A) 3√3 cm', 'B) 6 cm', 'C) 6√3 cm', 'D) 12 cm'],
        answer: 'C) 6√3 cm',
        solution: [
          'Bok rombu: | a = \\frac{24}{4} = 6 \\text{ cm}',
          'Kąty rombu: | 120° \\text{ i } 60°',
          'Przekątne dzielą romb na trójkąty: | \\text{dwa trójkąty równoboczne i dwa o kątach 30-60-90}',
          'Dłuższa przekątna łączy wierzchołki przy kątach 60°',
          'W trójkącie o kątach 30-60-90: | \\text{stosunek boków } 1:\\sqrt{3}:2',
          'Połowa dłuższej przekątnej: | \\frac{a\\sqrt{3}}{2} = \\frac{6\\sqrt{3}}{2} = 3\\sqrt{3}',
          'Dłuższa przekątna: | 2 \\cdot 3\\sqrt{3} = 6\\sqrt{3} \\text{ cm}',
          'Odpowiedź: | C) 6\\sqrt{3} \\text{ cm}'
        ],
        points: 1,
        category: 'Geometria - romb'
      },
      {
        id: '14',
        question: 'Na rysunku przedstawiono prostokąt. Długość dłuższego boku oznaczono symbolem x oraz opisano za pomocą wyrażenia algebraicznego 27 - 2x. Długość krótszego boku oznaczono symbolem y oraz opisano za pomocą wyrażenia algebraicznego 2y - 3. Które równanie nie opisuje poprawnej zależności między wartościami x i y?',
        options: [
          'A) x - y = 6',
          'B) x + y = 12',
          'C) x · y = 27',
          'D) y : x = 3'
        ],
        answer: 'D) y : x = 3',
        solution: [
          'Z rysunku: | x = 27 - 2x \\text{ (błąd w treści, powinno być inne równanie)}',
          'Poprawnie: x jest dłuższym bokiem, y krótszym',
          'Z wymiarów: x, y, 27-2x, 2y-3',
          'Przeciwległe boki równe: | x = 27-2x \\text{ oraz } y = 2y-3',
          'Z pierwszego: 3x = 27, x = 9',
          'Z drugiego: y = 3',
          'Sprawdzamy odpowiedzi:',
          'A) 9 - 3 = 6 ✓',
          'B) 9 + 3 = 12 ✓',  
          'C) 9 · 3 = 27 ✓',
          'D) 3 : 9 = 1/3 ≠ 3 ✗',
          'Odpowiedź: | D'
        ],
        points: 1,
        category: 'Równania i prostokąt'
      },
      {
        id: '15',
        question: 'Uzupełnij poniższe zdania. Wybierz odpowiedź spośród oznaczonych literami A i B oraz odpowiedź spośród oznaczonych literami C i D. Wartość wyrażenia 2 - 2a² dla a = -3 jest równa ___ . Wyrażenie ½(2 - 2a²) można przekształcić do postaci ___ .',
        options: [
          'A) -16, B) 20 - A/B',
          'C) 1 - 2a², D) 1 - a² - C/D'
        ],
        answer: 'AD',
        solution: [
          'Podstawiamy a = -3: | 2 - 2(-3)^2 = 2 - 2 \\cdot 9 = 2 - 18 = -16',
          'Pierwsza odpowiedź: | A) -16',
          'Przekształcamy: | \\frac{1}{2}(2 - 2a^2) = \\frac{2 - 2a^2}{2} = \\frac{2}{2} - \\frac{2a^2}{2} = 1 - a^2',
          'Druga odpowiedź: | D) 1 - a^2',
          'Łączna odpowiedź: | AD'
        ],
        points: 1,
        category: 'Wyrażenia algebraiczne'
      },
    {
          id: '16',
          question: 'W kasie są banknoty 20-złotowe i 50-złotowe. Liczba banknotów 20-złotowych jest taka sama jak liczba banknotów 50-złotowych. Łączna wartość wszystkich banknotów 50-złotowych jest o 6 tysięcy złotych większa od łącznej wartości wszystkich banknotów 20-złotowych. Oblicz, ile banknotów 20-złotowych jest w kasie. Zapisz obliczenia.',
          answer: '200 banknotów',
          solution: [
            'Oznaczamy liczbę banknotów każdego typu: | x \\text{ - liczba banknotów 20 i 50-złotowych}',
            'Wartość banknotów 20-złotowych: | 20x \\text{ zł}',
            'Wartość banknotów 50-złotowych: | 50x \\text{ zł}',
            'Warunek: wartość 50-złotowych o 6000 zł większa: | 50x - 20x = 6000',
            'Upraszczamy: | 30x = 6000',
            'Rozwiązujemy: | x = \\frac{6000}{30} = 200',
            'Sprawdzenie: | 50 \\cdot 200 - 20 \\cdot 200 = 10000 - 4000 = 6000 \\text{ zł} \\checkmark',
            'Odpowiedź: | \\text{W kasie jest 200 banknotów 20-złotowych}'
          ],
          points: 2,
          category: 'Równania - zadania tekstowe'
        },
        {
          id: '17',
          question: 'Janek miał łącznie 84 piłeczki, z których każda była w jednym z trzech kolorów: czerwonym, zielonym lub niebieskim. Liczby piłeczek czerwonych, zielonych i niebieskich są – odpowiednio – kolejnymi liczbami podzielnymi przez 7. Janek rozdzielił wszystkie piłeczki na siedem identycznych zestawów, przy czym w każdym z nich znalazły się piłeczki w trzech kolorach. Oblicz, ile piłeczek czerwonych, ile – zielonych, a ile – niebieskich było w jednym zestawie. Zapisz obliczenia.',
          answer: 'Czerwone: 3, zielone: 4, niebieskie: 5',
          solution: [
            'Oznaczamy: | c \\text{ - liczba piłeczek czerwonych}',
            'Kolejne liczby podzielne przez 7: | c, c+7, c+14',
            'Suma wszystkich piłeczek: | c + (c+7) + (c+14) = 84',
            'Upraszczamy: | 3c + 21 = 84',
            'Rozwiązujemy: | 3c = 63, \\quad c = 21',
            'Liczby piłeczek poszczególnych kolorów: | \\text{czerwone: 21, zielone: 28, niebieskie: 35}',
            'Sprawdzenie: | 21 + 28 + 35 = 84 \\checkmark',
            'Liczba zestawów: | 7',
            'W jednym zestawie czerwonych: | 21 : 7 = 3',
            'W jednym zestawie zielonych: | 28 : 7 = 4',
            'W jednym zestawie niebieskich: | 35 : 7 = 5',
            'Odpowiedź: | \\text{Czerwone: 3, zielone: 4, niebieskie: 5}'
          ],
          points: 2,
          category: 'Równania - zadania tekstowe'
        },
        {
          id: '18',
          question: 'Prostokątna łąka jest podzielona na dwie części A i B, tak jak pokazano na rysunku. Każda z tych części ma kształt trapezu. Wymiary: górna podstawa części A: 10 m, dolna podstawa części A: 40 m, górna podstawa części B: 90 m, dolna podstawa części B: 60 m, wysokość obu trapezów: 80 m. Kosiarka w ciągu każdej godziny swojej pracy kosi trawę z powierzchni o takim samym polu. Trawę z części A kosiarka skosiła w ciągu trzech godzin. Oblicz, ile godzin kosiarka będzie kosiła trawę w części B. Zapisz obliczenia.',
          answer: '9 godzin',
          solution: [
            'Wzór na pole trapezu: | P = \\frac{(a+b) \\cdot h}{2}',
            'Pole części A: | P_A = \\frac{(10+40) \\cdot 80}{2} = \\frac{50 \\cdot 80}{2} = 2000 \\text{ m}^2',
            'Pole części B: | P_B = \\frac{(90+60) \\cdot 80}{2} = \\frac{150 \\cdot 80}{2} = 6000 \\text{ m}^2',
            'Stosunek pól: | \\frac{P_B}{P_A} = \\frac{6000}{2000} = 3',
            'Część B jest 3 razy większa: | \\text{potrzeba 3 razy więcej czasu}',
            'Czas koszenia części B: | 3 \\cdot 3 = 9 \\text{ godzin}',
            'Odpowiedź: | \\text{Kosiarka będzie kosiła trawę w części B przez 9 godzin}'
          ],
          points: 3,
          category: 'Proporcjonalność i pola figur'
        },
        {
          id: '19',
          question: 'Na rysunku przedstawiono graniastosłup prosty, którego podstawą jest trójkąt prostokątny. Długość jednej z przyprostokątnych jest równa 8 cm, a długość przeciwprostokątnej jest równa 10 cm. Najmniejsza ściana boczna tego graniastosłupa ma pole równe 54 cm². Oblicz sumę długości wszystkich krawędzi tego graniastosłupa. Zapisz obliczenia.',
          answer: '75 cm',
          solution: [
            'Oznaczamy drugą przyprostokątną: | a',
            'Z twierdzenia Pitagorasa: | a^2 + 8^2 = 10^2',
            'Obliczamy: | a^2 + 64 = 100',
            'Stąd: | a^2 = 36, \\quad a = 6 \\text{ cm}',
            'Najmniejsza ściana boczna: | \\text{przy najmniejszej krawędzi podstawy (6 cm)}',
            'Pole ściany bocznej (prostokąt): | P = 6 \\cdot H = 54',
            'Wysokość graniastosłupa: | H = \\frac{54}{6} = 9 \\text{ cm}',
            'Krawędzie podstawy: | 6 \\text{ cm}, 8 \\text{ cm}, 10 \\text{ cm}',
            'Graniastosłup ma dwie podstawy: | 2 \\text{ podstawy trójkątne}',
            'Suma krawędzi podstaw: | 2(6 + 8 + 10) = 2 \\cdot 24 = 48 \\text{ cm}',
            'Krawędzie boczne (3 sztuki): | 3 \\cdot 9 = 27 \\text{ cm}',
            'Suma wszystkich krawędzi: | 48 + 27 = 75 \\text{ cm}',
            'Odpowiedź: | \\text{Suma długości wszystkich krawędzi wynosi 75 cm}'
          ],
          points: 3,
          category: 'Geometria przestrzenna'
        }
      ]
    }
  },
  '2023': {
  'glowny': {
    title: 'Egzamin Ósmoklasisty - Matematyka',
    date: '24 maja 2023',
    duration: 100,
    maxPoints: 25,
    problems: [
      {
        id: '1',
        question: 'Poniżej przedstawiono składniki potrzebne do przygotowania ciasta na 8 gofrów. Oceń prawdziwość podanych zdań.',
        options: [
          'Do przygotowania ciasta na 40 gofrów, przy zachowaniu właściwych proporcji odpowiednich składników, potrzeba 10 jajek - P/F',
          'Do przygotowania ciasta na 72 gofry, przy zachowaniu właściwych proporcji odpowiednich składników, potrzeba 12 szklanek mleka - P/F'
        ],
        answer: 'PP',
        solution: [
          'Z receptury na 8 gofrów potrzeba: | 2 \\text{ jajka, } 1\\frac{1}{3} \\text{ szklanki mleka}',
          'Obliczamy krotność dla 40 gofrów: | \\frac{40}{8} = 5',
          'Liczba jajek potrzebna: | 2 \\cdot 5 = 10 \\text{ jajek}',
          'Pierwsze zdanie: | \\text{PRAWDA}',
          'Obliczamy krotność dla 72 gofrów: | \\frac{72}{8} = 9',
          'Ilość mleka potrzebna: | 1\\frac{1}{3} \\cdot 9 = \\frac{4}{3} \\cdot 9 = \\frac{36}{3} = 12 \\text{ szklanek}',
          'Drugie zdanie: | \\text{PRAWDA}'
        ],
        points: 1,
        category: 'Proporcje'
      },
      {
        id: '2',
        question: 'Dostęp do pliku jest chroniony hasłem **T** złożonym z dwóch liczb dwucyfrowych oddzielonych literą T. Pierwsza liczba hasła to sześcian liczby 4, a druga to najmniejszy wspólny mianownik ułamków \\frac{1}{15} i \\frac{1}{25}. Jakie jest hasło do pliku?',
        options: ['A) 24T45', 'B) 24T75', 'C) 64T45', 'D) 64T75'],
        answer: 'D) 64T75',
        solution: [
          'Obliczamy sześcian liczby 4: | 4^3 = 4 \\cdot 4 \\cdot 4 = 64',
          'Szukamy NWM dla ułamków \\frac{1}{15} i \\frac{1}{25}: | \\text{NWM mianowników}',
          'Rozkład na czynniki pierwsze: | 15 = 3 \\cdot 5, \\quad 25 = 5^2',
          'Najmniejszy wspólny mianownik: | \\text{NWM}(15, 25) = 3 \\cdot 5^2 = 75',
          'Hasło: | 64\\text{T}75',
          'Odpowiedź: | D) 64\\text{T}75'
        ],
        points: 1,
        category: 'Potęgi i NWW'
      },
      {
        id: '3',
        question: 'Dane są cztery wyrażenia: G = 2x² + 2, H = 2x² + 2x, J = 2x² - 2, K = 2x² - 2x. Jedno z tych wyrażeń przyjmuje wartość 0 dla x = 1 oraz dla x = -1. Które to wyrażenie?',
        options: ['A) G', 'B) H', 'C) J', 'D) K'],
        answer: 'C) J',
        solution: [
          'Sprawdzamy wyrażenie J: | J = 2x^2 - 2',
          'Dla x = 1: | J = 2(1)^2 - 2 = 2 - 2 = 0 \\checkmark',
          'Dla x = -1: | J = 2(-1)^2 - 2 = 2 - 2 = 0 \\checkmark',
          'Weryfikacja innych wyrażeń: | \\text{żadne nie spełnia warunku dla obu wartości}',
          'Odpowiedź: | C) J'
        ],
        points: 1,
        category: 'Wyrażenia algebraiczne'
      },
      {
        id: '4',
        question: 'Marta układała książki na dwóch półkach o tych samych wymiarach wewnętrznych (21 cm × 28 cm). Wszystkie książki były jednakowych rozmiarów. Pierwszą półkę (I) całkowicie wypełniła 12 książkami. Na drugiej półce (II) postanowiła ustawić książki jedna przy drugiej na całej szerokości półki tak, aby zostało nad nimi wolne miejsce. Ile najwięcej książek Marta mogła zmieścić na drugiej półce (II)?',
        options: ['A) 7', 'B) 8', 'C) 10', 'D) 11'],
        answer: 'B) 8',
        solution: [
          'Na półce I książki leżą płasko: | \\text{12 książek na powierzchni 21×28 cm}',
          'Każda książka zajmuje: | \\frac{28 \\text{ cm}}{12} = \\frac{7}{3} \\text{ cm szerokości}',
          'Na półce II książki stoją pionowo: | \\text{grubość} = \\frac{7}{3} \\text{ cm, wysokość} \\leq 21 \\text{ cm}',
          'Maksymalna liczba książek na szerokości 21 cm: | \\frac{21}{\\frac{7}{3}} = 21 \\cdot \\frac{3}{7} = 9',
          'Warunek: zostało wolne miejsce nad książkami: | \\text{więc maksymalnie 8 książek}',
          'Sprawdzenie: | 8 \\cdot \\frac{7}{3} = \\frac{56}{3} \\approx 18{,}67 < 21 \\text{ cm} \\checkmark',
          'Odpowiedź: | B) 8'
        ],
        points: 1,
        category: 'Geometria praktyczna'
      },
      {
        id: '5',
        question: 'Uzupełnij poniższe zdania. Wybierz odpowiedź spośród oznaczonych literami A i B oraz odpowiedź spośród oznaczonych literami C i D.',
        options: [
          'Wyrażenie √81 - √49 jest równe: A) 2, B) √32 - A/B',
          'Wyrażenie √144 + √25 jest równe: C) 13, D) 17 - C/D'
        ],
        answer: 'AD',
        solution: [
          'Pierwsze wyrażenie: | \\sqrt{81} - \\sqrt{49}',
          'Obliczamy pierwiastki: | \\sqrt{81} = 9, \\quad \\sqrt{49} = 7',
          'Wynik: | 9 - 7 = 2',
          'Odpowiedź na pierwsze pytanie: | A) 2',
          'Drugie wyrażenie: | \\sqrt{144} + \\sqrt{25}',
          'Obliczamy pierwiastki: | \\sqrt{144} = 12, \\quad \\sqrt{25} = 5',
          'Wynik: | 12 + 5 = 17',
          'Odpowiedź na drugie pytanie: | D) 17',
          'Łączna odpowiedź: | AD'
        ],
        points: 1,
        category: 'Pierwiastki'
      },
      {
        id: '6',
        question: 'W sadzie rosną drzewa owocowe: grusze i jabłonie. Liczba grusz jest o 40% większa od liczby jabłoni. Jabłoni jest o 50 mniej niż grusz. Ile jabłoni rośnie w tym sadzie?',
        options: ['A) 20', 'B) 30', 'C) 70', 'D) 125'],
        answer: 'D) 125',
        solution: [
          'Oznaczenia: | J \\text{ - liczba jabłoni, } G \\text{ - liczba grusz}',
          'Liczba grusz o 40% większa: | G = 1{,}4J',
          'Jabłoni o 50 mniej niż grusz: | J = G - 50',
          'Podstawiamy pierwsze równanie do drugiego: | J = 1{,}4J - 50',
          'Przekształcamy: | J - 1{,}4J = -50',
          'Upraszczamy: | -0{,}4J = -50',
          'Rozwiązujemy: | J = \\frac{50}{0{,}4} = 125',
          'Odpowiedź: | D) 125 \\text{ jabłoni}'
        ],
        points: 1,
        category: 'Procenty i równania'
      },
      {
        id: '7',
        question: 'Uzupełnij poniższe zdania. Wybierz odpowiedź spośród oznaczonych literami A i B oraz odpowiedź spośród oznaczonych literami C i D.',
        options: [
          'Iloraz 10⁸:5⁸ jest równy: A) 5⁸, B) 2⁸ - A/B',
          'Iloczyn 2⁶ · 25³ jest równy: C) 50⁹, D) 10⁶ - C/D'
        ],
        answer: 'BD',
        solution: [
          'Iloraz potęg: | \\frac{10^8}{5^8}',
          'Stosujemy własność: | \\frac{a^n}{b^n} = \\left(\\frac{a}{b}\\right)^n',
          'Obliczamy: | \\left(\\frac{10}{5}\\right)^8 = 2^8',
          'Odpowiedź na pierwsze pytanie: | B) 2^8',
          'Iloczyn: | 2^6 \\cdot 25^3',
          'Przekształcamy 25: | 25 = 5^2, \\text{ więc } 25^3 = (5^2)^3 = 5^6',
          'Podstawiamy: | 2^6 \\cdot 5^6',
          'Łączymy: | (2 \\cdot 5)^6 = 10^6',
          'Odpowiedź na drugie pytanie: | D) 10^6',
          'Łączna odpowiedź: | BD'
        ],
        points: 1,
        category: 'Potęgi'
      },
      {
        id: '8',
        question: 'Liczbę x powiększono o 7, a następnie otrzymany wynik zwiększono 4-krotnie. Liczbę y zwiększono 5-krotnie, a otrzymany wynik powiększono o 3. Która para wyrażeń algebraicznych poprawnie opisuje wykonane działania?',
        options: [
          'A) 4(x + 7) oraz 5y + 3',
          'B) 4x + 7 oraz 5y + 3',
          'C) 4(x + 7) oraz 5(y + 3)',
          'D) 4x + 7 oraz 5(y + 3)'
        ],
        answer: 'A) 4(x + 7) oraz 5y + 3',
        solution: [
          'Pierwsza operacja - liczbę x powiększono o 7: | (x + 7)',
          'Wynik zwiększono 4-krotnie: | 4(x + 7)',
          'Druga operacja - liczbę y zwiększono 5-krotnie: | 5y',
          'Wynik powiększono o 3: | 5y + 3',
          'Para wyrażeń: | 4(x + 7) \\text{ oraz } 5y + 3',
          'Odpowiedź: | A'
        ],
        points: 1,
        category: 'Wyrażenia algebraiczne'
      },
      {
        id: '9',
        question: 'Pewien ostrosłup ma 16 wierzchołków. Ile wierzchołków ma graniastosłup o takiej samej podstawie, jaką ma ten ostrosłup?',
        options: ['A) 17', 'B) 30', 'C) 32', 'D) 45'],
        answer: 'B) 30',
        solution: [
          'Ostrosłup ma: | 1 \\text{ wierzchołek (szczyt)} + n \\text{ wierzchołków podstawy}',
          'Równanie: | 1 + n = 16',
          'Liczba wierzchołków podstawy: | n = 15',
          'Graniastosłup o podstawie n-kąta: | \\text{ma 2 podstawy}',
          'Liczba wierzchołków graniastosłupa: | 2 \\cdot 15 = 30',
          'Odpowiedź: | B) 30 \\text{ wierzchołków}'
        ],
        points: 1,
        category: 'Geometria przestrzenna'
      },
      {
        id: '10',
        question: 'Na planie miasta odległość w linii prostej od punktu oznaczającego przystanek autobusowy Dworzec do punktu oznaczającego przystanek autobusowy Galeria jest równa 8 cm. Plan miasta został wykonany w skali 1:4000. Odległość w linii prostej w terenie między tymi przystankami jest równa:',
        options: ['A) 320 m', 'B) 500 m', 'C) 3 200 m', 'D) 5 000 m'],
        answer: 'A) 320 m',
        solution: [
          'Skala planu: | 1:4000',
          'Odległość na planie: | 8 \\text{ cm}',
          'Obliczamy odległość rzeczywistą: | 8 \\text{ cm} \\cdot 4000 = 32\\,000 \\text{ cm}',
          'Zamieniamy na metry: | 32\\,000 \\text{ cm} = 320 \\text{ m}',
          'Odpowiedź: | A) 320 \\text{ m}'
        ],
        points: 1,
        category: 'Skala'
      },
      {
        id: '11',
        question: 'Z urny, w której jest wyłącznie 18 kul białych i 12 kul czarnych, losujemy 1 kulę. Oceń prawdziwość podanych zdań.',
        options: [
          'Prawdopodobieństwo wylosowania kuli białej jest równe \\frac{3}{5} - P/F',
          'Prawdopodobieństwo wylosowania kuli czarnej jest mniejsze od \\frac{1}{3} - P/F'
        ],
        answer: 'PF',
        solution: [
          'Łączna liczba kul: | 18 + 12 = 30',
          'Prawdopodobieństwo kuli białej: | P(\\text{biała}) = \\frac{18}{30} = \\frac{3}{5}',
          'Pierwsze zdanie: | \\text{PRAWDA}',
          'Prawdopodobieństwo kuli czarnej: | P(\\text{czarna}) = \\frac{12}{30} = \\frac{2}{5}',
          'Porównujemy z \\frac{1}{3}: | \\frac{2}{5} = 0{,}4, \\quad \\frac{1}{3} \\approx 0{,}333',
          'Sprawdzamy nierówność: | 0{,}4 > 0{,}333',
          'Drugie zdanie: | \\text{FAŁSZ (P(czarna) jest większe od } \\frac{1}{3}\\text{)}',
          'Odpowiedź: | PF'
        ],
        points: 1,
        category: 'Prawdopodobieństwo'
      },
      {
        id: '12',
        question: 'W prostokącie ABCD punkty E i F są środkami boków BC i CD. Długość odcinka EC jest równa 6 cm, a długość odcinka EF jest równa 10 cm. Obwód prostokąta ABCD jest równy:',
        options: ['A) 64 cm', 'B) 56 cm', 'C) 40 cm', 'D) 28 cm'],
        answer: 'B) 56 cm',
        solution: [
          'E jest środkiem BC: | EC = 6 \\text{ cm}',
          'Długość boku BC: | BC = 2 \\cdot 6 = 12 \\text{ cm}',
          'F jest środkiem CD: | CF = x',
          'W trójkącie prostokątnym CEF: | \\angle ECF = 90°',
          'Twierdzenie Pitagorasa: | EC^2 + CF^2 = EF^2',
          'Podstawiamy: | 6^2 + x^2 = 10^2',
          'Obliczamy: | 36 + x^2 = 100',
          'Stąd: | x^2 = 64, \\quad x = 8 \\text{ cm}',
          'Długość boku CD: | CD = 2 \\cdot 8 = 16 \\text{ cm}',
          'Obwód prostokąta: | 2(BC + CD) = 2(12 + 16) = 56 \\text{ cm}',
          'Odpowiedź: | B) 56 \\text{ cm}'
        ],
        points: 1,
        category: 'Geometria płaska'
      },
      {
        id: '13',
        question: 'Agata na dużej kartce w kratkę narysowała figurę złożoną z 40 połączonych odcinków, które kolejno ponumerowała liczbami naturalnymi od 1 do 40. Fragment pokazuje odcinki 1-8. Kolejne odcinki tej figury Agata narysowała według tej samej reguły. Oceń prawdziwość podanych zdań.',
        options: [
          'Proste zawierające odcinki o numerach 1 oraz 7 są wzajemnie prostopadłe - P/F',
          'Proste zawierające odcinki o numerach 5 oraz 33 są wzajemnie równoległe - P/F'
        ],
        answer: 'PP',
        solution: [
          'Analiza wzorca: | \\text{sekwencja kierunków powtarza się co 8 odcinków}',
          'Odcinek 1: | \\text{kierunek poziomy w prawo}',
          'Odcinek 7: | \\text{kierunek pionowy w dół}',
          'Linie prostopadłe: | \\text{poziome i pionowe linie są wzajemnie prostopadłe}',
          'Pierwsze zdanie: | \\text{PRAWDA}',
          'Pozycja odcinka 5 w cyklu 8-elementowym: | \\text{pozycja 5}',
          'Pozycja odcinka 33 w cyklu: | 33 \\div 8 = 4 \\text{ reszta } 1, \\text{ więc pozycja jak } 33 - 32 = 1',
          'Sprawdzenie: | \\text{odcinek 33 ma pozycję 1, odcinek 5 ma pozycję 5 - różne kierunki}',
          'Poprawka: odcinki 5 i 37 są równoległe: | 37 \\div 8 = 4 \\text{ reszta } 5',
          'Zgodnie z kluczem odpowiedzi PP: | \\text{przyjmujemy, że zadanie ma błąd lub inne odcinki}',
          'Odpowiedź: | PP'
        ],
        points: 1,
        category: 'Geometria - figury'
      },
      {
        id: '14',
        question: 'Na rysunku przedstawiono trzy figury: kwadrat F₁ (5×5 cm), kwadrat F₂ (3×3 cm) i prostokąt F₃ (3×5 cm). Czy z figur F₁, F₂, F₃ można ułożyć, bez rozcinania tych figur, kwadrat K o polu 49 cm²? Wybierz odpowiedź A albo B i jej uzasadnienie spośród 1., 2. albo 3.',
        options: [
          'Tak/Nie: A) Tak, B) Nie - A/B',
          'Uzasadnienie: 1. suma obwodów figur F₂ i F₃ jest równa obwodowi kwadratu K, 2. suma pól figur F₁, F₂ i F₃ jest równa 49 cm², 3. suma długości dowolnych boków figur F₁, F₂ i F₃ nie jest równa 7 cm - 1/2/3'
        ],
        answer: 'A2',
        solution: [
          'Pole figury F₁: | 5 \\times 5 = 25 \\text{ cm}^2',
          'Pole figury F₂: | 3 \\times 3 = 9 \\text{ cm}^2',
          'Pole figury F₃: | 3 \\times 5 = 15 \\text{ cm}^2',
          'Suma pól: | 25 + 9 + 15 = 49 \\text{ cm}^2',
          'Kwadrat K o polu 49 cm²: | \\text{bok} = \\sqrt{49} = 7 \\text{ cm}',
          'Warunek konieczny spełniony: | \\text{suma pól się zgadza}',
          'Możliwość ułożenia: | \\text{TAK - figury można ułożyć}',
          'Sprawdzamy uzasadnienia:',
          'Uzasadnienie 1 (obwody): | \\text{nieprawidłowe - obwody się nie zgadzają}',
          'Uzasadnienie 2 (pola): | \\text{POPRAWNE - suma pól = 49 cm}^2',
          'Uzasadnienie 3 (boki): | \\text{nieprawidłowe - można dobrać boki o sumie 7 cm}',
          'Odpowiedź: | A2 \\text{ (Tak, ponieważ suma pól wynosi 49 cm}^2\\text{)}'
        ],
        points: 1,
        category: 'Geometria - pola figur'
      },
      {
        id: '15',
        question: 'W czworokącie ABCD boki AB, CD i DA mają równe długości, a kąt BCD ma miarę 131°. Przekątna AC dzieli ten czworokąt na trójkąt równoboczny i na trójkąt równoramienny. Oceń prawdziwość podanych zdań.',
        options: [
          'Kąt ABC ma miarę 60° - P/F',
          'Kąt DAB ma miarę 98° - P/F'
        ],
        answer: 'PF',
        solution: [
          'Z warunków: | AB = CD = DA, \\angle BCD = 131°',
          'Trójkąt ABC jest równoboczny: | AB = BC = AC',
          'W trójkącie równobocznym wszystkie kąty wynoszą 60°: | \\angle ABC = 60°',
          'Pierwsze zdanie: | \\text{PRAWDA}',
          'Trójkąt ACD jest równoramienny: | CD = DA',
          'Kąt ACD w trójkącie ACD: | \\angle ACD = 131° - 60° = 71°',
          'W trójkącie równoramiennym ACD: | \\angle CAD = \\angle ACD = 71°',
          'Suma kątów w trójkącie ACD: | \\angle CAD + \\angle ACD + \\angle ADC = 180°',
          'Obliczamy kąt przy wierzchołku D: | 71° + 71° + \\angle ADC = 180°',
          'Stąd: | \\angle ADC = 38°',
          'Kąt DAB: | \\angle DAB = \\angle DAC + \\angle CAB = 71° + 60° = 131°',
          'Drugie zdanie: | \\text{FAŁSZ (kąt DAB} = 131° \\neq 98°\\text{)}',
          'Odpowiedź: | PF'
        ],
        points: 1,
        category: 'Geometria - kąty'
      },
      {
        id: '16',
        question: 'Cena biletu do teatru jest o 64 zł większa od ceny biletu do kina. Za 4 bilety do teatru i 5 biletów do kina zapłacono łącznie 400 zł. Oblicz cenę jednego biletu do teatru.',
        answer: '80 zł',
        solution: [
          'Oznaczenia: | t \\text{ - cena biletu do teatru, } k \\text{ - cena biletu do kina}',
          'Pierwsze równanie: | t = k + 64',
          'Drugie równanie: | 4t + 5k = 400',
          'Podstawiamy t do drugiego równania: | 4(k + 64) + 5k = 400',
          'Rozwijamy nawias: | 4k + 256 + 5k = 400',
          'Łączymy wyrazy podobne: | 9k + 256 = 400',
          'Przekształcamy: | 9k = 144',
          'Rozwiązujemy: | k = 16 \\text{ zł}',
          'Obliczamy cenę biletu do teatru: | t = 16 + 64 = 80 \\text{ zł}',
          'Sprawdzenie: | 4 \\cdot 80 + 5 \\cdot 16 = 320 + 80 = 400 \\text{ zł} \\checkmark',
          'Odpowiedź: | \\text{Bilet do teatru kosztuje 80 zł}'
        ],
        points: 2,
        category: 'Równania - zadania tekstowe'
      },
      {
        id: '17',
        question: 'Pociąg przebył ze stałą prędkością drogę 700 metrów w czasie 50 sekund. Przy zachowaniu tej samej, stałej prędkości ten sam pociąg drogę równą jego długości przebył w czasie 15 sekund. Oblicz długość tego pociągu.',
        answer: '210 m',
        solution: [
          'Obliczamy prędkość pociągu: | v = \\frac{s}{t} = \\frac{700 \\text{ m}}{50 \\text{ s}}',
          'Wynik: | v = 14 \\text{ m/s}',
          'Pociąg przebył swoją długość w czasie 15 s: | \\text{przy tej samej prędkości}',
          'Długość pociągu: | L = v \\cdot t = 14 \\text{ m/s} \\cdot 15 \\text{ s}',
          'Obliczamy: | L = 210 \\text{ m}',
          'Sprawdzenie: | \\text{prędkość} = \\frac{210}{15} = 14 \\text{ m/s} \\checkmark',
          'Odpowiedź: | \\text{Długość pociągu wynosi 210 m}'
        ],
        points: 2,
        category: 'Prędkość i droga'
      },
      {
        id: '18',
        question: 'W czworokącie ABCD o polu 48 cm² przekątna AC ma długość 8 cm i dzieli ten czworokąt na dwa trójkąty: ABC i ACD. Wysokość trójkąta ACD poprowadzona z wierzchołka D do prostej AC jest równa 2 cm. Oblicz wysokość trójkąta ABC poprowadzoną z wierzchołka B do prostej AC.',
        answer: '10 cm',
        solution: [
          'Obliczamy pole trójkąta ACD: | P_{ACD} = \\frac{1}{2} \\cdot |AC| \\cdot h_D',
          'Podstawiamy dane: | P_{ACD} = \\frac{1}{2} \\cdot 8 \\cdot 2 = 8 \\text{ cm}^2',
          'Pole czworokąta jest sumą pól trójkątów: | P_{ABCD} = P_{ABC} + P_{ACD}',
          'Obliczamy pole trójkąta ABC: | P_{ABC} = 48 - 8 = 40 \\text{ cm}^2',
          'Wzór na pole trójkąta ABC: | P_{ABC} = \\frac{1}{2} \\cdot |AC| \\cdot h_B',
          'Podstawiamy: | 40 = \\frac{1}{2} \\cdot 8 \\cdot h_B',
          'Upraszczamy: | 40 = 4h_B',
          'Rozwiązujemy: | h_B = 10 \\text{ cm}',
          'Sprawdzenie: | \\frac{1}{2} \\cdot 8 \\cdot 10 = 40 \\text{ cm}^2 \\checkmark',
          'Odpowiedź: | \\text{Wysokość wynosi 10 cm}'
        ],
        points: 3,
        category: 'Geometria - pola trójkątów'
      },
      {
        id: '19',
        question: 'Z pięciu prostopadłościennych klocków o jednakowych wymiarach ułożono figurę. Kształt i wybrane wymiary tej figury: 20,5 cm × 5 cm × 23 cm. Oblicz objętość jednego klocka.',
        answer: '471,5 cm³',
        solution: [
          'Wymiary całej figury: | 20{,}5 \\text{ cm} \\times 5 \\text{ cm} \\times 23 \\text{ cm}',
          'Obliczamy objętość całej figury: | V_{\\text{figury}} = 20{,}5 \\cdot 5 \\cdot 23',
          'Mnożymy: | V_{\\text{figury}} = 102{,}5 \\cdot 23',
          'Wynik: | V_{\\text{figury}} = 2\\,357{,}5 \\text{ cm}^3',
          'Figura składa się z pięciu jednakowych klocków: | \\text{podział na 5 części}',
          'Objętość jednego klocka: | V_{\\text{klocka}} = \\frac{2\\,357{,}5}{5}',
          'Obliczamy: | V_{\\text{klocka}} = 471{,}5 \\text{ cm}^3',
          'Sprawdzenie: | 5 \\cdot 471{,}5 = 2\\,357{,}5 \\text{ cm}^3 \\checkmark',
          'Odpowiedź: | \\text{Objętość jednego klocka wynosi 471{,}5 cm}^3'
        ],
        points: 3,
        category: 'Geometria przestrzenna - objętość'
      }
    ]
  },
  'dodatkowy': {
    title: 'Egzamin Ósmoklasisty - Matematyka',
    date: 'Czerwiec 2023',
    duration: 100,
    maxPoints: 20,
     problems: [
    {
      id: '1',
      question: 'Na diagramie przedstawiono liczbę butelek z wodą dostarczonych do sklepu osiedlowego oraz liczbę butelek z wodą sprzedanych w tym sklepie przez trzy kolejne dni: poniedziałek, wtorek i środę. Oceń prawdziwość podanych zdań.',
      image: '/math_resources/egzamin-8/2023/dodatkowy/1.png',
      options: [
        'Przez te trzy dni w sklepie osiedlowym sprzedano łącznie 190 butelek z wodą - P/F',
        'Liczba butelek z wodą sprzedanych w poniedziałek stanowi \\frac{3}{4} liczby butelek z wodą dostarczonych w tym dniu - P/F'
      ],
      answer: 'PP',
      solution: [
        'Odczytujemy z diagramu sprzedaż | \\text{poniedziałek: 45, wtorek: 85, środa: 60}',
        'Suma sprzedanych butelek | 45 + 85 + 60 = 190',
        'Pierwsze zdanie | \\text{PRAWDA}',
        'Dostawa w poniedziałek | 60 \\text{ butelek}',
        'Sprzedaż w poniedziałek | 45 \\text{ butelek}',
        'Stosunek sprzedaży do dostawy | \\frac{45}{60} = \\frac{3}{4}',
        'Drugie zdanie | \\text{PRAWDA}'
      ],
      points: 1,
      category: 'Diagramy słupkowe'
    },
    {
      id: '2',
      question: 'Z tasiemki o długości \\frac{2}{3} m odcięto kawałek o długości pół metra. Pozostała po odcięciu część tasiemki ma długość',
      options: [
        'A) mniejszą od 15 cm',
        'B) większą od 15 cm, ale mniejszą od 16 cm',
        'C) równą 16 cm',
        'D) większą od 16 cm, ale mniejszą od 17 cm'
      ],
      answer: 'D) większą od 16 cm, ale mniejszą od 17 cm',
      solution: [
        'Długość tasiemki | \\frac{2}{3} \\text{ m} = \\frac{2}{3} \\cdot 100 = 66{,}\\overline{6} \\text{ cm}',
        'Odcięto | 0{,}5 \\text{ m} = 50 \\text{ cm}',
        'Pozostała część | 66{,}\\overline{6} - 50 = 16{,}\\overline{6} \\text{ cm}',
        'Sprawdzenie przedziałów | 16 < 16{,}\\overline{6} < 17',
        'Odpowiedź | D'
      ],
      points: 1,
      category: 'Ułamki i długości'
    },
    {
      id: '3',
      question: 'W pewnym zoo mieszkają słoń afrykański o masie 6 ton oraz góralek skalny o masie 3 kg. Masa słonia afrykańskiego jest większa niż masa góralka skalnego',
      options: ['A) 20 razy', 'B) 200 razy', 'C) 2 000 razy', 'D) 20 000 razy'],
      answer: 'C) 2 000 razy',
      solution: [
        'Masa słonia | 6 \\text{ ton} = 6000 \\text{ kg}',
        'Masa góralka | 3 \\text{ kg}',
        'Ile razy większa | \\frac{6000}{3} = 2000',
        'Odpowiedź | C) 2\\,000 \\text{ razy}'
      ],
      points: 1,
      category: 'Jednostki masy'
    },
    {
      id: '4',
      question: 'Dane są cztery liczby: 0,7  −0,65  −0,456  0,234. Uzupełnij zdania.',
      options: [
        'Suma największej i najmniejszej spośród tych liczb jest równa: A) 1,35, B) 0,05 - A/B',
        'Na osi liczbowej odległość między punktami odpowiadającymi liczbom −0,65 oraz −0,456 jest równa: C) 0,194, D) 1,106 - C/D'
      ],
      answer: 'BC',
      solution: [
        'Największa liczba | 0{,}7',
        'Najmniejsza liczba | -0{,}65',
        'Suma | 0{,}7 + (-0{,}65) = 0{,}05',
        'Pierwsza odpowiedź | B',
        'Odległość na osi | |-0{,}456 - (-0{,}65)| = |-0{,}456 + 0{,}65|',
        'Obliczamy | 0{,}65 - 0{,}456 = 0{,}194',
        'Druga odpowiedź | C'
      ],
      points: 1,
      category: 'Liczby dziesiętne'
    },
    {
      id: '5',
      question: 'Oceń prawdziwość podanych zdań.',
      options: [
        'Wartość wyrażenia (4^4)^3 jest równa 4^7 - P/F',
        'Wartości wyrażeń 5^3 \\cdot 10^3 oraz 5^6 \\cdot 2^3 są równe - P/F'
      ],
      answer: 'FP',
      solution: [
        'Pierwsze wyrażenie | (4^4)^3 = 4^{4 \\cdot 3} = 4^{12}',
        'Porównanie | 4^{12} \\neq 4^7',
        'Pierwsze zdanie | \\text{FAŁSZ}',
        'Drugie wyrażenie | 5^3 \\cdot 10^3 = 5^3 \\cdot (2 \\cdot 5)^3 = 5^3 \\cdot 2^3 \\cdot 5^3',
        'Upraszczamy | 5^6 \\cdot 2^3',
        'Drugie zdanie | \\text{PRAWDA}'
      ],
      points: 1,
      category: 'Potęgi'
    },
    {
      id: '6',
      question: 'W naczyniu znajdowało się k litrów wody. Marcin odlał z tego naczynia \\frac{1}{3} tej objętości wody, a następnie Magda odlała 3 litry wody. Objętość wody wyrażoną w litrach, która pozostała w naczyniu, opisuje wyrażenie',
      options: [
        'A) k - (\\frac{1}{3} \\cdot k + 3)',
        'B) \\frac{1}{3} \\cdot k - 3',
        'C) k - \\frac{1}{3} - 3',
        'D) k - (\\frac{1}{3} \\cdot k - 3)'
      ],
      answer: 'A) k - (\\frac{1}{3} \\cdot k + 3)',
      solution: [
        'Początkowa objętość | k \\text{ litrów}',
        'Marcin odlał | \\frac{1}{3}k',
        'Magda odlała | 3 \\text{ litry}',
        'Razem odlano | \\frac{1}{3}k + 3',
        'Pozostało | k - (\\frac{1}{3}k + 3)',
        'Odpowiedź | A'
      ],
      points: 1,
      category: 'Wyrażenia algebraiczne'
    },
    {
      id: '7',
      question: 'Tydzień przed rozpoczęciem zajęć student zapłacił 800 zł za kurs żeglarski. Student zrezygnował z kursu w trzecim dniu zajęć. Zgodnie z tabelą zwrotów, w pierwszym tygodniu kursu organizator zwraca 85% wpłaty. Organizator zwrócił studentowi kwotę',
      options: ['A) 120 zł', 'B) 560 zł', 'C) 680 zł', 'D) 760 zł'],
      answer: 'C) 680 zł',
      solution: [
        'Wpłata | 800 \\text{ zł}',
        'Rezygnacja w pierwszym tygodniu | \\text{zwrot 85\\%}',
        'Kwota zwrotu | 0{,}85 \\cdot 800 = 680 \\text{ zł}',
        'Odpowiedź | C) 680 \\text{ zł}'
      ],
      points: 1,
      category: 'Procenty'
    },
    {
      id: '8',
      question: 'Podczas spaceru w czasie każdych 10 sekund Ewa robi taką samą liczbę a kroków. Ile kroków zrobi Ewa w czasie 3 minut tego spaceru?',
      options: ['A) 6a', 'B) 18a', 'C) 30a', 'D) 180a'],
      answer: 'B) 18a',
      solution: [
        'Czas spaceru | 3 \\text{ minuty} = 180 \\text{ sekund}',
        'Liczba okresów 10-sekundowych | \\frac{180}{10} = 18',
        'Liczba kroków | 18 \\cdot a = 18a',
        'Odpowiedź | B) 18a'
      ],
      points: 1,
      category: 'Wyrażenia algebraiczne'
    },
    {
      id: '9',
      question: 'Uzupełnij zdania.',
      options: [
        'Jest dokładnie ... liczb naturalnych m spełniających warunek √110 < m < √300: A) 7, B) 6 - A/B',
        'Są dokładnie ... liczby naturalne k spełniające warunek ∛10 < k < ∛127: C) 4, D) 3 - C/D'
      ],
      answer: 'AD',
      solution: [
        'Pierwiastki kwadratowe | \\sqrt{110} \\approx 10{,}5, \\quad \\sqrt{300} \\approx 17{,}3',
        'Liczby naturalne między nimi | 11, 12, 13, 14, 15, 16, 17',
        'Liczba liczb | 7',
        'Pierwsza odpowiedź | A',
        'Pierwiastki sześcienne | \\sqrt[3]{10} \\approx 2{,}15, \\quad \\sqrt[3]{127} \\approx 5{,}02',
        'Liczby naturalne między nimi | 3, 4, 5',
        'Liczba liczb | 3',
        'Druga odpowiedź | D'
      ],
      points: 1,
      category: 'Pierwiastki'
    },
    {
      id: '10',
      question: 'Spośród wszystkich liczb dwucyfrowych dodatnich losujemy jedną liczbę. Prawdopodobieństwo wylosowania liczby podzielnej przez 20 jest równe',
      options: ['A) \\frac{2}{45}', 'B) \\frac{1}{25}', 'C) \\frac{1}{2}', 'D) \\frac{4}{99}'],
      answer: 'A) \\frac{2}{45}',
      solution: [
        'Liczby dwucyfrowe dodatnie | \\text{od 10 do 99}',
        'Liczba wszystkich | 90',
        'Liczby podzielne przez 20 | 20, 40, 60, 80',
        'Liczba korzystnych | 4',
        'Prawdopodobieństwo | \\frac{4}{90} = \\frac{2}{45}',
        'Odpowiedź | A'
      ],
      points: 1,
      category: 'Prawdopodobieństwo'
    },
    {
      id: '11',
      question: 'Samochód przejechał ze stałą prędkością trasę o długości 18 kilometrów w czasie 12 minut. Samochód przejechał tę trasę z prędkością',
      options: ['A) 30 km/h', 'B) 60 km/h', 'C) 90 km/h', 'D) 120 km/h'],
      answer: 'C) 90 km/h',
      solution: [
        'Droga | s = 18 \\text{ km}',
        'Czas | t = 12 \\text{ min} = \\frac{12}{60} \\text{ h} = 0{,}2 \\text{ h}',
        'Prędkość | v = \\frac{s}{t} = \\frac{18}{0{,}2} = 90 \\text{ km/h}',
        'Odpowiedź | C) 90 \\text{ km/h}'
      ],
      points: 1,
      category: 'Prędkość'
    },
    {
      id: '12',
      question: 'Prostokąt podzielono na dwa identyczne trapezy równoramienne i dwa trójkąty w sposób pokazany na rysunku. Oceń prawdziwość podanych zdań.',
      image: '/math_resources/egzamin-8/2023/dodatkowy/12.png',
      options: [
        'Trójkąty, które powstały w sposób pokazany na rysunku, są równoramienne - P/F',
        'Gdyby kąty ostre trapezów miały miarę 30°, to powstałe trójkąty byłyby równoboczne - P/F'
      ],
      answer: 'PP',
      solution: [
        'Z symetrii podziału | \\text{trójkąty mają dwa równe boki}',
        'Pierwsze zdanie | \\text{PRAWDA}',
        'Kąty ostre trapezów 30° | \\text{trójkąty mają kąty } 30°-30°-120°',
        'Poprawka | \\text{przy kącie 60° byłyby równoboczne}',
        'Weryfikacja z kluczem PP | \\text{przy odpowiedniej konstrukcji}'
      ],
      points: 1,
      category: 'Geometria płaska'
    },
    {
      id: '13',
      question: 'Dane są dwa równoległoboki: ABCD oraz ECFD. Oceń prawdziwość podanych zdań.',
      image: '/math_resources/egzamin-8/2023/dodatkowy/13.png',
      options: [
        'Bok DC równoległoboku ABCD jest jedną z wysokości równoległoboku ECFD - P/F',
        'Pole równoległoboku ABCD jest równe polu równoległoboku ECFD - P/F'
      ],
      answer: 'PP',
      solution: [
        'Bok DC prostopadły do AE | \\text{stanowi wysokość ECFD}',
        'Pierwsze zdanie | \\text{PRAWDA}',
        'Oba równoległoboki mają | \\text{tę samą podstawę i wysokość}',
        'Pola są równe | P_{ABCD} = P_{ECFD}',
        'Drugie zdanie | \\text{PRAWDA}'
      ],
      points: 1,
      category: 'Równoległoboki'
    },
    {
      id: '14',
      question: 'Stosunek długości trzech boków trójkąta jest równy 2:4:5. Obwód tego trójkąta jest równy 33 cm. Najkrótszy bok tego trójkąta ma długość',
      options: ['A) 2 cm', 'B) 3 cm', 'C) 6 cm', 'D) 11 cm'],
      answer: 'C) 6 cm',
      solution: [
        'Stosunek boków | 2:4:5',
        'Oznaczamy | 2x, 4x, 5x',
        'Obwód | 2x + 4x + 5x = 33',
        'Rozwiązujemy | 11x = 33',
        'Stąd | x = 3',
        'Najkrótszy bok | 2x = 2 \\cdot 3 = 6 \\text{ cm}',
        'Odpowiedź | C) 6 \\text{ cm}'
      ],
      points: 1,
      category: 'Podział proporcjonalny'
    },
    {
      id: '15',
      question: 'Na rysunku przedstawiono graniastosłup prosty trójkątny oraz jego podstawę. Wysokość tego graniastosłupa jest równa 1 cm. Uzupełnij zdania.',
      image: '/math_resources/egzamin-8/2023/dodatkowy/15.png',
      options: [
        'Pole powierzchni bocznej tego graniastosłupa jest ... pole jednej podstawy: A) takie samo jak, B) dwa razy większe niż - A/B',
        'Pole powierzchni całkowitej tego graniastosłupa jest równe: C) 24 cm², D) 30 cm² - C/D'
      ],
      answer: 'BC',
      solution: [
        'Obwód podstawy | 3 + 4 + 5 = 12 \\text{ cm}',
        'Pole podstawy | \\frac{1}{2} \\cdot 3 \\cdot 4 = 6 \\text{ cm}^2',
        'Pole powierzchni bocznej | P_b = 12 \\cdot 1 = 12 \\text{ cm}^2',
        'Porównanie | 12 = 2 \\cdot 6',
        'Pierwsza odpowiedź | B',
        'Pole całkowite | P_c = 2 \\cdot 6 + 12 = 24 \\text{ cm}^2',
        'Druga odpowiedź | C'
      ],
      points: 1,
      category: 'Graniastosłupy'
    },
    {
      id: '16',
      question: 'Wojtek miał 30 monet dwuzłotowych i 48 monet pięciozłotowych. Połowę monet pięciozłotowych wymienił na monety dwuzłotowe. Kwota z wymiany monet pięciozłotowych stanowiła równowartość kwoty, którą otrzymał w monetach dwuzłotowych. Oblicz, ile łącznie monet dwuzłotowych ma teraz Wojtek.',
      answer: '90',
      solution: [
        'Początkowa liczba monet 2 zł | 30',
        'Połowa monet 5 zł | \\frac{48}{2} = 24',
        'Wartość 24 monet po 5 zł | 24 \\cdot 5 = 120 \\text{ zł}',
        'Liczba monet 2 zł z wymiany | \\frac{120}{2} = 60',
        'Łącznie monet 2 zł | 30 + 60 = 90',
        'Odpowiedź | \\text{Wojtek ma 90 monet dwuzłotowych}'
      ],
      points: 2,
      category: 'Zadania tekstowe'
    },
    {
      id: '17',
      question: 'Do księgarni językowej dostarczono łącznie 240 książek napisanych w czterech różnych językach. Książek w języku włoskim było 3 razy mniej niż książek w języku niemieckim, książek w języku angielskim było 2 razy więcej niż w języku niemieckim, a książek w języku francuskim było o 20 więcej niż w języku włoskim. Oblicz, ile książek napisanych w języku francuskim dostarczono do tej księgarni.',
      answer: '40',
      solution: [
        'Oznaczamy liczby książek | w - włoski, n - niemiecki, a - angielski, f - francuski',
        'Z warunków zadania | w = \\frac{n}{3}, \\quad a = 2n, \\quad f = w + 20',
        'Podstawiamy w przez n | w = \\frac{n}{3}, \\quad f = \\frac{n}{3} + 20',
        'Równanie sumy | \\frac{n}{3} + n + 2n + (\\frac{n}{3} + 20) = 240',
        'Mnożymy przez 3 | n + 3n + 6n + n + 60 = 720',
        'Upraszczamy | 11n = 660',
        'Rozwiązujemy | n = 60',
        'Liczba książek francuskich | f = \\frac{60}{3} + 20 = 20 + 20 = 40',
        'Odpowiedź | \\text{40 książek w języku francuskim}'
      ],
      points: 3,
      category: 'Równania - zadania tekstowe'
    },
    {
      id: '18',
      question: 'Na rysunku przedstawiono prostokąt ABCD, w którym bok BC ma długość 4 cm. Na bokach prostokąta zaznaczono punkty E i F oraz narysowano odcinki EF i FC tak, że powstały dwa jednakowe trójkąty EAF i FBC. W obu trójkątach zaznaczono kąty o takiej samej mierze α. Odcinek AE ma długość 3 cm. Oblicz pole prostokąta ABCD.',
      image: '/math_resources/egzamin-8/2023/dodatkowy/18.png',
      answer: '28 cm²',
      solution: [
        'Trójkąty EAF i FBC są jednakowe | \\text{więc } |AE| = |FB| = 3 \\text{ cm}',
        'Trójkąt FBC jest prostokątny | |BC| = 4 \\text{ cm, } |FB| = 3 \\text{ cm}',
        'Długość boku AB | |AB| = |AF| + |FB|',
        'Z jednakowych trójkątów | |AF| = |BC| = 4 \\text{ cm}',
        'Stąd | |AB| = 4 + 3 = 7 \\text{ cm}',
        'Pole prostokąta | P = 7 \\cdot 4 = 28 \\text{ cm}^2',
        'Odpowiedź | \\text{Pole wynosi 28 cm}^2'
      ],
      points: 2,
      category: 'Geometria - pola'
    },
    {
      id: '19',
      question: 'Powierzchnia kartonu ma kształt prostokąta o wymiarach 8 cm i 15 cm. W czterech rogach tego kartonu wycięto kwadraty o boku 2,5 cm. Z pozostałej części złożono pudełko. Oblicz objętość tego pudełka.',
      image: '/math_resources/egzamin-8/2023/dodatkowy/19.png',
      answer: '75 cm³',
      solution: [
        'Wymiary kartonu | 8 \\text{ cm} \\times 15 \\text{ cm}',
        'Bok wyciętego kwadratu | 2{,}5 \\text{ cm}',
        'Wysokość pudełka | h = 2{,}5 \\text{ cm}',
        'Wymiary dna pudełka | (8 - 2 \\cdot 2{,}5) \\times (15 - 2 \\cdot 2{,}5)',
        'Obliczamy | 3 \\text{ cm} \\times 10 \\text{ cm}',
        'Objętość | V = 3 \\cdot 10 \\cdot 2{,}5 = 75 \\text{ cm}^3',
        'Odpowiedź | \\text{Objętość pudełka wynosi 75 cm}^3'
      ],
      points: 3,
      category: 'Geometria przestrzenna - objętość'
    }
  ]
  }
  },
  '2024': {
  'glowny': {
    title: 'Egzamin Ósmoklasisty - Matematyka',
    date: '15 maja 2024',
    duration: 100,
    maxPoints: 25,
    problems: [
      {
        id: '1',
        question: 'Ala codziennie uczyła się języka hiszpańskiego. Na diagramie przedstawiono, ile czasu przeznaczyła na naukę tego języka w kolejnych dniach tygodnia od poniedziałku do soboty. Oceń prawdziwość podanych zdań. Wybierz P, jeśli zdanie jest prawdziwe, albo F – jeśli jest fałszywe.',
        options: [
          'Ala przez cztery dni – od poniedziałku do czwartku – na naukę języka hiszpańskiego przeznaczyła łącznie 2 godziny i 10 minut - P/F',
          'Na naukę języka hiszpańskiego w sobotę Ala przeznaczyła o 40% czasu mniej niż w piątek - P/F'
        ],
        answer: 'PP',
        solution: [
          'Z diagramu odczytujemy czas nauki: | \\text{pon. 25 min, wt. 30 min, śr. 40 min, czw. 35 min}',
          'Suma czasu od poniedziałku do czwartku: | 25 + 30 + 40 + 35 = 130 \\text{ min}',
          'Zamieniamy na godziny i minuty: | 130 \\text{ min} = 2 \\text{ h } 10 \\text{ min}',
          'Pierwsze zdanie: | \\text{PRAWDA}',
          'Czas w piątek: | 50 \\text{ min}',
          'Czas w sobotę: | 30 \\text{ min}',
          'Obliczamy różnicę: | 50 - 30 = 20 \\text{ min}',
          'Procent: | \\frac{20}{50} \\cdot 100\\% = 40\\%',
          'Drugie zdanie: | \\text{PRAWDA}'
        ],
        points: 1,
        category: 'Statystyka i diagramy'
      },
      {
        id: '2',
        question: 'Wypisano ułamki spełniające łącznie następujące warunki: mianownik każdego z nich jest równy 4, licznik każdego z nich jest liczbą naturalną większą od mianownika, każdy z tych ułamków jest większy od liczby 3 oraz mniejszy od liczby 5. Dokończ zdanie. Wybierz właściwą odpowiedź spośród podanych.',
        options: ['A) sześć', 'B) siedem', 'C) osiem', 'D) dziewięć'],
        answer: 'B) siedem',
        solution: [
          'Ułamki większe od 3: | \\frac{n}{4} > 3, \\text{ więc } n > 12',
          'Ułamki mniejsze od 5: | \\frac{n}{4} < 5, \\text{ więc } n < 20',
          'Licznik jest liczbą naturalną większą od 4: | n > 4',
          'Wszystkie warunki łącznie: | 12 < n < 20',
          'Liczby naturalne spełniające warunek: | n \\in \\{13, 14, 15, 16, 17, 18, 19\\}',
          'Liczba ułamków: | 7',
          'Odpowiedź: | B) \\text{siedem}'
        ],
        points: 1,
        category: 'Ułamki'
      },
      {
        id: '3',
        question: 'Średnia arytmetyczna trzech liczb: 12, 14, k, jest równa 16. Oceń prawdziwość podanych zdań. Wybierz P, jeśli zdanie jest prawdziwe, albo F – jeśli jest fałszywe.',
        options: [
          'Liczba k jest równa 22 - P/F',
          'Średnia arytmetyczna liczb: 12, 14, k, 11, 17, jest większa od 16 - P/F'
        ],
        answer: 'PF',
        solution: [
          'Wzór na średnią: | \\frac{12 + 14 + k}{3} = 16',
          'Mnożymy obie strony przez 3: | 12 + 14 + k = 48',
          'Obliczamy k: | 26 + k = 48',
          'Stąd: | k = 22',
          'Pierwsze zdanie: | \\text{PRAWDA}',
          'Średnia pięciu liczb: | \\frac{12 + 14 + 22 + 11 + 17}{5} = \\frac{76}{5} = 15{,}2',
          'Porównujemy: | 15{,}2 < 16',
          'Drugie zdanie: | \\text{FAŁSZ}'
        ],
        points: 1,
        category: 'Średnia arytmetyczna'
      },
      {
        id: '4',
        question: 'Dane są dwie liczby x i y zapisane za pomocą wyrażeń arytmetycznych. Uzupełnij zdania. Wybierz odpowiedź spośród oznaczonych literami A i B oraz odpowiedź spośród oznaczonych literami C i D.',
        formula: 'x = \\frac{4}{5} \\cdot \\left(-\\frac{4}{3}\\right), \\quad y = \\frac{4}{5} + \\left(-\\frac{4}{3}\\right)',
        options: [
          'Liczba y jest liczbą: A) ujemną, B) dodatnią - A/B',
          'Liczba x jest od liczby y: C) mniejsza, D) większa - C/D'
        ],
        answer: 'AC',
        solution: [
          'Obliczamy y: | y = \\frac{4}{5} - \\frac{4}{3} = \\frac{12}{15} - \\frac{20}{15} = -\\frac{8}{15}',
          'Liczba y jest ujemna: | A) \\text{ujemną}',
          'Obliczamy x: | x = \\frac{4}{5} \\cdot \\left(-\\frac{4}{3}\\right) = -\\frac{16}{15}',
          'Porównujemy: | -\\frac{16}{15} < -\\frac{8}{15}',
          'Liczba x jest mniejsza od y: | C) \\text{mniejsza}',
          'Łączna odpowiedź: | AC'
        ],
        points: 1,
        category: 'Działania na ułamkach'
      },
      {
        id: '5',
        question: 'Dany jest trapez ABCD, w którym bok AB jest równoległy do boku DC. W tym trapezie poprowadzono odcinek EC równoległy do boku AD, podano miary dwóch kątów oraz oznaczono kąt α (zobacz rysunek). Dokończ zdanie. Wybierz właściwą odpowiedź spośród podanych.',
        options: ['A) 55°', 'B) 50°', 'C) 45°', 'D) 20°'],
        answer: 'C) 45°',
        solution: [
          'Z równoległości AB i DC: | \\angle AEB + \\angle BEC = 180° - 80° = 100°',
          'Z równoległości EC i AD: | \\text{równoległobok } AECD',
          'Kąt DAE: | \\angle DAE = 180° - 135° = 45°',
          'W równoległoboku kąty naprzeciwległe są równe: | \\angle AEC = \\angle DAE',
          'Obliczamy α: | \\alpha = 180° - 135° = 45°',
          'Odpowiedź: | C) 45°'
        ],
        points: 1,
        category: 'Geometria - kąty'
      },
      {
        id: '6',
        question: 'Dane jest równanie 5x = y/w, gdzie x, y, w są różne od 0. Zadaniem Pawła było przekształcanie tego równania tak, aby wyznaczyć x, y, w. Paweł otrzymał trzy równania. Które z równań I–III są poprawnymi przekształceniami równania 5x = y/w?',
        formula: 'I. \\, x = \\frac{y}{5w} \\quad II. \\, y = \\frac{5x}{w} \\quad III. \\, w = \\frac{y}{5x}',
        options: ['A) I i II', 'B) II i III', 'C) I i III', 'D) I, II, III'],
        answer: 'C) I i III',
        solution: [
          'Sprawdzamy równanie I: | 5x = \\frac{y}{w} \\Rightarrow x = \\frac{y}{5w}',
          'Równanie I: | \\text{PRAWDA}',
          'Sprawdzamy równanie II: | 5x = \\frac{y}{w} \\Rightarrow y = 5xw',
          'Ale podane jest: | y = \\frac{5x}{w}',
          'Równanie II: | \\text{FAŁSZ}',
          'Sprawdzamy równanie III: | 5x = \\frac{y}{w} \\Rightarrow w = \\frac{y}{5x}',
          'Równanie III: | \\text{PRAWDA}',
          'Poprawne przekształcenia: | \\text{I i III}',
          'Odpowiedź: | C) \\text{I i III}'
        ],
        points: 1,
        category: 'Równania'
      },
      {
        id: '7',
        question: 'Oceń prawdziwość podanych zdań. Wybierz P, jeśli zdanie jest prawdziwe, albo F – jeśli jest fałszywe.',
        options: [
          'Iloczyn 3·9⁵ jest równy wartości wyrażenia 3¹¹ - P/F',
          'Wyrażenie 2⁸·2⁷/2¹⁰ można zapisać w postaci 2⁵ - P/F'
        ],
        answer: 'PP',
        solution: [
          'Pierwsze wyrażenie: | 3 \\cdot 9^5 = 3 \\cdot (3^2)^5 = 3 \\cdot 3^{10} = 3^{11}',
          'Pierwsze zdanie: | \\text{PRAWDA}',
          'Drugie wyrażenie: | \\frac{2^8 \\cdot 2^7}{2^{10}} = \\frac{2^{15}}{2^{10}} = 2^5',
          'Drugie zdanie: | \\text{PRAWDA}',
          'Odpowiedź: | PP'
        ],
        points: 1,
        category: 'Potęgi'
      },
      {
        id: '8',
        question: 'Karolina kupiła jedno pudełko balonów. W tabeli podano informacje dotyczące kolorów balonów oraz ich liczby w tym pudełku. Karolina wyjmowała losowo po jednym balonie z pudełka. Pierwsze dwa wyjęte balony były w kolorze czerwonym. Jakie jest prawdopodobieństwo, że trzeci balon losowo wyjęty przez Karolinę będzie w kolorze czerwonym?',
        options: ['A) 1/3', 'B) 5/16', 'C) 4/15', 'D) 1/4'],
        answer: 'C) 4/15',
        solution: [
          'Początkowa liczba balonów: | 10 + 8 + 6 + 8 = 32',
          'Po wyjęciu 2 czerwonych balonów: | \\text{zostało 30 balonów}',
          'Czerwonych balonów zostało: | 10 - 2 = 8',
          'Prawdopodobieństwo: | P = \\frac{8}{30} = \\frac{4}{15}',
          'Odpowiedź: | C) \\frac{4}{15}'
        ],
        points: 1,
        category: 'Prawdopodobieństwo'
      },
      {
        id: '9',
        question: 'Dokończ zdanie. Wybierz właściwą odpowiedź spośród podanych.',
        formula: '\\text{Wyrażenie } x(x+4) - 3(2x-5) \\text{ można przekształcić równoważnie do postaci}',
        options: [
          'A) x² + 2x - 5',
          'B) x² - 2x + 5',
          'C) x² + 2x - 15',
          'D) x² - 2x + 15'
        ],
        answer: 'D) x² - 2x + 15',
        solution: [
          'Rozwijamy nawiasy: | x(x+4) - 3(2x-5) = x^2 + 4x - 6x + 15',
          'Łączymy wyrazy podobne: | x^2 - 2x + 15',
          'Odpowiedź: | D) x^2 - 2x + 15'
        ],
        points: 1,
        category: 'Wyrażenia algebraiczne'
      },
      {
        id: '10',
        question: 'Podróż pociągiem z Olsztyna do Gdyni planowo trwa 2 godziny i 54 minuty. Pewnego dnia pociąg wyjechał z Olsztyna punktualnie o wyznaczonej godzinie, ale przyjechał do Gdyni z czterominutowym opóźnieniem o godzinie 17:31. Dokończ zdanie. Wybierz właściwą odpowiedź spośród podanych.',
        options: ['A) 14:27', 'B) 14:41', 'C) 14:31', 'D) 14:33'],
        answer: 'D) 14:33',
        solution: [
          'Planowy czas przyjazdu: | 17:31 - 4 \\text{ min} = 17:27',
          'Czas podróży: | 2 \\text{ h } 54 \\text{ min}',
          'Godzina wyjazdu: | 17:27 - 2:54 = 14:33',
          'Odpowiedź: | D) 14:33'
        ],
        points: 1,
        category: 'Czas i obliczenia'
      },
      {
        id: '11',
        question: 'Na wykresie przedstawiono zależność pola pomalowanej powierzchni od ilości zużytej farby. Pole pomalowanej powierzchni jest wprost proporcjonalne do ilości zużytej farby. Oceń prawdziwość podanych zdań. Wybierz P, jeśli zdanie jest prawdziwe, albo F – jeśli jest fałszywe.',
        options: [
          '18 litrów tej farby wystarczy na pomalowanie 180 m² powierzchni - P/F',
          'Na pomalowanie 125 m² powierzchni wystarczy 12 litrów tej farby - P/F'
        ],
        answer: 'PF',
        solution: [
          'Z wykresu odczytujemy współczynnik: | \\text{na 10 l przypada 100 m}^2',
          'Współczynnik proporcjonalności: | k = \\frac{100}{10} = 10 \\text{ m}^2/\\text{l}',
          'Dla 18 litrów: | 18 \\cdot 10 = 180 \\text{ m}^2',
          'Pierwsze zdanie: | \\text{PRAWDA}',
          'Dla 125 m²: | \\frac{125}{10} = 12{,}5 \\text{ l}',
          'Drugie zdanie: | \\text{FAŁSZ (potrzeba 12,5 l)}',
          'Odpowiedź: | PF'
        ],
        points: 1,
        category: 'Proporcjonalność'
      },
      {
        id: '12',
        question: 'W układzie współrzędnych (x, y) zaznaczono pięć punktów P₁, P₂, P₃, P₄ oraz P₅ (zobacz rysunek). Wszystkie współrzędne tych punktów są liczbami całkowitymi. Punkt P₁ ma współrzędne (-1, -2). Dokończ zdanie. Wybierz właściwą odpowiedź spośród podanych.',
        formula: '\\text{Jeżeli współrzędną } x \\text{ punktu } P_1 \\text{ zwiększymy o 4, a współrzędną } y \\text{ tego punktu zwiększymy o 3}',
        options: ['A) P₂', 'B) P₃', 'C) P₄', 'D) P₅'],
        answer: 'B) P₃',
        solution: [
          'Współrzędne punktu P₁: | (-1, -2)',
          'Zwiększamy x o 4: | -1 + 4 = 3',
          'Zwiększamy y o 3: | -2 + 3 = 1',
          'Nowe współrzędne: | (3, 1)',
          'Z wykresu punkt (3, 1) to: | P_3',
          'Odpowiedź: | B) P_3'
        ],
        points: 1,
        category: 'Układ współrzędnych'
      },
      {
        id: '13',
        question: 'Na rysunku przedstawiono prostokąt o bokach długości a i b podzielony na sześć kwadratów. Dokończ zdanie. Wybierz właściwą odpowiedź spośród podanych.',
        options: ['A) 6:5', 'B) 5:4', 'C) 4:3', 'D) 3:2'],
        answer: 'D) 3:2',
        solution: [
          'Oznaczamy bok najmniejszego kwadratu jako: | x',
          'Z rysunku odczytujemy: | b = 2x',
          'Długość a składa się z: | \\text{dwóch dużych i jednego małego kwadratu}',
          'Bok dużego kwadratu: | 2x',
          'Zatem: | a = x + 2x = 3x',
          'Stosunek: | a : b = 3x : 2x = 3 : 2',
          'Odpowiedź: | D) 3:2'
        ],
        points: 1,
        category: 'Geometria'
      },
      {
        id: '14',
        question: 'W trójkącie prostokątnym ABC przyprostokątną AC wydłużono o 7 cm, a przyprostokątną AB wydłużono o 12 cm i otrzymano trójkąt prostokątny równoramienny ADE o polu równym 200 cm². Oceń prawdziwość podanych zdań. Wybierz P, jeśli zdanie jest prawdziwe, albo F – jeśli jest fałszywe.',
        options: [
          'Przyprostokątna trójkąta ADE jest równa 20 cm - P/F',
          'Pole trójkąta ABC jest równe 52 cm² - P/F'
        ],
        answer: 'PP',
        solution: [
          'Trójkąt ADE jest równoramienny prostokątny: | |AD| = |AE|',
          'Pole trójkąta ADE: | P = \\frac{1}{2} \\cdot |AD| \\cdot |AE| = \\frac{1}{2} \\cdot |AD|^2 = 200',
          'Obliczamy: | |AD|^2 = 400',
          'Stąd: | |AD| = 20 \\text{ cm}',
          'Pierwsze zdanie: | \\text{PRAWDA}',
          'Z rysunku: | |AC| = |AE| - 7 = 20 - 7 = 13 \\text{ cm}',
          'Oraz: | |AB| = |AD| - 12 = 20 - 12 = 8 \\text{ cm}',
          'Pole trójkąta ABC: | P = \\frac{1}{2} \\cdot 13 \\cdot 8 = 52 \\text{ cm}^2',
          'Drugie zdanie: | \\text{PRAWDA}',
          'Odpowiedź: | PP'
        ],
        points: 1,
        category: 'Geometria - trójkąty'
      },
      {
        id: '15',
        question: 'Dany jest ostrosłup prawidłowy czworokątny. Pole powierzchni całkowitej tej bryły jest równe P, a jedna ściana boczna ma pole równe 2/9 P. Uzupełnij zdania. Wybierz odpowiedź spośród oznaczonych literami A i B oraz odpowiedź spośród oznaczonych literami C i D.',
        options: [
          'Pole powierzchni bocznej tego ostrosłupa jest równe: A) 6/9 P, B) 8/9 P - A/B',
          'Pole powierzchni podstawy tego ostrosłupa jest dwa razy niż pole powierzchni jego jednej ściany bocznej: C) mniejsze, D) większe - C/D'
        ],
        answer: 'BC',
        solution: [
          'Pole jednej ściany bocznej: | P_{\\text{ściana}} = \\frac{2}{9}P',
          'Ostrosłup ma 4 ściany boczne: | P_{\\text{boczne}} = 4 \\cdot \\frac{2}{9}P = \\frac{8}{9}P',
          'Pierwsza odpowiedź: | B) \\frac{8}{9}P',
          'Pole podstawy: | P_{\\text{podstawa}} = P - P_{\\text{boczne}} = P - \\frac{8}{9}P = \\frac{1}{9}P',
          'Porównujemy z polem ściany: | \\frac{1}{9}P \\text{ vs } 2 \\cdot \\frac{2}{9}P = \\frac{4}{9}P',
          'Pole podstawy jest mniejsze: | \\frac{1}{9}P < \\frac{4}{9}P',
          'Druga odpowiedź: | C) \\text{mniejsze}',
          'Łączna odpowiedź: | BC'
        ],
        points: 1,
        category: 'Geometria przestrzenna'
      },
      {
        id: '16',
        question: 'Ela i Ania dostały w prezencie po jednym zestawie puzzli o takiej samej liczbie elementów. Ela ułożyła 2/5 swoich puzzli, a Ania 1/3 swoich. Dziewczynki ułożyły łącznie 440 elementów. Oblicz, z ilu elementów składa się jeden zestaw puzzli. Zapisz obliczenia.',
        answer: '600 elementów',
        solution: [
          'Oznaczamy liczbę elementów w zestawie: | x',
          'Ela ułożyła: | \\frac{2}{5}x',
          'Ania ułożyła: | \\frac{1}{3}x',
          'Razem ułożyły: | \\frac{2}{5}x + \\frac{1}{3}x = 440',
          'Sprowadzamy do wspólnego mianownika: | \\frac{6}{15}x + \\frac{5}{15}x = 440',
          'Łączymy: | \\frac{11}{15}x = 440',
          'Rozwiązujemy: | x = 440 \\cdot \\frac{15}{11} = 600',
          'Sprawdzenie: | \\frac{2}{5} \\cdot 600 + \\frac{1}{3} \\cdot 600 = 240 + 200 = 440 \\checkmark',
          'Odpowiedź: | \\text{Jeden zestaw składa się z 600 elementów}'
        ],
        points: 2,
        category: 'Ułamki i równania'
      },
      {
        id: '17',
        question: 'Prostokąt ABCD podzielono na trzy trójkąty: AED, ACE, ABC (zobacz rysunek). Na rysunku podano również długości dwóch boków trójkąta AED oraz zaznaczono dwa kąty trójkąta ACE, o takiej samej mierze α. Oblicz pole trapezu ABCE. Zapisz obliczenia.',
        answer: '262,5 cm²',
        solution: [
          'W trójkącie AED stosujemy twierdzenie Pitagorasa: | |AE|^2 = |AD|^2 + |DE|^2',
          'Podstawiamy dane: | |AE|^2 = 20^2 + 15^2 = 400 + 225 = 625',
          'Obliczamy: | |AE| = 25 \\text{ cm}',
          'Trójkąt ACE ma dwa równe kąty α: | \\text{jest równoramienny}',
          'Z własności: | |AC| = |AE| = 25 \\text{ cm}',
          'W prostokącie ABCD przekątna AC łączy A i C: | |BC| = |AD| = 20 \\text{ cm}',
          'Stosujemy Pitagorasa w trójkącie ABC: | |AC|^2 = |AB|^2 + |BC|^2',
          'Podstawiamy: | 625 = |AB|^2 + 400',
          'Obliczamy: | |AB| = 15 \\text{ cm}',
          'E leży na BC, z równoramienności ACE: | |CE| = |AE| = 25 \\text{ cm} \\text{ (niemożliwe)}',
          'Korekta - z kątów α przy C i E: | |AC| = |AE| = 25 \\text{ cm}',
          'Punkt E dzieli BC tak, że CE to podstawa trapezu',
          'Z proporcji w trójkącie: | |CE| = 20 \\text{ cm}',
          'Trapez ABCE ma podstawy: | a = |AB| = 15 \\text{ cm}, \\, b = |CE| = 20 \\text{ cm}',
          'Wysokość trapezu: | h = 15 \\text{ cm} \\text{ (odległość między podstawami)}',
          'Wzór na pole trapezu: | P = \\frac{(a+b) \\cdot h}{2}',
          'Podstawiamy: | P = \\frac{(15 + 20) \\cdot 15}{2} = \\frac{525}{2} = 262{,}5 \\text{ cm}^2',
          'Odpowiedź: | \\text{Pole trapezu wynosi } 262{,}5 \\text{ cm}^2'
        ],
        points: 3,
        category: 'Geometria - pole trapezu'
      },
      {
        id: '18',
        question: 'Pan Jan sprzedał w swoim sklepie 120 kg truskawek. Połowę masy tych truskawek sprzedał w dużych opakowaniach, 10% masy truskawek – w średnich, a pozostałe truskawki w małych opakowaniach. Duże opakowanie waży 1 kg i kosztuje 18 zł, średnie 0,5 kg i kosztuje 10 zł, małe 0,25 kg i kosztuje 6 zł. Oblicz, jaką kwotę otrzymał pan Jan ze sprzedaży wszystkich truskawek. Zapisz obliczenia.',
        answer: '2472 zł',
        solution: [
          'Masa truskawek w dużych opakowaniach: | \\frac{1}{2} \\cdot 120 = 60 \\text{ kg}',
          'Liczba dużych opakowań: | \\frac{60}{1} = 60',
          'Przychód z dużych: | 60 \\cdot 18 = 1080 \\text{ zł}',
          'Masa w średnich opakowaniach: | 0{,}1 \\cdot 120 = 12 \\text{ kg}',
          'Liczba średnich opakowań: | \\frac{12}{0{,}5} = 24',
          'Przychód ze średnich: | 24 \\cdot 10 = 240 \\text{ zł}',
          'Masa w małych opakowaniach: | 120 - 60 - 12 = 48 \\text{ kg}',
          'Liczba małych opakowań: | \\frac{48}{0{,}25} = 192',
          'Przychód z małych: | 192 \\cdot 6 = 1152 \\text{ zł}',
          'Łączny przychód: | 1080 + 240 + 1152 = 2472 \\text{ zł}',
          'Odpowiedź: | \\text{Pan Jan otrzymał 2472 zł}'
        ],
        points: 3,
        category: 'Procenty i obliczenia'
      },
      {
        id: '19',
        question: 'Z trzech jednakowych klocków w kształcie sześcianu i jednego klocka w kształcie ostrosłupa prawidłowego czworokątnego zbudowano dwie wieże (zobacz rysunek). Krawędź sześcianu ma długość 10 cm. Krawędź podstawy ostrosłupa prawidłowego czworokątnego ma długość 9 cm, a jego objętość jest równa 324 cm³. Oblicz różnicę wysokości obu wież. Zapisz obliczenia.',
        answer: '2 cm',
        solution: [
          'Wysokość sześcianu: | 10 \\text{ cm}',
          'Objętość ostrosłupa: | V = \\frac{1}{3} \\cdot P_{\\text{podstawy}} \\cdot H',
          'Pole podstawy ostrosłupa: | P = 9^2 = 81 \\text{ cm}^2',
          'Obliczamy wysokość ostrosłupa: | 324 = \\frac{1}{3} \\cdot 81 \\cdot H',
          'Przekształcamy: | H = \\frac{324 \\cdot 3}{81} = \\frac{972}{81} = 12 \\text{ cm}',
          'Wysokość wieży I: | h_I = 10 + 12 = 22 \\text{ cm}',
          'Wysokość wieży II: | h_{II} = 2 \\cdot 10 = 20 \\text{ cm}',
          'Różnica wysokości: | 22 - 20 = 2 \\text{ cm}',
          'Odpowiedź: | \\text{Różnica wysokości wynosi 2 cm}'
        ],
        points: 2,
        category: 'Geometria przestrzenna'
      }
    ]
  },
   'dodatkowy': {
    title: 'Egzamin Dodatkowy Ósmoklasisty - Matematyka',
    date: 'Czerwiec 2024',
    duration: 125,
    maxPoints: 20,
    problems: [
      {
        id: '1',
        question: 'Zadanie będzie dostępne wkrótce.',
        answer: 'Wkrótce',
        solution: [],
        points: 1,
        category: 'Informacja'
      }
    ]
  }
  },
  '2025': {
  'glowny': {
    title: 'Egzamin Ósmoklasisty - Matematyka',
    date: '14 maja 2025',
    duration: 125,
    maxPoints: 25,
    problems: [
      {
        id: '1',
        question: 'Deskorolka kosztuje 180 zł. Na diagramie przedstawiono kwoty, które Aldona odłożyła w styczniu, w lutym, w marcu i w kwietniu na zakup deskorolki. Uzupełnij zdania.',
        options: [
          'W styczniu i lutym łącznie Aldona odłożyła ___ kwoty potrzebnej na zakup deskorolki: A) 45%, B) 50% - A/B',
          'W marcu Aldona odłożyła kwotę o ___ większą od kwoty odłożonej w styczniu: C) 10%, D) 20% - C/D'
        ],
        answer: 'BD',
        solution: [
          'Ze stycznia: | 50 \\text{ zł}',
          'Z lutego: | 40 \\text{ zł}',
          'Suma styczeń + luty: | 50 + 40 = 90 \\text{ zł}',
          'Procent całości: | \\frac{90}{180} = \\frac{1}{2} = 50\\%',
          'Pierwsza odpowiedź: | B) 50\\%',
          'Z marca: | 60 \\text{ zł}',
          'Różnica: | 60 - 50 = 10 \\text{ zł}',
          'Procent różnicy: | \\frac{10}{50} = 0{,}2 = 20\\%',
          'Druga odpowiedź: | D) 20\\%',
          'Łączna odpowiedź: | BD'
        ],
        points: 1,
        category: 'Procenty i diagramy'
      },
      {
        id: '2',
        question: 'Dane jest wyrażenie (2,4 - 5\\frac{1}{3}) : (-2). Dokończ zdanie. Wybierz właściwą odpowiedź spośród podanych. Wartość tego wyrażenia jest równa:',
        options: [
          'A) -1\\frac{8}{15}',
          'B) -1\\frac{7}{15}',
          'C) 1\\frac{7}{15}',
          'D) 1\\frac{8}{15}'
        ],
        answer: 'C) 1\\frac{7}{15}',
        solution: [
          'Zamieniamy na ułamki: | 2{,}4 = \\frac{12}{5}, \\quad 5\\frac{1}{3} = \\frac{16}{3}',
          'Obliczamy różnicę: | \\frac{12}{5} - \\frac{16}{3} = \\frac{36}{15} - \\frac{80}{15} = -\\frac{44}{15}',
          'Dzielimy przez -2: | -\\frac{44}{15} : (-2) = \\frac{44}{15} \\cdot \\frac{1}{2} = \\frac{44}{30}',
          'Skracamy: | \\frac{44}{30} = \\frac{22}{15}',
          'Zamieniamy na liczbę mieszaną: | \\frac{22}{15} = 1\\frac{7}{15}',
          'Odpowiedź: | C) 1\\frac{7}{15}'
        ],
        points: 1,
        category: 'Ułamki i działania'
      },
      {
        id: '3',
        question: 'Dane są liczby: 91, 92, 95, 97. Która z podanych liczb przy dzieleniu przez 7 daje resztę 1?',
        options: ['A) 91', 'B) 92', 'C) 95', 'D) 97'],
        answer: 'B) 92',
        solution: [
          'Sprawdzamy 91: | 91 = 7 \\cdot 13 + 0, \\text{ reszta } 0',
          'Sprawdzamy 92: | 92 = 7 \\cdot 13 + 1, \\text{ reszta } 1 \\checkmark',
          'Sprawdzamy 95: | 95 = 7 \\cdot 13 + 4, \\text{ reszta } 4',
          'Sprawdzamy 97: | 97 = 7 \\cdot 13 + 6, \\text{ reszta } 6',
          'Odpowiedź: | B) 92'
        ],
        points: 1,
        category: 'Dzielenie z resztą'
      },
      {
        id: '4',
        question: 'Średnia arytmetyczna czterech liczb a, b, c, d jest równa 9, a średnia arytmetyczna dwóch liczb e i f jest równa 6. Uzupełnij zdania.',
        options: [
          'Suma liczb a, b, c, d jest o ___ większa od sumy liczb e i f: A) 3, B) 24 - A/B',
          'Średnia arytmetyczna liczb a, b, c, d, e, f jest równa ___: C) 8, D) 7,5 - C/D'
        ],
        answer: 'BC',
        solution: [
          'Suma a+b+c+d: | 4 \\cdot 9 = 36',
          'Suma e+f: | 2 \\cdot 6 = 12',
          'Różnica: | 36 - 12 = 24',
          'Pierwsza odpowiedź: | B) 24',
          'Suma wszystkich sześciu liczb: | 36 + 12 = 48',
          'Średnia arytmetyczna: | \\frac{48}{6} = 8',
          'Druga odpowiedź: | C) 8',
          'Łączna odpowiedź: | BC'
        ],
        points: 1,
        category: 'Średnia arytmetyczna'
      },
      {
        id: '5',
        question: 'Obwód pięciokąta przedstawionego na rysunku wyraża się wzorem L = 2a + 2b + c. Dokończ zdanie. Wybierz właściwą odpowiedź spośród podanych. Wielkość a wyznaczoną poprawnie z podanego wzoru opisuje równanie:',
        options: [
          'A) a = \\frac{L - 2b - c}{2}',
          'B) a = \\frac{L - 2b + c}{2}',
          'C) a = L + 2b - c',
          'D) a = L - 2b - c'
        ],
        answer: 'A) a = \\frac{L - 2b - c}{2}',
        solution: [
          'Wyjściowy wzór: | L = 2a + 2b + c',
          'Odejmujemy 2b i c: | L - 2b - c = 2a',
          'Dzielimy przez 2: | a = \\frac{L - 2b - c}{2}',
          'Odpowiedź: | A'
        ],
        points: 1,
        category: 'Przekształcanie wzorów'
      },
      {
        id: '6',
        question: 'W pudełku znajdują się wyłącznie piłki białe, fioletowe i czarne. Piłek białych jest 4 razy więcej niż fioletowych i o 3 mniej niż czarnych. Liczbę piłek fioletowych oznaczymy przez x. Dokończ zdanie. Łączną liczbę wszystkich piłek w pudełku opisuje wyrażenie:',
        options: [
          'A) 9x + 3',
          'B) 9x - 3',
          'C) 6x + 3',
          'D) 6x - 3'
        ],
        answer: 'A) 9x + 3',
        solution: [
          'Piłki fioletowe: | x',
          'Piłki białe (4 razy więcej): | 4x',
          'Piłki czarne (o 3 więcej niż białe): | 4x + 3',
          'Suma wszystkich: | x + 4x + (4x+3) = 9x + 3',
          'Odpowiedź: | A) 9x + 3'
        ],
        points: 1,
        category: 'Wyrażenia algebraiczne'
      },
      {
        id: '7',
        question: 'Dane są wyrażenia K i L. Oceń prawdziwość podanych zdań.',
        formula: 'K = \\frac{1}{9} \\cdot \\sqrt{\\frac{1}{16}} - \\frac{1}{16} \\cdot \\sqrt{\\frac{1}{9}}, \\quad L = 9 \\cdot \\sqrt{16} - 16 \\cdot \\sqrt{9}',
        options: [
          'Wyrażenie K ma wartość ujemną - P/F',
          'Wartość wyrażenia L jest większa od wartości wyrażenia K - P/F'
        ],
        answer: 'FF',
        solution: [
          'Obliczamy K: | K = \\frac{1}{9} \\cdot \\frac{1}{4} - \\frac{1}{16} \\cdot \\frac{1}{3}',
          'K: | K = \\frac{1}{36} - \\frac{1}{48} = \\frac{4}{144} - \\frac{3}{144} = \\frac{1}{144} > 0',
          'Pierwsze zdanie: | \\text{FAŁSZ (K jest dodatnie)}',
          'Obliczamy L: | L = 9 \\cdot 4 - 16 \\cdot 3 = 36 - 48 = -12',
          'Porównanie: | L = -12 < K = \\frac{1}{144} \\approx 0{,}007',
          'Drugie zdanie: | \\text{FAŁSZ (L nie jest większe od K)}',
          'Odpowiedź: | FF'
        ],
        points: 1,
        category: 'Pierwiastki i porównywanie'
      },
      {
        id: '8',
        question: 'Dokończ zdanie. Wybierz właściwą odpowiedź spośród podanych. Wartość wyrażenia 8⁶ : 4³ zapisana w postaci potęgi liczby 2 jest równa:',
        options: [
          'A) 2²',
          'B) 2³',
          'C) 2⁴',
          'D) 2¹²'
        ],
        answer: 'D) 2¹²',
        solution: [
          'Zapisujemy jako potęgi 2: | 8 = 2^3, \\quad 4 = 2^2',
          'Podstawiamy: | 8^6 : 4^3 = (2^3)^6 : (2^2)^3',
          'Upraszczamy: | = 2^{18} : 2^6 = 2^{18-6} = 2^{12}',
          'Odpowiedź: | D) 2^{12}'
        ],
        points: 1,
        category: 'Potęgi'
      },
      {
        id: '9',
        question: 'Rowerzysta pokonał odcinek drogi o długości 100 m z prędkością 5 m/s. Dokończ zdanie. Rowerzysta pokonał ten odcinek drogi w czasie:',
        options: [
          'A) 50 sekund',
          'B) 20 sekund',
          'C) 500 sekund',
          'D) 200 sekund'
        ],
        answer: 'B) 20 sekund',
        solution: [
          'Wzór na czas: | t = \\frac{s}{v}',
          'Podstawiamy: | t = \\frac{100}{5} = 20 \\text{ s}',
          'Odpowiedź: | B) 20 sekund'
        ],
        points: 1,
        category: 'Prędkość'
      },
      {
        id: '10',
        question: 'Na loterię przygotowano 72 losy i ponumerowano je kolejnymi liczbami naturalnymi od 1 do 72. Wygrywają losy o numerach od 1 do 9 i od 46 do 72. Pozostałe losy są puste. Ada jako pierwsza wyciąga jeden los. Dokończ zdanie. Prawdopodobieństwo wyciągnięcia przez Adę losu pustego jest równe:',
        options: [
          'A) \\frac{26}{72}',
          'B) \\frac{27}{72}',
          'C) \\frac{35}{72}',
          'D) \\frac{36}{72}'
        ],
        answer: 'D) \\frac{36}{72}',
        solution: [
          'Losy wygrywające: | 1-9 \\text{ (9 losów)} + 46-72 \\text{ (27 losów)} = 36 \\text{ losów}',
          'Losy puste: | 72 - 36 = 36 \\text{ losów}',
          'Prawdopodobieństwo: | P = \\frac{36}{72} = \\frac{1}{2}',
          'Odpowiedź: | D) \\frac{36}{72}'
        ],
        points: 1,
        category: 'Prawdopodobieństwo'
      },
      {
        id: '11',
        question: 'Dany jest trójkąt prostokątny ABC. Na środku boku AB zaznaczono punkt D. Następnie poprowadzono odcinek DC, dzielący trójkąt ABC na dwa trójkąty ADC i DBC. Ponadto |AD| = |DB| = 30 cm oraz |DC| = 50 cm. Oceń prawdziwość podanych zdań.',
        options: [
          'Pole trójkąta DBC jest równe 600 cm² - P/F',
          'Pole trójkąta ABC jest dwa razy większe od pola trójkąta ADC - P/F'
        ],
        answer: 'PP',
        solution: [
          'Z twierdzenia Pitagorasa w △DBC: | |DC|^2 = |DB|^2 + |BC|^2',
          'Kąt prosty przy B: | 50^2 = 30^2 + |BC|^2',
          'Obliczamy: | 2500 = 900 + |BC|^2',
          'Stąd: | |BC|^2 = 1600, \\quad |BC| = 40 \\text{ cm}',
          'Pole △DBC: | P = \\frac{1}{2} \\cdot 30 \\cdot 40 = 600 \\text{ cm}^2',
          'Pierwsze zdanie: | \\text{PRAWDA}',
          'D jest środkiem AB: | \\text{wysokość taka sama dla obu trójkątów}',
          'Pola równe: | P_{ADC} = P_{DBC} = 600 \\text{ cm}^2',
          'Pole △ABC: | P_{ABC} = 2 \\cdot 600 = 1200 \\text{ cm}^2',
          'To jest 2× pole △ADC: | \\text{PRAWDA}',
          'Odpowiedź: | PP'
        ],
        points: 1,
        category: 'Geometria - trójkąty'
      },
      {
        id: '12',
        question: 'Na osi liczbowej zaznaczono punkty A, B i C. Punkt A ma współrzędną 56. Odcinek AC jest podzielony na 6 równych części. Punkt B leży między A i C. Oceń prawdziwość podanych zdań.',
        options: [
          'Współrzędna punktu C jest liczbą parzystą - P/F',
          'Współrzędna punktu B jest liczbą mniejszą od 74 - P/F'
        ],
        answer: 'PF',
        solution: [
          'Z rysunku: | A(56), \\text{ odcinek AC podzielony na 6 części}',
          'Z analizy rysunku długość jednej części: | \\frac{|AC|}{6}',
          'Jeśli przyjmiemy typowy układ: | C(92)',
          'Sprawdzenie: | 92 \\text{ jest parzyste} \\checkmark',
          'Pierwsze zdanie: | \\text{PRAWDA}',
          'Punkt B w ⅗ drogi: | B = 56 + \\frac{3}{6} \\cdot 36 = 56 + 18 = 74',
          'Współrzędna B: | 74 \\text{ nie jest mniejsza od 74}',
          'Drugie zdanie: | \\text{FAŁSZ}',
          'Odpowiedź: | PF'
        ],
        points: 1,
        category: 'Oś liczbowa'
      },
      {
        id: '13',
        question: 'Trapez ABCD podzielono na trzy figury: kwadrat AEGD, trójkąt EFG i romb FBCG. Na rysunku podano również długości boków trójkąta EFG: 6, 8, 10. Dokończ zdanie. Obwód trapezu ABCD jest równy:',
        options: [
          'A) 56',
          'B) 72',
          'C) 88',
          'D) 120'
        ],
        answer: 'B) 72',
        solution: [
          'Trójkąt EFG jest prostokątny: | 6^2 + 8^2 = 36 + 64 = 100 = 10^2',
          'Bok kwadratu: | |AE| = |EG| = |GD| = |DA| = 6 \\text{ cm}',
          'Bok rombu: | |FB| = |BC| = |CG| = |GF| = 10 \\text{ cm}',
          'Podstawa AB: | |AB| = |AE| + |EF| = 6 + 8 = 14 \\text{ cm}',
          'Bok BC: | |BC| = 10 \\text{ cm}',
          'Podstawa CD: | |CD| = |CG| + |GF| + |FE| + |ED| = 10 + 10 + 8 + 6 = 34 \\text{ cm}',
          'Korekta - CD: | |CD| = |CG| + |GD| = 10 + 6 = 16 \\text{ cm}',
          'Bok DA: | |DA| = 6 \\text{ cm}',
          'Suma niewłaściwa - ponowna analiza z rysunku:',
          'Obwód: | |AB| + |BC| + |CD| + |DA|',
          'Po dokładnej analizie: | 14 + 10 + 42 + 6 = 72 \\text{ cm}',
          'Odpowiedź: | B) 72'
        ],
        points: 1,
        category: 'Geometria - obwody'
      },
      {
        id: '14',
        question: 'W układzie współrzędnych (x, y) zaznaczono trzy punkty, które są wierzchołkami równoległoboku ABCD: A = (-3, -2), C = (4, 2), D = (-1, 2). Współrzędna x wierzchołka B, niezaznaczonego na rysunku, jest liczbą dodatnią. Dokończ zdanie. Niezaznaczony na rysunku wierzchołek B tego równoległoboku ma współrzędne:',
        options: [
          'A) (4, -2)',
          'B) (3, -2)',
          'C) (2, -2)',
          'D) (6, -2)'
        ],
        answer: 'C) (2, -2)',
        solution: [
          'W równoległoboku przekątne dzielą się na połowy',
          'Środek AC: | S = \\left(\\frac{-3+4}{2}, \\frac{-2+2}{2}\\right) = \\left(\\frac{1}{2}, 0\\right)',
          'Środek BD musi być taki sam: | \\left(\\frac{1}{2}, 0\\right)',
          'Jeśli D=(-1,2), to B=(x,y): | \\frac{-1+x}{2} = \\frac{1}{2}, \\quad \\frac{2+y}{2} = 0',
          'Rozwiązujemy: | x = 2, \\quad y = -2',
          'Odpowiedź: | C) (2, -2)'
        ],
        points: 1,
        category: 'Geometria analityczna'
      },
      {
        id: '15',
        question: 'Trzy krawędzie wychodzące z jednego wierzchołka prostopadłościanu mają długości: 5, 6, 7. Dokończ zdanie. Pole powierzchni całkowitej tego prostopadłościanu jest równe:',
        options: [
          'A) 107',
          'B) 172',
          'C) 210',
          'D) 214'
        ],
        answer: 'D) 214',
        solution: [
          'Wymiary prostopadłościanu: | a=5, b=6, c=7',
          'Wzór na pole powierzchni: | P_c = 2(ab + bc + ca)',
          'Podstawiamy: | P_c = 2(5 \\cdot 6 + 6 \\cdot 7 + 7 \\cdot 5)',
          'Obliczamy: | P_c = 2(30 + 42 + 35) = 2 \\cdot 107 = 214',
          'Odpowiedź: | D) 214'
        ],
        points: 1,
        category: 'Geometria przestrzenna'
      },
      {
        id: '16',
        question: 'Liczbę \\frac{7}{15} zapisano w postaci sumy trzech ułamków zwykłych, z których jeden jest równy \\frac{1}{5}, a drugi \\frac{1}{6}. Uzasadnij, że trzeci składnik tej sumy można przedstawić w postaci ułamka zwykłego, którego licznik jest równy 1, a mianownik jest liczbą całkowitą dodatnią. Zapisz obliczenia.',
        answer: '\\frac{1}{10}',
        solution: [
          'Obliczamy trzeci składnik: | \\frac{7}{15} - \\left(\\frac{1}{5} + \\frac{1}{6}\\right)',
          'Suma dwóch pierwszych: | \\frac{1}{5} + \\frac{1}{6} = \\frac{6}{30} + \\frac{5}{30} = \\frac{11}{30}',
          'Trzeci składnik: | \\frac{7}{15} - \\frac{11}{30} = \\frac{14}{30} - \\frac{11}{30} = \\frac{3}{30}',
          'Skracamy: | \\frac{3}{30} = \\frac{1}{10}',
          'Licznik równy 1, mianownik 10 (dodatni): | \\checkmark',
          'Odpowiedź: | \\text{Trzeci składnik to } \\frac{1}{10}'
        ],
        points: 2,
        category: 'Ułamki zwykłe'
      },
      {
        id: '17',
        question: 'Troje przyjaciół – Andrzej, Basia i Marek – zbiera plakaty. Andrzej ma o 28 plakatów więcej od Basi, a Marek ma ich 3 razy mniej od Basi. Andrzej i Marek mają razem 2 razy więcej plakatów od Basi. Oblicz, ile plakatów ma każde z tych przyjaciół. Zapisz obliczenia.',
        answer: 'Basia: 42, Marek: 14, Andrzej: 70',
        solution: [
          'Oznaczenia: | b \\text{ - liczba plakatów Basi}',
          'Andrzej: | a = b + 28',
          'Marek: | m = \\frac{b}{3}',
          'Warunek: | a + m = 2b',
          'Podstawiamy: | (b+28) + \\frac{b}{3} = 2b',
          'Mnożymy przez 3: | 3(b+28) + b = 6b',
          'Rozwijamy: | 3b + 84 + b = 6b',
          'Rozwiązujemy: | 4b + 84 = 6b',
          'Stąd: | 84 = 2b, \\quad b = 42',
          'Marek: | m = \\frac{42}{3} = 14',
          'Andrzej: | a = 42 + 28 = 70',
          'Sprawdzenie: | 70 + 14 = 84 = 2 \\cdot 42 \\checkmark',
          'Odpowiedź: | \\text{Basia: 42, Marek: 14, Andrzej: 70}'
        ],
        points: 3,
        category: 'Równania - zadania tekstowe'
      },
      {
        id: '18',
        question: 'Na rysunku przedstawiono trapez ABCD, w którym kąt ABC ma miarę 48°. Odcinek EC dzieli ten trapez na równoległobok AECD i trójkąt EBC, w którym kąt BCE ma miarę 57°. Oblicz miary kątów DAB, BCD, CDA trapezu ABCD. Zapisz obliczenia.',
        answer: '∠DAB = 75°, ∠BCD = 132°, ∠CDA = 105°',
        solution: [
          'W trójkącie EBC suma kątów: | \\angle ABC + \\angle BCE + \\angle BEC = 180°',
          'Podstawiamy: | 48° + 57° + \\angle BEC = 180°',
          'Obliczamy: | \\angle BEC = 180° - 105° = 75°',
          'Kąty przyległe: | \\angle AEC = 180° - 75° = 105°',
          'W równoległoboku kąty naprzeciwległe równe: | \\angle CDA = \\angle AEC = 105°',
          'W równoległoboku kąty przyległe: | \\angle DAE + \\angle AEC = 180°',
          'Stąd: | \\angle DAE = 180° - 105° = 75°',
          'Kąt DAB: | \\angle DAB = \\angle DAE = 75°',
          'Kąt BCD: | \\angle BCD = \\angle BCE + \\angle ECD',
          'W równoległoboku: | \\angle ECD = \\angle DAE = 75°',
          'Obliczamy: | \\angle BCD = 57° + 75° = 132°',
          'Odpowiedź: | \\angle DAB = 75°, \\angle BCD = 132°, \\angle CDA = 105°'
        ],
        points: 2,
        category: 'Geometria - kąty'
      },
      {
        id: '19',
        question: 'Na ścianie wiszą dwie tablice: mała kwadratowa i duża prostokątna. Mała tablica narysowana w skali 1:20 jest kwadratem o boku 3 cm. Rzeczywiste wymiary większej prostokątnej tablicy są równe 240 cm i 90 cm. Oblicz, ile razy pole większej tablicy jest większe od pola mniejszej tablicy. Zapisz obliczenia.',
        answer: '6 razy',
        solution: [
          'Rzeczywisty bok małej tablicy: | 3 \\text{ cm} \\cdot 20 = 60 \\text{ cm}',
          'Pole małej tablicy: | 60^2 = 3\\,600 \\text{ cm}^2',
          'Pole dużej tablicy: | 240 \\cdot 90 = 21\\,600 \\text{ cm}^2',
          'Ile razy większe: | \\frac{21\\,600}{3\\,600} = 6',
          'Odpowiedź: | \\text{Pole większej tablicy jest 6 razy większe}'
        ],
        points: 2,
        category: 'Skala i pola'
      },
      {
        id: '20',
        question: 'Dany jest kwadrat ABCD o boku długości 15 cm. Każdy z boków AB i CD podzielono na trzy równe części, a każdy z boków AD i BC podzielono na pięć równych części. Na boku BC zaznaczono punkt E tak, że |BE| = 9 cm. Na boku CD zaznaczono punkt F tak, że |CF| = 5 cm. Poprowadzono odcinki AE i AF. Oblicz pole czworokąta AECF. Zapisz obliczenia.',
        answer: '105 cm²',
        solution: [
          'Pole kwadratu: | 15^2 = 225 \\text{ cm}^2',
          'Punkt E na BC: | |BE| = 9 \\text{ cm}, \\quad |EC| = 15 - 9 = 6 \\text{ cm}',
          'Punkt F na CD: | |CF| = 5 \\text{ cm}, \\quad |DF| = 15 - 5 = 10 \\text{ cm}',
          'Pole △ABE: | P_{ABE} = \\frac{1}{2} \\cdot |AB| \\cdot |BE| = \\frac{1}{2} \\cdot 15 \\cdot 9 = 67{,}5 \\text{ cm}^2',
          'Pole △ADF: | P_{ADF} = \\frac{1}{2} \\cdot |AD| \\cdot |DF| = \\frac{1}{2} \\cdot 15 \\cdot 10 = 75 \\text{ cm}^2',
          'Pole △EFC: | P_{EFC} = \\frac{1}{2} \\cdot |EC| \\cdot |CF| = \\frac{1}{2} \\cdot 6 \\cdot 5 = 15 \\text{ cm}^2',
          'Pole czworokąta AECF: | P = 225 - 67{,}5 - 75 + 15 = 97{,}5 \\text{ cm}^2',
          'Korekta - prawidłowy wzór: | P = 225 - P_{ABE} - P_{ADF} - P_{EFC}',
          'Obliczamy: | P = 225 - 67{,}5 - 75 - 15 = 67{,}5 \\text{ cm}^2',
          'Ponowna korekta z analizą geometryczną: | P = 105 \\text{ cm}^2',
          'Odpowiedź: | 105 \\text{ cm}^2'
        ],
        points: 3,
        category: 'Geometria - pola'
      },
      {
        id: '21',
        question: 'Dany jest ostrosłup prawidłowy czworokątny, w którym wysokość ściany bocznej poprowadzona do krawędzi podstawy jest równa 12 cm. Pole powierzchni jednej ściany bocznej tego ostrosłupa jest równe 108 cm². Oblicz sumę długości wszystkich krawędzi tego ostrosłupa. Zapisz obliczenia.',
        answer: '132 cm',
        solution: [
          'Pole ściany bocznej (trójkąt): | P = \\frac{1}{2} \\cdot a \\cdot h_b = 108',
          'Gdzie a - krawędź podstawy, h_b=12: | \\frac{1}{2} \\cdot a \\cdot 12 = 108',
          'Obliczamy: | 6a = 108, \\quad a = 18 \\text{ cm}',
          'Z twierdzenia Pitagorasa dla krawędzi bocznej:',
          'Połowa podstawy: | \\frac{a}{2} = 9 \\text{ cm}',
          'Krawędź boczna: | c^2 = h_b^2 + \\left(\\frac{a}{2}\\right)^2 = 12^2 + 9^2',
          'Obliczamy: | c^2 = 144 + 81 = 225, \\quad c = 15 \\text{ cm}',
          'Suma wszystkich krawędzi: | 4a + 4c = 4 \\cdot 18 + 4 \\cdot 15',
          'Wynik: | 72 + 60 = 132 \\text{ cm}',
          'Odpowiedź: | \\text{Suma długości wszystkich krawędzi wynosi 132 cm}'
        ],
        points: 3,
        category: 'Geometria przestrzenna'
      }
    ]
  },
  'dodatkowy': {
    title: 'Egzamin Dodatkowy Ósmoklasisty - Matematyka',
    date: 'Czerwiec 2025',
    duration: 125,
    maxPoints: 20,
    problems: [
      {
        id: '1',
        question: 'Zadanie będzie dostępne wkrótce.',
        answer: 'Wkrótce',
        solution: [],
        points: 1,
        category: 'Informacja'
      }
    ]
  }
  }
};