// examData.ts - Dane wszystkich egzaminów ósmoklasisty

export interface MathProblem {
  id: string;
  question: string;
  formula?: string;
  options?: string[];
  answer: string;
  solution?: string[];
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
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
      maxPoints: 20,
      pdfUrl: '/pdfs/egzamin-8-2022-glowny.pdf',
      answerKeyUrl: '/pdfs/egzamin-8-2022-glowny-odpowiedzi.pdf',
      problems: [
        {
          id: '1',
          question: 'Wśród pewnej grupy osób przeprowadzono ankietę. Jedno z pytań brzmiało: Jaka jest twoja ulubiona pora roku? Każdy ankietowany wskazał tylko jedną porę roku.',
          options: ['Zima jest ulubioną porą roku dla mniej niż 24% liczby osób ankietowanych - P/F', 'Lato jest ulubioną porą roku dla 3/7 liczby osób ankietowanych - P/F'],
          answer: 'PP',
          solution: [
            'Z diagramu słupkowego odczytujemy dane dla każdej pory roku',
            'Sprawdzamy wartości procentowe dla zimy i lata',
            'Zima: mniej niż 24% - PRAWDA',
            'Lato: \\frac{3}{7} \\approx 42.86\\% - PRAWDA'
          ],
          points: 1,
          difficulty: 'easy',
          category: 'Statystyka i diagramy'
        },
        {
          id: '2',
          question: 'Córka obecnie jest 4 razy młodsza od swojej mamy. Razem mają 60 lat.',
          options: ['A) Mama ma 48 lat', 'B) Mama ma 45 lat', 'C) Córka za 8 lat będzie miała 23 lata', 'D) Córka za 8 lat będzie miała 20 lat'],
          answer: 'AD',
          solution: [
            'x - wiek córki, \\quad 4x - wiek mamy',
            'x + 4x = 60',
            '5x = 60 \\Rightarrow x = 12',
            'Mama ma 48 lat, córka 12 lat',
            'Za 8 lat córka będzie miała: 12 + 8 = 20 \\text{ lat}'
          ],
          points: 1,
          difficulty: 'easy',
          category: 'Równania liniowe - zadania tekstowe'
        },
        {
          id: '3',
          question: 'Liczby: x, (-5/6), y, są uporządkowane rosnąco. Liczba y jest o 0,5 większa od (-5/6), a liczba (-5/6) jest o 0,5 większa od liczby x.',
          options: ['A) x = -4/3 i y = -1/3', 'B) x = -7/6 i y = -1/6', 'C) x = -4/3 i y = -1/2', 'D) x = -7/6 i y = -1/3'],
          answer: 'A) x = -4/3 i y = -1/3',
          solution: [
            'x = -\\frac{5}{6} - 0.5 = -\\frac{5}{6} - \\frac{1}{2}',
            'x = -\\frac{5}{6} - \\frac{3}{6} = -\\frac{8}{6} = -\\frac{4}{3}',
            'y = -\\frac{5}{6} + 0.5 = -\\frac{5}{6} + \\frac{1}{2}',
            'y = -\\frac{5}{6} + \\frac{3}{6} = -\\frac{2}{6} = -\\frac{1}{3}'
          ],
          points: 1,
          difficulty: 'medium',
          category: 'Ułamki i liczby wymierne'
        },
        {
          id: '4',
          question: 'Dokończ zdanie. Wybierz właściwą odpowiedź spośród podanych.',
          formula: '-2(x - 1) - 3(2 - x) = 0',
          options: ['A) -4', 'B) -1,6', 'C) 0,8', 'D) 4', 'E) 8'],
          answer: 'D) 4',
          solution: [
            '-2(x - 1) - 3(2 - x) = 0',
            '-2x + 2 - 6 + 3x = 0',
            'x - 4 = 0',
            'x = 4'
          ],
          points: 1,
          difficulty: 'medium',
          category: 'Równania liniowe'
        },
        {
          id: '5',
          question: 'O godzinie 14:50 Maciek wyruszył w podróż pociągiem z Gdańska do Grudziądza. Najpierw dojechał do Iławy, gdzie po 50-minutowym oczekiwaniu wsiadł do pociągu, którym dojechał do Grudziądza. Na osi czasu przejazd podzielono na 20 jednakowych odstępów.',
          options: ['Przejazd z Iławy do Grudziądza trwał jedną godzinę - P/F', 'Maciek przyjechał do Grudziądza o godzinie 18:10 - P/F'],
          answer: 'PP',
          solution: [
            'Analizujemy diagram czasu podróży',
            'Czas podzielony na 20 równych części',
            'Obliczamy długość jednego odcinka',
            'Sprawdzamy oba zdania na podstawie diagramu'
          ],
          points: 1,
          difficulty: 'medium',
          category: 'Obliczenia praktyczne - czas'
        },
        {
          id: '6',
          question: 'Dane są trzy liczby. Które spośród tych liczb są mniejsze od liczby 11?',
          formula: 'g = \\sqrt{120}, \\quad h = 8 + \\sqrt{17}, \\quad k = 9 + \\sqrt{3}',
          options: ['A) Tylko g', 'B) Tylko h i k', 'C) Tylko g i k', 'D) Tylko g i h'],
          answer: 'C) Tylko g i k',
          solution: [
            'g = \\sqrt{120} \\approx 10.95 < 11 \\checkmark',
            'h = 8 + \\sqrt{17} \\approx 8 + 4.12 = 12.12 > 11',
            'k = 9 + \\sqrt{3} \\approx 9 + 1.73 = 10.73 < 11 \\checkmark',
            'Odpowiedź: tylko g \\text{ i } k'
          ],
          points: 1,
          difficulty: 'medium',
          category: 'Pierwiastki - szacowanie'
        },
        {
          id: '7',
          question: 'Liczbę 404 można zapisać w postaci (21 · 19 + 5). Oceń prawdziwość podanych zdań.',
          options: ['Resztą z dzielenia liczby 404 przez 19 jest 5 - P/F', 'Jeśli liczbę 404 zmniejszymy o 5, to otrzymamy liczbę podzielną przez 21 - P/F'],
          answer: 'PP',
          solution: [
            '404 = 21 \\cdot 19 + 5',
            'Z zapisu widać, że reszta z dzielenia przez 19 wynosi 5 - PRAWDA',
            '404 - 5 = 399 = 21 \\cdot 19',
            '399 \\text{ jest podzielne przez } 21 - PRAWDA'
          ],
          points: 1,
          difficulty: 'medium',
          category: 'Podzielność liczb - dzielenie z resztą'
        },
        {
          id: '8',
          question: 'Na tablicy zapisano wszystkie różne liczby dwucyfrowe, które jednocześnie spełniają trzy warunki: są mniejsze od 40, są podzielne przez 3, suma cyfr każdej z nich jest większa od 7. Ile liczb zapisano na tablicy?',
          options: ['A) 3', 'B) 4', 'C) 5', 'D) 6'],
          answer: 'B) 4',
          solution: [
            'Liczby dwucyfrowe < 40 \\text{ i podzielne przez } 3: 12, 15, 18, 21, 24, 27, 30, 33, 36, 39',
            'Suma cyfr > 7:',
            '18: 1+8=9 \\checkmark, \\quad 27: 2+7=9 \\checkmark',
            '36: 3+6=9 \\checkmark, \\quad 39: 3+9=12 \\checkmark',
            'Odpowiedź: 4 liczby'
          ],
          points: 1,
          difficulty: 'medium',
          category: 'Podzielność i własności liczb'
        },
        {
          id: '9',
          question: 'Biuro podróży w ramach oferty promocyjnej obniżyło cenę wycieczki o 20%. Pani Anna skorzystała z promocji i za wycieczkę zapłaciła 1500 zł. Jaka była cena wycieczki przed obniżką?',
          options: ['A) 1800 zł', 'B) 1875 zł', 'C) 2000 zł', 'D) 2175 zł'],
          answer: 'B) 1875 zł',
          solution: [
            '1500 \\text{ zł to } 80\\% \\text{ pierwotnej ceny (100% - 20%)}',
            'x - pierwotna cena',
            '0.8x = 1500',
            'x = \\frac{1500}{0.8} = 1875 \\text{ zł}'
          ],
          points: 1,
          difficulty: 'medium',
          category: 'Procenty - obliczenia odwrotne'
        },
        {
          id: '10',
          question: 'Dokończ zdanie. Wybierz właściwą odpowiedź spośród podanych.',
          formula: '3^5 \\cdot 9^6',
          options: ['A) 27^{30}', 'B) 27^{11}', 'C) 3^{17}', 'D) 3^{13}'],
          answer: 'C) 3^{17}',
          solution: [
            '9^6 = (3^2)^6 = 3^{12}',
            '3^5 \\cdot 3^{12} = 3^{5+12} = 3^{17}'
          ],
          points: 1,
          difficulty: 'medium',
          category: 'Potęgi - działania'
        },
        {
          id: '11',
          question: 'Dany jest wzór na pole powierzchni całkowitej graniastosłupa. Pole podstawy Pp wyznaczone poprawnie z powyższego wzoru opisano równaniem:',
          formula: 'P_c = 2P_p + P_b',
          options: ['A) P_p = \\frac{P_c - P_b}{2}', 'B) P_p = \\frac{P_c}{2} - P_b', 'C) P_p = P_c - \\frac{P_b}{2}', 'D) P_p = P_c - P_b'],
          answer: 'A) P_p = \\frac{P_c - P_b}{2}',
          solution: [
            'P_c = 2P_p + P_b',
            '2P_p = P_c - P_b',
            'P_p = \\frac{P_c - P_b}{2}'
          ],
          points: 1,
          difficulty: 'easy',
          category: 'Przekształcanie wzorów'
        },
        {
          id: '12',
          question: 'Na rysunku przedstawiono prostokąt i dwa trójkąty równoramienne T₁ (5, 5, 8 cm) i T₂ (6, 6, 3 cm) oraz prostokąt (3 × 8 cm). Czy te trzy wielokąty mogą być ścianami jednego ostrosłupa?',
          options: ['A) Tak, ponieważ długości boków prostokąta są równe długościom podstaw trójkątów T₁ i T₂', 'B) Nie, ponieważ trójkąty T₁ i T₂ mają podstawy różnej długości', 'C) Nie, ponieważ ramiona trójkąta T₁ mają inną długość niż ramiona trójkąta T₂'],
          answer: 'B3',
          solution: [
            'Ściany boczne ostrosłupa muszą mieć wspólny wierzchołek',
            'Krawędzie boczne (z wierzchołka do podstawy) muszą być równe',
            'Ramiona T_1: 5 \\text{ cm}, \\quad ramiona T_2: 6 \\text{ cm}',
            'Różne długości ramion - niemożliwe dla jednego ostrosłupa'
          ],
          points: 1,
          difficulty: 'hard',
          category: 'Geometria przestrzenna - ostrosłupy'
        },
        {
          id: '13',
          question: 'W pewnym rombie jeden z kątów wewnętrznych ma miarę 120°. Obwód tego rombu jest równy 24 cm. Dłuższa przekątna tego rombu ma długość:',
          options: ['A) 3√3 cm', 'B) 6 cm', 'C) 6√3 cm', 'D) 12 cm'],
          answer: 'C) 6√3 cm',
          solution: [
            'Bok rombu: a = \\frac{24}{4} = 6 \\text{ cm}',
            'Kąty w rombie: 120° \\text{ i } 60°',
            'Przekątne dzielą romb na 4 trójkąty',
            'Stosując własności rombu: d = 6\\sqrt{3} \\text{ cm}'
          ],
          points: 1,
          difficulty: 'hard',
          category: 'Geometria - romb'
        },
        {
          id: '14',
          question: 'Na rysunku przedstawiono prostokąt. Długość dłuższego boku oznaczono x oraz 27 - 2x. Długość krótszego boku oznaczono y oraz 2y - 3. Które równanie NIE opisuje poprawnej zależności między x i y?',
          options: ['A) x - y = 6', 'B) x + y = 12', 'C) x · y = 27', 'D) y : x = 3'],
          answer: 'D) y : x = 3',
          solution: [
            'x = 27 - 2x \\Rightarrow 3x = 27 \\Rightarrow x = 9',
            'y = 2y - 3 \\Rightarrow -y = -3 \\Rightarrow y = 3',
            'A) 9 - 3 = 6 \\checkmark',
            'B) 9 + 3 = 12 \\checkmark',
            'C) 9 \\cdot 3 = 27 \\checkmark',
            'D) 3 : 9 = \\frac{1}{3} \\neq 3 \\times'
          ],
          points: 1,
          difficulty: 'medium',
          category: 'Równania i wyrażenia algebraiczne'
        },
        {
          id: '15',
          question: 'Wartość wyrażenia 2 - 2a² dla a = -3 oraz przekształcenie wyrażenia ½(2 - 2a²):',
          options: ['A) -16', 'B) 20', 'C) 1 - 2a²', 'D) 1 - a²'],
          answer: 'AD',
          solution: [
            '2 - 2a^2 = 2 - 2(-3)^2 = 2 - 2 \\cdot 9 = 2 - 18 = -16',
            '\\frac{1}{2}(2 - 2a^2) = \\frac{1}{2} \\cdot 2 - \\frac{1}{2} \\cdot 2a^2',
            '= 1 - a^2'
          ],
          points: 1,
          difficulty: 'medium',
          category: 'Wyrażenia algebraiczne'
        },
        {
          id: '16',
          question: 'W kasie są banknoty 20-złotowe i 50-złotowe. Liczba banknotów 20-złotowych jest taka sama jak liczba banknotów 50-złotowych. Łączna wartość wszystkich banknotów 50-złotowych jest o 6 tysięcy złotych większa od łącznej wartości wszystkich banknotów 20-złotowych. Oblicz, ile banknotów 20-złotowych jest w kasie.',
          answer: '200 banknotów',
          solution: [
            'x - liczba banknotów każdego rodzaju',
            '50x - 20x = 6000',
            '30x = 6000',
            'x = 200'
          ],
          points: 2,
          difficulty: 'medium',
          category: 'Równania - zadania tekstowe'
        },
        {
          id: '17',
          question: 'Janek miał łącznie 84 piłeczki w trzech kolorach: czerwonym, zielonym i niebieskim. Liczby piłeczek czerwonych, zielonych i niebieskich są odpowiednio kolejnymi liczbami podzielnymi przez 7. Janek rozdzielił wszystkie piłeczki na siedem identycznych zestawów. Oblicz, ile piłeczek czerwonych, zielonych i niebieskich było w jednym zestawie.',
          answer: 'Czerwone: 3, Zielone: 4, Niebieskie: 5',
          solution: [
            'x, x+7, x+14 - kolejne liczby podzielne przez 7',
            'x + (x+7) + (x+14) = 84',
            '3x + 21 = 84',
            'x = 21 \\text{ (czerwone)}',
            'x+7 = 28 \\text{ (zielone)}, \\quad x+14 = 35 \\text{ (niebieskie)}',
            'W jednym zestawie: 21:7=3, \\quad 28:7=4, \\quad 35:7=5'
          ],
          points: 2,
          difficulty: 'hard',
          category: 'Równania i podzielność'
        },
        {
          id: '18',
          question: 'Prostokątna łąka jest podzielona na dwie części A i B w kształcie trapezów. Część A ma podstawy 10 m i 40 m, wysokość 80 m. Część B ma podstawy 60 m i 90 m, wysokość 80 m. Kosiarka w ciągu każdej godziny kosi powierzchnię o takim samym polu. Trawę z części A kosiarka skosiła w ciągu trzech godzin. Oblicz, ile godzin kosiarka będzie kosiła trawę w części B.',
          answer: '9 godzin',
          solution: [
            'P_A = \\frac{1}{2}(10 + 40) \\cdot 80 = 2000 \\text{ m}^2',
            'P_B = \\frac{1}{2}(60 + 90) \\cdot 80 = 6000 \\text{ m}^2',
            'P_B = 3 \\cdot P_A',
            'Czas dla B: 3 \\cdot 3 = 9 \\text{ godzin}'
          ],
          points: 3,
          difficulty: 'hard',
          category: 'Geometria i proporcje'
        },
        {
          id: '19',
          question: 'Na rysunku przedstawiono graniastosłup prosty, którego podstawą jest trójkąt prostokątny. Długość jednej przyprostokątnej jest równa 8 cm, a długość przeciwprostokątnej jest równa 10 cm. Najmniejsza ściana boczna tego graniastosłupa ma pole równe 54 cm². Oblicz sumę długości wszystkich krawędzi tego graniastosłupa.',
          answer: '75 cm',
          solution: [
            'Z tw. Pitagorasa: a^2 + 8^2 = 10^2',
            'a^2 = 100 - 64 = 36',
            'a = 6 \\text{ cm (druga przyprostokątna)}',
            'Najmniejsza ściana: 6 \\cdot H = 54',
            'H = 9 \\text{ cm (wysokość graniastosłupa)}',
            'Suma krawędzi: 2(6 + 8 + 10) + 3 \\cdot 9 = 48 + 27 = 75 \\text{ cm}'
          ],
          points: 3,
          difficulty: 'hard',
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
          difficulty: 'easy',
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
      maxPoints: 20,
      pdfUrl: '/pdfs/egzamin-8-2023-glowny.pdf',
      answerKeyUrl: '/pdfs/egzamin-8-2023-glowny-odpowiedzi.pdf',
      problems: [
        {
          id: '1',
          question: 'Oblicz wartość wyrażenia:',
          formula: '3 \\cdot 2^2 - 4 \\cdot 3 + 5',
          options: ['A) 5', 'B) 7', 'C) 9', 'D) 11'],
          answer: 'A) 5',
          solution: [
            'Obliczamy potęgę: 2^2 = 4',
            'Mnożenie: 3 \\cdot 4 = 12 \\text{ i } 4 \\cdot 3 = 12',
            'Podstawiamy: 12 - 12 + 5 = 5'
          ],
          points: 1,
          difficulty: 'easy',
          category: 'Działania na liczbach'
        },
        {
          id: '2',
          question: 'Rozwiąż równanie:',
          formula: '2x + 5 = 13',
          options: ['A) x = 3', 'B) x = 4', 'C) x = 5', 'D) x = 6'],
          answer: 'B) x = 4',
          solution: [
            'Przenosimy 5 na prawą stronę: 2x = 13 - 5',
            'Obliczamy: 2x = 8',
            'Dzielimy przez 2: x = 4'
          ],
          points: 1,
          difficulty: 'easy',
          category: 'Równania liniowe'
        },
        {
          id: '3',
          question: 'Oblicz pole prostokąta o bokach:',
          formula: 'a = 3\\sqrt{2}\\text{ cm}, \\quad b = 2\\sqrt{8}\\text{ cm}',
          options: ['A) 12 cm²', 'B) 24 cm²', 'C) 6√16 cm²', 'D) 12√2 cm²'],
          answer: 'B) 24 cm²',
          solution: [
            'Upraszczamy drugi bok: b = 2\\sqrt{8} = 2\\sqrt{4 \\cdot 2} = 2 \\cdot 2\\sqrt{2} = 4\\sqrt{2}',
            'Pole: P = a \\cdot b = 3\\sqrt{2} \\cdot 4\\sqrt{2}',
            'Obliczamy: P = 12 \\cdot (\\sqrt{2})^2 = 12 \\cdot 2 = 24 \\text{ cm²}'
          ],
          points: 2,
          difficulty: 'medium',
          category: 'Geometria'
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
          question: 'Oblicz wartość wyrażenia dla x = 2:',
          formula: 'x^2 + 3x - 1',
          options: ['A) 7', 'B) 8', 'C) 9', 'D) 10'],
          answer: 'C) 9',
          solution: [
            'Podstawiamy x = 2: (2)^2 + 3 \\cdot 2 - 1',
            'Obliczamy: 4 + 6 - 1 = 9'
          ],
          points: 1,
          difficulty: 'easy',
          category: 'Wyrażenia algebraiczne'
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
          difficulty: 'easy',
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
          difficulty: 'easy',
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
          difficulty: 'easy',
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
          difficulty: 'easy',
          category: 'Informacja'
        }
      ]
    }
  }
};