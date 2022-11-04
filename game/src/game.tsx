import React from 'react';
import { GameInstance } from './game-instance';
import InputBox from './input/input-box';

export interface GameProps {
    instance: GameInstance,
}

const Game = (props: GameProps) => {
    return (
        <div>
            <InputBox content="a" />
            <InputBox content="b" />

            {JSON.stringify(props.instance)}
        </div>
    );
}

export default Game;
