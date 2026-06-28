document.addEventListener("DOMContentLoaded", function () {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    const currentUser = sessionStorage.getItem("userName");
    const displayName = sessionStorage.getItem("displayName");
 
    if (!isLoggedIn || !currentUser) {
        Swal.fire({
            icon: "warning",
            title: "Acceso denegado",
            text: "Iniciá sesión para ver tu perfil.",
            confirmButtonColor: "#2c5282",
            confirmButtonText: "Ir al inicio"
        }).then(() => { window.location.href = "../../index.html"; });
        return;
    }
 
    const listaUsuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
    const datosUsuario = listaUsuarios.find(
        u => u.username?.toLowerCase() === currentUser.toLowerCase()
    );
 
    cargarInfoPersonal(datosUsuario, currentUser, displayName);
    cargarFotoPerfil(datosUsuario, currentUser, listaUsuarios);
    initAcordeones();
    initLogout();
});

function cargarInfoPersonal(datos, currentUser, displayName) {
    const elNombreHero   = document.getElementById("perf-nombre-completo");
    const elNombreDato   = document.getElementById("perf-nombre-completo-dato");
    const elUserDisplay  = document.getElementById("perf-username-display");
    const elEmail        = document.getElementById("perf-email");
    const elDoc          = document.getElementById("perf-doc");
    const elUbicacion    = document.getElementById("perf-ubicacion");
    const elDireccion    = document.getElementById("perf-direccion");
 
    if (datos) {
        const nombreCompleto = [datos.nombre, datos.nombre2, datos.apellido]
            .filter(Boolean)
            .join(" ");
 
        if (elNombreHero)  elNombreHero.textContent  = nombreCompleto || currentUser;
        if (elNombreDato)  elNombreDato.textContent  = nombreCompleto || "—";
        if (elUserDisplay) elUserDisplay.textContent = `@${datos.username}`;
        if (elEmail) elEmail.textContent = datos.email || "—";

        const tipoDoc = datos.tipoDoc ? datos.tipoDoc.toUpperCase() : "DNI";
        if (elDoc) elDoc.textContent = datos.documento
            ? `${tipoDoc} ${datos.documento}`
            : "—";

        const ubicacion = [datos.localidad, datos.provincia, datos.pais]
            .filter(Boolean)
            .join(", ");
        if (elUbicacion) elUbicacion.textContent = ubicacion || "—";
 
        const partesCalle = [
            datos.direccion,
            datos.altura   ? `N° ${datos.altura}` : null,
            datos.piso     ? `Piso ${datos.piso}`  : null,
            datos.depto    ? `Dpto. ${datos.depto}` : null,
            datos.cp       ? `(CP ${datos.cp})`     : null
        ].filter(Boolean);
        if (elDireccion) elDireccion.textContent = partesCalle.length
            ? partesCalle.join(", ")
            : "—";
 
    } else if (currentUser === "Administrador") {
        if (elNombreHero)  elNombreHero.textContent  = "Administrador";
        if (elNombreDato)  elNombreDato.textContent  = "Administrador del Sitio";
        if (elUserDisplay) elUserDisplay.textContent = "@adm";
        if (elEmail)       elEmail.textContent       = "admin@sinculpa.com";
        if (elDoc)         elDoc.textContent         = "—";
        if (elUbicacion)   elUbicacion.textContent   = "Buenos Aires, Argentina";
        if (elDireccion)   elDireccion.textContent   = "—";
    } else {
        if (elNombreHero)  elNombreHero.textContent  = displayName || currentUser;
        if (elNombreDato)  elNombreDato.textContent  = displayName || currentUser;
        if (elUserDisplay) elUserDisplay.textContent = `@${currentUser}`;
    }
}
 
function cargarFotoPerfil(datosUsuario, currentUser, listaUsuarios) {
    const avatarImg       = document.getElementById("perf-avatar-img");
    const inputFileAvatar = document.getElementById("input-file-avatar");
    const btnCambiarFoto  = document.getElementById("btn-cambiar-foto");
 
    if (datosUsuario?.avatar && avatarImg) {
        avatarImg.src = datosUsuario.avatar;
    }

    btnCambiarFoto?.addEventListener("click", () => inputFileAvatar?.click());
 
    inputFileAvatar?.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (!file) return;
 
        if (file.size > 1024 * 1024) {
            Swal.fire({
                icon: "warning",
                title: "Imagen muy grande",
                text: "Elegí una foto menor a 1MB.",
                confirmButtonColor: "#2c5282"
            });
            return;
        }
 
        const reader = new FileReader();
        reader.onload = function (event) {
            const base64Image = event.target.result;
            if (avatarImg) avatarImg.src = base64Image;
            let usuarioAGuardar = listaUsuarios.find(
                u => u.username?.toLowerCase() === currentUser.toLowerCase()
            );
 
            if (!usuarioAGuardar && currentUser === "Administrador") {
                usuarioAGuardar = { username: "Administrador", nombre: "Administrador", apellido: "del Sitio", email: "admin@sinculpa.com" };
                listaUsuarios.push(usuarioAGuardar);
            }
 
            if (usuarioAGuardar) {
                usuarioAGuardar.avatar = base64Image;
                localStorage.setItem("usuariosRegistrados", JSON.stringify(listaUsuarios));
 
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "success",
                    title: "Foto actualizada",
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true
                }).then(() => window.location.reload());
            }
        };
        reader.readAsDataURL(file);
    });
}
 
