API = "http://localhost:3000/";

let ban = false;
let lengthMsj;

async function cargar() {
  const res = await fetch(API + "datos");
  if (res.ok) {
    const resJson = await res.json();
    document.getElementById("usuario").textContent = resJson.Nombre;
    if(resJson.Rol == 'Gerente') {
        const elementos = document.querySelectorAll(".Gerente");
        elementos.forEach(function(elemento) {
            elemento.style.display = '';
        });
    }
  } else {
    console.log("Sesion cerrada");
    alert("Su sesión ha expirado");
    window.location.href="/"
  }
};

async function mensajes() {
  limpiarTablaMensajes();
  const selectUsuarioMsj = document.getElementById("selectUsuarioMsj")

  const opciones = selectUsuarioMsj.querySelectorAll("option");
  opciones.forEach(opcion => {
    if(opcion.value != 0) {
      opcion.remove();
    }
  });

  obtenerOpciones("SP_ObtenerUsuariosMensajes",selectUsuarioMsj);
  $(`#selectUsuarioMsj`).select2({
    dropdownParent: $("#modalMensajes-Header")
  });
  if(ban == false) {
    ban = true;
    const interval = setInterval(obtenerConversacionInterval,500);
    $("#selectUsuarioMsj").on("change", function(){
      const dest = document.getElementById("selectUsuarioMsj");
      if(dest.value == 0) {
        limpiarTablaMensajes()
      } 
    })
  }
}

async function obtenerOpciones(stock,select) {
  const res = await fetch(API+"vistaTablas/"+stock);
  if(res.ok)
  {
      const resJson = await res.json();
      resJson.forEach(valor => {
          let opcion = document.createElement("option");
          opcion.value = valor.Id;
          opcion.textContent = valor.Elemento;
          select.appendChild(opcion);
      });
      opcion = document.createElement("option");
      opcion.textContent = "Seleccione un usuario";
      opcion.value = 0;
      opcion.setAttribute("selected","");

      console.log(resJson);
  }
  else{
      console.log("No hay productos");
  }
}

// async function obtenerConversacion(dest) {
//   limpiarTablaMensajes();
//   const res = await fetch(API + "mensajes/"+dest);
//   if (res.ok) {
//     const resJson = await res.json();
//     mostrarMensajes(resJson);
//   } else {
//     console.log("No se puedieron obtener");
//     crearAlerta("danger","No se puedieron obtener los datos ");
//   }
// }

function limpiarTablaMensajes() {
  const tabla = document.getElementById("tablaMensajes");
  const filas = tabla.querySelectorAll("tr");
  filas.forEach(fila => {
      fila.remove();
  });
}

async function enviarMensaje() {
  const dest = document.getElementById("selectUsuarioMsj").value;
  const mensaje = document.getElementById("textareaMsj");
  const res = await fetch(API + "enviarMensaje/"+dest, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
      Mensaje : mensaje.value
    })
});
  if(res.ok) {
    mensaje.value = "";
  } else {
    console.log("No se pudo")
  }
}

async function obtenerConversacionInterval() {
  const dest = document.getElementById("selectUsuarioMsj").value;
  if(dest != 0) {
  const res = await fetch(API + "mensajesInterval/"+dest);
  if (res.ok) {
    const resJson = await res.json();
    if(lengthMsj != resJson.length)
      {
        lengthMsj = resJson.length;
        limpiarTablaMensajes();
        mostrarMensajes(resJson);
        const container = document.querySelector('.tbl-fixed');
        container.scrollTop = container.scrollHeight;
      }
  } else {
    console.log("No se puedieron obtener");
  }
  }
}

function mostrarMensajes(resJson) {
  let Fecha = new Date("01-01-1000")
  const tablaMsj = document.getElementById("tablaMensajes");
    resJson.forEach(elemento => {
      let fila = document.createElement("tr");
      let col1 = document.createElement("td");
      let col2 = document.createElement("td");
      
      if(new Date(elemento.Fecha) > Fecha) {
        Fecha = new Date(elemento.Fecha)
        let filaFecha = document.createElement("tr");
        let colFecha = document.createElement("td");
        console.log(Fecha.toLocaleDateString())
        colFecha.textContent = Fecha.toLocaleDateString();
        colFecha.setAttribute("colspan","2");
        colFecha.classList.add("text-center")
        filaFecha.appendChild(colFecha);

        tablaMsj.appendChild(filaFecha);
      }
      if(elemento.Usuario == elemento.Remitente) {
        fila.appendChild(col1);
        col2.textContent = elemento.Mensaje;
        col2.classList.add("remitente");
        fila.appendChild(col2);
      } else{
        col1.textContent = elemento.Mensaje;
        col1.classList.add("destinatario");
        fila.appendChild(col1);
        fila.appendChild(col2);
      }
      tablaMsj.appendChild(fila);
      //console.log(.toLocaleDateString())
    })
}