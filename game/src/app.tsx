import React, { useEffect, useState } from 'react';
import { GameIndex, GameInstance, GameLanguage } from './game-instance';
import Game from './game-screen/game';

const JSONHeader = { headers : {  'Content-Type': 'application/json', 'Accept': 'application/json' } };

const App = () => {
  const language: GameLanguage = GameLanguage.DK;
  const gameIdx: number = 0;

  const [GameInstance, setGameInstance] = useState<GameInstance | undefined>(undefined);

  const getGame = () => {
    // Fetch from the index file for the desired language
    fetch(`dict/${language}/index.json`, JSONHeader)
    // Convert response as a GameIndex object
    .then((resp: Response)     => resp.json())
    // Randomly choose an index
    .then((data: GameIndex)    => Math.round(Math.random() * (data.instances-1)))
    // Fetch specific game based on language and index
    .then((gameIdx: number)    => fetch(`dict/${language}/${gameIdx}.json`, JSONHeader))
    // Convert response to GameInstance object
    .then((resp: Response)     => resp.json())
    // Set gameInstance
    .then((data: GameInstance) => setGameInstance(data));
  }

  useEffect(getGame, []);

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
