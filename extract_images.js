const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const dataBuffer = fs.readFileSync('c:\\Users\\CyanideCuddles\\Downloads\\TEAM 2026.pdf');
const parser = new PDFParse({ data: dataBuffer });

parser.getImage({ imageBuffer: true }).then(async (result) => {
    console.log("Total pages processed:", result.pages.length);
    let imgIndex = 0;
    
    // Create team_images directory if it doesn't exist
    const outputDir = 'c:\\Users\\CyanideCuddles\\Downloads\\Mosaic\\team_images';
    if (!fs.existsSync(outputDir)){
        fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const page of result.pages) {
        console.log(`Page ${page.pageNumber} has ${page.images.length} images.`);
        for (const img of page.images) {
            imgIndex++;
            const filename = `page_${page.pageNumber}_img_${imgIndex}.png`;
            const filepath = path.join(outputDir, filename);
            
            // img.data is a Uint8Array. Write it to file if it exists and has length
            if (img.data && img.data.length > 0) {
                fs.writeFileSync(filepath, Buffer.from(img.data));
                console.log(`Saved image ${imgIndex}: ${filename} (${img.width}x${img.height})`);
            } else if (img.dataUrl) {
                // Parse dataUrl
                const matches = img.dataUrl.match(/^data:image\/([a-zA-Z+]+);base64,(.+)$/);
                if (matches && matches.length === 3) {
                    const data = Buffer.from(matches[2], 'base64');
                    fs.writeFileSync(filepath, data);
                    console.log(`Saved image ${imgIndex} via dataUrl: ${filename} (${img.width}x${img.height})`);
                }
            } else {
                console.log(`Image ${imgIndex} on page ${page.pageNumber} has no data or dataUrl.`);
            }
        }
    }
}).catch(err => {
    console.error("Error extracting images:", err);
});
