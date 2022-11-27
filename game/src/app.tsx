import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as faRegular from '@fortawesome/free-regular-svg-icons'
import * as faSolid from '@fortawesome/free-solid-svg-icons'
import { GameLanguage } from './game-screen/game-instance';
import GameSession from './game-screen/game-session';
import './app.scss';
import Menu from './menu/menu';

const LS_KEYS = {
  DarkMode: "DarkMode"
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

  const [gameLanguage, setGameLanguage] = useState<GameLanguage | undefined>(undefined);

  const [inGame, setInGame] = useState<boolean>(() => {
    return gameLanguage !== undefined;
  });

  // ------------------------------------------------------------------------
  // SAVE USER SETTINGS
  const updateLocalStorage = () => {
    localStorage.setItem(LS_KEYS.DarkMode, `${darkMode}`);
  }

  useEffect(updateLocalStorage, [darkMode]);

  // ------------------------------------------------------------------------
  // VISUAL
  return (
      <div className={`App ${darkMode ? "DarkMode" : ""}`}>
        { !inGame &&
          <Menu language={gameLanguage} setLanguage={setGameLanguage} startGame={() => setInGame(true)} />
        }
        { inGame && gameLanguage &&
          <>
            <GameSession gameLanguage={gameLanguage} />
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
