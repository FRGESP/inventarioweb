let Idclientevar;
//Titulos
const tituloPestañaSup = document.getElementById("TituloPestaña").textContent ="Ventas";
const tituloBodySup = document.getElementById("TituloBody").textContent ="Ventas";

//Funciones
const stockGetAllData = "SP_TicketActualVista";
const stockDeleteElement = "SP_DeleteVenta";

API = "http://localhost:3000/";

async function buscarCliente() {
  const IdCliente = document.getElementById("inputCliente");
  const botonBuscar = document.getElementById("botonCliente");
  console.log(IdCliente.value);

  const res = await fetch(`${API}obtenerCliente/${IdCliente.value}`);
  if (res.ok) {
    const resJson = await res.json();
    habilitarElementos();
    Idclientevar = IdCliente.value;
    IdCliente.value = resJson.Nombre;
    IdCliente.setAttribute("disabled", "");
    botonBuscar.style.display = "none";
    console.log(resJson.Nombre);
  } else {
    crearAlerta("danger", "Cliente no encontrado");
  }
}

//Funcion para subir producto al ticket
async function subirProducto() {
  const IdProducto = document.getElementById("inputID");
  const cantidad = document.getElementById("inputCantidad");

  const res = await fetch(API + "subirProductoVenta", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Producto: IdProducto.value,
      Cantidad: cantidad.value,
      Cliente: Idclientevar
    }),
  });

  if(res.ok) {
    obtenerDatosTabla();
    IdProducto.value = "";
    cantidad.value = 1;
  } else {
    crearAlerta("danger","Hubo un error al subir el producto. No hay suficiente stock");
  }
}

//Funcion para subir ticket al sistema
async function subirTicket() {
  const IdCliente = document.getElementById("inputCliente");
  const IdProducto = document.getElementById("inputID");
  const botonBuscar = document.getElementById("botonCliente");
  const cantidad = document.getElementById("inputCantidad");

  const res = await fetch(API + "subirVenta");
  if(res.ok) {
    IdProducto.value = "";
    cantidad.value = 1;
    IdCliente.value = "";
    IdCliente.removeAttribute("disabled");
    botonBuscar.style.display = "";
    deshabilitarElementos();
    SacarPDF()
    crearAlerta("success","Venta realizada")
    obtenerDatosTabla();
  } else {
    crearAlerta("danger","No se pudo realizar la venta. Verifique los datos");
  }
}

// Funcion para imprimir Ticket

async function SacarPDF() {
  const res = await fetch(API + "imprimirTicket");
  if (res.ok) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Ticket.pdf';
      document.body.appendChild(a);
      a.click();

      // window.open(url, '_blank');

      window.URL.revokeObjectURL(url);
      obtenerDatosTabla();
  } else {
      console.log("Hubo un error al obtener el PDF");
  }
};
//Fucion para obtener total de la venta

async function obtenerTotal() {
  const res = await fetch(API + "obtenerTotal");

  if (res.ok) {
    const etiquetaTotal = document.getElementById("Total");
    const resJson = await res.json();

    if (resJson.Total == null) {
      etiquetaTotal.textContent = 0;
    } else {
      etiquetaTotal.textContent = resJson.Total;
    }
  } else {
    crearAlerta("danger", "No se pudo obtener el total");
  }
}

async function obtenerClienteAct() {
  const res = await fetch(API + "obtenerClienteActual");

  if (res.ok) {
    const resJson = await res.json();
    return resJson.Cliente
  } else {
    crearAlerta("danger", "No se pudo obtener el cliente");
  }
}

//Funcion para obtener los datos de la tabla
async function obtenerDatosTabla() {
  const botonBuscar = document.getElementById("botonCliente");
  const res = await fetch(API + "obtenerTicketVista/");
  const botonCheck = document.getElementById("checkTicket");
  
  if (res.ok) {
    const resJson = await res.json();
    console.log(resJson);
    if(resJson.length == 0)
    {
        botonCheck.setAttribute("disabled","");
    } else {
      botonCheck.removeAttribute("disabled");
    }
    llenarTabla(resJson);
    const cliente =  await obtenerClienteAct();
    console.log(cliente)
    if(cliente != 0 && botonBuscar.style.display != 'none') {
      document.getElementById("inputCliente").value = cliente;
      document.getElementById("botonCliente").click();
    }
    obtenerTotal();
  } else {
    console.log("No se puedieron obtener");
    crearAlerta("danger", "No se puedieron obtener los datos de la tabla");
  }
}

//Funcion para borrar los elementos de la tabla
async function eliminarElementos(producto) {
  const res = await fetch(
    `${API}deleteTablas/${stockDeleteElement}/${producto.id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (res.ok) {
    crearAlerta("success", "Elemento Eliminado");
    obtenerDatosTabla();
  } else {
    crearAlerta("danger", "No se ha podido eliminar el elemento");
  }
}

// Funcion para llenar la tabla con los datos obtenidos
function llenarTabla(data) {
  var source = document.getElementById("tabla-template").innerHTML;
  var template = Handlebars.compile(source);
  var html = template({ elementos: data });
  document.getElementById("tabla-container").innerHTML = html;
}

//Funcion para obtener datos por ID
async function obtenerDatosTablaPorId(IdElemento) {
  const ruta = `${API}vistaTablas/${stockGetByID}/${IdElemento}`;
  console.log(ruta);
  const res = await fetch(ruta);
  if (res.ok) {
    console.log("SIUUU");
    const resJson = await res.json();
    console.log(resJson);
    habilitarElementos();
    return resJson;
  } else {
    crearAlerta("danger", "No se ha encontrado nada con ese ID");
    return 0;
  }
}


//Funcion para crear alertas
function crearAlerta(tipo, texto) {
  const divAlerta = document.createElement("div");
  divAlerta.classList.add("alert", "alert-dismissible", "fade", "show");
  divAlerta.classList.add("alert-" + tipo);
  divAlerta.setAttribute("role", "alert");
  alertas.appendChild(divAlerta);

  divAlerta.textContent = texto;

  const botonCerrar = document.createElement("button");
  botonCerrar.type = "button";
  botonCerrar.classList.add("btn-close");
  botonCerrar.setAttribute("data-bs-dismiss", "alert");
  botonCerrar.setAttribute("aria-label", "Close");

  divAlerta.appendChild(botonCerrar);

  setTimeout(function () {
    divAlerta.remove();
  }, 4000);
}


//Funcion para crear elementos
function crearElementoHTML(elemento) {
  const nuevoElemento = document.createElement(elemento);
  return nuevoElemento;
}


//Funcion para habilitar Elementos
function habilitarElementos() {
  let elementos = document.querySelectorAll(".extra");
  elementos.forEach(function (elemento) {
    elemento.style.display = "";
  });
}

//Funcion para deshabilitar Elementos
function deshabilitarElementos() {
  let elementos = document.querySelectorAll(".extra");
  elementos.forEach(function (elemento) {
    elemento.style.display = "none";
  });
}
