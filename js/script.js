const hoy = new Date();
// objeto que realiza el calculo del plazo fijo
class CalculoPlazo {
    constructor(monto, dias, realizoPlazo) {
        this.monto = monto;
        this.dias = dias;
        this.realizoPlazo = realizoPlazo;
    }
    calcular() {
        let plazo = 0;
        const tna = 0.435;
        if (document.getElementById("btnSimular").value == "Simular") {
            if (this.dias < 30) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: "Se debe ingresar más de 30 días",
                })
                document.getElementById('dias').value = "";
                document.getElementById('dias').focus();
            } else {
                if (Number.isInteger(this.monto) && Number.isInteger(this.dias)) {
                    plazo = this.monto * (tna * this.dias / 365);
                    document.getElementById('TNA').innerHTML = "T.N.A: 43.5%";
                    document.getElementById('interes').innerHTML = "Intereses: " + plazo.toFixed(2) + " pesos";
                    document.getElementById('total').innerHTML = "Monto al vencimiento: " + (this.monto + parseFloat(plazo.toFixed(2))) + " pesos";
                    document.getElementById('fecha').innerHTML = "Fecha del vencimiento: " + agregaDias(hoy, this.dias);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: "Debe ingresar números en los campos",
                    })
                }
            }
            document.getElementById("btnSimular").value = "Conformar";
        } else {
            document.getElementById("btnSimular").value = "Simular";
            conformarPlazo();
            document.getElementById("monto").value = "";
            document.getElementById("dias").value = "";
            document.getElementById('monto').focus();
        }
    }
    conformoPlazo() {
        if (this.realizoPlazo > (parseFloat(localStorage.getItem("Saldo")))) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: "Saldo insuficiente para conformar el plazo fijo",
            })
        } else {
            Swal.fire({
                icon: 'success',
                title: 'Conformar el plazo fijo ',
                text: 'Está seguro/a de ingresar ' + this.realizoPlazo + " pesos, su nuevo saldo sería de " + (parseFloat(localStorage.getItem("Saldo")) - this.realizoPlazo) + " pesos",
                showDenyButton: true,
                confirmButtonText: 'OK',
                denyButtonText: 'Salir',
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.setItem("Saldo", parseFloat(localStorage.getItem("Saldo")) - this.realizoPlazo);
                    console.log(localStorage.getItem("Saldo"));
                    location.reload();
                } else if (result.isDenied) {
                    Swal.fire('No se creó el plazo fijo', '', 'info');
                }
            })
        }
    }
}; //fin objeto CalculoPlazo

class CuentaAhorro {
    constructor(cuenta, saldo, fecha) {
        this.cuenta = cuenta;
        this.saldo = saldo;
        this.ingreso = fecha;
    }
    muestroDatos() {
        console.log(localStorage.getItem("usuario"));
    }
};
// fin objetos


//------------------------------------------------funciones ----------------------------------------------
// función usada en el evento click de simulador.html
function llamarCalculo() {
    const dinero = new CalculoPlazo(parseFloat(document.getElementById('monto').value), parseFloat(document.getElementById('dias').value));
    dinero.calcular();
}

let botonSimular = document.getElementById("btnSimular");
botonSimular.addEventListener("click", llamarCalculo);

function conformarPlazo() {
    console.log(document.getElementById('monto').value);
    const plazoFijo = new CalculoPlazo("", "", parseFloat(document.getElementById('monto').value));
    plazoFijo.conformoPlazo();
}

// Agrego los dias en
function agregaDias(fecha, dia) {
    let resultado = new Date(fecha);
    resultado.setDate(resultado.getDate() + dia);
    return resultado.toLocaleDateString();
}