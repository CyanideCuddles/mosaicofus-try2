const { Jimp } = require('jimp');
const fs = require('fs');
const path = require('path');

const inputPath = 'c:\\Users\\CyanideCuddles\\Downloads\\6231166122891874701.jpg';
const outputDir = 'c:\\Users\\CyanideCuddles\\Downloads\\Mosaic\\assets';
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}
const outputPath = path.join(outputDir, 'logo.png');

Jimp.read(inputPath).then(image => {
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    
    // Background color at (0,0)
    const r_bg = image.bitmap.data[0];
    const g_bg = image.bitmap.data[1];
    const b_bg = image.bitmap.data[2];
    console.log("Background Color detected at (0,0):", { r: r_bg, g: g_bg, b: b_bg });

    const threshold = 40; // distance in RGB space

    for (let idx = 0; idx < image.bitmap.data.length; idx += 4) {
        const r = image.bitmap.data[idx + 0];
        const g = image.bitmap.data[idx + 1];
        const b = image.bitmap.data[idx + 2];

        // Calculate Euclidean distance to bgRGB
        const dist = Math.sqrt(
            Math.pow(r - r_bg, 2) +
            Math.pow(g - g_bg, 2) +
            Math.pow(b - b_bg, 2)
        );

        if (dist < threshold) {
            // Set alpha to 0 (fully transparent)
            image.bitmap.data[idx + 3] = 0;
        }
    }

    // Save as PNG
    return image.write(outputPath);
}).then(() => {
    console.log("Processed logo saved to assets/logo.png");
}).catch(err => {
    console.error("Error processing logo:", err);
});
