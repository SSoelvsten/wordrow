import React, { useState } from 'react';
import { GameInstance } from './game-instance';
import InputBox from './input-box';

export interface GameProps {
    instance: GameInstance,
}

type CharIdx = [string, number | null];

const shuffle = (chars: CharIdx[]) => {
    return chars.map(c => c).sort(() => Math.random() - 0.5);
}

const Game = ({ instance: { anagrams } }: GameProps) => {
    const words: number = anagrams.length;
    const [chars, setChars] = useState<CharIdx[]>(
        () => shuffle(anagrams[words-1].split('').map((c) => [c, null]))
    );
    const [guessed, setGuessed] = useState<boolean[]>(
        () => Array(words).fill(false)
    );

    const word_length: number = chars.length;
    var selected_length: number = word_length;
    const selected: (string | null)[] = chars
        // Create a copy of the array
        .map(c => c)
        // Sort by character, leaving 'null' at the end
        .sort(([_ca,ia], [_cb,ib]) => {
            return ia === null && ib === null ? 0
                 : ia === null ? 1
                 : ib === null ? -1
                 : ia - ib})
        // Display character, if selected
        .map(([c,i]) => {
            if (i === null) {
                selected_length--;
                return null;
            }
            return c;
        });
    ;

    const onKey = (e: React.KeyboardEvent) => {
        switch (e.key) {
        case " ": // Shuffle on 'Spacebar'
            setChars(shuffle(chars)); // <-- TODO: different shuffle?
            break;

        case "Backspace": // Remove latest symbol
            setChars(chars.map(([c,i]) => i === selected_length-1 ? [c,null] : [c,i]));
            break;

        case "Enter": // Check if guess exists and clear input
            const guess: string = selected.map(c => c === null ? "" : c).reduce((acc,c) => acc+c);
            if (anagrams.includes(guess)) {
                setGuessed(guessed.map((v,idx) => v || anagrams[idx] === guess));
            }
            setChars(chars.map(([c,i]) => [c,null]));

            break;

        default: // Move character, if it exists
            if (chars.filter(([c,i]) => i === null).map(([c,i]) => c).includes(e.key)) {
                var hasSelected: boolean = false;
                setChars(chars.map(([c,i]) => {
                    if (!hasSelected && i === null && c === e.key) {
                        hasSelected = true;
                        return [c,selected_length];
                    } else {
                        return [c,i];
                    }
                }));
            }

            break;
        }
    }

    return (
        <div id='input-boxes' tabIndex={0} onKeyDown={onKey}>
            <p>{anagrams.map((a,idx) => guessed[idx] ? a : "?")}</p>

            {selected.map((c,idx) => (<InputBox content={c || " "} key={idx} />))}

            {chars.map(([c,i],idx) => (<InputBox content={i === null ? c : "_"} key={idx} />))}
        </div>
    );
}

export default Game;
