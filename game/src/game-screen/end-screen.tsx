import React from 'react';
import { string } from 'yargs';
import { GameLanguage } from '../game-instance';
import './end-screen.scss';

interface EndScreenProps {
    language: GameLanguage;
    qualified: boolean;
    showContinue: boolean;
    score: number;
}

const EndScreen = ({ language, qualified, score, showContinue }: EndScreenProps) => {
    let success_text, failed_text: string;
    let continue_texts: string[];

    switch (language) {
    case GameLanguage.DK: {
        success_text  = "Tillykke! Du er kvalificeret til den næste runde.";
        failed_text   = "Desværre! Find et ord, der bruger alle bogstaver, for at kvalificere til den næste runde.";
        continue_texts = ["Tryk", "mellemrum", "for at fortsætte."]
        break;
    }
    case GameLanguage.GB: {
        success_text  = "Congratulations! You qualify for the next round.";
        failed_text   = "Sorry! Find a word that uses all letters to qualify for the next round.";
        continue_texts = ["Press", "space", "to continue."];
        break;
    }
    }

    return (
        <div className="EndScreen">
            { qualified ? success_text : failed_text}

            <div className="Score">{Math.round(score).toLocaleString()}</div>

            <div className={"Continue " + (showContinue ? "show" : "hide")}>
                {continue_texts[0]} <b>{continue_texts[1]}</b> {continue_texts[2]}
            </div>
        </div>
    );
}

export default EndScreen;
