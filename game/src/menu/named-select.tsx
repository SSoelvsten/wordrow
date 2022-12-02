import React from 'react';
import './flag.scss';
import './named-select.scss'

export interface NamedSelectProps {
    selected: boolean;
    text: string;
    onClick: () => void;
}

export const NamedSelect = ({ selected, text, onClick } : NamedSelectProps) =>  (
    <div className={`NamedSelect ${selected ? "Selected" : ""}`} onClick={onClick}>
        {text}
    </div>
);

export default NamedSelect;