import React, { useEffect, useRef, useState } from 'react';
import './game.scss';
import { GameInstance, GameLanguage } from './game-instance';
import InputBox from './input-box';
import Word from './word';
import shuffle from '../shuffle';
import ScoreBoard from './scoreboard';
import EndScreen from './end-screen';

export interface GameReport {
    qualified: boolean;
    score: number;
}

export interface GameProps {
    instance: GameInstance;
    language: GameLanguage;
    accScore: number;
    round: number;
    onRequestNextGame: (report: GameReport) => void;
}

type CharIdx = [string, number | null];

const charShuffle = (chars: CharIdx[]) => {
    let charsCopy = chars.map(c => c);
    charsCopy.sort(
        ([_ca,ia], [_cb,ib]) => {
            if (ia === null && ib === null)
                return 0;
            if (ia === null || ib === null)
                 return ia === null ? 1 : -1;
            else return 0;
        }
    );
    const firstNonNull = charsCopy.findIndex(([_,i]) => i === null);
    shuffle(charsCopy, firstNonNull, charsCopy.length);
    return charsCopy;
}

const Game = ({ instance: { anagrams }, language, accScore, round, onRequestNextGame }: GameProps) => {
    // ------------------------------------------------------------------------
    // GAME SETTINGS
    const scoreWord = (w : string) => Math.round(Math.pow(w.length-2,2)*100);
    const timeWord = (w : string) => scoreWord(w) * 10 + 2000;

    // ------------------------------------------------------------------------
    // GAME STATE
    const words: number = anagrams.length;
    const min_word_length: number = anagrams[0].length;
    const max_word_length: number = anagrams[words-1].length;

    const [chars, setChars] = useState<CharIdx[]>(
        () => charShuffle(anagrams[words-1].split('').map((c) => [c, null]))
    );
    const [guessed, setGuessed] = useState<boolean[]>(
        () => Array(words).fill(false)
    );
    const [guessCache, setGuessCache] = useState<(string | null)[]>(
        () => Array(words).fill(null)
    );
    const [gameEnd, setGameEnd] = useState<boolean>(
        () => false
    );
    const [activatePressToContinue, setActivatePressToContinue] = useState<boolean>(
        () => false
    );

    const startTime: number = Math.max(anagrams.reduce((acc, w) => acc + timeWord(w), 0) / 2,
                                       30*1000);

    const [endTime, setEndTime] = useState<number>(
        () => new Date().getTime() + startTime
    );

    const currScore: number  = anagrams.filter((w,i) => guessed[i]).reduce((acc,w) => acc+scoreWord(w), 0);
    const qualified: boolean = !!guessed.find((v,idx) => v && anagrams[idx].length === max_word_length);

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
        setChars(charShuffle(chars));
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
                let guessedANewWord = false;
                const newGuessed: boolean[] = guessed.map((v: boolean, idx: number) => {
                    const match = anagrams[idx] === guess;
                    if (match) guessedANewWord = v === false;
                    return v || anagrams[idx] === guess;
                });
                const hasGuessedAll: boolean = !guessed.find(v => !v);

                setGuessed(newGuessed);
                if (guessedANewWord) { setEndTime(endTime + timeWord(guess)); }
                setGameEnd(!hasGuessedAll);
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

    const onTimeout = () => {
        setGameEnd(true);
    }

    const gameEndDelay = 2000;
    useEffect(() => {
        if (gameEnd)
            setTimeout(() => setActivatePressToContinue(true), gameEndDelay);
    }, [gameEnd]);

    // ------------------------------------------------------------------------
    // KEY LISTENER
    const onKey = (e: React.KeyboardEvent) => {
        if (gameEnd) {
            if (!activatePressToContinue) return;

            if (e.key === " ") {
                onRequestNextGame({ qualified, score: currScore });
            }
            return;
        } else { // !gameEnd
            switch (e.key) {
            case " ":         actionShuffle(); break;
            case "Backspace": (e.ctrlKey || e.altKey) ? actionClear() : actionDelete();  break;
            case "Escape":    actionClear();   break;
            case "Enter":     actionSubmit();  break;
            default:          actionType(e.key)
            }
        }
    }

    // ------------------------------------------------------------------------
    // VISUAL

    const wordLengths: number[] = Array(max_word_length - min_word_length + 1).fill(0).map((_,i) => i + min_word_length);
    let wordColumns: [string, number][][] = wordLengths.map((word_length, i) => 
        anagrams.map((w,i) => [w,i] as [string,number]).filter(([w,_]) => w.length === word_length)
    );

    // TODO: Respond to changes to the window size:
    //   https://www.pluralsight.com/guides/re-render-react-component-on-window-resize
    //   https://www.tutsmake.com/react-get-window-height-width/
    const totalHeight = window.innerHeight;
    const scoreboardHeight = 37;
    const inputHeight = 2 * 90;

    const remainingHeight = totalHeight - scoreboardHeight - inputHeight;

    const wordHeight = 38;
    const maxWords = remainingHeight / wordHeight

    if (wordColumns.some((c) => c.length > maxWords)) {
        wordColumns = [anagrams.map((w,i) => [w,i] as [string,number])]
    }
    const singleColumn : boolean = wordColumns.length === 1;

    const wordWidth = 32 * max_word_length;
    const maxColumns = Math.floor(window.innerWidth / wordWidth);
    const averageColumnHeight : number = Math.ceil(anagrams.length / maxColumns);

    // https://stackabuse.com/how-to-set-focus-on-element-after-rendering-with-react/
    const divRef = useRef<any>(null);
    useEffect(() => { divRef.current.focus(); }, []);

    return (
        <div className="Game" tabIndex={0} onKeyDown={onKey} ref={divRef}>
            <div className='ScoreBoard'>
                <ScoreBoard endTime={endTime} language={language} score={accScore + currScore} round={round} onTimeout={onTimeout} />
            </div>
            { <div className="Anagrams">
                { wordColumns.map((c,i) => (
                    c.map(([w,j], ci) => {
                        const row = singleColumn ? Math.floor(j % averageColumnHeight)+1 : ci+1;
                        const col = singleColumn ? Math.floor(j / averageColumnHeight)+1 : i+1;
                        return <Word key={j} language={language} word={w} guessed={guessed[j]} show={gameEnd} row={row} col={col}  />
                    })
                )) }
              </div> }
            {!gameEnd &&
                <>
                    <div className="Row">
                        {selected.map((c,idx) => (<InputBox content={c || " "} key={idx} />))}
                    </div>
                    <div className="Row">
                        {chars.map(([c,i],idx) => (<InputBox content={i === null ? c : "_"} key={idx} />))}
                    </div>
                </>
            }
            {gameEnd &&
                <div className="Row">
                    <EndScreen language={language}
                               qualified={qualified}
                               score={accScore + currScore}
                               showContinue={activatePressToContinue} />
                </div>
            }
        </div>
    );
}

export default Game;
