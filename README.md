# Dermaren — Sitio web (primera maqueta)

Sitio estático (HTML/CSS/JS sin build) para la clínica dermatológica **Dermaren**,
de la Dra. Katerine Codriansky. Diseñado según el brandbook entregado
(paleta azul petróleo / verde agua / champagne / beige, tipografía
Cormorant Garamond + Montserrat).

## Estructura

```
/index.html               Página de inicio
/servicios.html           Especialidades dermatológicas
/sobre-la-doctora.html    Perfil de la Dra. Katerine Codriansky
/contacto.html            Formulario, FAQ y ubicación
/aviso-legal.html         Aviso legal y política de privacidad
/404.html                 Página de error
/assets/css/style.css     Estilos
/assets/js/main.js        Interacciones (menú, FAQ, animaciones)
/assets/img/              Imágenes (placeholders a reemplazar por fotografía real)
/robots.txt, /sitemap.xml, /llms.txt   SEO y GEO técnico
/netlify.toml             Configuración de despliegue en Netlify
```

## Pendientes marcados en el código (buscar "[PENDIENTE]")

- Dirección exacta de la clínica, teléfono/WhatsApp real, horarios.
- Biografía completa y credenciales de la Dra. Codriansky.
- Testimonios reales de pacientes (con autorización).
- Fotografía profesional (actualmente hay placeholders generados en `/assets/img`).
- Confirmar si se trabaja con convenios de salud (Fonasa/isapres).

## Conectar Google y Meta (pendiente de credenciales)

Cada página tiene comentado un bloque de **Google Tag Manager** en el `<head>`
y el `<body>`. Al tener el ID del contenedor (`GTM-XXXXXXX`):

1. Descomentar los dos bloques de GTM en cada archivo `.html`.
2. Desde GTM, agregar y publicar las etiquetas de: Google Analytics 4,
   Google Ads (conversión de "Reservar hora" / envío de formulario) y
   Meta Pixel (con el evento estándar `Lead` en el envío del formulario).
3. Verificar el sitio en Google Search Console (por meta tag, ya hay un
   slot comentado en `index.html`, o por archivo HTML de verificación).
4. El formulario de contacto (`contacto.html`) ya incluye el atributo
   `name="contacto"` listo para **Netlify Forms**; basta con agregar
   `data-netlify="true"` al `<form>` una vez desplegado en Netlify (o
   reemplazar la acción del formulario por el proveedor que prefieran).
5. Los botones de reserva ya emiten un evento `click_reserva` al
   `dataLayer` (ver `assets/js/main.js`), listo para usarse como
   disparador de conversión en GTM/Google Ads/Meta.

## Despliegue en Netlify

El repositorio ya incluye `netlify.toml` (publica la raíz del proyecto,
sin paso de build). Basta con conectar el repositorio de GitHub desde
Netlify y desplegar.
