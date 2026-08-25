# Panduan Setup — Google Sheets buat 5 Admin

Ikuti urutan ini sekali aja di awal. Setelah selesai, ke-5 admin tinggal buka
`admin.html` dari komputer masing-masing dan datanya otomatis sinkron.

---

## 1. Bikin Google Sheet

1. Buka [sheets.google.com](https://sheets.google.com) → **Blank spreadsheet**.
2. Kasih nama misalnya **"Data Website X TJKT 1"**.
3. Buat 4 tab (klik `+` di pojok kiri bawah), kasih nama **persis** seperti ini
   (huruf besar/kecil harus sama):
   - `Siswa`
   - `Jadwal`
   - `Piket`
   - `Kas`
4. Isi baris pertama (header) tiap tab seperti ini:

   **Tab `Siswa`**
   | No | Nama | Absen | JK |
   |----|------|-------|----|
   | 1  | Nama Siswa 1 | 01 | Laki-laki |

   **Tab `Jadwal`**
   | Hari | Jam | Mapel | Istirahat |
   |------|-----|-------|-----------|
   | Senin | 07.00 - 07.15 | Upacara / Literasi Pagi | FALSE |

   **Tab `Piket`**
   | Hari | Kelompok | Anggota (pisah koma) | Tugas (pisah koma) |
   |------|----------|----------------------|---------------------|
   | Senin | Kelompok 1 | Nama Siswa 1, Nama Siswa 2 | Menyapu kelas, Buang sampah |

   **Tab `Kas`**
   | Tanggal | Keterangan | Tipe | Jumlah |
   |---------|------------|------|--------|
   | 01 Agu 2026 | Iuran kas minggu 1 | masuk | 180000 |

   **Tab `Galeri`** *(boleh dikosongkan dulu — otomatis terisi & terbuat sendiri saat pertama kali upload foto lewat admin.html)*
   | URL | Caption |
   |-----|---------|

   *(Baris contoh boleh dihapus setelah nanti diisi otomatis lewat admin.html — atau isi manual juga boleh, sheet-nya dibaca apa adanya.)*

5. Ambil **ID Sheet**-nya dari URL browser. Formatnya:
   ```
   https://docs.google.com/spreadsheets/d/INI_ID_SHEET_NYA/edit
   ```
   Copy bagian `INI_ID_SHEET_NYA`.

---

## 1.5. Bikin folder Google Drive buat foto Galeri

1. Buka [drive.google.com](https://drive.google.com) → **New → New folder**.
2. Kasih nama misalnya **"Foto Website X TJKT 1"**.
3. Masuk ke folder itu, ambil **ID Folder**-nya dari URL browser. Formatnya:
   ```
   https://drive.google.com/drive/folders/INI_ID_FOLDER_NYA
   ```
   Copy bagian `INI_ID_FOLDER_NYA`.

*(Folder ini nanti otomatis diisi Apps Script tiap kali admin upload foto lewat admin.html — gak perlu diapa-apain lagi setelah dibuat.)*

---

## 2. Pasang Apps Script

1. Di Google Sheet yang sama, klik menu **Extensions → Apps Script**.
2. Hapus semua kode default yang ada di editor.
3. Buka file **`AppsScript-Code.gs`** (saya sediakan terpisah), copy semua isinya,
   tempel ke editor Apps Script.
4. Cari baris ini di paling atas:
   ```js
   const SHEET_ID = 'TEMPEL_ID_SHEET_DI_SINI';
   const DRIVE_FOLDER_ID = 'TEMPEL_ID_FOLDER_DRIVE_DI_SINI';
   ```
   Ganti keduanya dengan ID sheet (langkah 1.5) dan ID folder Drive (langkah 1.5 khusus Drive) tadi.
5. Klik ikon 💾 **Save** (atau Ctrl+S).

---

## 3. Deploy sebagai Web App

1. Di Apps Script, klik **Deploy → New deployment**.
2. Klik ikon ⚙️ di sebelah "Select type" → pilih **Web app**.
3. Isi:
   - **Description**: bebas, misal "API Website TJKT 1"
   - **Execute as**: **Me (email kamu)**
   - **Who has access**: **Anyone**
4. Klik **Deploy**.
5. Google akan minta izin akses (**Authorize access**) — pilih akun Google kamu,
   klik **Advanced** → **Go to (nama project) (unsafe)** → **Allow**.
   *(Ini normal, karena scriptnya belum "diverifikasi Google" — wajar untuk script pribadi begini.
   Izin yang diminta mencakup akses ke Sheets DAN Drive, karena dipakai juga buat nyimpen foto galeri.)*
6. Setelah deploy selesai, copy **Web app URL** yang muncul. Formatnya:
   ```
   https://script.google.com/macros/s/AKfycb................/exec
   ```

⚠️ **Simpan URL ini baik-baik** — ini "alamat API" website kamu.

---

## 4. Isi URL ke Website

1. Buka file `js/config.js` di folder website kamu.
2. Ganti baris:
   ```js
   const API_URL = 'TEMPEL_URL_WEB_APP_DI_SINI';
   ```
   dengan URL dari langkah 3.6 tadi, jadi misalnya:
   ```js
   const API_URL = 'https://script.google.com/macros/s/AKfycb.../exec';
   ```
3. Upload ulang file `js/config.js` itu ke repo GitHub kamu (replace file lama), commit & push.

Selesai! Sekarang:
- `siswa.html`, `jadwal.html`, `piket.html`, `kas.html` otomatis **membaca** data dari Google Sheets tiap dibuka pengunjung.
- `admin.html` bisa dipakai 5 admin dari komputer manapun — tombol **"Simpan ke Google Sheets"** langsung update data buat semua orang.

---

## 5. Bagikan akses ke 4 admin lainnya

- Kalau mereka juga mau bisa **lihat/edit langsung di Google Sheets** (opsional, di luar admin.html): klik **Share** di Sheet, tambahkan email mereka dengan akses **Editor**.
- Kalau cukup lewat `admin.html` aja: mereka cukup dikasih tahu alamat `admin.html` dan sandinya (**`admintjkt1`** secara default) — gak perlu akses langsung ke Sheets.

---

## Kalau mau ganti sandi admin

Sandinya dipakai di **dua tempat**, kedua-duanya harus diganti bareng:
1. `js/admin.js` — cari `ADMIN_HASH`
2. `AppsScript-Code.gs` (yang sudah kamu paste ke Apps Script) — cari `ADMIN_HASH` juga

Cara generate hash baru: buka console browser (F12), jalankan:
```js
crypto.subtle.digest('SHA-256', new TextEncoder().encode('sandi-baru-kamu'))
  .then(b => console.log(Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2,'0')).join('')))
```
Copy hasilnya (64 karakter), tempel ke dua tempat di atas. Setelah ganti di Apps Script,
kamu perlu **Deploy → Manage deployments → Edit (pensil) → Deploy** ulang biar perubahan aktif.

---

## Troubleshooting

- **Data gak muncul / kosong**: cek `js/config.js` — pastikan URL-nya udah diisi bener (bukan placeholder `TEMPEL_URL...`).
- **"Gagal menyimpan"**: biasanya karena sandi salah, atau URL API belum di-deploy dengan akses **Anyone**.
- **Setelah edit Apps Script tapi gak ngaruh**: kamu harus deploy ulang lewat **Deploy → Manage deployments → Edit → Deploy** — bukan cuma Save di editor.
- **Sheet tab-nya kehapus header pas disimpan dari admin.html**: normal, itu ke-generate ulang otomatis tiap simpan — jangan diedit manual barengan sama admin lain di waktu yang sama biar gak tabrakan.
- **Upload foto gagal / lama**: pastikan `DRIVE_FOLDER_ID` di Apps Script udah diisi bener, dan ukuran foto di bawah 5MB. Foto besar akan lebih lama diproses karena dikirim sebagai teks (base64).
- **Foto ke-upload tapi gak muncul di galeri.html**: setelah upload, foto baru masuk ke draf admin panel — masih perlu klik **☁️ Simpan ke Google Sheets** biar tersimpan permanen dan muncul di halaman publik.
- **Gambar dari Drive gak muncul / kotak rusak**: coba buka folder Drive-nya, pastikan sharing filenya "Anyone with the link" (harusnya otomatis kesetel lewat script). Kalau masih gagal, buka file-nya manual di Drive, klik **Share → General access → Anyone with the link**.
