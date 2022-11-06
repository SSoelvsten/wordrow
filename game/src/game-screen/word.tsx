import React from 'react';
import './word.scss';

export interface WordProps {
    guessed: boolean;
    show: boolean;
    url: string;
    word: string;
}

export const Word = ({ guessed, show, url, word } : WordProps) => {
    const getDefinition = () => {
        if(!guessed && !show) return;
        window.open(url, "_blank");
    }
    return (
        <div className={"Word" + (guessed ? " Guessed" : "") + (show ? " Show" : "")} onClick={getDefinition}>
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
