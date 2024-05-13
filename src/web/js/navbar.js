API = "http://localhost:3000/";

async function cargar() {
  const res = await fetch(API + "datos");
  if (res.ok) {
    const resJson = await res.json();
    console.log("si entra pafdfdf");
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