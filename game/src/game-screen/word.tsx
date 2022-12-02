import React from 'react';
import { Language } from '../language';
import './word.scss';

export interface WordProps {
    col: number;
    guessed: boolean;
    language: Language | undefined;
    row: number;
    show: boolean;
    word: string;
}

const word_url = (language: Language, word: string) => {
    switch (language) {
    case Language.DK:
        return `https://www.ordnet.dk/ddo/ordbog?query=${word}`;
    case Language.GB:
        return `https://www.merriam-webster.com/dictionary/${word}`;
    default:
        throw new Error(`Unknown Language: ${language}`);
    }
}

export const Word = ({ col, language, guessed, row, show, word } : WordProps) => {
    const getDefinition = () => {
        if(!guessed && !show) return;
        if (!language) return;
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
