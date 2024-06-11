const valorInputBarra = document.getElementById("inputBuscar");

//Titulos
const tituloPestañaSup = document.getElementById("TituloPestaña").textContent = "Productos";
const tituloBodySup = document.getElementById("TituloBody").textContent = "Productos";

//Funciones
const stockGetAllData = "SP_ProductosVista"
let stockGetByID = "SP_ProductosVistaPorID"
const stockGetByName = "SP_ProductosVistaPorNombre"
const stockDeleteElement = "SP_DeleteProducto"
const tablaColumnasEditar = "Productos";
const rutaEditar = "editarProductos"
const tablaColumnasCrear = "Productos";
const rutaCrear = "agregarProducto";

API = "http://localhost:3000/";

//Funcion para crear el formulario para editar
async function crearFormularioEditar() {
  const Titulo = "Editar Producto"
  const nombreDelId = "IdProducto"
  const etiquetaDelID = "Producto"
  let IdElemento = 0;

  document.querySelector(".tituloModal").textContent = Titulo;
  const resJson = await obtenerColumnas(tablaColumnasEditar) 
    const valores = await obtenerDatosTablaPorId(valorInputBarra.value); 
    IdElemento = valores[0][`${nombreDelId}`];
    columnas = resJson.map(objeto => objeto.Columnas);
    console.log(columnas);
    columnas.forEach(elemento => {
      console.log(elemento);
      if(elemento == nombreDelId) {
        const etiquetaBase = document.getElementById(`${nombreDelId}`);
        etiquetaBase.textContent = `${etiquetaDelID}: ${IdElemento}`;
        etiquetaBase.classList.add("text-center");
      } else if(elemento == "IdCategoria")
        {
          const selectCategoria = crearElementoHTML("select");
          selectCategoria.classList.add("form-select","form-control-sm");
          selectCategoria.setAttribute("aria-label","Default select example");
          selectCategoria.id = `in${elemento}`;
          console.log("El id es: "+ `in${elemento}`);
          document.getElementById(elemento).textContent = "Categoría:"
          document.getElementById(elemento).appendChild(selectCategoria);
          obtenerOpciones("SP_ObtenerCategorias",selectCategoria,valores[0].Categoria);
        } else if(elemento == "IdProveedor") {
            const selectProveedor = crearElementoHTML("select");
            selectProveedor.classList.add("form-select","form-control-sm");
            selectProveedor.setAttribute("aria-label","Default select example");
            selectProveedor.id = `in${elemento}`;
            console.log("El id es: "+ `in${elemento}`);
            document.getElementById(elemento).textContent = "Proveedor:"
            document.getElementById(elemento).appendChild(selectProveedor);
            obtenerOpciones("SP_ObtenerProveedores",selectProveedor,valores[0].Proveedor);
            $(`#inIdProveedor, #inIdCategoria`).select2({
              dropdownParent: $("#modalCrearProducto")
            });
        } else {
          crearInput(elemento,valores[0][`${elemento}`]);
        }
  });
  document.getElementById("enviarForm").onclick = () => enviarFormulario(IdElemento,"Editar",nombreDelId,`${rutaEditar}/`,columnas);

}

//Funcion para crear el formulario para crear
async function crearFormularioCrear() {
 const Titulo = "Agregar Producto"
  const nombreDelId = "IdProducto"

  document.querySelector(".tituloModal").textContent = Titulo;
  const resJson = await obtenerColumnas(tablaColumnasCrear) 
    columnas = resJson.map(objeto => objeto.Columnas);
    console.log(columnas);
    columnas.forEach(elemento => {
      console.log(elemento);
      if(elemento == nombreDelId) {
        const etiquetaBase = document.getElementById(`${nombreDelId}`);
        etiquetaBase.remove();
      } else if(elemento == "IdCategoria")
        {
          const selectCategoria = crearElementoHTML("select");
          selectCategoria.classList.add("form-select","form-control-sm");
          selectCategoria.setAttribute("aria-label","Default select example");
          selectCategoria.id = `in${elemento}`;
          console.log("El id es: "+ `in${elemento}`);
          document.getElementById(elemento).textContent = "Categoría:"
          document.getElementById(elemento).appendChild(selectCategoria);
          obtenerOpciones("SP_ObtenerCategorias",selectCategoria,"");
        } else if(elemento == "IdProveedor") {
            const selectProveedor = crearElementoHTML("select");
            selectProveedor.classList.add("form-select","form-control-sm");
            selectProveedor.setAttribute("aria-label","Default select example");
            selectProveedor.id = `in${elemento}`;
            console.log("El id es: "+ `in${elemento}`);
            document.getElementById(elemento).textContent = "Proveedor:"
            document.getElementById(elemento).appendChild(selectProveedor);
            obtenerOpciones("SP_ObtenerProveedores",selectProveedor,"");
            $(`#inIdProveedor, #inIdCategoria`).select2({
              dropdownParent: $("#modalCrearProducto")
            });
        } else {
          crearInput(elemento,"");
        }
  });
  document.getElementById("enviarForm").onclick = () => enviarFormulario("","Crear",nombreDelId,`${rutaCrear}/`,columnas);
}

