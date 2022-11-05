export enum GameLanguage {
    GB = "en_GB",
    DK = "da_DK",
}

export interface GameIndex {
    lang: GameLanguage;
    instances: number;
}

export interface GameInstance {
    anagrams: string[];
}
