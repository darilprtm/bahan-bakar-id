const fs = require('fs');
const https = require('https');
const path = require('path');

const articlesPath = path.join(__dirname, '../src/data/articles.json');
let articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));

// Fungsi memvalidasi ketersediaan gambar via HTTP
async function checkImage(url) {
    if (!url) return false;

    // Jika gambar lokal, pastikan file wujud di direktori public
    if (url.startsWith('/images/')) {
        const localPath = path.join(__dirname, '../public', url);
        return fs.existsSync(localPath);
    }

    // Jika Unsplash URL, tembak permintaan HTTP GET tipis (HEAD)
    return new Promise((resolve) => {
        https.get(url, (res) => {
            // 200 = OK, 301/302 = Redirect
            if (res.statusCode >= 200 && res.statusCode < 400) {
                resolve(true);
            } else {
                console.log(`404 Busted: ${url}`);
                resolve(false);
            }
        }).on('error', (e) => {
            console.log(`Error Network: ${url}`);
            resolve(false);
        });
    });
}

// Menjalankan penyisiran asinkron 
async function filterBrokenArticles() {
    console.log(`[Start] Mengecek ${articles.length} Artikel...`);
    const validArticles = [];

    for (let article of articles) {
        const isImageValid = await checkImage(article.imageUrl);
        if (isImageValid) {
            validArticles.push(article);
        } else {
            console.log(`[Dihapus] "${article.title}" karena fotonya kosong/rusak.`);
        }
    }

    fs.writeFileSync(articlesPath, JSON.stringify(validArticles, null, 2));
    console.log(`[Selesai] Tersisa ${validArticles.length} artikel yang terjamin 100% berpenampilan rapi dengan fotonya.`);
}

filterBrokenArticles();
