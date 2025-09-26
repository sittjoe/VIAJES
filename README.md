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

La carpeta `docs/` incluye todos los archivos (`index.html`, `styles.css`, `script.js`) y un archivo `.nojekyll` para desactivar Jekyll.

### Despliegue automático (recomendado)

1. Asegúrate de que la rama predeterminada del repositorio sea `main`.
2. Ve a **Settings → Pages** y, en la sección **Build and deployment**, selecciona **GitHub Actions**.
3. Cada vez que hagas `git push` a `main`, el flujo de trabajo `.github/workflows/deploy.yml` publicará automáticamente el contenido de `docs/` en `https://<tu_usuario>.github.io/<tu_repo>/`.

### Publicación manual

Si prefieres controlar la publicación manualmente, ve a **Actions → Deploy landing page** y ejecuta el flujo de trabajo con **Run workflow** después de subir tus cambios.

## Configurar el envío de formularios (correo y dashboard)

La landing utiliza [Formspree](https://formspree.io/) para guardar las respuestas y reenviarlas por correo electrónico. Sigue estos pasos:

1. Crea una cuenta gratuita en Formspree y genera un formulario para **Carritos confirmados** y otro para **Contacto** (opcional si quieres separar los mensajes).
2. Copia los IDs de cada formulario. Tienen el formato `https://formspree.io/f/<tu_form_id>`.
3. Abre `docs/script.js` y reemplaza los valores de las constantes `PAYMENT_FORM_ENDPOINT` y `CONTACT_FORM_ENDPOINT` con las URLs de tus formularios.
4. Publica nuevamente el sitio o sube los cambios a GitHub Pages.

### ¿Dónde veo la información?

* Panel/Formulario: inicia sesión en [https://dashboard.formspree.io/forms](https://dashboard.formspree.io/forms) para revisar todas las respuestas almacenadas.
* Correo: en la configuración de cada formulario agrega el correo donde quieres recibir las notificaciones.

> **Importante:** Esta landing está pensada como demostración. No recolectes números de tarjeta reales sin cumplir con las normativas PCI DSS y sin contar con un proveedor certificado.
