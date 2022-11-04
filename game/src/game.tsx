import React, { useState } from 'react';
import { GameInstance } from './game-instance';
import InputBox from './input-box';
import './game.css';
import Word from './word';

export interface GameProps {
    instance: GameInstance;
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
    const [guessCache, setGuessCache] = useState<(string | null)[]>(
        () => Array(words).fill(null)
    );

    const min_word_length: number = anagrams[0].length;
    const max_word_length: number = anagrams[words-1].length;
    var selected_length: number = max_word_length;
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
            console.log(selected);
            if (!selected[0]) {
                var charsCopy: CharIdx[] = chars.map(_ => _);
                guessCache.forEach((s, si) => {
                    for (let idx = 0; s && idx < max_word_length; idx++) {
                        const [c, i] = charsCopy[idx];
                        if(!i && c===s) {
                            charsCopy[idx][1] = si;
                            break;
                        }
                    }
                })
                console.log(charsCopy);
                setChars(charsCopy);
                break;
            }; //Put old word back*/
            setGuessCache(selected);
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
        <div className="Game fullscreen" tabIndex={0} onKeyDown={onKey}>
            <div className="Anagrams">
                <div className="Anagrams-columns">
                    {
                        Array(max_word_length - min_word_length + 1).fill(0)
                            .map((_,i) => i + min_word_length)
                            .map(word_length => (<div className="Anagrams-column">
                                {anagrams.map((w,i) => [w,i] as [string,number])
                                         .filter(([w,i]) => w.length === word_length)
                                         .map(([w,i]) => <Word word={w} guessed={guessed[i]} />)}
                            </div>))
                    }
                </div>
            </div>
            <div className="Row">
                {selected.map((c,idx) => (<InputBox content={c || " "} key={idx} />))}
            </div>
            <div className="Row">
                {chars.map(([c,i],idx) => (<InputBox content={i === null ? c : "_"} key={idx} />))}
            </div>
        </div>
    );
}

export default Game;
