let contenedorMensajesHtml = document.getElementById("listaMensajes");

function enviarMensaje() {
    const email = document.getElementById("email");
    const mensaje = document.getElementById("mensaje");

    if (!email.value || !mensaje.value) {
        alert("Debe completar los campos");
        return false;
    }

    socket.emit("mensajeNuevo", {
        autor: email.value,
        mensaje: mensaje.value
    });
    mensaje.value = "";
    return false;
}

function borrarMensajes(id) {
    if (id) {
        socket.emit("borrarMensajesPorId", id);
    } else {
        const autor = document.getElementById("email").value;
        socket.emit("borrarMensajes", autor);
    }
}

socket.on("mensajes", (mensajes) => {
    
    document.getElementById('sinMensajes').style.display = 'none';
    document.getElementById('listaMensajes').style.display = 'block';
    contenedorMensajesHtml.innerHTML = "";
    mensajes.map((mensaje) => {
        let divContenedorChat = document.createElement("li");
        divContenedorChat.classList.add("d-flex", "justify-content-between");
        divContenedorChat.innerHTML = `<span class="align-self-center">
        <b style="color: blue;">${mensaje.autor}</b>
        <label style="color: brown;">[${new Date(mensaje.timestamp).toLocaleString()}]</label>:
        <label style="color: green;">${mensaje.mensaje}</label> 
        </span>
        <a><i id="btnBorrarMensajePorId${mensaje.id}" class="bi bi-trash btn"></i></a>`
        contenedorMensajesHtml.appendChild(divContenedorChat);
        let btnBorrarMensajePorId = document.getElementById(`btnBorrarMensajePorId${mensaje.id}`);
        btnBorrarMensajePorId.addEventListener('click', () => {
            borrarMensajes(mensaje.id)
        });
    })
    if (mensajes.length == 0) {
        document.getElementById('listaMensajes').style.display = 'none';
        document.getElementById('sinMensajes').style.display = 'block';
    }
});