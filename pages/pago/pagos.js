document.addEventListener("DOMContentLoaded", function () {
    const carrito = getCarritoPago();
 
    if (carrito.length === 0) {
        mostrarVacio();
        return;
    }
 
    renderResumenPago(carrito);
    bindPagoForm();
    checkAutocompletarEnvio();
});

const METODOS_PAGO = {
    credito: {
        label: "Tarjeta de Crédito",
        icono: "fa-solid fa-credit-card",
        storageKey: "sc_pago_credito",
        muestraCuotas: true,
        campos: [
            { id: "pago-cred-nombre", perfilKey: "cred-nombre", label: "Nombre en la tarjeta", placeholder: "Como figura en la tarjeta", tipo: "text", col: "full", required: true },
            { id: "pago-cred-numero", perfilKey: "cred-numero", label: "Número de tarjeta", placeholder: "0000 0000 0000 0000", tipo: "text", inputmode: "numeric", maxlength: 19, required: true },
            { id: "pago-cred-venc", perfilKey: "cred-venc", label: "Vencimiento (MM/AA)", placeholder: "MM/AA", tipo: "text", maxlength: 5, required: true },
            { id: "pago-cred-cvv", perfilKey: null, label: "CVV", placeholder: "123", tipo: "text", inputmode: "numeric", maxlength: 4, required: true },
        ]
    },
    debito: {
        label: "Tarjeta de Débito",
        icono: "fa-regular fa-credit-card",
        storageKey: "sc_pago_debito",
        muestraCuotas: true,
        campos: [
            { id: "pago-deb-nombre", perfilKey: "deb-nombre", label: "Nombre en la tarjeta", placeholder: "Como figura en la tarjeta", tipo: "text", col: "full", required: true },
            { id: "pago-deb-numero", perfilKey: "deb-numero", label: "Número de tarjeta", placeholder: "0000 0000 0000 0000", tipo: "text", inputmode: "numeric", maxlength: 19, required: true },
            { id: "pago-deb-cvv", perfilKey: null, label: "CVV", placeholder: "123", tipo: "text", inputmode: "numeric", maxlength: 4, required: true },
        ]
    },
    cbu: {
        label: "CBU / Transferencia Bancaria",
        icono: "fa-solid fa-building-columns",
        storageKey: "sc_pago_cbu",
        muestraCuotas: false,
        campos: [
            { id: "pago-cbu-titular", perfilKey: "cbu-titular", label: "Titular de la cuenta", placeholder: "Nombre completo", tipo: "text", col: "full", required: true },
            { id: "pago-cbu-numero", perfilKey: "cbu-numero", label: "CBU (22 dígitos)", placeholder: "0000000000000000000000", tipo: "text", inputmode: "numeric", maxlength: 22, required: true },
        ]
    },
    crypto: {
        label: "Cripto / Wallet Virtual",
        icono: "fa-brands fa-bitcoin",
        storageKey: "sc_pago_crypto",
        muestraCuotas: false,
        campos: [
            { id: "pago-cry-red", perfilKey: "cry-red", label: "Red / Moneda", placeholder: "", tipo: "select", opciones: ["Bitcoin (BTC)", "Ethereum (ETH)", "USDT (TRC-20)", "USDT (ERC-20)", "USDC", "DAI", "Solana (SOL)"], required: true },
            { id: "pago-cry-wallet", perfilKey: "cry-wallet", label: "Dirección de wallet de origen", placeholder: "0x...", tipo: "text", col: "full", required: true },
        ]
    }
};
 
const CUOTAS_RECARGO = {
    "1": 0,
    "3": 0.10,
    "6": 0.15,
    "12": 0.20
};
 
let metodoActual = null;
let cuotasActuales = "1";
 
function getCarritoPago() {
    return JSON.parse(localStorage.getItem("sc_carrito")) || [];
}
 
function mostrarVacio() {
    const layout = document.getElementById("pago-layout");
    const empty = document.getElementById("pago-empty");
    if (layout) layout.style.display = "none";
    if (empty) empty.style.display = "flex";
}
 
