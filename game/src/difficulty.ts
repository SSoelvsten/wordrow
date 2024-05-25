import './language';
import { Language } from './language';

export enum Difficulty {
    UNLIMITED = "UNLIMITED",
    TIMED     = "TIMED",
    BLITZ     = "BLITZ"
}

export const Difficulties : Difficulty[] = [
    Difficulty.UNLIMITED,
    Difficulty.TIMED,
    Difficulty.BLITZ,
];

export interface DifficultyLogic {
    initialTime: number;
    addTime: (word_length: number) => number;
}

export const GetDifficultyLogic = (d: Difficulty, numberOfChars: number) : DifficultyLogic =>  {
    const minimumTime = 2 * 60 * 1000; // 02:00:000
    const totalTime = Math.max(minimumTime, numberOfChars * 1000)

    switch (d) {
    case Difficulty.UNLIMITED:
        return {
            initialTime: Infinity,
            addTime: (word_length: number) => 0
        };
    case Difficulty.TIMED:
        return {
            initialTime: totalTime,
            addTime: (word_length: number) => 0
        };
    case Difficulty.BLITZ:
        const initialTime = Math.max(30 * 1000 /* 30s */,
                                     totalTime / 7);
        const timePerChar = (totalTime-initialTime) / numberOfChars;

        return {
            initialTime: initialTime,
            addTime: (word_length: number) => word_length * timePerChar
        };
    }
}

export const DifficultyName = (d: Difficulty, l: Language | undefined) : string => {
    if (!l) return DifficultyName(d, Language.EN);

    switch(l) {
    case Language.DK:
        switch (d) {
        case Difficulty.UNLIMITED: return "Ubegrænset";
        case Difficulty.TIMED:     return "Tid";
        case Difficulty.BLITZ:     return "Lyn";
        }
        break;
    case Language.DE:
        switch (d) {
        case Difficulty.UNLIMITED: return "Unbegrenzt";
        case Difficulty.TIMED:     return "Zeit";
        case Difficulty.BLITZ:     return "Blitz";
        }
        break;
    case Language.EN:
        switch (d) {
        case Difficulty.UNLIMITED: return "Unlimited";
        case Difficulty.TIMED:     return "Timed";
        case Difficulty.BLITZ:     return "Blitz";
        }
        break;
    case Language.ES:
        switch (d) {
        case Difficulty.UNLIMITED: return "Ilimitado";
        case Difficulty.TIMED:     return "Contrarreloj";
        case Difficulty.BLITZ:     return "Relámpago";
        }
        break;
    default:
        throw new Error(`Unknown Language: ${l}`);
    }
}
