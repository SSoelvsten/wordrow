import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as faRegular from '@fortawesome/free-regular-svg-icons'
import * as faSolid from '@fortawesome/free-solid-svg-icons'
import { Language } from './language';
import { Difficulty } from './difficulty';
import GameSession from './game-screen/game-session';
import './app.scss';
import Menu from './menu/menu';

const LS_KEYS = {
  DarkMode: "DarkMode",
  Difficulty: "Difficulty",
  Language: "Language",
  HasPlayed: "HasPlayed",
}

const App = () => {
  // ------------------------------------------------------------------------
  // USER SETTINGS
  const [darkMode, setDarkMode] = useState<boolean>(
    () => {
      // Consult local storage for state from previous page
      const ls_res = localStorage.getItem(LS_KEYS.DarkMode);
      if (ls_res) { return ls_res === "true"; }

      // Ask browser, whether it wants to use dark mode
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  );

  const [language, setLanguage] = useState<Language>(
    () => {
      // Consult local storage for state from previous page
      const ls_res = localStorage.getItem(LS_KEYS.Language);
      if (ls_res) { return ls_res as Language; }

      // Otherwise, just leave it unchecked
      return Language.EN;
    }
  );

  const [difficulty, setDifficulty] = useState<Difficulty>(
    () => {
      // Consult local storage for state from previous page
      const ls_res = localStorage.getItem(LS_KEYS.Difficulty);
      if (ls_res) { return ls_res as Difficulty; }

      // Otherwise, just leave it unchecked
      return Difficulty.UNLIMITED_TIME;
    }
  );

  const [inGame, setInGame] = useState<boolean>(() => {
    // Go directly into a game, if settings have already been set
    const ls_res = localStorage.getItem(LS_KEYS.HasPlayed);
    return ls_res !== null;
  });

  // ------------------------------------------------------------------------
  // SAVE USER SETTINGS
  const updateLocalStorage = () => {
    localStorage.setItem(LS_KEYS.DarkMode, `${darkMode}`);
    if (language !== undefined) {
      localStorage.setItem(LS_KEYS.Language, language);
    }
    if (difficulty !== undefined) {
      localStorage.setItem(LS_KEYS.Difficulty, difficulty);
    }
  }

  useEffect(updateLocalStorage, [darkMode, language, difficulty]);

  useEffect(() => {
    if (inGame) { localStorage.setItem(LS_KEYS.HasPlayed, "true"); }
  }, [inGame]);

  // ------------------------------------------------------------------------
  // VISUAL
  return (
    <div className={`App ${darkMode ? "DarkMode" : ""}`}>
      {!inGame &&
        <Menu language={language} setLanguage={setLanguage}
          difficulty={difficulty} setDifficulty={setDifficulty}
          startGame={() => setInGame(true)} />
      }
      {inGame && language && difficulty &&
        <GameSession difficulty={difficulty} language={language} />
      }
      <div className="TopButtons Left">
        <button className="Button" onClick={() => setInGame(false)} disabled={!inGame}>
          <FontAwesomeIcon icon={darkMode ? faSolid.faCaretLeft : faSolid.faCaretLeft} />
        </button>
        <button className="Button" onClick={() => setDarkMode(!darkMode)}>
          <FontAwesomeIcon icon={darkMode ? faSolid.faMoon : faRegular.faMoon} />
        </button>
      </div>
    </div>
  );
}

export default App;
