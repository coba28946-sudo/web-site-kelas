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

// Generate daftar siswa (placeholder, edit sesuai data kelas asli) - hanya jalan di siswa.html
const siswaBody = document.getElementById('siswaBody');
if (siswaBody) {
  const totalSiswa = 36;
  const siswaCount = document.getElementById('siswaCount');
  let rows = '';
  for (let i = 1; i <= totalSiswa; i++) {
    const jk = i % 2 === 0 ? 'Perempuan' : 'Laki-laki';
    rows += `
      <tr data-nama="nama siswa ${i}">
        <td class="no">${i}</td>
        <td>Nama Siswa ${i}</td>
        <td><span class="absen">${String(i).padStart(2,'0')}</span></td>
        <td>${jk}</td>
      </tr>`;
  }
  siswaBody.innerHTML = rows;

  const siswaSearch = document.getElementById('siswaSearch');
  if (siswaSearch) {
    siswaSearch.addEventListener('input', () => {
      const q = siswaSearch.value.toLowerCase().trim();
      const trs = siswaBody.querySelectorAll('tr');
      let visible = 0;
      trs.forEach(tr => {
        const match = tr.dataset.nama.includes(q);
        tr.classList.toggle('row-hidden', !match);
        if (match) visible++;
      });
      if (siswaCount) siswaCount.textContent = `${visible} siswa`;
    });
  }
}
