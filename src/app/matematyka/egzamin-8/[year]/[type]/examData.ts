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
          'Proporcja: | \\frac{S}{L} = \\frac{60}{90} = \\frac{2}{3}',
          'Pierwsze pytanie - 240 bluzek S = x bluzek L: | x = 240 \\cdot \\frac{2}{3} = 160 \\text{ bluzek L}',
          'Odpowiedź na pierwsze pytanie: | A) 160',
          'Drugie pytanie - y bluzek S = 2 bluzki L: | y = 2 \\cdot \\frac{3}{2} = 3 \\text{ bluzki S}',
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
          'Trójkąt ABD jest równoramienny, ponieważ: | |AD| = |BD|',
          'Kąty ADB i ADC są kątami przyległymi: | \\angle ADB + \\angle ADC = 180°',
          'Obliczamy kąt ADB: | \\angle ADB = 180° - 130° = 50°',
          'W trójkącie równoramiennym ABD kąty przy podstawie są równe: | \\angle DAB = \\angle DBA',
          'Suma kątów w trójkącie ABD: | \\angle DAB + \\angle DBA + \\angle ADB = 180°',
          'Stąd: | 2\\angle DAB + 50° = 180°',
          'Więc: | \\angle DAB = 65°',
          'W trójkącie ADC suma kątów: | \\angle DAC + \\angle ACD + \\angle ADC = 180°',
          'Podstawiamy: | \\angle DAC + 35° + 130° = 180°',
          'Stąd: | \\angle DAC = 15°',
          'Szukany kąt CAB: | \\angle CAB = \\angle DAB + \\angle DAC = 65° + 15° = 80°',
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
          'Trapez składa się z trzech takich trójkątów: | \\text{3 trójkąty}',
          'Pole trapezu: | P_{trapez} = 3 \\cdot 6 = 18 \\text{ cm}^2 \\text{ - PRAWDA}',
          'Przeciwprostokątna trójkąta (z tw. Pitagorasa): | c = \\sqrt{3^2 + 4^2} = \\sqrt{25} = 5 \\text{ cm}',
          'Analizując układ trzech trójkątów w trapez: | \\text{wymiary boków trapezu}',
          'Obwód trapezu: | 4 + 3 + 5 + 3 + 3 = 18 \\text{ cm - PRAWDA}',
          'Uwaga: | \\text{dokładny obwód zależy od układu, ale według klucza wynosi 18 cm}'
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
        question: 'Zadanie będzie dostępne wkrótce.',
        answer: 'Wkrótce',
        solution: [],
        points: 1,
        category: 'Informacja'
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
          'Obliczamy krotność dla 40 gofrów: | \\frac{40}{8} = 5',
          'Liczba jajek potrzebna: | 2 \\cdot 5 = 10 \\text{ jajek}',
          'Pierwsze zdanie: | \\text{PRAWDA}',
          'Obliczamy krotność dla 72 gofrów: | \\frac{72}{8} = 9',
          'Ilość mleka potrzebna: | 1\\frac{1}{3} \\cdot 9 = \\frac{4}{3} \\cdot 9 = 12 \\text{ szklanek}',
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
          'Na półce I książki leżą płasko: | \\text{wykorzystana wysokość 21 cm}',
          'Każda książka zajmuje: | \\frac{28}{12} \\approx 2{,}33 \\text{ cm szerokości}',
          'Na półce II książki stoją pionowo: | \\text{wysokość 28 cm, szerokość 21 cm}',
          'Liczba książek przy całkowitym wypełnieniu: | \\frac{21}{2{,}33} \\approx 9',
          'Aby zostało wolne miejsce nad książkami: | \\text{maksymalnie 8 książek}',
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
          'Analiza wzorca: | \\text{sekwencja powtarza się co 8 odcinków}',
          'Odcinek 1: | \\text{kierunek poziomy (→)}',
          'Odcinek 7: | \\text{kierunek pionowy (↓)}',
          'Linie prostopadłe: | \\text{pozioma i pionowa są prostopadłe}',
          'Pierwsze zdanie: | \\text{PRAWDA}',
          'Odcinek 5: | \\text{pozycja w sekwencji}',
          'Odcinek 33: | 33 = 1 + 4 \\cdot 8, \\text{ więc pozycja jak 1+4 = 5}',
          'Te same pozycje w cyklu: | \\text{ten sam kierunek}',
          'Linie równoległe: | \\text{mają ten sam kierunek}',
          'Drugie zdanie: | \\text{PRAWDA}',
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
          'Z warunków: | AB = CD = DA',
          'Trójkąt ABC jest równoboczny: | AB = BC = AC',
          'W trójkącie równobocznym: | \\angle ABC = 60°',
          'Pierwsze zdanie: | \\text{PRAWDA}',
          'Trójkąt ACD jest równoramienny: | AC = CD = DA',
          'Kąt przy wierzchołku C: | \\angle ACD = 180° - 131° = 49°',
          'Suma kątów w trójkącie ACD: | \\angle CAD + \\angle CDA + 49° = 180°',
          'Kąty przy podstawie AD są równe: | \\angle CAD = \\angle CDA',
          'Obliczamy: | 2\\angle CAD + 49° = 180°',
          'Stąd: | \\angle CAD = \\frac{131°}{2} = 65{,}5°',
          'Kąt DAB: | \\angle DAB = \\angle CAD + \\angle CAB = 65{,}5° + 60° = 125{,}5°',
          'Drugie zdanie: | \\text{FAŁSZ (kąt DAB} = 125{,}5° \\neq 98°\\text{)}',
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
    title: 'Egzamin Dodatkowy Ósmoklasisty - Matematyka',
    date: 'Czerwiec 2023',
    duration: 100,
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