let Idclientevar;
//Titulos
const tituloPestañaSup = (document.getElementById("TituloPestaña").textContent =
  "Personas");
const tituloBodySup = (document.getElementById("TituloBody").textContent =
  "Personas");

//Funciones
const stockGetAllData = "SP_TicketActualVista";
const stockGetByID = "SP_PersonasVistaPorID";
const stockGetByName = "SP_PersonasVistaPorNombre";
const stockDeleteElement = "SP_DeleteVenta";
const tablaColumnasEditar = "PersonasVista";
const rutaEditar = "editarPersonas";
const tablaColumnasCrear = "PersonasVista";
const rutaCrear = "agregarPersona";

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
    }),
  });

  if(res.ok) {
    obtenerDatosTabla();
    IdProducto.value = "";
    cantidad.value = 1;
  } else {
    crearAlerta("danger","Hubo un error al subir el producto");
  }
}

//Funcion para subir ticket al sistema
async function subirTicket() {
  const IdCliente = document.getElementById("inputCliente");
  const IdProducto = document.getElementById("inputID");
  const botonBuscar = document.getElementById("botonCliente");
  const cantidad = document.getElementById("inputCantidad");

  const res = await fetch(API + "subirVenta", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Cliente: Idclientevar
    }),
  });

  if(res.ok) {
    obtenerDatosTabla();
    IdProducto.value = "";
    cantidad.value = 1;
    IdCliente.value = "";
    IdCliente.removeAttribute("disabled");
    botonBuscar.style.display = "";
    deshabilitarElementos();
    crearAlerta("success","Venta realizada")
  } else {
    crearAlerta("danger","No se pudo realizar la venta. verifique los datos");
  }
}

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

//Funcion para obtener los datos de la tabla
async function obtenerDatosTabla() {
  const res = await fetch(API + "vistaTablas/" + stockGetAllData);

  if (res.ok) {
    const resJson = await res.json();
    console.log(resJson);
    llenarTabla(resJson);
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

//Funcion para obtener datos por Nombre
async function obtenerDatosTablaPorNombre() {
  const res = await fetch(
    `${API}vistaTablas/${stockGetByName}/${valorInputBarra.value}`
  );
  if (res.ok) {
    console.log("SIUUU");
    const resJson = await res.json();
    console.log(resJson);
    llenarTabla(resJson);
  } else {
    crearAlerta("danger", "No se ha encontrado nada con ese nombre");
  }
}

//Funcion para obtener datos por Nombre
async function obtenerColumnas(tabla) {
  const ruta = `${API}vistaTablas/SP_Columnas/${tabla}`;
  console.log(ruta);
  const res = await fetch(ruta);
  if (res.ok) {
    const resJson = await res.json();
    llenarFormulario(resJson);
    return resJson;
  } else {
    crearAlerta("danger", "No se ha podido obtener las columnas");
  }
}

async function enviarFormulario(id, accion, nombreId, ruta, columnas) {
  let bodyData = {};
  columnas.forEach((columna) => {
    if (columna != nombreId) {
      console.log(`in${columna}`);
      let columnaActual = document.getElementById(`in${columna}`);
      bodyData[columna] = columnaActual.value;
      columnaActual.remove();
    }
  });
  console.log(bodyData);
  let res;
  if (accion == "Editar") {
    res = await fetch(API + ruta + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });
  } else if (accion == "Crear") {
    res = await fetch(API + ruta, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });
  }

  if (res.ok) {
    const resJson = await res.json();
    if (accion == "Editar") {
      llenarTabla(await obtenerDatosTablaPorId(id));
    } else {
      llenarTabla(await obtenerDatosTablaPorId(resJson.Id));
    }
    console.log(resJson);
    crearAlerta("success", "Operacion Completada");
  } else {
    crearAlerta("danger", "No se pudo hacer la operacion");
  }
  console.log(bodyData);
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

async function seleccion() {
  deshabilitarElementos();
  const eleccion = document.getElementById("selectBuscar").value;
  limpiarTabla();
  if (eleccion == "Nombre") {
    obtenerDatosTablaPorNombre();
  } else if (eleccion == "ID") {
    llenarTabla(await obtenerDatosTablaPorId(valorInputBarra.value));
  } else {
    crearAlerta("danger", "Seleccione una opción");
  }
}

function limpiarTabla() {
  const tabla = document.getElementById("tabla");
  const filas = tabla.querySelectorAll("tr");
  filas.forEach((fila) => {
    fila.remove();
  });
}

// Funcion para llenar la tabla con los datos obtenidos
function llenarFormulario(data) {
  var source = document.getElementById("form-template").innerHTML;
  var template = Handlebars.compile(source);
  var html = template({ elementos: data });
  document.getElementById("divModal").innerHTML = html;
}

//Funcion para crear elementos
function crearElementoHTML(elemento) {
  const nuevoElemento = document.createElement(elemento);
  return nuevoElemento;
}

//Funcion para crear input
function crearInput(nombre, valor) {
  const etiqueta = document.getElementById(nombre);
  const input = crearElementoHTML("input");
  input.classList.add("form-control");
  input.id = `in${nombre}`;
  console.log("El id es: " + `in${nombre}`);
  input.value = valor;
  etiqueta.appendChild(input);
}

async function obtenerOpciones(stock, select, actual) {
  const res = await fetch(API + "vistaTablas/" + stock);
  if (res.ok) {
    const resJson = await res.json();
    resJson.forEach((valor) => {
      const opcion = document.createElement("option");
      if (valor.Elemento == actual) {
        opcion.setAttribute("selected", "");
      }
      opcion.value = valor.Id;
      opcion.textContent = valor.Elemento;
      select.appendChild(opcion);
    });
    console.log(resJson);
  } else {
    console.log("No hay productos");
  }
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

$("#inputBuscar").on("change keyup paste", function () {
  const input = document.getElementById("inputBuscar");
  if (input.style.display != "none") {
    deshabilitarElementos();
  }
});

$("#selectBuscar").on("change keyup paste", function () {
  const input = document.getElementById("inputBuscar");
  if (input.style.display != "none") {
    deshabilitarElementos();
  }
});

function botonesID(boton) {
  valorInputBarra.value = boton.id;
  document.getElementById("selectBuscar").value = "ID";
}
