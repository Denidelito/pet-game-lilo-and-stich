export interface LevelData {
  theme: string;
  wordsToReachBoss: string[];
  wordsToDefeatBoss: string[];
  bossTexture: string;
}

export const levels: LevelData[] = [
  {
    theme: 'Пляж',
    wordsToReachBoss: ['песок', 'зонтик', 'шезлонг'],
    wordsToDefeatBoss: ['крем', 'загар', 'волна'],
    bossTexture: 'experiment-258',
  },
  {
    theme: 'Еда',
    wordsToReachBoss: ['пицца', 'салат', 'суп'],
    wordsToDefeatBoss: ['сыр', 'фрукты', 'специи'],
    bossTexture: 'experiment-625',
  },
  {
    theme: 'Недовольство',
    wordsToReachBoss: ['Обида', 'Порыв', 'Память'],
    wordsToDefeatBoss: ['Сила', 'Взгляд', 'Скорость '],
    bossTexture: 'experiment-625',
  },
  {
    theme: 'Инженер',
    wordsToReachBoss: ['чертёж', 'проект', 'формула'],
    wordsToDefeatBoss: ['модель', 'система', 'расчет'],
    bossTexture: 'experiment-010',
  },
  {
    theme: 'Море',
    wordsToReachBoss: ['шторм', 'волна', 'корабль'],
    wordsToDefeatBoss: ['медуза', 'якорь', 'дельфин'],
    bossTexture: 'experiment-020',
  },
  {
    theme: 'Небо',
    wordsToReachBoss: ['облако', 'солнце', 'звезда'],
    wordsToDefeatBoss: ['луна', 'туча', 'самолет'],
    bossTexture: 'experiment-007',
  },
];
