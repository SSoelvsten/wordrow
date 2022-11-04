import React, { useState } from 'react';
import { GameInstance } from './game-instance';
import InputBox from './input-box';

export interface GameProps {
    instance: GameInstance,
}

const shuffle = (chars: string[]) => {
    return chars.sort(() => Math.random() - 0.5);
}

const Game = ({ instance: { anagrams } }: GameProps) => {
    const words: number = anagrams.length;
    const [chars, setChars] = useState(shuffle(anagrams[words-1].split('')));

    const word_length: number = chars.length;

    return (
        <>
            {chars.map((c) => (<InputBox content={c} />))}

            {JSON.stringify(anagrams)}
        </>
    );
}

export default Game;