function initLogout() {
    const btnLogout = document.getElementById("btn-perfil-logout");
    btnLogout?.addEventListener("click", function (e) {
        e.preventDefault();
        Swal.fire({
            icon: "question",
            title: "¿Cerrar sesión?",
            showCancelButton: true,
            confirmButtonText: "Sí, salir",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#e53e3e",
            cancelButtonColor: "#68a9df"
        }).then(result => {
            if (result.isConfirmed) {
                sessionStorage.setItem("isLoggedIn", "false");
                sessionStorage.setItem("userName", "");
                sessionStorage.removeItem("displayName");
                window.location.href = "../../index.html";
            }
        });
    });
}

const ACORDEON_CONFIG = {
    credito: {
        panelId:  "panel-credito",
        storageKey: "sc_pago_credito",
        tipo: "tarjeta",
        label: "Tarjeta de Crédito",
        campos: [
            { id: "cred-nombre",  label: "Nombre en la tarjeta", placeholder: "Como figura en la tarjeta", tipo: "text",     col: "full",  required: true },
            { id: "cred-numero",  label: "Número de tarjeta",    placeholder: "0000 0000 0000 0000",        tipo: "text",     inputmode: "numeric", maxlength: 19, required: true },
            { id: "cred-venc",    label: "Vencimiento (MM/AA)",  placeholder: "MM/AA",                     tipo: "text",     maxlength: 5, required: true },
            { id: "cred-marca",   label: "Marca",                placeholder: "",                           tipo: "select",   opciones: ["Visa","Mastercard","American Express","Naranja","Cabal"], required: true },
        ]
    },
    debito: {
        panelId:  "panel-debito",
        storageKey: "sc_pago_debito",
        tipo: "tarjeta",
        label: "Tarjeta de Débito",
        campos: [
            { id: "deb-nombre",  label: "Nombre en la tarjeta", placeholder: "Como figura en la tarjeta", tipo: "text",  col: "full", required: true },
            { id: "deb-numero",  label: "Número de tarjeta",    placeholder: "0000 0000 0000 0000",        tipo: "text",  inputmode: "numeric", maxlength: 19, required: true },
            { id: "deb-banco",   label: "Banco emisor",         placeholder: "Ej: Banco Nación",           tipo: "text",  required: true },
            { id: "deb-marca",   label: "Marca",                placeholder: "",                           tipo: "select", opciones: ["Visa Débito","Mastercard Débito","Maestro","Cabal Débito"], required: true },
        ]
    },
    cbu: {
        panelId:  "panel-cbu",
        storageKey: "sc_pago_cbu",
        tipo: "bancario",
        label: "CBU / Alias",
        campos: [
            { id: "cbu-titular", label: "Titular de la cuenta", placeholder: "Nombre completo",    tipo: "text", col: "full", required: true },
            { id: "cbu-numero",  label: "CBU (22 dígitos)",     placeholder: "0000000000000000000000", tipo: "text", inputmode: "numeric", maxlength: 22, required: true },
            { id: "cbu-alias",   label: "Alias (opcional)",     placeholder: "mi.alias.bancario",   tipo: "text", required: false },
            { id: "cbu-banco",   label: "Banco",                placeholder: "Ej: Banco Galicia",   tipo: "text", required: false },
        ]
    },
    crypto: {
        panelId:  "panel-crypto",
        storageKey: "sc_pago_crypto",
        tipo: "crypto",
        label: "Cripto / Wallet",
        campos: [
            { id: "cry-red",     label: "Red / Moneda",         placeholder: "",                    tipo: "select", opciones: ["Bitcoin (BTC)","Ethereum (ETH)","USDT (TRC-20)","USDT (ERC-20)","USDC","DAI","Solana (SOL)"], required: true },
            { id: "cry-wallet",  label: "Dirección de wallet",  placeholder: "0x...",               tipo: "text", col: "full", required: true },
            { id: "cry-alias",   label: "Alias / Apodo",        placeholder: "Ej: Mi wallet principal", tipo: "text", required: false },
        ]
    }
};
 
