import { Difficulty } from '../difficulty';
import { Localization } from './localization';

const dansk: Localization = {
  language: 'Dansk',
  round: 'Runde',
  'end:success': <>Tillykke! Du er kvalificeret til den næste runde.</>,
  'end:failed': (
    <>
      Desværre! Find et ord, der bruger alle bogstaver, for at kvalificere til
      den næste runde.
    </>
  ),
  'end:continue': (
    <>
      <b>Klik her</b> eller <b>tryk enter</b> for at fortsætte.
    </>
  ),
  [Difficulty.TIMED]: 'Uendelig Tid',
  [Difficulty.TIME_SPRINT]: 'Tid',
  [Difficulty.UNLIMITED_TIME]: 'Tidsspurt',
};

export default dansk;
