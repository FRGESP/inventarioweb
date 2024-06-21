const valorInputBarra = document.getElementById("inputBuscar");

//Titulos
const tituloPestañaSup = document.getElementById("TituloPestaña").textContent = "Direcciones";
const tituloBodySup = document.getElementById("TituloBody").textContent = "Direcciones";

//Funciones
const stockGetAllData = "SP_MostrarDirecciones"
let stockGetByID = "SP_MostrarDireccion"
const stockDeleteElement = "SP_DeleteDireccion"
const tablaColumnasEditar = "VistaDirecciones";
const rutaEditar = "editarDirecciones"
const tablaColumnasCrear = "VistaDirecciones";
const rutaCrear = "agregarDireccion";

API = "/";

//Funcion para crear el formulario para editar
async function crearFormularioEditar() {
  const Titulo = "Editar Dirección"
  document.querySelector(".tituloModal").textContent = Titulo;
   const nombreDelId = "IdDireccion" 
   const valores = await obtenerDatosTablaPorId(valorInputBarra.value);
   let IdElemento = valores[0][`${nombreDelId}`];
   const resJson = await obtenerColumnas(tablaColumnasCrear) 
     columnas = resJson.map(objeto => objeto.Columnas);
     columnas.forEach(elemento => {
       if(elemento == nombreDelId) {
         const etiquetaBase = document.getElementById(`${nombreDelId}`);
         etiquetaBase.remove();
       } else if(elemento == "CodigoPostal") {
           document.getElementById(elemento).textContent = "Código Postal:";
           document.getElementById(elemento).classList.add("text-center");
           const container = crearElementoHTML("div");
           container.classList.add("container");
           document.getElementById(elemento).appendChild(container);
           const rowform = crearElementoHTML("div");
           rowform.classList.add("row", "justify-content-center","text-center");
           container.appendChild(rowform);
           const colInput = crearElementoHTML("div");
           colInput.classList.add("col-md-auto");
           rowform.appendChild(colInput);
           const inputCodigo = crearElementoHTML("input");
           inputCodigo.classList.add("form-control");
           inputCodigo.id = `in${elemento}`;
           colInput.appendChild(inputCodigo);
           const colButton = crearElementoHTML("div");
           colButton.classList.add("col-md-auto");
           rowform.appendChild(colButton);
           const botonValidarCodigo = crearElementoHTML("button");
           botonValidarCodigo.classList.add("btn", "btn-success");
           const icono = crearElementoHTML("i");
           icono.classList.add("fa-solid", "fa-check")
           botonValidarCodigo.appendChild(icono);
           botonValidarCodigo.onclick = () => llenarDireccion(columnas,valores[0].Calle,valores[0].Colonia);
           colButton.appendChild(botonValidarCodigo);
           inputCodigo.value = valores[0].CodigoPostal;
           botonValidarCodigo.click();
         } else {
           document.getElementById(elemento).style.display = "none";
         }
   });
  document.getElementById("enviarForm").onclick = () => enviarFormulario(IdElemento,"Editar",nombreDelId,`${rutaEditar}/`,columnas);

}

//Funcion para crear el formulario para crear
async function crearFormularioCrear() {
 const Titulo = "Agregar Dirección"
 document.querySelector(".tituloModal").textContent = Titulo;
  const nombreDelId = "IdDireccion"

  
  const resJson = await obtenerColumnas(tablaColumnasCrear) 
    columnas = resJson.map(objeto => objeto.Columnas);
    columnas.forEach(elemento => {
      if(elemento == nombreDelId) {
        const etiquetaBase = document.getElementById(`${nombreDelId}`);
        etiquetaBase.remove();
      } else if(elemento == "CodigoPostal") {
          document.getElementById(elemento).textContent = "Código Postal:";
          document.getElementById(elemento).classList.add("text-center");
          const container = crearElementoHTML("div");
          container.classList.add("container");
          document.getElementById(elemento).appendChild(container);
          const rowform = crearElementoHTML("div");
          rowform.classList.add("row", "justify-content-center","text-center");
          container.appendChild(rowform);
          const colInput = crearElementoHTML("div");
          colInput.classList.add("col-md-auto");
          rowform.appendChild(colInput);
          const inputCodigo = crearElementoHTML("input");
          inputCodigo.classList.add("form-control");
          inputCodigo.id = `in${elemento}`;
          colInput.appendChild(inputCodigo);
          const colButton = crearElementoHTML("div");
          colButton.classList.add("col-md-auto");
          rowform.appendChild(colButton);
          const botonValidarCodigo = crearElementoHTML("button");
          botonValidarCodigo.classList.add("btn", "btn-success");
          const icono = crearElementoHTML("i");
          icono.classList.add("fa-solid", "fa-check")
          botonValidarCodigo.appendChild(icono);
          botonValidarCodigo.onclick = () => llenarDireccion(columnas,"","");
          colButton.appendChild(botonValidarCodigo);
        } else {
          document.getElementById(elemento).style.display = "none";
        }
  });
  document.getElementById("enviarForm").onclick = () => enviarFormulario("","Crear",nombreDelId,`${rutaCrear}/`,columnas);
}

