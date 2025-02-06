import fs from 'fs';
import path from 'node:path';
import { DISCORD_SERVER } from '../config.ts';

const botLanguage = DISCORD_SERVER.botLanguage;
const translationsPath = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  'translations'
);
const translationsCache = {
  es: {},
  en: {},
};

function loadTranslations(lang) {
  try {
    if (Object.keys(translationsCache[lang] ?? {}).length > 0) {
      return translationsCache[lang];
    }

    const filePath = path.join(translationsPath, `${lang}.json`);
    if (!fs.existsSync(filePath)) {
      console.error(`Translation file for language '${lang}' not found.`);
      return null;
    }

    const translations = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    translationsCache[lang] = translations;
    return translations;
  } catch (error) {
    console.error(
      `Error loading translations for language '${lang}':`,
      error.message
    );
    return null;
  }
}

function getTranslationByKey(translations, key, lang) {
  const keys = key.split('.');
  let result = translations;

  for (const k of keys) {
    if (result[k] !== undefined) {
      result = result[k];
    } else {
      return `Translation key '${key}' not found for language '${lang}'.`;
    }
  }

  return typeof result === 'string'
    ? result
    : `Invalid translation format for key '${key}' in language '${lang}'.`;
}

const interpolateText = (text, props = {}) => {
  let result = text;

  Object.entries(props).forEach(([key, value]) => {
    result = result.replaceAll(`{{${key}}}`, value);
  });

  return result;
};

export function translateLanguage(key, params = {}) {
  const translations = loadTranslations(botLanguage);
  if (!translations || !Object.values(translations).length) {
    return `Translations not available for language '${botLanguage}'.`;
  }

  const translation = getTranslationByKey(translations, key, botLanguage);
  return interpolateText(translation, params);
}
