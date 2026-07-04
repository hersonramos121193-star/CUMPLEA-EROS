# Dashboard de Cumpleañeros · Grupo Metelmex (App instalable / PWA)

## Qué es esto
Tu mismo dashboard de cumpleaños, empaquetado como **PWA (Progressive Web App)**:
- Se instala en el celular Android como si fuera una app (ícono en pantalla de inicio).
- Funciona **offline** una vez instalada (los datos de los 490 colaboradores están embebidos).
- El botón "Marcar como felicitado" (checkbox junto a cada nombre en el calendario) **guarda el estado en el propio dispositivo**, para que el equipo de RH lleve control de a quién ya se le mandó saludo/felicitación cada mes. Este dato se conserva aunque cierren la app o apaguen el celular.

## ⚠️ Requisito importante: necesita estar en un servidor HTTPS
Los navegadores (Chrome/Android) **solo permiten instalar una PWA y usar el Service Worker (modo offline) si los archivos se sirven desde una dirección https://**, no puede instalarse abriendo el `index.html` directamente desde el celular o correo.

### Opciones sencillas y gratuitas para publicarla:
1. **GitHub Pages** (recomendado, gratis): suben esta carpeta a un repositorio de GitHub y activan "Pages" en la configuración del repo. Les da una URL como `https://tuempresa.github.io/cumpleaneros/`.
2. **Servidor interno de Metelmex**: si cuentan con un servidor web interno (IIS, Apache, Nginx) con HTTPS, simplemente copian esta carpeta ahí.
3. **Netlify o Vercel** (gratis, arrastrar y soltar la carpeta): también generan una URL https:// en segundos.

## Cómo instalarla en Android (una vez publicada la URL)
1. Abrir la URL en **Chrome** desde el celular Android.
2. Tocar el menú (⋮) → **"Instalar app"** o **"Agregar a pantalla de inicio"**.
3. Confirmar. Aparecerá el ícono de la app en el celular, como cualquier otra app instalada.

## Actualizar los datos de los colaboradores
Los datos están embebidos dentro de `index.html` (variable `RAW_DATA`). Cuando tengan una matriz nueva, compártanla y se regenera el archivo con los datos actualizados — no hace falta tocar nada más del paquete (manifest, íconos, service worker siguen igual).

## Botón "+ Agregar colaborador"
El botón en la parte superior del dashboard permite dar de alta a un colaborador nuevo (ficha, nombre, fecha de nacimiento, departamento, puesto y clasificación) para consultarlo de inmediato en KPIs, alertas, calendario, búsqueda y tabla. **Importante**: como es una app sin servidor, estas altas se guardan únicamente en el navegador/celular donde se agregaron (no se comparten entre dispositivos ni quedan escritas en el archivo `index.html`). Para que un alta sea permanente y visible para todo el equipo, dentro del mismo botón hay que usar "Exportar agregados (Excel)" o "Copiar JSON" y enviarle esos datos a quien mantiene el archivo, para que los incorpore a `RAW_DATA` y regenere el paquete.

## Contenido del paquete
- `index.html` — la app completa (dashboard + lógica + datos).
- `manifest.json` — configuración de instalación (nombre, ícono, colores).
- `service-worker.js` — habilita el uso sin internet.
- `icons/` — íconos de la app en los tamaños requeridos por Android.
- `js/` — librerías (Chart.js y xlsx) incluidas localmente para que funcionen sin conexión.
