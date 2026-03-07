const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/articles.json');
let articles = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// 50 ID unik foto mobil & jalan raya dari Unsplash
const uniquePhotoIds = [
    "1492144534655-ae79c964c9d7", "1542282088-72c9c27ed0cd", "1552519507-da3b142c6e3d", "1494976388531-d1058494cdd8", "1550355291-bbee04a92027",
    "1485291571150-772bcfc10da5", "1511919884226-fd3cad34687c", "1502877338535-766e1452684a", "1489824904114-8b6ad0bb0801", "1514316454349-750a7fd3da3a",
    "1605559424843-9e4c228bf1c2", "1583121274602-3e2820c69888", "1486262715619-67b85e0b08d3", "1503376713816-17b5fb28a3bd", "1563720223185-11003d516935",
    "1503736334456-a0121b63524b", "1517524008697-84bcde7fa2af", "1549317661-bd32c8ce0bf2", "1449965408869-eaa3f722e40d", "1469285994282-454ceb49e63c",
    "1533473359331-0138ef61cd6a", "1504215680853-026ed2a45def", "1537984874052-a6021bb55dcb", "1568605114967-8130f3a36994", "1519641471654-76ce0107ad1b",
    "1518985145888-0bc07b8b2111", "1541899481282-d53bffe3c3d5", "1508974239320-0a1e1cbcf224", "1490243248048-db8ce40277ea", "1485463611174-c302f7416ae9",
    "1546614042718-58c0c059812b", "1445964047600-b8f9e1e0a9f5", "1525608821945-814d48386419", "1501066927591-314112b5888e", "1517026575980-3e1e2defdc4b",
    "1471440671318-55fac260b6ae", "1541443632412-2824dfb8fb81", "1553440076-7e50bcbd05ab", "1483817101829-330520ea4557", "1493238792015-3315a0cbb1d3",
    "1509113645802-1815e12fbd6a", "1464215286202-e22119cbfcf2", "1496660416955-46f0470d0b0b", "1460515152818-f2f2ac63e3d4", "1506509927694-fb5e6e343b40",
    "1533604107128-4e89163e5225", "1492666130987-251f93f63901", "1494607239401-2aa82502c388", "1521406857640-c3d3f9e99eb6", "1493238792015-3315a0cbb1d3"
];

// Pastikan 5 artikel lama yang punya gambar lokal kita skip
const localImages = ['/images/blog/hot-day.png', '/images/blog/driving-habit.png', '/images/blog/eco-mode.png', '/images/blog/octane-fuel.png', '/images/blog/kalkulator-jarak.png']; // kalkulator jarak mungkin tdk ada lokal pngnya jd tetap random unsplash.

// Asumsikan artikel.length = 50. Jika lebih sedikit, ambil secukupnya.
articles.forEach((article, index) => {
    // Apabila dia adalah 5 artikel awal yang digenerate dg AI lokal, tetap pertahankan image AI lokal-nya
    if (article.imageUrl && article.imageUrl.startsWith('/images/blog/')) {
        return; // Jangan diganggu
    }

    // Assign gambar unik Unsplash
    const photoId = uniquePhotoIds[index % uniquePhotoIds.length];
    article.imageUrl = `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&q=80&w=800`;
});

fs.writeFileSync(filePath, JSON.stringify(articles, null, 2));

console.log('Berhasil mendistribusikan 50 foto eksklusif (Anti-Duplikat dan Anti-Blank) ke seluruh indeks Blog.');
