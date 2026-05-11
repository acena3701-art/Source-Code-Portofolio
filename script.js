/* ================================================================
   AVICENA PUTRA PRADANA — PORTFOLIO JAVASCRIPT
   Fitur:
   - Animated grid canvas background
   - Custom cursor glow (desktop)
   - Typewriter effect (hero)
   - Navbar scroll behavior + active link
   - Scroll reveal animations
   - Skill bar animations (triggered saat masuk viewport)
   - Back to top button
   - Mobile hamburger menu
   - Form send simulation
   ================================================================ */

/* ===================== 1. CANVAS BACKGROUND ===================== */
// Grid/dot background yang subtil di belakang semua konten
(function initCanvas() {
  const canvas = document.getElementById('bgCanvas');
  const ctx    = canvas.getContext('2d');

  let width, height, dots = [];

  // Set ukuran canvas sesuai window
  function resize() {
    width  = canvas.width  = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  // Buat titik-titik grid
  function createDots() {
    dots = [];
    const spacing = 60;
    for (let x = 0; x < width; x += spacing) {
      for (let y = 0; y < height; y += spacing) {
        dots.push({
          x: x + Math.random() * 10,
          y: y + Math.random() * 10,
          r: Math.random() * 1.2 + 0.3,
          opacity: Math.random() * 0.4 + 0.1,
          speed: Math.random() * 0.3 + 0.05
        });
      }
    }
  }

  let frame = 0;

  function draw() {
    ctx.clearRect(0, 0, width, height);
    frame += 0.005;

    dots.forEach((dot) => {
      // Animasi opacity naik turun perlahan
      const pulse = Math.sin(frame * dot.speed + dot.x * 0.01) * 0.15;
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${Math.max(0.04, dot.opacity + pulse)})`;
      ctx.fill();
    });

    // Garis horizontal tipis
    for (let y = 0; y < height; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.025)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    // Garis vertikal tipis
    for (let x = 0; x < width; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.018)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    resize();
    createDots();
  });

  resize();
  createDots();
  draw();
})();


/* ===================== 2. CURSOR GLOW ===================== */
// Glow ikuti kursor mouse (hanya di desktop)
(function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let cx = mx, cy = my;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  // Smooth interpolation
  function animateCursor() {
    cx += (mx - cx) * 0.08;
    cy += (my - cy) * 0.08;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    requestAnimationFrame(animateCursor);
  }

  // Sembunyikan di layar sentuh
  if (window.matchMedia('(hover: hover)').matches) {
    animateCursor();
  } else {
    glow.style.display = 'none';
  }
})();


/* ===================== 3. TYPEWRITER EFFECT ===================== */
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  // Kata-kata yang akan ditampilkan bergantian
  const words = [
    'Pemrograman',
    'Sistem Operasi',
    'Cyber Security',
    'Struktur Data',
    'Problem Solving',
    'Linux & CLI'
  ];

  let wordIdx  = 0;
  let charIdx  = 0;
  let deleting = false;
  let pause    = false;

  function type() {
    const currentWord = words[wordIdx];

    if (!deleting) {
      // Mengetik
      el.textContent = currentWord.slice(0, ++charIdx);
      if (charIdx === currentWord.length) {
        // Setelah selesai ketik, tunggu sebentar lalu hapus
        if (!pause) {
          pause = true;
          setTimeout(() => {
            deleting = true;
            pause    = false;
            type();
          }, 1800);
          return;
        }
      }
    } else {
      // Menghapus
      el.textContent = currentWord.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        wordIdx  = (wordIdx + 1) % words.length;
      }
    }

    const speed = deleting ? 60 : 100;
    setTimeout(type, speed);
  }

  // Mulai setelah delay singkat
  setTimeout(type, 600);
})();


/* ===================== 4. NAVBAR SCROLL BEHAVIOR ===================== */
(function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const backTop = document.getElementById('backToTop');
  const links   = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    const scrollY = window.scrollY;

    // Tambah class .scrolled saat scroll > 60px
    navbar.classList.toggle('scrolled', scrollY > 60);

    // Tampilkan tombol back to top
    if (backTop) {
      backTop.classList.toggle('visible', scrollY > 400);
    }

    // Active link berdasarkan posisi scroll
    let current = '';
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      if (scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    links.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // panggil sekali saat load
})();


/* ===================== 5. MOBILE HAMBURGER MENU ===================== */
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    // Cegah scroll saat menu terbuka
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Tutup menu saat klik link
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();


/* ===================== 6. SCROLL REVEAL ANIMATIONS ===================== */
(function initScrollReveal() {
  // Trigger .fade-up (hero section) segera saat halaman load
  const fadeEls = document.querySelectorAll('.fade-up');

  // Hero animasi langsung tampil
  setTimeout(() => {
    fadeEls.forEach((el) => {
      el.classList.add('animated');
    });
  }, 100);

  // Reveal element saat scroll (IntersectionObserver)
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target); // Cukup trigger sekali
        }
      });
    },
    {
      threshold: 0.1,    // Trigger saat 10% elemen terlihat
      rootMargin: '0px 0px -50px 0px'
    }
  );

  revealEls.forEach((el) => observer.observe(el));
})();


/* ===================== 7. SKILL BAR ANIMATION ===================== */
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const width  = target.getAttribute('data-width');
          // Tunda sedikit agar animasi reveal selesai dulu
          setTimeout(() => {
            target.style.width = width + '%';
          }, 300);
          observer.unobserve(target);
        }
      });
    },
    { threshold: 0.3 }
  );

  fills.forEach((fill) => observer.observe(fill));
})();


/* ===================== 8. BACK TO TOP BUTTON ===================== */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ===================== 9. STAGGER REVEAL (About cards) ===================== */
(function initStaggerCards() {
  // Tambahkan delay bertahap ke info-card dan skill-card
  document.querySelectorAll('.about-cards .info-card').forEach((card, i) => {
    card.style.transitionDelay = (i * 0.07) + 's';
  });

  document.querySelectorAll('.skill-card.reveal').forEach((card, i) => {
    card.style.transitionDelay = (i * 0.1) + 's';
  });

  document.querySelectorAll('.project-card.reveal').forEach((card, i) => {
    card.style.transitionDelay = (i * 0.1) + 's';
  });

  document.querySelectorAll('.timeline-item').forEach((item, i) => {
    const card = item.querySelector('.timeline-card');
    if (card && card.classList.contains('reveal')) {
      // Timeline sudah handle via IntersectionObserver
    }
  });
})();


/* ===================== 10. CONTACT FORM (Simulasi) ===================== */
// Form ini adalah simulasi UI — untuk implementasi nyata,
// hubungkan ke backend (Node.js, PHP, dll) atau gunakan layanan
// seperti Formspree / EmailJS.
function handleSend() {
  const name  = document.getElementById('cName')?.value.trim();
  const email = document.getElementById('cEmail')?.value.trim();
  const msg   = document.getElementById('cMsg')?.value.trim();
  const note  = document.getElementById('formNote');
  const btn   = document.getElementById('sendBtn');

  // Validasi sederhana
  if (!name || !email || !msg) {
    if (note) {
      note.style.color = '#ef4444';
      note.textContent = '⚠ Mohon isi semua field terlebih dahulu.';
    }
    return;
  }

  if (!email.includes('@') || !email.includes('.')) {
    if (note) {
      note.style.color = '#ef4444';
      note.textContent = '⚠ Format email tidak valid.';
    }
    return;
  }

  // Simulasi loading
  if (btn) {
    btn.disabled     = true;
    btn.innerHTML    = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
  }

  setTimeout(() => {
    if (btn) {
      btn.disabled  = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim Pesan';
    }
    if (note) {
      note.style.color = '#10b981';
      note.textContent = '✓ Pesan berhasil dikirim! Saya akan segera membalas.';
    }
    // Reset form
    document.getElementById('cName').value  = '';
    document.getElementById('cEmail').value = '';
    document.getElementById('cMsg').value   = '';

    // Hapus notifikasi setelah 5 detik
    setTimeout(() => {
      if (note) note.textContent = '';
    }, 5000);
  }, 1800);
}


/* ===================== 11. SMOOTH ACTIVE NAV ON CLICK ===================== */
// Pastikan nav link di-highlight saat diklik (selain deteksi scroll)
document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', function () {
    document.querySelectorAll('.nav-link').forEach((l) => l.classList.remove('active'));
    this.classList.add('active');
  });
});


/* ===================== 12. IMAGE PLACEHOLDER HOVER ===================== */
// Efek hover ringan di foto timeline
document.querySelectorAll('.timeline-photo img').forEach((img) => {
  img.addEventListener('error', function () {
    // Jika gambar tidak ditemukan, tampilkan gradient sebagai fallback
    this.style.display     = 'none';
    this.parentElement.style.background =
      'linear-gradient(135deg, #111827 0%, #1a2236 100%)';
    this.parentElement.style.display    = 'flex';
    this.parentElement.style.alignItems = 'center';
    this.parentElement.style.justifyContent = 'center';
  });
});

// Fallback foto profil
const profilePhoto = document.getElementById('profilePhoto');
if (profilePhoto) {
  profilePhoto.addEventListener('error', function () {
    this.src = 'https://placehold.co/400x400/0d1117/00d4ff?text=AVP';
  });
}
