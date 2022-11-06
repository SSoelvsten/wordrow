import React from "react";

export interface ScoreBoardProps {
    time: number, score: number;
};

const ScoreBoard = ({ time, score }: ScoreBoardProps) => {
    return (
    <div className="ScoreBoard">
        <Timer time={ time }/>
        <ScoreKeeper score={ score }/>
    </div>)
}

export interface TimerProps {
    time: number;
};

const Timer = ({time} : TimerProps ) => {
    return (
    <div>
        { time }
    </div>
    )
}

interface ScoreKeeperProps {
    score : number
}

const ScoreKeeper = ({score}: ScoreKeeperProps) => {
    return (
    <div>
        { score }
    </div>
    )
}

export default ScoreBoard;