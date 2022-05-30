let intentos = 0;
//verifica si se encuentra el cliente ingresado en index.html
Swal.fire({
    title: 'Acceso',
    text: 'Usuarios del sistema',
    imageUrl: './img/icon/logo.jpg',
    imageWidth: 400,
    imageHeight: 200,
    imageAlt: 'Custom image',
})

function verifica() {
    while (intentos < 3) {
        let nombreCliente = clientes.find(client => client.nombre == (document.getElementById('user').value));
        if ((nombreCliente.pass == document.getElementById('contrase').value) && (nombreCliente.nombre == document.getElementById('user').value)) {
            // alert("Bienvenido al sistema"); 
            Swal.fire({
                icon: 'success',
                title: 'Bienvenido ' + nombreCliente.nombre,
                text: 'Al sistema de simulación',
                showDenyButton: true,
                confirmButtonText: 'Ingresar',
                denyButtonText: 'Salir',
            }).then((result) => {
                /* accedo a caja.html si presiona el btn confirmar*/
                if (result.isConfirmed) {
                    window.location = "./sistema.html";
                } else if (result.isDenied) {
                    Swal.fire('Te esperamos nuevamente', '', 'info');
                }
            })
            localStorage.setItem("usuario", nombreCliente.nombre);
            localStorage.setItem("nroCuenta", nombreCliente.cuenta);
            break;
        } else {
            console.log("Usuario no encontrado")
            intentos++;
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: "Le quedan " + (3 - intentos) + " intentos para acceder al sistema",
            })
        }
        if (intentos == 3) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: "Por favor vuelva a recargar la página....",
            })
        }
        break;
    }
}