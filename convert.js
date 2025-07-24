const XLSX = require('xlsx');
const fs = require('fs');

const workbook = XLSX.readFile('data.xlsx');

// Функція для читання листа і повернення масиву об'єктів {ID, Key, Text}
function readSheet(sheetName) {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    console.error(`Лист ${sheetName} не знайдено!`);
    return [];
  }
  return XLSX.utils.sheet_to_json(sheet);
}

// Зчитуємо всі листи
const professionsUA = readSheet('Professions_UA');
const professionsEN = readSheet('Professions_EN');
const professionsSK = readSheet('Professions_SK');
const modifiersUA = readSheet('Modifiers_UA');
const modifiersEN = readSheet('Modifiers_EN');
const modifiersSK = readSheet('Modifiers_SK');

// Допоміжна функція для створення об'єкту {key: {ua, en, ru}}
function mergeEntries(arrUA, arrEN, arrSK) {
  const result = {};
  
  // Визначаємо унікальні ключі (Key)
  const keys = new Set([
    ...arrUA.map(e => e.Key),
    ...arrEN.map(e => e.Key),
    ...arrSK.map(e => e.Key)
  ]);

  keys.forEach(key => {
    const ua = arrUA.find(e => e.Key === key);
    const en = arrEN.find(e => e.Key === key);
    const sk = arrSK.find(e => e.Key === key);

    result[key] = {
      ua: ua ? ua.Text : null,
      en: en ? en.Text : null,
      sk: sk ? sk.Text : null,
    };
  });

  return result;
}

const professions = mergeEntries(professionsUA, professionsEN, professionsSK);
const modifiers = mergeEntries(modifiersUA, modifiersEN, modifiersSK);

const output = {
  professions,
  modifiers,
};

const outputJS = `window.professions = ${JSON.stringify(professions, null, 2)};
                  window.modifiers = ${JSON.stringify(modifiers, null, 2)};`;

fs.writeFileSync('data.js', outputJS, 'utf-8');

console.log('Файл data.js згенеровано!');
