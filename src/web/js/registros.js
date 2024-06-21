
//Titulos
const tituloPestañaSup = document.getElementById("TituloPestaña").textContent = "Registros";
const tituloBodySup = document.getElementById("TituloBody").textContent = "Registros";
//Select 
const selectBarra = document.getElementById("selectBuscar");
const selectFiltro = document.getElementById("selectFiltro");
//Funciones
let stockGetAllData = "SP_RegistroProductosVista"
let stockGetByID = "SP_RegistroProductosVistaFiltro"
let stockGetByFilter = "SP_RegistroProductosVistaFiltro"
const stockDeleteElement = "SP_DeletePersona"
const tablaColumnasEditar = "PersonasVista";
const rutaEditar = "editarPersonas"
const tablaColumnasCrear = "PersonasVista";
const rutaCrear = "agregarPersona";
let IdActual = "IdProducto"

API = "/";


//Funcion para obtener los datos de la tabla
async function obtenerDatosTabla() {
  selectFiltro.value = "Seleccione"

  const res = await fetch(API + "vistaTablas/"+stockGetAllData);

  if (res.ok) {
    const resJson = await res.json();
    llenarTabla(resJson);
    document.getElementById("IDTabla").textContent = IdActual;
  } else {
    crearAlerta("danger","No se puedieron obtener los datos de la tabla");
  }
}

// Funcion para llenar la tabla con los datos obtenidos
function llenarTabla(data) {
  var source = document.getElementById("tabla-template").innerHTML;
  var template = Handlebars.compile(source);
  var html = template({ elementos: data });
  document.getElementById("tabla-container").innerHTML = html;
  document.getElementById("IDTabla").textContent = IdActual;
}

//Funcion para obtener datos por ID
async function obtenerDatosTablaPorId(IdElemento) {
  const ruta = `${API}vistaTablas/${stockGetByID}/${IdElemento}`;
  const res = await fetch(ruta);
  if (res.ok) {
    const resJson = await res.json();
    return resJson;
  } else {
    crearAlerta("danger","No se ha encontrado nada con ese ID");
    return 0;
  }
}

//Funcion para filtrar
async function Filtrardatos(accion) {
  const res = await fetch(`${API}getByAccion/${stockGetByFilter}/${accion}`);
  if (res.ok) {
    const resJson = await res.json();
    llenarTabla(resJson);
  } else {
    crearAlerta("danger","No se ha encontrado nada con esa acción");
  }
}

//Funcion para obtener datos por Nombre
async function obtenerColumnas(tabla) {
  const ruta = `${API}vistaTablas/SP_Columnas/${tabla}`;
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

$("#selectFiltro").on("change keyup paste", function(){
  if(selectFiltro.value == "Seleccione") {
    obtenerDatosTabla();
  }else {
    Filtrardatos(selectFiltro.value);
  }
})

$("#selectBuscar").on("change keyup paste", function(){
  if(selectBarra.value == "Productos"){
    stockGetAllData = "SP_RegistroProductosVista";
    stockGetByFilter = "SP_RegistroProductosVistaFiltro"
    IdActual = "IdProduto"
  }
  if(selectBarra.value == "Categorias") {
    stockGetAllData = "SP_RegistroCategoriasVista";
    stockGetByFilter = "SP_RegistroCategoriasVistaFiltro"
    IdActual = "IdCategorria"
  }
  if(selectBarra.value == "Proveedores") {
    stockGetAllData = "SP_RegistroProveedoresVista";
    stockGetByFilter = "SP_RegistroProveedoresVistaFiltro"
    IdActual = "IdProveedor"
  }
  if(selectBarra.value == "Sucursales") {
    stockGetAllData = "SP_RegistroSucursalesVista";
    stockGetByFilter = "SP_RegistroSucursalesVistaFiltro"
    IdActual = "IdSucursal"
  }
  if(selectBarra.value == "Clientes") {
    stockGetAllData = "SP_RegistroClientesVista";
    stockGetByFilter = "SP_RegistroClientesVistaFiltro"
    IdActual = "IdCliente"
  }
  if(selectBarra.value == "Empleados") {
    stockGetAllData = "SP_RegistroEmpleadosVista";
    stockGetByFilter = "SP_RegistroEmpleadosVistaFiltro"
    IdActual = "IdEmpleado"
  }
  if(selectBarra.value == "Personas") {
    stockGetAllData = "SP_RegistroPersonasVista";
    stockGetByFilter = "SP_RegistroPersonasVistaFiltro"
    IdActual = "IdPersonas"
  }
  selectFiltro.value = "Seleccione"
  obtenerDatosTabla();
})

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