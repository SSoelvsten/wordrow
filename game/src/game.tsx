import React, { useState } from 'react';
import { GameInstance } from './game-instance';
import InputBox from './input-box';

export interface GameProps {
    instance: GameInstance,
}

type CharIdx = [string, number | null];

const shuffle = (chars: CharIdx[]) => {
    return chars.sort(() => Math.random() - 0.5);
}

const Game = ({ instance: { anagrams } }: GameProps) => {
    const words: number = anagrams.length;
    const [chars, setChars] = useState<CharIdx[]>(
        shuffle(anagrams[words-1].split('').map((c) => [c, null]))
    );

    const word_length: number = chars.length;
    var selected_length: number = word_length;
    const selected: string[] = chars
        // Create a copy of the array
        .map(i => i)
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
                return " ";
            }
            return c;
        });
    ;

    const onKey = (e: React.KeyboardEvent) => {
        switch (e.key) {
        case " ": // Shuffle on 'Spacebar'
            console.error("Shuffle TODO");
            break;

        case "Backspace": // Remove Last on 'BackSpace'
            console.error("Delete TODO");
            break;

        case "Enter": // Attempt to accept word on 'Enter'
            console.error("Submit TODO");
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
            {selected.map((c,idx) => (<InputBox content={c} key={idx} />))}

            {chars.map(([c,i],idx) => (<InputBox content={c} key={idx} />))}
        </div>
    );
}

export default Game;
