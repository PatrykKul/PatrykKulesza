// Przykładowe dane do testowania nowej implementacji LaTeX
export const sampleExamData = {
  title: "Test LaTeX - Egzamin Przykładowy",
  date: "2024-10-01", 
  duration: 60,
  maxPoints: 50,
  problems: [
    {
      id: "1",
      question: "Oblicz wartość wyrażenia $\\frac{x^2 + 2x + 1}{x + 1}$ dla $x = 3$.",
      answer: "4",
      points: 5,
      category: "Algebra",
      solution: [
        "Rozkładamy licznik na czynniki | $x^2 + 2x + 1 = (x+1)^2$",
        "Upraszczamy ułamek | $\\frac{(x+1)^2}{x+1} = x+1$", 
        "Podstawiamy $x = 3$ | $3 + 1 = 4$"
      ]
    },
    {
      id: "2", 
      question: "Rozwiąż równanie $2x^2 - 8x + 6 = 0$.",
      answer: "$x_1 = 1, x_2 = 3$",
      points: 8,
      category: "Równania kwadratowe",
      formula: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
      solution: [
        "Identyfikujemy współczynniki | $a = 2, b = -8, c = 6$",
        "Obliczamy dyskryminantę | $\\Delta = (-8)^2 - 4 \\cdot 2 \\cdot 6 = 64 - 48 = 16$",
        "Pierwiastek z dyskryminanty | $\\sqrt{\\Delta} = \\sqrt{16} = 4$",
        "Rozwiązania | $x_1 = \\frac{8-4}{4} = 1, x_2 = \\frac{8+4}{4} = 3$"
      ]
    },
    {
      id: "3",
      question: "Które z poniższych równań są prawdziwe?",
      options: [
        "A) $\\sin^2(x) + \\cos^2(x) = 1$",
        "B) $\\tan(x) = \\frac{\\sin(x)}{\\cos(x)}$", 
        "C) $\\log_a(xy) = \\log_a(x) + \\log_a(y)$",
        "D) $e^{\\ln(x)} = x$"
      ],
      answer: "ABCD",
      points: 10,
      category: "Funkcje",
      solution: [
        "A) Podstawowa tożsamość trygonometryczna - prawda",
        "B) Definicja tangensa - prawda", 
        "C) Właściwość logarytmów - prawda",
        "D) Funkcje odwrotne - prawda"
      ]
    }
  ]
};