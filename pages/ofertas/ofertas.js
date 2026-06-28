document.addEventListener("DOMContentLoaded", function () {
    renderOfertas();
    fetchMasOfertas();
});

function getOfertas() {
    const idsEnOferta = [2, 4, 7, 11, 12, 15, 17, 21, 24];
    const descuentos = { 2: 15, 4: 20, 7: 25, 11: 10, 12: 18, 15: 22, 17: 30, 21: 20, 24: 15 };

    return PRODUCTOS
        .filter(p => idsEnOferta.includes(p.id))
        .map(p => {
            const descuento = descuentos[p.id] || 10;
            const precioOriginal = p.precio;
            const precioFinal = Math.round(precioOriginal * (1 - descuento / 100));
            return { ...p, precioOriginal, precio: precioFinal, descuento };
        });
}

function generarPlaceholderOferta(nombre) {
    const colores = ["68a9df", "d8b541", "4a7fb5", "e8c55a", "5b9bd5"];
    const idx = Math.abs(nombre.charCodeAt(0) + nombre.length) % colores.length;
    const color = colores[idx];
    const texto = encodeURIComponent(nombre.substring(0, 20));
    return `https://placehold.co/300x200/${color}/ffffff?text=${texto}`;
}

function renderOfertas() {
    const grid = document.getElementById("ofertas-grid");
    const empty = document.getElementById("ofertas-empty");
    if (!grid) return;

    const ofertas = getOfertas();

    if (ofertas.length === 0) {
        grid.innerHTML = "";
        if (empty) empty.style.display = "flex";
        return;
    }

    if (empty) empty.style.display = "none";

    grid.innerHTML = ofertas.map(p => renderOfertaCardHTML(p)).join("");
}

function renderOfertaCardHTML(p) {
    const imgSrc = getImagenProducto(p) || generarPlaceholderOferta(p.nombre);
    const cuotaValor = calcularCuota(p.precio, p.cuotas);

    return `
    <article class="oferta-card" data-id="${p.id}" aria-label="Oferta: ${p.nombre}">
        <span class="oferta-card__badge">-${p.descuento}%</span>
        <div class="oferta-card__img-wrapper">
            <img src="${imgSrc}" alt="${p.nombre}" class="oferta-card__img" loading="lazy">
        </div>
        <div class="oferta-card__body">
            <span class="oferta-card__cat">${p.categoria}</span>
            <h3 class="oferta-card__title">${p.nombre}</h3>
            <div class="oferta-card__precios">
                <span class="oferta-card__precio-original">${formatPrecio(p.precioOriginal)}</span>
                <span class="oferta-card__precio-final">${formatPrecio(p.precio)}</span>
            </div>
            <p class="oferta-card__cuotas">
                <i class="fa-solid fa-credit-card"></i>
                ${p.cuotas}x de ${cuotaValor} sin interés
            </p>
            <button
                class="oferta-card__btn-cart"
                onclick="agregarAlCarritoOferta(${p.id})"
                aria-label="Agregar ${p.nombre} al carrito"
            >
                <i class="fa-solid fa-cart-plus"></i> Agregar al carrito
            </button>
        </div>
    </article>
    `;
}

