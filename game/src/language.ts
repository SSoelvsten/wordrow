export enum Language {
    DK = "da-DK",
    GB = "en-GB",
}

export const languages: Language[] = [
    Language.GB,
    Language.DK
];

export const languageName = (l : Language) => {
    switch (l) {
    case Language.GB: return "British";
    case Language.DK: return "Dansk";
    }
}