import { ReactNode } from 'react';
import { Difficulty } from '../difficulty';

export interface Localization {
  language: string;
  round: string;
  'end:success': ReactNode;
  'end:failed': ReactNode;
  'end:continue': ReactNode;
  [Difficulty.TIMED]: string;
  [Difficulty.TIME_SPRINT]: string;
  [Difficulty.UNLIMITED_TIME]: string;
}
