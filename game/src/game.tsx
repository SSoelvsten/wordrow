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
    const [chars, setChars] = useState<string[]>(shuffle(anagrams[words-1].split('')));
    const [selected, setSelected] = useState<number[]>([1,4]);

    const word_length: number = chars.length;

    return (
        <div id='input-boxes'>
            {selected.map((i,idx) => (<InputBox content={i + chars[i]} />))}

            {chars.map((c,idx) => (<InputBox content={c} />))}
        </div>
    );
}

export default Game;
