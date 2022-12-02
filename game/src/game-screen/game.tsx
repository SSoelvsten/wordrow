import React, { ReactElement, useEffect, useRef, useState } from 'react';
import './game.scss';
import { GameInstance } from './game-instance';
import { Language } from '../language';
import InputBox from './input-box';
import Word from './word';
import shuffle from '../shuffle';
import ScoreBoard from './scoreboard';
import EndScreen from './end-screen';
import Announcement from './announcement';
import { Difficulty, DifficultyLogic, GetDifficultyLogic } from '../difficulty';

export interface GameReport {
    qualified: boolean;
    score: number;
}

export interface GameProps {
    instance: GameInstance;
    difficulty: Difficulty;
    language: Language;
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

const Game = ({ instance: { anagrams }, difficulty, language, accScore, round, onRequestNextGame }: GameProps) => {
    const words: number = anagrams.length;
    const min_word_length: number = anagrams[0].length;
    const max_word_length: number = anagrams[words-1].length;

    // ------------------------------------------------------------------------
    // GAME SCORING
    const scoreWord = (w : string) => Math.round(Math.pow(w.length-2,2)*100);

    // ------------------------------------------------------------------------
    // GAME TIME
    const numberOfChars : number = anagrams.reduce((acc,w) => acc+w.length, 0);
    const timerSetting : DifficultyLogic = GetDifficultyLogic(difficulty, numberOfChars);

    // ------------------------------------------------------------------------
    // GAME STATE

    const [chars, setChars] = useState<CharIdx[]>(
        () => charShuffle(anagrams[words-1].split('').map((c) => [c, null]))
    );
    const [guessed, setGuessed] = useState<boolean[]>(
        () => Array(words).fill(false)
    );
    const [latestGuessed, setLatestGuessed] = useState<string | null>(
        () => null
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

    const [endTime, setEndTime] = useState<number>(
        () => new Date().getTime() + timerSetting.initialTime
    );

    const currScore: number  = (!guessed.includes(false) ? 2 : 1) * anagrams.filter((w,i) => guessed[i]).reduce((acc,w) => acc+scoreWord(w), 0);
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

                setGuessed(newGuessed);
                if (guessedANewWord) {
                    setLatestGuessed(guess);
                    setEndTime(endTime + timerSetting.addTime(guess.length));

                    const remainingWords = guessed.reduce((acc, v) => acc + (!v ? 1 : 0), 0);
                    setGameEnd(remainingWords <= 1);
                }
            }
            setChars(chars.map(([c,i]) => [c,null]));
        }
    }

    const actionType = (char: string) => {
        // Ignore non-char inputs
        if (char.length !== 1) return;

        // Allow the user to write upper case letters
        char = char.toLocaleLowerCase();

        // Find and update the requested letter (if any)
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

            if (e.key === "Enter") {
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
    // ANAGRAMS LAYOUT

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
    const maxColumnSize = remainingHeight / wordHeight

    if (wordColumns.some((c) => c.length > maxColumnSize)) {
        wordColumns = [anagrams.map((w,i) => [w,i] as [string,number])]
    }
    const singleColumn : boolean = wordColumns.length === 1;

    const wordWidth = 32 * max_word_length;
    const maxColumns = Math.floor(window.innerWidth / wordWidth);

    let actualColumns : number = 1;
    let actualColumnSize : number = anagrams.length;
    while (actualColumns < maxColumns) {
        actualColumnSize = Math.ceil(anagrams.length / actualColumns);
        if (actualColumnSize < maxColumnSize) break;
        actualColumns += 1;
    }

    // ------------------------------------------------------------------------
    // TRANSLATIONS

    let round_text : ReactElement = <></>;
    switch (language) {
    case Language.DK: round_text = <>Runde {round}</>; break;
    case Language.GB: round_text = <>Round {round}</>; break;
    default:
        throw new Error(`Unknown Language: ${language}`);
    }

    // ------------------------------------------------------------------------
    // VISUAL

    // https://stackabuse.com/how-to-set-focus-on-element-after-rendering-with-react/
    const divRef = useRef<any>(null);
    useEffect(() => { divRef.current.focus(); }, []);

    return (
    <>
        <div className="Game" tabIndex={0} onKeyDown={onKey} ref={divRef}>
            <ScoreBoard endTime={endTime}
                        language={language}
                        qualified={qualified}
                        score={accScore + currScore}
                        round={round}
                        onTimeout={onTimeout}
                    />

            { <div className="Anagrams">
                { wordColumns.map((c,i) => (
                    c.map(([w,j], ci) => {
                        const row = singleColumn ? Math.floor(j % actualColumnSize)+1 : ci+1;
                        const col = singleColumn ? Math.floor(j / actualColumnSize)+1 : i+1;
                        return <Word key={j} language={language} word={w} guessed={guessed[j]} show={gameEnd} row={row} col={col}  />
                    })
                )) }
              </div> }
            {!latestGuessed &&
                <Announcement content={round_text}/>
            }

            {!gameEnd &&
                <>
                    <div className={`Row ${guessed.includes(true) ? 'HasGood' : ''}`} key={latestGuessed}>
                        {selected.map((c,idx) => (<InputBox content={c || " "} key={idx} />))}
                    </div>
                    <div className={`Row`}>
                        {chars.map(([c,i],idx) => (<InputBox content={i === null ? c : "_"} key={idx} />))}
                    </div>
                </>
            }
            {gameEnd &&
                <div className={`Row`}>
                    <EndScreen language={language}
                               qualified={qualified}
                               score={accScore + currScore}
                               showContinue={activatePressToContinue} />
                </div>
            }
        </div>
    </>
    );
}

export default Game;
