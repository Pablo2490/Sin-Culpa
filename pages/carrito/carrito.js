document.addEventListener("DOMContentLoaded", function () {
    renderCarrito();
    bindCarritoActions();
});
 
function getCarrito() {
    return JSON.parse(localStorage.getItem("sc_carrito")) || [];
}
 
function saveCarrito(carrito) {
    localStorage.setItem("sc_carrito", JSON.stringify(carrito));
    window.dispatchEvent(new Event("sc:cartUpdated"));
}
 
function renderCarrito() {
    const carrito = getCarrito();
    const lista = document.getElementById("carrito-lista");
    const layout = document.getElementById("carrito-layout");
    const emptyMsg = document.getElementById("carrito-empty");
 
    if (!lista) return;
 
    if (carrito.length === 0) {
        if (layout) layout.style.display = "none";
        if (emptyMsg) emptyMsg.style.display = "flex";
        return;
    }
 
    if (layout) layout.style.display = "grid";
    if (emptyMsg) emptyMsg.style.display = "none";
 
    lista.innerHTML = carrito.map(item => {
        const imgSrc = getImagenProducto(item) || generarPlaceholderCarrito(item.nombre);
        const precioUnit = formatPrecio(item.precio);
        const precioTotal = formatPrecio(item.precio * item.cantidad);
 
        return `
        <article class="carrito-item" data-id="${item.id}" aria-label="Producto: ${item.nombre}">
            <div class="carrito-item__img-wrapper">
                <img src="${imgSrc}" alt="${item.nombre}" class="carrito-item__img" loading="lazy">
            </div>
 
            <div class="carrito-item__info">
                <h3 class="carrito-item__nombre">${item.nombre}</h3>
                <span class="carrito-item__cat">${item.categoria}</span>
                <p class="carrito-item__precio-unit">Precio unitario: ${precioUnit}</p>
                <p class="carrito-item__precio-total">${precioTotal}</p>
            </div>
 
            <div class="carrito-item__controls">
                <div class="cantidad-control" aria-label="Cantidad">
                    <button
                        class="cantidad-btn"
                        data-action="decrement"
                        data-id="${item.id}"
                        aria-label="Reducir cantidad"
                    >−</button>
                    <span class="cantidad-display" aria-live="polite">${item.cantidad}</span>
                    <button
                        class="cantidad-btn"
                        data-action="increment"
                        data-id="${item.id}"
                        aria-label="Aumentar cantidad"
                    >+</button>
                </div>
                <button
                    class="btn-eliminar-item"
                    data-id="${item.id}"
                    aria-label="Eliminar ${item.nombre}"
                >
                    <i class="fa-solid fa-trash-can" aria-hidden="true"></i>
                    Eliminar
                </button>
            </div>
        </article>
        `;
    }).join("");
 
    actualizarResumen();
}
 
function actualizarResumen() {
    const carrito = getCarrito();
    const totalItems = carrito.reduce((acc, i) => acc + i.cantidad, 0);
    const subtotal = carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
 
    const elCantidad = document.getElementById("resumen-cantidad");
    const elSubtotal = document.getElementById("resumen-subtotal");
    const elTotal = document.getElementById("resumen-total");
 
    if (elCantidad) elCantidad.textContent = totalItems;
    if (elSubtotal) elSubtotal.textContent = formatPrecio(subtotal);
    if (elTotal) elTotal.textContent = formatPrecio(subtotal);
}
 
function bindCarritoActions() {
    const lista = document.getElementById("carrito-lista");
    const btnVaciar = document.getElementById("btn-vaciar");
    const btnPagar = document.getElementById("btn-pagar");
 
    lista?.addEventListener("click", function (e) {
        const btnCantidad = e.target.closest(".cantidad-btn");
        const btnEliminar = e.target.closest(".btn-eliminar-item");
 
        if (btnCantidad) {
            const id = parseInt(btnCantidad.dataset.id);
            const action = btnCantidad.dataset.action;
            cambiarCantidad(id, action);
        }
 
        if (btnEliminar) {
            const id = parseInt(btnEliminar.dataset.id);
            confirmarEliminar(id);
        }
    });
 
    btnVaciar?.addEventListener("click", function () {
        if (getCarrito().length === 0) return;
 
        Swal.fire({
            title: "¿Vaciar carrito?",
            text: "Se eliminarán todos los productos del carrito.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, vaciar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#e53e3e",
            cancelButtonColor: "#68a9df",
            customClass: { popup: "sc-swal-popup" }
        }).then(result => {
            if (result.isConfirmed) {
                saveCarrito([]);
                renderCarrito();
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "info",
                    title: "Carrito vaciado",
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true
                });
            }
        });
    });
 
    btnPagar?.addEventListener("click", function () {
        const carrito = getCarrito();
        if (carrito.length === 0) return;
        window.location.href = "../pago/pagos.html";
    });
}
 
function cambiarCantidad(id, action) {
    let carrito = getCarrito();
    const idx = carrito.findIndex(i => i.id === id);
    if (idx < 0) return;
 
    if (action === "increment") {
        carrito[idx].cantidad += 1;
    } else if (action === "decrement") {
        if (carrito[idx].cantidad <= 1) {
            confirmarEliminar(id);
            return;
        }
        carrito[idx].cantidad -= 1;
    }
 
    saveCarrito(carrito);
    renderCarrito();
}
 
function confirmarEliminar(id) {
    const carrito = getCarrito();
    const item = carrito.find(i => i.id === id);
    if (!item) return;
 
    Swal.fire({
        title: "¿Eliminar producto?",
        html: `<p style="font-size:1.4rem">${item.nombre.substring(0, 60)}...</p>`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#e53e3e",
        cancelButtonColor: "#68a9df",
        customClass: { popup: "sc-swal-popup" }
    }).then(result => {
        if (result.isConfirmed) {
            const nuevo = carrito.filter(i => i.id !== id);
            saveCarrito(nuevo);
            renderCarrito();
 
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Producto eliminado",
                showConfirmButton: false,
                timer: 1800,
                timerProgressBar: true
            });
        }
    });
}
 
function generarPlaceholderCarrito(nombre) {
    const colores = ["68a9df", "d8b541", "4a7fb5", "e8c55a", "5b9bd5"];
    const idx = Math.abs(nombre.charCodeAt(0) + nombre.length) % colores.length;
    const color = colores[idx];
    const texto = encodeURIComponent(nombre.substring(0, 20));
    return `https://placehold.co/300x200/${color}/ffffff?text=${texto}`;
}