const PROVINCIAS_POR_PAIS = {
    AR: ["Buenos Aires","CABA","Catamarca","Chaco","Chubut","Córdoba","Corrientes","Entre Ríos","Formosa","Jujuy","La Pampa","La Rioja","Mendoza","Misiones","Neuquén","Río Negro","Salta","San Juan","San Luis","Santa Cruz","Santa Fe","Santiago del Estero","Tierra del Fuego","Tucumán"],
    BO: ["Beni","Chuquisaca","Cochabamba","La Paz","Oruro","Pando","Potosí","Santa Cruz","Tarija"],
    BR: ["Acre","Alagoas","Amapá","Amazonas","Bahia","Ceará","Espírito Santo","Goiás","Maranhão","Mato Grosso","Mato Grosso do Sul","Minas Gerais","Pará","Paraíba","Paraná","Pernambuco","Piauí","Rio de Janeiro","Rio Grande do Norte","Rio Grande do Sul","Rondônia","Roraima","Santa Catarina","São Paulo","Sergipe","Tocantins","Distrito Federal"],
    CL: ["Arica y Parinacota","Tarapacá","Antofagasta","Atacama","Coquimbo","Valparaíso","Metropolitana","O'Higgins","Maule","Ñuble","Biobío","La Araucanía","Los Ríos","Los Lagos","Aysén","Magallanes"],
    CO: ["Amazonas","Antioquia","Arauca","Atlántico","Bolívar","Boyacá","Caldas","Caquetá","Casanare","Cauca","Cesar","Chocó","Córdoba","Cundinamarca","Guainía","Guaviare","Huila","La Guajira","Magdalena","Meta","Nariño","Norte de Santander","Putumayo","Quindío","Risaralda","San Andrés","Santander","Sucre","Tolima","Valle del Cauca","Vaupés","Vichada","Bogotá D.C."],
    EC: ["Azuay","Bolívar","Cañar","Carchi","Chimborazo","Cotopaxi","El Oro","Esmeraldas","Galápagos","Guayas","Imbabura","Loja","Los Ríos","Manabí","Morona Santiago","Napo","Orellana","Pastaza","Pichincha","Santa Elena","Santo Domingo","Sucumbíos","Tungurahua","Zamora Chinchipe"],
    PY: ["Alto Paraguay","Alto Paraná","Amambay","Boquerón","Caaguazú","Caazapá","Canindeyú","Central","Concepción","Cordillera","Guairá","Itapúa","Misiones","Ñeembucú","Paraguarí","Presidente Hayes","San Pedro","Asunción"],
    PE: ["Amazonas","Áncash","Apurímac","Arequipa","Ayacucho","Cajamarca","Callao","Cusco","Huancavelica","Huánuco","Ica","Junín","La Libertad","Lambayeque","Lima","Loreto","Madre de Dios","Moquegua","Pasco","Piura","Puno","San Martín","Tacna","Tumbes","Ucayali"],
    UY: ["Artigas","Canelones","Cerro Largo","Colonia","Durazno","Flores","Florida","Lavalleja","Maldonado","Montevideo","Paysandú","Río Negro","Rivera","Rocha","Salto","San José","Soriano","Tacuarembó","Treinta y Tres"],
    VE: ["Amazonas","Anzoátegui","Apure","Aragua","Barinas","Bolívar","Carabobo","Cojedes","Delta Amacuro","Falcón","Guárico","Lara","Mérida","Miranda","Monagas","Nueva Esparta","Portuguesa","Sucre","Táchira","Trujillo","Vargas","Yaracuy","Zulia","Distrito Capital"],
    US: ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming","District of Columbia"],
    DE: ["Baden-Württemberg","Bavaria","Berlin","Brandenburg","Bremen","Hamburg","Hesse","Lower Saxony","Mecklenburg-Vorpommern","North Rhine-Westphalia","Rhineland-Palatinate","Saarland","Saxony","Saxony-Anhalt","Schleswig-Holstein","Thuringia"],
    ES: ["Andalucía","Aragón","Asturias","Islas Baleares","Canarias","Cantabria","Castilla-La Mancha","Castilla y León","Cataluña","Comunidad Valenciana","Extremadura","Galicia","La Rioja","Comunidad de Madrid","Región de Murcia","Navarra","País Vasco","Ceuta","Melilla"],
    IT: ["Abruzzo","Basilicata","Calabria","Campania","Emilia-Romagna","Friuli-Venezia Giulia","Lazio","Liguria","Lombardia","Marche","Molise","Piemonte","Puglia","Sardegna","Sicilia","Toscana","Trentino-Alto Adige","Umbria","Valle d'Aosta","Veneto"]
};

