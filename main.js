/* ══════════════════════════════════════════════════════════════
   BALNEARIO SAFARI — main.js
   JavaScript compartido por todas las páginas.
   Cada funcionalidad verifica primero si los elementos existen,
   evitando errores en páginas que no utilizan determinadas funciones.
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

    hamburger.setAttribute(
      'aria-expanded',
      String(isOpen)
    );

    document.body.style.overflow =
      isOpen ? 'hidden' : '';
  });


  /* Cerrar al hacer clic en cualquier enlace del menú */

  navLinks.querySelectorAll('a').forEach(link => {

    link.addEventListener('click', () => {

      navLinks.classList.remove('open');

      hamburger.classList.remove('open');

      hamburger.setAttribute(
        'aria-expanded',
        'false'
      );

      document.body.style.overflow = '';
    });

  });

}


/* ─────────────────────────────────────────────────────────────
   2. PASARELA DE FOTOGRAFÍAS
   Solo se ejecuta en páginas que tienen slider.
───────────────────────────────────────────────────────────── */

const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

const prevButton =
  document.querySelector('.slider-prev');

const nextButton =
  document.querySelector('.slider-next');

const slider =
  document.querySelector('.photo-slider');


/*
   Ejecutamos el slider únicamente si existe
   al menos una fotografía.
*/

if (slides.length > 0 && slider) {

  let currentSlide = 0;
  let autoSlide;


  /* ── Mostrar fotografía ── */

  function showSlide(index) {

    /*
       Evita errores si el índice no existe.
    */

    if (index < 0 || index >= slides.length) {
      return;
    }


    slides.forEach(slide => {
      slide.classList.remove('active');
    });


    dots.forEach(dot => {
      dot.classList.remove('active');
    });


    slides[index].classList.add('active');


    /*
       Puede existir una diferencia entre
       cantidad de fotografías e indicadores.
       Por seguridad verificamos que exista.
    */

    if (dots[index]) {
      dots[index].classList.add('active');
    }


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
      (currentSlide - 1 + slides.length) %
      slides.length;

    showSlide(previous);
  }


  /* ── Cambio automático ── */

  function startAutoSlide() {

    autoSlide = setInterval(() => {

      nextSlide();

    }, 5000);

  }


  function restartAutoSlide() {

    clearInterval(autoSlide);

    startAutoSlide();

  }


  /* ── Botón siguiente ── */

  if (nextButton) {

    nextButton.addEventListener('click', () => {

      nextSlide();

      restartAutoSlide();

    });

  }


  /* ── Botón anterior ── */

  if (prevButton) {

    prevButton.addEventListener('click', () => {

      prevSlide();

      restartAutoSlide();

    });

  }


  /* ── Indicadores ── */

  dots.forEach((dot, index) => {

    /*
       Solo asignamos eventos a indicadores
       que correspondan a una fotografía.
    */

    if (index < slides.length) {

      dot.addEventListener('click', () => {

        showSlide(index);

        restartAutoSlide();

      });

    }

  });


  /* ── Iniciar pasarela automática ── */

  startAutoSlide();


  /* ═══════════════════════════════════════════════════════════
     SOPORTE PARA SWIPE EN MÓVILES
  ═══════════════════════════════════════════════════════════ */

  let touchStartX = 0;
  let touchEndX = 0;


  slider.addEventListener(
    'touchstart',
    (event) => {

      touchStartX =
        event.changedTouches[0].screenX;

    },
    { passive: true }
  );


  slider.addEventListener(
    'touchend',
    (event) => {

      touchEndX =
        event.changedTouches[0].screenX;

      handleSwipe();

    },
    { passive: true }
  );


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

}


/* ─────────────────────────────────────────────────────────────
   3. SCROLL REVEAL
───────────────────────────────────────────────────────────── */

const revealElements =
  document.querySelectorAll('.reveal');


/*
   Si el navegador soporta IntersectionObserver,
   utilizamos la animación.
*/

if ('IntersectionObserver' in window) {

  const revealObs =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.classList.add('visible');

            revealObs.unobserve(entry.target);

          }

        });

      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -20px 0px'
      }
    );


  revealElements.forEach(el => {

    revealObs.observe(el);

  });


/*
   Si el navegador no soporta IntersectionObserver,
   mostramos directamente el contenido.
*/

} else {

  revealElements.forEach(el => {

    el.classList.add('visible');

  });

}


/* ─────────────────────────────────────────────────────────────
   4. NAVBAR — cambia fondo al hacer scroll
───────────────────────────────────────────────────────────── */

const navbar =
  document.getElementById('navbar');


if (navbar) {

  window.addEventListener(
    'scroll',
    () => {

      navbar.style.background =
        window.scrollY > 55
          ? 'rgba(0,40,50,0.97)'
          : 'rgba(0,155,160,0.96)';

    },
    { passive: true }
  );

}


/* ─────────────────────────────────────────────────────────────
   5. STICKY CTA MÓVIL
───────────────────────────────────────────────────────────── */

const stickyCta =
  document.getElementById('stickyCta');

const reservasSec =
  document.getElementById('reservas');


if (stickyCta && reservasSec) {

  new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        stickyCta.style.opacity =
          entry.isIntersecting ? '0' : '1';

        stickyCta.style.pointerEvents =
          entry.isIntersecting
            ? 'none'
            : 'auto';

      });

    },
    {
      threshold: 0.25
    }
  ).observe(reservasSec);

}


/* ─────────────────────────────────────────────────────────────
   6. FORMULARIO DE RESERVAS
───────────────────────────────────────────────────────────── */

function enviarReserva() {

  const ids = [
    'nombre',
    'telefono',
    'personas',
    'fecha',
    'tipo'
  ];


  const campos =
    ids
      .map(id => document.getElementById(id))
      .filter(Boolean);


  let valido = true;


  campos.forEach(campo => {

    if (!campo.value.trim()) {

      campo.classList.add('error');

      valido = false;

    } else {

      campo.classList.remove('error');

    }

  });


  if (valido) {

    const [
      nombre,
      telefono,
      personas,
      fecha,
      tipo
    ] =
      campos.map(
        c => encodeURIComponent(c.value)
      );


    const msg =
      `Hola!%20Quiero%20reservar%20en%20Balneario%20Safari%20%F0%9F%8C%B4` +
      `%0ANombre:%20${nombre}` +
      `%0ATel%C3%A9fono:%20${telefono}` +
      `%0APersonas:%20${personas}` +
      `%0AFecha:%20${fecha}` +
      `%0ATipo:%20${tipo}`;


    window.open(
      `https://wa.me/573000000000?text=${msg}`,
      '_blank'
    );


  } else {

    document
      .querySelector('.error')
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });

  }

}


/* ── Quitar error al comenzar a escribir ── */

document
  .querySelectorAll('input, select')
  .forEach(el => {

    el.addEventListener('input', () => {

      el.classList.remove('error');

    });

  });


/* ─────────────────────────────────────────────────────────────
   7. ENLACE ACTIVO EN NAV
───────────────────────────────────────────────────────────── */

(function markActiveLink() {

  const current =
    window.location.pathname
      .split('/')
      .pop() || 'index.html';


  document
    .querySelectorAll('.nav-links a')
    .forEach(link => {

      const href =
        link.getAttribute('href');


      if (
        href === current ||
        (current === '' &&
         href === 'index.html')
      ) {

        link.classList.add('active');

      }

    });

})();
