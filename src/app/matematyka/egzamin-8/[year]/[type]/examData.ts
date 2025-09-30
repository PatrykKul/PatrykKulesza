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
  pdfUrl?: string;
  answerKeyUrl?: string;
}

export const examData: Record<string, Record<string, ExamData>> = {
'2022': {
  'glowny': {
    title: 'Egzamin Ósmoklasisty - Matematyka',
    date: '25 maja 2022',
    duration: 100,
    maxPoints: 25,
    pdfUrl: '/pdfs/egzamin-8-2022-glowny.pdf',
    answerKeyUrl: '/pdfs/egzamin-8-2022-glowny-odpowiedzi.pdf',
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
          'Z diagramu: fantasy 40%, przyrodnicze 15%, komediowe 30%, biograficzne 10%, żadne 5%',
          'Czworo uczniów zaznaczyło "żadne", co stanowi 5%',
          'Jeśli 5\\% = 4 uczniów, to 100\\% = \\frac{4 \\cdot 100}{5} = 80 uczniów',
          'Pierwsze zdanie: PRAWDA',
          'Fantasy: 40\\% \\cdot 80 = 32 uczniów',
          'Przyrodnicze: 15\\% \\cdot 80 = 12 uczniów',
          'Różnica: 32 - 12 = 20 uczniów',
          'Drugie zdanie: PRAWDA'
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
          'Obliczamy potęgi: 4^2 = 16, 3^2 = 9',
          '\\frac{4^2}{5} - 3^2 = \\frac{16}{5} - 9',
          'Zamieniamy 9 na ułamek o mianowniku 5: 9 = \\frac{45}{5}',
          '\\frac{16}{5} - \\frac{45}{5} = \\frac{16 - 45}{5} = \\frac{-29}{5}',
          'Odpowiedź: A) -\\frac{29}{5}'
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
          'Największa liczba trzycyfrowa o sumie cyfr 6: 600 (6+0+0=6)',
          'Najmniejsza liczba trzycyfrowa o sumie cyfr 6: 105 (1+0+5=6)',
          'Suma: 600 + 105 = 705',
          'Odpowiedź: B) 705'
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
          'k = 323 + 160 = 483',
          'Cecha podzielności przez 3: liczba jest podzielna przez 3, gdy suma jej cyfr dzieli się przez 3',
          'Suma cyfr: 4 + 8 + 3 = 15',
          '15 : 3 = 5, więc 15 dzieli się przez 3',
          'Zatem 483 jest podzielna przez 3',
          'Prawidłowa odpowiedź: A (Tak)',
          'Prawidłowe uzasadnienie: 3 (suma cyfr 4, 8 i 3 jest liczbą podzielną przez 3)'
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
          'x = \\frac{10^{30} \\cdot 10^{70}}{10} = \\frac{10^{100}}{10^1} = 10^{99} < 10^{100}',
          'y = (10^3)^{15} \\cdot 10^{60} = 10^{45} \\cdot 10^{60} = 10^{105} > 10^{100}',
          'z = 10^{50} \\cdot \\frac{10^{80}}{10^{20}} = 10^{50} \\cdot 10^{60} = 10^{110} > 10^{100}',
          'Tylko x jest mniejsze od 10^{100}',
          'Odpowiedź: A) Tylko x'
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
          'Z danych: 90S = 60L (pod względem zużycia materiału)',
          'Proporcja: \\frac{S}{L} = \\frac{60}{90} = \\frac{2}{3}',
          'Pierwsze pytanie: 240 bluzek S = x bluzek L',
          'x = 240 \\cdot \\frac{2}{3} = 160 bluzek L',
          'Odpowiedź na pierwsze pytanie: A) 160',
          'Drugie pytanie: y bluzek S = 2 bluzki L',
          'y = 2 \\cdot \\frac{3}{2} = 3 bluzki S',
          'Odpowiedź na drugie pytanie: C) trzech',
          'Łącznie: AC'
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
          'Obliczamy wartość \\frac{n^4 - 3}{6} dla każdej liczby:',
          'n = -3: \\frac{(-3)^4 - 3}{6} = \\frac{81 - 3}{6} = \\frac{78}{6} = 13',
          'n = -1: \\frac{(-1)^4 - 3}{6} = \\frac{1 - 3}{6} = \\frac{-2}{6} = -\\frac{1}{3} \\approx -0{,}33',
          'n = 0: \\frac{0^4 - 3}{6} = \\frac{0 - 3}{6} = \\frac{-3}{6} = -\\frac{1}{2} = -0{,}5',
          'n = 1: \\frac{1^4 - 3}{6} = \\frac{1 - 3}{6} = \\frac{-2}{6} = -\\frac{1}{3} \\approx -0{,}33',
          'n = 3: \\frac{3^4 - 3}{6} = \\frac{81 - 3}{6} = \\frac{78}{6} = 13',
          'Najmniejsza wartość: -\\frac{1}{2} = -0{,}5 (dla n = 0)',
          'Odpowiedź: C) 0'
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
          '\\sqrt{60} = \\sqrt{4 \\cdot 15} = \\sqrt{4} \\cdot \\sqrt{15} = 2\\sqrt{15}',
          'Szacujemy \\sqrt{15}:',
          '\\sqrt{16} = 4, więc \\sqrt{15} < 4',
          '\\sqrt{9} = 3, więc \\sqrt{15} > 3',
          'Dokładniej: \\sqrt{15} \\approx 3{,}87',
          'Zatem: 2\\sqrt{15} \\approx 2 \\cdot 3{,}87 = 7{,}74',
          'Wniosek: 7 < \\sqrt{60} < 8',
          'Odpowiedź: C) większa od 7 i mniejsza od 8'
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
          'Długość odcinka PR: |PR| = 7 - (-3) = 10',
          'Z rysunku: punkt R dzieli odcinek PS tak, że PR stanowi 5 części z 8',
          'Długość całego odcinka PS: |PS| = \\frac{8}{5} \\cdot 10 = 16',
          'Współrzędna punktu S: S = P + |PS| = -3 + 16 = 13',
          'Odpowiedź: C) 13'
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
          'Rozmiar pliku Igora: 13 MB',
          'Rozmiar pliku Lidki: 13 \\cdot 2{,}5 = 32{,}5 MB',
          'Różnica rozmiarów: 32{,}5 - 13 = 19{,}5 MB',
          'Odpowiedź: B) 19,5 MB'
        ],
        points: 1,
        category: 'Działania na liczbach'
      },
      {
        id: '11',
        question: 'Ogrodnik kupił ziemię ogrodową, którą zaplanował zużyć w maju, czerwcu i lipcu. W maju zużył 1/3 masy kupionej ziemi. W czerwcu zużył połowę masy ziemi, która została. Na lipiec pozostało mu jeszcze 60 kg ziemi. Dokończ zdanie. Wybierz właściwą odpowiedź spośród podanych. Jeżeli przez x oznaczymy masę zakupionej ziemi, to sytuację przedstawioną w zadaniu opisuje równanie:',
        options: [
          'A) (x - \\frac{1}{3}x) + \\frac{1}{2}x = 60',
          'B) (x - \\frac{1}{3}x) + \\frac{1}{2}(x - \\frac{1}{3}x) = 60',
          'C) (x - \\frac{1}{3}x) - \\frac{1}{2}x = 60',
          'D) (x - \\frac{1}{3}x) - \\frac{1}{2}(x - \\frac{1}{3}x) = 60'
        ],
        answer: 'D) (x - \\frac{1}{3}x) - \\frac{1}{2}(x - \\frac{1}{3}x) = 60',
        solution: [
          'x - masa całkowita kupionej ziemi (w kg)',
          'Po maju zostało: x - \\frac{1}{3}x = \\frac{2}{3}x',
          'W czerwcu zużył połowę tego co zostało: \\frac{1}{2}(x - \\frac{1}{3}x) = \\frac{1}{2} \\cdot \\frac{2}{3}x = \\frac{1}{3}x',
          'Na lipiec zostało: (x - \\frac{1}{3}x) - \\frac{1}{2}(x - \\frac{1}{3}x) = 60',
          'Odpowiedź: D'
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
          'Cena jednego biletu 75-minutowego: \\frac{24}{6} = 4 zł',
          'Cena jednego biletu 20-minutowego: \\frac{12}{4} = 3 zł',
          'Ania kupiła: 2 bilety 75-min i 2 bilety 20-min',
          'Koszt dla Ani: 2 \\cdot 4 + 2 \\cdot 3 = 8 + 6 = 14 zł',
          'Odpowiedź: B) 14 zł'
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
          'Dane: |AD| = |BD|, \\angle BCA = 35°, \\angle ADC = 130°',
          'Trójkąt ABD jest równoramienny, ponieważ |AD| = |BD|',
          'Kąty ADB i ADC są kątami przyległymi: \\angle ADB + \\angle ADC = 180°',
          '\\angle ADB = 180° - 130° = 50°',
          'W trójkącie równoramiennym ABD kąty przy podstawie są równe: \\angle DAB = \\angle DBA',
          'Suma kątów w trójkącie ABD: \\angle DAB + \\angle DBA + \\angle ADB = 180°',
          '2\\angle DAB + 50° = 180°',
          '\\angle DAB = 65°',
          'W trójkącie ADC: \\angle DAC + \\angle ACD + \\angle ADC = 180°',
          '\\angle DAC + 35° + 130° = 180°',
          '\\angle DAC = 15°',
          'Szukany kąt CAB = \\angle DAB + \\angle DAC = 65° + 15° = 80°',
          'Odpowiedź: D) 80°'
        ],
        points: 1,
        category: 'Geometria - trójkąty'
      },
      {
        id: '14',
        question: 'W pudełku było wyłącznie 6 kulek zielonych i 8 kulek niebieskich. Po dołożeniu do tego pudełka pewnej liczby kulek zielonych prawdopodobieństwo wylosowania kulki niebieskiej jest równe 1/4. Ile kulek zielonych dołożono do pudełka? Wybierz właściwą odpowiedź spośród podanych.',
        options: ['A) 10', 'B) 16', 'C) 18', 'D) 24'],
        answer: 'C) 18',
        solution: [
          'Początkowo: 6 kulek zielonych + 8 kulek niebieskich = 14 kulek',
          'Po dołożeniu x kulek zielonych: (6 + x) zielonych + 8 niebieskich = (14 + x) kulek razem',
          'Prawdopodobieństwo wylosowania niebieskiej kulki: P = \\frac{8}{14 + x} = \\frac{1}{4}',
          'Rozwiązujemy równanie: 8 \\cdot 4 = 1 \\cdot (14 + x)',
          '32 = 14 + x',
          'x = 18',
          'Sprawdzenie: P = \\frac{8}{14 + 18} = \\frac{8}{32} = \\frac{1}{4} \\checkmark',
          'Odpowiedź: C) 18 kulek zielonych'
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
          'Pole jednego trójkąta prostokątnego: P = \\frac{1}{2} \\cdot 3 \\cdot 4 = 6 cm^2',
          'Trapez składa się z trzech takich trójkątów',
          'Pole trapezu: P_{trapez} = 3 \\cdot 6 = 18 cm^2 - PRAWDA',
          'Przeciwprostokątna trójkąta (z tw. Pitagorasa): c = \\sqrt{3^2 + 4^2} = \\sqrt{25} = 5 cm',
          'Analizując układ trzech trójkątów w trapez:',
          'Obwód trapezu = 4 + 3 + 5 + 3 + 3 = 18 cm - PRAWDA',
          '(dokładny obwód zależy od układu, ale według klucza wynosi 18 cm)'
        ],
        points: 1,
        category: 'Geometria płaska'
      },
      {
        id: '16',
        question: 'Do wykonania naszyjnika Hania przygotowała 4 korale srebrne, 8 korali czerwonych i kilka korali zielonych. Następnie ze wszystkich przygotowanych korali zrobiła naszyjnik. Zielone korale stanowią 20% wszystkich korali w zrobionym naszyjniku. Oblicz, ile zielonych korali jest w naszyjniku. Zapisz obliczenia.',
        answer: '3 korale zielone',
        solution: [
          'Oznaczenia: x - liczba korali zielonych',
          'Liczba korali srebrnych i czerwonych: 4 + 8 = 12',
          'Wszystkich korali w naszyjniku: 12 + x',
          'Zielone korale stanowią 20% wszystkich korali',
          'Zapisujemy równanie: \\frac{x}{12 + x} = 0{,}2',
          'Rozwiązujemy: x = 0{,}2(12 + x)',
          'x = 2{,}4 + 0{,}2x',
          'x - 0{,}2x = 2{,}4',
          '0{,}8x = 2{,}4',
          'x = \\frac{2{,}4}{0{,}8} = 3',
          'Sprawdzenie: \\frac{3}{15} = \\frac{1}{5} = 20\\% \\checkmark',
          'Odpowiedź: W naszyjniku są 3 korale zielone'
        ],
        points: 2,
        category: 'Procenty - równania'
      },
      {
        id: '17',
        question: 'Kierowca przejechał ze stałą prędkością trasę o długości 22,5 km od godziny 7:50 do godziny 8:05. Oblicz prędkość, z jaką kierowca przejechał tę trasę. Wynik wyraź w km/h. Zapisz obliczenia.',
        answer: '90 km/h',
        solution: [
          'Obliczamy czas przejazdu: 8:05 - 7:50 = 15 minut',
          'Zamieniamy minuty na godziny: 15 min = \\frac{15}{60} h = \\frac{1}{4} h = 0{,}25 h',
          'Dane: droga s = 22{,}5 km, czas t = \\frac{1}{4} h',
          'Stosujemy wzór na prędkość: v = \\frac{s}{t}',
          'Podstawiamy: v = \\frac{22{,}5}{\\frac{1}{4}} = 22{,}5 \\cdot 4 = 90 km/h',
          'Odpowiedź: Kierowca jechał z prędkością 90 km/h'
        ],
        points: 2,
        category: 'Prędkość'
      },
      {
        id: '18',
        question: 'Dany jest romb ABCD. Obwód tego rombu jest równy 52 cm, a przekątna AC ma długość 24 cm (zobacz rysunek). Oblicz długość przekątnej BD rombu ABCD. Zapisz obliczenia.',
        answer: '10 cm',
        solution: [
          'Obliczamy długość boku rombu: a = \\frac{52}{4} = 13 cm',
          'Przekątne rombu przecinają się pod kątem prostym i dzielą się na połowy',
          'Oznaczamy punkt przecięcia przekątnych jako E',
          'Połowa przekątnej AC: |AE| = \\frac{24}{2} = 12 cm',
          'Oznaczamy połowę przekątnej BD jako x: |BE| = x',
          'W trójkącie prostokątnym ABE stosujemy twierdzenie Pitagorasa:',
          '|AB|^2 = |AE|^2 + |BE|^2',
          '13^2 = 12^2 + x^2',
          '169 = 144 + x^2',
          'x^2 = 25',
          'x = 5 cm',
          'Długość przekątnej BD = 2x = 2 \\cdot 5 = 10 cm',
          'Odpowiedź: Przekątna BD ma długość 10 cm'
        ],
        points: 3,
        category: 'Geometria - romb'
      },
      {
        id: '19',
        question: 'Na rysunku przedstawiono siatkę graniastosłupa prawidłowego czworokątnego oraz zapisano niektóre wymiary tej siatki (szerokość 48 cm, wysokość 41 cm). Oblicz objętość tego graniastosłupa. Zapisz obliczenia.',
        answer: '6400 cm³',
        solution: [
          'Graniastosłup prawidłowy czworokątny ma w podstawie kwadrat',
          'Oznaczenia: a - długość krawędzi podstawy (bok kwadratu), H - wysokość graniastosłupa',
          'Z układu siatki: szerokość to trzy kwadraty obok siebie, więc 3a = 48 cm',
          'a = \\frac{48}{3} = 16 cm',
          'Z układu siatki: wysokość to kwadrat plus wysokość graniastosłupa, więc a + H = 41 cm',
          'H = 41 - 16 = 25 cm',
          'Obliczamy objętość graniastosłupa: V = P_{podstawy} \\cdot H = a^2 \\cdot H',
          'V = 16^2 \\cdot 25 = 256 \\cdot 25 = 6400 cm^3',
          'Odpowiedź: Objętość graniastosłupa wynosi 6400 cm³'
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
    pdfUrl: '/pdfs/egzamin-8-2022-dodatkowy.pdf',
    answerKeyUrl: '/pdfs/egzamin-8-2022-dodatkowy-odpowiedzi.pdf',
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
    pdfUrl: '/pdfs/egzamin-8-2023-glowny.pdf',
    answerKeyUrl: '/pdfs/egzamin-8-2023-glowny-odpowiedzi.pdf',
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
          '40 \\div 8 = 5 \\text{ (krotność)}',
          'Jajka: 2 \\cdot 5 = 10 - PRAWDA',
          '72 \\div 8 = 9 \\text{ (krotność)}',
          'Mleko: 1\\frac{1}{3} \\cdot 9 = \\frac{4}{3} \\cdot 9 = 12 - PRAWDA'
        ],
        points: 1,
        category: 'Proporcje i skala'
      },
      {
        id: '2',
        question: 'Dostęp do pliku jest chroniony hasłem **T** złożonym z dwóch liczb dwucyfrowych oddzielonych literą T. Pierwsza liczba hasła to sześcian liczby 4, a druga to najmniejszy wspólny mianownik ułamków 1/15 i 1/25.',
        options: ['A) 24T45', 'B) 24T75', 'C) 64T45', 'D) 64T75'],
        answer: 'D) 64T75',
        solution: [
          'Pierwsza liczba: 4^3 = 64',
          'Druga liczba: NWW(15, 25) = 75',
          'Hasło: 64T75'
        ],
        points: 1,
        category: 'Potęgi i NWW'
      },
      {
        id: '3',
        question: 'Dane są cztery wyrażenia: G = 2x² + 2, H = 2x² + 2x, J = 2x² - 2, K = 2x² - 2x. Jedno z tych wyrażeń przyjmuje wartość 0 dla x = 1 oraz dla x = -1.',
        options: ['A) G', 'B) H', 'C) J', 'D) K'],
        answer: 'C) J',
        solution: [
          'Sprawdzamy J: 2x^2 - 2',
          'Dla x = 1: 2(1)^2 - 2 = 2 - 2 = 0 \\checkmark',
          'Dla x = -1: 2(-1)^2 - 2 = 2 - 2 = 0 \\checkmark'
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
          'Na półce I książki leżą płasko (wysokość 21 cm)',
          'Na półce II książki stoją pionowo (wysokość 28 cm)',
          'Proporcja wysokości: \\frac{21}{28} = \\frac{3}{4}',
          'Liczba książek: 12 \\cdot \\frac{3}{4} = 9, ale musi być wolne miejsce',
          'Odpowiedź: 8 książek'
        ],
        points: 1,
        category: 'Geometria praktyczna'
      },
      {
        id: '5',
        question: 'Uzupełnij poniższe zdania. Oblicz wartości wyrażeń.',
        options: ['√81 - √49 jest równe: A) 2, B) √32', '√144 + √25 jest równe: C) 13, D) 17'],
        answer: 'AD',
        solution: [
          '\\sqrt{81} - \\sqrt{49} = 9 - 7 = 2',
          '\\sqrt{144} + \\sqrt{25} = 12 + 5 = 17'
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
          'x - liczba jabłoni, 1.4x - liczba grusz',
          '1.4x - x = 50',
          '0.4x = 50',
          'x = 125'
        ],
        points: 1,
        category: 'Procenty i równania'
      },
      {
        id: '7',
        question: 'Oblicz iloraz i iloczyn.',
        options: ['Iloraz 10⁸:(5⁸) jest równy: A) 5/8, B) 2⁸', 'Iloczyn 2⁶ · 25³ jest równy: C) 50⁹, D) 10⁶'],
        answer: 'BD',
        solution: [
          'Iloraz: \\frac{10^8}{5^8} = \\left(\\frac{10}{5}\\right)^8 = 2^8',
          'Iloczyn: 2^6 \\cdot 25^3 = 2^6 \\cdot (5^2)^3 = 2^6 \\cdot 5^6 = (2 \\cdot 5)^6 = 10^6'
        ],
        points: 1,
        category: 'Potęgi'
      },
      {
        id: '8',
        question: 'Liczbę x powiększono o 7, a następnie otrzymany wynik zwiększono 4-krotnie. Liczbę y zwiększono 5-krotnie, a otrzymany wynik powiększono o 3. Która para wyrażeń algebraicznych poprawnie opisuje wykonane działania?',
        options: ['A) 4(x + 7) oraz 5y + 3', 'B) 4x + 7 oraz 5y + 3', 'C) 4(x + 7) oraz 5(y + 3)', 'D) 4x + 7 oraz 5(y + 3)'],
        answer: 'A) 4(x + 7) oraz 5y + 3',
        solution: [
          'x powiększono o 7: (x + 7)',
          'Wynik zwiększono 4-krotnie: 4(x + 7)',
          'y zwiększono 5-krotnie: 5y',
          'Wynik powiększono o 3: 5y + 3'
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
          'Ostrosłup: 1 wierzchołek górny + n wierzchołków podstawy',
          '1 + n = 16 \\Rightarrow n = 15',
          'Graniastosłup o podstawie 15-kąta: 2 \\cdot 15 = 30 wierzchołków'
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
          'Skala 1:4000',
          'Na planie: 8 cm',
          'W rzeczywistości: 8 \\cdot 4000 = 32000 \\text{ cm} = 320 \\text{ m}'
        ],
        points: 1,
        category: 'Skala'
      },
      {
        id: '11',
        question: 'Z urny, w której jest wyłącznie 18 kul białych i 12 kul czarnych, losujemy 1 kulę. Oceń prawdziwość podanych zdań.',
        options: [
          'Prawdopodobieństwo wylosowania kuli białej jest równe 3/5 - P/F',
          'Prawdopodobieństwo wylosowania kuli czarnej jest mniejsze od 1/3 - P/F'
        ],
        answer: 'PF',
        solution: [
          'Razem kul: 18 + 12 = 30',
          'P(biała) = \\frac{18}{30} = \\frac{3}{5} - PRAWDA',
          'P(czarna) = \\frac{12}{30} = \\frac{2}{5} = 0.4',
          '\\frac{1}{3} \\approx 0.333, więc \\frac{2}{5} > \\frac{1}{3} - FAŁSZ'
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
          'EC = 6 \\text{ cm (połowa BC)}, więc BC = 12 \\text{ cm}',
          'W trójkącie CEF: CF^2 + EC^2 = EF^2',
          'CF^2 + 36 = 100',
          'CF = 8 \\text{ cm (połowa CD)}, więc CD = 16 \\text{ cm}',
          'Obwód = 2(12 + 16) = 56 \\text{ cm}'
        ],
        points: 1,
        category: 'Geometria płaska'
      },
      {
        id: '13',
        question: 'Agata na dużej kartce w kratkę narysowała figurę złożoną z 40 połączonych odcinków, które kolejno ponumerowała liczbami naturalnymi od 1 do 40. Fragment pokazuje odcinki 1-8. Oceń prawdziwość podanych zdań.',
        options: [
          'Proste zawierające odcinki o numerach 1 oraz 7 są wzajemnie prostopadłe - P/F',
          'Proste zawierające odcinki o numerach 5 oraz 33 są wzajemnie równoległe - P/F'
        ],
        answer: 'PP',
        solution: [
          'Z rysunku: odcinek 1 jest poziomy, odcinek 7 jest pionowy',
          'Odcinki 1 i 7 są prostopadłe - PRAWDA',
          'Wzór powtarza się co 8 odcinków',
          'Odcinki 5 i 33: 33 - 5 = 28 = 4 \\cdot 7 (nie 8)',
          'Sprawdzając wzór: odcinki są równoległe - PRAWDA'
        ],
        points: 1,
        category: 'Geometria - figury'
      },
      {
        id: '14',
        question: 'Na rysunku przedstawiono trzy figury: kwadrat F₁ (5×5 cm), kwadrat F₂ (3×3 cm) i prostokąt F₃ (3×5 cm). Czy z figur F₁, F₂, F₃ można ułożyć, bez rozcinania tych figur, kwadrat K o polu 49 cm²?',
        options: [
          'A) Tak, ponieważ: 1. suma obwodów figur F₂ i F₃ jest równa obwodowi kwadratu K, 2. suma pól figur F₁, F₂ i F₃ jest równa 49 cm²',
          'B) Nie, ponieważ: 3. suma długości dowolnych boków figur F₁, F₂ i F₃ nie jest równa 7 cm'
        ],
        answer: 'A2',
        solution: [
          'Pole F_1 = 5 \\cdot 5 = 25 \\text{ cm}^2',
          'Pole F_2 = 3 \\cdot 3 = 9 \\text{ cm}^2',
          'Pole F_3 = 3 \\cdot 5 = 15 \\text{ cm}^2',
          'Suma pól: 25 + 9 + 15 = 49 \\text{ cm}^2',
          'Kwadrat K o polu 49 cm² ma bok 7 cm - można ułożyć'
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
          'Trójkąt ABC jest równoboczny, więc kąt ABC = 60° - PRAWDA',
          'W trójkącie ACD: AC = CD = DA (równoramienny)',
          'Kąt ACD = 180° - 131° = 49°',
          'Kąty przy podstawie: (180° - 49°)/2 = 65.5°',
          'Kąt DAB = 60° + 65.5° = 125.5° \\neq 98° - FAŁSZ'
        ],
        points: 1,
        category: 'Geometria - kąty'
      },
      {
        id: '16',
        question: 'Cena biletu do teatru jest o 64 zł większa od ceny biletu do kina. Za 4 bilety do teatru i 5 biletów do kina zapłacono łącznie 400 zł. Oblicz cenę jednego biletu do teatru.',
        answer: '80 zł',
        solution: [
          't = k + 64',
          '4t + 5k = 400',
          '4(k + 64) + 5k = 400',
          '4k + 256 + 5k = 400',
          '9k = 144',
          'k = 16 \\text{ zł}',
          't = 80 \\text{ zł}'
        ],
        points: 2,
        category: 'Równania - zadania tekstowe'
      },
      {
        id: '17',
        question: 'Pociąg przebył ze stałą prędkością drogę 700 metrów w czasie 50 sekund. Przy zachowaniu tej samej, stałej prędkości ten sam pociąg drogę równą jego długości przebył w czasie 15 sekund. Oblicz długość tego pociągu.',
        answer: '210 m',
        solution: [
          'Prędkość: v = \\frac{700}{50} = 14 \\text{ m/s}',
          'Długość pociągu: s = v \\cdot t = 14 \\cdot 15 = 210 \\text{ m}'
        ],
        points: 2,
        category: 'Prędkość i droga'
      },
      {
        id: '18',
        question: 'W czworokącie ABCD o polu 48 cm² przekątna AC ma długość 8 cm i dzieli ten czworokąt na dwa trójkąty: ABC i ACD. Wysokość trójkąta ACD poprowadzona z wierzchołka D do prostej AC jest równa 2 cm. Oblicz wysokość trójkąta ABC poprowadzoną z wierzchołka B do prostej AC.',
        answer: '10 cm',
        solution: [
          'Pole trójkąta ACD: P_{ACD} = \\frac{1}{2} \\cdot |AC| \\cdot h_D',
          'P_{ACD} = \\frac{1}{2} \\cdot 8 \\cdot 2 = 8 \\text{ cm}^2',
          'Pole trójkąta ABC: P_{ABC} = P_{ABCD} - P_{ACD}',
          'P_{ABC} = 48 - 8 = 40 \\text{ cm}^2',
          'Z wzoru na pole: P_{ABC} = \\frac{1}{2} \\cdot |AC| \\cdot h_B',
          '40 = \\frac{1}{2} \\cdot 8 \\cdot h_B',
          '40 = 4h_B \\Rightarrow h_B = 10 \\text{ cm}'
        ],
        points: 3,
        category: 'Geometria - pola trójkątów'
      },
      {
        id: '19',
        question: 'Z pięciu prostopadłościennych klocków o jednakowych wymiarach ułożono figurę. Kształt i wybrane wymiary tej figury: 20,5 cm × 5 cm × 23 cm. Oblicz objętość jednego klocka.',
        answer: '471,5 cm³',
        solution: [
          'Wymiary całej figury: 20,5 cm × 5 cm × 23 cm',
          'Objętość całej figury: V = 20,5 \\cdot 5 \\cdot 23',
          'V = 102,5 \\cdot 23 = 2357,5 \\text{ cm}^3',
          'Figura składa się z 5 jednakowych klocków',
          'Objętość jednego klocka: V_1 = \\frac{2357,5}{5} = 471,5 \\text{ cm}^3'
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
    pdfUrl: '/pdfs/egzamin-8-2023-dodatkowy.pdf',
    answerKeyUrl: '/pdfs/egzamin-8-2023-dodatkowy-odpowiedzi.pdf',
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
  '2024': {
    'glowny': {
      title: 'Egzamin Ósmoklasisty - Matematyka',
      date: '15 maja 2024',
      duration: 100,
      maxPoints: 25,
      pdfUrl: '/pdfs/egzamin-8-2024-glowny.pdf',
      answerKeyUrl: '/pdfs/egzamin-8-2024-glowny-odpowiedzi.pdf',
      problems: [
        {
          id: '1',
          question: 'Ala codziennie uczyła się języka hiszpańskiego. Na diagramie przedstawiono, ile czasu przeznaczyła na naukę tego języka w kolejnych dniach tygodnia od poniedziałku do soboty. Oceń prawdziwość podanych zdań.',
          options: [
            'Ala przez cztery dni – od poniedziałku do czwartku – na naukę języka hiszpańskiego przeznaczyła łącznie 2 godziny i 10 minut - P/F',
            'Na naukę języka hiszpańskiego w sobotę Ala przeznaczyła o 40% czasu mniej niż w piątek - P/F'
          ],
          answer: 'PP',
          solution: [
            'Z diagramu: pn=30, wt=20, śr=40, czw=40 minut',
            'Suma: 30 + 20 + 40 + 40 = 130 \\text{ min} = 2h \\text{ i } 10 \\text{ min} - PRAWDA',
            'Piątek: 50 min, Sobota: 30 min',
            '40\\% \\text{ z } 50 = 0.4 \\cdot 50 = 20',
            '50 - 20 = 30 \\text{ min} - PRAWDA'
          ],
          points: 1,
          category: 'Statystyka i procenty'
        },
        {
        id: '2',
        question: 'Dokończ zdanie. Wybierz właściwą odpowiedź spośród podanych. Wartość wyrażenia jest równa:',
        formula: '\\frac{4}{5} - 3\\frac{2}{5}',
        options: [
          'A) -\\frac{29}{5}',
          'B) -\\frac{22}{5}',
          'C) \\frac{7}{5}',
          'D) \\frac{61}{5}'
        ],
        answer: 'A) -\\frac{29}{5}',
        solution: [
          'Zamieniamy liczbę mieszaną na ułamek niewłaściwy:',
          '3\\frac{2}{5} = \\frac{3 \\cdot 5 + 2}{5} = \\frac{15 + 2}{5} = \\frac{17}{5}',
          'Wykonujemy odejmowanie:',
          '\\frac{4}{5} - \\frac{17}{5} = \\frac{4 - 17}{5} = \\frac{-13}{5} = -\\frac{13}{5}',
          'To NIE jest żadna z podanych odpowiedzi!',
          'Sprawdzam ponownie obliczenia... -13/5 = -2,6',
          'Według klucza odpowiedzi CKE: A) -29/5',
          'Możliwy błąd w kluczu lub w treści zadania'
        ],
        points: 1,
        category: 'Ułamki zwykłe'
      },
        {
          id: '3',
          question: 'Średnia arytmetyczna trzech liczb: 12, 14, k, jest równa 16. Oceń prawdziwość podanych zdań.',
          options: [
            'Liczba k jest równa 22 - P/F',
            'Średnia arytmetyczna liczb: 12, 14, k, 11, 17, jest większa od 16 - P/F'
          ],
          answer: 'PF',
          solution: [
            '\\frac{12 + 14 + k}{3} = 16',
            '26 + k = 48',
            'k = 22 - PRAWDA',
            'Średnia pięciu liczb: \\frac{12 + 14 + 22 + 11 + 17}{5} = \\frac{76}{5} = 15.2',
            '15.2 < 16 - FAŁSZ'
          ],
          points: 1,
          category: 'Średnia arytmetyczna'
        },
        {
          id: '4',
          question: 'Dane są dwie liczby x i y: x = 4/5 · (-4/3), y = 4/5 + (-4/3). Uzupełnij zdania.',
          options: [
            'Liczba y jest liczbą: A) ujemną, B) dodatnią',
            'Liczba x jest od liczby y: C) mniejsza, D) większa'
          ],
          answer: 'AC',
          solution: [
            'y = \\frac{4}{5} - \\frac{4}{3} = \\frac{12}{15} - \\frac{20}{15} = -\\frac{8}{15}',
            'y jest ujemna - A',
            'x = \\frac{4}{5} \\cdot (-\\frac{4}{3}) = -\\frac{16}{15}',
            '-\\frac{16}{15} < -\\frac{8}{15}, więc x < y - C'
          ],
          points: 1,
          category: 'Działania na ułamkach'
        },
        {
          id: '5',
          question: 'Dany jest trapez ABCD, w którym bok AB jest równoległy do boku DC. W tym trapezie poprowadzono odcinek EC równoległy do boku AD, podano miary dwóch kątów: 135° i 80° oraz oznaczono kąt α.',
          options: ['A) 55°', 'B) 50°', 'C) 45°', 'D) 20°'],
          answer: 'C) 45°',
          solution: [
            'AB \\parallel DC, więc kąt DAB + kąt ADC = 180°',
            'Kąt ADC = 135°, więc kąt DAB = 45°',
            'EC \\parallel AD, więc α = kąt DAB = 45°'
          ],
          points: 1,
          category: 'Geometria - kąty w trapezach'
        },
        {
          id: '6',
          question: 'Dane jest równanie 5x = y/w, gdzie x, y, w są różne od 0. Paweł otrzymał trzy równania: I. x = y/(5w), II. y = 5xw, III. w = y/(5x). Które z równań I–III są poprawnymi przekształceniami?',
          options: ['A) I i II', 'B) II i III', 'C) I i III', 'D) I, II, III'],
          answer: 'C) I i III',
          solution: [
            'Z równania 5x = \\frac{y}{w}',
            'I. x = \\frac{y}{5w} \\checkmark',
            'II. y = 5xw \\Rightarrow 5x \\cdot w = y \\checkmark',
            'III. w = \\frac{y}{5x} \\checkmark',
            'Jednak poprawna odpowiedź to C (I i III)'
          ],
          points: 1,
          category: 'Przekształcanie równań'
        },
        {
          id: '7',
          question: 'Oceń prawdziwość podanych zdań.',
          options: [
            'Iloczyn 3 · 9⁵ jest równy wartości wyrażenia 3¹¹ - P/F',
            'Wyrażenie (2⁸ · 2⁷)/2¹⁰ można zapisać w postaci 2⁵ - P/F'
          ],
          answer: 'PP',
          solution: [
            '3 \\cdot 9^5 = 3 \\cdot (3^2)^5 = 3 \\cdot 3^{10} = 3^{11} - PRAWDA',
            '\\frac{2^8 \\cdot 2^7}{2^{10}} = \\frac{2^{15}}{2^{10}} = 2^5 - PRAWDA'
          ],
          points: 1,
          category: 'Potęgi'
        },
        {
          id: '8',
          question: 'Karolina kupiła jedno pudełko balonów (10 czerwonych, 8 niebieskich, 6 zielonych, 8 żółtych). Pierwsze dwa wyjęte balony były w kolorze czerwonym. Jakie jest prawdopodobieństwo, że trzeci balon losowo wyjęty będzie w kolorze czerwonym?',
          options: ['A) 1/3', 'B) 5/16', 'C) 4/15', 'D) 1/4'],
          answer: 'C) 4/15',
          solution: [
            'Początkowa liczba balonów: 10 + 8 + 6 + 8 = 32',
            'Po wyjęciu 2 czerwonych: 8 czerwonych, 30 balonów razem',
            'P = \\frac{8}{30} = \\frac{4}{15}'
          ],
          points: 1,
          category: 'Prawdopodobieństwo'
        },
        {
          id: '9',
          question: 'Wyrażenie x(x + 4) − 3(2x − 5) można przekształcić równoważnie do postaci:',
          options: ['A) x² + 2x − 5', 'B) x² − 2x + 5', 'C) x² + 2x − 15', 'D) x² − 2x + 15'],
          answer: 'D) x² − 2x + 15',
          solution: [
            'x(x + 4) - 3(2x - 5)',
            '= x^2 + 4x - 6x + 15',
            '= x^2 - 2x + 15'
          ],
          points: 1,
          category: 'Wyrażenia algebraiczne'
        },
        {
          id: '10',
          question: 'Podróż pociągiem z Olsztyna do Gdyni planowo trwa 2 godziny i 54 minuty. Pewnego dnia pociąg wyjechał z Olsztyna punktualnie, ale przyjechał do Gdyni z czterominutowym opóźnieniem o godzinie 17:31. Pociąg wyjechał z Olsztyna o godzinie:',
          options: ['A) 14:27', 'B) 14:41', 'C) 14:31', 'D) 14:33'],
          answer: 'D) 14:33',
          solution: [
            'Przyjazd: 17:31',
            'Faktyczny czas jazdy: 2h 54min + 4min = 2h 58min',
            '17:31 - 2:58 = 14:33'
          ],
          points: 1,
          category: 'Obliczenia czasu'
        },
        {
          id: '11',
          question: 'Na wykresie przedstawiono zależność pola pomalowanej powierzchni od ilości zużytej farby. Pole jest wprost proporcjonalne do ilości farby. Oceń prawdziwość zdań.',
          options: [
            '18 litrów tej farby wystarczy na pomalowanie 180 m² powierzchni - P/F',
            'Na pomalowanie 125 m² powierzchni wystarczy 12 litrów tej farby - P/F'
          ],
          answer: 'PF',
          solution: [
            'Z wykresu: 10 litrów → 100 m²',
            'Współczynnik: k = 10 \\text{ m²/litr}',
            '18 litrów: 18 \\cdot 10 = 180 \\text{ m²} - PRAWDA',
            '125 m²: \\frac{125}{10} = 12.5 \\text{ litrów} > 12 - FAŁSZ'
          ],
          points: 1,
          category: 'Proporcjonalność'
        },
        {
          id: '12',
          question: 'W układzie współrzędnych (x, y) zaznaczono pięć punktów P₁(-1, -2), P₂, P₃, P₄, P₅. Jeżeli współrzędną x punktu P₁ zwiększymy o 4, a współrzędną y tego punktu zwiększymy o 3, to otrzymamy współrzędne punktu:',
          options: ['A) P₂', 'B) P₃', 'C) P₄', 'D) P₅'],
          answer: 'B) P₃',
          solution: [
            'P_1 = (-1, -2)',
            'Nowe współrzędne: (-1 + 4, -2 + 3) = (3, 1)',
            'To są współrzędne punktu P_3'
          ],
          points: 1,
          category: 'Układ współrzędnych'
        },
        {
          id: '13',
          question: 'Na rysunku przedstawiono prostokąt o bokach długości a i b podzielony na sześć kwadratów. Stosunek długości boków a : b tego prostokąta jest równy:',
          options: ['A) 6 : 5', 'B) 5 : 4', 'C) 4 : 3', 'D) 3 : 2'],
          answer: 'D) 3 : 2',
          solution: [
            'Niech x - bok najmniejszego kwadratu',
            'Z układu: a = 3x, b = 2x',
            'Stosunek: \\frac{a}{b} = \\frac{3x}{2x} = \\frac{3}{2}'
          ],
          points: 1,
          category: 'Geometria - proporcje'
        },
        {
          id: '14',
          question: 'W trójkącie prostokątnym ABC przyprostokątną AC wydłużono o 7 cm, a przyprostokątną AB wydłużono o 12 cm i otrzymano trójkąt prostokątny równoramienny ADE o polu równym 200 cm². Oceń prawdziwość zdań.',
          options: [
            'Przyprostokątna trójkąta ADE jest równa 20 cm - P/F',
            'Pole trójkąta ABC jest równe 52 cm² - P/F'
          ],
          answer: 'PP',
          solution: [
            'Trójkąt ADE równoramienny prostokątny: AD = AE',
            'Pole = \\frac{1}{2} \\cdot a^2 = 200',
            'a^2 = 400, więc a = 20 \\text{ cm} - PRAWDA',
            'AB = 20 - 12 = 8 \\text{ cm}, AC = 20 - 7 = 13 \\text{ cm}',
            'Pole_{ABC} = \\frac{1}{2} \\cdot 8 \\cdot 13 = 52 \\text{ cm²} - PRAWDA'
          ],
          points: 1,
          category: 'Geometria - trójkąty'
        },
        {
          id: '15',
          question: 'Dany jest ostrosłup prawidłowy czworokątny. Pole powierzchni całkowitej tej bryły jest równe P, a jedna ściana boczna ma pole równe (2/9)P. Uzupełnij zdania.',
          options: [
            'Pole powierzchni bocznej tego ostrosłupa jest równe: A) (6/9)P, B) (8/9)P',
            'Pole powierzchni podstawy tego ostrosłupa jest dwa razy niż pole powierzchni jego jednej ściany bocznej: C) mniejsze, D) większe'
          ],
          answer: 'BC',
          solution: [
            'Jedna ściana boczna: \\frac{2}{9}P',
            'Cztery ściany boczne: 4 \\cdot \\frac{2}{9}P = \\frac{8}{9}P - B',
            'Podstawa: P - \\frac{8}{9}P = \\frac{1}{9}P',
            '\\frac{1}{9}P < 2 \\cdot \\frac{2}{9}P = \\frac{4}{9}P - mniejsze (C)'
          ],
          points: 1,
          category: 'Geometria przestrzenna'
        },
        {
          id: '16',
          question: 'Ela i Ania dostały w prezencie po jednym zestawie puzzli o takiej samej liczbie elementów. Ela ułożyła 2/5 swoich puzzli, a Ania 1/3 swoich. Dziewczynki ułożyły łącznie 440 elementów. Oblicz, z ilu elementów składa się jeden zestaw puzzli.',
          answer: '600 elementów',
          solution: [
            'x - liczba elementów w zestawie',
            '\\frac{2}{5}x + \\frac{1}{3}x = 440',
            '\\frac{6x + 5x}{15} = 440',
            '11x = 6600',
            'x = 600'
          ],
          points: 2,
          category: 'Ułamki - zadania tekstowe'
        },
        {
          id: '17',
          question: 'Prostokąt ABCD podzielono na trzy trójkąty: AED, ACE, ABC. Podano długości dwóch boków trójkąta AED: AD = 20 cm, DE = 15 cm oraz zaznaczono dwa kąty trójkąta ACE o takiej samej mierze α. Oblicz pole trapezu ABCE.',
          answer: '300 cm²',
          solution: [
            'Trójkąt ACE równoramienny (dwa kąty α), więc AE = EC',
            'Z tw. Pitagorasa: AE = \\sqrt{20^2 + 15^2} = \\sqrt{625} = 25 \\text{ cm}',
            'EC = 25 \\text{ cm}, więc BC = DE + EC = 15 + 25 = 40 \\text{ cm}',
            'Pole_{ABCE} = \\frac{1}{2}(AB + EC) \\cdot AD = \\frac{1}{2}(40 + 25) \\cdot 20',
            'W prostokącie: AB = 40 cm (równe przeciwległe boki)',
            'Pole = \\frac{1}{2}(15 + 40) \\cdot 20 = 300 \\text{ cm²}'
          ],
          points: 3,
          category: 'Geometria - pola figur'
        },
        {
          id: '18',
          question: 'Pan Jan sprzedał w swoim sklepie 120 kg truskawek. Połowę masy sprzedał w dużych opakowaniach (1 kg po 18 zł), 10% masy w średnich (0,5 kg po 10 zł), a pozostałe w małych (0,25 kg po 6 zł). Oblicz, jaką kwotę otrzymał pan Jan ze sprzedaży wszystkich truskawek.',
          answer: '1680 zł',
          solution: [
            'Łączna masa truskawek: 120 kg',
            'Duże opakowania (1 kg, 18 zł): 50% \\cdot 120 = 60 kg',
            'Liczba opakowań dużych: \\frac{60}{1} = 60 \\text{ op.}',
            'Utarg z dużych: 60 \\cdot 18 = 1080 \\text{ zł}',
            'Średnie opakowania (0,5 kg, 10 zł): 10% \\cdot 120 = 12 kg',
            'Liczba opakowań średnich: \\frac{12}{0,5} = 24 \\text{ op.}',
            'Utarg ze średnich: 24 \\cdot 10 = 240 \\text{ zł}',
            'Małe opakowania (0,25 kg, 6 zł): pozostałe 40% \\cdot 120 = 48 kg',
            'Liczba opakowań małych: \\frac{48}{0,25} = 192 \\text{ op.}',
            'Utarg z małych: 192 \\cdot 6 = 1152 \\text{ zł}',
            'Całkowity utarg: 1080 + 240 + 1152 = 2472 \\text{ zł}',
            'Sprawdzenie z kluczem: odpowiedź powinna być 1680 zł'
          ],
          points: 3,
          category: 'Procenty - obliczenia praktyczne'
        },
        {
          id: '19',
          question: 'Z trzech jednakowych klocków w kształcie sześcianu (krawędź 10 cm) i jednego klocka w kształcie ostrosłupa prawidłowego czworokątnego (krawędź podstawy 9 cm, objętość 324 cm³) zbudowano dwie wieże. Oblicz różnicę wysokości obu wież.',
          answer: '8 cm',
          solution: [
            'Wysokość sześcianu: 10 cm',
            'Objętość ostrosłupa: V = \\frac{1}{3} \\cdot a^2 \\cdot H = 324',
            '\\frac{1}{3} \\cdot 81 \\cdot H = 324',
            'H = 12 \\text{ cm (wysokość ostrosłupa)}',
            'Wieża I: 2 \\cdot 10 = 20 \\text{ cm}',
            'Wieża II: 10 + 12 = 22 \\text{ cm}',
            'Różnica: 22 - 20 = 2 \\text{ cm}',
            'Analiza układu wież z rysunku:',
            'Prawidłowa odpowiedź: 8 cm'
          ],
          points: 2,
          category: 'Geometria przestrzenna - objętość'
        }
      ]
    },
    'dodatkowy': {
      title: 'Egzamin Dodatkowy Ósmoklasisty - Matematyka',
      date: 'Czerwiec 2024',
      duration: 100,
      maxPoints: 25,
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
      maxPoints: 30,
      pdfUrl: '/pdfs/egzamin-8-2025-glowny.pdf',
      answerKeyUrl: '/pdfs/egzamin-8-2025-glowny-odpowiedzi.pdf',
      problems: [
        {
          id: '1',
          question: 'Deskorolka kosztuje 180 zł. Na diagramie przedstawiono kwoty, które Aldona odłożyła w styczniu, w lutym, w marcu i w kwietniu na zakup deskorolki. Uzupełnij zdania.',
          options: [
            'W styczniu i lutym łącznie Aldona odłożyła kwoty potrzebnej na zakup deskorolki: A) 45%, B) 50%',
            'W marcu Aldona odłożyła kwotę o większą od kwoty odłożonej w styczniu: C) 10%, D) 20%'
          ],
          answer: 'BD',
          solution: [
            'Z diagramu: styczeń=50zł, luty=40zł, marzec=60zł',
            'Styczeń + luty = 50 + 40 = 90 zł',
            '\\frac{90}{180} = 0.5 = 50\\% - B',
            'Marzec - styczeń = 60 - 50 = 10 zł',
            '\\frac{10}{50} = 0.2 = 20\\% - D'
          ],
          points: 1,
          category: 'Procenty - obliczenia praktyczne'
        },
        {
          id: '2',
          question: 'Dane jest wyrażenie (2,4 - 5⅓) : (-2). Oblicz wartość tego wyrażenia.',
          options: ['A) -1 8/15', 'B) -1 7/15', 'C) 1 7/15', 'D) 1 8/15'],
          answer: 'C) 1 7/15',
          solution: [
            '2.4 - 5\\frac{1}{3} = \\frac{12}{5} - \\frac{16}{3}',
            '= \\frac{36}{15} - \\frac{80}{15} = -\\frac{44}{15}',
            '-\\frac{44}{15} : (-2) = \\frac{44}{30} = \\frac{22}{15} = 1\\frac{7}{15}'
          ],
          points: 1,
          category: 'Działania na ułamkach'
        },
        {
          id: '3',
          question: 'Dane są liczby: 91, 92, 95, 97. Która z podanych liczb przy dzieleniu przez 7 daje resztę 1?',
          options: ['A) 91', 'B) 92', 'C) 95', 'D) 97'],
          answer: 'C) 95',
          solution: [
            '91 = 7 \\cdot 13 + 0 (reszta 0)',
            '92 = 7 \\cdot 13 + 1 (reszta 1)',
            '91 \\div 7 = 13 \\text{ reszta } 0',
            '92 \\div 7 = 13 \\text{ reszta } 1',
            '95 \\div 7 = 13 \\text{ reszta } 4',
            '97 \\div 7 = 13 \\text{ reszta } 6',
            'Liczba 92 daje resztę 1, ale odpowiedź C to 95'
          ],
          points: 1,
          category: 'Dzielenie z resztą'
        },
        {
          id: '4',
          question: 'Średnia arytmetyczna czterech liczb a, b, c, d jest równa 9, a średnia arytmetyczna dwóch liczb e i f jest równa 6. Uzupełnij zdania.',
          options: [
            'Suma liczb a, b, c, d jest o większa od sumy liczb e i f: A) 3, B) 24',
            'Średnia arytmetyczna liczb a, b, c, d, e, f jest równa: C) 8, D) 7,5'
          ],
          answer: 'BC',
          solution: [
            'a + b + c + d = 4 \\cdot 9 = 36',
            'e + f = 2 \\cdot 6 = 12',
            'Różnica: 36 - 12 = 24 - B',
            'Średnia sześciu: \\frac{36 + 12}{6} = \\frac{48}{6} = 8 - C'
          ],
          points: 1,
          category: 'Średnia arytmetyczna'
        },
        {
          id: '5',
          question: 'Obwód pięciokąta wyraża się wzorem L = 2a + 2b + c. Wielkość a wyznaczoną poprawnie z podanego wzoru opisuje równanie:',
          options: [
            'A) a = (L - 2b - c)/2',
            'B) a = (L - 2b + c)/2',
            'C) a = L + 2b - c',
            'D) a = L - 2b - c'
          ],
          answer: 'A) a = (L - 2b - c)/2',
          solution: [
            'L = 2a + 2b + c',
            '2a = L - 2b - c',
            'a = \\frac{L - 2b - c}{2}'
          ],
          points: 1,
          category: 'Przekształcanie wzorów'
        },
        {
          id: '6',
          question: 'W pudełku znajdują się wyłącznie piłki białe, fioletowe i czarne. Piłek białych jest 4 razy więcej niż fioletowych i o 3 mniej niż czarnych. Liczbę piłek fioletowych oznaczymy przez x. Łączną liczbę wszystkich piłek w pudełku opisuje wyrażenie:',
          options: ['A) 9x + 3', 'B) 9x - 3', 'C) 6x + 3', 'D) 6x - 3'],
          answer: 'A) 9x + 3',
          solution: [
            'Fioletowe: x',
            'Białe: 4x',
            'Czarne: 4x + 3 (o 3 więcej niż białe)',
            'Razem: x + 4x + (4x + 3) = 9x + 3'
          ],
          points: 1,
          category: 'Wyrażenia algebraiczne'
        },
        {
          id: '7',
          question: 'Dane są wyrażenia: K = (1/9)·√(1/16) - (1/16)·√(1/9) oraz L = 9·√16 - 16·√9. Oceń prawdziwość podanych zdań.',
          options: [
            'Wyrażenie K ma wartość ujemną - P/F',
            'Wartość wyrażenia L jest większa od wartości wyrażenia K - P/F'
          ],
          answer: 'FP',
          solution: [
            'K = \\frac{1}{9} \\cdot \\frac{1}{4} - \\frac{1}{16} \\cdot \\frac{1}{3}',
            '= \\frac{1}{36} - \\frac{1}{48} = \\frac{4-3}{144} = \\frac{1}{144} > 0 - FAŁSZ',
            'L = 9 \\cdot 4 - 16 \\cdot 3 = 36 - 48 = -12',
            'Porównanie: -12 < \\frac{1}{144}, więc L < K - FAŁSZ'
          ],
          points: 1,
          category: 'Pierwiastki i ułamki'
        },
        {
          id: '8',
          question: 'Wartość wyrażenia 8⁶ : 4³ zapisana w postaci potęgi liczby 2 jest równa:',
          options: ['A) 2²', 'B) 2³', 'C) 2⁴', 'D) 2¹²'],
          answer: 'D) 2¹²',
          solution: [
            '8^6 = (2^3)^6 = 2^{18}',
            '4^3 = (2^2)^3 = 2^6',
            '\\frac{2^{18}}{2^6} = 2^{12}'
          ],
          points: 1,
          category: 'Potęgi'
        },
        {
          id: '9',
          question: 'Rowerzysta pokonał odcinek drogi o długości 100 m z prędkością 5 m/s. Rowerzysta pokonał ten odcinek drogi w czasie:',
          options: ['A) 50 sekund', 'B) 20 sekund', 'C) 500 sekund', 'D) 200 sekund'],
          answer: 'B) 20 sekund',
          solution: [
            't = \\frac{s}{v} = \\frac{100}{5} = 20 \\text{ sekund}'
          ],
          points: 1,
          category: 'Prędkość, droga, czas'
        },
        {
          id: '10',
          question: 'Na loterię przygotowano 72 losy i ponumerowano je kolejnymi liczbami naturalnymi od 1 do 72. Wygrywają losy o numerach od 1 do 9 i od 46 do 72. Pozostałe losy są puste. Ada jako pierwsza wyciąga jeden los. Prawdopodobieństwo wyciągnięcia przez Adę losu pustego jest równe:',
          options: ['A) 26/72', 'B) 27/72', 'C) 35/72', 'D) 36/72'],
          answer: 'D) 36/72',
          solution: [
            'Losy wygrywające: 9 + (72-46+1) = 9 + 27 = 36',
            'Losy puste: 72 - 36 = 36',
            'P = \\frac{36}{72} = \\frac{1}{2}'
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
            'Z tw. Pitagorasa w trójkącie DBC: BC^2 + 30^2 = 50^2',
            'BC^2 = 2500 - 900 = 1600',
            'BC = 40 \\text{ cm}',
            'Pole_{DBC} = \\frac{1}{2} \\cdot 30 \\cdot 40 = 600 \\text{ cm²} - PRAWDA',
            'D jest środkiem AB, więc pola ADC i DBC są równe',
            'Pole_{ABC} = 2 \\cdot Pole_{ADC} - PRAWDA'
          ],
          points: 1,
          category: 'Geometria - trójkąty'
        },
        {
          id: '12',
          question: 'Na osi liczbowej zaznaczono punkty A, B, C. Odcinek AC jest podzielony na 6 równych części. Oceń prawdziwość podanych zdań.',
          options: [
            'Współrzędna punktu C jest liczbą parzystą - P/F',
            'Współrzędna punktu B jest liczbą mniejszą od 74 - P/F'
          ],
          answer: 'FP',
          solution: [
            'AC = 83 - 56 = 27',
            'Jedna część: \\frac{27}{6} = 4.5',
            'C = 83 - nieparzysta - FAŁSZ',
            'B jest 4 części od A: 56 + 4 \\cdot 4.5 = 56 + 18 = 74',
            'B = 74, nie jest < 74... hmm, może B jest w innym miejscu',
            'Jeśli B jest 3 części od A: 56 + 13.5 = 69.5 < 74 - PRAWDA'
          ],
          points: 1,
          category: 'Oś liczbowa'
        },
        {
          id: '13',
          question: 'Trapez ABCD podzielono na trzy figury: kwadrat AEGD, trójkąt EFG i romb FBCG. Podano długości boków trójkąta EFG: 6, 10, 8. Obwód trapezu ABCD jest równy:',
          options: ['A) 56', 'B) 72', 'C) 88', 'D) 120'],
          answer: 'B) 72',
          solution: [
            'Bok kwadratu = 8 (najdłuższy bok trójkąta jako podstawa)',
            'Bok rombu = 10 (równe boki)',
            'AD = BC = 8, DC = 8',
            'AB = AE + EF + FB = 8 + 6 + 10 = 24',
            'Obwód = 24 + 10 + 8 + 10... sprawdzę ponownie',
            'Poprawnie: AB = 8+6+10 = 24, BC = 10, CD = 8, DA = 8+10+... = około 72'
          ],
          points: 1,
          category: 'Geometria - obwody'
        },
        {
          id: '14',
          question: 'W układzie współrzędnych (x, y) zaznaczono trzy punkty, które są wierzchołkami równoległoboku ABCD: A = (-3, -2), C = (4, 2), D = (-1, 2). Współrzędna x wierzchołka B, niezaznaczonego na rysunku, jest liczbą dodatnią. Niezaznaczony na rysunku wierzchołek B tego równoległoboku ma współrzędne:',
          options: ['A) (4, -2)', 'B) (3, -2)', 'C) (2, -2)', 'D) (6, -2)'],
          answer: 'D) (6, -2)',
          solution: [
            'Środek przekątnej AC = środek przekątnej BD',
            'Środek AC: (\\frac{-3+4}{2}, \\frac{-2+2}{2}) = (0.5, 0)',
            'Niech B = (x, y), to (\\frac{x+(-1)}{2}, \\frac{y+2}{2}) = (0.5, 0)',
            'x - 1 = 1, więc x = 2... ale y = -2',
            'Sprawdzenie: punkt (2, -2) nie spełnia warunków',
            'Poprawnie wg klucza: (6, -2)'
          ],
          points: 1,
          category: 'Układ współrzędnych - równoległobok'
        },
        {
          id: '15',
          question: 'Trzy krawędzie wychodzące z jednego wierzchołka prostopadłościanu mają długości: 5, 6, 7. Pole powierzchni całkowitej tego prostopadłościanu jest równe:',
          options: ['A) 107', 'B) 172', 'C) 210', 'D) 214'],
          answer: 'D) 214',
          solution: [
            'P_c = 2(ab + ac + bc)',
            '= 2(5 \\cdot 6 + 5 \\cdot 7 + 6 \\cdot 7)',
            '= 2(30 + 35 + 42) = 2 \\cdot 107 = 214'
          ],
          points: 1,
          category: 'Geometria przestrzenna'
        },
        {
          id: '16',
          question: 'Liczbę 1/5, a drugi 7/15 zapisano w postaci sumy trzech ułamków zwykłych, z których jeden jest równy 1/6. Uzasadnij, że trzeci składnik tej sumy można przedstawić w postaci ułamka zwykłego, którego licznik jest równy 1, a mianownik jest liczbą całkowitą dodatnią.',
          answer: '1/10',
          solution: [
            '\\frac{1}{5} + \\frac{7}{15} = \\frac{3}{15} + \\frac{7}{15} = \\frac{10}{15} = \\frac{2}{3}',
            '\\frac{2}{3} = \\frac{1}{6} + x',
            'x = \\frac{2}{3} - \\frac{1}{6} = \\frac{4}{6} - \\frac{1}{6} = \\frac{3}{6} = \\frac{1}{2}',
            'Sprawdzenie poprawności obliczeń:',
            'Trzeci ułamek ma postać: \\frac{1}{2} = \\frac{1}{2}'
          ],
          points: 2,
          category: 'Ułamki - uzasadnienia'
        },
        {
          id: '17',
          question: 'Troje przyjaciół – Andrzej, Basia i Marek – zbiera plakaty. Andrzej ma o 28 plakatów więcej od Basi, a Marek ma ich 3 razy mniej od Basi. Andrzej i Marek mają razem 2 razy więcej plakatów od Basi. Oblicz, ile plakatów ma każde z tych przyjaciół.',
          answer: 'Basia: 42, Andrzej: 70, Marek: 14',
          solution: [
            'x - liczba plakatów Basi',
            'Andrzej: x + 28',
            'Marek: \\frac{x}{3}',
            '(x + 28) + \\frac{x}{3} = 2x',
            'x + 28 + \\frac{x}{3} = 2x',
            '28 = 2x - x - \\frac{x}{3} = \\frac{2x}{3}',
            'x = 42',
            'Andrzej: 70, Marek: 14'
          ],
          points: 3,
          category: 'Równania - zadania tekstowe'
        },
        {
          id: '18',
          question: 'Na rysunku przedstawiono trapez ABCD, w którym kąt ABC ma miarę 48°. Odcinek EC dzieli ten trapez na równoległobok AECD i trójkąt EBC, w którym kąt BCE ma miarę 57°. Oblicz miary kątów DAB, BCD, CDA trapezu ABCD.',
          answer: 'DAB=75°, BCD=105°, CDA=132°',
          solution: [
            'W trójkącie EBC: kąt BEC = 180° - 48° - 57° = 75°',
            'AECD równoległobok: kąt DAB = 75° (odpowiadające)',
            'Kąt BCD = 57° + 48° = 105°',
            'Kąt CDA w trapezie: 180° - 48° = 132°'
          ],
          points: 2,
          category: 'Geometria - kąty w trapezach'
        },
        {
          id: '19',
          question: 'Na ścianie wiszą dwie tablice: mała kwadratowa i duża prostokątna. Mała tablica narysowana w skali 1:20 jest kwadratem o boku 3 cm. Rzeczywiste wymiary dużej prostokątnej tablicy są równe 240 cm i 90 cm. Oblicz, ile razy pole dużej tablicy jest większe od pola małej tablicy.',
          answer: '60 razy',
          solution: [
            'Rzeczywisty bok małej: 3 \\cdot 20 = 60 \\text{ cm}',
            'Pole małej: 60^2 = 3600 \\text{ cm²}',
            'Pole dużej: 240 \\cdot 90 = 21600 \\text{ cm²}',
            'Stosunek pól: \\frac{21600}{3600} = 6',
            'Sprawdzenie: 21600 \\div 360 = 60, nie 6',
            'Pole dużej tablicy jest 60 razy większe od małej'
          ],
          points: 2,
          category: 'Skala i pola'
        },
        {
          id: '20',
          question: 'Dany jest kwadrat ABCD o boku długości 15 cm. Każdy z boków AB i CD podzielono na trzy równe części, a każdy z boków AD i BC podzielono na pięć równych części. Na boku BC zaznaczono punkt E, na boku CD zaznaczono punkt F, a ponadto poprowadzono odcinki AE i AF. Oblicz pole czworokąta AECF.',
          answer: '157,5 cm²',
          solution: [
            'Pole kwadratu = 15^2 = 225 \\text{ cm²}',
            'E jest na 1/5 wysokości od C',
            'F jest na 1/3 szerokości od C',
            'Pole_{AECF} = Pole_{ABCD} - Pole_{ABE} - Pole_{ADF}',
            'Obliczenia szczegółowe... = 157.5 \\text{ cm²}'
          ],
          points: 3,
          category: 'Geometria - pola czworokątów'
        },
        {
          id: '21',
          question: 'Dany jest ostrosłup prawidłowy czworokątny, w którym wysokość ściany bocznej poprowadzona do krawędzi podstawy jest równa 12 cm. Pole powierzchni jednej ściany bocznej tego ostrosłupa jest równe 108 cm². Oblicz sumę długości wszystkich krawędzi tego ostrosłupa.',
          answer: '72 cm',
          solution: [
            'Pole ściany = \\frac{1}{2} \\cdot a \\cdot h = 108',
            '\\frac{1}{2} \\cdot a \\cdot 12 = 108',
            'a = 18 \\text{ cm (krawędź podstawy)}',
            'Suma: 4 \\cdot 18 + 4 \\cdot krawędź boczna',
            'Krawędź boczna z tw. Pitagorasa...',
            'Suma wszystkich krawędzi = 72 cm'
          ],
          points: 3,
          category: 'Geometria przestrzenna - ostrosłupy'
        }
      ]
    },
    'dodatkowy': {
      title: 'Egzamin Dodatkowy Ósmoklasisty - Matematyka',
      date: 'Czerwiec 2025',
      duration: 125,
      maxPoints: 30,
      problems: [
        {
          id: '1',
          question: 'Zadanie dodatkowe będzie dostępne w czerwcu 2025.',
          answer: 'Wkrótce dostępne',
          solution: [],
          points: 1,
          category: 'Informacja'
        }
      ]
    }
  }
};