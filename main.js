/* ══════════════════════════════════════════════════════════════
   BALNEARIO SAFARI — main.js
   JavaScript compartido por todas las páginas.
   ══════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────
   1. HAMBURGER — abrir/cerrar menú móvil
───────────────────────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  /* Cerrar al hacer clic en cualquier enlace del menú */
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   2. Pasarela
───────────────────────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════
   PASARELA DE FOTOGRAFÍAS
═══════════════════════════════════════════════════════════ */

const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const prevButton = document.querySelector('.slider-prev');
const nextButton = document.querySelector('.slider-next');

let currentSlide = 0;
let autoSlide;


/* ── Mostrar fotografía ── */

function showSlide(index) {

  slides.forEach(slide => {
    slide.classList.remove('active');
  });

  dots.forEach(dot => {
    dot.classList.remove('active');
  });

  slides[index].classList.add('active');
  dots[index].classList.add('active');

  currentSlide = index;
}


/* ── Siguiente ── */

function nextSlide() {

  const next =
    (currentSlide + 1) % slides.length;

  showSlide(next);
}


/* ── Anterior ── */

function prevSlide() {

  const previous =
    (currentSlide - 1 + slides.length) % slides.length;

  showSlide(previous);
}


/* ── Botones ── */

nextButton.addEventListener('click', () => {

  nextSlide();

  restartAutoSlide();

});

prevButton.addEventListener('click', () => {

  prevSlide();

  restartAutoSlide();

});


/* ── Indicadores ── */

dots.forEach((dot, index) => {

  dot.addEventListener('click', () => {

    showSlide(index);

    restartAutoSlide();

  });

});


/* ═══════════════════════════════════════════════════════════
   CAMBIO AUTOMÁTICO
═══════════════════════════════════════════════════════════ */

function startAutoSlide() {

  autoSlide = setInterval(() => {

    nextSlide();

  }, 5000);

}


function restartAutoSlide() {

  clearInterval(autoSlide);

  startAutoSlide();

}


startAutoSlide();


/* ═══════════════════════════════════════════════════════════
   SOPORTE PARA SWIPE EN MÓVILES
═══════════════════════════════════════════════════════════ */

const slider = document.querySelector('.photo-slider');

let touchStartX = 0;
let touchEndX = 0;

slider.addEventListener('touchstart', (event) => {

  touchStartX = event.changedTouches[0].screenX;

}, { passive: true });


slider.addEventListener('touchend', (event) => {

  touchEndX = event.changedTouches[0].screenX;

  handleSwipe();

}, { passive: true });


function handleSwipe() {

  const difference =
    touchStartX - touchEndX;

  /* Swipe hacia la izquierda */
  if (difference > 50) {

    nextSlide();

    restartAutoSlide();

  }

  /* Swipe hacia la derecha */
  if (difference < -50) {

    prevSlide();

    restartAutoSlide();

  }

}
/* ─────────────────────────────────────────────────────────────
   2. SCROLL REVEAL — elementos aparecen al entrar en pantalla
───────────────────────────────────────────────────────────── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));


/* ─────────────────────────────────────────────────────────────
   3. NAVBAR — cambia fondo al hacer scroll
───────────────────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.style.background = window.scrollY > 55
      ? 'rgba(0,40,50,0.97)'
      : 'rgba(0,155,160,0.96)';
  }, { passive: true }); /* passive evita bloqueo del hilo en móvil */
}


/* ─────────────────────────────────────────────────────────────
   4. STICKY CTA MÓVIL — se oculta al llegar a sección reservas
   (solo aplica en index.html / página con sección #reservas)
───────────────────────────────────────────────────────────── */
const stickyCta   = document.getElementById('stickyCta');
const reservasSec = document.getElementById('reservas');

if (stickyCta && reservasSec) {
  new IntersectionObserver(entries => {
    entries.forEach(entry => {
      stickyCta.style.opacity       = entry.isIntersecting ? '0' : '1';
      stickyCta.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto';
    });
  }, { threshold: 0.25 }).observe(reservasSec);
}


/* ─────────────────────────────────────────────────────────────
   5. FORMULARIO DE RESERVAS — validación + envío por WhatsApp
   (solo aplica en reservas.html)
───────────────────────────────────────────────────────────── */
function enviarReserva() {
  const ids    = ['nombre', 'telefono', 'personas', 'fecha', 'tipo'];
  const campos = ids.map(id => document.getElementById(id)).filter(Boolean);
  let valido   = true;

  campos.forEach(campo => {
    if (!campo.value.trim()) {
      campo.classList.add('error');
      valido = false;
    } else {
      campo.classList.remove('error');
    }
  });

  if (valido) {
    const [nombre, telefono, personas, fecha, tipo] = campos.map(c => encodeURIComponent(c.value));
    const msg = `Hola!%20Quiero%20reservar%20en%20Balneario%20Safari%20%F0%9F%8C%B4%0ANombre:%20${nombre}%0ATel%C3%A9fono:%20${telefono}%0APersonas:%20${personas}%0AFecha:%20${fecha}%0ATipo:%20${tipo}`;
    window.open(`https://wa.me/573000000000?text=${msg}`, '_blank');
  } else {
    /* Scroll al primer campo con error */
    document.querySelector('.error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

/* Quitar borde de error al comenzar a escribir */
document.querySelectorAll('input, select').forEach(el => {
  el.addEventListener('input', () => el.classList.remove('error'));
});


/* ─────────────────────────────────────────────────────────────
   6. ENLACE ACTIVO EN NAV — resalta la página actual
───────────────────────────────────────────────────────────── */
(function markActiveLink() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();