function agregarAlCarritoOferta(productoId) {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {
        if (typeof Swal !== "undefined") {
            const esSubcarpeta = window.location.pathname.includes("/pages/");
            const prefijo      = esSubcarpeta ? "../../" : "./";

            Swal.fire({
                icon: "warning",
                title: "¡Iniciá sesión para comprar!",
                html: `
                    <p style="font-size:1.5rem;color:#4a5568;margin-bottom:1.6rem;">
                        Necesitás tener una cuenta para agregar productos al carrito.
                    </p>`,
                showConfirmButton: false,
                showCloseButton: true,
                footer: `
                    <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;padding-top:0.4rem;">
                        <a href="${prefijo}pages/registro_&_login/registro_de_cuenta.html"
                           style="background:#2c5282;color:#fff;padding:0.8rem 1.6rem;border-radius:0.6rem;font-weight:700;font-size:1.4rem;text-decoration:none;display:inline-flex;align-items:center;gap:0.5rem;">
                            <i class="fa-solid fa-user-plus"></i> Registrate
                        </a>
                        <a href="${prefijo}pages/registro_&_login/login.html"
                           style="background:#d8b541;color:#1a202c;padding:0.8rem 1.6rem;border-radius:0.6rem;font-weight:700;font-size:1.4rem;text-decoration:none;display:inline-flex;align-items:center;gap:0.5rem;">
                            <i class="fa-solid fa-right-to-bracket"></i> Iniciar Sesión
                        </a>
                        <button onclick="Swal.close()"
                           style="background:#e8edf3;color:#4a5568;padding:0.8rem 1.6rem;border-radius:0.6rem;font-weight:700;font-size:1.4rem;border:none;cursor:pointer;display:inline-flex;align-items:center;gap:0.5rem;">
                            <i class="fa-solid fa-xmark"></i> Salir
                        </button>
                    </div>`,
                customClass: { popup: "sc-swal-popup" }
            });
        }
        return;
    }

    const ofertas = getOfertas();
    const producto = ofertas.find(p => p.id === productoId);
    if (!producto) return;

    let carrito = JSON.parse(localStorage.getItem("sc_carrito")) || [];
    const idx = carrito.findIndex(item => item.id === productoId);

    const itemCarrito = {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cuotas: producto.cuotas,
        categoria: producto.categoria,
        imagen: producto.imagen,
        diasEntrega: producto.diasEntrega
    };

    if (idx >= 0) {
        carrito[idx].cantidad += 1;
    } else {
        carrito.push({ ...itemCarrito, cantidad: 1 });
    }

    localStorage.setItem("sc_carrito", JSON.stringify(carrito));
    window.dispatchEvent(new Event("sc:cartUpdated"));

    mostrarToastOferta("¡Oferta agregada!", producto.nombre);

    document.querySelectorAll(`.oferta-card[data-id="${productoId}"]`).forEach(card => {
        card.classList.add("added");
        setTimeout(() => card.classList.remove("added"), 600);
    });
}

function mostrarToastOferta(titulo, nombreProducto) {
    if (typeof Swal === "undefined") return;
    Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: `<span style="font-size:1.4rem">${titulo}</span>`,
        html: nombreProducto ? `<span style="font-size:1.2rem">${nombreProducto.substring(0, 50)}...</span>` : "",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
        customClass: { popup: "sc-toast" }
    });
}

/* ── Más ofertas (Fetch API a FakeStoreAPI, integradas como oferta-card) ── */
const ofertasApiCache = {};

function fetchMasOfertas() {
    const grid = document.getElementById("recomendados-grid");
    const loading = document.getElementById("recomendados-loading");
    if (!grid) return;

    fetch("https://fakestoreapi.com/products?limit=8")
        .then(res => {
            if (!res.ok) throw new Error("Respuesta no válida de la API");
            return res.json();
        })
        .then(productosApi => {
            if (loading) loading.remove();

            const ofertasApi = productosApi.map(p => {
                const descuento = 10 + (Math.abs(hashTexto(p.title)) % 31); // 10% a 40%
                const precioOriginal = Math.round(p.price * 1000);
                const precioFinal = Math.round(precioOriginal * (1 - descuento / 100));
                const oferta = {
                    id: -Math.abs(hashTexto(p.title)),
                    nombre: p.title,
                    categoria: p.category,
                    imagen: p.image,
                    cuotas: 3,
                    precioOriginal,
                    precio: precioFinal,
                    descuento
                };
                ofertasApiCache[oferta.id] = oferta;
                return oferta;
            });

            grid.innerHTML = ofertasApi.map(p => renderOfertaApiCardHTML(p)).join("");
        })
        .catch(() => {
            grid.innerHTML = `
                <p class="recomendados-loading">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    No pudimos cargar más ofertas en este momento.
                </p>`;
        });
}

