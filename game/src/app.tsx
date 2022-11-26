import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as faRegular from '@fortawesome/free-regular-svg-icons'
import * as faSolid from '@fortawesome/free-solid-svg-icons'
import { GameLanguage } from './game-screen/game-instance';
import GameSession from './game-screen/game-session';
import './app.scss';

const App = () => {
  const [darkMode, setDarkMode] = useState<boolean>(
    () => {
      // TODO: consult local storage for state from previous page
  
      // Ask browser, whether it wants to use dark mode
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  );

  const [gameLanguage, setGameLanguage] = useState<GameLanguage>(GameLanguage.DK)

  return (
      <div className={`App ${darkMode ? "DarkMode" : ""}`}>
        <GameSession gameLanguage={gameLanguage} />

        <button className="ToggleDarkMode" onClick={() => setDarkMode(!darkMode)}>
          <FontAwesomeIcon icon={darkMode ? faSolid.faMoon : faRegular.faMoon} />
        </button>
      </div>
  );
}

export default App;