function renderResumenPago(carrito) {
    const lista = document.getElementById("pago-items-lista");
    if (!lista) return;
 
    lista.innerHTML = carrito.map(item => {
        const imgSrc = getImagenProducto(item) || generarPlaceholderPago(item.nombre);
 
        return `
        <div class="pago-item">
            <img src="${imgSrc}" alt="${item.nombre}" class="pago-item__img" loading="lazy">
            <div class="pago-item__info">
                <p class="pago-item__nombre">${item.nombre}</p>
                <span class="pago-item__cantidad">Cantidad: ${item.cantidad}</span>
            </div>
            <span class="pago-item__precio">${formatPrecio(item.precio * item.cantidad)}</span>
        </div>
        `;
    }).join("");
 
    actualizarTotales();
}
 
function getSubtotal() {
    return getCarritoPago().reduce((acc, item) => acc + item.precio * item.cantidad, 0);
}
 
function actualizarTotales() {
    const subtotal = getSubtotal();
    const subtotalEl = document.getElementById("pago-subtotal");
    const totalEl = document.getElementById("pago-total");
    const recargoRow = document.getElementById("resumen-recargo-row");
    const recargoEl = document.getElementById("resumen-recargo");
    const recargoLabel = document.getElementById("resumen-recargo-label");
 
    const porcentaje = CUOTAS_RECARGO[cuotasActuales] || 0;
    const recargo = subtotal * porcentaje;
    const total = subtotal + recargo;
 
    if (subtotalEl) subtotalEl.textContent = formatPrecio(subtotal);
 
    if (porcentaje > 0) {
        if (recargoRow) recargoRow.style.display = "flex";
        if (recargoLabel) recargoLabel.textContent = `Recargo por ${cuotasActuales} cuotas (${porcentaje * 100}%)`;
        if (recargoEl) recargoEl.textContent = `+ ${formatPrecio(recargo)}`;
    } else {
        if (recargoRow) recargoRow.style.display = "none";
    }
 
    if (totalEl) totalEl.textContent = formatPrecio(total);
}

