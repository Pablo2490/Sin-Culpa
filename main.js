function initCarrusel() {
    const track = document.getElementById("carrusel-track");
    if (!track) return;
 
    const destacados = getProductosDestacados();
    if (!destacados || destacados.length === 0) return;
 
    const allItems = [...destacados, ...destacados];
 
    track.innerHTML = allItems.map(p => {
        const imgSrc = getImagenProducto(p) || generarPlaceholder(p.nombre);
        return `
        <div class="carrusel-item">
            <div class="carrusel-img-wrapper">
                <img src="${imgSrc}" alt="${p.nombre}" loading="lazy">
            </div>
            <div class="carrusel-info">
                <p class="carrusel-nombre">${p.nombre}</p>
                <p class="carrusel-precio">${formatPrecio(p.precio)}</p>
            </div>
        </div>`;
    }).join("");
 
    requestAnimationFrame(() => {
        const VELOCIDAD = 60;
        let posicion = 0;
        let ultimoTimestamp = null;
        let pausado = false;
        const mitad = track.scrollWidth / 2;
 
        function animar(timestamp) {
            if (!ultimoTimestamp) ultimoTimestamp = timestamp;
            const delta = (timestamp - ultimoTimestamp) / 1000;
            ultimoTimestamp = timestamp;
 
            if (!pausado) {
                posicion += VELOCIDAD * delta;
                if (posicion >= mitad) posicion = 0;
                track.style.transform = `translateX(-${posicion}px)`;
            }
            requestAnimationFrame(animar);
        }
 
        requestAnimationFrame(animar);
 
        const wrapper = document.querySelector(".carrusel-wrapper");
        if (wrapper) {
            wrapper.addEventListener("mouseenter", () => { pausado = true; ultimoTimestamp = null; });
            wrapper.addEventListener("mouseleave", () => { pausado = false; });
        }
    });
}
 
function generarPlaceholder(nombre) {
    const colores = ["68a9df", "d8b541", "4a7fb5", "e8c55a", "5b9bd5"];
    const idx = Math.abs(nombre.charCodeAt(0) + nombre.length) % colores.length;
    return `https://placehold.co/300x200/${colores[idx]}/ffffff?text=${encodeURIComponent(nombre.substring(0, 20))}`;
}
 
function populateCategorySelect() {
    const select = document.getElementById("search-category");
    if (!select) return;
    const options = ['<option value="all">Todos</option>'];
    CATEGORIAS.forEach(cat => {
        options.push(`<option value="${encodeURIComponent(cat)}">${cat}</option>`);
    });
    select.innerHTML = options.join("");
    ajustarAnchoSelect(select);
}
 
function ajustarAnchoSelect(select) {
    if (!select || window.innerWidth <= 768) return;
    const tmp = document.createElement("select");
    tmp.style.cssText = "visibility:hidden;position:fixed;top:-999px;font-size:1.4rem;font-weight:700;font-family:Nunito,sans-serif;padding:0 3rem 0 1.4rem;";
    const opt = document.createElement("option");
    opt.textContent = select.options[select.selectedIndex]?.text || "Todos";
    tmp.appendChild(opt);
    document.body.appendChild(tmp);
    const w = tmp.offsetWidth + 40;
    document.body.removeChild(tmp);
    select.style.width = Math.max(w, 88) + "px";
}
 
function bindSearchBar() {
    const form   = document.getElementById("search-form");
    const input  = document.getElementById("search-input");
    const select = document.getElementById("search-category");
    const btn    = document.getElementById("search-btn");
    if (!form) return;
 
    select?.addEventListener("change", () => {
        ajustarAnchoSelect(select);
        ejecutarBusqueda();
    });
 
    function ejecutarBusqueda() {
        const query    = input?.value.trim() || "";
        const encVal   = select?.value || "all";
        const categoria = encVal === "all" ? "all" : decodeURIComponent(encVal);
        renderProductCards(buscarProductos(query, categoria));
        sessionStorage.setItem("ultimaBusqueda", JSON.stringify({ query, categoria }));
    }
 
    // ── FIX 2: Mostrar todo al borrar el texto (input en tiempo real) ──
    input?.addEventListener("input", () => {
        const query    = input.value.trim();
        const encVal   = select?.value || "all";
        const categoria = encVal === "all" ? "all" : decodeURIComponent(encVal);
        renderProductCards(buscarProductos(query, categoria));
        if (query === "") {
            sessionStorage.removeItem("ultimaBusqueda");
        } else {
            sessionStorage.setItem("ultimaBusqueda", JSON.stringify({ query, categoria }));
        }
    });
 
    form.addEventListener("submit", e => { e.preventDefault(); ejecutarBusqueda(); });
    btn?.addEventListener("click",  e => { e.preventDefault(); ejecutarBusqueda(); });
    input?.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); ejecutarBusqueda(); } });
}
 
