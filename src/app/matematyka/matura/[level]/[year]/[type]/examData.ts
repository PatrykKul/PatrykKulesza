// examData.ts - Dane wszystkich egzaminów maturalnych z matematyki (podstawowa i rozszerzona)

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

export const examData: Record<string, Record<string, Record<string, ExamData>>> = {
  'podstawowa': {
    '2025': {
      'glowna': {
        title: 'Matura 2025 - Matematyka Podstawowa',
        date: '6 maja 2025',
        duration: 170,
        maxPoints: 50,
        pdfUrl: '/pdfs/matura-2025-podstawowa.pdf',
        answerKeyUrl: '/pdfs/matura-2025-podstawowa-odpowiedzi.pdf',
        problems: [
          {
            id: '1',
            question: 'Zadanie będzie dostępne po egzaminie maturalnym w maju 2025.',
            answer: 'Wkrótce dostępne',
            solution: [],
            points: 1,
            difficulty: 'easy',
            category: 'Informacja'
          }
        ]
      },
      'poprawkowa': {
        title: 'Matura 2025 - Matematyka Podstawowa (Sesja Poprawkowa)',
        date: 'Sierpień 2025',
        duration: 170,
        maxPoints: 50,
        problems: [
          {
            id: '1',
            question: 'Zadanie z sesji poprawkowej będzie dostępne po egzaminie w sierpniu 2025.',
            answer: 'Wkrótce dostępne',
            solution: [],
            points: 1,
            difficulty: 'easy',
            category: 'Informacja'
          }
        ]
      },
      'probna': {
        title: 'Matura 2025 - Matematyka Podstawowa (Sesja Próbna)',
        date: 'Grudzień 2024',
        duration: 170,
        maxPoints: 50,
        problems: [
          {
            id: '1',
            question: 'Zadanie próbne będzie dostępne po egzaminie próbnym.',
            answer: 'Wkrótce dostępne',
            solution: [],
            points: 1,
            difficulty: 'easy',
            category: 'Informacja'
          }
        ]
      }
    },
    '2024': {
      'glowna': {
        title: 'Matura 2024 - Matematyka Podstawowa',
        date: '7 maja 2024',
        duration: 170,
        maxPoints: 50,
        pdfUrl: '/pdfs/matura-2024-podstawowa.pdf',
        answerKeyUrl: '/pdfs/matura-2024-podstawowa-odpowiedzi.pdf',
        problems: [
          {
            id: '1',
            question: 'Oblicz wartość wyrażenia:',
            formula: '$\\frac{2^3 \\cdot 3^2}{2 \\cdot 3}$',
            options: ['A) 6', 'B) 12', 'C) 18', 'D) 36'],
            answer: 'B) 12',
            solution: [
              '$\\frac{2^3 \\cdot 3^2}{2 \\cdot 3} = \\frac{8 \\cdot 9}{6}$',
              '= $\\frac{72}{6} = 12$'
            ],
            points: 1,
            difficulty: 'easy',
            category: 'Potęgi i pierwiastki'
          },
          {
            id: '2',
            question: 'Rozwiąż równanie:',
            formula: '2x - 5 = 3x + 1',
            options: ['A) x = -6', 'B) x = -3', 'C) x = 3', 'D) x = 6'],
            answer: 'A) x = -6',
            solution: [
              '2x - 5 = 3x + 1',
              '2x - 3x = 1 + 5',
              '-x = 6',
              'x = -6'
            ],
            points: 1,
            difficulty: 'easy',
            category: 'Równania liniowe'
          },
          {
            id: '3',
            question: 'Funkcja liniowa f(x) = ax + b przechodzi przez punkty A(1, 3) i B(3, 7). Wyznacz wzór tej funkcji.',
            answer: 'f(x) = 2x + 1',
            solution: [
              '$a = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{7 - 3}{3 - 1} = \\frac{4}{2} = 2$',
              'f(x) = 2x + b',
              '$3 = 2 \\cdot 1 + b \\Rightarrow b = 1$',
              'f(x) = 2x + 1'
            ],
            points: 2,
            difficulty: 'medium',
            category: 'Funkcje liniowe'
          }
        ]
      },
      'poprawkowa': {
        title: 'Matura 2024 - Matematyka Podstawowa (Sesja Poprawkowa)',
        date: 'Sierpień 2024',
        duration: 170,
        maxPoints: 50,
        problems: [
          {
            id: '1',
            question: 'Oblicz wartość wyrażenia dla x = 2:',
            formula: 'x^2 + 3x - 2',
            options: ['A) 6', 'B) 8', 'C) 10', 'D) 12'],
            answer: 'B) 8',
            solution: [
              'x^2 + 3x - 2 = (2)^2 + 3 \\cdot 2 - 2',
              '= 4 + 6 - 2 = 8'
            ],
            points: 1,
            difficulty: 'easy',
            category: 'Wyrażenia algebraiczne'
          }
        ]
      },
      'probna': {
        title: 'Matura 2024 - Matematyka Podstawowa (Sesja Próbna)',
        date: 'Grudzień 2023',
        duration: 170,
        maxPoints: 50,
        problems: [
          {
            id: '1',
            question: 'Oblicz wartość wyrażenia:',
            formula: '\\sqrt{25} + 2^3',
            options: ['A) 13', 'B) 14', 'C) 15', 'D) 16'],
            answer: 'A) 13',
            solution: [
              '\\sqrt{25} + 2^3 = 5 + 8 = 13'
            ],
            points: 1,
            difficulty: 'easy',
            category: 'Pierwiastki i potęgi'
          }
        ]
      }
    },
    '2023': {
      'glowna': {
        title: 'Matura 2023 - Matematyka Podstawowa',
        date: '4 maja 2023',
        duration: 170,
        maxPoints: 50,
        problems: [
          {
            id: '1',
            question: 'Oblicz wartość wyrażenia:',
            formula: '3^2 + 2 \\cdot 5 - 7',
            options: ['A) 12', 'B) 14', 'C) 16', 'D) 18'],
            answer: 'A) 12',
            solution: [
              '3^2 + 2 \\cdot 5 - 7 = 9 + 10 - 7',
              '= 19 - 7 = 12'
            ],
            points: 1,
            difficulty: 'easy',
            category: 'Działania na liczbach'
          }
        ]
      },
      'poprawkowa': {
        title: 'Matura 2023 - Matematyka Podstawowa (Sesja Poprawkowa)',
        date: 'Sierpień 2023',
        duration: 170,
        maxPoints: 50,
        problems: [
          {
            id: '1',
            question: 'Rozwiąż równanie:',
            formula: '4x - 8 = 2x + 4',
            options: ['A) x = 4', 'B) x = 6', 'C) x = 8', 'D) x = 12'],
            answer: 'B) x = 6',
            solution: [
              '4x - 8 = 2x + 4',
              '4x - 2x = 4 + 8',
              '2x = 12',
              'x = 6'
            ],
            points: 1,
            difficulty: 'easy',
            category: 'Równania liniowe'
          }
        ]
      },
      'probna': {
        title: 'Matura 2023 - Matematyka Podstawowa (Sesja Próbna)',
        date: 'Grudzień 2022',
        duration: 170,
        maxPoints: 50,
        problems: [
          {
            id: '1',
            question: 'Oblicz pole prostokąta o bokach 4 cm i 7 cm.',
            options: ['A) 22 cm²', 'B) 24 cm²', 'C) 28 cm²', 'D) 32 cm²'],
            answer: 'C) 28 cm²',
            solution: [
              'P = a \\cdot b = 4 \\cdot 7 = 28 \\text{ cm²}'
            ],
            points: 1,
            difficulty: 'easy',
            category: 'Geometria'
          }
        ]
      }
    },
    '2022': {
      'glowna': {
        title: 'Matura 2022 - Matematyka Podstawowa',
        date: '5 maja 2022',
        duration: 170,
        maxPoints: 50,
        problems: [
          {
            id: '1',
            question: 'Oblicz wartość wyrażenia:',
            formula: '2^4 - 3 \\cdot 2 + 1',
            options: ['A) 9', 'B) 10', 'C) 11', 'D) 12'],
            answer: 'C) 11',
            solution: [
              '2^4 - 3 \\cdot 2 + 1 = 16 - 6 + 1',
              '= 10 + 1 = 11'
            ],
            points: 1,
            difficulty: 'easy',
            category: 'Potęgi'
          }
        ]
      },
      'poprawkowa': {
        title: 'Matura 2022 - Matematyka Podstawowa (Sesja Poprawkowa)',
        date: 'Sierpień 2022',
        duration: 170,
        maxPoints: 50,
        problems: [
          {
            id: '1',
            question: 'Oblicz pole kwadratu o boku długości 3√2 cm.',
            options: ['A) 9 cm²', 'B) 12 cm²', 'C) 18 cm²', 'D) 36 cm²'],
            answer: 'C) 18 cm²',
            solution: [
              'P = a^2 = (3\\sqrt{2})^2',
              '= 9 \\cdot (\\sqrt{2})^2 = 9 \\cdot 2 = 18 \\text{ cm²}'
            ],
            points: 1,
            difficulty: 'medium',
            category: 'Geometria'
          }
        ]
      },
      'probna': {
        title: 'Matura 2022 - Matematyka Podstawowa (Sesja Próbna)',
        date: 'Grudzień 2021',
        duration: 170,
        maxPoints: 50,
        problems: [
          {
            id: '1',
            question: 'Oblicz wartość wyrażenia:',
            formula: '\\sqrt{16} + 3^2',
            options: ['A) 12', 'B) 13', 'C) 14', 'D) 15'],
            answer: 'B) 13',
            solution: [
              '\\sqrt{16} + 3^2 = 4 + 9 = 13'
            ],
            points: 1,
            difficulty: 'easy',
            category: 'Pierwiastki i potęgi'
          }
        ]
      }
    }
  },
  'rozszerzona': {
    '2025': {
      'glowna': {
        title: 'Matura 2025 - Matematyka Rozszerzona',
        date: '9 maja 2025',
        duration: 180,
        maxPoints: 70,
        pdfUrl: '/pdfs/matura-2025-rozszerzona.pdf',
        answerKeyUrl: '/pdfs/matura-2025-rozszerzona-odpowiedzi.pdf',
        problems: [
          {
            id: '1',
            question: 'Zadanie będzie dostępne po egzaminie maturalnym w maju 2025.',
            answer: 'Wkrótce dostępne',
            solution: [],
            points: 1,
            difficulty: 'easy',
            category: 'Informacja'
          }
        ]
      },
      'poprawkowa': {
        title: 'Matura 2025 - Matematyka Rozszerzona (Sesja Poprawkowa)',
        date: 'Sierpień 2025',
        duration: 180,
        maxPoints: 70,
        problems: [
          {
            id: '1',
            question: 'Zadanie z sesji poprawkowej będzie dostępne po egzaminie w sierpniu 2025.',
            answer: 'Wkrótce dostępne',
            solution: [],
            points: 1,
            difficulty: 'easy',
            category: 'Informacja'
          }
        ]
      },
      'probna': {
        title: 'Matura 2025 - Matematyka Rozszerzona (Sesja Próbna)',
        date: 'Grudzień 2024',
        duration: 180,
        maxPoints: 70,
        problems: [
          {
            id: '1',
            question: 'Zadanie próbne będzie dostępne po egzaminie próbnym.',
            answer: 'Wkrótce dostępne',
            solution: [],
            points: 1,
            difficulty: 'easy',
            category: 'Informacja'
          }
        ]
      }
    },
    '2024': {
      'glowna': {
        title: 'Matura 2024 - Matematyka Rozszerzona',
        date: '10 maja 2024',
        duration: 180,
        maxPoints: 70,
        problems: [
          {
            id: '1',
            question: 'Oblicz granicę:',
            formula: '$\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2}$',
            options: ['A) 2', 'B) 4', 'C) 8', 'D) nie istnieje'],
            answer: 'B) 4',
            solution: [
              '$\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2} = \\lim_{x \\to 2} \\frac{(x-2)(x+2)}{x - 2}$',
              '= $\\lim_{x \\to 2} (x + 2) = 2 + 2 = 4$'
            ],
            points: 2,
            difficulty: 'medium',
            category: 'Granice funkcji'
          },
          {
            id: '2',
            question: 'Znajdź pochodną funkcji:',
            formula: 'f(x) = x^3 - 2x^2 + 3x - 1',
            answer: "f'(x) = 3x² - 4x + 3",
            solution: [
              "f'(x) = (x^3)' - 2(x^2)' + 3(x)' - (1)'",
              "f'(x) = 3x^2 - 2 \\cdot 2x + 3 \\cdot 1 - 0",
              "f'(x) = 3x^2 - 4x + 3"
            ],
            points: 2,
            difficulty: 'medium',
            category: 'Pochodne'
          }
        ]
      },
      'poprawkowa': {
        title: 'Matura 2024 - Matematyka Rozszerzona (Sesja Poprawkowa)',
        date: 'Sierpień 2024',
        duration: 180,
        maxPoints: 70,
        problems: [
          {
            id: '1',
            question: 'Oblicz całkę nieoznaczoną:',
            formula: '$\\int (2x + 3) dx$',
            answer: '$x^2 + 3x + C$',
            solution: [
              '$\\int (2x + 3) dx = \\int 2x dx + \\int 3 dx$',
              '= $2 \\int x dx + 3 \\int dx$',
              '= $2 \\cdot \\frac{x^2}{2} + 3x + C$',
              '= $x^2 + 3x + C$'
            ],
            points: 2,
            difficulty: 'medium',
            category: 'Całki'
          }
        ]
      },
      'probna': {
        title: 'Matura 2024 - Matematyka Rozszerzona (Sesja Próbna)',
        date: 'Grudzień 2023',
        duration: 180,
        maxPoints: 70,
        problems: [
          {
            id: '1',
            question: 'Rozwiąż równanie trygonometryczne:',
            formula: '$\\sin x = \\frac{1}{2}$',
            answer: '$x = \\frac{\\pi}{6} + 2\\pi k$ lub $x = \\frac{5\\pi}{6} + 2\\pi k$, gdzie $k \\in \\mathbb{Z}$',
            solution: [
              '$\\sin x = \\frac{1}{2}$',
              '$x = \\arcsin(\\frac{1}{2}) = \\frac{\\pi}{6}$',
              '$x = \\frac{\\pi}{6} + 2\\pi k$ lub $x = \\pi - \\frac{\\pi}{6} + 2\\pi k$',
              '$x = \\frac{\\pi}{6} + 2\\pi k$ lub $x = \\frac{5\\pi}{6} + 2\\pi k$'
            ],
            points: 3,
            difficulty: 'hard',
            category: 'Trygonometria'
          }
        ]
      }
    },
    '2023': {
      'glowna': {
        title: 'Matura 2023 - Matematyka Rozszerzona',
        date: '8 maja 2023',
        duration: 180,
        maxPoints: 70,
        problems: [
          {
            id: '1',
            question: 'Oblicz wartość wyrażenia:',
            formula: 'log_2 8 + log_3 27',
            options: ['A) 5', 'B) 6', 'C) 7', 'D) 8'],
            answer: 'B) 6',
            solution: [
              'log_2 8 + log_3 27 = log_2 2^3 + log_3 3^3',
              '= 3 \\cdot log_2 2 + 3 \\cdot log_3 3',
              '= 3 \\cdot 1 + 3 \\cdot 1 = 3 + 3 = 6'
            ],
            points: 2,
            difficulty: 'medium',
            category: 'Logarytmy'
          }
        ]
      },
      'poprawkowa': {
        title: 'Matura 2023 - Matematyka Rozszerzona (Sesja Poprawkowa)',
        date: 'Sierpień 2023',
        duration: 180,
        maxPoints: 70,
        problems: [
          {
            id: '1',
            question: 'Znajdź dziedzinę funkcji:',
            formula: 'f(x) = \\sqrt{x - 3}',
            answer: 'x ∈ [3, +∞)',
            solution: [
              'Dla pierwiastka kwadratowego: x - 3 \\geq 0',
              'x \\geq 3',
              'D = [3, +\\infty)'
            ],
            points: 2,
            difficulty: 'easy',
            category: 'Funkcje'
          }
        ]
      },
      'probna': {
        title: 'Matura 2023 - Matematyka Rozszerzona (Sesja Próbna)',
        date: 'Grudzień 2022',
        duration: 180,
        maxPoints: 70,
        problems: [
          {
            id: '1',
            question: 'Oblicz sumę n pierwszych wyrazów ciągu geometrycznego o pierwszym wyrazie a₁ = 2 i ilorazie q = 3.',
            answer: 'Sₙ = (3ⁿ - 1)',
            solution: [
              '$S_n = a_1 \\cdot \\frac{q^n - 1}{q - 1}$',
              '$S_n = 2 \\cdot \\frac{3^n - 1}{3 - 1}$',
              '$S_n = 2 \\cdot \\frac{3^n - 1}{2} = 3^n - 1$'
            ],
            points: 3,
            difficulty: 'hard',
            category: 'Ciągi'
          }
        ]
      }
    },
    '2022': {
      'glowna': {
        title: 'Matura 2022 - Matematyka Rozszerzona',
        date: '6 maja 2022',
        duration: 180,
        maxPoints: 70,
        problems: [
          {
            id: '1',
            question: 'Rozwiąż nierówność:',
            formula: 'x^2 - 5x + 6 < 0',
            answer: 'x ∈ (2, 3)',
            solution: [
              'x^2 - 5x + 6 = 0',
              '\\Delta = 25 - 24 = 1',
              'x_1 = \\frac{5 - 1}{2} = 2, \\quad x_2 = \\frac{5 + 1}{2} = 3',
              'x^2 - 5x + 6 = (x - 2)(x - 3)',
              '(x - 2)(x - 3) < 0 \\Rightarrow x \\in (2, 3)'
            ],
            points: 3,
            difficulty: 'medium',
            category: 'Nierówności kwadratowe'
          }
        ]
      },
      'poprawkowa': {
        title: 'Matura 2022 - Matematyka Rozszerzona (Sesja Poprawkowa)',
        date: 'Sierpień 2022',
        duration: 180,
        maxPoints: 70,
        problems: [
          {
            id: '1',
            question: 'Oblicz pole powierzchni stożka o promieniu podstawy r = 4 i wysokości h = 3.',
            answer: 'P = 36π',
            solution: [
              'l = \\sqrt{r^2 + h^2} = \\sqrt{16 + 9} = \\sqrt{25} = 5',
              'P = \\pi r^2 + \\pi r l',
              'P = \\pi \\cdot 16 + \\pi \\cdot 4 \\cdot 5',
              'P = 16\\pi + 20\\pi = 36\\pi'
            ],
            points: 4,
            difficulty: 'hard',
            category: 'Geometria przestrzenna'
          }
        ]
      },
      'probna': {
        title: 'Matura 2022 - Matematyka Rozszerzona (Sesja Próbna)',
        date: 'Grudzień 2021',
        duration: 180,
        maxPoints: 70,
        problems: [
          {
            id: '1',
            question: 'Oblicz prawdopodobieństwo wyrzucenia sumy 7 w rzucie dwiema kostkami.',
            answer: 'P = 1/6',
            solution: [
              'Możliwe wyniki dające sumę 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1)',
              'Liczba korzystnych wyników: 6',
              'Całkowita liczba wyników: 36',
              'P = \\frac{6}{36} = \\frac{1}{6}'
            ],
            points: 2,
            difficulty: 'medium',
            category: 'Prawdopodobieństwo'
          }
        ]
      }
    }
  }
};