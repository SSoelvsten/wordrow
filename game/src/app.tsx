import React, { useEffect, useState } from 'react';
import { GameIndex, GameInstance, GameLanguage } from './game-instance';
import Game from './game-screen/game';

const JSONHeader = { headers : {  'Content-Type': 'application/json', 'Accept': 'application/json' } };

const App = () => {
  const language: GameLanguage = GameLanguage.GB;
  const gameIdx: number = 0;

  const [GameInstance, setGameInstance] = useState<GameInstance | undefined>(undefined);

  const getGame = () => {
    // Fetch from the index file for the desired language
    fetch(`dict/${language}/index.json`, JSONHeader)
    // Convert response as a GameIndex object
    .then((resp) => resp.json()).then((data) => (data as GameIndex).instances)
    // Randomly choose an index
    .then((games) => Math.round(Math.random() * (games-1)))
    // Fetch specific game based on language and index
    .then((gameIdx) => fetch(`dict/${language}/${gameIdx}.json`, JSONHeader))
    // Convert response to GameInstance object
    .then((resp) => resp.json()).then((data) => setGameInstance(data as GameInstance));
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
