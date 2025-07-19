const Tesseract = require('tesseract.js');

const extractTextFromImage = async (imagePath) => {
  try {
    const result = await Tesseract.recognize(imagePath, 'eng', {
      logger: m => console.log(m),
    });

    return result.data.text;
  } catch (err) {
    console.error('OCR Error:', err);
    return '';
  }
};

// Common date formats: 01/01/2024, 01-2024, Jan 2024, etc.
const datePatterns = [
  /\b\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\b/,     // 01/01/2024 or 01-01-24
  /\b\d{1,2}[\/\-\.]\d{4}\b/,                     // 01/2024
  /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s\-\.]?\d{4}\b/i, // Jan 2024
];

const findDateNearKeyword = (text, keywords) => {
  const lines = text.split('\n');
  let matched = {};

  for (let line of lines) {
    const lowerLine = line.toLowerCase();
    for (let keyword of keywords) {
      if (lowerLine.includes(keyword.toLowerCase())) {
        for (let pattern of datePatterns) {
          const match = line.match(pattern);
          if (match) {
            matched[keyword] = match[0];
          }
        }
      }
    }
  }

  return matched;
};

const extractDatesSmartly = (text) => {
  const manufactureKeywords = ['mfg', 'manufactured', 'packed on'];
  const expiryKeywords = ['exp', 'expiry', 'best before', 'use by', 'expires'];

  const foundMFG = findDateNearKeyword(text, manufactureKeywords);
  const foundEXP = findDateNearKeyword(text, expiryKeywords);

  // Choose first match, or null if not found
  const manufactureDate = Object.values(foundMFG)[0] || null;
  const expiryDate = Object.values(foundEXP)[0] || null;

  return {
    manufactureDate,
    expiryDate,
  };
};

module.exports = {
  extractTextFromImage,
  extractDatesSmartly,
};
