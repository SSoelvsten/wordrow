import { Difficulty } from '../difficulty';
import { Localization } from './localization';

const deutsch: Localization = {
  language: 'Deutsch',
  round: 'Runde',
  'end:success': (
    <>Glückwunsch! Sie haben sich für die nächste Runde qualifiziert.</>
  ),
  'end:failed': (
    <>
      Schade! Um dich für die nächste Runde zu qualifizieren, finden sie ein
      Wort, das alle Buchstaben verwendet.
    </>
  ),
  'end:continue': (
    <>
      <b> Klicken sie hier </b> oder <b> drücken sie die Eingabeteste, </b> um
      fortzufahren.
    </>
  ),
  [Difficulty.TIMED]: 'Unbeschränkte Zeit',
  [Difficulty.TIME_SPRINT]: 'Zeit',
  [Difficulty.UNLIMITED_TIME]: 'Zeit-Sprint',
};

export default deutsch;
