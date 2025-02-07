import fs from 'fs';
import path from 'node:path';
import { DISCORD_SERVER } from '../config.ts';

const botLanguage: string = DISCORD_SERVER.botLanguage;

const translationsPath: string = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  'translations'
);

interface Translations {
  [key: string]: string | Translations;
}

const translationsCache: Record<string, Translations> = {
  es: {},
  en: {},
};

function loadTranslations(lang: string): Translations | null {
  try {
    if (Object.keys(translationsCache[lang] ?? {}).length > 0) {
      return translationsCache[lang];
    }

    const filePath: string = path.join(translationsPath, `${lang}.json`);
    if (!fs.existsSync(filePath)) {
      console.error(`Translation file for language '${lang}' not found.`);
      return null;
    }

    const translations: Translations = JSON.parse(
      fs.readFileSync(filePath, 'utf-8')
    );
    translationsCache[lang] = translations;
    return translations;
  } catch (error) {
    console.error(
      `Error loading translations for language '${lang}':`,
      (error as Error).message
    );
    return null;
  }
}

function getTranslationByKey(
  translations: Translations,
  key: string,
  lang: string
): string {
  const keys: string[] = key.split('.');
  let result: string | Translations = translations;

  for (const k of keys) {
    if (typeof result === 'object' && k in result) {
      result = result[k] as string | Translations;
    } else {
      return `Translation key '${key}' not found for language '${lang}'.`;
    }
  }

  return typeof result === 'string'
    ? result
    : `Invalid translation format for key '${key}' in language '${lang}'.`;
}

const interpolateText = (text: string, props: Record<string, string> = {}): string => {
  let result: string = text;

  Object.entries(props).forEach(([key, value]) => {
    result = result.replaceAll(`{{${key}}}`, value);
  });

  return result;
};

export function translateLanguage(key: string, params: Record<string, string> = {}): string {
  const translations = loadTranslations(botLanguage);
  if (!translations || !Object.values(translations).length) {
    return `Translations not available for language '${botLanguage}'.`;
  }

  const translation: string = getTranslationByKey(translations, key, botLanguage);
  return interpolateText(translation, params);
}