const formRegistro = document.getElementById("form-registro");

const campos = {
    username:    document.getElementById("username"),
    passwordReg: document.getElementById("password-reg"),
    nombre1:     document.getElementById("nombre1"),
    nombre2:     document.getElementById("nombre2"),
    apellido:    document.getElementById("apellido"),
    tipoDoc:     document.getElementById("tipo_doc"),
    numDoc:      document.getElementById("num_doc"),
    fechaNac:    document.getElementById("fecha_nac"),
    email:       document.getElementById("email"),
    tel_fijo:    document.getElementById("tel_fijo"),
    telefono:    document.getElementById("telefono"),
    direccion:   document.getElementById("direccion"),
    altura:      document.getElementById("altura"),
    piso:        document.getElementById("piso"),
    depto:       document.getElementById("depto"),
    cp:          document.getElementById("cp"),
    pais:        document.getElementById("pais"),
    provincia:   document.getElementById("provincia"),
    localidad:   document.getElementById("localidad"),
};
 
function marcarValido(input) {
    input.style.border = "2px solid #38a169";
    input.style.boxShadow = "0 0 0 0.3rem rgba(56, 161, 105, 0.18)";
    input.style.backgroundColor = "#f0fff4";
    const msgEl = input.parentElement.querySelector(".msg-validacion");
    if (msgEl) { msgEl.textContent = "✔ Correcto"; msgEl.style.color = "#38a169"; }
}
 
function marcarInvalido(input, mensaje) {
    input.style.border = "2px solid #e53e3e";
    input.style.boxShadow = "0 0 0 0.3rem rgba(229, 62, 62, 0.18)";
    input.style.backgroundColor = "#fff5f5";
    const msgEl = input.parentElement.querySelector(".msg-validacion");
    if (msgEl) { msgEl.textContent = "✖ " + mensaje; msgEl.style.color = "#e53e3e"; }
}
 
function quitarEstilos(input) {
    input.style.border = "";
    input.style.boxShadow = "";
    input.style.backgroundColor = "";
    const msgEl = input.parentElement.querySelector(".msg-validacion");
    if (msgEl) msgEl.textContent = "";
}

const selectPais     = campos.pais;
const selectProvincia = campos.provincia;
 
selectPais.addEventListener("change", () => {
    const codigo = selectPais.value;
    const lista  = PROVINCIAS_POR_PAIS[codigo] || [];
 
    selectProvincia.innerHTML = `<option value="" disabled selected>Seleccioná provincia / estado</option>`;
    lista.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p;
        opt.textContent = p;
        selectProvincia.appendChild(opt);
    });
 
    selectProvincia.disabled = lista.length === 0;
 
    quitarEstilos(selectProvincia);
    delete selectProvincia.dataset.touched;
 
    if (selectPais.dataset.touched) validarCampo(selectPais);
});
 
