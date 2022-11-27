import React from 'react';
import { GameLanguage, languageName } from '../game-screen/game-instance';
import "./flag.scss";

export interface FlagProps {
    index: number;
    language: GameLanguage;
    selected: boolean;
    onClick: () => void;
}

export const Flag = ({ index, language, selected, onClick } : FlagProps) => (
    <div className={`Flag ${selected ? "Selected" : ""}`} onClick={onClick}>
        <img src={`flags/${language}.png`} alt={`${language} flag`} />
        <div className="Index">{languageName(language)} ({index})</div>
    </div>
);

export default Flag;