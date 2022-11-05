import React from 'react';
import { getGame, GameInstance } from './game-instance';
import Game from './game-screen/game';

const App = () => {
  const gi: GameInstance = getGame();

  return (
    <div className="App fullscreen">
      <Game instance={gi} />
    </div>
  );
}

export default App;