function initAcordeones() {
    document.querySelectorAll(".pago-acordeon__header").forEach(btn => {
        btn.addEventListener("click", function () {
            const panelId = this.dataset.target;
            const panel   = document.getElementById(panelId);
            const isOpen  = this.getAttribute("aria-expanded") === "true";

            document.querySelectorAll(".pago-acordeon__header").forEach(b => {
                b.setAttribute("aria-expanded", "false");
                const p = document.getElementById(b.dataset.target);
                if (p) p.hidden = true;
            });
 
            if (!isOpen) {
                this.setAttribute("aria-expanded", "true");
                if (panel) {
                    panel.hidden = false;
                    renderPanelPago(panelId);
                }
            }
        });
    });
}

function keyPorPanel(panelId) {
    return Object.keys(ACORDEON_CONFIG).find(k => ACORDEON_CONFIG[k].panelId === panelId);
}

function renderPanelPago(panelId) {
    const key    = keyPorPanel(panelId);
    if (!key) return;
    const config = ACORDEON_CONFIG[key];
    const panel  = document.getElementById(panelId);
    if (!panel) return;
 
    const guardado = JSON.parse(localStorage.getItem(config.storageKey));
 
    if (guardado) {
        renderVistaGuardada(panel, config, guardado, key);
    } else {
        renderFormularioAlta(panel, config, key);
    }
}

function renderVistaGuardada(panel, config, datos, key) {
    const esTarjeta = config.tipo === "tarjeta";
 
    let previewHTML = "";
    if (esTarjeta) {
        const numRaw  = (datos[config.campos.find(c => c.id.includes("numero"))?.id] || "").replace(/\s/g, "");
        const numMask = numRaw.length >= 4
            ? `•••• •••• •••• ${numRaw.slice(-4)}`
            : "•••• •••• •••• ••••";
 
        const campoNombre = config.campos.find(c => c.id.includes("nombre"));
        const campoVenc   = config.campos.find(c => c.id.includes("venc"));
        const campoMarca  = config.campos.find(c => c.id.includes("marca"));
 
        const iconoMarca = {
            "Visa": "fa-brands fa-cc-visa",
            "Visa Débito": "fa-brands fa-cc-visa",
            "Mastercard": "fa-brands fa-cc-mastercard",
            "Mastercard Débito": "fa-brands fa-cc-mastercard",
            "American Express": "fa-brands fa-cc-amex",
        }[datos[campoMarca?.id]] || "fa-solid fa-credit-card";
 
        previewHTML = `
        <div class="pago-tarjeta-preview">
            <div class="tarjeta-preview__nombre">${datos[campoNombre?.id] || "—"}</div>
            <div class="tarjeta-preview__numero">${numMask}</div>
            <div class="tarjeta-preview__footer">
                <div class="tarjeta-preview__venc">
                    VENCE ${campoVenc ? (datos[campoVenc.id] || "••/••") : "••/••"}
                </div>
                <i class="${iconoMarca} tarjeta-preview__brand"></i>
            </div>
        </div>
        `;
    }
 
    const filasHTML = config.campos.map(campo => {
        let valor = datos[campo.id] || "—";
        if (campo.id.includes("numero") && esTarjeta) {
            const raw = valor.replace(/\s/g, "");
            valor = raw.length >= 4 ? `•••• •••• •••• ${raw.slice(-4)}` : valor;
        }

        if (campo.id === "cbu-numero" && valor !== "—") {
            const raw = valor.replace(/\s/g, "");
            valor = raw.length >= 8 ? `${raw.slice(0, 4)} ••••••••••••••• ${raw.slice(-4)}` : valor;
        }

        if (campo.id === "cry-wallet" && valor !== "—") {
            valor = valor.length >= 10 ? `${valor.slice(0, 6)}...${valor.slice(-4)}` : valor;
        }
        return `
        <div class="pago-dato-fila">
            <strong>${campo.label}:</strong>
            <span>${valor}</span>
        </div>
        `;
    }).join("");
 
    panel.innerHTML = `
        ${previewHTML}
        <div class="pago-datos-guardados">${filasHTML}</div>
        <div class="pago-edicion-acciones">
            <button class="btn-pago-modificar" onclick="editarMedioPago('${config.storageKey}', '${config.panelId}')">
                <i class="fa-solid fa-pen"></i> Modificar
            </button>
            <button class="btn-pago-eliminar" onclick="eliminarMedioPago('${config.storageKey}', '${config.panelId}')">
                <i class="fa-solid fa-trash-can"></i> Eliminar
            </button>
        </div>
    `;
}

