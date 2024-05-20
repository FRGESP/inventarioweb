API = "http://localhost:3000/";

async function datosUsuario() {
  const res = await fetch(API + "datos");
  if (res.ok) {
    const resJson = await res.json();
    document.getElementById("nombreUsuario").textContent = resJson.Nombre;
    document.getElementById("IdEmpleado").value = resJson.Empleado;
    document.getElementById("Rol").value = resJson.Rol;
    document.getElementById("Sueldo").value = resJson.Sueldo;
    document.getElementById("Estatus").value = resJson.Estatus;
    document.getElementById("Correo").value = resJson.Correo;
    document.getElementById("Telefono").value = resJson.Telefono;
    document.getElementById("Sucursal").value = resJson.Sucursal;
  } else {
    console.log("Sesion cerrada");
  }
};

async function editarPerfil() {
    const res = await fetch(API + "editarPerfil",{
        method : "PUT",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            Correo : document.getElementById("Correo").value,
            Telefono : document.getElementById("Telefono").value,
        })
    });
    if(res.ok)
        {
            const elementos = document.querySelectorAll(".entrada");
            elementos.forEach(function(elemento) {
                elemento.setAttribute("disabled",'');
            });
            crearAlerta("success","Su perfil se ha actualizado con exito");
        } else {
            crearAlerta("danger","No se ha podido actualizar el perfil. Vuelva a intentarlo");
        }
}

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