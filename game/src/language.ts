export enum Language {
    DK = "da-DK",
    EN = "en-US",
}

export const languages: Language[] = [
    Language.EN,
    Language.DK
];

export const languageName = (l : Language) => {
    switch (l) {
    case Language.EN: return "English";
    case Language.DK: return "Dansk";
    }
}
