const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 20));
  function openLightbox(src) {
    const overlay = document.getElementById('lightboxOverlay');
    document.getElementById('lightboxImg').src = src;
    overlay.classList.add('active');
  }
  function closeLightbox() {
    document.getElementById('lightboxOverlay').classList.remove('active');
  }
  document.getElementById('hamburger').addEventListener('click', () => navbar.classList.toggle('open'));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) { setTimeout(() => e.target.classList.add('visible'), i * 80); observer.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(r => observer.observe(r));

  // Scroll dots
  const scroll = document.getElementById('photoScroll');
  const dots = document.querySelectorAll('.scroll-dot');
  if(scroll) {
    scroll.addEventListener('scroll', () => {
      const idx = Math.round(scroll.scrollLeft / 268);
      dots.forEach((d,i) => d.classList.toggle('active', i === idx));
    });
    dots.forEach((d,i) => d.addEventListener('click', () => scroll.scrollTo({left: i*268, behavior:'smooth'})));
  }

  // Reusable swipeable workshop gallery (arrows, dots, touch swipe, keyboard)
  document.querySelectorAll('[data-gallery]').forEach((gallery) => {
    const track = gallery.querySelector('.gallery-track');
    const slides = gallery.querySelectorAll('.gallery-slide');
    const dotsWrap = gallery.querySelector('.gallery-dots');
    const prevBtn = gallery.querySelector('.gallery-prev');
    const nextBtn = gallery.querySelector('.gallery-next');
    let index = 0;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to photo ' + (i + 1));
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = dotsWrap.querySelectorAll('.gallery-dot');

    function update() {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }
    function goTo(i) {
      index = (i + slides.length) % slides.length;
      update();
    }

    prevBtn.addEventListener('click', () => goTo(index - 1));
    nextBtn.addEventListener('click', () => goTo(index + 1));

    gallery.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') goTo(index - 1);
      if (e.key === 'ArrowRight') goTo(index + 1);
    });

    let startX = 0, isTouching = false;
    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isTouching = true;
    }, { passive: true });
    track.addEventListener('touchend', (e) => {
      if (!isTouching) return;
      isTouching = false;
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) diff > 0 ? goTo(index + 1) : goTo(index - 1);
    });
  });
