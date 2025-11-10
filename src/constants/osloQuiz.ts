/**
 * Oslo Quiz Data
 * Fun facts og quiz-spørsmål om Oslo
 */

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct answer
  explanation: string;
  category: 'historie' | 'geografi' | 'kultur' | 'arkitektur' | 'natur';
}

export const OSLO_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'shortest-street',
    question: 'Hva er Oslos korteste gate?',
    options: [
      'Kirkegata',
      'Skjærslibakken',
      'Karl Johans gate',
      'Akersgata'
    ],
    correctAnswer: 1,
    explanation: 'Skjærslibakken i Gamlebyen er Oslos korteste gate, med bare 5,2 meter!',
    category: 'geografi'
  },
  {
    id: 'founding-year',
    question: 'I hvilket år ble Oslo grunnlagt?',
    options: [
      '1048',
      '1000',
      '1100',
      '1200'
    ],
    correctAnswer: 0,
    explanation: 'Oslo ble grunnlagt rundt år 1048 av Harald Hardråde.',
    category: 'historie'
  },
  {
    id: 'oldest-building',
    question: 'Hva er Oslos eldste bygning?',
    options: [
      'Akershus festning',
      'Oslo domkirke',
      'Gamle Aker kirke',
      'Slottet'
    ],
    correctAnswer: 2,
    explanation: 'Gamle Aker kirke er Oslos eldste bygning, bygget rundt år 1100.',
    category: 'historie'
  },
  {
    id: 'highest-point',
    question: 'Hva er Oslos høyeste punkt?',
    options: [
      'Grefsenkollen',
      'Kolsåstoppen',
      'Holmenkollen',
      'Kjerkeberget'
    ],
    correctAnswer: 3,
    explanation: 'Kjerkeberget i Nordmarka er Oslos høyeste punkt på 629 meter over havet.',
    category: 'geografi'
  },
  {
    id: 'population',
    question: 'Hvor mange innbyggere har Oslo (ca.)?',
    options: [
      '600 000',
      '700 000',
      '800 000',
      '900 000'
    ],
    correctAnswer: 1,
    explanation: 'Oslo har rundt 700 000 innbyggere (2024).',
    category: 'geografi'
  },
  {
    id: 'munch-museum',
    question: 'Hvor mange versjoner av "Skrik" malte Edvard Munch?',
    options: [
      '2',
      '3',
      '4',
      '5'
    ],
    correctAnswer: 2,
    explanation: 'Edvard Munch malte 4 versjoner av "Skrik" mellom 1893 og 1910.',
    category: 'kultur'
  },
  {
    id: 'operahouse-year',
    question: 'I hvilket år ble Operahuset i Oslo åpnet?',
    options: [
      '2006',
      '2008',
      '2010',
      '2012'
    ],
    correctAnswer: 1,
    explanation: 'Operahuset i Oslo ble åpnet i 2008 og er designet av Snøhetta.',
    category: 'arkitektur'
  },
  {
    id: 'islands',
    question: 'Hvor mange øyer ligger i Oslofjorden?',
    options: [
      'Over 100',
      'Over 200',
      'Over 300',
      'Over 400'
    ],
    correctAnswer: 2,
    explanation: 'Det er over 300 øyer i Oslofjorden, hvorav mange er populære utfartsmål.',
    category: 'geografi'
  },
  {
    id: 'old-name',
    question: 'Hva het Oslo før det fikk navnet Oslo i 1925?',
    options: [
      'Kristiania',
      'Christiania',
      'Begge deler',
      'Det het alltid Oslo'
    ],
    correctAnswer: 2,
    explanation: 'Oslo het først Christiania (1624-1877), deretter Kristiania (1877-1925), før det fikk tilbake navnet Oslo.',
    category: 'historie'
  },
  {
    id: 'royal-palace',
    question: 'Hvor mange rom har Slottet i Oslo?',
    options: [
      '173',
      '200',
      '250',
      '300'
    ],
    correctAnswer: 0,
    explanation: 'Slottet har 173 rom og ble bygget mellom 1824 og 1849.',
    category: 'arkitektur'
  }
];

export const getRandomQuestion = (): QuizQuestion => {
  const randomIndex = Math.floor(Math.random() * OSLO_QUIZ_QUESTIONS.length);
  return OSLO_QUIZ_QUESTIONS[randomIndex];
};

export const getQuestionsByCategory = (category: QuizQuestion['category']): QuizQuestion[] => {
  return OSLO_QUIZ_QUESTIONS.filter(q => q.category === category);
};

