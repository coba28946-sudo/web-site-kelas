// ============================================================
// SITE_DATA — sumber data tunggal untuk semua halaman website
// (siswa, jadwal, piket, kas, galeri). Diedit lewat admin.html.
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
      "nama": "Aldio Adstya Ashari ",
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
      "nama": "Gloria Queenza",
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
        "jam": "07.00 - 07.15",
        "mapel": "Upacara / Literasi Pagi",
        "istirahat": false
      },
      {
        "jam": "07.15 - 08.45",
        "mapel": "Matematika",
        "istirahat": false
      },
      {
        "jam": "08.45 - 10.15",
        "mapel": "Jaringan Dasar",
        "istirahat": false
      },
      {
        "jam": "10.15 - 10.30",
        "mapel": "Istirahat",
        "istirahat": true
      },
      {
        "jam": "10.30 - 12.00",
        "mapel": "Bahasa Indonesia",
        "istirahat": false
      },
      {
        "jam": "12.00 - 12.30",
        "mapel": "Istirahat & Sholat",
        "istirahat": true
      },
      {
        "jam": "12.30 - 14.00",
        "mapel": "Pemrograman Dasar",
        "istirahat": false
      }
    ],
    "selasa": [
      {
        "jam": "07.00 - 08.30",
        "mapel": "Bahasa Inggris",
        "istirahat": false
      },
      {
        "jam": "08.30 - 10.00",
        "mapel": "Administrasi Infrastruktur Jaringan",
        "istirahat": false
      },
      {
        "jam": "10.00 - 10.15",
        "mapel": "Istirahat",
        "istirahat": true
      },
      {
        "jam": "10.15 - 11.45",
        "mapel": "Teknologi Jaringan Kabel & Nirkabel",
        "istirahat": false
      },
      {
        "jam": "11.45 - 12.30",
        "mapel": "Istirahat & Sholat",
        "istirahat": true
      },
      {
        "jam": "12.30 - 14.00",
        "mapel": "PJOK",
        "istirahat": false
      }
    ],
    "rabu": [
      {
        "jam": "07.00 - 08.30",
        "mapel": "Pendidikan Pancasila",
        "istirahat": false
      },
      {
        "jam": "08.30 - 10.00",
        "mapel": "Komputer dan Jaringan Dasar",
        "istirahat": false
      },
      {
        "jam": "10.00 - 10.15",
        "mapel": "Istirahat",
        "istirahat": true
      },
      {
        "jam": "10.15 - 11.45",
        "mapel": "Sistem Keamanan Jaringan",
        "istirahat": false
      },
      {
        "jam": "11.45 - 12.30",
        "mapel": "Istirahat & Sholat",
        "istirahat": true
      },
      {
        "jam": "12.30 - 14.00",
        "mapel": "Seni Budaya",
        "istirahat": false
      }
    ],
    "kamis": [
      {
        "jam": "07.00 - 08.30",
        "mapel": "IPAS",
        "istirahat": false
      },
      {
        "jam": "08.30 - 10.00",
        "mapel": "Teknologi Layanan Jaringan",
        "istirahat": false
      },
      {
        "jam": "10.00 - 10.15",
        "mapel": "Istirahat",
        "istirahat": true
      },
      {
        "jam": "10.15 - 11.45",
        "mapel": "Praktik Perakitan Komputer",
        "istirahat": false
      },
      {
        "jam": "11.45 - 12.30",
        "mapel": "Istirahat & Sholat",
        "istirahat": true
      },
      {
        "jam": "12.30 - 14.00",
        "mapel": "Proyek Kreatif & Kewirausahaan",
        "istirahat": false
      }
    ],
    "jumat": [
      {
        "jam": "07.00 - 07.30",
        "mapel": "Senam Pagi / Kerohanian",
        "istirahat": false
      },
      {
        "jam": "07.30 - 09.00",
        "mapel": "Bimbingan Konseling",
        "istirahat": false
      },
      {
        "jam": "09.00 - 09.15",
        "mapel": "Istirahat",
        "istirahat": true
      },
      {
        "jam": "09.15 - 10.45",
        "mapel": "Simulasi & Troubleshooting Jaringan",
        "istirahat": false
      },
      {
        "jam": "10.45 - 11.30",
        "mapel": "Sholat Jumat & Istirahat",
        "istirahat": true
      }
    ]
  },
  "piket": {
    "senin": {
      "kelompok": "Kelompok 1",
      "anggota": [
        "Nama Siswa 1",
        "Nama Siswa 2",
        "Nama Siswa 3",
        "Nama Siswa 4",
        "Nama Siswa 5",
        "Nama Siswa 6"
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
        "Nama Siswa 7",
        "Nama Siswa 8",
        "Nama Siswa 9",
        "Nama Siswa 10",
        "Nama Siswa 11",
        "Nama Siswa 12"
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
        "Nama Siswa 13",
        "Nama Siswa 14",
        "Nama Siswa 15",
        "Nama Siswa 16",
        "Nama Siswa 17",
        "Nama Siswa 18"
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
        "Nama Siswa 19",
        "Nama Siswa 20",
        "Nama Siswa 21",
        "Nama Siswa 22",
        "Nama Siswa 23",
        "Nama Siswa 24"
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
        "Nama Siswa 25",
        "Nama Siswa 26",
        "Nama Siswa 27",
        "Nama Siswa 28",
        "Nama Siswa 29",
        "Nama Siswa 30"
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
