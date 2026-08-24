// ============================================================
// ADMIN PANEL — logika edit data (siswa, jadwal, piket, kas)
// Data kerja disimpan di memori (dan opsional draf di localStorage),
// lalu diunduh sebagai js/data.js untuk menggantikan file aslinya.
// ============================================================
(function () {
  // Hash SHA-256 dari sandi admin (bukan teks polos).
  // Sandi default: admintjkt1
  // Untuk mengganti: buka console browser lalu jalankan
  //   crypto.subtle.digest('SHA-256', new TextEncoder().encode('sandi-admin-baru'))
  //     .then(b => console.log(Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2,'0')).join('')))
  // lalu tempel hasilnya (64 karakter) menggantikan ADMIN_HASH di bawah.
  const ADMIN_HASH = '352df6859167c1a00391a23fc6d535ea4561cd560ca263b976f30548528af074';

  // ================= STATE =================
  // (dideklarasikan di atas supaya tidak error saat auto-unlock
  // memanggil initAdmin() sebelum baris ini sempat dieksekusi)
  let data = null;
  let jadwalDay = 'senin';
  let piketDay = 'senin';
  let initialized = false;

  const adminForm = document.getElementById('adminForm');
  const adminInput = document.getElementById('adminPassword');
  const adminError = document.getElementById('adminError');
  const adminLock = document.getElementById('adminLock');
  const adminContent = document.getElementById('adminContent');

  async function sha256Hex(text) {
    const enc = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function unlock() {
    adminLock.style.display = 'none';
    adminContent.classList.add('unlocked');
    initAdmin();
  }

  if (sessionStorage.getItem('adminUnlocked') === '1') unlock();

  if (adminForm) {
    adminForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const val = adminInput.value.trim();
      if (!val) return;
      try {
        const hash = await sha256Hex(val);
        if (hash === ADMIN_HASH) {
          sessionStorage.setItem('adminUnlocked', '1');
          adminError.textContent = '';
          unlock();
        } else {
          adminError.textContent = 'Sandi salah, coba lagi.';
          adminInput.value = '';
          adminInput.focus();
        }
      } catch (err) {
        adminError.textContent = 'Sandi hanya bisa diperiksa lewat koneksi HTTPS.';
      }
    });
  }

  // ================= INIT =================
  function initAdmin() {
    if (initialized) return;
    initialized = true;
    data = loadDraftOrDefault();
    setupMainTabs();
    setupActions();
    setupSiswaHandlers();
    setupJadwalHandlers();
    setupPiketHandlers();
    setupKasHandlers();
    setupGaleriHandlers();
    renderAll();
  }

  function loadDraftOrDefault() {
    let d;
    try {
      const draft = localStorage.getItem('tjkt1_siteDataDraft');
      d = draft ? JSON.parse(draft) : JSON.parse(JSON.stringify(SITE_DATA));
    } catch (e) {
      d = JSON.parse(JSON.stringify(SITE_DATA));
    }
    if (!d.galeri) d.galeri = [];
    return d;
  }

  function renderAll() {
    renderSiswaAdmin();
    renderJadwalAdmin();
    renderPiketAdmin();
    renderKasAdmin();
    renderGaleriAdmin();
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
    flashTimer = setTimeout(() => el.classList.remove('show'), 2200);
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
    byId('btnSaveDraft').addEventListener('click', () => {
      localStorage.setItem('tjkt1_siteDataDraft', JSON.stringify(data));
      flashMsg('Draf tersimpan di browser ini.');
    });
    byId('btnLoadDraft').addEventListener('click', () => {
      data = loadDraftOrDefault();
      renderAll();
      flashMsg('Draf berhasil dimuat.');
    });
    byId('btnReset').addEventListener('click', () => {
      if (!confirm('Reset semua perubahan ke data awal (data.js saat ini)? Draf tersimpan tidak akan terhapus.')) return;
      data = JSON.parse(JSON.stringify(SITE_DATA));
      renderAll();
      flashMsg('Direset ke data awal.');
    });
    byId('btnDownload').addEventListener('click', downloadDataJs);
  }

  function downloadDataJs() {
    const json = JSON.stringify(data, null, 2);
    const content =
      '// ============================================================\n' +
      '// SITE_DATA — sumber data tunggal untuk semua halaman website\n' +
      '// (siswa, jadwal, piket, kas). Diedit lewat admin.html.\n' +
      '// Ganti file js/data.js di repo dengan file ini, lalu commit & push.\n' +
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
    flashMsg('data.js diunduh — ganti file js/data.js di repo GitHub kamu.');
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
  // Gambar dikompres di browser (resize + JPEG) lalu disimpan sebagai
  // base64 langsung di dalam data.js, supaya tetap 1 file tanpa server.
  function compressImage(file, maxDim = 1400, quality = 0.82) {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) { reject(new Error('Bukan file gambar')); return; }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width > height) { height = Math.round(height * maxDim / width); width = maxDim; }
            else { width = Math.round(width * maxDim / height); height = maxDim; }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width; canvas.height = height;
          canvas.getContext('2d').drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => reject(new Error('Gagal membaca gambar'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Gagal membaca file'));
      reader.readAsDataURL(file);
    });
  }

  function renderGaleriAdmin() {
    const wrap = document.getElementById('adminGaleriList');
    if (!wrap) return;
    if (!data.galeri) data.galeri = [];

    wrap.innerHTML = data.galeri.map((g, i) => `
      <div class="galeri-admin-item">
        <div class="galeri-admin-thumb"${g.image ? ` style="background-image:url('${g.image}')"` : ''}>${g.image ? '' : (g.icon || '📷')}</div>
        <div class="galeri-admin-fields">
          <div class="galeri-admin-row">
            <input type="text" class="admin-input" data-field="label" data-idx="${i}" value="${escAttr(g.label)}" placeholder="Judul foto" style="max-width:260px;">
            <select class="admin-input admin-input-sm" data-field="size" data-idx="${i}" style="max-width:150px;">
              <option value="normal"${(!g.size || g.size === 'normal') ? ' selected' : ''}>Ukuran normal</option>
              <option value="wide"${g.size === 'wide' ? ' selected' : ''}>Lebar</option>
              <option value="tall"${g.size === 'tall' ? ' selected' : ''}>Tinggi</option>
              <option value="wide-tall"${g.size === 'wide-tall' ? ' selected' : ''}>Lebar &amp; Tinggi</option>
            </select>
          </div>
          <div class="galeri-admin-row">
            <input type="file" accept="image/*" class="galeri-admin-file" data-action="upload-galeri" data-idx="${i}">
            ${g.image ? `<button type="button" class="btn btn-sm btn-outline" data-action="remove-image" data-idx="${i}">Hapus Foto</button>` : ''}
            <button type="button" class="btn-icon-danger" data-action="del-galeri" data-idx="${i}" title="Hapus item galeri">✕</button>
          </div>
        </div>
      </div>`).join('') || `<p style="color:var(--muted);font-size:.85rem;">Belum ada item galeri. Klik "+ Tambah Foto".</p>`;

    wrap.querySelectorAll('input[data-field], select[data-field]').forEach(el => {
      el.addEventListener('input', () => {
        const idx = Number(el.dataset.idx);
        data.galeri[idx][el.dataset.field] = el.value;
      });
    });

    wrap.querySelectorAll('[data-action="upload-galeri"]').forEach(el => {
      el.addEventListener('change', async () => {
        const idx = Number(el.dataset.idx);
        const file = el.files && el.files[0];
        if (!file) return;
        flashMsg('Memproses gambar...');
        try {
          const base64 = await compressImage(file);
          data.galeri[idx].image = base64;
          renderGaleriAdmin();
          flashMsg('Foto berhasil diunggah. Jangan lupa unduh data.js setelah selesai.');
        } catch (err) {
          flashMsg('Gagal memproses gambar, coba file lain.');
        }
      });
    });

    wrap.querySelectorAll('[data-action="remove-image"]').forEach(btn => {
      btn.addEventListener('click', () => {
        data.galeri[Number(btn.dataset.idx)].image = '';
        renderGaleriAdmin();
      });
    });

    wrap.querySelectorAll('[data-action="del-galeri"]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!confirm('Hapus foto ini dari galeri?')) return;
        data.galeri.splice(Number(btn.dataset.idx), 1);
        renderGaleriAdmin();
      });
    });
  }

  function setupGaleriHandlers() {
    document.getElementById('btnAddGaleri').addEventListener('click', () => {
      if (!data.galeri) data.galeri = [];
      data.galeri.push({ label: 'Foto Baru', icon: '📷', size: 'normal', image: '' });
      renderGaleriAdmin();
    });
  }
})();
