import React from 'react';
import './app.css';
import InputBox from './input/input-box';
import { getGame, GameInstance } from './game-instance';
import Game from './game';

const App = () => {
  const gi: GameInstance = getGame();

  return (
    <div className="App">
      <Game instance={gi} />
    </div>
  );
}

export default App;