//Funcion para llenar Direccion

async function llenarDireccion(columnas,calle,colonia) {
    const codigoPost = document.getElementById("inCodigoPostal").value;
    const vari = stockGetByID;
    stockGetByID = "SP_CodigoPostal";
    const informacion = await obtenerDatosTablaPorId(codigoPost);
    deshabilitarElementos();
    stockGetByID = vari;
    columnas.forEach(elemento => {
      let  lugar = document.getElementById(elemento);
      if(elemento != "IdDireccion" && elemento != "CodigoPostal") {
        lugar.style.display = "";
        if(elemento == "Colonia") {
          const selectColonia = crearElementoHTML("select");
          selectColonia.classList.add("form-select","form-control-sm");
          selectColonia.setAttribute("aria-label","Default select example");
          selectColonia.id = `in${elemento}`;
          document.getElementById(elemento).appendChild(selectColonia);
          obtenerColonias(informacion,selectColonia,colonia);
        } else if(elemento == "Calle") {
          crearInput(elemento,calle);
        } 
        else{
          crearInput(elemento,informacion[0][elemento]);
          document.getElementById(`in${elemento}`).setAttribute("disabled","");
        }
      }
    })
}
async function obtenerColonias(informacion,select,actual) {
  informacion.forEach(valor => {
          const opcion = document.createElement("option");
          if(valor.Elemento == actual) {
              opcion.setAttribute("selected","");
          }
          opcion.value = valor.Id;
          opcion.textContent = valor.Elemento;
          select.appendChild(opcion);
      });

}

$(document).ready(function() {
  // Delegación de eventos para elementos dinámicos
  $(document).on("change keyup paste", "#inCodigoPostal", async function() {
    if(document.getElementById("Pais").style.display != "none") {
      const elements = document.querySelectorAll('[id^="in"]');
      let ids = Array.from(elements).filter(element => element.id !== "inputBuscar");
      ids = Array.from(ids).map(element => element.id);


      ids.forEach(elemento => {
      if (elemento != "inCodigoPostal") {
        const inputElement = document.getElementById(`${elemento}`);
        const divElement = inputElement.parentNode;
        inputElement.remove();
        divElement.style.display = "none";
      }
    });
    }
  });
});

//Funcion para obtener los datos de la tabla
async function obtenerDatosTabla() {
  deshabilitarElementos();
  const res = await fetch(API + "vistaTablas/"+stockGetAllData);

  if (res.ok) {
    const resJson = await res.json();
    llenarTabla(resJson);
    valorInputBarra.value = "";
    document.getElementById("selectBuscar").value = "seleccion";
  } else {
    crearAlerta("danger","No se puedieron obtener los datos de la tabla");
  }
}

//Funcion para borrar los elementos de la tabla
async function eliminarElementos() {
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
  const res = await fetch(ruta);
  if (res.ok) {
    const resJson = await res.json();
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

  let bodyData = {};
  columnas.forEach(columna => {
    if(columna != nombreId) {
      let columnaActual = document.getElementById(`in${columna}`)
      bodyData[columna] =  columnaActual.value;
      columnaActual.remove();
    }
  });
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
      crearAlerta("success", "Operacion Completada");
  } else {
      crearAlerta("danger", "No se pudo hacer la operacion");
  }
  deshabilitarElementos();
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
  }
  else{
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
