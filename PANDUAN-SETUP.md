# Panduan Setup — Firebase (Real-time, buat 5 Admin)

Lebih simpel dari cara Google Sheets sebelumnya — gak ada nama tab/kolom yang
harus persis, dan perubahan langsung real-time ke semua orang tanpa refresh.

Ikuti urutan ini sekali aja di awal.

---

## 1. Bikin Project Firebase

1. Buka [console.firebase.google.com](https://console.firebase.google.com), login pakai akun Google.
2. Klik **Add project** (atau "Create a project").
3. Kasih nama, misal **"tjkt1-web"** → Continue.
4. Google Analytics boleh **dimatikan** (gak perlu buat website kelas) → Create project.
5. Tunggu sampai selesai → Continue.

---

## 2. Daftarkan Web App & Ambil Config

1. Di halaman utama project, klik ikon **`</>`** (Web) buat nambah app.
2. Kasih nickname, misal **"Website TJKT 1"** → Register app.
3. **Jangan install apa-apa** (skip bagian "Add Firebase SDK", karena kita udah pakai lewat link CDN) → klik **Continue to console**.
4. Nanti muncul kode config kayak gini — **copy semuanya**:
   ```js
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "tjkt1-web.firebaseapp.com",
     projectId: "tjkt1-web",
     storageBucket: "tjkt1-web.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef"
   };
   ```
5. Buka file **`js/config.js`** di folder website kamu, ganti isinya jadi:
   ```js
   const FIREBASE_CONFIG = {
     apiKey: "AIzaSy...",          // ganti sesuai punya kamu
     authDomain: "tjkt1-web.firebaseapp.com",
     projectId: "tjkt1-web",
     storageBucket: "tjkt1-web.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef"
   };
   ```
   (Tinggal copy-paste 6 baris dari langkah 4 ke dalam `FIREBASE_CONFIG`.)

*(Kalau lupa buka config ini lagi nanti: Firebase Console → ikon ⚙️ di sidebar kiri atas → Project settings → scroll ke bawah ke "Your apps".)*

---

## 3. Aktifkan Firestore Database (tempat nyimpen data)

1. Di sidebar kiri, klik **Build → Firestore Database**.
2. Klik **Create database**.
3. Pilih lokasi server terdekat (misal `asia-southeast2 (Jakarta)`) → Next.
4. Pilih **Start in production mode** → Enable.
5. Setelah kebuka, klik tab **Rules** di bagian atas, hapus semua isinya, ganti dengan:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /site/data {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```
6. Klik **Publish**.

*(Artinya: semua orang boleh baca datanya buat ditampilkan di website, tapi cuma yang sudah login admin yang boleh mengubah.)*

---

## 4. Aktifkan Authentication (buat login admin)

1. Di sidebar kiri, klik **Build → Authentication**.
2. Klik **Get started**.
3. Di tab **Sign-in method**, klik **Email/Password**, aktifkan toggle-nya → **Save**.
4. Pindah ke tab **Users**, klik **Add user**.
5. Isi:
   - **Email**: `admin@tjkt1-web.local` *(pakai persis ini — atau kalau mau ganti, sesuaikan juga `ADMIN_EMAIL` di `js/admin.js`)*
   - **Password**: bikin sandi admin kamu sendiri (minimal 6 karakter) — **ini yang bakal dipakai buat login di admin.html**
6. Klik **Add user**.

💡 **Kalau mau 5 admin punya sandi masing-masing** (bukan sandi bareng-bareng): ulangi langkah 4-6 dengan email berbeda per admin (misal `admin1@tjkt1-web.local`, `admin2@tjkt1-web.local`, dst), lalu di `js/admin.js` kamu perlu ubah dikit logikanya biar bisa pilih email — bisa tanya saya lagi kalau mau versi ini.

---

## 5. Aktifkan Storage (tempat nyimpen foto galeri)

1. Di sidebar kiri, klik **Build → Storage**.
2. Klik **Get started** → **Next** → pilih lokasi yang **sama** kayak Firestore tadi → **Done**.
3. Klik tab **Rules**, ganti isinya jadi:
   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /galeri/{fileName} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```
4. Klik **Publish**.

---

## 6. Upload ke GitHub

Upload semua file website (`*.html`, folder `css/`, folder `js/` — termasuk `js/config.js`
yang udah diisi tadi — dan `assets/`) ke repo GitHub kamu, replace yang lama, commit & push.

---

## Selesai! Cara Pakai

- **Halaman publik** (`index.html`, `jadwal.html`, `siswa.html`, `piket.html`, `kas.html`, `galeri.html`):
  otomatis nampilin data dari Firebase, **update sendiri secara real-time** kalau ada admin yang baru simpan
  perubahan — pengunjung gak perlu refresh.
- **`admin.html`**: buka, masukin sandi (yang kamu buat di langkah 4.5) → edit data di 5 tab
  (Siswa, Jadwal, Piket, Kas, Galeri) → klik **☁️ Simpan (Real-time)**.

---

## Troubleshooting

- **"Sandi salah" padahal yakin bener**: cek lagi email di Firebase Console → Authentication → Users,
  pastikan persis `admin@tjkt1-web.local` (atau email yang kamu pakai, harus sama dengan `ADMIN_EMAIL`
  di `js/admin.js`).
- **Data gak muncul sama sekali**: cek `js/config.js`, pastikan semua field udah diisi (bukan
  `TEMPEL_...` lagi).
- **"Firebase belum di-setup" terus muncul**: berarti `js/config.js` masih placeholder atau ada typo —
  cek ulang tiap field-nya persis sama seperti yang di-copy dari Firebase Console.
- **Gagal menyimpan / gagal upload foto**: kemungkinan Rules di langkah 3.5 atau 5.3 belum ke-**Publish**,
  atau kamu belum login (coba logout & login ulang di admin.html).
- **Upload foto lama/gagal buat file besar**: maksimal 5MB per foto, ukuran lebih besar dari itu ditolak
  duluan sama admin panel.
