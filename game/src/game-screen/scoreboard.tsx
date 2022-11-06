import React, { useEffect, useState } from "react";
import './scoreboard.scss';

export interface ScoreBoardProps {
    endTime: number,
    score: number;
    onTimeout: () => void;
};

const ScoreBoard = ({ endTime, score, onTimeout }: ScoreBoardProps) => {
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
        if (endTime - currTime < 0) onTimeout();
    }, [currTime]);

    return (
        <div className="ScoreBoard">
            {formatTimeleft()} | {Math.round(score).toLocaleString(undefined, {minimumIntegerDigits: 7 })}
        </div>
    );
}

export default ScoreBoard;
