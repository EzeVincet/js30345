const cards = document.getElementById('cards');
const items = document.getElementById('items');
const footer = document.getElementById('footer');

const templateCard =document.getElementById('template-card').content;
const templateFooter = document.getElementById('template-footer').content;
const templateCarrito = document.getElementById('template-carrito').content;
const fragment = document.createDocumentFragment();

let carrito ={};

document.addEventListener('DOMContentLoaded', ()=>{
    fetchData();
    if (localStorage.getItem('carrito')){
        carrito= JSON.parse(localStorage.getItem('carrito'));
        pintarCarrito();
    }
});
//detecto que btn se presiona
cards.addEventListener('click', e =>{
    addCarrito(e);
});
items.addEventListener('click', e =>{
    btnAccion(e);
});

const fetchData = async ()=>{
    try {
        const res = await fetch('json/base.json');
        const data = await res.json(); 
        pintarCards(data);
    }catch (error){
        console.log(error);
    }
}
const pintarCards = data =>{
    //una vez que tengo la data la recorro
    data.forEach(producto =>{
        //modifico el template
        templateCard.querySelector('h5').textContent= producto.title;
        templateCard.querySelector('p').textContent=producto.precio;
        templateCard.querySelector('img').setAttribute("src", producto.img);
        //creo los Id de los btn
        templateCard.querySelector('.btn').dataset.id = producto.id;
        const clone= templateCard.cloneNode(true);
        fragment.appendChild(clone);
    });
    //una vez que tengo el framgent construido modifico el DOM
    cards.appendChild(fragment);
};
const addCarrito = e =>{    
    //si lo que hacemos click contiene la clase btn dando true o false
    if (e.target.classList.contains('btn')){
        //enviamos el elemento padre a setCarrito
        setCarrito(e.target.parentElement);
    }
    e.stopPropagation();
};

const setCarrito = objeto =>{
    const producto ={
        id: objeto.querySelector('.btn').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad:1
    };
    if (carrito.hasOwnProperty(producto.id)){
        console.log("ya adquirio este curso")
        producto.cantidad = carrito[producto.id].cantidad + 1;
    }
    carrito[producto.id] ={...producto};  
    pintarCarrito();      
};

const pintarCarrito =() =>{
    items.innerHTML="";
    Object.values(carrito).forEach(producto =>{
        templateCarrito.querySelector('th').textContent = producto.id;
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title;
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad;
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id;
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id;
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio;

        const clone=templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    });
    items.appendChild(fragment )
    pintarFooter();
    localStorage.setItem('carrito', JSON.stringify(carrito));
};

const pintarFooter =() =>{
    footer.innerHTML ="";
    //si está vacio el carrito muestra la leyenda de vacio
    if (Object.keys(carrito).length === 0){
        footer.innerHTML = `
        <th scope="row" colspan="5">Adquiera sus cursos Ya!</th>
        `
        return;
    }
    const nCantidad =Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad ,0 );
    const nPrecio =Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0 );
    templateFooter.querySelectorAll('td')[0].textContent=nCantidad;
    templateFooter.querySelector('span').textContent = nPrecio;
    
    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    footer.appendChild(fragment);

    const btnVaciar =document.getElementById('vaciar-carrito');
    btnVaciar.addEventListener('click', ()=>{
        carrito={};
        pintarCarrito();
    });
    const btnComprar = document.getElementById('comprar-carrito');
    // --------------------------------------------------------------------------------------------
    btnComprar.addEventListener('click', ()=>{
        console.log("hola")
        console.log(nPrecio)
        if (nPrecio > parseFloat(localStorage.getItem("Saldo"))){
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: "Saldo insuficiente para comprar",              
              }) 
        }else{ 
            Swal.fire({
                icon: 'success',
                title: 'Terminar la compra ',
                text: 'El valor de la compra sería de ' + nPrecio + " pesos y quedaría en su caja " + (parseFloat(localStorage.getItem("Saldo")) - nPrecio) + " pesos",                        
                showDenyButton: true,
                confirmButtonText: 'OK',
                denyButtonText: 'Salir',               
              }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.setItem("Saldo" , parseFloat(localStorage.getItem("Saldo")) - nPrecio);
                    carrito ={};
                    pintarCarrito();
                    location.reload();
                } else if (result.isDenied) {
                  Swal.fire('No se realizo la compra', '', 'info');
                }
              })    
        }        
    });
};
// capturamos los elementos que hay en la compra
const btnAccion = e =>{    
    if (e.target.classList.contains('btn-info')){        
        const producto = carrito[e.target.dataset.id];
        producto.cantidad++;
        carrito[e.target.dataset.id] ={...producto};
        pintarCarrito();
    }
    if (e.target.classList.contains('btn-danger')){    
        const producto = carrito[e.target.dataset.id];
        producto.cantidad--;
       if (producto.cantidad === 0){
           delete carrito[e.target.dataset.id];
       }
       pintarCarrito();
    }
    e.stopPropagation();
};