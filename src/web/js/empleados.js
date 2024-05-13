API = "http://localhost:3000/";

async function obtenerDatosTabla() {
  const res = await fetch(API + "vistaTablas/SP_EmpleadosVista");

  if (res.ok) {
    console.log("SIUUU");
    const resJson = await res.json();
    console.log(resJson);
    var source = document.getElementById("tabla-template").innerHTML;
    var template = Handlebars.compile(source);
    var html = template({ elementos: resJson });
    document.getElementById("tabla-container").innerHTML = html;
  } else {
    console.log("NOOO");
  }
}

function limpiarTabla() {
  const tabla = document.getElementById("tabla");
  const filas = tabla.querySelectorAll("tr");
  filas.forEach((fila) => {
    fila.remove();
  });
}