function validarCampo(input) {
    if (!input) return true;
    const valor = input.value.trim();
    const id    = input.id;
    const opcionales = ["nombre2", "tel_fijo"];
    if (opcionales.includes(id)) {
        if (!valor) { quitarEstilos(input); return true; }
    }
 
    if (!valor) {
        marcarInvalido(input, "Este campo es obligatorio");
        return false;
    }
 
    const regexLetras  = /^[a-zA-Z\sñáéíóúÁÉÍÓÚüÜäÄöÖßàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛ]+$/;
    const regexUsername = /^[a-zA-Z0-9_ñÑ]+$/;
 
    switch (id) {
 
        case "username":
            if (!regexUsername.test(valor)) {
                marcarInvalido(input, "Solo letras, números y guion bajo, sin espacios");
                return false;
            }
            if (valor.length < 4) { marcarInvalido(input, "Mínimo 4 caracteres"); return false; }
            const listaU = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
            if (listaU.some(u => u.username.toLowerCase() === valor.toLowerCase())) {
                marcarInvalido(input, `"${valor}" ya está en uso`); return false;
            }
            break;
 
        case "password-reg":
            if (valor.length < 4) { marcarInvalido(input, "Mínimo 4 caracteres"); return false; }
            break;
 
        case "nombre1":
        case "nombre2":
        case "apellido":
            if (!regexLetras.test(valor)) { marcarInvalido(input, "Solo se permiten letras"); return false; }
            break;
 
        case "num_doc":
            if (!/^[0-9]+$/.test(valor)) { marcarInvalido(input, "Solo números"); return false; }
            break;
 
        case "fecha_nac": {
            const fecha   = new Date(valor);
            const hoy     = new Date();
            const minimo  = new Date("1900-01-01");
            if (fecha > hoy)   { marcarInvalido(input, "No puede ser una fecha futura"); return false; }
            if (fecha < minimo){ marcarInvalido(input, "Fecha demasiado antigua"); return false; }
            let edad = hoy.getFullYear() - fecha.getFullYear();
            const cumplioEsteAnio =
                hoy.getMonth() > fecha.getMonth() ||
                (hoy.getMonth() === fecha.getMonth() && hoy.getDate() >= fecha.getDate());
            if (!cumplioEsteAnio) edad--;
            if (edad < 18) { marcarInvalido(input, "Debés tener al menos 18 años"); return false; }
            break;
        }
 
        case "email": {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
                marcarInvalido(input, "Formato de email inválido"); return false;
            }
            const listaE = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
            if (listaE.some(u => u.email === valor.toLowerCase())) {
                marcarInvalido(input, "Este email ya está registrado"); return false;
            }
            break;
        }
 
        case "tel_fijo":
        case "telefono":
            if (!/^[0-9\+\-\s\(\)]+$/.test(valor)) {
                marcarInvalido(input, "Formato de teléfono inválido"); return false;
            }
            break;
 
        case "altura":
        case "piso":
            if (!/^[0-9]+$/.test(valor)) { marcarInvalido(input, "Solo números"); return false; }
            break;
 
        case "depto":
            if (!/^[A-Za-z]$/.test(valor)) { marcarInvalido(input, "Solo una letra (A–Z)"); return false; }
            break;
 
        case "cp":
            if (!/^[0-9A-Za-z]{1,5}$/.test(valor)) {
                marcarInvalido(input, "Máx. 5 caracteres alfanuméricos"); return false;
            }
            break;
 
        case "localidad":
            if (!/^[a-zA-ZÀ-ÖØ-öø-ÿß\s\-']+$/.test(valor)) {
                marcarInvalido(input, "Solo letras y caracteres especiales permitidos"); return false;
            }
            break;
    }
 
    marcarValido(input);
    return true;
}

Object.values(campos).forEach(input => {
    if (!input) return;
    input.addEventListener("input", () => { input.dataset.touched = "true"; validarCampo(input); });
    input.addEventListener("blur",  () => { input.dataset.touched = "true"; validarCampo(input); });
    input.addEventListener("change",() => { input.dataset.touched = "true"; validarCampo(input); });
});
 
const btnLimpiar = document.querySelector(".btn-limpiar");
if (btnLimpiar) {
    btnLimpiar.addEventListener("click", () => {
        Object.values(campos).forEach(input => {
            if (!input) return;
            quitarEstilos(input);
            delete input.dataset.touched;
        });
        selectProvincia.innerHTML = `<option value="" disabled selected>Primero seleccioná un país</option>`;
        selectProvincia.disabled = true;
    });
}

