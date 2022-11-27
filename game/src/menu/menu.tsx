import React, { useEffect, useRef } from 'react';
import { GameLanguage, GameLanguages } from '../game-screen/game-instance';
import Flag from './flag';
import './menu.scss';

export interface MenuProps {
    language: GameLanguage | undefined;
    setLanguage: (l: GameLanguage) => void;
    startGame: () => void;
}

const Menu = ({ language, setLanguage, startGame } : MenuProps) => {
    const mayBegin = language !== undefined;

    // ------------------------------------------------------------------------
    // MENU LOGIC
    const actionLanguage = (l: GameLanguage) => {
        setLanguage(l);
    }

    const actionStartGame = () => {
        if (mayBegin) startGame();
    }

    // ------------------------------------------------------------------------
    // KEY LISTENER
    const onKey = (e: React.KeyboardEvent) => {
        switch (e.key) {
        case " ":         actionStartGame(); break;
        case "Backspace": break;
        case "Escape":    break;
        case "Enter":     break;
        default:
            if (parseInt(e.key)) actionLanguage(GameLanguages[parseInt(e.key)-1]);
            break;
        }
    }

    // ------------------------------------------------------------------------
    // VISUAL
    let start_text: string[] = ["", "", "", ""];
    let select_language: string = "Language";

    switch (language) {
    case GameLanguage.DK: {
        start_text      = ["Klik her", "eller", "tryk mellemrum", "for at starte."]
        select_language = "Sprog";
        break;
    }
    case GameLanguage.GB: {
        start_text      =  ["Click here", "or","press space", "to start."]
        select_language = "Language";
        break;
    }
    }

    // https://stackabuse.com/how-to-set-focus-on-element-after-rendering-with-react/
    const divRef = useRef<any>(null);
    useEffect(() => { divRef.current.focus(); }, []);

    return (
        <div className="Menu" tabIndex={0} onKeyDown={onKey} ref={divRef}>
            <div className="Dummy" />
            <div className="GameTitle" >
                {'wordrow'.split('').map((c,i) => <div className="Letter" key={i}>{c}</div>)}
            </div>

            <div className="MenuSection"> {select_language} </div>
            <div className="LanguageSelection">
                { GameLanguages.map((lang, idx) => <Flag language={GameLanguage.DK}
                                                    index={idx+1} key={idx}
                                                    selected={lang === language}
                                                    onClick={() => actionLanguage(lang)} />) }
            </div>
            <div className="GameTypeSelection">
                {/* TODO */}
            </div>
            <div className={`StartGame ${mayBegin ? "" : "hide"}`} onClick={actionStartGame}>
                <b> {start_text[0]} </b> {start_text[1]} <b> {start_text[2]} </b> {start_text[3]}
            </div>
            <div className="Dummy" />
        </div>
    );
}

export default Menu;