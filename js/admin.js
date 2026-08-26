// ============================================================
// ADMIN PANEL — logika edit data (siswa, jadwal, piket, kas, galeri)
// Login pakai Firebase Authentication, semua data (termasuk foto
// galeri, dikompres & disimpan sebagai base64) tersimpan real-time
// di Firebase Firestore. Gak butuh Firebase Storage sama sekali.
// ============================================================
(function () {
  // Email akun admin di Firebase Authentication (dibuat sekali lewat
  // Firebase Console → Authentication → Users → Add user).
  // Semua admin login pakai email yang SAMA ini + password yang kamu
  // set di sana. Lihat PANDUAN-SETUP.md.
  const ADMIN_EMAIL = 'admin@tjkt1-web.local';

  const adminForm = document.getElementById('adminForm');
  const adminInput = document.getElementById('adminPassword');
  const adminError = document.getElementById('adminError');
  const adminLock = document.getElementById('adminLock');
  const adminContent = document.getElementById('adminContent');

  function firebaseConfigured() {
    return (typeof FIREBASE_CONFIG !== 'undefined')
      && FIREBASE_CONFIG.apiKey
      && !String(FIREBASE_CONFIG.apiKey).includes('TEMPEL');
  }

  let auth = null;
  let db = null;

  // Dibungkus try/catch masing-masing supaya kalau salah satu servis
  // gagal ke-init, servis lain (terutama Auth buat login) tetap jalan.
  if (firebaseConfigured() && typeof firebase !== 'undefined') {
    try {
      if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
    } catch (err) { /* app mungkin udah di-init sebelumnya, aman diabaikan */ }
    try { auth = firebase.auth(); } catch (err) { auth = null; }
    try { db = firebase.firestore(); } catch (err) { db = null; }
  }

  function unlock() {
    adminLock.style.display = 'none';
    adminContent.classList.add('unlocked');
    initAdmin();
  }

  // Kalau Firebase belum di-setup sama sekali, kasih tahu di gerbang sandi.
  if (!firebaseConfigured()) {
    if (adminError) {
      adminError.textContent = '';
    }
  }

  if (adminForm) {
    adminForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const val = adminInput.value.trim();
      if (!val) return;

      if (!firebaseConfigured() || !auth) {
        adminError.textContent = 'Firebase belum di-setup — isi js/config.js dulu (lihat PANDUAN-SETUP.md).';
        return;
      }

      adminError.textContent = '';
      try {
        await auth.signInWithEmailAndPassword(ADMIN_EMAIL, val);
        adminInput.value = '';
        unlock();
      } catch (err) {
        adminError.textContent = 'Sandi salah, coba lagi.';
        adminInput.value = '';
        adminInput.focus();
      }
    });
  }

  // Kalau sesi login Firebase masih aktif (browser sama, belum logout),
  // langsung masuk tanpa minta sandi lagi.
  if (auth) {
    auth.onAuthStateChanged((user) => {
      if (user && adminLock && adminLock.style.display !== 'none' && !adminContent.classList.contains('unlocked')) {
        unlock();
      }
    });
  }

  // ================= STATE =================
  let data = null;
  let originalData = null; // snapshot untuk tombol "Batalkan Perubahan"
  let jadwalDay = 'senin';
  let piketDay = 'senin';
  let initialized = false;

  function initAdmin() {
    if (initialized) return;
    initialized = true;
    setupMainTabs();
    setupActions();
    setupSiswaHandlers();
    setupJadwalHandlers();
    setupPiketHandlers();
    setupKasHandlers();
    setupGaleriHandlers();
    loadInitialData();
    loadGaleriAdmin();
  }

  async function fetchFromFirestore() {
    const snap = await db.collection('site').doc('data').get();
    if (!snap.exists) return null;
    return snap.data();
  }

  async function loadInitialData() {
    if (db) {
      flashMsg('Memuat data dari Firebase...');
      try {
        const fresh = await fetchFromFirestore();
        if (fresh) {
          data = fresh;
          originalData = JSON.parse(JSON.stringify(fresh));
          renderAll();
          flashMsg('Data terbaru dari Firebase berhasil dimuat.');
          return;
        }
        flashMsg('Belum ada data di Firebase — mulai dari data cadangan.');
      } catch (err) {
        flashMsg('Gagal ambil data dari Firebase — pakai data cadangan.');
      }
    }
    data = JSON.parse(JSON.stringify(SITE_DATA));
    originalData = JSON.parse(JSON.stringify(data));
    renderAll();
  }

  function renderAll() {
    renderSiswaAdmin();
    renderJadwalAdmin();
    renderPiketAdmin();
    renderKasAdmin();
  }

  function formatRp(n) { return 'Rp ' + (Number(n) || 0).toLocaleString('id-ID'); }
  function escAttr(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/"/g, '&quot;')
      .replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  let flashTimer = null;
  function flashMsg(msg) {
    const el = document.getElementById('adminMsg');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => el.classList.remove('show'), 3200);
  }

  // ================= TOP ACTIONS =================
  function setupMainTabs() {
    const TAB_IDS = ['siswa', 'jadwal', 'piket', 'kas', 'galeri'];
    document.querySelectorAll('.admin-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.admin-tab').forEach(b => b.classList.toggle('active', b === btn));
        TAB_IDS.forEach(id => {
          const panel = document.getElementById('panel-' + id);
          if (panel) panel.classList.toggle('active', id === btn.dataset.tab);
        });
      });
    });
  }

  function setupActions() {
    const byId = document.getElementById.bind(document);

    byId('btnReload').addEventListener('click', async () => {
      if (!confirm('Muat ulang dari Firebase? Perubahan yang belum disimpan akan hilang.')) return;
      await loadInitialData();
    });

    byId('btnSaveCloud').addEventListener('click', saveToFirebase);

    byId('btnReset').addEventListener('click', () => {
      if (!confirm('Batalkan semua perubahan yang belum disimpan?')) return;
      data = JSON.parse(JSON.stringify(originalData));
      renderAll();
      flashMsg('Perubahan dibatalkan.');
    });

    byId('btnDownload').addEventListener('click', downloadDataJs);
  }

  async function saveToFirebase() {
    if (!db) {
      flashMsg('Firebase belum di-setup (lihat js/config.js & PANDUAN-SETUP.md).');
      return;
    }
    flashMsg('Menyimpan ke Firebase...');
    try {
      await db.collection('site').doc('data').set({
        siswa: data.siswa,
        jadwal: data.jadwal,
        piket: data.piket,
        kas: data.kas
      });
      originalData = JSON.parse(JSON.stringify(data));
      flashMsg('Tersimpan — semua admin & pengunjung langsung lihat perubahan ini secara real-time.');
    } catch (err) {
      flashMsg('Gagal menyimpan: ' + (err && err.message ? err.message : 'cek koneksi atau aturan akses Firebase.'));
    }
  }

  function downloadDataJs() {
    const json = JSON.stringify(data, null, 2);
    const content =
      '// ============================================================\n' +
      '// CADANGAN DATA — diekspor dari admin.html sebagai backup.\n' +
      '// Bisa dipakai gantiin isi js/data.js kalau perlu (fallback offline).\n' +
      '// ============================================================\n' +
      'const SITE_DATA = ' + json + ';\n';
    const blob = new Blob([content], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    flashMsg('data.js (cadangan) diunduh.');
  }

  // ================= SISWA =================
  function renderSiswaAdmin() {
    const body = document.getElementById('adminSiswaBody');
    if (!body) return;
    body.innerHTML = data.siswa.map((s, i) => `
      <tr>
        <td class="no">${i + 1}</td>
        <td><input type="text" class="admin-input" data-field="nama" data-idx="${i}" value="${escAttr(s.nama)}"></td>
        <td><input type="text" class="admin-input admin-input-sm" data-field="absen" data-idx="${i}" value="${escAttr(s.absen)}"></td>
        <td>
          <select class="admin-input admin-input-sm" data-field="jk" data-idx="${i}">
            <option value="Laki-laki"${s.jk === 'Laki-laki' ? ' selected' : ''}>Laki-laki</option>
            <option value="Perempuan"${s.jk === 'Perempuan' ? ' selected' : ''}>Perempuan</option>
          </select>
        </td>
        <td><button class="btn-icon-danger" data-action="del-siswa" data-idx="${i}" title="Hapus siswa">✕</button></td>
      </tr>`).join('') || `<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:20px;">Belum ada siswa.</td></tr>`;

    body.querySelectorAll('input[data-field], select[data-field]').forEach(el => {
      el.addEventListener('input', () => {
        const idx = Number(el.dataset.idx);
        data.siswa[idx][el.dataset.field] = el.value;
      });
    });
    body.querySelectorAll('[data-action="del-siswa"]').forEach(btn => {
      btn.addEventListener('click', () => {
        data.siswa.splice(Number(btn.dataset.idx), 1);
        renderSiswaAdmin();
      });
    });
  }

  function setupSiswaHandlers() {
    document.getElementById('btnAddSiswa').addEventListener('click', () => {
      data.siswa.push({ nama: 'Nama Siswa Baru', absen: String(data.siswa.length + 1).padStart(2, '0'), jk: 'Laki-laki' });
      renderSiswaAdmin();
    });
  }

  // ================= JADWAL =================
  function renderJadwalAdmin() {
    document.querySelectorAll('#jadwalDayTabs .admin-tab-sm').forEach(b => {
      b.classList.toggle('active', b.dataset.day === jadwalDay);
    });
    const body = document.getElementById('adminJadwalBody');
    if (!body) return;
    const items = data.jadwal[jadwalDay] || (data.jadwal[jadwalDay] = []);
    body.innerHTML = items.map((it, i) => `
      <tr>
        <td><input type="text" class="admin-input admin-input-sm" data-field="jam" data-idx="${i}" value="${escAttr(it.jam)}"></td>
        <td><input type="text" class="admin-input" data-field="mapel" data-idx="${i}" value="${escAttr(it.mapel)}"></td>
        <td style="text-align:center;"><input type="checkbox" data-field="istirahat" data-idx="${i}" ${it.istirahat ? 'checked' : ''}></td>
        <td><button class="btn-icon-danger" data-action="del-jadwal" data-idx="${i}" title="Hapus baris">✕</button></td>
      </tr>`).join('') || `<tr><td colspan="4" style="text-align:center;color:var(--muted);padding:20px;">Belum ada jam pelajaran untuk hari ini.</td></tr>`;

    body.querySelectorAll('[data-field]').forEach(el => {
      el.addEventListener('input', () => {
        const idx = Number(el.dataset.idx);
        const field = el.dataset.field;
        items[idx][field] = field === 'istirahat' ? el.checked : el.value;
      });
    });
    body.querySelectorAll('[data-action="del-jadwal"]').forEach(btn => {
      btn.addEventListener('click', () => {
        items.splice(Number(btn.dataset.idx), 1);
        renderJadwalAdmin();
      });
    });
  }

  function setupJadwalHandlers() {
    document.getElementById('jadwalDayTabs').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-day]');
      if (!btn) return;
      jadwalDay = btn.dataset.day;
      renderJadwalAdmin();
    });
    document.getElementById('btnAddJadwal').addEventListener('click', () => {
      (data.jadwal[jadwalDay] || (data.jadwal[jadwalDay] = [])).push({ jam: '00.00 - 00.00', mapel: 'Mata Pelajaran', istirahat: false });
      renderJadwalAdmin();
    });
  }

  // ================= PIKET =================
  function ensurePiketDay(d) {
    if (!data.piket[d]) data.piket[d] = { kelompok: 'Kelompok Baru', anggota: [], tugas: [] };
    return data.piket[d];
  }

  function renderPiketAdmin() {
    document.querySelectorAll('#piketDayTabs .admin-tab-sm').forEach(b => {
      b.classList.toggle('active', b.dataset.day === piketDay);
    });
    const p = ensurePiketDay(piketDay);
    const kInput = document.getElementById('piketKelompokInput');
    if (kInput) kInput.value = p.kelompok || '';

    const anggotaWrap = document.getElementById('adminPiketAnggota');
    if (anggotaWrap) {
      anggotaWrap.innerHTML = p.anggota.map((n, i) => `
        <div class="admin-list-row">
          <input type="text" class="admin-input" data-field="anggota" data-idx="${i}" value="${escAttr(n)}">
          <button class="btn-icon-danger" data-action="del-anggota" data-idx="${i}" title="Hapus anggota">✕</button>
        </div>`).join('') || `<p style="color:var(--muted);font-size:.85rem;">Belum ada anggota.</p>`;

      anggotaWrap.querySelectorAll('input[data-field="anggota"]').forEach(el => {
        el.addEventListener('input', () => { p.anggota[Number(el.dataset.idx)] = el.value; });
      });
      anggotaWrap.querySelectorAll('[data-action="del-anggota"]').forEach(btn => {
        btn.addEventListener('click', () => { p.anggota.splice(Number(btn.dataset.idx), 1); renderPiketAdmin(); });
      });
    }

    const tugasWrap = document.getElementById('adminPiketTugas');
    if (tugasWrap) {
      tugasWrap.innerHTML = p.tugas.map((t, i) => `
        <div class="admin-list-row">
          <input type="text" class="admin-input" data-field="tugas" data-idx="${i}" value="${escAttr(t)}">
          <button class="btn-icon-danger" data-action="del-tugas" data-idx="${i}" title="Hapus tugas">✕</button>
        </div>`).join('') || `<p style="color:var(--muted);font-size:.85rem;">Belum ada tugas.</p>`;

      tugasWrap.querySelectorAll('input[data-field="tugas"]').forEach(el => {
        el.addEventListener('input', () => { p.tugas[Number(el.dataset.idx)] = el.value; });
      });
      tugasWrap.querySelectorAll('[data-action="del-tugas"]').forEach(btn => {
        btn.addEventListener('click', () => { p.tugas.splice(Number(btn.dataset.idx), 1); renderPiketAdmin(); });
      });
    }
  }

  function setupPiketHandlers() {
    document.getElementById('piketDayTabs').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-day]');
      if (!btn) return;
      piketDay = btn.dataset.day;
      renderPiketAdmin();
    });
    document.getElementById('piketKelompokInput').addEventListener('input', (e) => {
      ensurePiketDay(piketDay).kelompok = e.target.value;
    });
    document.getElementById('btnAddAnggota').addEventListener('click', () => {
      ensurePiketDay(piketDay).anggota.push('Nama Siswa');
      renderPiketAdmin();
    });
    document.getElementById('btnAddTugas').addEventListener('click', () => {
      ensurePiketDay(piketDay).tugas.push('Tugas piket');
      renderPiketAdmin();
    });
  }

  // ================= KAS =================
  function renderKasSummary() {
    const trx = data.kas.transaksi;
    let masuk = 0, keluar = 0;
    trx.forEach(t => { if (t.tipe === 'masuk') masuk += Number(t.jumlah) || 0; else keluar += Number(t.jumlah) || 0; });
    const el = document.getElementById('adminKasSummary');
    if (!el) return;
    el.innerHTML = `
      <div class="kas-summary-card"><div class="label">Saldo Kas</div><div class="value">${formatRp(masuk - keluar)}</div></div>
      <div class="kas-summary-card in"><div class="label">Pemasukan</div><div class="value">${formatRp(masuk)}</div></div>
      <div class="kas-summary-card out"><div class="label">Pengeluaran</div><div class="value">${formatRp(keluar)}</div></div>`;
  }

  function renderKasAdmin() {
    renderKasSummary();
    const body = document.getElementById('adminKasBody');
    if (!body) return;
    const trx = data.kas.transaksi;
    body.innerHTML = trx.map((t, i) => `
      <tr>
        <td><input type="text" class="admin-input admin-input-sm" data-field="tanggal" data-idx="${i}" value="${escAttr(t.tanggal)}" placeholder="cth: 01 Agu 2026"></td>
        <td><input type="text" class="admin-input" data-field="keterangan" data-idx="${i}" value="${escAttr(t.keterangan)}"></td>
        <td>
          <select class="admin-input admin-input-sm" data-field="tipe" data-idx="${i}">
            <option value="masuk"${t.tipe === 'masuk' ? ' selected' : ''}>Masuk</option>
            <option value="keluar"${t.tipe === 'keluar' ? ' selected' : ''}>Keluar</option>
          </select>
        </td>
        <td><input type="number" class="admin-input admin-input-sm" data-field="jumlah" data-idx="${i}" value="${Number(t.jumlah) || 0}" min="0"></td>
        <td><button class="btn-icon-danger" data-action="del-kas" data-idx="${i}" title="Hapus transaksi">✕</button></td>
      </tr>`).join('') || `<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:20px;">Belum ada transaksi.</td></tr>`;

    body.querySelectorAll('[data-field]').forEach(el => {
      el.addEventListener('input', () => {
        const idx = Number(el.dataset.idx);
        const field = el.dataset.field;
        trx[idx][field] = field === 'jumlah' ? Number(el.value) : el.value;
        if (field === 'jumlah' || field === 'tipe') renderKasSummary();
      });
    });
    body.querySelectorAll('[data-action="del-kas"]').forEach(btn => {
      btn.addEventListener('click', () => {
        trx.splice(Number(btn.dataset.idx), 1);
        renderKasAdmin();
      });
    });
  }

  function setupKasHandlers() {
    document.getElementById('btnAddKas').addEventListener('click', () => {
      data.kas.transaksi.push({ tanggal: '', keterangan: '', tipe: 'masuk', jumlah: 0 });
      renderKasAdmin();
    });
  }

  // ================= GALERI =================
  // Foto disimpan di collection Firestore terpisah ("galeri"), bukan
  // di dalam dokumen site/data — supaya gak kebentur batas ukuran
  // dokumen Firestore (1MB). Tiap foto dikompres dulu jadi base64
  // sebelum disimpan, jadi gak butuh Firebase Storage sama sekali.
  let galeriList = []; // [{ id, url, caption }]

  async function loadGaleriAdmin() {
    if (!db) { galeriList = []; renderGaleriAdmin(); return; }
    try {
      const snap = await db.collection('galeri').orderBy('createdAt', 'desc').get();
      galeriList = snap.docs.map(doc => ({ id: doc.id, url: doc.data().data, caption: doc.data().caption || '' }));
    } catch (err) {
      galeriList = [];
    }
    renderGaleriAdmin();
  }

  function renderGaleriAdmin() {
    const grid = document.getElementById('adminGaleriGrid');
    if (!grid) return;
    grid.innerHTML = galeriList.map((g, i) => `
      <div class="admin-galeri-item">
        <img src="${g.url}" alt="foto ${i + 1}">
        <div class="admin-galeri-body">
          <input type="text" class="admin-input" data-field="caption" data-id="${g.id}" value="${escAttr(g.caption)}" placeholder="Keterangan foto">
          <button class="btn-icon-danger" data-action="del-galeri" data-id="${g.id}">✕ Hapus</button>
        </div>
      </div>`).join('') || `<p style="color:var(--muted);font-size:.85rem;">Belum ada foto diunggah.</p>`;

    grid.querySelectorAll('input[data-field="caption"]').forEach(el => {
      el.addEventListener('change', async () => {
        const id = el.dataset.id;
        const item = galeriList.find(g => g.id === id);
        if (item) item.caption = el.value;
        if (db) {
          try { await db.collection('galeri').doc(id).update({ caption: el.value }); flashMsg('Keterangan foto disimpan.'); }
          catch (err) { flashMsg('Gagal simpan keterangan.'); }
        }
      });
    });
    grid.querySelectorAll('[data-action="del-galeri"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('Hapus foto ini?')) return;
        const id = btn.dataset.id;
        if (db) {
          try { await db.collection('galeri').doc(id).delete(); }
          catch (err) { flashMsg('Gagal hapus foto.'); return; }
        }
        galeriList = galeriList.filter(g => g.id !== id);
        renderGaleriAdmin();
        flashMsg('Foto dihapus.');
      });
    });
  }

  // Kecilin & kompres foto lewat <canvas> sebelum disimpan sebagai
  // base64, supaya ukurannya muat jauh di bawah batas 1MB Firestore.
  function resizeImageToBase64(file, maxWidth, quality) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let w = img.width, h = img.height;
          if (w > maxWidth) { h = Math.round(h * (maxWidth / w)); w = maxWidth; }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => reject(new Error('Gagal membaca gambar.'));
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function setupGaleriHandlers() {
    const btn = document.getElementById('btnUploadGaleri');
    const fileInput = document.getElementById('galeriFileInput');
    const captionInput = document.getElementById('galeriCaptionInput');
    if (!btn) return;

    btn.addEventListener('click', async () => {
      const file = fileInput.files && fileInput.files[0];
      if (!file) { flashMsg('Pilih file foto dulu.'); return; }
      if (!db) { flashMsg('Firebase belum di-setup (lihat js/config.js).'); return; }
      if (file.size > 15 * 1024 * 1024) { flashMsg('Ukuran foto maksimal 15MB (sebelum dikompres).'); return; }

      btn.disabled = true;
      flashMsg('Mengompres & mengunggah foto...');
      try {
        let base64 = await resizeImageToBase64(file, 1000, 0.7);
        // Kalau masih kegedean, kompres ulang lebih agresif.
        if (base64.length * 0.75 > 900000) {
          base64 = await resizeImageToBase64(file, 700, 0.55);
        }
        if (base64.length * 0.75 > 950000) {
          flashMsg('Foto masih terlalu besar walau sudah dikompres — coba foto lain.');
          return;
        }

        await db.collection('galeri').add({
          data: base64,
          caption: captionInput.value.trim(),
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        fileInput.value = '';
        captionInput.value = '';
        await loadGaleriAdmin();
        flashMsg('Foto tersimpan & langsung tampil di halaman publik.');
      } catch (err) {
        flashMsg('Gagal unggah: ' + (err && err.message ? err.message : 'cek aturan akses Firestore.'));
      } finally {
        btn.disabled = false;
      }
    });
  }
})();
