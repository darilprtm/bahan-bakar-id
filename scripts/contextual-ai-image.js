const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/articles.json');
let articles = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Filter yang targetnya kita re-generate fotonya (yakni sisa artikel setelah pembersihan, di luar 24 artikel orisinil)
articles.forEach((article, index) => {
    if (article.id.startsWith('generated-')) {
        // Bangkitkan prompt khusus berbekal judul aslinya, ubah ke instruksi deskriptif bahasa Inggris
        let promptBase = article.title.replace(/[^a-zA-Z0-9 ]/g, " ");
        let finalPrompt = `cinematic photographic shot of ${promptBase}, modern automotive, 8k resolution, highly detailed, professional car magazine style`;

        // Tanamkan URL Image API AI Pollinations. Tiap URL memiliki seed dari id artikel agar stabil per-artikel.
        let seed = Math.floor(Math.random() * 999999);
        article.imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?width=800&height=600&nologo=true&seed=${seed}`;
    }
});

fs.writeFileSync(filePath, JSON.stringify(articles, null, 2));

console.log('Berhasil mengonversi seluruh url gambar artikel bentukan skrip dengan Mesin AI Generator (Penyesuaian Konteks Judul).');
