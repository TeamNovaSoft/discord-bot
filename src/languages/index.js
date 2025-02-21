const fs = require('fs');
const path = require('path');
const { DISCORD_SERVER } = require('../config');

const botLanguage = DISCORD_SERVER?.botLanguage || 'en-US';
const translationsPath = path.join(__dirname, 'translations');
const translationsCache = {};

function loadTranslations(lang) {
  try {
    if (translationsCache[lang]) {
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

const interpolateText = (text, params = {}) => {
  let result = text;
  Object.entries(params).forEach(([key, value]) => {
    result = result.replaceAll(`{{${key}}}`, value);
  });
  return result;
};

function translateLanguage(key, params = {}, language = botLanguage) {
  const translations = loadTranslations(language);
  if (!translations) {
    return `Translations not available for language '${language}'.`;
  }
  const translation = getTranslationByKey(translations, key, language);
  return interpolateText(translation, params);
}

const translateCommand = (command) => {
  const locales = ['es-ES', 'en-US'];
  const result = {};

  for (const locale of locales) {
    const translations = loadTranslations(locale);
    result[locale] = translations
      ? getTranslationByKey(translations, command, locale)
      : `Missing translation for ${locale}`;
  }

  return result;
};

module.exports = { translateLanguage, translateCommand };