function restoreSearchFromURL() {
    const params = new URLSearchParams(window.location.search);
    const cat    = params.get("categoria");
    if (!cat) return false;
 
    const select = document.getElementById("search-category");
    if (select) {
        select.value = encodeURIComponent(cat);
        if (!select.value) select.value = "all";
        ajustarAnchoSelect(select);
    }
    renderProductCards(buscarProductos("", cat));
    return true;
}
 
function renderProductCards(productos) {
    const grid     = document.getElementById("productos-grid");
    const emptyMsg = document.getElementById("productos-empty");
    if (!grid) return;
 
    if (!productos || productos.length === 0) {
        grid.innerHTML = "";
        if (emptyMsg) emptyMsg.style.display = "flex";
        return;
    }
    if (emptyMsg) emptyMsg.style.display = "none";
 
    grid.innerHTML = productos.map(p => {
        const imgSrc     = getImagenProducto(p) || generarPlaceholder(p.nombre);
        const cuotaValor = calcularCuota(p.precio, p.cuotas);
        const entrega    = calcularEntrega(p.diasEntrega);
        const precioFmt  = formatPrecio(p.precio);
 
        return `
        <article class="product-card" data-id="${p.id}" aria-label="Producto: ${p.nombre}">
            <div class="product-card__img-wrapper">
                <img src="${imgSrc}" alt="${p.nombre}" class="product-card__img" loading="lazy">
                <span class="product-card__cat-badge">${p.categoria}</span>
            </div>
            <div class="product-card__body">
                <h3 class="product-card__title">${p.nombre}</h3>
                <p class="product-card__price">${precioFmt}</p>
                <p class="product-card__cuotas">
                    <i class="fa-solid fa-credit-card"></i>
                    ${p.cuotas}x de ${cuotaValor} sin interés
                </p>
                <p class="product-card__entrega">
                    <i class="fa-solid fa-truck-fast"></i>
                    Llega el <strong>${entrega}</strong>
                </p>
                <button class="product-card__btn-cart"
                    onclick="agregarAlCarrito(${p.id})"
                    aria-label="Agregar ${p.nombre} al carrito">
                    <i class="fa-solid fa-cart-plus"></i> Agregar al carrito
                </button>
            </div>
        </article>`;
    }).join("");
}

function agregarAlCarrito(productoId) {
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
 
    const producto = PRODUCTOS.find(p => p.id === productoId);
    if (!producto) return;
 
    let carrito = JSON.parse(localStorage.getItem("sc_carrito")) || [];
    const idx   = carrito.findIndex(item => item.id === productoId);
    if (idx >= 0) {
        carrito[idx].cantidad += 1;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    localStorage.setItem("sc_carrito", JSON.stringify(carrito));
    window.dispatchEvent(new Event("sc:cartUpdated"));
 
    if (typeof Swal !== "undefined") {
        Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: `<span style="font-size:1.4rem">¡Producto agregado!</span>`,
            html:  `<span style="font-size:1.2rem">${producto.nombre.substring(0, 50)}...</span>`,
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
            customClass: { popup: "sc-toast" }
        });
    }
 
    document.querySelectorAll(`.product-card[data-id="${productoId}"]`).forEach(card => {
        card.classList.add("added");
        setTimeout(() => card.classList.remove("added"), 600);
    });
}

const NOMBRES_RESENA = [
    "Lucía Fernández", "Martín Pérez", "Sofía Gómez", "Ezequiel Díaz",
    "Camila Torres", "Tomás Romero", "Valentina Ruiz", "Agustín López",
    "Florencia Castro", "Nicolás Ibáñez", "Julieta Medina", "Federico Acosta"
];

