import { Difficulty } from '../difficulty';
import { Localization } from './localization';

const english: Localization = {
  language: 'English',
  round: 'Round',
  'end:success': <>Congratulations! You qualify for the next round.</>,
  'end:failed': (
    <>Sorry! Find a word that uses all letters to qualify for the next round.</>
  ),
  'end:continue': (
    <>
      <b>Click here</b> or <b>press enter</b> to continue.
    </>
  ),
  [Difficulty.TIMED]: 'Unlimited Time',
  [Difficulty.TIME_SPRINT]: 'Timed',
  [Difficulty.UNLIMITED_TIME]: 'Time Sprint',
};

export default english;
