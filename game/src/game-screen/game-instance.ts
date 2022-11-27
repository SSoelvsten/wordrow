export enum GameLanguage {
    DK = "da-DK",
    GB = "en-GB",
}

export const GameLanguages: GameLanguage[] = [
    GameLanguage.GB,
    GameLanguage.DK
];

export const languageName = (l : GameLanguage) => {
    switch (l) {
    case GameLanguage.GB: return "British";
    case GameLanguage.DK: return "Dansk";
    }
}

export interface GameIndex {
    //lang: GameLanguage;
    instances: number;
}

export interface GameInstance {
    anagrams: string[];
}
