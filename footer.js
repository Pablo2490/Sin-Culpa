function renderFooter() {
    const footerContainer = document.getElementById("contacto-footer");
    if (!footerContainer) return;
 
    const esSubcarpeta  = window.location.pathname.includes("/pages/");
    const prefijo       = esSubcarpeta ? "../../" : "./";
    const enPerfil      = window.location.pathname.includes("/perfil_de_usuario/");
    const enFooterPages = window.location.pathname.includes("/pages_footer/");
    const enCarrito     = window.location.pathname.includes("/carrito/");
 
    const rutaHistoria  = enFooterPages
        ? "./historia.html"
        : `${prefijo}pages/pages_footer/historia.html`;
 
    const rutaContacto  = enFooterPages
        ? "./contacto.html"
        : `${prefijo}pages/pages_footer/contacto.html`;
 
    const rutaPreguntas = enFooterPages
        ? "./preguntas_frecuentes.html"
        : `${prefijo}pages/pages_footer/preguntas_frecuentes.html`;
 
    const rutaPerfil    = enPerfil
        ? "./perfil_de_usuario.html"
        : `${prefijo}pages/perfil_de_usuario/perfil_de_usuario.html`;
 
    const rutaCarrito   = enCarrito
        ? "./carrito.html"
        : `${prefijo}pages/carrito/carrito.html`;
 
    const rutaTerminos   = `${prefijo}assets/Terminos%20de%20Uso%20y%20Condiciones.pdf`;
    const rutaPrivacidad = `${prefijo}assets/Politica_de_Privacidad.pdf`;
 
    footerContainer.innerHTML = `
        <div class="footer-container">
 
            <div class="footer-header">
                <div class="footer-logo">
                    <a href="${prefijo}index.html">
                        <img src="${prefijo}img/logos_nav_footer/marca_logo.png" alt="Sin Culpa" class="logo-img">
                    </a>
                </div>
                <div class="footer-socials">
                    <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                        <img src="${prefijo}iconos/icono_ig.png" alt="Instagram">
                    </a>
                    <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                        <img src="${prefijo}iconos/icono_fb.png" alt="Facebook">
                    </a>
                    <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer">
                        <img src="${prefijo}iconos/icono_tiktok.png" alt="TikTok">
                    </a>
                    <a href="https://x.com/" target="_blank" rel="noopener noreferrer">
                        <img src="${prefijo}iconos/icono_X.png" alt="X">
                    </a>
                </div>
            </div>
 
            <div class="footer-columns">
                <div class="column">
                    <h3>Sobre Nosotros</h3>
                    <a href="${rutaHistoria}">Historia</a>
                    <a href="https://www.linkedin.com/company/mercadolibre/posts/?feedView=all"
                       target="_blank" rel="noopener noreferrer">Trabajá con nosotros</a>
                </div>
                <div class="column">
                    <h3>Mi Cuenta</h3>
                    <a href="${rutaPerfil}">Mi Perfil</a>
                    <a href="${rutaCarrito}">Mi Carrito</a>
                </div>
                <div class="column">
                    <h3>Atención al Cliente</h3>
                    <a href="${rutaContacto}">Contacto</a>
                    <a href="${rutaPreguntas}">Preguntas Frecuentes</a>
                    <a href="https://www.argentina.gob.ar/economia/industria-y-comercio/defensadelconsumidor"
                       target="_blank" rel="noopener noreferrer">Defensa del Consumidor</a>
                </div>
            </div>
 
            <div class="footer-bottom">
                <p>© 2026 Sin Culpa S.R.L. Todos los derechos reservados.</p>
                <div class="legal-links">
                    <a href="${rutaTerminos}" target="_blank" rel="noopener noreferrer">Términos y condiciones</a>
                    <a href="${rutaPrivacidad}" target="_blank" rel="noopener noreferrer">Privacidad</a>
                </div>
            </div>
 
        </div>
    `;
}
 
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderFooter);
} else {
    renderFooter();
}