import React from 'react';
import './end-screen.scss';

interface EndScreenProps {
    qualified: boolean;
    showContinue: boolean;
    score: number;
}

const EndScreen = ({ qualified, score, showContinue }: EndScreenProps) => {

    return (
        <div className="EndScreen">
            { qualified ? "Congratulations! You qualify for the next round"
                        : "Sorry! Find a word that uses all letters to qualify for the next round."}

            <div className="Score">{Math.round(score).toLocaleString()}</div>

            <div className={"Continue " + (showContinue ? "show" : "hide")}>
                Press <b>any key</b> to continue
            </div>
        </div>
    );
}

export default EndScreen;
