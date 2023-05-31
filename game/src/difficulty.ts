import { ReactNode } from 'react';
import localize from './localize';
import { Language } from './localize/language';

export enum Difficulty {
  UNLIMITED_TIME = 'UNLIMITED',
  TIMED = 'TIMED',
  TIME_SPRINT = 'TIME SPRINT',
}

export const Difficulties: Difficulty[] = [
  Difficulty.UNLIMITED_TIME,
  Difficulty.TIMED,
  Difficulty.TIME_SPRINT,
];

export interface DifficultyLogic {
  initialTime: number;
  addTime: (wordLength: number) => number;
}

export const GetDifficultyLogic = (
  difficulty: Difficulty,
  numberOfChars: number
): DifficultyLogic => {
  const minimumTime = 2 * 60 * 1000; // 2 minutes
  const totalTime = Math.max(minimumTime, numberOfChars * 1000);

  switch (difficulty) {
    case Difficulty.UNLIMITED_TIME:
      return {
        initialTime: Infinity,
        addTime: () => 0,
      };
    case Difficulty.TIMED:
      return {
        initialTime: totalTime,
        addTime: () => 0,
      };
    case Difficulty.TIME_SPRINT:
      const initialTime = Math.max(30 * 1000 /* 30s */, totalTime / 7);
      const timePerChar = (totalTime - initialTime) / numberOfChars;

      return {
        initialTime: initialTime,
        addTime: (wordLength: number) => wordLength * timePerChar,
      };
  }
};

export const difficultyName = (
  difficulty: Difficulty,
  language: Language | undefined
): ReactNode => {
  return localize(language || Language.EN, difficulty);
};
