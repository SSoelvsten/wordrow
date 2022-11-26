import React from 'react';
import { GameLanguage } from './game-instance';
import './word.scss';

export interface WordProps {
    col: number;
    guessed: boolean;
    language: GameLanguage;
    row: number;
    show: boolean;
    word: string;
}

const word_url = (language: GameLanguage, word: string) => {
    switch (language) {
    case GameLanguage.DK:
        return `https://www.ordnet.dk/ddo/ordbog?query=${word}`;
    default:
        throw new Error(`Unknown Langauge: ${language}`);
    }
}

export const Word = ({ col, language, guessed, row, show, word } : WordProps) => {
    const getDefinition = () => {
        if(!guessed && !show) return;
        window.open(word_url(language, word), "_blank");
    }
    return (
        <div className={"Word" + (guessed ? " Guessed" : "") + (show ? " Show" : "")}
             onClick={getDefinition}
             style={{ gridColumn: col, gridRow: row }}
        >
            {word.split('')
                 .map(c => guessed || show ? c : "")
                 .map((c,i) => <div className="Letter"
                                    key={i}
                                    style={{animationDelay: (i*0.03+0.05)+"s"}}
                                >
                                        {c}
                                </div>)}
        </div>
    )
}

export default Word;
