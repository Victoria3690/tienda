function mostrar(categoria) {
  const secciones = document.querySelectorAll('.productos');
  secciones.forEach(seccion => {
    seccion.style.display = 'none';
  });

  const activa = document.getElementById(categoria);
  if (activa) {
    activa.style.display = 'block';
  }
}
document.querySelectorAll('.producto img').forEach(img => {
  const original = img.src;
  const hover = img.getAttribute('data-hover');

  if (hover) {
    img.addEventListener('mouseenter', () => {
      img.src = hover;
    });

    img.addEventListener('mouseleave', () => {
      img.src = original;
    });
  }
});
function verProducto(imagen, titulo, descripcion, precio) {
  // ocultar todos los productos
  document.querySelectorAll('.productos').forEach(sec => {
    sec.style.display = 'none';
  });

  // mostrar detalle
  document.getElementById('detalle-producto').style.display = 'block';

  // cargar info
  document.getElementById('detalle-img').src = imagen;
  document.getElementById('detalle-titulo').innerText = titulo;
  document.getElementById('detalle-descripcion').innerText = descripcion;
  document.getElementById('detalle-precio').innerText = "$" + precio.toLocaleString();
}
function volver() {
  document.getElementById('detalle-producto').style.display = 'none';
  document.getElementById('maquillaje').style.display = 'block';
}
function buscarProducto(event) {
  const texto = document.getElementById("buscador").value.toLowerCase();
  const productos = document.querySelectorAll(".producto");
  const secciones = document.querySelectorAll(".productos");
  const contenedorResultados = document.getElementById("listaResultados");
  const seccionResultados = document.getElementById("resultadosBusqueda");

 
  // Si está vacío → volver a inicio
  if (texto === "") {
  // Ocultar todas las secciones excepto la de resultados de búsqueda
  secciones.forEach(sec => {
    if (sec.id !== "resultadosBusqueda") {
      sec.style.display = "none";
    }
  });
  // Mostrar la sección "maquillaje" cuando no hay texto
  document.getElementById("maquillaje").style.display = "block";
  // Limpiar resultados anteriores
  contenedorResultados.innerHTML = "";
  return;
}
let encontrados = 0;

// Limpiar resultados anteriores antes de mostrar nuevos
contenedorResultados.innerHTML = "";

productos.forEach(producto => {
  const nombre = producto.querySelector("h3").textContent.toLowerCase();

  if (nombre.includes(texto)) {
    // Clonar producto
    let clon = producto.cloneNode(true);

const img = clon.querySelector("img");
const hover = img.getAttribute("data-hover");

if (hover) {
  const original = img.src;

  img.onmouseenter = () => {
    img.src = hover;
  };

  img.onmouseleave = () => {
    img.src = original;
  };
}

    // 🔥 ACTIVAR BOTÓN DEL CARRITO EN EL CLON
    const boton = clon.querySelector(".btn-carrito");
    if (boton) {
      boton.addEventListener("click", () => {
        const nombre = clon.querySelector("h3").textContent;
        const precioTexto = clon.querySelector(".precio").textContent.replace(/\D/g, "");
        const precio = parseInt(precioTexto);

        agregaralcarrito(nombre, precio);
      });
    }

    // Agregar al contenedor
    contenedorResultados.appendChild(clon);
    encontrados++;
  }
});


// Ocultar todas las secciones excepto la de resultados de búsqueda
secciones.forEach(sec => {
  if (sec.id !== "resultadosBusqueda") {
    sec.style.display = "none";
  }
});

// Mostrar la sección de resultados
document.getElementById("resultadosBusqueda").style.display = "block";

  if (encontrados === 0) {
    contenedorResultados.innerHTML = "<p>No se encontraron productos 😢</p>";
  }
}

