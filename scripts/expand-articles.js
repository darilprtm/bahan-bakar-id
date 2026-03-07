const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/articles.json');
let existingArticles = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Kumpulan URL Foto Berkualitas Tinggi (Unsplash) untuk Otomotif
const photos = [
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1489824904114-8b6ad0bb0801?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1503376713816-17b5fb28a3bd?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800"
];

const titles = [
    "Cara Menghemat BBM Saat Terjebak Macet di Tol",
    "Mengenal Perbedaan Oli Mesin Sintetis dan Mineral",
    "Kapan Waktu Terbaik Memanaskan Mesin Mobil?",
    "Berapa Lama Umur Aki Kendaraan Anda yang Sebenarnya?",
    "Rahasia Eco Driving di Kondisi Jalan Menanjak Pegunungan",
    "Menghitung Kapasitas Tangki Cadangan (Resep) Bensin Indikator E",
    "Mitos Mencampur Bensin Oktan Tinggi dan Rendah",
    "Bahaya Membiarkan Tangki Bensin Nyaris Kosong",
    "Pentingnya Menjaga Tekanan Angin Ban Terhadap Konsumsi BBM",
    "Mengapa Konsumsi Bensin Mobil Matic Lebih Boros dari Manual?",
    "Gejala Filter Bensin Kotor yang Membuat Mesin Tersendat",
    "Apakah AC Mobil Sangat Menyedot Bahan Bakar?",
    "Cara Kerja Sistem Injeksi Bahan Bakar Elektronik (EFI)",
    "Mesin Diesel vs Bensin: Mana yang Lebih Irit Jarak Jauh?",
    "Tanda-tanda Injektor Mesin Anda Perlu Dikalibrasi Ulang",
    "Efek Buruk Sering Menginjak Setengah Kopling",
    "Mengenal Fungsi ECU Terhadap Pengaturan Konsumsi BBM",
    "Benarkah Membuka Kaca Jendela Lebih Boros daripada Pakai AC?",
    "Strategi Mengemudi Hemat di Musim Hujan",
    "Kaitan Antara Muatan Kendaraan dan Penurunan Jarak Tempuh",
    "Mengenal Peran Busi Iridium untuk Pembakaran Sempurna",
    "Apa Itu Rasio Kompresi Mesin dan Mengapa Penting?",
    "Cara Membersihkan Ruang Bakar Tanpa Bongkar Mesin",
    "Mendeteksi Kebocoran Saluran Bensin Secara Dini",
    "Apakah Mengganti Knalpot Racing Bikin Boros?",
    "Pengaruh Velg Lebar (Modifikasi) Terhadap Tarikan Mesin",
    "Mengenal Sistem Pengereman ABS dan Efeknya pada Deselerasi",
    "Kapan Sebaiknya Anda Mengganti Filter Udara?",
    "Mitos Mengisi Bensin di Malam Hari Dapat Lebih Banyak",
    "Penyebab Asap Knalpot Mobil Berwarna Hitam Pekat",
    "Membedah Teknologi VVT-i dan VTEC dalam Menghemat BBM",
    "Pengaruh Kekentalan Oli (Viskositas) Terhadap Gesekan Mesin",
    "Pentingnya Melakukan Spooring dan Balancing Berkala",
    "Berapa Biaya Ideal Perawatan Mobil Tahunan?",
    "Tips Membeli Kendaraan Bekas Berkualitas dari Segi Mesin",
    "Mengenal Istilah 'Overheat' dan Cara Pertolongan Pertamanya",
    "Mengapa Mobil Tua Cenderung Lebin Rakus Bensin?",
    "Peran Penting Radiator Coolant Dibandingkan Air Biasa",
    "Cara Aman Melakukan Jump Start (Jumper) Aki Mobil",
    "Tanda Kampas Rem Mulai Menipis dan Harus Diganti",
    "Apakah Coating Cat Mobil Mengurangi Hambatan Angin?",
    "Memahami Indikator Check Engine yang Tiba-tiba Menyala",
    "Keunggulan Transmisi CVT dalam Mengejar Efisiensi",
    "Bahaya Menerjang Banjir Terhadap Komponen Elektrikal",
    "Panduan Lengkap Merawat Mobil yang Jarang Dipakai"
];

const categories = ["Panduan Berkendara", "Edukasi Teknis Mesin", "Perawatan Kendaraan", "Teknologi Kendaraan", "Berita Otomotif"];

const makeSlug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

const randomInt = (max) => Math.floor(Math.random() * max);

const generateParagraphs = (title) => {
    return `Artikel mendalam mengenai ${title} sangat krusial bagi para pemilik kendaraan di era mobilitas modern ini. Banyak dari kita yang hanya tahu cara mengemudikan kendaraan, namun abai terhadap fundamental mekanis yang menopang efisiensi operasional harian. Pemahaman yang komprehensif tidak hanya akan menyelamatkan isi dompet Anda dari tagihan BBM yang membengkak, melainkan juga menjaga keawetan komponen vital dari aus prematur akibat gaya berkendara yang salah kaprah.\n\nDalam observasi teknis dan pantauan jurnal otomotif terakreditasi, problem terkait ${title} menempati urutan teratas dalam keluhan publik. Solusi praktisnya seringkali terletak pada kalibrasi kebiasaan mikro, seperti kedisiplinan jadwal servis berkala, pengamatan tajam terhadap indikator dasbor, hingga manuver kaki yang lebih beradab pada tuas pedal. Mengesampingkan detail-detail sepele ini adalah tiket tercepat menuju kerusakan parah yang memaksa turun mesin atau penggantian peranti mahal di bengkel resmi.\n\nOleh karenanya, menginternalisasi prinsip-prinsip ini harus menjadi insting bagi setiap supir. Membekali diri dengan mitigasi serta penanganan cerdas akan meredam kepanikan saat terjadi anomali di tengah jalan raya. Edukasi teknis semacam ini merupakan fondasi keandalan dan kenyamanan lalu lintas. Selalu rujuk manual buku pabrikan Anda sebagai kitab utama, dan pertajam empati terhadap respons getaran serta raungan mesin kendaraan Anda.`;
};

const newArticles = titles.map((title, idx) => {
    const cat = categories[randomInt(categories.length)];
    const day = (idx % 28) + 1;
    const dateStr = `2026-03-${day.toString().padStart(2, '0')}`;

    return {
        id: `generated-${idx + 10}`,
        title: title,
        slug: makeSlug(title),
        category: cat,
        date: dateStr,
        imageUrl: photos[idx % photos.length],
        excerpt: `Membahas tuntas tentang ${title} beserta implikasi teknis dan dampaknya terhadap dompet serta nyawa mesin kendaraan. Simak tips pamungkas dari jajaran redaksi BahanBakar.id.`,
        content: generateParagraphs(title)
    };
});

// Avoid duplicates if script run multiple times
const existingSlugs = new Set(existingArticles.map(a => a.slug));
const filteredNewArticles = newArticles.filter(a => !existingSlugs.has(a.slug));

existingArticles = [...existingArticles, ...filteredNewArticles];

// Sort by date descending
existingArticles.sort((a, b) => new Date(b.date) - new Date(a.date));

fs.writeFileSync(filePath, JSON.stringify(existingArticles, null, 2));

console.log('Berhasil menginjeksi', filteredNewArticles.length, 'artikel baru. Total Artikel Sekarang:', existingArticles.length);
