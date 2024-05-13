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