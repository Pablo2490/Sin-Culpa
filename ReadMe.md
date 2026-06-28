# 🛒 Sin Culpa
 
**Sin Culpa** es un modelo de e-commerce multirubro desarrollado como proyecto académico, inspirado en grandes empresas como Mercado Libre y Amazon. Permite a los usuarios explorar y comprar productos de distintas categorías (tecnología, ropa, electrodomésticos, celulares y más), con un carrito de compras persistente y un proceso de compra completo y simple.

---
 
## 🌐 Demo
 
https://sin-culpa.netlify.app/
 
---
 
## 🗂️ Estructura del proyecto
 
```
Sin-Culpa/
├── index.html                          # Página principal (home)
├── main.js                             # Lógica principal e interactividad
├── navbar.js                           # Navbar dinámica generada por JS
├── footer.js                           # Footer dinámico generado por JS
├── productos.js                        # Carga y renderizado de productos desde API
├── estilos_index.css                   # Estilos del home
├── estilos_navbar_&_footer.css         # Estilos de navbar y footer
├── assets/                             # Recursos generales
├── iconos/                             # Íconos del proyecto
├── img/                                # Imágenes y logos
└── pages/
    ├── carrito/
    │   ├── carrito.html                # Vista del carrito de compras
    │   ├── carrito.js
    │   └── estilos_carrito.css
    ├── ofertas/
    │   ├── ofertas.html                # Página de ofertas
    │   ├── ofertas.js
    │   └── estilos_ofertas.css
    ├── pages_footer/
    │   ├── contacto.html               # Formulario de contacto
    │   ├── contacto.js
    │   ├── estilos_Contacto.css
    │   ├── estilos_FAQ.css
    │   ├── estilos_Historia.css
    │   ├── historia.html               # Historia de la empresa
    │   └── preguntas_frecuentes.html   # FAQ
    ├── pago/
    │   ├── pagos.html                  # Proceso de pago
    │   ├── pagos.js
    │   └── estilos_pagos.css
    ├── perfil_de_usuario/
    │   ├── perfil_de_usuario.html      # Perfil del usuario
    │   ├── perfil_de_usuario.js
    │   └── estilos_PerfilUsuario.css
    └── registro_&_login/
        ├── login.html                  # Inicio de sesión
        ├── login.js
        ├── registro_de_cuenta.html     # Registro de nuevo usuario
        ├── registro.js
        ├── estilos_crear_cuenta.css
        └── estilos_ingresar.css
```
 
---
 
## 🚀 Tecnologías utilizadas
 
| Tecnología | Uso |
|---|---|
| HTML5 semántico | Estructura con `header`, `nav`, `main`, `section`, `footer` |
| CSS3 | Estilos, Flexbox, Grid y diseño responsivo |
| JavaScript (Vanilla) | Lógica, DOM, validaciones, carrito, Fetch API |
| Font Awesome | Íconos |
| Google Fonts (Nunito + Pacifico) | Tipografía |
| SweetAlert2 | Alertas y notificaciones |
| Fetch API | Consumo de productos desde API REST externa |
| localStorage | Persistencia del carrito entre sesiones |
 
---
 
## ⚙️ Funcionalidades
 
- 🎠 **Carrusel de productos destacados** generado dinámicamente.
- 🔍 **Buscador de productos** con filtro por categoría.
- 🃏 **Catálogo de productos en cards** obtenidos desde una API REST con imagen, título y precio.
- 🛒 **Carrito de compras dinámico** — agregar, editar cantidad y eliminar productos.
- 💾 **Persistencia del carrito** con `localStorage` (sobrevive al cierre/recarga).
- 🔢 **Contador en tiempo real** del total de productos en el carrito.
- 💰 **Total dinámico** que se actualiza al modificar el carrito.
- 💳 **Proceso de pago** con página dedicada.
- ⭐ **Reseñas de clientes** cargadas dinámicamente.
- 📬 **Formulario de contacto** funcional vía localStorage.
- ✅ **Validaciones de formulario** (campos requeridos y formato de correo)
- 👤 **Perfil de usuario** y gestión de cuenta
- 🔐 **Registro e inicio de sesión**
- 📄 **Páginas institucionales** (historia, contacto, preguntas frecuentes)
- 📱 **Diseño responsivo** con Flexbox, Grid y Media Queries
- ♿ **Accesibilidad** — atributos `aria`, `alt` en imágenes, navegación por teclado
- 🔎 **SEO básico** — metatags, Open Graph, keywords y descripción en el `<head>`
- 🧭 **Navbar y footer dinámicos** generados por JavaScript
---

## 🔌 API utilizada
 
Los productos se obtienen desde una API REST externa mediante `fetch`. Cada producto muestra:
- Imagen
- Título
- Precio
> _(API UTILIZADA: FakeStore API)_
 
---
 
## 👤 Autor
 
| Nombre | GitHub |
|---|---|
| Pablo Buttazzoni | [@Pablo2490](https://github.com/Pablo2490) |
 
---
 
## 📌 Estado del proyecto
 
🟡 En desarrollo y constante actualizacion — proyecto académico
 
---
 
## 📄 Licencia
 
Este proyecto fue desarrollado con fines educativos.
