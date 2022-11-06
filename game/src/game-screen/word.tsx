import React from 'react';
import './word.scss';

export interface WordProps {
    word: string;
    guessed: boolean;
    url: string;
}

export const Word = ({ word, guessed, url } : WordProps) => {
    const getDefinition = () => {
        if(!guessed) return;
        window.open(url, "_blank");
    }
    return (
        <div className={"Word" + (guessed ? " Guessed" : "")} onClick={getDefinition}>
            {word.split('')
                 .map(c => guessed ? c : "")
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