function escaparAtributo(texto) {
    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function renderOfertaApiCardHTML(p) {
    const cuotaValor = calcularCuota(p.precio, p.cuotas);
    const nombreSeguro = escaparAtributo(p.nombre);

    return `
    <article class="oferta-card" data-id-api="${p.id}" aria-label="Oferta: ${nombreSeguro}">
        <span class="oferta-card__badge">-${p.descuento}%</span>
        <div class="oferta-card__img-wrapper">
            <img src="${p.imagen}" alt="${nombreSeguro}" class="oferta-card__img" style="object-fit:contain;background:#fff;" loading="lazy">
        </div>
        <div class="oferta-card__body">
            <span class="oferta-card__cat">${p.categoria}</span>
            <h3 class="oferta-card__title">${p.nombre}</h3>
            <div class="oferta-card__precios">
                <span class="oferta-card__precio-original">${formatPrecio(p.precioOriginal)}</span>
                <span class="oferta-card__precio-final">${formatPrecio(p.precio)}</span>
            </div>
            <p class="oferta-card__cuotas">
                <i class="fa-solid fa-credit-card"></i>
                ${p.cuotas}x de ${cuotaValor} sin interés
            </p>
            <button
                class="oferta-card__btn-cart"
                onclick="agregarOfertaApiAlCarrito(${p.id})"
                aria-label="Agregar ${nombreSeguro} al carrito"
            >
                <i class="fa-solid fa-cart-plus"></i> Agregar al carrito
            </button>
        </div>
    </article>
    `;
}

function agregarOfertaApiAlCarrito(id) {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {
        if (typeof Swal !== "undefined") {
            const esSubcarpeta = window.location.pathname.includes("/pages/");
            const prefijo      = esSubcarpeta ? "../../" : "./";

            Swal.fire({
                icon: "warning",
                title: "¡Iniciá sesión para comprar!",
                html: `
                    <p style="font-size:1.5rem;color:#4a5568;margin-bottom:1.6rem;">
                        Necesitás tener una cuenta para agregar productos al carrito.
                    </p>`,
                showConfirmButton: false,
                showCloseButton: true,
                footer: `
                    <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;padding-top:0.4rem;">
                        <a href="${prefijo}pages/registro_&_login/registro_de_cuenta.html"
                           style="background:#2c5282;color:#fff;padding:0.8rem 1.6rem;border-radius:0.6rem;font-weight:700;font-size:1.4rem;text-decoration:none;display:inline-flex;align-items:center;gap:0.5rem;">
                            <i class="fa-solid fa-user-plus"></i> Registrate
                        </a>
                        <a href="${prefijo}pages/registro_&_login/login.html"
                           style="background:#d8b541;color:#1a202c;padding:0.8rem 1.6rem;border-radius:0.6rem;font-weight:700;font-size:1.4rem;text-decoration:none;display:inline-flex;align-items:center;gap:0.5rem;">
                            <i class="fa-solid fa-right-to-bracket"></i> Iniciar Sesión
                        </a>
                        <button onclick="Swal.close()"
                           style="background:#e8edf3;color:#4a5568;padding:0.8rem 1.6rem;border-radius:0.6rem;font-weight:700;font-size:1.4rem;border:none;cursor:pointer;display:inline-flex;align-items:center;gap:0.5rem;">
                            <i class="fa-solid fa-xmark"></i> Salir
                        </button>
                    </div>`,
                customClass: { popup: "sc-swal-popup" }
            });
        }
        return;
    }

    const oferta = ofertasApiCache[id];
    if (!oferta) return;

    let carrito = JSON.parse(localStorage.getItem("sc_carrito")) || [];
    const idx = carrito.findIndex(item => item.id === id);

    if (idx >= 0) {
        carrito[idx].cantidad += 1;
    } else {
        carrito.push({
            id: oferta.id,
            nombre: oferta.nombre,
            precio: oferta.precio,
            cuotas: oferta.cuotas,
            categoria: oferta.categoria,
            imagen: oferta.imagen,
            cantidad: 1
        });
    }

    localStorage.setItem("sc_carrito", JSON.stringify(carrito));
    window.dispatchEvent(new Event("sc:cartUpdated"));

    mostrarToastOferta("¡Oferta agregada!", oferta.nombre);

    document.querySelectorAll(`.oferta-card[data-id-api="${id}"]`).forEach(card => {
        card.classList.add("added");
        setTimeout(() => card.classList.remove("added"), 600);
    });
}

function hashTexto(texto) {
    let hash = 0;
    for (let i = 0; i < texto.length; i++) {
        hash = (hash << 5) - hash + texto.charCodeAt(i);
        hash |= 0;
    }
    return hash;
}
