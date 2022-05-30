const cards = document.getElementById("cards");
const items = document.getElementById("items");
const footer = document.getElementById("footer");

const templateCard = document.getElementById("template-card").content;
const templateFooter = document.getElementById("template-footer").content;
const templateCarrito = document.getElementById("template-carrito").content;
const fragment = document.createDocumentFragment();

let carrito = {};

document.addEventListener("DOMContentLoaded", () => {
    fetchData();
    if (localStorage.getItem("carrito")) {
        carrito = JSON.parse(localStorage.getItem("carrito"));
        pintarCarrito();
    }
});
//detecto que btn se presiona
cards.addEventListener("click", (e) => {
    addCarrito(e);
});
items.addEventListener("click", (e) => {
    btnAccion(e);
});

const fetchData = async() => {
    try {
        const res = await fetch("json/base.json");
        const data = await res.json();
        pintarCards(data);
    } catch (error) {
        console.log(error);
    }
};
const pintarCards = (data) => {
    //una vez que tengo la data la recorro
    data.forEach((curso) => {
        //modifico el template
        templateCard.querySelector("h5").textContent = curso.title;
        templateCard.querySelector("p").textContent = curso.precio;
        templateCard.querySelector("img").setAttribute("src", curso.img);
        //creo los Id de los btn
        templateCard.querySelector(".btn").dataset.id = curso.id;
        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone);
    });
    //una vez que tengo el framgent construido modifico el DOM
    cards.appendChild(fragment);
};
const addCarrito = (e) => {
    //si lo que hacemos click contiene la clase btn dando true o false
    if (e.target.classList.contains("btn")) {
        Toastify({
            text: "Gracias por su compra",
            duration: 3000,
            gravity: "top",
            position: "right",
        }).showToast();
        //enviamos el elemento padre a setCarrito
        setCarrito(e.target.parentElement);
    }
    e.stopPropagation();
};

const setCarrito = (objeto) => {
    const curso = {
        id: objeto.querySelector(".btn").dataset.id,
        title: objeto.querySelector("h5").textContent,
        precio: objeto.querySelector("p").textContent,
        cantidad: 1,
    };
    if (carrito.hasOwnProperty(curso.id)) {
        const notyf = new Notyf();
        notyf.error({
            message: "Le recuerdo que ya adquirió ese curso",
            duration: 4000,
            icon: false,
        });
        curso.cantidad = carrito[curso.id].cantidad + 1;
    }
    carrito[curso.id] = {
        ...curso,
    };
    pintarCarrito();
};

const pintarCarrito = () => {
    items.innerHTML = "";
    Object.values(carrito).forEach((curso) => {
        templateCarrito.querySelector("th").textContent = curso.id;
        templateCarrito.querySelectorAll("td")[0].textContent = curso.title;
        templateCarrito.querySelectorAll("td")[1].textContent = curso.cantidad;
        templateCarrito.querySelector(".btn-info").dataset.id = curso.id;
        templateCarrito.querySelector(".btn-danger").dataset.id = curso.id;
        templateCarrito.querySelector("span").textContent = curso.cantidad * curso.precio;
        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    });
    items.appendChild(fragment);
    pintarFooter();
    localStorage.setItem("carrito", JSON.stringify(carrito));
};

const pintarFooter = () => {
    footer.innerHTML = "";
    //si está vacio el carrito muestra la leyenda de vacio
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Adquiera sus cursos Ya!</th>
        `;
        return;
    }
    const nCantidad = Object.values(carrito).reduce(
        (acc, { cantidad }) => acc + cantidad, 0
    );
    const nPrecio = Object.values(carrito).reduce(
        (acc, { cantidad, precio }) => acc + cantidad * precio, 0
    );
    templateFooter.querySelectorAll("td")[0].textContent = nCantidad;
    templateFooter.querySelector("span").textContent = nPrecio;
    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    footer.appendChild(fragment);
    const btnVaciar = document.getElementById("vaciar-carrito");
    btnVaciar.addEventListener("click", () => {
        carrito = {};
        pintarCarrito();
    });
    const btnComprar = document.getElementById("comprar-carrito");
    // --------------------------------------------------------------------------------------------
    btnComprar.addEventListener("click", () => {
        if (nPrecio > parseFloat(localStorage.getItem("Saldo"))) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Saldo insuficiente para comprar",
            });
        } else {
            Swal.fire({
                icon: "success",
                title: "Terminar la compra ",
                text: "El valor de la compra sería de " +
                    nPrecio +
                    " pesos y quedaría en su caja " +
                    (parseFloat(localStorage.getItem("Saldo")) - nPrecio) +
                    " pesos",
                showDenyButton: true,
                confirmButtonText: "OK",
                denyButtonText: "Salir",
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.setItem(
                        "Saldo",
                        parseFloat(localStorage.getItem("Saldo")) - nPrecio
                    );
                    carrito = {};
                    pintarCarrito();
                    location.reload();
                } else if (result.isDenied) {
                    Swal.fire("No se realizo la compra", "", "info");
                }
            });
        }
    });
};
// capturamos los elementos que hay en la compra
const btnAccion = (e) => {
    if (e.target.classList.contains("btn-info")) {
        const curso = carrito[e.target.dataset.id];
        curso.cantidad++;
        carrito[e.target.dataset.id] = {...curso, };
        pintarCarrito();
    }
    if (e.target.classList.contains("btn-danger")) {
        const curso = carrito[e.target.dataset.id];
        curso.cantidad--;
        if (curso.cantidad === 0) {
            delete carrito[e.target.dataset.id];
        }
        pintarCarrito();
    }
    e.stopPropagation();
};