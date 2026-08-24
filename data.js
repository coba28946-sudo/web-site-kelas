// ============================================================
// SITE_DATA — sumber data tunggal untuk semua halaman website
// (siswa, jadwal, piket, kas). Diedit lewat admin.html.
// Ganti file js/data.js di repo dengan file ini, lalu commit & push.
// ============================================================
const SITE_DATA = {
  "siswa": [
    {
      "nama": "Adli Alvanno",
      "absen": "01",
      "jk": "Laki-laki"
    },
    {
      "nama": "Akbar Seto Nugroho",
      "absen": "02",
      "jk": "Laki-laki"
    },
    {
      "nama": "Aldio Adstya",
      "absen": "03",
      "jk": "Laki-laki"
    },
    {
      "nama": "Alfredo Elanda",
      "absen": "04",
      "jk": "Laki-laki"
    },
    {
      "nama": "Andika Candra",
      "absen": "05",
      "jk": "Laki-laki"
    },
    {
      "nama": "Ayu Selvina",
      "absen": "06",
      "jk": "Perempuan"
    },
    {
      "nama": "Christian Marvel Kusendi NG",
      "absen": "07",
      "jk": "Laki-laki"
    },
    {
      "nama": "Dhanny Enzo",
      "absen": "08",
      "jk": "Laki-laki"
    },
    {
      "nama": "Esi Erlianti",
      "absen": "09",
      "jk": "Perempuan"
    },
    {
      "nama": "Evan Argo Emanuel Hutapea",
      "absen": "10",
      "jk": "Laki-laki"
    },
    {
      "nama": "Fabiano Durta",
      "absen": "11",
      "jk": "Laki-laki"
    },
    {
      "nama": "Fadhil Raghatan",
      "absen": "12",
      "jk": "Laki-laki"
    },
    {
      "nama": "Fatih Annafis",
      "absen": "13",
      "jk": "Laki-laki"
    },
    {
      "nama": "Fauzi Pawawo",
      "absen": "14",
      "jk": "Laki-laki"
    },
    {
      "nama": "Fina Nailatul Izza",
      "absen": "15",
      "jk": "Perempuan"
    },
    {
      "nama": "Gloria Queenza ",
      "absen": "16",
      "jk": "Perempuan"
    },
    {
      "nama": "Hans Juandi",
      "absen": "17",
      "jk": "Laki-laki"
    },
    {
      "nama": "Ilmy Ivanda Jurnalis",
      "absen": "18",
      "jk": "Laki-laki"
    },
    {
      "nama": "Khalid Khairi",
      "absen": "19",
      "jk": "Laki-laki"
    },
    {
      "nama": "Kevin Saputra Rahelbi",
      "absen": "20",
      "jk": "Laki-laki"
    },
    {
      "nama": "Kezia Aurora",
      "absen": "21",
      "jk": "Perempuan"
    },
    {
      "nama": "Laits Al Fahmi",
      "absen": "22",
      "jk": "Laki-laki"
    },
    {
      "nama": "Marvell",
      "absen": "23",
      "jk": "Laki-laki"
    },
    {
      "nama": "Melvin Marvelano Alvis",
      "absen": "24",
      "jk": "Laki-laki"
    },
    {
      "nama": "Muhammad Baharudin",
      "absen": "25",
      "jk": "Laki-laki"
    },
    {
      "nama": "Muhammad Hafizhush Sholah",
      "absen": "26",
      "jk": "Laki-laki"
    },
    {
      "nama": "Muhammad Rafa Al Fardan",
      "absen": "27",
      "jk": "Laki-laki"
    },
    {
      "nama": "Nazuwa Aulia Putri",
      "absen": "28",
      "jk": "Perempuan"
    },
    {
      "nama": "Rayhan Rizky TD",
      "absen": "29",
      "jk": "Laki-laki"
    },
    {
      "nama": "Rezi",
      "absen": "30",
      "jk": "Laki-laki"
    },
    {
      "nama": "Ryan Aldiano",
      "absen": "31",
      "jk": "Laki-laki"
    },
    {
      "nama": "Shafiq Farres Mufid",
      "absen": "32",
      "jk": "Laki-laki"
    },
    {
      "nama": "Syafiq Arkansyah",
      "absen": "33",
      "jk": "Laki-laki"
    },
    {
      "nama": "Velick Andreas",
      "absen": "34",
      "jk": "Laki-laki"
    },
    {
      "nama": "Yonanda Ariansah",
      "absen": "35",
      "jk": "Laki-laki"
    },
    {
      "nama": "Zivana Letisya Az-Zahwa",
      "absen": "36",
      "jk": "Perempuan"
    }
  ],
  "jadwal": {
    "senin": [
      {
        "jam": "07.00 - 07.45",
        "mapel": "Upacara / Literasi Pagi",
        "istirahat": false
      },
      {
        "jam": "07:45 - 08:25",
        "mapel": "Dasar-dasar Program Keahlian TKJ",
        "istirahat": false
      },
      {
        "jam": "08:25 - 09:05",
        "mapel": "Dasar-dasar Program Keahlian TKJ",
        "istirahat": false
      },
      {
        "jam": "09:05 - 09:45",
        "mapel": "Dasar-dasar Program Keahlian TKJ",
        "istirahat": true
      },
      {
        "jam": "09:45 - 10:00",
        "mapel": "Istirahat 1",
        "istirahat": false
      },
      {
        "jam": "10:00 -10:40",
        "mapel": "Bahasa Inggris",
        "istirahat": true
      },
      {
        "jam": "10:40 - 11:20",
        "mapel": "Bahasa Inggris",
        "istirahat": false
      },
      {
        "jam": "11:20 - 12:00",
        "mapel": "Bimbingan Konseling",
        "istirahat": false
      },
      {
        "jam": "12:00 - 13:00",
        "mapel": "Ishoma",
        "istirahat": false
      },
      {
        "jam": "13:00 - 13:40",
        "mapel": "Matematika",
        "istirahat": false
      },
      {
        "jam": "13:40 - 14:20",
        "mapel": "Matematika",
        "istirahat": false
      },
      {
        "jam": "14:20 - 15:00",
        "mapel": "Informatika",
        "istirahat": false
      },
      {
        "jam": "15:00 - 15:40",
        "mapel": "Informatika",
        "istirahat": false
      }
    ],
    "selasa": [
      {
        "jam": "(07:00-07:15)",
        "mapel": "Pagi beriman",
        "istirahat": false
      },
      {
        "jam": "07:15 - 07:45",
        "mapel": "Pendidikan Jasmani, Olahraga dan Kesehatan",
        "istirahat": false
      },
      {
        "jam": "07:45 - 08:25",
        "mapel": "Pendidikan Jasmani, Olahraga dan Kesehatan",
        "istirahat": true
      },
      {
        "jam": "08:25 - 09:05",
        "mapel": "Pendidikan Jasmani, Olahraga dan Kesehatan",
        "istirahat": false
      },
      {
        "jam": "09:05 - 09:45",
        "mapel": "Pendidikan Agama Islam dan Budi Pekerti",
        "istirahat": true
      },
      {
        "jam": "09:05 - 09:45",
        "mapel": "Agama Konghucu",
        "istirahat": false
      },
      {
        "jam": "09:05 - 09:45",
        "mapel": "Agama Kristen",
        "istirahat": false
      },
      {
        "jam": "09:45 - 10:00",
        "mapel": "Istirahat",
        "istirahat": false
      },
      {
        "jam": "10:00 - 10:40",
        "mapel": "Pendidikan Agama Islam dan Budi Pekerti",
        "istirahat": false
      },
      {
        "jam": "10:00 - 10:40",
        "mapel": "Agama Konghucu",
        "istirahat": false
      },
      {
        "jam": "10:00 - 10:40",
        "mapel": "Agama Kristen",
        "istirahat": false
      },
      {
        "jam": "10:40 - 11:20",
        "mapel": "Pendidikan Agama Islam dan Budi Pekerti",
        "istirahat": false
      },
      {
        "jam": "10:40 - 11:20",
        "mapel": "Agama Konghucu",
        "istirahat": false
      },
      {
        "jam": "10:40 - 11:20",
        "mapel": "Agama Kristen",
        "istirahat": false
      },
      {
        "jam": "11:20 - 12:00 ",
        "mapel": "Pendidikan Pancasila dan Kewarganegaraan",
        "istirahat": false
      },
      {
        "jam": "12:00 - 13:00",
        "mapel": "Ishoma",
        "istirahat": false
      },
      {
        "jam": "13:00 - 13:40",
        "mapel": "Pendidikan Pancasila dan Kewarganegaraan",
        "istirahat": false
      },
      {
        "jam": "13:40 - 14:20",
        "mapel": "Dasar-dasar Program Keahlian TKJ",
        "istirahat": false
      },
      {
        "jam": "14:20 - 15:00",
        "mapel": "Dasar-dasar Program Keahlian TKJ",
        "istirahat": false
      },
      {
        "jam": "15:00 - 15:40",
        "mapel": "Dasar-dasar Program Keahlian TKJ",
        "istirahat": false
      }
    ],
    "rabu": [
      {
        "jam": "07:00 - 07:15",
        "mapel": "Pagi Beriman ",
        "istirahat": false
      },
      {
        "jam": "07:15 - 07:45",
        "mapel": "Projek Ilmu Pengetahuan Alam dan Sosial",
        "istirahat": false
      },
      {
        "jam": "07:45 - 08:25",
        "mapel": "Projek Ilmu Pengetahuan Alam dan Sosial",
        "istirahat": true
      },
      {
        "jam": "08:25 - 09:05",
        "mapel": "Projek Ilmu Pengetahuan Alam dan Sosial",
        "istirahat": false
      },
      {
        "jam": "09:05 - 09:45",
        "mapel": "Bahasa Inggris",
        "istirahat": true
      },
      {
        "jam": "09:45 - 10:00",
        "mapel": "Istirahat",
        "istirahat": false
      },
      {
        "jam": "10:00 - 10:40",
        "mapel": "Bahasa Inggris",
        "istirahat": false
      },
      {
        "jam": "10:40 - 11:20",
        "mapel": "Bahasa Indonesia",
        "istirahat": false
      },
      {
        "jam": "11:20 - 12:00",
        "mapel": "Bahasa Indonesia",
        "istirahat": false
      },
      {
        "jam": "12:00 - 13:00",
        "mapel": "Ishoma",
        "istirahat": false
      },
      {
        "jam": "13:00 - 13:40",
        "mapel": "Informatika",
        "istirahat": false
      },
      {
        "jam": "(13:40-14:20)",
        "mapel": "Informatika",
        "istirahat": false
      },
      {
        "jam": "(14:20-15:00)",
        "mapel": "Sejarah",
        "istirahat": false
      },
      {
        "jam": "15:00 - 15:30",
        "mapel": "Sejarah",
        "istirahat": false
      }
    ],
    "kamis": [
      {
        "jam": "07:00 - 07:15",
        "mapel": "Pagi Beriman ",
        "istirahat": false
      },
      {
        "jam": "07:15 - 07:45",
        "mapel": "Projek Ilmu Pengetahuan Alam dan Sosial",
        "istirahat": false
      },
      {
        "jam": "07:45 - 08:25",
        "mapel": "Projek Ilmu Pengetahuan Alam dan Sosial",
        "istirahat": true
      },
      {
        "jam": "08:25 - 09:05",
        "mapel": "Projek Ilmu Pengetahuan Alam dan Sosial",
        "istirahat": false
      },
      {
        "jam": "09:05 - 09:45",
        "mapel": "Seni Budaya",
        "istirahat": true
      },
      {
        "jam": "09:45 - 10:00",
        "mapel": "Istirahat",
        "istirahat": false
      },
      {
        "jam": "10:00 - 10:40",
        "mapel": "Seni Budaya",
        "istirahat": false
      },
      {
        "jam": "10:40 - 11:20",
        "mapel": "Dasar-dasar Program Keahlian TKJ",
        "istirahat": false
      },
      {
        "jam": "11:20 - 12:00",
        "mapel": "Dasar-dasar Program Keahlian TKJ",
        "istirahat": false
      },
      {
        "jam": "12:00 - 13:00",
        "mapel": "Ishoma",
        "istirahat": false
      },
      {
        "jam": "13:00 - 13:40",
        "mapel": "Dasar-dasar Program Keahlian TKJ",
        "istirahat": false
      },
      {
        "jam": "13:40 - 14:20",
        "mapel": "Matematika",
        "istirahat": false
      },
      {
        "jam": "14:20 - 15:00",
        "mapel": "Matematika",
        "istirahat": false
      }
    ],
    "jumat": [
      {
        "jam": "07:00 - 07:30",
        "mapel": "Kegiatan Pagi",
        "istirahat": false
      },
      {
        "jam": "07:30 - 08:10",
        "mapel": "Bahasa Indonesia",
        "istirahat": false
      },
      {
        "jam": "08:10 - 08:50",
        "mapel": "Bahasa Indonesia",
        "istirahat": true
      },
      {
        "jam": "08:50 - 09:05",
        "mapel": "Istirahat",
        "istirahat": false
      },
      {
        "jam": "09:05 - 09:45",
        "mapel": "Dasar-dasar Program Keahlian TKJ",
        "istirahat": true
      },
      {
        "jam": "09:45 - 10:25",
        "mapel": "Dasar-dasar Program Keahlian TKJ",
        "istirahat": false
      },
      {
        "jam": "10:25 - 11:05",
        "mapel": "Dasar-dasar Program Keahlian TKJ",
        "istirahat": false
      }
    ]
  },
  "piket": {
    "senin": {
      "kelompok": "Kelompok 1",
      "anggota": [
        "ADLI ALVANNO",
        "AKBAR SETO NUGROHO",
        "ALDIO ADISTYA ASHARI",
        "ALFREDO ELANDA",
        "ANDIKA CANDRA",
        "AYU SELVINA",
        "ESI ERLIANTI"
      ],
      "tugas": [
        "Menyapu dan mengepel lantai kelas",
        "Membuang sampah ke tempat pembuangan",
        "Merapikan meja, kursi, dan papan tulis"
      ]
    },
    "selasa": {
      "kelompok": "Kelompok 2",
      "anggota": [
        "CHRISTIAN MARVEL KUSNEDI NG",
        "DHANNY ENZO",
        "EVAN ARGO EMANUEL HUTAPEA",
        "FABIANO DURTA",
        "FADHIL RHAGATAN",
        "FAUZI PAWAWO",
        "FINA NAILATUL IZZA"
      ],
      "tugas": [
        "Menyapu dan mengepel lantai kelas",
        "Membuang sampah ke tempat pembuangan",
        "Menghapus dan membersihkan papan tulis"
      ]
    },
    "rabu": {
      "kelompok": "Kelompok 3",
      "anggota": [
        "FATIH ANNAFIS",
        "GLORIA QUEENZA TABALUYAN",
        "ILMY IVANDA JURNALIS",
        "KEVIN SAPUTRA RAHELBI",
        "KHALID KHAIRI",
        "LAITS AL FAHMI",
        "MELVIN MARVELANO ALVIS"
      ],
      "tugas": [
        "Menyapu dan mengepel lantai kelas",
        "Merapikan sudut baca dan rak buku",
        "Menyiram tanaman di depan kelas"
      ]
    },
    "kamis": {
      "kelompok": "Kelompok 4",
      "anggota": [
        "KEZIA AURORA",
        "MUHAMMAD BAHARUDIN",
        "MUHAMMAD HAFIZHUSH SHOLAH",
        "MUHAMMAD RAFA AL FARDAN",
        "REZI ANANDA PRASETYA",
        "RYAN ALDIANO",
        "MARVELL"
      ],
      "tugas": [
        "Menyapu dan mengepel lantai kelas",
        "Membuang sampah ke tempat pembuangan",
        "Merapikan alat kebersihan kelas"
      ]
    },
    "jumat": {
      "kelompok": "Kelompok 5",
      "anggota": [
        "HANS JUANDI",
        "NAZUWA AULIA PUTRI",
        "RAYHAN RIZKY TD",
        "SHAFIQ FARRES MUFID",
        "SYAFIQ ARKANSYAH",
        "VELICK ANDREAS",
        "YONANDA ARIYANSAH",
        "ZIVANA LETISYA AZ ZAHWA"
      ],
      "tugas": [
        "Membersihkan kelas menyeluruh sebelum akhir pekan",
        "Membuang sampah ke tempat pembuangan",
        "Mengunci jendela dan merapikan kelas"
      ]
    }
  },
  "galeri": [
    {
      "label": "Foto Kelas Bersama",
      "icon": "📷",
      "size": "wide-tall",
      "image": ""
    },
    {
      "label": "Praktik Jaringan",
      "icon": "🔧",
      "size": "normal",
      "image": ""
    },
    {
      "label": "Lab Komputer",
      "icon": "🖥️",
      "size": "normal",
      "image": ""
    },
    {
      "label": "Acara Kelas",
      "icon": "🎉",
      "size": "tall",
      "image": ""
    },
    {
      "label": "Instalasi Perangkat",
      "icon": "📡",
      "size": "normal",
      "image": ""
    },
    {
      "label": "Lomba & Prestasi",
      "icon": "🏆",
      "size": "wide",
      "image": ""
    },
    {
      "label": "Kegiatan Sosial",
      "icon": "🤝",
      "size": "normal",
      "image": ""
    },
    {
      "label": "Kegiatan Belajar",
      "icon": "📚",
      "size": "normal",
      "image": ""
    }
  ],
  "kas": {
    "transaksi": []
  }
};
