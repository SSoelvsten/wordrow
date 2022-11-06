import React, { useEffect, useState } from "react";

export interface ScoreBoardProps {
    endTime: number, score: number;
};

const ScoreBoard = ({ endTime, score }: ScoreBoardProps) => {
    const formatTimeleft = () => {
        const time = new Date(endTime - new Date().getTime())
        return `Time left: ${time.getSeconds()}`
    }

    const [timeString, setTimeString] = useState<string>(
        () => formatTimeleft()
    );
    
    useEffect(() => { setInterval(() => setTimeString(formatTimeleft())) }, []);
    return (
    <div className="ScoreBoard">
        <Timer timeString={ timeString }/>
        <ScoreKeeper score={ score }/>
    </div>)
}

export interface TimerProps {
    timeString: string;
};

const Timer = ({timeString} : TimerProps ) => {
    return (
    <div>
        { timeString }
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