//Funcion para obtener los datos de la tabla
async function obtenerDatosTabla() {
  deshabilitarElementos();

  document.getElementById("selectFiltro").style.display = "none";
  document.getElementById("inputBuscar").style.display = "";
  const res = await fetch(API + "vistaTablas/"+stockGetAllData);

  if (res.ok) {
    const resJson = await res.json();
    console.log(resJson);
    llenarTabla(resJson);
    valorInputBarra.value = "";
    document.getElementById("selectBuscar").value = "seleccion";
  } else {
    console.log("No se puedieron obtener");
    crearAlerta("danger","No se puedieron obtener los datos de la tabla");
  }
}

//Funcion para borrar los elementos de la tabla
async function eliminarElementos() {
  const setID = await setEmpleadoID()
  const res = await fetch(`${API}deleteTablas/${stockDeleteElement}/${valorInputBarra.value}`, {
    method : "DELETE",
    headers: {
      "Content-Type": "application/json"
  }
  });

  if(res.ok) {
    crearAlerta("success","Elemento Eliminado");
    obtenerDatosTabla();
    valorInputBarra.value = "";
  } else {
    crearAlerta("danger","No se ha podido eliminar el elemento");
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
    crearAlerta("danger","No se ha encontrado nada con ese ID");
    return 0;
  }
}

//Funcion para obtener datos por Nombre
async function obtenerDatosTablaPorNombre() {
  const res = await fetch(`${API}vistaTablas/${stockGetByName}/${valorInputBarra.value}`);
  if (res.ok) {
    console.log("SIUUU");
    const resJson = await res.json();
    console.log(resJson);
    llenarTabla(resJson);
  } else {
    crearAlerta("danger","No se ha encontrado nada con ese nombre");
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


async function enviarFormulario(id,accion,nombreId,ruta,columnas) {
  const setID = await setEmpleadoID()
  let bodyData = {};
  columnas.forEach(columna => {
    if(columna != nombreId) {
      console.log(`in${columna}`);
      let columnaActual = document.getElementById(`in${columna}`)
      bodyData[columna] =  columnaActual.value;
      columnaActual.remove();
    }
  });
  console.log(bodyData);
  let res;
  if(accion == "Editar") {
     res = await fetch(API+ruta+id, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(bodyData)
  });
  } else if(accion == "Crear") {
    res = await fetch(API + ruta, {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(bodyData)
  });
  }

  if (res.ok) {
      const resJson = await res.json();
      if(accion == "Editar") {
        llenarTabla(await obtenerDatosTablaPorId(id));
      } else {
        llenarTabla(await obtenerDatosTablaPorId(resJson.Id));
      }
      console.log(resJson);
      crearAlerta("success", "Operacion Completada");
      deshabilitarElementos();
  } else {
      crearAlerta("danger", "No se pudo hacer la operacion");
  }
  deshabilitarElementos();
  console.log(bodyData);
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
    const eleccion = document.getElementById("selectBuscar");
    const filtro = document.getElementById("selectFiltro");
    limpiarTabla();
    if(eleccion.value == "Nombre") {
      obtenerDatosTablaPorNombre();
    } else if(eleccion.value == "ID") {
      llenarTabla(await obtenerDatosTablaPorId(valorInputBarra.value));
      } else if(eleccion.value == "Categoria") {

        let aux = stockGetByID;
        stockGetByID = "SP_ProductosVistaPorCategoria"
        llenarTabla(await obtenerDatosTablaPorId(filtro.value));
        stockGetByID = aux;
        deshabilitarElementos();

      } else if (eleccion.value == "Proveedor") {

        let aux = stockGetByID;
        stockGetByID = "SP_ProductosVistaPorProveedor"
        llenarTabla(await obtenerDatosTablaPorId(filtro.value));
        stockGetByID = aux;
        deshabilitarElementos();

      }
      else {
        crearAlerta("danger","Seleccione una opción");
      }
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

async function obtenerOpciones(stock,select,actual) {
  const res = await fetch(API+"vistaTablas/"+stock);
  if(res.ok)
  {
      const resJson = await res.json();
      resJson.forEach(valor => {
          const opcion = document.createElement("option");
          if(valor.Elemento == actual) {
              opcion.setAttribute("selected","");
          }
          opcion.value = valor.Id;
          opcion.textContent = valor.Elemento;
          select.appendChild(opcion);
      });
      console.log(resJson);
  }
  else{
      console.log("No hay productos");
  }
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

$("#selectBuscar").on("change keyup paste", function(){
  const input = document.getElementById("inputBuscar");
  const eleccion = document.getElementById("selectBuscar");
  const filtro = document.getElementById("selectFiltro");
  filtro.innerHTML = "";
  if(input.style.display != 'none')
    {
      deshabilitarElementos();
    }
    if(eleccion.value == "Categoria") {
        input.style.display = "none";
        filtro.style.display = "";
        obtenerOpciones("SP_ObtenerCategorias",filtro,"");
      } else if (eleccion.value == "Proveedor") {
        input.style.display = "none";
        filtro.style.display = "";
        obtenerOpciones("SP_ObtenerProveedores",filtro,"");
      } else {
        filtro.style.display = "none";
        input.style.display = "";
      }
})

function botonesID(boton) {
    valorInputBarra.value = boton.id;
    document.getElementById("selectBuscar").value = "ID";
}

async function setEmpleadoID() {
  const res = await fetch(API+"setEmpleadoID/"+"Productos");

  if(res.ok) {
      const resJSON = await res.json();
      console.log("El empleado con el ID: "+ resJSON.Empleado)
  } else {
      alert("No se ha podido establecer conexion");
  }
  return "ok"
}