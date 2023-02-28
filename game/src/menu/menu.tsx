import React, { ReactElement, useEffect, useRef } from 'react';
import { Difficulties, Difficulty, DifficultyName } from '../difficulty';
import { Language, languages } from '../language';
import Flag from './flag';
import './menu.scss';
import NamedSelect from './named-select';

export interface MenuProps {
    difficulty: Difficulty ;
    setDifficulty: (d: Difficulty) => void;
    language: Language;
    setLanguage: (l: Language) => void;
    startGame: () => void;
}

const Menu = ({ difficulty, setDifficulty, language, setLanguage, startGame } : MenuProps) => {
    const mayBegin = language !== undefined && difficulty !== undefined;

    // ------------------------------------------------------------------------
    // MENU LOGIC
    const actionLanguage = (l: Language) => {
        setLanguage(l);
    }

    const actionDifficulty = (d: Difficulty) => {
        setDifficulty(d);
    }

    const actionStartGame = () => {
        if (mayBegin) startGame();
    }

    // ------------------------------------------------------------------------
    // KEY LISTENER
    const onKey = (e: React.KeyboardEvent) => {
        switch (e.key) {
        case " ":         {
            const nextDifficulty = difficulty
                ? (Difficulties.indexOf(difficulty) + 1) % Difficulties.length
                : 0;
            actionDifficulty(Difficulties[nextDifficulty]);
            break;
        }
        case "Backspace": break;
        case "Escape":    break;
        case "Enter": {
            actionStartGame();
            break;
        }
        default:
            const idx : number = parseInt(e.key);
            if (idx && 0 < idx && idx <= languages.length) {
                actionLanguage(languages[idx-1]);
            }
            break;
        }
    }

    // ------------------------------------------------------------------------
    // TRANSLATIONS
    let start_text: ReactElement = <></>;
    let select_language: ReactElement = <></>;
    let select_difficulty: ReactElement = <></>;

    switch (language) {
    case Language.DK:
        start_text        = <><b> Klik her </b> eller <b> tryk enter </b> for at starte.</>
        select_language   = <>Sprog</>;
        select_difficulty = <>Spiltype</>
        break;
    case Language.EN:
        start_text        = <><b> Click here </b> or <b> press enter </b> to start.</>
        select_language   = <>Language</>;
        select_difficulty = <>Game Mode</>;
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

            <div className="MenuSection"> {select_difficulty} </div>
            <div className="GameTypeSelection">
                {Difficulties.map((d,i) => <NamedSelect text={DifficultyName(d,language)}
                                                        selected={d === difficulty}
                                                        onClick={() => actionDifficulty(d)}
                                                        key={i}/>)}
            </div>
            <div className="StartGame" onClick={actionStartGame}>
               {start_text}
            </div>
            <div className="Dummy" />
        </div>
    );
}

export default Menu;
