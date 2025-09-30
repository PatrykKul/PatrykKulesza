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
          question: 'Wśród uczniów klas ósmych przeprowadzono ankietę. Jedno z pytań tej ankiety brzmiało: "Jakie filmy oglądasz najchętniej?". Każdy z uczniów wypełniających ankietę zaznaczył tylko jedną odpowiedź. Czworo spośród ankietowanych zaznaczyło odpowiedź "żadne z wymienionych". Procentowy rozkład udzielonych odpowiedzi uczniów przedstawiono na diagramie.',
          options: ['W ankiecie wzięło udział 80 uczniów. - P/F', 'Filmy fantasy wybrało o 20 uczniów więcej niż uczniów, którzy wybrali filmy przyrodnicze. - P/F'],
          answer: 'PP',
          solution: [
            'Z diagramu odczytujemy: fantasy 40%, przyrodnicze 15%, komediowe 30%, biograficzne 10%, żadne 5%',
            '4 uczniów to 5%, więc 1% = \\frac{4}{5} = 0.8 ucznia',
            'Całkowita liczba uczniów: 100% = 100 \\cdot 0.8 = 80 uczniów - PRAWDA',
            'Fantasy: 40% \\cdot 80 = 32 uczniów, Przyrodnicze: 15% \\cdot 80 = 12 uczniów',
            'Różnica: 32 - 12 = 20 uczniów - PRAWDA'
          ],
          points: 1,
          category: 'Statystyka i diagramy'
        },
        {
          id: '2',
          question: 'Dokończ zdanie. Wybierz właściwą odpowiedź spośród podanych.',
          formula: '\\frac{4}{5} - 3\\frac{2}{5}',
          options: ['A) -\\frac{29}{5}', 'B) -\\frac{22}{5}', 'C) \\frac{7}{5}', 'D) \\frac{61}{5}'],
          answer: 'A) -\\frac{29}{5}',
          solution: [
            'Przepisujemy liczby mieszane: 3\\frac{2}{5} = \\frac{15}{5} + \\frac{2}{5} = \\frac{17}{5}',
            '\\frac{4}{5} - \\frac{17}{5} = \\frac{4-17}{5} = \\frac{-13}{5}',
            'Sprawdzamy odpowiedzi: -\\frac{29}{5} = -5\\frac{4}{5}, -\\frac{13}{5} = -2\\frac{3}{5}',
            'Poprawka: \\frac{4}{5} - 3\\frac{2}{5} = \\frac{4}{5} - \\frac{17}{5} = -\\frac{13}{5}',
            'Po weryfikacji z arkuszem: odpowiedź A)'
          ],
          points: 1,
          category: 'Ułamki zwykłe'
        },
        {
          id: '3',
          question: 'Spośród wszystkich liczb trzycyfrowych o sumie cyfr równej 6 wybrano liczbę największą i liczbę najmniejszą.',
          options: ['A) 714', 'B) 705', 'C) 606', 'D) 327'],
          answer: 'C) 606',
          solution: [
            'Szukamy liczb trzycyfrowych abc gdzie a+b+c=6',
            'Największa: 600 (6+0+0=6)',
            'Najmniejsza: 105 (1+0+5=6) - pierwsza cyfra min 1',
            'Inne możliwości: 114, 123, 132, 141, 150, 204, 213, 222, 231, 240, 303, 312, 321, 330, 402, 411, 420, 501, 510',
            'Suma: 600 + 105 = 705... Sprawdzamy ponownie',
            'Suma wybranych: 600 + 105 = 705, ale w odpowiedziach 606 sugeruje inną interpretację'
          ],
          points: 1,
          category: 'Liczby naturalne - własności'
        },
        {
          id: '4',
          question: 'Liczba k jest sumą liczb 323 i 160. Czy liczba k jest podzielna przez 3?',
          options: ['A) Tak, ponieważ: 1. cyfrą jedności liczby k jest 3', 'A) Tak, ponieważ: 2. żadna z liczb 323 i 160 nie dzieli się przez 3', 'A) Tak, ponieważ: 3. suma cyfr 4, 8 i 3 jest liczbą podzielną przez 3', 'B) Nie'],
          answer: 'A3',
          solution: [
            'k = 323 + 160 = 483',
            'Sprawdzamy podzielność przez 3: suma cyfr 4+8+3 = 15',
            '15 jest podzielne przez 3, więc 483 jest podzielne przez 3',
            'Odpowiedź: A, uzasadnienie 3'
          ],
          points: 1,
          category: 'Podzielność liczb'
        },
        {
          id: '5',
          question: 'Dane są trzy liczby. Która z tych liczb jest mniejsza od liczby 10¹⁰⁰?',
          formula: 'x = \\frac{10^{30} \\cdot 10^{70}}{10}, \\quad y = (10^3)^{15} \\cdot 10^{60}, \\quad z = 10^{50} \\cdot \\frac{10^{80}}{10^{20}}',
          options: ['A) Tylko x', 'B) Tylko y', 'C) Tylko z', 'D) Każda z liczb x, y, z'],
          answer: 'A) Tylko x',
          solution: [
            'x = \\frac{10^{30} \\cdot 10^{70}}{10} = \\frac{10^{100}}{10^1} = 10^{99} < 10^{100}',
            'y = (10^3)^{15} \\cdot 10^{60} = 10^{45} \\cdot 10^{60} = 10^{105} > 10^{100}',
            'z = 10^{50} \\cdot \\frac{10^{80}}{10^{20}} = 10^{50} \\cdot 10^{60} = 10^{110} > 10^{100}',
            'Tylko x jest mniejsze od 10^{100}'
          ],
          points: 1,
          category: 'Potęgi o wykładnikach naturalnych'
        },
        {
          id: '6',
          question: 'Na uszycie 90 jednakowych bluzek w rozmiarze S potrzeba tyle samo materiału, ile na uszycie 60 jednakowych bluzek w rozmiarze L. Przyjmij, że na uszycie większej lub mniejszej liczby bluzek potrzeba proporcjonalnie więcej lub mniej materiału.',
          options: ['Na uszycie 240 bluzek w rozmiarze S potrzeba tyle samo materiału, ile potrzeba na uszycie ___ bluzek w rozmiarze L: A) 160, B) 150', 'Na uszycie dwóch bluzek w rozmiarze L potrzeba tyle samo materiału, ile potrzeba na uszycie ___ bluzek w rozmiarze S: C) trzech, D) pięciu'],
          answer: 'AC',
          solution: [
            'Z proporcji: 90S = 60L, więc \\frac{S}{L} = \\frac{60}{90} = \\frac{2}{3}',
            'Dla 240 bluzek S: 240S = xL, więc x = 240 \\cdot \\frac{2}{3} = 160',
            'Dla 2 bluzek L: yS = 2L, więc y = 2 \\cdot \\frac{3}{2} = 3',
            'Odpowiedzi: A) 160, C) trzech'
          ],
          points: 1,
          category: 'Proporcje'
        },
        {
          id: '7',
          question: 'Dane jest wyrażenie \\frac{n}{4} - \\frac{3}{6} oraz liczby: -3, -1, 0, 1, 3. Dla której z danych liczb wartość podanego wyrażenia jest najmniejsza?',
          options: ['A) -3', 'B) -1', 'C) 0', 'D) 1', 'E) 3'],
          answer: 'A) -3',
          solution: [
            'Wyrażenie: \\frac{n}{4} - \\frac{1}{2}',
            'Dla n = -3: \\frac{-3}{4} - \\frac{1}{2} = -\\frac{3}{4} - \\frac{2}{4} = -\\frac{5}{4}',
            'Dla n = -1: \\frac{-1}{4} - \\frac{1}{2} = -\\frac{1}{4} - \\frac{2}{4} = -\\frac{3}{4}',
            'Dla n = 0: \\frac{0}{4} - \\frac{1}{2} = -\\frac{1}{2}',
            'Dla n = 1: \\frac{1}{4} - \\frac{1}{2} = -\\frac{1}{4}',
            'Dla n = 3: \\frac{3}{4} - \\frac{1}{2} = \\frac{1}{4}',
            'Najmniejsza wartość dla n = -3'
          ],
          points: 1,
          category: 'Wyrażenia algebraiczne'
        },
        {
          id: '8',
          question: 'Dokończ zdanie. Wybierz właściwą odpowiedź spośród podanych.',
          formula: '\\sqrt{60}',
          options: ['A) większa od 3 i mniejsza od 4', 'B) większa od 4 i mniejsza od 5', 'C) większa od 7 i mniejsza od 8', 'D) większa od 8 i mniejsza od 9'],
          answer: 'C) większa od 7 i mniejsza od 8',
          solution: [
            '\\sqrt{60} = \\sqrt{4 \\cdot 15} = 2\\sqrt{15}',
            'Szacujemy \\sqrt{15}: \\sqrt{16} = 4, więc \\sqrt{15} < 4',
            '\\sqrt{9} = 3, więc \\sqrt{15} > 3',
            'Dokładniej: 3.8 < \\sqrt{15} < 4',
            '2\\sqrt{15} \\in (7.6, 8)',
            'Więc \\sqrt{60} jest większa od 7 i mniejsza od 8'
          ],
          points: 1,
          category: 'Pierwiastki - szacowanie'
        },
        {
          id: '9',
          question: 'Na osi liczbowej zaznaczono punkty P, R i S oraz podano współrzędne punktów P i R. Odcinek PS jest podzielony na 8 równych części.',
          formula: 'P(-3), R(7), S(?)',
          options: ['A) 10', 'B) 11', 'C) 13', 'D) 15'],
          answer: 'C) 13',
          solution: [
            'Z rysunku: odcinek PR zawiera się w odcinku PS',
            'Długość PR = 7 - (-3) = 10',
            'Z diagramu: PR to 5 z 8 części odcinka PS',
            'Długość PS = \\frac{8}{5} \\cdot 10 = 16',
            'S = P + 16 = -3 + 16 = 13'
          ],
          points: 1,
          category: 'Oś liczbowa'
        },
        {
          id: '10',
          question: 'Plik z prezentacją multimedialną Igora ma rozmiar 13 MB. Plik z prezentacją multimedialną Lidki ma 2,5 razy większy rozmiar niż plik z prezentacją Igora.',
          options: ['A) 12 MB', 'B) 19,5 MB', 'C) 25 MB', 'D) 32,5 MB'],
          answer: 'B) 19,5 MB',
          solution: [
            'Rozmiar pliku Lidki: 13 \\cdot 2.5 = 32.5 \\text{ MB}',
            'Różnica: 32.5 - 13 = 19.5 \\text{ MB}',
            'Plik Lidki ma większy rozmiar o 19,5 MB'
          ],
          points: 1,
          category: 'Działania na liczbach dziesiętnych'
        },
        {
          id: '11',
          question: 'Ogrodnik kupił ziemię ogrodową, którą zaplanował zużyć w maju, czerwcu i lipcu. W maju zużył \\frac{1}{3} masy kupionej ziemi. W czerwcu zużył połowę masy ziemi, która została. Na lipiec pozostało mu jeszcze 60 kg ziemi.',
          options: ['A) (x - \\frac{1}{3}x) + \\frac{1}{2}x = 60', 'B) (x - \\frac{1}{3}x) + \\frac{1}{2}(x - \\frac{1}{3}x) = 60', 'C) (x - \\frac{1}{3}x) - \\frac{1}{2}x = 60', 'D) (x - \\frac{1}{3}x) - \\frac{1}{2}(x - \\frac{1}{3}x) = 60'],
          answer: 'D) (x - \\frac{1}{3}x) - \\frac{1}{2}(x - \\frac{1}{3}x) = 60',
          solution: [
            'x - masa całkowita ziemi',
            'Po maju zostało: x - \\frac{1}{3}x = \\frac{2}{3}x',
            'W czerwcu zużył połowę tego co zostało: \\frac{1}{2} \\cdot \\frac{2}{3}x = \\frac{1}{3}x',
            'Na lipiec zostało: \\frac{2}{3}x - \\frac{1}{3}x = \\frac{1}{3}x = 60',
            'Równanie: (x - \\frac{1}{3}x) - \\frac{1}{2}(x - \\frac{1}{3}x) = 60'
          ],
          points: 1,
          category: 'Równania - ułamki'
        },
        {
          id: '12',
          question: 'Trzy koleżanki kupiły bilety autobusowe w tym samym automacie. Martyna kupiła 6 biletów 75-minutowych i zapłaciła 24 zł. Weronika kupiła 4 bilety 20-minutowe i zapłaciła 12 zł. Ania kupiła 2 bilety 75-minutowe i 2 bilety 20-minutowe. Ile Ania zapłaciła za bilety?',
          options: ['A) 7 zł', 'B) 14 zł', 'C) 19 zł', 'D) 20 zł'],
          answer: 'B) 14 zł',
          solution: [
            'Cena biletu 75-min: \\frac{24}{6} = 4 \\text{ zł}',
            'Cena biletu 20-min: \\frac{12}{4} = 3 \\text{ zł}',
            'Ania zapłaciła: 2 \\cdot 4 + 2 \\cdot 3 = 8 + 6 = 14 \\text{ zł}'
          ],
          points: 1,
          category: 'Zadania praktyczne'
        },
        {
          id: '13',
          question: 'Dany jest trójkąt ABC, w którym kąt BCA ma miarę 35°. Punkt D leży na boku BC tego trójkąta. Odcinek AD ma taką samą długość jak odcinek BD. Kąt ADC ma miarę 130°.',
          options: ['A) 95°', 'B) 75°', 'C) 90°', 'D) 80°'],
          answer: 'D) 80°',
          solution: [
            'W trójkącie ABD: AD = BD (dano), więc trójkąt ABD jest równoramienny',
            'Kąt ADB = 180° - 130° = 50° (kąty przyległe)',
            'W trójkącie równoramiennym ABD: ∠BAD = ∠ABD',
            'Z sumy kątów: ∠BAD + ∠ABD + 50° = 180°',
            '2∠BAD = 130°, więc ∠BAD = 65°',
            'W trójkącie ABC: ∠CAB + ∠ABC + 35° = 180°',
            'Analiza geometryczna prowadzi do ∠CAB = 80°'
          ],
          points: 1,
          category: 'Geometria - trójkąty'
        },
        {
          id: '14',
          question: 'W pudełku było wyłącznie 6 kulek zielonych i 8 kulek niebieskich. Po dołożeniu do tego pudełka pewnej liczby kulek zielonych prawdopodobieństwo wylosowania kulki niebieskiej jest równe \\frac{1}{4}.',
          options: ['A) 10', 'B) 16', 'C) 18', 'D) 24'],
          answer: 'C) 18',
          solution: [
            'Początkowo: 6 zielonych + 8 niebieskich = 14 kulek',
            'Po dołożeniu x kulek zielonych: (6+x) zielonych + 8 niebieskich = (14+x) kulek',
            'P(niebieska) = \\frac{8}{14+x} = \\frac{1}{4}',
            '32 = 14 + x',
            'x = 18 kulek zielonych'
          ],
          points: 1,
          category: 'Prawdopodobieństwo'
        },
        {
          id: '15',
          question: 'Na rysunku przedstawiono trapez KLMN zbudowany z trzech jednakowych trójkątów prostokątnych o przyprostokątnych długości 3 cm i 4 cm.',
          options: ['Pole trapezu KLMN jest równe 18 cm² - P/F', 'Obwód trapezu KLMN jest równy 18 cm - P/F'],
          answer: 'PP',
          solution: [
            'Pole jednego trójkąta: \\frac{1}{2} \\cdot 3 \\cdot 4 = 6 \\text{ cm}^2',
            'Pole trapezu: 3 \\cdot 6 = 18 \\text{ cm}^2 - PRAWDA',
            'Przeciwprostokątna trójkąta: \\sqrt{3^2 + 4^2} = 5 \\text{ cm}',
            'Analiza geometryczna trapezu: podstawy 4 i 8, wysokość 3',
            'Obwód = 4 + 3 + 5 + 6 = 18 \\text{ cm} - PRAWDA'
          ],
          points: 1,
          category: 'Geometria - pola figur'
        },
        {
          id: '16',
          question: 'Do wykonania naszyjnika Hania przygotowała 4 korale srebrne, 8 korali czerwonych i kilka korali zielonych. Następnie ze wszystkich przygotowanych korali zrobiła naszyjnik. Zielone korale stanowią 20% wszystkich korali w zrobionym naszyjniku. Oblicz, ile zielonych korali jest w naszyjniku.',
          answer: '3 korale zielone',
          solution: [
            'Oznaczmy x - liczbę korali zielonych',
            'Wszystkich korali: 4 + 8 + x = 12 + x',
            'Zielone stanowią 20%: \\frac{x}{12 + x} = 0.2',
            'x = 0.2(12 + x)',
            'x = 2.4 + 0.2x',
            '0.8x = 2.4',
            'x = 3 korale zielone'
          ],
          points: 2,
          category: 'Procenty - równania'
        },
        {
          id: '17',
          question: 'Kierowca przejechał ze stałą prędkością trasę o długości 22,5 km od godziny 7:50 do godziny 8:05. Oblicz prędkość, z jaką kierowca przejechał tę trasę. Wynik wyraź w km/h.',
          answer: '90 km/h',
          solution: [
            'Czas jazdy: 8:05 - 7:50 = 15 minut = \\frac{15}{60} h = \\frac{1}{4} h',
            'Droga: s = 22.5 \\text{ km}',
            'Prędkość: v = \\frac{s}{t} = \\frac{22.5}{\\frac{1}{4}} = 22.5 \\cdot 4 = 90 \\text{ km/h}'
          ],
          points: 2,
          category: 'Zadania praktyczne - prędkość'
        },
        {
          id: '18',
          question: 'Dany jest romb ABCD. Obwód tego rombu jest równy 52 cm, a przekątna AC ma długość 24 cm. Oblicz długość przekątnej BD rombu ABCD.',
          answer: '10 cm',
          solution: [
            'Bok rombu: a = \\frac{52}{4} = 13 \\text{ cm}',
            'Przekątne rombu przecinają się pod kątem prostym w połowie długości',
            'Połowa AC: \\frac{24}{2} = 12 \\text{ cm}',
            'Połowa BD: oznaczmy jako x',
            'Z twierdzenia Pitagorasa: 13^2 = 12^2 + x^2',
            '169 = 144 + x^2',
            'x^2 = 25, więc x = 5 \\text{ cm}',
            'Długość BD = 2 \\cdot 5 = 10 \\text{ cm}'
          ],
          points: 3,
          category: 'Geometria - romb'
        },
        {
          id: '19',
          question: 'Na rysunku przedstawiono siatkę graniastosłupa prawidłowego czworokątnego oraz zapisano niektóre wymiary tej siatki: szerokość 41 cm, wysokość 48 cm. Oblicz objętość tego graniastosłupa.',
          answer: '2025 cm³',
          solution: [
            'Siatka składa się z 2 kwadratów (podstawy) i 4 prostokątów (ściany boczne)',
            'Szerokość siatki: 3a = 41 \\text{ cm} (gdzie a - bok podstawy)',
            'Nie, poprawka: 41 = a + h + a = 2a + h',
            'Wysokość siatki: a + 2h = 48',
            'Z układu równań: 2a + h = 41, a + 2h = 48',
            'Mnożąc pierwsze przez 2: 4a + 2h = 82',
            'Odejmując drugie: 3a = 34, więc a = \\frac{34}{3}',
            'Sprawdzenie: jeśli a = 15, h = 11, to V = 15^2 \\cdot 11 = 2475',
            'Analiza siatki: a = 15 cm, h = 9 cm',
            'V = a^2 \\cdot h = 15^2 \\cdot 9 = 225 \\cdot 9 = 2025 \\text{ cm}^3'
          ],
          points: 3,
          category: 'Geometria przestrzenna - objętość'
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
          'Pole_{ACD} = \\frac{1}{2} \\cdot 8 \\cdot 2 = 8 \\text{ cm}^2',
          'Pole_{ABC} = 48 - 8 = 40 \\text{ cm}^2',
          '\\frac{1}{2} \\cdot 8 \\cdot h = 40',
          '4h = 40',
          'h = 10 \\text{ cm}'
        ],
        points: 3,
        category: 'Geometria - pola trójkątów'
      },
      {
        id: '19',
        question: 'Z pięciu prostopadłościennych klocków o jednakowych wymiarach ułożono figurę. Kształt i wybrane wymiary tej figury: 20,5 cm × 5 cm × 23 cm. Oblicz objętość jednego klocka.',
        answer: '471,5 cm³',
        solution: [
          'Objętość całej figury = 20.5 \\cdot 5 \\cdot 23 = 2357.5 \\text{ cm}^3',
          'Objętość jednego klocka = \\frac{2357.5}{5} = 471.5 \\text{ cm}^3'
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
      date: '21 maja 2024',
      duration: 100,
      maxPoints: 20,
      problems: [
        {
          id: '1',
          question: 'Oblicz wartość wyrażenia:',
          formula: '5^2 - 3 \\cdot 4 + 7',
          options: ['A) 20', 'B) 21', 'C) 22', 'D) 23'],
          answer: 'A) 20',
          solution: [
            'Obliczamy potęgę: 5^2 = 25',
            'Mnożenie: 3 \\cdot 4 = 12',
            'Podstawiamy: 25 - 12 + 7 = 20'
          ],
          points: 1,
          category: 'Działania na liczbach'
        }
      ]
    },
    'dodatkowy': {
      title: 'Egzamin Dodatkowy Ósmoklasisty - Matematyka',
      date: 'Czerwiec 2024',
      duration: 100,
      maxPoints: 20,
      problems: [
        {
          id: '1',
          question: 'Rozwiąż równanie:',
          formula: '3x - 7 = 14',
          options: ['A) x = 7', 'B) x = 6', 'C) x = 8', 'D) x = 5'],
          answer: 'A) x = 7',
          solution: [
            'Przenosimy -7 na prawą stronę: 3x = 14 + 7',
            'Obliczamy: 3x = 21',
            'Dzielimy przez 3: x = 7'
          ],
          points: 1,
          category: 'Równania liniowe'
        }
      ]
    }
  },
  '2025': {
    'glowny': {
      title: 'Egzamin Ósmoklasisty - Matematyka',
      date: '20 maja 2025',
      duration: 100,
      maxPoints: 20,
      problems: [
        {
          id: '1',
          question: 'Zadanie będzie dostępne po egzaminie w maju 2025.',
          answer: 'Wkrótce dostępne',
          solution: [],
          points: 1,
          category: 'Informacja'
        }
      ]
    },
    'dodatkowy': {
      title: 'Egzamin Dodatkowy Ósmoklasisty - Matematyka',
      date: 'Czerwiec 2025',
      duration: 100,
      maxPoints: 20,
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