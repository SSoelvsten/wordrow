import React, { useEffect, useState } from "react";
import { GameLanguage } from "./game-instance";
import './scoreboard.scss';

export interface ScoreBoardProps {
    endTime: number;
    language: GameLanguage;
    score: number;
    round: number;
    onTimeout: () => void;
};

const ScoreBoard = ({ endTime, language, round, score, onTimeout }: ScoreBoardProps) => {
    const [currTime, setCurrTime] = useState(() => new Date().getTime());

    const formatTimeleft = () => {
        const timeLeft = endTime - currTime;
        if (timeLeft < 0) return "00:00:000";

        const millis = Math.floor(timeLeft % 1000);
        const seconds = Math.floor((timeLeft / 1000) % 60);
        const minutes = Math.floor((timeLeft / 1000) / 60);

        return `${
            minutes.toLocaleString(undefined, { minimumIntegerDigits: 2 })
        }:${
            seconds.toLocaleString(undefined, { minimumIntegerDigits: 2 })
        }:${
            millis.toLocaleString(undefined, { minimumIntegerDigits: 3 })
        }`;
    };

    useEffect(() => {
        const timerId = setInterval(() => {
            const tick = new Date().getTime();
            setCurrTime(tick);
        }, 50);
        return () => clearInterval(timerId);
    }, []);

    useEffect(() => {
        const timeLeft = endTime - currTime;
        if (timeLeft < 0) onTimeout();
    }, [currTime, endTime, onTimeout]);

    const timeLeft = endTime - currTime;
    const timeAlarm: boolean = 0 < timeLeft && timeLeft < 10 * 1000;

    return (
        <div className="ScoreBoard">
            <div className={`Time ${timeAlarm ? "Alarm" : ""}`}>{formatTimeleft()}</div>
            <div className="RoundNumber">| {round} |</div>
            <div className="Score">{Math.round(score).toLocaleString(language, {minimumIntegerDigits: 7 })}</div>
        </div>
    );
}

export default ScoreBoard;
