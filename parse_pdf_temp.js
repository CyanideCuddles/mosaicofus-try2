const fs = require('fs');
const { PDFParse } = require('pdf-parse');

const dataBuffer = fs.readFileSync('c:\\Users\\CyanideCuddles\\Downloads\\TEAM 2026.pdf');
const parser = new PDFParse({ data: dataBuffer });

parser.getText().then(function(result) {
    fs.writeFileSync('c:\\Users\\CyanideCuddles\\Downloads\\Mosaic\\team_pdf_text.txt', result.text || result);
    console.log("PDF text extracted successfully. Result keys:", Object.keys(result));
}).catch(err => {
    console.error("Error parsing PDF:", err);
});