function renderFormularioAlta(panel, config, key, valoresIniciales = null) {
    const camposHTML = config.campos.map(campo => {
        const val = valoresIniciales?.[campo.id] || "";
        const colClass = campo.col === "full" ? "pago-form-grid full" : "";
 
        if (campo.tipo === "select") {
            const optionsHTML = campo.opciones.map(o =>
                `<option value="${o}" ${val === o ? "selected" : ""}>${o}</option>`
            ).join("");
            return `
            <div class="pago-campo ${campo.col === "full" ? "full" : ""}">
                <label for="${campo.id}">${campo.label}${campo.required ? " *" : ""}</label>
                <select id="${campo.id}">
                    <option value="">Seleccioná...</option>
                    ${optionsHTML}
                </select>
                <span class="campo-error" id="err-${campo.id}"></span>
            </div>`;
        }
 
        return `
        <div class="pago-campo ${campo.col === "full" ? "full" : ""}">
            <label for="${campo.id}">${campo.label}${campo.required ? " *" : ""}</label>
            <input
                type="${campo.tipo}"
                id="${campo.id}"
                placeholder="${campo.placeholder}"
                ${campo.maxlength ? `maxlength="${campo.maxlength}"` : ""}
                ${campo.inputmode ? `inputmode="${campo.inputmode}"` : ""}
                value="${val}"
            >
            <span class="campo-error" id="err-${campo.id}"></span>
        </div>`;
    }).join("");
 
    panel.innerHTML = `
        <form class="pago-form-grid" id="form-${key}" novalidate>
            ${camposHTML}
        </form>
        <div class="pago-form-acciones" style="margin-top:1.6rem">
            <button class="btn-pago-guardar" onclick="guardarMedioPago('${key}')">
                <i class="fa-solid fa-floppy-disk"></i>
                ${valoresIniciales ? "Actualizar" : "Guardar"}
            </button>
        </div>
    `;
 
    bindFormatosTarjeta(key);
}

function bindFormatosTarjeta(key) {
    const config = ACORDEON_CONFIG[key];
    config.campos.forEach(campo => {
        const input = document.getElementById(campo.id);
        if (!input) return;
        if (campo.id.includes("numero") && config.tipo === "tarjeta") {
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

        if (campo.id === "cbu-numero") {
            input.addEventListener("input", function () {
                this.value = this.value.replace(/\D/g, "").substring(0, 22);
            });
        }
    });
}

function guardarMedioPago(key) {
    const config = ACORDEON_CONFIG[key];
    const errores = {};
    const datos = {};
 
    config.campos.forEach(campo => {
        const input = document.getElementById(campo.id);
        if (!input) return;
 
        const val = input.value.trim();
        datos[campo.id] = val;
 
        const errEl = document.getElementById(`err-${campo.id}`);
        if (errEl) errEl.textContent = "";
        input.classList.remove("invalid");
 
        if (campo.required && !val) {
            errores[campo.id] = "Campo obligatorio";
        }
 
        if (val) {
            if (campo.id.includes("venc")) {
                if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(val)) {
                    errores[campo.id] = "Formato MM/AA";
                }
            }
            if (campo.id.includes("numero") && config.tipo === "tarjeta") {
                if (val.replace(/\s/g, "").length !== 16) {
                    errores[campo.id] = "Debe tener 16 dígitos";
                }
            }
            if (campo.id === "cbu-numero" && val.length !== 22) {
                errores[campo.id] = "El CBU debe tener 22 dígitos";
            }
        }
    });

    if (Object.keys(errores).length > 0) {
        Object.entries(errores).forEach(([id, msg]) => {
            const input = document.getElementById(id);
            const errEl = document.getElementById(`err-${id}`);
            if (input) input.classList.add("invalid");
            if (errEl) errEl.textContent = msg;
        });
 
        Swal.fire({
            toast: true, position: "top-end", icon: "warning",
            title: "Revisá los campos marcados",
            showConfirmButton: false, timer: 2500
        });
        return;
    }
 
    localStorage.setItem(config.storageKey, JSON.stringify(datos));
 
    Swal.fire({
        toast: true, position: "top-end", icon: "success",
        title: `${config.label} guardada`,
        showConfirmButton: false, timer: 2000, timerProgressBar: true
    });
 
    renderPanelPago(config.panelId);
}
 
function editarMedioPago(storageKey, panelId) {
    const key    = keyPorPanel(panelId);
    const config = ACORDEON_CONFIG[key];
    const panel  = document.getElementById(panelId);
    const guardado = JSON.parse(localStorage.getItem(storageKey));
    renderFormularioAlta(panel, config, key, guardado);
}

function eliminarMedioPago(storageKey, panelId) {
    Swal.fire({
        title: "¿Eliminar este medio de pago?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#e53e3e",
        cancelButtonColor: "#68a9df"
    }).then(result => {
        if (result.isConfirmed) {
            localStorage.removeItem(storageKey);
            renderPanelPago(panelId);
            Swal.fire({
                toast: true, position: "top-end", icon: "info",
                title: "Medio de pago eliminado",
                showConfirmButton: false, timer: 2000
            });
        }
    });
}