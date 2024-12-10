const fs = require('fs');
const path = require('path');

const translationsPath = path.join(__dirname, 'translations');

function loadTranslations(lang) {
  try {
    const filePath = path.join(translationsPath, `${lang}.json`);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Translation file for language '${lang}' not found.`);
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

function translateLanguage(lang, key) {
  const translations = loadTranslations(lang);
  if (!translations) {
    return `Translation for language '${lang}' not available.`;
  }

  const keys = key.split('.');
  let result = translations;
  for (const k of keys) {
    if (result[k] !== undefined) {
      result = result[k];
    } else {
      return `Translation key '${key}' not found for language '${lang}'.`;
    }
  }
  return result;
}

module.exports = { translateLanguage };
