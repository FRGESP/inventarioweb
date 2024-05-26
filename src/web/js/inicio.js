const usuario = document.getElementById("usuario");

API = "http://localhost:3000/";

async function nombre() {
    const res = await fetch(API+"nombreUser");
    if(res.ok)
    {
        const resJson = await res.json();
        console.log(resJson);
        document.getElementById("nombre").textContent = resJson.Nombre
    }
    else{
        console.log("No hay categorias");
    }
}

async function setEmpleadoID() {
    const res = await fetch(API+"setEmpleadoID");

    if(res.ok) {
        const resJSON = await res.json();
        console.log("El empleado con el ID: "+ resJSON.Empleado)
    } else {
        alert("No se ha podido establecer conexion");
    }
}

// async function cargar() {
//     const res = await fetch(API + "datos");
//     if (res.ok) {
//       const resJson = await res.json();
//       console.log(resJson.Nombre);
//       document.getElementById("usuario").textContent = resJson.Nombre;
//     } else {
//       console.log("Sesion cerrada");
//     }
//   };