document.addEventListener('DOMContentLoaded', () => {
    // Escuchamos clics en todo el documento para la delegación de eventos
    document.body.addEventListener('click', function(event) {

        // --- MANEJO DEL CLIC EN EL CORAZÓN DE FAVORITO ---
        const corazon = event.target.closest('.corazon-favorito');
        if (corazon) {
            // Evitamos que el enlace (si es un tag <a>) recargue la página
            event.preventDefault();
            
            // Obtenemos el estado actual del atributo personalizado
            // Si es nulo o 'false', está en modo normal.
            const esFavorito = corazon.getAttribute('data-estado-favorito') === 'true';

            if (esFavorito) {
                // Ya era favorito, así que lo quitamos (lo volvemos normal)
                corazon.src = 'img/corazon-normal.png'; 
                corazon.setAttribute('data-estado-favorito', 'false');
                const producto = corazon.closest(".producto");

const nombre = producto.querySelector("h3").innerText;

favoritos = favoritos.filter(p => p.nombre !== nombre);

actualizarContadorFavoritos();

renderizarFavoritos();


            } else {
                // No era favorito, así que lo marcamos (ponemos el guiño)
                // !!! ASEGÚRATE DE QUE ESTA RUTA Y NOMBRE DE ARCHIVO SEAN CORRECTOS !!!
                corazon.src = 'img/corazon-guino.png'; 
                corazon.classList.add("animar-favorito");
corazon.classList.add("brillo-favorito");

setTimeout(()=>{

    corazon.classList.remove("animar-favorito");
    corazon.classList.remove("brillo-favorito");

},700);
                corazon.setAttribute('data-estado-favorito', 'true');
                const producto = corazon.closest(".producto");

const nombre = producto.querySelector("h3").innerText;

if (!favoritos.some(p => p.nombre === nombre)) {

   favoritos.push({
    nombre: producto.querySelector("h3").innerText,

    descripcion: producto.querySelector("p").innerText,

    precio: parseInt(
        producto.querySelector(".precio").innerText.replace(/\D/g,"")
    ),

    imagen: producto.querySelectorAll("img")[1].src
});
}
actualizarContadorFavoritos();

renderizarFavoritos();
mostrarMensajeFavorito();
            }
            // Importante: salimos de la función aquí para no ejecutar la lógica del carrito
            return; 
        }

        // --- MANEJO DEL CLIC EN EL BOTÓN DE AGREGAR AL CARRITO ---
        const botonCart = event.target.closest('.btn-carrito');
        if (botonCart) {
            const contenedor = botonCart.closest('.producto');
            // Verificamos que el contenedor exista para evitar errores
            if (!contenedor) return;

            const corazon = contenedor.querySelector('.corazon-favorito');

            if (corazon) {
                // 1. Iniciamos la animación: cambiamos a la imagen del carrito
                // !!! ASEGÚRATE DE QUE ESTA RUTA SEA CORRECTA !!!
                corazon.src = "img/carrito.png"; 
                // Añadimos la clase de CSS para que el corazón salte
                corazon.classList.add('animar-salto');

                // 2. Después de 2 segundos, volvemos a la imagen del corazón
                setTimeout(() => {
                    // !!! AQUÍ ESTÁ LA CLAVE DEL CAMBIO !!!
                    // En lugar de forzar 'corazon-normal.png', comprobamos su estado guardado
                    const esFavorito = corazon.getAttribute('data-estado-favorito') === 'true';

                    if (esFavorito) {
                        // Si ya era favorito, volvemos al guiño
                        corazon.src = "img/corazon-guino.png";
                    } else {
                        // Si no era favorito, volvemos al normal
                        corazon.src = "img/corazon-normal.png";
                    }

                    // Quitamos la clase para que pueda volver a saltar después
                    corazon.classList.remove('animar-salto');
                }, 2000);
            }
            // Importante: salimos de la función aquí
            return;
        }
    });
});
// 1. Variables globales
let carrito = [];
let total = 0;
let favoritos = [];

// 2. FUNCIÓN CORREGIDA: Agrega sin abrir menús ni alertas
function agregaralcarrito(nombre, precio) {
    // Agregamos al arreglo
    carrito.push({ nombre: nombre, precio: precio });

    // Actualizamos el número del icono del carrito (el circulito rosa)
    actualizarContador();

    // Actualizamos la lista interna del carrito (por si el usuario lo abre después)
    renderizarCarrito();
    
    // NOTA: He quitado la línea que abría el modal automáticamente.
    // Ahora el usuario debe hacer clic en el icono del carrito para verlo.
}

function actualizarContador() {
    const contador = document.getElementById("contador-carrito");
    if (contador) {
        contador.innerText = carrito.length;
    }
}

function renderizarCarrito() {
    const contenedorItems = document.getElementById("items-carrito");
    const contenedorTotal = document.getElementById("precio-total");
    
    if (!contenedorItems) return;

    contenedorItems.innerHTML = "";
    total = 0;

    carrito.forEach((producto) => {
        const div = document.createElement("div");
        div.className = "item-carrito";
        div.innerHTML = `
    <span>${producto.nombre}</span>
    
    <strong>$${producto.precio.toLocaleString()}</strong>

    <button class="btn-eliminar"
        onclick="eliminarDelCarrito(${carrito.indexOf(producto)})">
        🗑️
    </button>
`;
        contenedorItems.appendChild(div);
        total += producto.precio;
    });

    if (contenedorTotal) {
        contenedorTotal.innerText = total.toLocaleString();
    }
}
function eliminarDelCarrito(indice) {

    carrito.splice(indice, 1);

    actualizarContador();

    renderizarCarrito();
}
// Función para abrir/cerrar el carrito manualmente
function toggleCarrito() {
    const modal = document.getElementById("carrito-modal");
    modal.classList.toggle("activo");
}