function bindPagoForm() {
    const form = document.getElementById("pago-form");
    const btn = document.getElementById("btn-confirmar-pago");
    const selectMetodo = document.getElementById("pago-metodo");
    if (!form) return;
 
    selectMetodo?.addEventListener("change", function () {
        metodoActual = this.value;
        cuotasActuales = "1";
        renderFormMetodo(metodoActual);
        actualizarTotales();
    });
 
    form.addEventListener("submit", function (e) {
        e.preventDefault();
 
        if (!metodoActual) {
            Swal.fire({
                icon: "warning",
                title: "Elegí un método de pago",
                text: "Seleccioná cómo querés pagar antes de continuar.",
                confirmButtonColor: "#68a9df",
                customClass: { popup: "sc-swal-popup" }
            });
            return;
        }
 
        const valoresEnvio = obtenerValoresEnvio(form);
        const erroresEnvio = validarEnvio(valoresEnvio);
        mostrarErroresEnvio(erroresEnvio);
 
        const valoresPago = obtenerValoresMetodo(metodoActual);
        const erroresPago = validarMetodo(metodoActual, valoresPago);
        mostrarErroresMetodo(metodoActual, erroresPago);
 
        const errores = { ...erroresEnvio, ...erroresPago };
 
        if (Object.keys(errores).length > 0) {
            Swal.fire({
                icon: "warning",
                title: "Revisá los datos",
                text: "Hay campos incompletos o con errores.",
                confirmButtonColor: "#68a9df",
                customClass: { popup: "sc-swal-popup" }
            });
            return;
        }
 
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Procesando pago...`;
        }
 
        setTimeout(() => confirmarCompra(valoresEnvio, metodoActual, cuotasActuales), 1400);
    });
}
 
function renderFormMetodo(metodoKey) {
    const contenedor = document.getElementById("pago-metodo-contenido");
    if (!contenedor) return;
 
    if (!metodoKey || !METODOS_PAGO[metodoKey]) {
        contenedor.innerHTML = "";
        return;
    }
 
    const config = METODOS_PAGO[metodoKey];
 
    const camposHTML = config.campos.map(campo => {
        const colClass = campo.col === "full" ? "full" : "";
 
        if (campo.tipo === "select") {
            const optionsHTML = campo.opciones.map(o => `<option value="${o}">${o}</option>`).join("");
            return `
            <div class="form-group ${colClass}">
                <label for="${campo.id}">${campo.label}${campo.required ? " *" : ""}</label>
                <select id="${campo.id}">
                    <option value="">Seleccioná...</option>
                    ${optionsHTML}
                </select>
                <span class="form-error" id="error-${campo.id}"></span>
            </div>`;
        }
 
        return `
        <div class="form-group ${colClass}">
            <label for="${campo.id}">${campo.label}${campo.required ? " *" : ""}</label>
            <input
                type="text"
                id="${campo.id}"
                placeholder="${campo.placeholder}"
                ${campo.maxlength ? `maxlength="${campo.maxlength}"` : ""}
                ${campo.inputmode ? `inputmode="${campo.inputmode}"` : ""}
            >
            <span class="form-error" id="error-${campo.id}"></span>
        </div>`;
    }).join("");
 
    const cuotasHTML = config.muestraCuotas ? `
        <div class="form-group">
            <label for="pago-cuotas">Cuotas</label>
            <select id="pago-cuotas">
                <option value="1">1 pago — Sin recargo</option>
                <option value="3">3 cuotas (10% de interés)</option>
                <option value="6">6 cuotas (15% de interés)</option>
                <option value="12">12 cuotas (20% de interés)</option>
            </select>
            <p class="cuotas-info" id="cuotas-info-texto">
                <strong>1 pago — Sin recargo</strong>
            </p>
        </div>
    ` : "";
 
    const tieneGuardado = !!localStorage.getItem(config.storageKey);
 
    contenedor.innerHTML = `
        ${tieneGuardado ? `
        <div class="pago-autocompletar" id="pago-autocompletar-metodo">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            <span>Tenés ${config.label.toLowerCase()} guardada en tu perfil.</span>
            <button type="button" id="btn-autocompletar-metodo">Usar datos del perfil</button>
        </div>` : ""}
 
        <div class="metodo-pago-card">
            <div class="metodo-pago-card__titulo">
                <i class="${config.icono}"></i> ${config.label}
            </div>
            <div class="form-row">
                ${camposHTML}
            </div>
            ${cuotasHTML}
        </div>
    `;
 
    bindFormatosMetodo(config);
 
    document.getElementById("btn-autocompletar-metodo")?.addEventListener("click", function () {
        autocompletarMetodo(metodoKey);
    });
 
    const selectCuotas = document.getElementById("pago-cuotas");
    selectCuotas?.addEventListener("change", function () {
        cuotasActuales = this.value;
        const infoTexto = document.getElementById("cuotas-info-texto");
        if (infoTexto) {
            const porcentaje = CUOTAS_RECARGO[cuotasActuales] || 0;
            infoTexto.innerHTML = porcentaje > 0
                ? `<strong class="con-recargo">${cuotasActuales} cuotas — ${porcentaje * 100}% de interés</strong>`
                : `<strong>1 pago — Sin recargo</strong>`;
        }
        actualizarTotales();
    });
}
 
function bindFormatosMetodo(config) {
    config.campos.forEach(campo => {
        const input = document.getElementById(campo.id);
        if (!input) return;
 
        if (campo.id.includes("numero") && (config === METODOS_PAGO.credito || config === METODOS_PAGO.debito)) {
            input.addEventListener("input", function () {
                let v = this.value.replace(/\D/g, "").substring(0, 16);
                this.value = v.replace(/(.{4})/g, "$1 ").trim();
            });
        }
 
        if (campo.id.includes("venc")) {
            input.addEventListener("input", function () {
                let v = this.value.replace(/\D/g, "").substring(0, 4);
                if (v.length > 2) v = `${v.substring(0, 2)}/${v.substring(2)}`;
                this.value = v;
            });
        }
 
        if (campo.id.includes("cvv")) {
            input.addEventListener("input", function () {
                this.value = this.value.replace(/\D/g, "").substring(0, 4);
            });
        }
 
        if (campo.id === "pago-cbu-numero") {
            input.addEventListener("input", function () {
                this.value = this.value.replace(/\D/g, "").substring(0, 22);
            });
        }
    });
}
 
function obtenerValoresMetodo(metodoKey) {
    const config = METODOS_PAGO[metodoKey];
    const datos = {};
    config.campos.forEach(campo => {
        const input = document.getElementById(campo.id);
        if (input) datos[campo.id] = input.value.trim();
    });
    return datos;
}
 
function validarMetodo(metodoKey, valores) {
    const config = METODOS_PAGO[metodoKey];
    const errores = {};
 
    config.campos.forEach(campo => {
        const val = valores[campo.id] || "";
 
        if (campo.required && !val) {
            errores[campo.id] = "Campo obligatorio";
            return;
        }
 
        if (!val) return;
 
        if (campo.id.includes("numero") && (metodoKey === "credito" || metodoKey === "debito")) {
            if (val.replace(/\s/g, "").length !== 16) errores[campo.id] = "Debe tener 16 dígitos";
        }
        if (campo.id.includes("venc")) {
            if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(val)) errores[campo.id] = "Formato MM/AA";
        }
        if (campo.id.includes("cvv")) {
            if (!/^\d{3,4}$/.test(val)) errores[campo.id] = "CVV inválido";
        }
        if (campo.id === "pago-cbu-numero") {
            if (val.length !== 22) errores[campo.id] = "El CBU debe tener 22 dígitos";
        }
    });
 
    return errores;
}
 
function mostrarErroresMetodo(metodoKey, errores) {
    const config = METODOS_PAGO[metodoKey];
    config.campos.forEach(campo => {
        const input = document.getElementById(campo.id);
        const errorEl = document.getElementById(`error-${campo.id}`);
        if (!input) return;
 
        if (errores[campo.id]) {
            input.classList.add("invalid");
            if (errorEl) errorEl.textContent = errores[campo.id];
        } else {
            input.classList.remove("invalid");
            if (errorEl) errorEl.textContent = "";
        }
    });
}
 
function autocompletarMetodo(metodoKey) {
    const config = METODOS_PAGO[metodoKey];
    const guardado = JSON.parse(localStorage.getItem(config.storageKey) || "null");
    if (!guardado) return;
 
    let completados = 0;
    config.campos.forEach(campo => {
        if (!campo.perfilKey) return;
        const valor = guardado[campo.perfilKey];
        const input = document.getElementById(campo.id);
        if (input && valor && !input.value) {
            input.value = valor;
            completados++;
        }
    });
 
    Swal.fire({
        toast: true, position: "top-end", icon: "success",
        title: completados > 0
            ? `${completados} campos completados automáticamente`
            : "Los campos ya estaban completos",
        showConfirmButton: false, timer: 2200, timerProgressBar: true
    });
 
    document.getElementById("pago-autocompletar-metodo")?.style.setProperty("display", "none");
}

function checkAutocompletarEnvio() {
    const banner = document.getElementById("pago-autocompletar-envio");
    const btn = document.getElementById("btn-autocompletar-envio");
    const currentUser = sessionStorage.getItem("userName");
    if (!currentUser || !banner || !btn) return;
 
    const listaUsuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
    const datosUsuario = listaUsuarios.find(u => u.username?.toLowerCase() === currentUser.toLowerCase());
    if (!datosUsuario) return;
 
    banner.style.display = "flex";
 
    btn.addEventListener("click", function () {
        const nombre = document.getElementById("pago-nombre");
        const email = document.getElementById("pago-email");
        const direccion = document.getElementById("pago-direccion");
        const ciudad = document.getElementById("pago-ciudad");
        const cp = document.getElementById("pago-cp");
 
        const nombreCompleto = [datosUsuario.nombre, datosUsuario.nombre2, datosUsuario.apellido]
            .filter(Boolean).join(" ");
        const dirCompleta = [
            datosUsuario.direccion,
            datosUsuario.altura ? `N° ${datosUsuario.altura}` : null,
            datosUsuario.piso ? `Piso ${datosUsuario.piso}` : null,
            datosUsuario.depto ? `Dpto. ${datosUsuario.depto}` : null
        ].filter(Boolean).join(", ");
 
        let completados = 0;
        if (nombre && !nombre.value && nombreCompleto) { nombre.value = nombreCompleto; completados++; }
        if (email && !email.value && datosUsuario.email) { email.value = datosUsuario.email; completados++; }
        if (direccion && !direccion.value && dirCompleta) { direccion.value = dirCompleta; completados++; }
        if (ciudad && !ciudad.value && datosUsuario.localidad) { ciudad.value = datosUsuario.localidad; completados++; }
        if (cp && !cp.value && datosUsuario.cp) { cp.value = datosUsuario.cp; completados++; }
 
        Swal.fire({
            toast: true, position: "top-end", icon: "success",
            title: completados > 0
                ? `${completados} campos completados automáticamente`
                : "Los campos ya estaban completos",
            showConfirmButton: false, timer: 2200, timerProgressBar: true
        });
 
        banner.style.display = "none";
    });
}

function obtenerValoresEnvio(form) {
    const datos = {};
    new FormData(form).forEach((value, key) => { datos[key] = String(value).trim(); });
    return datos;
}
 
function validarEnvio(v) {
    const errores = {};
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 
    if (!v.nombre || v.nombre.length < 3) errores.nombre = "Ingresá tu nombre completo.";
    if (!v.email || !regexEmail.test(v.email)) errores.email = "Correo electrónico inválido.";
    if (!v.direccion || v.direccion.length < 5) errores.direccion = "Ingresá una dirección válida.";
    if (!v.ciudad) errores.ciudad = "Ingresá tu ciudad.";
    if (!v.cp || v.cp.length < 3) errores.cp = "Código postal inválido.";
 
    return errores;
}
 
function mostrarErroresEnvio(errores) {
    const campos = ["nombre", "email", "direccion", "ciudad", "cp"];
 
    campos.forEach(campo => {
        const input = document.getElementById(`pago-${campo}`);
        const errorEl = document.getElementById(`error-pago-${campo}`);
        if (!input) return;
 
        if (errores[campo]) {
            input.classList.add("invalid");
            if (errorEl) errorEl.textContent = errores[campo];
        } else {
            input.classList.remove("invalid");
            if (errorEl) errorEl.textContent = "";
        }
    });
}
 
function confirmarCompra(datosCliente, metodoKey, cuotas) {
    const carrito = getCarritoPago();
    const subtotal = getSubtotal();
    const porcentaje = CUOTAS_RECARGO[cuotas] || 0;
    const recargo = subtotal * porcentaje;
    const total = subtotal + recargo;
    const numeroPedido = `SC-${Date.now().toString().slice(-8)}`;
 
    const pedido = {
        numero: numeroPedido,
        fecha: new Date().toISOString(),
        cliente: {
            nombre: datosCliente.nombre,
            email: datosCliente.email,
            direccion: datosCliente.direccion,
            ciudad: datosCliente.ciudad,
            cp: datosCliente.cp
        },
        metodoPago: METODOS_PAGO[metodoKey].label,
        cuotas: cuotas,
        recargo: recargo,
        items: carrito,
        subtotal,
        total
    };
 
    const pedidos = JSON.parse(localStorage.getItem("sc_pedidos")) || [];
    pedidos.push(pedido);
    localStorage.setItem("sc_pedidos", JSON.stringify(pedidos));
 
    localStorage.setItem("sc_carrito", JSON.stringify([]));
    window.dispatchEvent(new Event("sc:cartUpdated"));
 
    const layout = document.getElementById("pago-layout");
    const confirmacion = document.getElementById("pago-confirmacion");
    const numeroSpan = document.getElementById("pedido-numero");
 
    if (layout) layout.style.display = "none";
    if (numeroSpan) numeroSpan.textContent = numeroPedido;
    if (confirmacion) confirmacion.style.display = "flex";
 
    Swal.fire({
        icon: "success",
        title: "¡Pago confirmado!",
        html: `<p style="font-size:1.5rem">Tu pedido <strong>${numeroPedido}</strong> fue registrado con éxito. ¡Gracias por comprar sin culpa! 🎉</p>`,
        confirmButtonText: "¡Genial!",
        confirmButtonColor: "#d8b541",
        customClass: { popup: "sc-swal-popup" }
    });
}
 
function generarPlaceholderPago(nombre) {
    const colores = ["68a9df", "d8b541", "4a7fb5", "e8c55a", "5b9bd5"];
    const idx = Math.abs(nombre.charCodeAt(0) + nombre.length) % colores.length;
    return `https://placehold.co/300x200/${colores[idx]}/ffffff?text=${encodeURIComponent(nombre.substring(0, 20))}`;
}