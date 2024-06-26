const valorInputBarra = document.getElementById("inputBuscar");

//Titulos
const tituloPestañaSup = document.getElementById("TituloPestaña").textContent = "Empleados";
const tituloBodySup = document.getElementById("TituloBody").textContent = "Empleados";

//Funciones
const stockGetAllData = "SP_EmpleadosVista"
const stockGetByID = "SP_EmpleadosVistaPorID"
const stockGetByName = "SP_EmpleadosVistaPorNombre"
const tablaColumnasEditar = "Perfil";
const rutaEditar = "editarEmpleados"
const tablaColumnasCrear = "EmpleadoCrear";
const rutaCrear = "agregarEmplado";

API = "http://localhost:3000/";

//Funcion para crear el formulario para editar
async function crearFormularioEditar() {
  const Titulo = "Editar Empleado"
  const opcionesSelect2 = ["Activo","Despedido","Ausente"];
  let IdElemento = 0;

  document.querySelector(".tituloModal").textContent = Titulo;
  const resJson = await obtenerColumnas(tablaColumnasEditar) 
    const valores = await obtenerDatosTablaPorId(valorInputBarra.value); 
    IdElemento = valores[0].Empleado;
    columnas = resJson.map(objeto => objeto.Columnas);
    console.log(columnas);
    columnas.forEach(elemento => {
      console.log(elemento);
      if(elemento == "Empleado") {
        const etiquetaBase = document.getElementById("EmpleadoLabel");
        etiquetaBase.textContent = `Empleado: ${IdElemento}`;
        etiquetaBase.classList.add("text-center");
      } else if(elemento == "Rol")
        {
          const selectRol = crearElementoHTML("select");
          selectRol.classList.add("form-select","form-control-sm");
          selectRol.setAttribute("aria-label","Default select example");
          selectRol.id = `in${elemento}`;
          console.log("El id es: "+ `in${elemento}`);
          document.getElementById(elemento).appendChild(selectRol);
          obtenerOpciones("SP_ObtenerRoles",selectRol,valores[0].Rol);
        } else if(elemento == "Estatus") {
          const selectEstatus = crearElementoHTML("select");
          selectEstatus.classList.add("form-select","form-control-sm");
          selectEstatus.setAttribute("aria-label","Default select example");
          selectEstatus.id = `in${elemento}`;
          console.log("El id es: "+ `in${elemento}`);
          document.getElementById(elemento).appendChild(selectEstatus);
          opcionesSelect2.forEach(valor => {
            const opcion = document.createElement("option");
            if(valor == valores[0].Estatus) {
                opcion.setAttribute("selected","");
            }
            opcion.value = valor;
            opcion.textContent = valor;
            selectEstatus.appendChild(opcion);
          });
        } else if (elemento == "Sucursal") {
          const selectSucursal = crearElementoHTML("select");
          selectSucursal.classList.add("form-select","form-control-sm");
          selectSucursal.setAttribute("aria-label","Default select example");
          selectSucursal.id = `in${elemento}`;
          console.log("El id es: "+ `in${elemento}`);
          document.getElementById(elemento).appendChild(selectSucursal);
          obtenerOpciones("SP_ObtenerSucursales",selectSucursal,valores[0].Sucursal);
          $(`#inSucursal`).select2({
            dropdownParent: $("#modalCrearProducto")
          });
        } 
        
        else{
          crearInput(elemento,valores[0][`${elemento}`]);
        }
  });

  document.getElementById("enviarForm").onclick = () => enviarFormulario(IdElemento,"Editar","Empleado",`${rutaEditar}/`,columnas);

}

