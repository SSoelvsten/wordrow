export enum Language {
    DK = "da-DK",
    DE = "de-DE",
    EN = "en-US",
}

export const languages: Language[] = [
    Language.EN,
    Language.DE,
    Language.DK
];

export const languageName = (l : Language) => {
    switch (l) {
    case Language.DK: return "Dansk";
    case Language.DE: return "Deutsch";
    case Language.EN: return "English";
    }
}
