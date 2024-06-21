const usuario = document.getElementById("usuario");

API = "/";

async function nombre() {
    const res = await fetch(API+"nombreUser");
    if(res.ok)
    {
        const resJson = await res.json();
        document.getElementById("nombre").textContent = resJson.Nombre
    }
    else{
    }
}

async function setEmpleadoID() {
    const res = await fetch(API+"setEmpleadoID");

    if(res.ok) {
        const resJSON = await res.json();
    } else {
        alert("No se ha podido establecer conexion");
    }
}