//Funcion para crear el formulario para crear
async function crearFormularioCrear() {
  const Titulo = "Agregar Empleado"
  const opcionesSelect2 = ["Activo","Despedido","Ausente"];
  let IdElemento = 0;

  document.querySelector(".tituloModal").textContent = Titulo;
  const resJson = await obtenerColumnas(tablaColumnasCrear) 
    columnas = resJson.map(objeto => objeto.Columnas);
    console.log(columnas);
    columnas.forEach(elemento => {
      console.log(elemento);
      if(elemento == "Empleado") {
        const etiquetaBase = document.getElementById("EmpleadoLabel");
        etiquetaBase.textContent = `Empleado: ${IdElemento}`;
        etiquetaBase.classList.add("text-center");
      } else if(elemento == "Rol")
        {
          const selectRol = crearElementoHTML("select");
          selectRol.classList.add("form-select","form-control-sm");
          selectRol.setAttribute("aria-label","Default select example");
          selectRol.id = `in${elemento}`;
          console.log("El id es: "+ `in${elemento}`);
          document.getElementById(elemento).appendChild(selectRol);
          obtenerOpciones("SP_ObtenerRoles",selectRol,"Operador");
        } else if(elemento == "IdPersona")
          {
            const selectPersona = crearElementoHTML("select");
            selectPersona.classList.add("form-select","form-control-sm");
            selectPersona.setAttribute("aria-label","Default select example");
            selectPersona.id = `in${elemento}`;
            console.log("El id es: "+ `in${elemento}`);
            document.getElementById(elemento).appendChild(selectPersona);
            obtenerOpciones("SP_ObtenerPersonas",selectPersona,"");
          } else if(elemento == "Estatus") {
          const selectEstatus = crearElementoHTML("select");
          selectEstatus.classList.add("form-select","form-control-sm");
          selectEstatus.setAttribute("aria-label","Default select example");
          selectEstatus.id = `in${elemento}`;
          console.log("El id es: "+ `in${elemento}`);
          document.getElementById(elemento).appendChild(selectEstatus);
          opcionesSelect2.forEach(valor => {
            const opcion = document.createElement("option");
            if(valor == "Activo") {
                opcion.setAttribute("selected","");
            }
            opcion.value = valor;
            opcion.textContent = valor;
            selectEstatus.appendChild(opcion);
          });
        } else if (elemento == "Sucursal") {
          const selectSucursal = crearElementoHTML("select");
          selectSucursal.classList.add("form-select","form-control-sm");
          selectSucursal.setAttribute("aria-label","Default select example");
          selectSucursal.id = `in${elemento}`;
          console.log("El id es: "+ `in${elemento}`);
          document.getElementById(elemento).appendChild(selectSucursal);
          obtenerOpciones("SP_ObtenerSucursales",selectSucursal,"");
          $(`#inSucursal, #inIdPersona`).select2({
            dropdownParent: $("#modalCrearProducto")
          });
        }  else {
          crearInput(elemento,"");
        }
  });
  document.getElementById("enviarForm").onclick = () => enviarFormulario("","Crear","",`${rutaCrear}/`,columnas);
}

//Funcion para obtener los datos de la tabla
async function obtenerDatosTabla() {
  deshabilitarElementos();
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
  const res = await fetch(`${API}deleteEmpleado/${valorInputBarra.value}`, {
    method : "DELETE",
    headers: {
      "Content-Type": "application/json"
  }
  });

  if(res.ok) {
    crearAlerta("success","Elemento Eliminado");
    obtenerDatosTabla();
    valorInputBarra.value = "";
  } else if (res.status == 400){
    crearAlerta("warning","No se puede eliminar a si mismo");
  } else if (res.status == 300){
    crearAlerta("danger","No se puede porque el empleado tiene registros asociados");
  }
    else{
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
  } else {
      crearAlerta("danger", "No se pudo hacer la operacion");
  }deshabilitarElementos()
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
    const eleccion = document.getElementById("selectBuscar").value;
    limpiarTabla();
    if(eleccion == "Nombre") {
      obtenerDatosTablaPorNombre();
    } else if(eleccion == "ID") {
      llenarTabla(await obtenerDatosTablaPorId(valorInputBarra.value));
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
  if(input.style.display != 'none')
    {
      deshabilitarElementos();
    }
})

function botonesID(boton) {
  valorInputBarra.value = boton.id;
  document.getElementById("selectBuscar").value = "ID";
}

async function setEmpleadoID() {
  const res = await fetch(API+"setEmpleadoID/"+"Empleados");

  if(res.ok) {
      const resJSON = await res.json();
      console.log("El empleado con el ID: "+ resJSON.Empleado)
  } else {
      alert("No se ha podido establecer conexion");
  }
  return "ok"
}