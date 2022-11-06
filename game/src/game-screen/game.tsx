import React, { useEffect, useRef, useState } from 'react';
import './game.scss';
import { GameInstance } from '../game-instance';
import InputBox from './input-box';
import Word from './word';
import shuffle from '../shuffle';
import ScoreBoard from './scorekeeper';

export interface GameProps {
    instance: GameInstance;
}

type CharIdx = [string, number | null];

const charShuffle = (chars: CharIdx[]) => {
    let charsCopy = chars.map(c => c);
    charsCopy.sort(
        ([_ca,ia], [_cb,ib]) => {
            if (ia !== null || ib !== null)
                 return ia === null ? 1 : -1;
            else return -1;
        }
    );
    const firstNonNull = charsCopy.findIndex(([_,i]) => i !== null);
    console.log(charsCopy, firstNonNull);
    shuffle(charsCopy, firstNonNull, charsCopy.length);
    return charsCopy
}

const Game = ({ instance: { anagrams } }: GameProps) => {
    // ------------------------------------------------------------------------
    // GAME STATE
    const words: number = anagrams.length;
    const [chars, setChars] = useState<CharIdx[]>(
        () => charShuffle(anagrams[words-1].split('').map((c) => [c, null]))
    );
    const [guessed, setGuessed] = useState<boolean[]>(
        () => Array(words).fill(false)
    );
    const [guessCache, setGuessCache] = useState<(string | null)[]>(
        () => Array(words).fill(null)
    );

    const min_word_length: number = anagrams[0].length;
    const max_word_length: number = anagrams[words-1].length;

    // Derive selected word and its true length (i.e. the last index that is non-null)
    var selected_length: number = max_word_length;
    const selected: (string | null)[] = chars
        // Create a copy of the array
        .map(_ => _)
        // Sort by selection-index, leaving 'null' at the end
        .sort(([_ca,ia], [_cb,ib]) => {
            return ia === null && ib === null ? 0
                 : ia === null ?  1
                 : ib === null ? -1
                 : ia - ib})
        // Display character, if selected. Otherwise, decrement 'selected_length'
        .map(([c,i]) => {
            if (i === null) {
                selected_length--;
                return null;
            }
            return c;
        });
    ;

    // ------------------------------------------------------------------------
    // GAME LOGIC
    const actionShuffle = () => {
        setChars(charShuffle(chars));//shuffleTwo(chars, anagrams)); // <-- TODO: different shuffle?
    }

    const actionDelete = (idx?: number) => {
        setChars(chars.map(([c,i]) => i === selected_length-1 ? [c,null] : [c,i]));
    }

    const actionClear = () => {
        setChars(chars.map(([c, _]) => ([c, null])));
    }

    const actionSubmit = () => {
        const emptySelection : boolean = !selected[0];

        // If nothing is selected, recreate the indices for the word in 'guessCache'
        if (emptySelection) {
            let charsCopy: CharIdx[] = chars.map(_ => _);
            guessCache.forEach((s, si) => {
                for (let idx = 0; s && idx < max_word_length; idx++) {
                    const [c, i] = charsCopy[idx];
                    if(i === null && c === s) {
                        charsCopy[idx][1] = si;
                        break;
                    }
                }
            });
            setChars(charsCopy);
        } else {
            // Save current selected word in 'guessCache'
            setGuessCache(selected);

            // Collapse guess from a char[] to a string
            const guess: string = selected.map(c => c === null ? "" : c).join("");
            if (anagrams.includes(guess)) {
                setGuessed(guessed.map((v,idx) => v || anagrams[idx] === guess));
            }
            setChars(chars.map(([c,i]) => [c,null]));
        }
    }

    const actionType = (char: string) => {
        if (char.length !== 1) return; // <-- ignore non-char inputs

        if (chars.filter(([c,i]) => i === null).map(([c,i]) => c).includes(char)) {
            var hasSelected: boolean = false;
            setChars(chars.map(([c,i]) => {
                if (!hasSelected && i === null && c === char) {
                    hasSelected = true;
                    return [c,selected_length];
                } else {
                    return [c,i];
                }
            }));
        }
    }

    // ------------------------------------------------------------------------
    // KEY LISTENER
    const onKey = (e: React.KeyboardEvent) => {
        switch (e.key) {
        case " ":         actionShuffle(); break;
        case "Backspace": (e.ctrlKey || e.altKey) ? actionClear() : actionDelete();  break;
        case "Escape":    actionClear();   break;
        case "Enter":     actionSubmit();  break;
        default:          actionType(e.key)
        }
    }

    // ------------------------------------------------------------------------
    // VISUAL - GAME

    // https://stackabuse.com/how-to-set-focus-on-element-after-rendering-with-react/
    const divRef = useRef<any>(null);
    useEffect(() => { divRef.current.focus(); }, []);
    // ------------------------------------------------------------------------
    // VISUAL - scoreboard
    return (
        <div className="Game fullscreen" tabIndex={0} onKeyDown={onKey} ref={divRef}>
            <div className='ScoreBoard'> 
                <ScoreBoard time={1000} score={0}/>
            </div>
            <div className="Anagrams">
                <div className="Anagrams-columns">
                    {
                        Array(max_word_length - min_word_length + 1).fill(0)
                            .map((_,i) => i + min_word_length)
                            .map((word_length, i) => (<div className="Anagrams-column" key={i}>
                                {anagrams.map((w,i) => [w,i] as [string,number])
                                         .filter(([w,_]) => w.length === word_length)
                                         .map(([w,i]) => <Word word={w} guessed={guessed[i]} key={i}
                                                               url={`https://www.ordnet.dk/ddo/ordbog?query=${w}`}/>)}
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
