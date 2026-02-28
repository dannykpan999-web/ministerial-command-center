const fs = require('fs');
const path = require('path');

const pdfPath = '/var/www/ministerial-command-center/backend/uploads/documents/cmm20h4n6002j116zivygqqcq/1772022559865-puoxh8.pdf';
const pdfBuffer = fs.readFileSync(pdfPath);
const fileSize = pdfBuffer.length;

console.log('=== OCR PIPELINE TEST FOR SPECIAL PDF ===');
console.log('File:', path.basename(pdfPath));
console.log('Size:', fileSize, 'bytes');

let pdfParseMod;
try {
  pdfParseMod = require('/var/www/ministerial-command-center/backend/node_modules/pdf-parse');
  console.log('pdf-parse loaded OK. Has PDFParse class:', !!pdfParseMod.PDFParse);
} catch(e) {
  console.log('ERROR loading pdf-parse:', e.message);
  process.exit(1);
}

async function run() {
  try {
    let rawText = '';
    const PDFParse = pdfParseMod.PDFParse || pdfParseMod;

    if (typeof PDFParse === 'function' && PDFParse.prototype && PDFParse.prototype.getText) {
      // Class-based API (pdf-parse v2)
      const parser = new PDFParse({ data: pdfBuffer });
      const result = await parser.getText();
      rawText = result.text || '';
      await parser.destroy();
      console.log('Used: class-based API (PDFParse)');
    } else {
      // Function-based API (pdf-parse v1)
      const result = await PDFParse(pdfBuffer);
      rawText = result.text || '';
      console.log('Used: function-based API');
    }

    console.log('\n--- STEP 1: pdf-parse result ---');
    console.log('Raw text length:', rawText.length);
    console.log('Raw text (visible):', JSON.stringify(rawText.substring(0, 200)));

    // isPageSeparatorOnly check (same as OcrService)
    const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const pagePattern = /^-{1,3}\s*\d+\s*(of|de)\s*\d+\s*-{1,3}$/;
    const isPageOnly = lines.length === 0 || lines.every(line => pagePattern.test(line));
    console.log('\n--- STEP 2: isPageSeparatorOnly check ---');
    console.log('Non-empty lines:', lines.length);
    console.log('Lines:', JSON.stringify(lines));
    console.log('isPageSeparatorOnly result:', isPageOnly);

    // cleanExtractedText + density check (same as updated OcrService)
    let cleaned = rawText.replace(/\f/g, '\n');
    cleaned = cleaned.replace(/^-{1,3}\s*\d+\s*(of|de)\s*\d+\s*-{1,3}\s*$/mg, ''); // NEW strip
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim();
    const density = cleaned.length / fileSize;
    const likelyScanned = fileSize > 30000 && density < 0.008;

    console.log('\n--- STEP 3: After page-marker stripping ---');
    console.log('Cleaned text length:', cleaned.length, 'chars');
    console.log('Text density:', (density * 100).toFixed(4) + '%');
    console.log('likelyScanned (density < 0.8%):', likelyScanned);

    console.log('\n--- FINAL DECISION ---');
    if (isPageOnly) {
      console.log('PATH: isPageSeparatorOnly=TRUE -> OpenAI Vision (scanned PDF) ✓');
    } else if (likelyScanned) {
      console.log('PATH: isPageSeparatorOnly=FALSE but density too low -> OpenAI Vision (scanned PDF) ✓');
    } else if (cleaned.length > 10) {
      console.log('PATH: Using pdf-parse text directly. Content:', cleaned.substring(0, 200));
    } else {
      console.log('PATH: Cleaned text too short (<10 chars) -> OpenAI Vision fallback');
    }

  } catch(e) {
    console.log('ERROR:', e.message);
    console.log(e.stack);
  }
}
run();
