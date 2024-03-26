import React from 'react';
import { Language, languageName } from '../language';
import './flag.scss';

export interface FlagProps {
    index: number;
    language: Language;
    selected: boolean;
    onClick: () => void;
}

export const Flag = ({ index, language, selected, onClick }: FlagProps) => (
    <div className={`Flag ${selected ? "Selected" : ""}`} onClick={onClick}>
        <img src={`flags/${language}.png`} alt={`${language} flag`} />
        <div className="Index">{languageName(language)} ({index})</div>
    </div>
);

export default Flag;