if (sessionStorage.getItem("isLoggedIn") === null) {
    sessionStorage.setItem("isLoggedIn", "false");
    sessionStorage.setItem("userName", "");
}
 
let hamburgerClick = false;
 
function getCartCount() {
    const cart = JSON.parse(localStorage.getItem("sc_carrito")) || [];
    return cart.reduce((acc, item) => acc + (item.cantidad || 1), 0);
}
 
function updateCartBadge() {
    const badges = document.querySelectorAll(".cart-badge");
    const count = getCartCount();
    badges.forEach(b => {
        b.textContent = count;
        b.style.display = count > 0 ? "inline-flex" : "none";
    });
    document.querySelectorAll(".nav-cart-label").forEach(el => {
        el.textContent = `Carrito (${count})`;
    });
}
 
function inicializarNavbar() {
    const isLoggedIn  = sessionStorage.getItem("isLoggedIn") === "true";
    const userName    = sessionStorage.getItem("userName") || "";
    const displayName = sessionStorage.getItem("displayName") || userName;
 
    const navLinksContainer = document.getElementById("nav-links");
    const userContainer     = document.getElementById("user-container");
    if (!navLinksContainer || !userContainer) return;
 
    const esSubcarpeta = window.location.pathname.includes("/pages/");
    const prefijo      = esSubcarpeta ? "../../" : "./";
    const enPerfil     = window.location.pathname.includes("/perfil_de_usuario/");
 
    const logoEl = document.querySelector(".sc-logo a");
    if (logoEl) {
        logoEl.href = `${prefijo}index.html`;
        const img = logoEl.querySelector("img");
        if (img) {
            img.src = `${prefijo}img/logos_nav_footer/logo_chico.png`;
            img.alt = "Sin Culpa — Compras On-Line";
        }
    }
 
    const categoriasHTML =
        `<li><a href="${prefijo}index.html">Todos</a></li>` +
        CATEGORIAS.map(cat =>
            `<li><a href="${prefijo}index.html?categoria=${encodeURIComponent(cat)}">${cat}</a></li>`
        ).join("");
 
    const dropdownCategorias = `
        <li class="nav-dropdown">
            <a href="#" class="nav-dropdown-trigger">
                Categorías <i class="fa-solid fa-chevron-down"></i>
            </a>
            <ul class="nav-dropdown-menu">${categoriasHTML}</ul>
        </li>`;
 
    const cartCount   = getCartCount();
    const rutaCarrito = `${prefijo}pages/carrito/carrito.html`;
 
    const linksComunes = `
        <li><a href="${prefijo}index.html">Inicio</a></li>
        ${dropdownCategorias}
        <li><a href="${prefijo}pages/ofertas/ofertas.html">Ofertas</a></li>
        <li>
            <a href="${rutaCarrito}" class="nav-carrito-link">
                <i class="fa-solid fa-cart-shopping"></i>
                <span class="nav-cart-label">Carrito (${cartCount})</span>
                <span class="cart-badge" style="display:${cartCount > 0 ? 'inline-flex' : 'none'}">${cartCount}</span>
            </a>
        </li>
        <li><a href="#contacto-footer">Ayuda</a></li>`;
 
    navLinksContainer.innerHTML = linksComunes;
 
    if (isLoggedIn) {
        const listaUsuarios  = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
        const datosUsuario   = listaUsuarios.find(u => u.username?.toLowerCase() === userName.toLowerCase());
        const fotoNavbar     = datosUsuario?.avatar || `${prefijo}img/perfil_defecto.gif`;
        const rutaPerfil     = enPerfil ? "./perfil_de_usuario.html" : `${prefijo}pages/perfil_de_usuario/perfil_de_usuario.html`;
 
        userContainer.innerHTML = `
            <div class="perfil-dropdown-wrapper">
                <button class="dropdown-trigger" id="dropdownBtn">
                    <span class="nombre">¡Hola, ${displayName}!</span>
                    <img src="${fotoNavbar}" alt="Perfil">
                    <i class="fa-solid fa-chevron-down"></i>
                </button>
                <div class="dropdown-menu" id="dropdownMenu">
                    <a href="${rutaPerfil}"><i class="fa-solid fa-user"></i>Perfil de Usuario</a>
                    <a href="${rutaCarrito}"><i class="fa-solid fa-cart-shopping"></i>
                        Mi Carrito <span class="cart-badge-menu">${cartCount > 0 ? cartCount : ''}</span>
                    </a>
                    <hr>
                    <a href="#" id="logoutBtn" class="logout-link">
                        <i class="fa-solid fa-right-from-bracket"></i>Cerrar Sesión
                    </a>
                </div>
            </div>`;
 
        document.getElementById("dropdownBtn")?.addEventListener("click", function (e) {
            e.stopPropagation();
            document.getElementById("dropdownMenu").classList.toggle("show");
        });
 
        document.getElementById("logoutBtn")?.addEventListener("click", function (e) {
            e.preventDefault();
            sessionStorage.setItem("isLoggedIn", "false");
            sessionStorage.setItem("userName", "");
            sessionStorage.removeItem("displayName");
            sessionStorage.removeItem("ultimaBusqueda");
            sessionStorage.removeItem("vueloSeleccionado");
            window.location.href = `${prefijo}index.html`;
        });
 
    } else {
        // En desktop: botones en el user-container. En mobile: se ocultan de aquí
        // y se inyectan al final del menú hamburguesa.
        userContainer.innerHTML = `
            <div class="user-guest-actions">
                <a href="${prefijo}pages/registro_&_login/registro_de_cuenta.html" class="btn-guest btn-register">
                    <i class="fa-solid fa-user-plus"></i> Registrarse
                </a>
                <a href="${prefijo}pages/registro_&_login/login.html" class="btn-guest btn-login">
                    <i class="fa-solid fa-right-to-bracket"></i> Iniciar Sesión
                </a>
            </div>`;

        // Inyectar los mismos botones al final del nav-links (menú hamburguesa)
        // como un ítem separado con clase especial para mostrar sólo en mobile
        const guestMobileHTML = `
            <li class="nav-guest-mobile">
                <a href="${prefijo}pages/registro_&_login/registro_de_cuenta.html" class="btn-guest btn-register">
                    <i class="fa-solid fa-user-plus"></i> Registrarse
                </a>
                <a href="${prefijo}pages/registro_&_login/login.html" class="btn-guest btn-login">
                    <i class="fa-solid fa-right-to-bracket"></i> Iniciar Sesión
                </a>
            </li>`;
        navLinksContainer.insertAdjacentHTML("beforeend", guestMobileHTML);
    }
 
    const navDropdown        = document.querySelector(".nav-dropdown");
    const navDropdownTrigger = document.querySelector(".nav-dropdown-trigger");
    if (navDropdownTrigger && navDropdown) {
        navDropdownTrigger.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            navDropdown.classList.toggle("open");
        });
    }
 
    const hamburgerBtn = document.getElementById("hamburger-btn");
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener("click", function () {
            hamburgerClick = true;
            navLinksContainer.classList.toggle("open");
            setTimeout(() => { hamburgerClick = false; }, 0);
        });
    }
 
    updateCartBadge();
}
 
document.addEventListener("click", function (e) {
    const dropdown = document.getElementById("dropdownMenu");
    if (dropdown?.classList.contains("show") && !e.target.closest(".perfil-dropdown-wrapper")) {
        dropdown.classList.remove("show");
    }
    const nav = document.getElementById("nav-links");
    if (nav?.classList.contains("open") && !hamburgerClick && !e.target.closest("#nav-links") && !e.target.closest("#hamburger-btn")) {
        nav.classList.remove("open");
    }
    const navDropdown = document.querySelector(".nav-dropdown");
    if (navDropdown?.classList.contains("open") && !e.target.closest(".nav-dropdown")) {
        navDropdown.classList.remove("open");
    }
});
 
window.addEventListener("sc:cartUpdated", updateCartBadge);
 
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializarNavbar);
} else {
    inicializarNavbar();
}