import React, { useEffect, useState } from 'react';
import { GameIndex, GameInstance, GameLanguage } from './game-instance';
import Game from './game-screen/game';

const JSONHeader = { headers : {  'Content-Type': 'application/json', 'Accept': 'application/json' } };

const App = () => {
  const language: GameLanguage = GameLanguage.GB;
  const gameIdx: number = 0;

  const [GameInstance, setGameInstance] = useState<GameInstance | undefined>(undefined);

  const getGame = () => {
    fetch(`dict/${language}/index.json`, JSONHeader)
    .then((resp) => resp.json())
    .then((data) => (data as GameIndex).instances)
    .then((games) => Math.floor(Math.random() * games))
    .then((gameIdx) => fetch(`dict/${language}/${gameIdx}.json`, JSONHeader))
    .then((resp) => resp.json())
    .then((data) => setGameInstance(data as GameInstance));
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
