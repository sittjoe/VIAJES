# VIAJES Landing Page

Este repositorio contiene la landing page estática para presentar los carritos de compra de viajes para clientes.

## Cómo visualizarla localmente

1. Instala las dependencias necesarias para ejecutar un servidor estático (por ejemplo Python).
2. Desde la carpeta `docs/`, ejecuta:
   ```bash
   python -m http.server 8000
   ```
3. Abre `http://localhost:8000/` en tu navegador.

## Publicación en GitHub Pages

La carpeta `docs/` incluye todos los archivos (`index.html`, `styles.css`, `script.js`) y un archivo `.nojekyll` para desactivar Jekyll. Configura GitHub Pages para usar la carpeta `docs/` como fuente y la landing page se mostrará automáticamente.
