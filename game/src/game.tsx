import React from 'react';
import { GameInstance } from './game-instance';
import InputBox from './input-box';

export interface GameProps {
    instance: GameInstance,
}

const Game = ({ instance: { anagrams } }: GameProps) => {
    const words: number = anagrams.length;

    var chars: string[] = anagrams[words-1].split('');

    // TODO: shuffle until hamming distance is large enough
    chars.sort(() => Math.random() - 0.5);

    const word_length: number = chars.length;

    return (
        <div>
            {chars.map((c) => (<InputBox content={c} />))}

            {JSON.stringify(anagrams)}
        </div>
    );
}

export default Game;
