document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.getElementById("form-contacto");
    const modal = document.getElementById("modal-exito");
 
    checkAutocompletarContacto();
 
    if (!formulario) return;
 
    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault(); 
 
        const nuevoMensaje = {
            nombre: document.getElementById("nombre").value,
            email: document.getElementById("email").value,
            telefono: document.getElementById("telefono").value,
            mensaje: document.getElementById("mensaje").value,
            fecha: new Date().toLocaleString()
        };

        const listaMensajes = JSON.parse(localStorage.getItem("contacto_mensajes")) || [];
 
        listaMensajes.push(nuevoMensaje);
        localStorage.setItem("contacto_mensajes", JSON.stringify(listaMensajes));
        formulario.reset();
        modal.classList.add("mostrar"); 
 
        setTimeout(function () {
            window.location.href = "../../index.html";
        }, 3000);
    });
});
 
function checkAutocompletarContacto() {
    const banner = document.getElementById("contacto-autocompletar");
    const btn = document.getElementById("btn-autocompletar-contacto");
    const currentUser = sessionStorage.getItem("userName");
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
 
    if (!isLoggedIn || !currentUser || !banner || !btn) return;
 
    const listaUsuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
    const datosUsuario = listaUsuarios.find(u => u.username?.toLowerCase() === currentUser.toLowerCase());
 
    if (!datosUsuario) return;
 
    banner.style.display = "flex";
 
    btn.addEventListener("click", function () {
        const nombreInput = document.getElementById("nombre");
        const emailInput = document.getElementById("email");
 
        const nombreCompleto = [datosUsuario.nombre, datosUsuario.nombre2, datosUsuario.apellido]
            .filter(Boolean).join(" ");
 
        let completados = 0;
        if (nombreInput && !nombreInput.value && nombreCompleto) { nombreInput.value = nombreCompleto; completados++; }
        if (emailInput && !emailInput.value && datosUsuario.email) { emailInput.value = datosUsuario.email; completados++; }
 
        if (typeof Swal !== "undefined") {
            Swal.fire({
                toast: true, position: "top-end", icon: "success",
                title: completados > 0
                    ? `${completados} campos completados automáticamente`
                    : "Los campos ya estaban completos",
                showConfirmButton: false, timer: 2200, timerProgressBar: true
            });
        }
 
        banner.style.display = "none";
    });
}