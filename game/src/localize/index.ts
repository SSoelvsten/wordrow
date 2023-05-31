import { ReactNode } from 'react';
import dansk from './dansk';
import deutsch from './deutsch';
import english from './english';
import { Language } from './language';
import { Localization } from './localization';

const localizations: Record<Language, Localization> = {
  [Language.DK]: dansk,
  [Language.DE]: deutsch,
  [Language.EN]: english,
};

const localize = (language: Language, key: keyof Localization): ReactNode => {
  return localizations[language][key];
};

export default localize;
