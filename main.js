// Navbar scroll effect
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  });
}

// Mobile menu
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger.classList.remove('active');
      mobileMenu.classList.remove('open');
    });
  });
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Scroll fade-up animation + trigger skill bars & counters when visible
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      // Skill bar fill
      const fills = entry.target.querySelectorAll('.skill-fill');
      fills.forEach(f => {
        const target = f.dataset.skill || 0;
        f.style.width = target + '%';
      });

      // Number counters
      const counters = entry.target.querySelectorAll('.stat-number');
      counters.forEach(el => {
        if (el.dataset.done) return;
        el.dataset.done = '1';
        const target = parseInt(el.dataset.target || el.textContent, 10);
        if (isNaN(target)) return;
        const suffix = el.dataset.suffix || '';
        if (prefersReducedMotion) {
          el.textContent = target + suffix;
          return;
        }
        const duration = 1100;
        const start = performance.now();
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// Terminal typewriter effect (hero page only)
function initTypewriter() {
  const lines = document.querySelectorAll('.terminal-body .line');
  if (!lines.length) return;

  if (prefersReducedMotion) {
    lines.forEach(l => { l.style.width = 'auto'; });
    return;
  }

  let i = 0;
  function typeNext() {
    if (i >= lines.length) return;
    const line = lines[i];
    line.style.width = '0';
    // force reflow so transition restarts cleanly
    void line.offsetWidth;
    const fullWidth = line.scrollWidth;
    const len = line.textContent.length || 1;
    const duration = Math.min(Math.max(len * 16, 120), 700);
    line.style.transition = `width ${duration}ms steps(${len}, end)`;
    requestAnimationFrame(() => {
      line.style.width = fullWidth + 'px';
    });
    setTimeout(() => {
      i++;
      typeNext();
    }, duration + 90);
  }
  typeNext();
}
initTypewriter();

// Tilt hover effect on cards
if (!prefersReducedMotion) {
  document.querySelectorAll('.tilt').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -5;
      const rotateY = ((x - cx) / cx) * 5;
      card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// Cari siswa (jalan di siswa.html, setelah baris di-render dari SITE_DATA)
const siswaBody = document.getElementById('siswaBody');
if (siswaBody) {
  const siswaSearch = document.getElementById('siswaSearch');
  const siswaCount = document.getElementById('siswaCount');
  if (siswaSearch) {
    siswaSearch.addEventListener('input', () => {
      const q = siswaSearch.value.toLowerCase().trim();
      const trs = siswaBody.querySelectorAll('tr');
      let visible = 0;
      trs.forEach(tr => {
        const match = (tr.dataset.nama || '').includes(q);
        tr.classList.toggle('row-hidden', !match);
        if (match) visible++;
      });
      if (siswaCount) siswaCount.textContent = `${visible} siswa`;
    });
  }
}

// ===== LOADING SCREEN =====
const pageLoader = document.getElementById('pageLoader');
if (pageLoader) {
  function hideLoader() {
    pageLoader.classList.add('loaded');
    setTimeout(() => pageLoader.remove(), 600);
  }
  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 350);
  } else {
    window.addEventListener('load', () => setTimeout(hideLoader, 350));
  }
}

// ===== THEME TOGGLE (dark / light) =====
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  });
}

// ===== BACK TO TOP =====
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 420);
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
}

// ===== TRANSPARANSI KAS (gerbang sandi) =====
const kasForm = document.getElementById('kasForm');
if (kasForm) {
  // Hash SHA-256 dari sandi kelas (bukan teks polos).
  // Sandi default di bawah ini adalah: kastjkt1
  // Untuk mengganti sandi: buka console browser lalu jalankan
  //   crypto.subtle.digest('SHA-256', new TextEncoder().encode('sandi-baru-kamu'))
  //     .then(b => console.log(Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2,'0')).join('')))
  // lalu tempel hasilnya (64 karakter) menggantikan KAS_HASH di bawah.
  const KAS_HASH = '7a086fa5508492d93261009d8066980dc3387841484a0f7d05d9d5ed9240d199';

  const kasInput = document.getElementById('kasPassword');
  const kasError = document.getElementById('kasError');
  const kasLock = document.getElementById('kasLock');
  const kasContent = document.getElementById('kasContent');

  function unlockKas() {
    if (kasLock) kasLock.style.display = 'none';
    if (kasContent) kasContent.classList.add('unlocked');
  }

  async function sha256Hex(text) {
    const data = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Tetap terbuka selama tab browser masih sama (sessionStorage), sandi
  // diminta lagi jika tab ditutup atau dibuka di perangkat/tab lain.
  if (sessionStorage.getItem('kasUnlocked') === '1') {
    unlockKas();
  }

  kasForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const val = kasInput.value.trim();
    if (!val) return;
    try {
      const hash = await sha256Hex(val);
      if (hash === KAS_HASH) {
        sessionStorage.setItem('kasUnlocked', '1');
        kasError.textContent = '';
        unlockKas();
      } else {
        kasError.textContent = 'Sandi salah, coba lagi.';
        kasInput.value = '';
        kasInput.focus();
      }
    } catch (err) {
      kasError.textContent = 'Sandi hanya bisa diperiksa lewat koneksi HTTPS.';
    }
  });
}

