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
  // scroll-snap; este bloque solo agrega botones prev/next y los puntos).
  document.querySelectorAll("[data-carrusel]").forEach(function (carrusel) {
    var track = carrusel.querySelector("[data-carrusel-track]");
    var slides = Array.prototype.slice.call(carrusel.querySelectorAll("[data-carrusel-slide]"));
    var btnPrev = carrusel.querySelector("[data-carrusel-prev]");
    var btnNext = carrusel.querySelector("[data-carrusel-next]");
    var contenedorPuntos = carrusel.querySelector("[data-carrusel-dots]");
    if (!track || !slides.length) return;

    var puntos = [];
    if (contenedorPuntos) {
      slides.forEach(function (_, indice) {
        var punto = document.createElement("button");
        punto.type = "button";
        punto.className = "carrusel-dot";
        punto.setAttribute("aria-label", "Ir a la opinión " + (indice + 1));
        punto.addEventListener("click", function () { irASlide(indice); });
        contenedorPuntos.appendChild(punto);
        puntos.push(punto);
      });
    }

    function indiceActual() {
      var centro = track.scrollLeft + track.clientWidth / 2;
      var mejorIndice = 0;
      var mejorDistancia = Infinity;
      slides.forEach(function (slide, indice) {
        var centroSlide = slide.offsetLeft + slide.offsetWidth / 2;
        var distancia = Math.abs(centroSlide - centro);
        if (distancia < mejorDistancia) {
          mejorDistancia = distancia;
          mejorIndice = indice;
        }
      });
      return mejorIndice;
    }

    function actualizarPuntos() {
      if (!puntos.length) return;
      var actual = indiceActual();
      puntos.forEach(function (punto, indice) {
        punto.classList.toggle("activo", indice === actual);
      });
    }

    function irASlide(indice) {
      var destino = slides[Math.max(0, Math.min(indice, slides.length - 1))];
      track.scrollTo({ left: destino.offsetLeft, behavior: "smooth" });
    }

    if (btnPrev) {
      btnPrev.addEventListener("click", function () { irASlide(indiceActual() - 1); });
    }
    if (btnNext) {
      btnNext.addEventListener("click", function () { irASlide(indiceActual() + 1); });
    }

    var pendiente;
    track.addEventListener("scroll", function () {
      clearTimeout(pendiente);
      pendiente = setTimeout(actualizarPuntos, 100);
    });

    actualizarPuntos();
  });
});
