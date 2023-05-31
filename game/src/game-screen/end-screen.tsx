import localize from '../localize';
import { Language } from '../localize/language';
import './end-screen.scss';

interface EndScreenProps {
  language: Language;
  qualified: boolean;
  showContinue: boolean;
  score: number;
  onClickContinue: () => void;
}

const EndScreen = ({
  language,
  qualified,
  score,
  showContinue,
  onClickContinue,
}: EndScreenProps) => (
  <div className="EndScreen">
    {localize(language, qualified ? 'end:success' : 'end:failed')}
    <div className="Score">{Math.round(score).toLocaleString()}</div>
    <div
      className={'Continue ' + (showContinue ? 'show' : 'hide')}
      onClick={onClickContinue}
    >
      {localize(language, 'end:continue')}
    </div>
  </div>
);

export default EndScreen;
