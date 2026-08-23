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
