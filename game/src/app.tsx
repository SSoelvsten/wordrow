import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as faRegular from '@fortawesome/free-regular-svg-icons'
import * as faSolid from '@fortawesome/free-solid-svg-icons'
import { Language } from './language';
import GameSession from './game-screen/game-session';
import './app.scss';
import Menu from './menu/menu';

const LS_KEYS = {
  DarkMode: "DarkMode",
  Language: "Language",
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

  const [language, setLanguage] = useState<Language | undefined>(
    () => {
      // Consult local storage for state from previous page
      const ls_res = localStorage.getItem(LS_KEYS.Language);
      if (ls_res) { return ls_res as Language; }

      // Otherwise, just leave it unchecked
      return undefined;
    }
  );

  const [inGame, setInGame] = useState<boolean>(() => {
    return language !== undefined;
  });

  // ------------------------------------------------------------------------
  // SAVE USER SETTINGS
  const updateLocalStorage = () => {
    localStorage.setItem(LS_KEYS.DarkMode, `${darkMode}`);
    if (language !== undefined) {
      localStorage.setItem(LS_KEYS.Language, language);
    }
  }

  useEffect(updateLocalStorage, [darkMode, language]);

  // ------------------------------------------------------------------------
  // VISUAL
  return (
      <div className={`App ${darkMode ? "DarkMode" : ""}`}>
        { !inGame &&
          <Menu language={language} setLanguage={setLanguage} startGame={() => setInGame(true)} />
        }
        { inGame && language &&
          <>
            <GameSession language={language} />
            <button className="ReturnToMenu" onClick={() => setInGame(false)}>
              <FontAwesomeIcon icon={darkMode ? faSolid.faCaretLeft : faSolid.faCaretLeft} />
            </button>
          </>
        }

        <button className="ToggleDarkMode" onClick={() => setDarkMode(!darkMode)}>
          <FontAwesomeIcon icon={darkMode ? faSolid.faMoon : faRegular.faMoon} />
        </button>
      </div>
  );
}

export default App;
