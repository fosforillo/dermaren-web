// DERMAREN — interacciones base (sin dependencias externas)

// ============================================================
// Consentimiento de cookies (Ley 19.628 y Ley 21.719 sobre
// protección de datos personales, Chile — Ley 21.719 entra en
// vigencia el 1 de diciembre de 2026).
// Modelo "opt-in": las cookies no esenciales permanecen
// desactivadas hasta que la persona da su consentimiento
// explícito, específico e inequívoco. Puede revocarlo cuando
// quiera desde "Gestionar cookies" en el pie de página.
//
// SLOT: para activar Google Tag Manager, reemplazar GTM_ID por
// el ID real del contenedor (ej. "GTM-XXXXXXX"). Mientras GTM_ID
// sea null, este script no carga ningún script de terceros:
// solo registra la preferencia de la persona.
// ============================================================
var GTM_ID = null;

(function () {
  var CLAVE_CONSENTIMIENTO = "dermaren_consentimiento_cookies";

  function leerConsentimiento() {
    try {
      var guardado = window.localStorage.getItem(CLAVE_CONSENTIMIENTO);
      return guardado ? JSON.parse(guardado) : null;
    } catch (e) {
      return null;
    }
  }

  function guardarConsentimiento(preferencias) {
    var registro = {
      necesarias: true,
      analiticas: !!preferencias.analiticas,
      marketing: !!preferencias.marketing,
      fecha: new Date().toISOString(),
    };
    try {
      window.localStorage.setItem(CLAVE_CONSENTIMIENTO, JSON.stringify(registro));
    } catch (e) {
      /* localStorage no disponible: la preferencia solo aplica a esta carga de página */
    }
    return registro;
  }

  function cargarGTM(id) {
    if (!id || window.__gtmCargado) return;
    window.__gtmCargado = true;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtm.js?id=" + id;
    document.head.appendChild(script);
  }

  function aplicarConsentimiento(registro) {
    window.dataLayer = window.dataLayer || [];
    // Google Consent Mode v2: por defecto todo denegado, se actualiza según elección real.
    window.dataLayer.push({
      event: "actualizar_consentimiento",
      analytics_storage: registro.analiticas ? "granted" : "denied",
      ad_storage: registro.marketing ? "granted" : "denied",
      ad_user_data: registro.marketing ? "granted" : "denied",
      ad_personalization: registro.marketing ? "granted" : "denied",
    });
    if (registro.analiticas || registro.marketing) {
      cargarGTM(GTM_ID);
    }
  }

  function iniciarBannerCookies() {
    var banner = document.querySelector("[data-cookies-banner]");
    var modal = document.querySelector("[data-cookies-modal]");
    if (!banner || !modal) return;

    var toggleAnaliticas = modal.querySelector('[data-cookies-toggle="analiticas"]');
    var toggleMarketing = modal.querySelector('[data-cookies-toggle="marketing"]');

    function mostrarBanner() { banner.hidden = false; }
    function ocultarBanner() { banner.hidden = true; }
    function abrirModal(preferencias) {
      if (toggleAnaliticas) toggleAnaliticas.checked = !!(preferencias && preferencias.analiticas);
      if (toggleMarketing) toggleMarketing.checked = !!(preferencias && preferencias.marketing);
      modal.hidden = false;
    }
    function cerrarModal() { modal.hidden = true; }

    function confirmar(preferencias) {
      var registro = guardarConsentimiento(preferencias);
      aplicarConsentimiento(registro);
      ocultarBanner();
      cerrarModal();
    }

    banner.querySelectorAll("[data-cookies-aceptar]").forEach(function (btn) {
      btn.addEventListener("click", function () { confirmar({ analiticas: true, marketing: true }); });
    });
    banner.querySelectorAll("[data-cookies-rechazar]").forEach(function (btn) {
      btn.addEventListener("click", function () { confirmar({ analiticas: false, marketing: false }); });
    });
    banner.querySelectorAll("[data-cookies-personalizar]").forEach(function (btn) {
      btn.addEventListener("click", function () { abrirModal(leerConsentimiento()); });
    });
    modal.querySelectorAll("[data-cookies-guardar]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        confirmar({
          analiticas: toggleAnaliticas ? toggleAnaliticas.checked : false,
          marketing: toggleMarketing ? toggleMarketing.checked : false,
        });
      });
    });
    modal.querySelectorAll("[data-cookies-cerrar]").forEach(function (btn) {
      btn.addEventListener("click", cerrarModal);
    });

    // Enlace "Gestionar cookies" del pie de página, disponible en todo momento.
    document.querySelectorAll("[data-cookies-gestionar]").forEach(function (enlace) {
      enlace.addEventListener("click", function (evento) {
        evento.preventDefault();
        abrirModal(leerConsentimiento());
      });
    });

    var registroExistente = leerConsentimiento();
    if (registroExistente) {
      aplicarConsentimiento(registroExistente);
    } else {
      mostrarBanner();
    }
  }

  document.addEventListener("DOMContentLoaded", iniciarBannerCookies);
})();

