import React, { ReactElement, useEffect, useRef } from 'react';
import { Language, languages } from '../language';
import Flag from './flag';
import './menu.scss';

export interface MenuProps {
    language: Language | undefined;
    setLanguage: (l: Language) => void;
    startGame: () => void;
}

const Menu = ({ language, setLanguage, startGame } : MenuProps) => {
    const mayBegin = language !== undefined;

    // ------------------------------------------------------------------------
    // MENU LOGIC
    const actionLanguage = (l: Language) => {
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
            if (parseInt(e.key)) actionLanguage(languages[parseInt(e.key)-1]);
            break;
        }
    }

    // ------------------------------------------------------------------------
    // TRANSLATIONS
    let start_text: ReactElement = <></>;
    let select_language: ReactElement = <></>;

    switch (language) {
    case Language.DK:
        start_text      = <><b> Klik her </b> eller <b> tryk mellemrum </b> for at starte.</>
        select_language = <>Sprog</>;
        break;
    case Language.GB:
        start_text      =  <><b> Click here </b> or <b> press space </b> to start.</>
        select_language = <>Language</>;
        break;
    default:
        throw new Error(`Unknown Language: ${language}`);
    }

    // ------------------------------------------------------------------------
    // VISUAL

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
                { languages.map((lang, idx) => <Flag language={lang}
                                                     index={idx+1} key={idx}
                                                     selected={lang === language}
                                                     onClick={() => actionLanguage(lang)} />) }
            </div>
            <div className="GameTypeSelection">
                {/* TODO */}
            </div>
            <div className={`StartGame ${mayBegin ? "" : "hide"}`} onClick={actionStartGame}>
               {start_text}
            </div>
            <div className="Dummy" />
        </div>
    );
}

export default Menu;