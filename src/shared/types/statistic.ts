import { GameKeys } from './reqrespone';
import { SprintWord } from './words';

interface GameStat {
  game: GameKeys;
  words: SprintWord[];
  succession: number;
}

interface StatData {
  t?: number;
  s?: number[];
  a?: number[];
}

interface StatOptional {
  [key: string]: StatData;
}

interface Statistic {
  learnedWords: number;
  optional: StatOptional;
}

export {
  GameStat, Statistic, StatData, StatOptional,
};