// ===== RENDER DARI SITE_DATA (js/data.js) =====
// Semua halaman publik (siswa, jadwal, piket, kas) menampilkan isi
// dari SITE_DATA supaya bisa diedit lewat admin.html tanpa ubah HTML.
function formatRupiah(num) {
  const n = Number(num) || 0;
  return 'Rp ' + n.toLocaleString('id-ID');
}

function renderSiswaFromData() {
  const body = document.getElementById('siswaBody');
  if (!body || typeof SITE_DATA === 'undefined') return;
  const list = SITE_DATA.siswa || [];
  body.innerHTML = list.map((s, idx) => `
    <tr data-nama="${(s.nama || '').toLowerCase()}">
      <td class="no">${idx + 1}</td>
      <td>${s.nama}</td>
      <td><span class="absen">${s.absen}</span></td>
      <td>${s.jk}</td>
    </tr>`).join('');
  const countEl = document.getElementById('siswaCount');
  if (countEl) countEl.textContent = `${list.length} siswa`;
}

function renderJadwalFromData() {
  const wrap = document.getElementById('jadwalWrap');
  if (!wrap || typeof SITE_DATA === 'undefined') return;
  const days = ['senin', 'selasa', 'rabu', 'kamis', 'jumat'];
  wrap.innerHTML = days.map((d, i) => {
    const items = (SITE_DATA.jadwal && SITE_DATA.jadwal[d]) || [];
    const rows = items.map(it => `
      <div class="schedule-item${it.istirahat ? ' break' : ''}">
        <span class="jam">${it.jam}</span><span class="mapel">${it.mapel}</span>
      </div>`).join('');
    return `<div class="schedule-day${i === 0 ? ' active' : ''}" data-day="${d}">${rows || '<div class="schedule-item"><span class="mapel">Belum ada jadwal.</span></div>'}</div>`;
  }).join('');
}

function renderPiketFromData() {
  const wrap = document.getElementById('piketWrap');
  if (!wrap || typeof SITE_DATA === 'undefined') return;
  const days = ['senin', 'selasa', 'rabu', 'kamis', 'jumat'];
  const labels = { senin: 'Senin', selasa: 'Selasa', rabu: 'Rabu', kamis: 'Kamis', jumat: 'Jumat' };
  wrap.innerHTML = days.map((d, i) => {
    const p = (SITE_DATA.piket && SITE_DATA.piket[d]) || { kelompok: '-', anggota: [], tugas: [] };
    const chips = (p.anggota || []).map(n => `<span class="member-chip">${n}</span>`).join('') || '<span class="member-chip">Belum diisi</span>';
    const tasks = (p.tugas || []).map(t => `<div class="task-item"><span class="check-icon">✓</span> ${t}</div>`).join('');
    return `<div class="schedule-day${i === 0 ? ' active' : ''}" data-day="${d}">
      <div class="piket-group">
        <div class="piket-group-title"><span class="tag">${p.kelompok || '-'}</span> Piket Hari ${labels[d]}</div>
        <div class="member-chips">${chips}</div>
        <div class="piket-tasks">${tasks}</div>
      </div>
    </div>`;
  }).join('');
}

function renderKasFromData() {
  const summaryWrap = document.getElementById('kasSummary');
  const body = document.getElementById('kasBody');
  if ((!summaryWrap && !body) || typeof SITE_DATA === 'undefined') return;
  const trx = (SITE_DATA.kas && SITE_DATA.kas.transaksi) || [];
  let masuk = 0, keluar = 0;
  trx.forEach(t => {
    if (t.tipe === 'masuk') masuk += Number(t.jumlah) || 0;
    else keluar += Number(t.jumlah) || 0;
  });
  const saldo = masuk - keluar;
  if (summaryWrap) {
    summaryWrap.innerHTML = `
      <div class="kas-summary-card"><div class="label">Saldo Kas Saat Ini</div><div class="value">${formatRupiah(saldo)}</div></div>
      <div class="kas-summary-card in"><div class="label">Total Pemasukan</div><div class="value">${formatRupiah(masuk)}</div></div>
      <div class="kas-summary-card out"><div class="label">Total Pengeluaran</div><div class="value">${formatRupiah(keluar)}</div></div>`;
  }
  if (body) {
    if (!trx.length) {
      body.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--muted);padding:32px 20px;">Belum ada data transaksi.</td></tr>`;
    } else {
      body.innerHTML = trx.slice().reverse().map(t => `
        <tr>
          <td>${t.tanggal}</td>
          <td>${t.keterangan}</td>
          <td><span class="kas-badge ${t.tipe}">${t.tipe === 'masuk' ? 'Masuk' : 'Keluar'}</span></td>
          <td>${formatRupiah(t.jumlah)}</td>
        </tr>`).join('');
    }
  }
}

if (typeof SITE_DATA !== 'undefined') {
  renderSiswaFromData();
  renderJadwalFromData();
  renderPiketFromData();
  renderKasFromData();
}

// ===== JADWAL PELAJARAN (day tabs) =====
const dayTabs = document.getElementById('dayTabs');
if (dayTabs) {
  const tabs = dayTabs.querySelectorAll('.day-tab');
  const days = document.querySelectorAll('.schedule-day');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const day = tab.dataset.day;
      tabs.forEach(t => t.classList.toggle('active', t === tab));
      days.forEach(d => d.classList.toggle('active', d.dataset.day === day));
    });
  });
}
