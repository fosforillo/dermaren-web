// DERMAREN — interacciones base (sin dependencias externas)

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
});
