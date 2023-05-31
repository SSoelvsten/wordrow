import * as faRegular from '@fortawesome/free-regular-svg-icons';
import * as faSolid from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import './app.scss';
import { Difficulty } from './difficulty';
import GameSession from './game-screen/game-session';
import { Language } from './localize/language';
import Menu from './menu/menu';

const LS_KEYS = {
  DarkMode: 'DarkMode',
  Difficulty: 'Difficulty',
  Language: 'Language',
  HasPlayed: 'HasPlayed',
};

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(getIsDarkMode);
  const [language, setLanguage] = useState(getLanguage);
  const [difficulty, setDifficulty] = useState(getDifficulty);
  const [inGame, setInGame] = useState(getIsInGame);

  const switchColorMode = () => {
    localStorage.setItem(LS_KEYS.DarkMode, `${isDarkMode}`);
    setIsDarkMode((isDarkMode) => !isDarkMode);
  };

  const updateLanguage = (newLanguage: Language) => {
    if (language !== undefined) {
      localStorage.setItem(LS_KEYS.Language, language);
    }
    setLanguage(newLanguage);
  };

  const updateDifficulty = (newDifficulty: Difficulty) => {
    localStorage.setItem(LS_KEYS.Difficulty, difficulty);
    setDifficulty(newDifficulty);
  };

  const updateIsInGame = (isInGame: boolean) => () => {
    if (inGame) {
      localStorage.setItem(LS_KEYS.HasPlayed, 'true');
    }
    setInGame(isInGame);
  };

  return (
    <div className={`App ${isDarkMode ? 'DarkMode' : ''}`}>
      {!inGame && (
        <Menu
          language={language}
          setLanguage={updateLanguage}
          difficulty={difficulty}
          setDifficulty={updateDifficulty}
          startGame={updateIsInGame(true)}
        />
      )}
      {inGame && language && difficulty && (
        <GameSession difficulty={difficulty} language={language} />
      )}
      <div className="TopButtons Left">
        <button
          className="Button"
          onClick={updateIsInGame(false)}
          disabled={!inGame}
        >
          <FontAwesomeIcon
            icon={isDarkMode ? faSolid.faCaretLeft : faSolid.faCaretLeft}
          />
        </button>
        <button className="Button" onClick={switchColorMode}>
          <FontAwesomeIcon
            icon={isDarkMode ? faSolid.faMoon : faRegular.faMoon}
          />
        </button>
      </div>
    </div>
  );
};

const getIsDarkMode = (): boolean => {
  const isDarkMode = localStorage.getItem(LS_KEYS.DarkMode);
  if (isDarkMode) {
    return isDarkMode === 'true';
  }

  // Ask browser, whether it wants to use dark mode
  return (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
};

const getLanguage = (): Language => {
  const language = localStorage.getItem(LS_KEYS.Language);
  if (language) {
    return language as Language;
  }

  return Language.EN;
};

const getDifficulty = (): Difficulty => {
  const difficulty = localStorage.getItem(LS_KEYS.Difficulty);
  if (difficulty) {
    return difficulty as Difficulty;
  }

  return Difficulty.UNLIMITED_TIME;
};

const getIsInGame = (): boolean => {
  const inGame = localStorage.getItem(LS_KEYS.HasPlayed);
  return inGame !== null;
};

export default App;
