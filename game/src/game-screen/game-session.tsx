import React, { useEffect, useState } from 'react';
import { GameIndex, GameInstance, GameLanguage } from './game-instance';
import Game, { GameReport } from './game';

const JSONHeader = { headers : {  'Content-Type': 'application/json', 'Accept': 'application/json' } };

const GameSession = () => {
  const gameLanguage: GameLanguage = GameLanguage.DK;

  const [accScore, setAccScore] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [gameInstance, setGameInstance] = useState<GameInstance | undefined>(undefined);

  const getGame = () => {
    // Fetch from the index file for the desired language
    fetch(`dict/${gameLanguage}/index.json`, JSONHeader)
    // Convert response as a GameIndex object
    .then((resp: Response)     => resp.json())
    // Randomly choose an index
    .then((data: GameIndex)    => Math.round(Math.random() * (data.instances-1)))
    // Fetch specific game based on language and index
    .then((gameIdx: number)    => fetch(`dict/${gameLanguage}/${gameIdx}.json`, JSONHeader))
    // Convert response to GameInstance object
    .then((resp: Response)     => resp.json())
    // Set gameInstance
    .then((data: GameInstance) => setGameInstance(data));
  }

  useEffect(getGame, [gameLanguage]);

  const getNextGame = (previousGame: GameReport) => {
    setGameInstance(undefined);
    setRound(previousGame.qualified ? round+1 : 1);
    setAccScore(previousGame.qualified ? accScore + previousGame.score : 0);
    getGame();
  }

  return (
      <>
      { gameInstance &&
        <div className="GameSession fullscreen">
          <Game instance={gameInstance}
                language={gameLanguage}
                accScore={accScore}
                round={round}
                onRequestNextGame={getNextGame} />
        </div>
      }
      </>
  );
}

export default GameSession;
