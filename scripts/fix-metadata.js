const fs = require('fs');
const path = require('path');

const articlesPath = path.join(__dirname, '../src/data/articles.json');
let articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));

const otomotifTags = [
    "Otomotif", "Tips Hemat", "Perawatan Mesin", "Mobil Manual", "Motor Matic",
    "Transmisi Matic", "Eco Driving", "Efisiensi KML", "BBM Subsidi", "Ban Karet",
    "Injektor", "Modifikasi Tipis", "Viskositas Oli", "Oktan Tinggi", "Keamanan Jalan Raya"
];

function getRandomTags(count) {
    const shuffled = otomotifTags.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Tambal properti yang bocor / tidak ada saat auto-generate
articles.forEach(article => {
    if (!article.author) {
        article.author = "Daril Pratomo";
    }

    if (!article.tags || article.tags.length === 0) {
        let freshTags = getRandomTags(Math.floor(Math.random() * 3) + 2); // 2 - 4 tag per artikel
        if (article.category) {
            freshTags.unshift(article.category); // sematkan kategori ke array tag sebagai prioritas
        }
        // Hapus redundansi tag jika ada
        article.tags = [...new Set(freshTags)];
    }
});

fs.writeFileSync(articlesPath, JSON.stringify(articles, null, 2));
console.log('Penyempurnaan 50 Metadata (Author & Tags) Selesai!');
