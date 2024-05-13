import { getConnection } from "../database/connection.js";
import sql from 'mssql'

export const login = async (req,res) => {
    try {
        const pool = await getConnection();

        const result = await pool.request()
        .input('Id',sql.Int,req.body.Id)
        .input('Password',sql.VarChar,req.body.Password)
        .query("EXEC SP_ValidarEmpleado @Id, @Password")

        
        if(result.recordset[0].Respuesta == "Correct"){
            console.log("Este es el empleado"+ result.recordset[0].Empleado);
            const empleado = result.recordset[0].Empleado;
            req.session.user = empleado;
            console.log("Empleado: siuu "+empleado);
            console.log("Empleado que no jala: "+req.session.user)
            req.session.visited = true;
            req.session.isAuth = true;
        }

        req.sessionStore.get(req.session.id, (err,sessioData) => {
            if(err) {
                console.log(err);
                throw err;
            }
        });
        console.log("El id1 "+req.session.id);
        console.log(req.session);

        return res.json(result.recordset[0])


    }
    catch(error)
    {
        console.error("Error:", error.message);
        return res.status(404).json({message : error.message})
    }
}


export const auth = async (req,res) => {

    req.sessionStore.get(req.session.id, (err,session) => {
        console.log(session);
    })

    return req.session.user ? res.status(200).send(req.session.user) : res.status(401).send({message : "No autenticado"})
}

export const nombreEmpleado = async (req,res) => {
    const pool = await getConnection();
    console.log(req.session.user);
    console.log("El id2 "+req.session.id);
    const result = await pool.request()
    .input('id',sql.Int,req.session.user)
    .query("select P.Nombre from Empleados as E INNER JOIN Personas as P ON E.IdPersona = P.IdPersona where E.IdEmpleado = @id")

    return res.json(result.recordset[0]);
}

