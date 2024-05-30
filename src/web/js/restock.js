const valorInputBarra = document.getElementById("inputBuscar");
let proveedorAct = 0;

//Titulos
const tituloPestañaSup = document.getElementById("TituloPestaña").textContent = "Restock";
const tituloBodySup = document.getElementById("TituloBody").textContent = "Restock";

//Funciones
const stockGetAllData = "SP_RestockVista"
let stockGetByID = "SP_RestockId"
const stockGetByName = "SP_RestockNombre"
const tablaColumnasEditar = "VistaEditarStock";
const rutaEditar = "restock"

API = "http://localhost:3000/";

//Funcion para crear el formulario para editar
async function crearFormularioEditar() {
  const Titulo = "Editar Stock"
  const nombreDelId = "Nombre"
  const etiquetaDelID = "Producto"
  let IdElemento = 0;

  document.querySelector(".tituloModal").textContent = Titulo;
  const resJson = await obtenerColumnas(tablaColumnasEditar) 
    const valores = await obtenerDatosTablaPorId(valorInputBarra.value); 
    IdElemento = valores[0][`IdProducto`];
    columnas = resJson.map(objeto => objeto.Columnas);
    console.log(columnas);
    columnas.forEach(elemento => {
      console.log(elemento);
      if(elemento == nombreDelId) {
        const etiquetaBase = document.getElementById(`${nombreDelId}`);
        etiquetaBase.textContent = `${etiquetaDelID}: ${valores[0].Nombre}`;
        etiquetaBase.classList.add("text-center");
      } else if(elemento == "StockAct") {
        const etiquetaBase2 = document.getElementById(`StockAct`);
        etiquetaBase2.textContent = `El stock actual es: ${valores[0].Stock}`;
        etiquetaBase2.classList.add("text-center");
        }
        else if(elemento != "IdProducto") {
            document.getElementById(`Stock`).textContent = "Unidades a añadir:"
          crearInput(elemento,"");
        }
  });
  document.getElementById(`IdProducto`).style.display = "none";
  document.getElementById("enviarForm").onclick = () => enviarFormulario(IdElemento,"Editar",`${rutaEditar}/`);

}


//Funcion para obtener los datos de la tabla
async function obtenerDatosTabla() {
  deshabilitarElementos();
  deshabilitarImpresion();
  const res = await fetch(API + "vistaTablas/"+stockGetAllData);

  if (res.ok) {
    const resJson = await res.json();
    console.log(resJson);
    llenarTabla(resJson);
    valorInputBarra.value = "";
    document.getElementById("selectBuscar").value = "seleccion";
    document.getElementById("selectProveedor").value = "seleccion";
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
    crearAlerta("danger","No se ha encontrado nada con esos datos");
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
async function obtenerDatosTablaPorCantProv() {
    const res = await fetch(`${API}obtenerRestock/${valorInputBarra.value}/${proveedorAct}`);
    if (res.ok) {
      console.log("SIUUU");
      const resJson = await res.json();
      console.log(resJson);
      llenarTabla(resJson);
      habilitarImpresion();
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


async function enviarFormulario(id,accion,ruta) {

  let bodyData = {};
  let columnaActual = document.getElementById(`inStock`)
      bodyData["Stock"] =  columnaActual.value;
      columnaActual.remove();
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
  }

  if (res.ok) {
      const resJson = await res.json();
      if(accion == "Editar") {
        llenarTabla(await obtenerDatosTablaPorId(id));
      }
      console.log(resJson);
      crearAlerta("success", "Stock Actualizado");
  } else {
      crearAlerta("danger", "No se pudo hacer la operacion");
  }
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
      document.getElementById("selectProveedor").value = "seleccion";
      }
      else if(eleccion == "Cantidad") {
        obtenerDatosTablaPorCantProv();
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

async function obtenerProveedores() {
    const selectProv = document.getElementById("selectProveedor");
    const res = await fetch(API+"vistaTablas/"+"SP_ObtenerProveedores");
    if(res.ok)
    {
        const resJson = await res.json();
        resJson.forEach(valor => {
            const opcion = document.createElement("option");
            opcion.value = valor.Id;
            opcion.textContent = valor.Elemento;
            selectProv.appendChild(opcion);
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

//Funcion para habilitar Elementos
function habilitarImpresion() {
    let elementos = document.querySelectorAll('.imprimir');
    elementos.forEach(function(elemento) {
        if(document.getElementById("selectProveedor").value != "seleccion"){
            elemento.style.display = '';
        }
        
    })
  }
  
  //Funcion para deshabilitar Elementos
  function deshabilitarImpresion() {
    let elementos = document.querySelectorAll('.imprimir');
    elementos.forEach(function(elemento) {
        elemento.style.display = 'none';
    });
  };



$("#inputBuscar").on("change keyup paste", function(){
  const input = document.getElementById("inputBuscar");
  if(input.style.display != 'none')
    {
      deshabilitarElementos();
      deshabilitarImpresion();
    }
})

$("#selectBuscar").on("change keyup paste", function(){
  const input = document.getElementById("inputBuscar");
  if(input.style.display != 'none')
    {
      deshabilitarElementos();
      deshabilitarImpresion();
      
    }
})

$("#selectProveedor").on("change keyup paste", async function(){
    const selectProv = document.getElementById("selectProveedor");

    if(selectProv.value == "seleccion") {
        obtenerDatosTabla()
        proveedorAct = 0
    } else {
        proveedorAct = selectProv.value;
        let vari = stockGetByID;
        stockGetByID = "SP_RestockProveedor"
        llenarTabla( await obtenerDatosTablaPorId(selectProv.value));
        stockGetByID = vari;
        valorInputBarra.value = "";
        document.getElementById("selectBuscar").value = "seleccion";
    }
    deshabilitarElementos();
  })

function botonesID(boton) {
    valorInputBarra.value = boton.id;
    document.getElementById("selectBuscar").value = "ID";
}

async function botonesProveedores(boton) {
    const modal = document.getElementById("caractModal");
    modal.classList.add("modal-xl");
    const Titulo = "Información Proveedor"
    const nombreDelId = "IdProveedor"
    const etiquetaDelID = "Proveedor"
    let IdElemento = 0;
    
    document.querySelector(".tituloModal").textContent = Titulo;
    const resJson = await obtenerColumnas("VistaProveedoresDireccion") 
    let variable = stockGetByID;
    stockGetByID = "SP_ProveedoresVistaPorIDConDireccion"
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
      modal.classList.remove("modal-xl");
    };
    deshabilitarElementos();
  
  }

  //Funcion para descargar el pdf
  async function SacarPDF() {
    let valorBarra;
    if(valorInputBarra.value == '') {
        valorBarra = 0;
    } else {
        valorBarra = valorInputBarra.value
    }
    const res = await fetch(`${API}imprimirRestock/${valorBarra}/${proveedorAct}`);
    if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Restock.pdf';
        document.body.appendChild(a);
        a.click();
  
        // window.open(url, '_blank');
  
        window.URL.revokeObjectURL(url);
        obtenerDatosTabla();
    } else {
        console.log("Hubo un error al obtener el PDF");
    }
  };