document.addEventListener("DOMContentLoaded", function () {
  // Habilita el estado inicial oculto de [data-reveal] solo si JS corrió,
  // así el contenido nunca depende del script para ser visible/legible.
  document.body.classList.add("js-reveal");

  // Menú móvil
  var toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      document.body.classList.toggle("menu-abierto");
      var expandido = document.body.classList.contains("menu-abierto");
      toggle.setAttribute("aria-expanded", expandido ? "true" : "false");
    });
    document.querySelectorAll(".nav-links a").forEach(function (link) {
      link.addEventListener("click", function () {
        document.body.classList.remove("menu-abierto");
      });
    });
  }

  // Acordeón FAQ
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var pregunta = item.querySelector(".faq-pregunta");
    if (!pregunta) return;
    pregunta.addEventListener("click", function () {
      var abierto = item.getAttribute("data-abierto") === "true";
      document.querySelectorAll(".faq-item").forEach(function (otro) {
        otro.setAttribute("data-abierto", "false");
        otro.querySelector(".faq-pregunta").setAttribute("aria-expanded", "false");
      });
      item.setAttribute("data-abierto", abierto ? "false" : "true");
      pregunta.setAttribute("aria-expanded", abierto ? "false" : "true");
    });
  });

  // Revelado suave al hacer scroll
  var elementos = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && elementos.length) {
    var observador = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("en-vista");
            observador.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    elementos.forEach(function (el) { observador.observe(el); });
  } else {
    elementos.forEach(function (el) { el.classList.add("en-vista"); });
  }

  // Año dinámico en el pie de página
  document.querySelectorAll("[data-anio]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Registro simple de eventos de conversión (dataLayer) para clicks de reserva
  document.querySelectorAll("[data-evento-reserva]").forEach(function (el) {
    el.addEventListener("click", function () {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "click_reserva",
        origen_boton: el.getAttribute("data-evento-reserva") || "cta_general",
      });
    });
  });

  // Carrusel de opiniones (funciona sin JS gracias a scroll nativo con
  // scroll-snap; este bloque agrega botones prev/next y los puntos, con
  // una animación propia en vez de depender de scrollTo({behavior:"smooth"})
  // del navegador, que en algunos navegadores/dispositivos no se mueve.
  //
  // Importante: como en pantallas anchas se ven 2 o 3 opiniones a la vez,
  // no todas las opiniones pueden llegar a ser "la de más a la izquierda"
  // (las últimas quedan pegadas al borde derecho antes de eso). Por eso
  // se calcula cuántas posiciones distintas existen realmente
  // (calcularIndiceMaximo) y los puntos/flechas solo navegan hasta ahí,
  // para no dar la impresión de que hay más opiniones de las 5 reales.
  document.querySelectorAll("[data-carrusel]").forEach(function (carrusel) {
    var track = carrusel.querySelector("[data-carrusel-track]");
    var slides = Array.prototype.slice.call(carrusel.querySelectorAll("[data-carrusel-slide]"));
    var btnPrev = carrusel.querySelector("[data-carrusel-prev]");
    var btnNext = carrusel.querySelector("[data-carrusel-next]");
    var contenedorPuntos = carrusel.querySelector("[data-carrusel-dots]");
    if (!track || !slides.length) return;

    var indiceActivo = 0;
    var indiceMaximo = 0;
    var animacionEnCurso = null;
    var puntos = [];

    function calcularIndiceMaximo() {
      var maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      for (var i = slides.length - 1; i >= 0; i--) {
        if (slides[i].offsetLeft <= maxScroll + 1) return i;
      }
      return 0;
    }

    function reconstruirPuntos() {
      if (!contenedorPuntos) return;
      contenedorPuntos.innerHTML = "";
      puntos = [];
      for (var indice = 0; indice <= indiceMaximo; indice++) {
        (function (indice) {
          var punto = document.createElement("button");
          punto.type = "button";
          punto.className = "carrusel-dot";
          punto.setAttribute("aria-label", "Ir a la opinión " + (indice + 1));
          punto.addEventListener("click", function () { irASlide(indice); });
          contenedorPuntos.appendChild(punto);
          puntos.push(punto);
        })(indice);
      }
    }

    function actualizarControles() {
      puntos.forEach(function (punto, indice) {
        punto.classList.toggle("activo", indice === indiceActivo);
      });
      if (btnPrev) btnPrev.disabled = indiceActivo <= 0;
      if (btnNext) btnNext.disabled = indiceActivo >= indiceMaximo;
    }

    function desplazarA(destinoLeft) {
      if (animacionEnCurso) cancelAnimationFrame(animacionEnCurso);
      var inicio = track.scrollLeft;
      var distancia = destinoLeft - inicio;
      if (Math.abs(distancia) < 1) return;
      var duracion = 350;
      var t0 = null;
      function paso(marca) {
        if (t0 === null) t0 = marca;
        var progreso = Math.min((marca - t0) / duracion, 1);
        var suavizado = 1 - Math.pow(1 - progreso, 3); // ease-out cubic
        track.scrollLeft = inicio + distancia * suavizado;
        if (progreso < 1) {
          animacionEnCurso = requestAnimationFrame(paso);
        } else {
          animacionEnCurso = null;
        }
      }
      animacionEnCurso = requestAnimationFrame(paso);
    }

    function irASlide(indice) {
      indiceActivo = Math.max(0, Math.min(indice, indiceMaximo));
      desplazarA(slides[indiceActivo].offsetLeft);
      actualizarControles();
    }

    function indiceMasCercanoAScroll() {
      // Se usa solo para sincronizar los controles si la persona arrastra el
      // carrusel manualmente (touch / swipe / trackpad).
      var posicion = track.scrollLeft;
      var mejorIndice = 0;
      var mejorDistancia = Infinity;
      slides.forEach(function (slide, indice) {
        var distancia = Math.abs(slide.offsetLeft - posicion);
        if (distancia < mejorDistancia) {
          mejorDistancia = distancia;
          mejorIndice = indice;
        }
      });
      return Math.min(mejorIndice, indiceMaximo);
    }

    function recalcularLayout() {
      indiceMaximo = calcularIndiceMaximo();
      indiceActivo = Math.min(indiceActivo, indiceMaximo);
      reconstruirPuntos();
      actualizarControles();
    }

    if (btnPrev) {
      btnPrev.addEventListener("click", function () { irASlide(indiceActivo - 1); });
    }
    if (btnNext) {
      btnNext.addEventListener("click", function () { irASlide(indiceActivo + 1); });
    }

    var pendienteScroll;
    track.addEventListener("scroll", function () {
      if (animacionEnCurso) return; // evita pisar el índice mientras animamos nosotros mismos
      clearTimeout(pendienteScroll);
      pendienteScroll = setTimeout(function () {
        indiceActivo = indiceMasCercanoAScroll();
        actualizarControles();
      }, 120);
    });

    var pendienteResize;
    window.addEventListener("resize", function () {
      clearTimeout(pendienteResize);
      pendienteResize = setTimeout(recalcularLayout, 150);
    });

    recalcularLayout();
  });
});
