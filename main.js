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

// Scroll fade-up animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ===== DAFTAR SISWA (edit array siswaData sesuai data kelas asli) =====
const siswaBody = document.getElementById('siswaBody');
if (siswaBody) {
  const avatarGradients = [
    'linear-gradient(135deg,#22d3ee,#3b82f6)',
    'linear-gradient(135deg,#3b82f6,#8b5cf6)',
    'linear-gradient(135deg,#8b5cf6,#22d3ee)',
    'linear-gradient(135deg,#22d3ee,#8b5cf6)',
    'linear-gradient(135deg,#3b82f6,#22d3ee)',
    'linear-gradient(135deg,#8b5cf6,#3b82f6)'
  ];

  function getInitials(nama) {
    const parts = nama.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  // Ganti isi array ini dengan data siswa yang sebenarnya
  const totalSiswa = 36;
  let siswaData = [];
  for (let i = 1; i <= totalSiswa; i++) {
    siswaData.push({
      nama: `Nama Siswa ${i}`,
      absen: i,
      jk: i % 2 === 0 ? 'Perempuan' : 'Laki-laki'
    });
  }

  const siswaSearch = document.getElementById('siswaSearch');
  const siswaCount = document.getElementById('siswaCount');
  const siswaEmpty = document.getElementById('siswaEmpty');
  const siswaTableWrap = document.querySelector('.siswa-table-wrap');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const sortableHeaders = document.querySelectorAll('.sortable');

  const statTotal = document.getElementById('statTotal');
  const statLaki = document.getElementById('statLaki');
  const statPerempuan = document.getElementById('statPerempuan');

  let state = {
    query: '',
    filter: 'semua',
    sortKey: null,
    sortDir: 1
  };

  function updateStats() {
    const total = siswaData.length;
    const laki = siswaData.filter(s => s.jk === 'Laki-laki').length;
    const perempuan = siswaData.filter(s => s.jk === 'Perempuan').length;
    if (statTotal) statTotal.textContent = total;
    if (statLaki) statLaki.textContent = laki;
    if (statPerempuan) statPerempuan.textContent = perempuan;
  }

  function render() {
    let list = siswaData.filter(s => {
      const matchQuery = s.nama.toLowerCase().includes(state.query);
      const matchFilter = state.filter === 'semua' || s.jk === state.filter;
      return matchQuery && matchFilter;
    });

    if (state.sortKey) {
      list.sort((a, b) => {
        let va = a[state.sortKey];
        let vb = b[state.sortKey];
        if (typeof va === 'string') { va = va.toLowerCase(); vb = vb.toLowerCase(); }
        if (va < vb) return -1 * state.sortDir;
        if (va > vb) return 1 * state.sortDir;
        return 0;
      });
    }

    if (list.length === 0) {
      siswaBody.innerHTML = '';
      if (siswaEmpty) siswaEmpty.classList.add('visible');
      if (siswaTableWrap) siswaTableWrap.classList.add('is-empty');
    } else {
      if (siswaEmpty) siswaEmpty.classList.remove('visible');
      if (siswaTableWrap) siswaTableWrap.classList.remove('is-empty');
      siswaBody.innerHTML = list.map((s, idx) => {
        const initials = getInitials(s.nama);
        const grad = avatarGradients[idx % avatarGradients.length];
        const badgeClass = s.jk === 'Laki-laki' ? 'badge laki' : 'badge perempuan';
        return `
        <tr>
          <td class="no">${idx + 1}</td>
          <td>
            <div class="siswa-name">
              <span class="mini-avatar" style="background:${grad}">${initials}</span>
              <span>${s.nama}</span>
            </div>
          </td>
          <td><span class="absen">${String(s.absen).padStart(2, '0')}</span></td>
          <td><span class="${badgeClass}">${s.jk}</span></td>
        </tr>`;
      }).join('');
    }

    if (siswaCount) siswaCount.textContent = `${list.length} siswa`;
  }

  if (siswaSearch) {
    siswaSearch.addEventListener('input', () => {
      state.query = siswaSearch.value.toLowerCase().trim();
      render();
    });
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.filter = btn.dataset.filter;
      render();
    });
  });

  sortableHeaders.forEach(th => {
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      if (state.sortKey === key) {
        state.sortDir *= -1;
      } else {
        state.sortKey = key;
        state.sortDir = 1;
      }
      sortableHeaders.forEach(h => h.classList.remove('sort-asc', 'sort-desc'));
      th.classList.add(state.sortDir === 1 ? 'sort-asc' : 'sort-desc');
      render();
    });
  });

  updateStats();
  render();
}
