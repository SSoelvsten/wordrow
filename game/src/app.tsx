import React, { useState } from 'react';
import { GameInstance, GameLanguage } from './game-instance';
import Game from './game-screen/game';

const App = () => {
  const language: GameLanguage = GameLanguage.GB;
  const gameIdx: number = 0;

  const [GameInstance, setGameInstance] = useState<GameInstance | undefined>(undefined);

  fetch(`dict/${language}/${gameIdx}.json`,
        { headers : {  'Content-Type': 'application/json', 'Accept': 'application/json' } })
    .then((resp) => resp.json())
    .then((data) => setGameInstance(data as GameInstance));

  return (
      <>
      { GameInstance &&
        <div className="App fullscreen">
          <Game instance={GameInstance} />
        </div>
      }
      </>
  );
}

export default App;
