import React from 'react';
import './word.scss';

export interface WordProps {
    word: string;
    guessed: boolean;
}

export const Word = ({ word, guessed } : WordProps) => {
    return (
        <div className={"Word" + (guessed ? " Guessed" : "")}>
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
