function llamarCuenta() {
    // CuentaAhorro.muestroDatos();        
    document.getElementById('cuenta').innerHTML = localStorage.getItem("nroCuenta");
    document.getElementById('cliente').innerHTML = "Nombre del usuario : " + localStorage.getItem("usuario");
    document.getElementById("saldoCaja").innerHTML = localStorage.getItem("Saldo");
}

function cargoDinero() {
    if (isNaN(parseFloat(localStorage.getItem("Saldo")))) {
        localStorage.setItem("Saldo", document.getElementById('saldoMonto').value);
        document.getElementById("saldoCaja").innerHTML = localStorage.getItem("Saldo");
        dinero = localStorage.getItem("Saldo");
    } else {
        if (document.getElementById('saldoMonto').value == "") {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: "Debe ingresar un monto",
            })
        } else {
            localStorage.setItem("Saldo", parseFloat(document.getElementById('saldoMonto').value) + parseFloat(localStorage.getItem("Saldo")));
            Toastify({
                text: "Ingreso " + document.getElementById('saldoMonto').value + " pesos",
                duration: 3000,
                gravity: "top",
                position: "right",
            }).showToast();
            document.getElementById("saldoCaja").innerHTML = localStorage.getItem("Saldo");
            let nombreCliente = clientes.find(client => client.nombre == (localStorage.getItem("usuario")));
            nombreCliente.saldo = localStorage.getItem("Saldo");
            document.getElementById("saldoMonto").value = "";
            document.getElementById("saldoMonto").focus();
        }
    }
}
let botonCaja = document.getElementById("btnCaja");
// botonCaja.addEventListener("click", cargoDinero);
botonCaja.addEventListener("click", (e) => {
    e.preventDefault();
    cargoDinero();
})