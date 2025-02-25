const fs = require('fs');
const path = require('path');
const { DISCORD_SERVER } = require('../config');

const botLanguage = DISCORD_SERVER?.botLanguage || 'en-US';
const translationsPath = path.join(__dirname, 'translations');
const translationsCache = {};

function loadAllTranslations() {
  try {
    const files = fs
      .readdirSync(translationsPath)
      .filter((file) => file.endsWith('.json'));
    const languages = [];

    files.forEach((file) => {
      const lang = file.replace('.json', '');
      const filePath = path.join(translationsPath, file);
      const translations = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      translationsCache[lang] = translations;
      languages.push(lang);
    });

    return languages;
  } catch (error) {
    console.error(`Error loading translations:`, error.message);
    return [];
  }
}

const locales = loadAllTranslations();

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
  const translations = translationsCache[language] || {};
  if (!Object.keys(translations).length) {
    return `Translations not available for language '${language}'.`;
  }
  const translation = getTranslationByKey(translations, key, language);
  return interpolateText(translation, params);
}

const keyTranslations = (command, params = {}) => {
  return locales.reduce((result, locale) => {
    result[locale] = translateLanguage(command, params, locale);
    return result;
  }, {});
};

module.exports = { translateLanguage, keyTranslations };
