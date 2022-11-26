import React, { useState } from 'react';
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
      </div>
  );
}

export default App;
