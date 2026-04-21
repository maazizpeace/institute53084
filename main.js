/* main.js — M A Aziz Peace Institute of Technology */

/* ── Gallery photos ── */
const galleryPhotos = [];
for (let i = 1; i <= 27; i++) {
  galleryPhotos.push(`assets/gallery/photo_${String(i).padStart(2,'0')}.jpg`);
}

/* ── Navbar scroll effect ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');

  /* back-to-top */
  const btn = document.getElementById('backToTop');
  if (btn) {
    if (window.scrollY > 400) btn.classList.add('visible');
    else btn.classList.remove('visible');
  }
});

/* ── Mobile nav toggle ── */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = navToggle.querySelectorAll('span');
    navLinks.classList.contains('open')
      ? (spans[0].style.transform = 'rotate(45deg) translate(5px,5px)',
         spans[1].style.opacity   = '0',
         spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)')
      : (spans[0].style.transform = '',
         spans[1].style.opacity   = '',
         spans[2].style.transform = '');
  });
  /* close on link click */
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

/* ── Back to top ── */
const backBtn = document.getElementById('backToTop');
if (backBtn) backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── Build gallery ── */
function buildGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  galleryPhotos.forEach((src, idx) => {
    const item = document.createElement('div');
    item.className = 'gallery-item fade-in';
    item.innerHTML = `
      <img src="${src}" alt="MAAIT Institute photo ${idx+1}" loading="lazy"/>
      <span class="gallery-zoom">⊕</span>
    `;
    item.addEventListener('click', () => openLightbox(idx));
    grid.appendChild(item);
  });
}

/* ── Lightbox ── */
let currentPhoto = 0;
function openLightbox(idx) {
  currentPhoto = idx;
  const lb  = document.getElementById('lightbox');
  const img = document.getElementById('lbImg');
  const cnt = document.getElementById('lbCounter');
  img.src   = galleryPhotos[currentPhoto];
  cnt.textContent = `${currentPhoto + 1} / ${galleryPhotos.length}`;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}
function shiftPhoto(dir) {
  currentPhoto = (currentPhoto + dir + galleryPhotos.length) % galleryPhotos.length;
  const img = document.getElementById('lbImg');
  const cnt = document.getElementById('lbCounter');
  img.src   = galleryPhotos[currentPhoto];
  cnt.textContent = `${currentPhoto + 1} / ${galleryPhotos.length}`;
}
document.getElementById('lbClose')?.addEventListener('click', closeLightbox);
document.getElementById('lbPrev')?.addEventListener('click', () => shiftPhoto(-1));
document.getElementById('lbNext')?.addEventListener('click', () => shiftPhoto(1));
document.getElementById('lightbox')?.addEventListener('click', e => {
  if (e.target === document.getElementById('lightbox')) closeLightbox();
});
document.addEventListener('keydown', e => {
  if (!document.getElementById('lightbox')?.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') shiftPhoto(-1);
  if (e.key === 'ArrowRight') shiftPhoto(1);
});

/* ── Scroll fade-in ── */
function initFadeIn() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll(
    '.bteb-card, .training-card, .about-card, .itrd-feature, .shop-cat, .gallery-item'
  ).forEach(el => {
    el.classList.add('fade-in');
    io.observe(el);
  });
}

/* ── Contact form ── */
function handleSubmit(e) {
  e.preventDefault();
  const success = document.getElementById('formSuccess');
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    e.target.reset();
    btn.textContent = 'Send Message';
    btn.disabled = false;
    if (success) { success.style.display = 'block'; setTimeout(() => success.style.display = 'none', 5000); }
  }, 1200);
}
window.handleSubmit = handleSubmit;

/* ── Active nav link on scroll ── */
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  links.forEach(a => {
    a.style.color = '';
    if (a.getAttribute('href') === `#${current}`) a.style.color = 'var(--gold)';
  });
}
window.addEventListener('scroll', updateActiveLink, { passive: true });

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  buildGallery();
  initFadeIn();
  updateActiveLink();
});
