import React, { useEffect, useState } from 'react';

import { Language } from '../language';
import { Difficulty } from '../difficulty';
import { random } from '../random';

import { GameIndex, GameInstance } from './game-instance';
import Game, { GameReport } from './game';
import './game-session.scss';

const JSONHeader = { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } };

export interface GameSessionProps {
  difficulty: Difficulty;
  language: Language;
}

const GameSession = ({ difficulty, language }: GameSessionProps) => {
  const [accScore, setAccScore] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [gameInstance, setGameInstance] = useState<GameInstance | undefined>(undefined);

  const getGame = () => {
    // Fetch from the index file for the desired language
    fetch(`dict/${language}/index.json`, JSONHeader)
      // Convert response as a GameIndex object
      .then((resp: Response) => resp.json())
      // Randomly choose an index
      .then((data: GameIndex) => Math.round(random(0, data.instances - 1)))
      // Fetch specific game based on language and index
      .then((gameIdx: number) => fetch(`dict/${language}/${gameIdx}.json`, JSONHeader))
      // Convert response to GameInstance object
      .then((resp: Response) => resp.json())
      // Set gameInstance
      .then((data: GameInstance) => setGameInstance(data));
  }

  const getNextGame = (previousGame: GameReport) => {
    setGameInstance(undefined);
    setRound(previousGame.qualified ? round + 1 : 1);
    setAccScore(previousGame.qualified ? accScore + previousGame.score : 0);
    getGame();
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(getGame, [/* Run once to get the first game */]);

  return (
    <>
      {gameInstance &&
        <div className="GameSession">
          <Game instance={gameInstance}
            difficulty={difficulty}
            language={language}
            accScore={accScore}
            round={round}
            onRequestNextGame={getNextGame} />
        </div>
      }
    </>
  );
}

export default GameSession;
