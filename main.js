
const listado = document.getElementById("listadoServicios");
const cantidadCarrito = document.getElementById("cantidadCarrito");


// Creacion de HTML con DOM trayendo desde .JSON con fetch
const pedirlistado = async () => {
    try {
        const response = await fetch("./productos.json");
        const servicios = await response.json();

        servicios.forEach(servicio => {
            const li = document.createElement("li");
            li.innerHTML = `
            <div>
            <img src= "${servicio.img}">
            <h3>${servicio.nombre}</h3>
            <h3>$${servicio.precio}</h3>
            </div>
            `;
            li.setAttribute("class", "card")
            listado.append(li);

            let comprar = document.createElement("button");
            comprar.innerText = "Comprar";
            li.append(comprar)

            comprar.addEventListener("click", () => {
                const repeat = carrito.some((repeatServicio) => repeatServicio.id === servicio.id);

                if (repeat) {
                    carrito.map((prod) => {
                        if (prod.id === servicio.id) {
                            prod.cantidad++;
                        }
                    })
                } else {
                    carrito.push({
                        id: servicio.id,
                        img: servicio.img,
                        nombre: servicio.nombre,
                        precio: servicio.precio,
                        cantidad: servicio.cantidad
                    });
                }
                carritoContador();
                guardarLocal();
            })

        });

    } catch (error) {
        const h1 = document.createElement("h1");
        h1.innerHTML = `Ups! Algo salió mal!`;
        h1.setAttribute("class", "ERROR")
        listado.append(h1);

        const titulo = document.getElementById("titulo");
        titulo.style.display = "none";
    }
}

pedirlistado();

//-------------- carrito---------------------------

let verCarrito = document.getElementById("verCarrito");
let modalContainer = document.getElementById("modalContainer");
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const pintarCarrito = () => {
    modalContainer.innerHTML = "";
    modalContainer.style.display = "flex";
    // header carrito--------------------------------------------------
    const modalHeader = document.createElement("div");
    modalHeader.className = "modalHeader";
    modalHeader.innerHTML = `
    <h4 class="tituloCarrito">Tu Carrito</h4>
    `;
    modalContainer.append(modalHeader);

    const modalButton = document.createElement("h2");
    modalButton.innerText = "X";
    modalButton.className = "modalBotonCierre";

    modalButton.addEventListener("click", () => {
        modalContainer.style.display = "none";
    });

    modalHeader.append(modalButton);

    // productos carrito---------------------------------------------
    carrito.forEach((producto) => {
        let carritoContenido = document.createElement("div");
        carritoContenido.className = "carritoContenido";
        carritoContenido.innerHTML = `
    <img src = "${producto.img}">
    <h3>${producto.nombre}</h3>
    <p>$${producto.precio * producto.cantidad}</p>
    <p>Cantidad: ${producto.cantidad}</p>
    `

        modalContainer.append(carritoContenido);

        let eliminar = document.createElement("span");
        eliminar.innerText = "❌";
        eliminar.className = "botonEliminar";

        carritoContenido.append(eliminar);

        eliminar.addEventListener("click", eliminarServicio)
    });

    //footer carrito--------------------------------------------------
    const total = carrito.reduce((acu, prod) => acu + prod.precio * prod.cantidad , 0);

    const totalPrecio = document.createElement("div");
    totalPrecio.className = "totalPrecio";
    totalPrecio.innerHTML = `Total a Pagar:  $${total}`;
    modalContainer.append(totalPrecio);
}


verCarrito.addEventListener("click", pintarCarrito);

// --- Eliminar productos carrito -----------------------------------
const eliminarServicio = () => {
    const encontrarId = carrito.find((element) => element.id);
    carrito = carrito.filter((carritoid) => {
        return carritoid !== encontrarId;
    });
    carritoContador();
    guardarLocal();
    pintarCarrito();
}

//----Contador carrito----------------------------------------------
const carritoContador = () => {
    cantidadCarrito.style.display = "block";

    const carritoLength = carrito.length;
    localStorage.setItem ("carritoLength", JSON.stringify(carritoLength));
    cantidadCarrito.innerText = JSON.parse(localStorage.getItem("carritoLength"));
};

//-------LocalStorage de Carrito--------------------------------
const guardarLocal = () => {
localStorage.setItem("carrito", JSON.stringify(carrito));
};

carritoContador();

Swal.fire('Bienvenid@a nuestro taller!\nAlgunos sectores de la página aún se encuentran en construcción.');

//-----