const valorInputBarra = document.getElementById("inputBuscar");

//Titulos
const tituloPestañaSup = document.getElementById("TituloPestaña").textContent = "Tickets";
const tituloBodySup = document.getElementById("TituloBody").textContent = "Tickets";

//Funciones
const stockGetAllData = "SP_TicketsVista"
let stockGetByID = "SP_ProductosTicketVista"

API = "http://localhost:3000/";



//Funcion para obtener los datos de la tabla
async function obtenerDatosTabla() {
  document.getElementById("tabla-Ventas").style.display = "none";
  document.getElementById("tabla-container").style.display = "";
  deshabilitarElementos();
  const res = await fetch(API + "vistaTablas/"+stockGetAllData);

  if (res.ok) {
    const resJson = await res.json();
    console.log(resJson);
    llenarTabla(resJson);
    valorInputBarra.value = "";
  } else {
    console.log("No se puedieron obtener");
    crearAlerta("danger","No se puedieron obtener los datos de la tabla");
  }
}

// Funcion para llenar la tabla con los datos obtenidos
function llenarTabla(data) {
  var source = document.getElementById("tabla-template").innerHTML;
  var template = Handlebars.compile(source);
  var html = template({ elementos: data });
  document.getElementById("tabla-container").innerHTML = html;
}

// Funcion para llenar la tabla ventas con los datos obtenidos
function llenarTablaVentas(data) {
  if(data.length == 0)
    {
      crearAlerta("warning","Es posible que la lista de productos no se muestre completa ya que uno o más productos fueron eliminados")
    }
  var source = document.getElementById("tablaVentas-template").innerHTML;
  var template = Handlebars.compile(source);
  var html = template({ elementos: data });
  document.getElementById("tabla-Ventas").innerHTML = html;
}

//Funcion para obtener datos por ID
async function obtenerDatosTablaPorId(IdElemento) {
  const ruta = `${API}vistaTablas/${stockGetByID}/${IdElemento}`;
  console.log(ruta);
  const res = await fetch(ruta);
  if (res.ok) {
    const resJson = await res.json();
    console.log(resJson);
    habilitarElementos();
    return resJson;
  } else {
    crearAlerta("danger","No se ha encontrado nada con ese ID");
    return 0;
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
    crearAlerta("danger","No se ha podido obtener las columnas");
  }
}


//Funcion para crear alertas
function crearAlerta(tipo,texto){
  const divAlerta = document.createElement("div");
  divAlerta.classList.add("alert","alert-dismissible","fade","show");
  divAlerta.classList.add("alert-"+tipo);
  divAlerta.setAttribute("role","alert");
  alertas.appendChild(divAlerta);
  
  divAlerta.textContent = texto;

  const botonCerrar = document.createElement("button");
  botonCerrar.type = "button";
  botonCerrar.classList.add("btn-close");
  botonCerrar.setAttribute("data-bs-dismiss","alert");
  botonCerrar.setAttribute("aria-label","Close");

  divAlerta.appendChild(botonCerrar);
  
  setTimeout(function() {
      divAlerta.remove();
  }, 4000);
}

async function seleccion()
{
    deshabilitarElementos();
    limpiarTabla();
    document.getElementById("tabla-container").style.display = "none";
    document.getElementById("tabla-Ventas").style.display = "";
    llenarTablaVentas(await obtenerDatosTablaPorId(valorInputBarra.value));
}

function limpiarTabla() {
  const tabla = document.getElementById("tabla");
  const filas = tabla.querySelectorAll("tr");
  filas.forEach(fila => {
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
function crearInput(nombre,valor) {
  const etiqueta = document.getElementById(nombre);
  const input = crearElementoHTML("input");
  input.classList.add("form-control");
  input.id = `in${nombre}`;
  console.log("El id es: "+ `in${nombre}`);
  input.value = valor;
  etiqueta.appendChild(input);
}

//Funcion para habilitar Elementos
function habilitarElementos() {
  let elementos = document.querySelectorAll('.extra');
  elementos.forEach(function(elemento) {
      elemento.style.display = '';
  })
}

//Funcion para deshabilitar Elementos
function deshabilitarElementos() {
  let elementos = document.querySelectorAll('.extra');
  elementos.forEach(function(elemento) {
      elemento.style.display = 'none';
  });
};



$("#inputBuscar").on("change keyup paste", function(){
  const input = document.getElementById("inputBuscar");
  if(input.style.display != 'none')
    {
      deshabilitarElementos();
    }
})


function botonesID(boton) {
    valorInputBarra.value = boton.id;
}

async function SacarPDF() {
  const res = await fetch(API + "reimprimirTicket/"+valorInputBarra.value);
  if (res.ok) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Reimpresion${valorInputBarra.value}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      obtenerDatosTabla();
  } else {
      console.log("Hubo un error al obtener el PDF");
      crearAlerta("danger","Hubo un error al obtener el PDF");
  }
};

async function botonesEmpleados(boton) {

  const Titulo = "Información Empleados"
  const nombreDelId = "Empleado"
  const etiquetaDelID = "Empleado"
  let IdElemento = 0;
  
  document.querySelector(".tituloModal").textContent = Titulo;
  const resJson = await obtenerColumnas("Perfil") 
  let variable = stockGetByID;
  stockGetByID = "SP_EmpleadosVistaPorID"
    const valores = await obtenerDatosTablaPorId(boton.id); 
    stockGetByID = variable;
    IdElemento = valores[0][`${nombreDelId}`];
    columnas = resJson.map(objeto => objeto.Columnas);
    columnas.forEach(elemento => {
      console.log(elemento);
      if(elemento == nombreDelId) {
        const etiquetaBase = document.getElementById(`${nombreDelId}`);
        etiquetaBase.textContent = `${etiquetaDelID}: ${IdElemento}`;
        etiquetaBase.classList.add("text-center");
      } else {
        const etiqueta = document.getElementById(elemento);
        const input = crearElementoHTML("input");
        input.classList.add("form-control");
        input.value = valores[0][`${elemento}`];
        input.setAttribute("Disabled","");
        etiqueta.appendChild(input);
      }
  });

  document.getElementById("okButton").textContent = "OK";
  document.getElementById("enviarForm").style.display = "none";
  document.getElementById("closeButton").style.display = "none";
  document.getElementById("okButton").onclick = () => {
    document.getElementById("closeButton").setAttribute.display = "";
    document.getElementById("enviarForm").style.display = "";
    document.getElementById("okButton").textContent = "Cancelar";
    document.getElementById("closeButton").style.display = "";
    document.getElementById("divModal").innerHTML = "";
  };

}