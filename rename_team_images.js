const fs = require('fs');
const path = require('path');

const srcDir = 'c:\\Users\\CyanideCuddles\\Downloads\\Mosaic\\team_images';
const destDir = 'c:\\Users\\CyanideCuddles\\Downloads\\Mosaic\\assets\\team';

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

const mapping = {
    'page_1_img_11.png': 'nandini_mehrotra.png',
    'page_3_img_24.png': 'mihika_singhania.png',
    'page_4_img_32.png': 'ahmad_hussain.png',
    'page_5_img_47.png': 'atreya_mishra.png',
    'page_6_img_59.png': 'eeshvi_sabharwal.png',
    'page_7_img_71.png': 'siddhika_agarwal.png',
    'page_8_img_83.png': 'tasmia_fatima.png',
    'page_8_img_84.png': 'arham_rizwan.png',
    'page_9_img_97.png': 'joshita_srivastava.png',
    'page_9_img_98.png': 'kriti_mehrotra.png',
    'page_11_img_121.png': 'darshika_mehrotra.png',
    'page_11_img_122.png': 'abubakr_siddiqi.png'
};

Object.entries(mapping).forEach(([srcFile, destFile]) => {
    const srcPath = path.join(srcDir, srcFile);
    const destPath = path.join(destDir, destFile);
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied: ${srcFile} -> ${destFile}`);
    } else {
        console.warn(`Source file not found: ${srcFile}`);
    }
});

console.log("Team images copy operation completed.");