const CIUDADES_RESENA = [
    "CABA", "Córdoba", "Rosario", "Mendoza", "La Plata", "Salta",
    "Tucumán", "Mar del Plata", "Neuquén", "Bahía Blanca"
];

function generarEstrellasHTML(rate) {
    const llenas = Math.round(rate);
    return `<span class="resena-card__estrellas" aria-label="${llenas} de 5 estrellas">${"★".repeat(llenas)}${"☆".repeat(5 - llenas)}</span>`;
}

function generarTextoResena(tituloProducto, rate) {
    const frasesBuenas = [
        `Quedé muy conforme con "${tituloProducto.substring(0, 40)}". Llegó antes de lo esperado y la calidad superó mis expectativas.`,
        `Compré "${tituloProducto.substring(0, 40)}" y la experiencia fue excelente de punta a punta. Totalmente recomendable.`,
        `"${tituloProducto.substring(0, 40)}" cumplió todo lo que prometía. El envío fue rápido y la atención impecable.`
    ];
    const frasesRegulares = [
        `"${tituloProducto.substring(0, 40)}" está bien, aunque esperaba un poco más por el precio.`,
        `El producto "${tituloProducto.substring(0, 40)}" cumple, pero el envío tardó más de lo que pensaba.`
    ];
    const pool = rate >= 4 ? frasesBuenas : frasesRegulares;
    return pool[Math.floor(Math.random() * pool.length)];
}

function fetchResenas() {
    const track   = document.getElementById("resenas-track");
    const loading = document.getElementById("resenas-loading");
    if (!track) return;

    fetch("https://fakestoreapi.com/products?limit=10")
        .then(res => {
            if (!res.ok) throw new Error("Respuesta no válida de la API");
            return res.json();
        })
        .then(productosApi => {
            if (loading) loading.remove();

            const resenas = productosApi.map((p, i) => {
                const nombre   = NOMBRES_RESENA[i % NOMBRES_RESENA.length];
                const ciudad   = CIUDADES_RESENA[i % CIUDADES_RESENA.length];
                const rate     = p.rating?.rate || 4;
                return {
                    nombre,
                    ciudad,
                    estrellas: Math.round(rate),
                    texto: generarTextoResena(p.title, rate)
                };
            });

            const todas = [...resenas, ...resenas];

            track.innerHTML = todas.map(r => `
                <article class="resena-card" aria-label="Reseña de ${r.nombre}">
                    ${generarEstrellasHTML(r.estrellas)}
                    <p class="resena-card__texto">"${r.texto}"</p>
                    <div class="resena-card__autor">
                        <span class="resena-card__avatar">${r.nombre.charAt(0)}</span>
                        <div>
                            <p class="resena-card__nombre">${r.nombre}</p>
                            <p class="resena-card__ciudad">${r.ciudad}</p>
                        </div>
                    </div>
                </article>
            `).join("");

            requestAnimationFrame(() => iniciarMovimientoResenas(track));
        })
        .catch(() => {
            if (track) {
                track.innerHTML = `
                    <p class="resenas-loading">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        No pudimos cargar las reseñas en este momento.
                    </p>`;
            }
        });
}

function iniciarMovimientoResenas(track) {
    const VELOCIDAD = 45;
    let posicion = 0;
    let ultimoTimestamp = null;
    let pausado = false;
    const mitad = track.scrollWidth / 2;

    function animar(timestamp) {
        if (!ultimoTimestamp) ultimoTimestamp = timestamp;
        const delta = (timestamp - ultimoTimestamp) / 1000;
        ultimoTimestamp = timestamp;

        if (!pausado) {
            posicion += VELOCIDAD * delta;
            if (posicion >= mitad) posicion = 0;
            track.style.transform = `translateX(-${posicion}px)`;
        }
        requestAnimationFrame(animar);
    }

    requestAnimationFrame(animar);

    const wrapper = document.querySelector(".resenas-wrapper");
    if (wrapper) {
        wrapper.addEventListener("mouseenter", () => { pausado = true; ultimoTimestamp = null; });
        wrapper.addEventListener("mouseleave", () => { pausado = false; });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initCarrusel();
    populateCategorySelect();
    const teniaCat = restoreSearchFromURL();
    if (!teniaCat) renderProductCards(PRODUCTOS);
    bindSearchBar();
    fetchResenas();
});