function toggleFavoritos(){

document.querySelectorAll(".productos").forEach(sec=>{

sec.style.display="none";

});

document.getElementById("seccion-favoritos").style.display="block";

renderizarFavoritos();

}
function actualizarContadorFavoritos(){

document.getElementById("contador-favoritos").innerText=favoritos.length;

}

function renderizarFavoritos() {

    const contenedor = document.getElementById("lista-favoritos");

    contenedor.innerHTML = "";

    if (favoritos.length == 0) {

        contenedor.innerHTML = "<p>No tienes favoritos ❤️</p>";

        return;

    }

    favoritos.forEach(producto => {
const div = document.createElement("div");

div.className = "producto";

div.innerHTML = `
    <img
        src="img/corazon-guino.png"
        class="corazon-favorito"
        data-estado-favorito="true"
        onclick="quitarFavorito('${producto.nombre}')"
    >

    <img
        src="${producto.imagen}"
        alt="${producto.nombre}"
        onclick="verProducto(
            '${producto.imagen}',
            '${producto.nombre}',
            '${producto.descripcion}',
            ${producto.precio}
        )"
    >

    <h3 onclick="verProducto(
        '${producto.imagen}',
        '${producto.nombre}',
        '${producto.descripcion}',
        ${producto.precio}
    )">
        ${producto.nombre}
    </h3>

    <p>${producto.descripcion}</p>

    <p class="precio">
        $${producto.precio.toLocaleString()}
    </p>

    <button class="btn-carrito"
        onclick="agregaralcarrito('${producto.nombre}', ${producto.precio})">
        Agregar al carrito
    </button>
`;

        contenedor.appendChild(div);

    });

}
function quitarFavorito(nombre) {

    favoritos = favoritos.filter(producto => producto.nombre !== nombre);

    actualizarContadorFavoritos();

    renderizarFavoritos();
}
function mostrarMensajeFavorito(){

const mensaje=document.getElementById("mensaje-favorito");

mensaje.classList.add("mostrar");

setTimeout(()=>{

mensaje.classList.remove("mostrar");

},1200);

}

function volverInicio(){

document.getElementById("seccion-favoritos").style.display="none";

document.getElementById("maquillaje").style.display="block";

}

function mostrarCuenta() {

    document.querySelectorAll(".productos").forEach(sec => {
        sec.style.display = "none";
    });

    document.getElementById("seccion-cuenta").style.display = "block";

    const sesion = localStorage.getItem("sesionPIXYES");

    if (sesion === "true") {
        mostrarPerfil();
    }
}
function mostrarRegistro() {

    document.querySelectorAll(".productos").forEach(sec => {
        sec.style.display = "none";
    });

    document.getElementById("seccion-registro").style.display = "block";
}
function registrarUsuario() {

    const nombre = document.getElementById("registro-nombre").value;
    const correo = document.getElementById("registro-correo").value;
    const password = document.getElementById("registro-password").value;

    if (nombre === "" || correo === "" || password === "") {

        alert("Por favor completa todos los campos.");

        return;
    }

    const usuario = {
        nombre: nombre,
        correo: correo,
        password: password
    };

    localStorage.setItem("usuarioPIXYES", JSON.stringify(usuario));

    alert("¡Cuenta creada correctamente! 💗");

    mostrarCuenta();
}
function iniciarSesion() {

    const correo = document.getElementById("login-correo").value;
    const password = document.getElementById("login-password").value;

    const usuarioGuardado = localStorage.getItem("usuarioPIXYES");

    if (!usuarioGuardado) {

        alert("No existe una cuenta. Primero debes registrarte.");

        return;
    }

    const usuario = JSON.parse(usuarioGuardado);

    if (
        correo === usuario.correo &&
        password === usuario.password
    ) {

        localStorage.setItem("sesionPIXYES", "true");

        alert("¡Bienvenida a PIXYES, " + usuario.nombre + "! 💗");

        volverInicio();

    } else {

        alert("Correo o contraseña incorrectos.");

    }
}
function mostrarPerfil() {

    const usuarioGuardado = localStorage.getItem("usuarioPIXYES");

    if (!usuarioGuardado) {
        return;
    }

    const usuario = JSON.parse(usuarioGuardado);

    document.getElementById("nombre-usuario").innerText =
        "👤 Nombre: " + usuario.nombre;

    document.getElementById("correo-usuario").innerText =
        "📧 Correo: " + usuario.correo;

    document.getElementById("perfil-usuario").style.display = "block";
}
function cerrarSesion() {

    localStorage.removeItem("sesionPIXYES");

    document.getElementById("perfil-usuario").style.display = "none";

    alert("Has cerrado sesión. ¡Esperamos verte pronto en PIXYES! 💗");

    volverInicio();
}