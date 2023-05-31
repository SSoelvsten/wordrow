import { ReactNode } from 'react';
import localize from './localize';
import './localize/language';
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
  addTime: (word_length: number) => number;
}

export const GetDifficultyLogic = (
  d: Difficulty,
  numberOfChars: number
): DifficultyLogic => {
  const minimumTime = 2 * 60 * 1000; // 02:00:000
  const totalTime = Math.max(minimumTime, numberOfChars * 1000);

  switch (d) {
    case Difficulty.UNLIMITED_TIME:
      return {
        initialTime: Infinity,
        addTime: (word_length: number) => 0,
      };
    case Difficulty.TIMED:
      return {
        initialTime: totalTime,
        addTime: (word_length: number) => 0,
      };
    case Difficulty.TIME_SPRINT:
      const initialTime = Math.max(30 * 1000 /* 30s */, totalTime / 7);
      const timePerChar = (totalTime - initialTime) / numberOfChars;

      return {
        initialTime: initialTime,
        addTime: (word_length: number) => word_length * timePerChar,
      };
  }
};

export const difficultyName = (
  difficulty: Difficulty,
  language: Language | undefined
): ReactNode => {
  return localize(language || Language.EN, difficulty);
};
