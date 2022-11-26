export enum GameLanguage {
    GB = "en-GB",
    DK = "da-DK",
}

export interface GameIndex {
    //lang: GameLanguage;
    instances: number;
}

export interface GameInstance {
    anagrams: string[];
}
