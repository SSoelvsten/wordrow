export enum GameLanguage {
    DK = "da-DK",
    GB = "en-GB",
}

export const GameLanguages: GameLanguage[] = [GameLanguage.DK];

export const languageName = (l : GameLanguage) => {
    switch (l) {
    case GameLanguage.DK: return "Dansk";
    case GameLanguage.GB: return "English";
    }
}

export interface GameIndex {
    //lang: GameLanguage;
    instances: number;
}

export interface GameInstance {
    anagrams: string[];
}
