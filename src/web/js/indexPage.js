const inputIdEmpleado = document.getElementById('IdEmpleado');
const inputContraseña = document.getElementById('Contraseña');

API = "http://localhost:3000/";

async function ingresar() { 
    const res = await fetch(API+"login", {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            Id : inputIdEmpleado.value,
            Password : inputContraseña.value
        })
    });

    if(res.ok) {
        const resJson = await res.json();
        const respuesta = resJson.Respuesta;
        if(respuesta == "Correct") {
            crearAlerta("success","Contraseña Correcta")
            window.location.href = '/'+'inicio'
        }
        if(respuesta == "Incorrect") {
            crearAlerta("danger","Contraseña Incorrecta")
        }
        if(respuesta == "NotFound") {
            crearAlerta("danger","Empleado no encontrado")
        }
        
    }
    else
    {
        console.log("NOOO")
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