const togglePass = document.getElementById("togglePassReg");
const inputPass  = campos.passwordReg;
if (togglePass && inputPass) {
    togglePass.addEventListener("click", () => {
        const esPassword = inputPass.type === "password";
        inputPass.type   = esPassword ? "text" : "password";
        togglePass.textContent = esPassword ? "🙈 Ocultar contraseña" : "👁 Mostrar contraseña";
    });
}
 
formRegistro.addEventListener("submit", function (e) {
    e.preventDefault();
 
    let hayErrores = false;
    Object.values(campos).forEach(input => {
        if (!input) return;
        input.dataset.touched = "true";
        if (!validarCampo(input)) hayErrores = true;
    });
 
    if (hayErrores) {
        const mapa = {
            username: "Nombre de Usuario", "password-reg": "Contraseña",
            nombre1: "Nombre", apellido: "Apellido", tipo_doc: "Tipo de Documento",
            num_doc: "Nro. de Documento", fecha_nac: "Fecha de Nacimiento",
            email: "Email", telefono: "Teléfono Móvil",
            direccion: "Dirección", altura: "Altura", piso: "Piso",
            depto: "Depto", cp: "Código Postal",
            pais: "País", provincia: "Provincia / Estado", localidad: "Localidad"
        };
        const nombresErrores = [];
        Object.values(campos).forEach(input => {
            if (!input) return;
            const msgEl = input.parentElement.querySelector(".msg-validacion");
            if (msgEl?.textContent.startsWith("✖")) {
                nombresErrores.push(`<li><b>${mapa[input.id] || input.id}</b></li>`);
            }
        });
 
        Swal.fire({
            icon: "error",
            title: "Campos incorrectos",
            html: `<p style="font-size:1.4rem">Corregí los campos marcados en rojo:</p>
                   <ul style="text-align:left;margin-top:10px;padding-left:20px;font-size:1.3rem">
                     ${nombresErrores.join("")}
                   </ul>`,
            confirmButtonColor: "#2c5282",
            confirmButtonText: "Entendido"
        });
        return;
    }
 
    const nuevoUsuario = {
        username:   campos.username.value.trim(),
        nombre:     campos.nombre1.value.trim(),
        nombre2:    campos.nombre2?.value.trim() || "",
        apellido:   campos.apellido.value.trim(),
        tipoDoc:    campos.tipoDoc.value,
        documento:  campos.numDoc.value.trim(),
        fechaNac:   campos.fechaNac.value,
        email:      campos.email.value.trim().toLowerCase(),
        password:   campos.passwordReg.value,
        tel_fijo:   campos.tel_fijo?.value.trim() || "",
        telefono:   campos.telefono.value.trim(),
        direccion:  campos.direccion.value.trim(),
        altura:     campos.altura.value.trim(),
        piso:       campos.piso.value.trim(),
        depto:      campos.depto.value.trim().toUpperCase(),
        cp:         campos.cp.value.trim().toUpperCase(),
        pais:       selectPais.options[selectPais.selectedIndex]?.text || "",
        provincia:  selectProvincia.value,
        localidad:  campos.localidad.value.trim(),
    };
 
    const listaUsuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
    listaUsuarios.push(nuevoUsuario);
    localStorage.setItem("usuariosRegistrados", JSON.stringify(listaUsuarios));
 
    let segundos = 2;
    Swal.fire({
        icon: "success",
        title: "¡Cuenta creada con éxito!",
        html: `<p style="font-size:1.5rem">Redirigiendo al login en <b id="cuenta">${segundos}</b> segundo${segundos !== 1 ? "s" : ""}...</p>`,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        timer: segundos * 1000,
        timerProgressBar: true,
        didOpen: () => {
            const intervalo = setInterval(() => {
                segundos--;
                const el = document.getElementById("cuenta");
                if (el) el.textContent = segundos;
                if (segundos <= 0) clearInterval(intervalo);
            }, 1000);
        },
        willClose: () => { window.location.href = "./login.html"; }
    });
});