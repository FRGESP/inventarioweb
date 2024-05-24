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
            req.session.user = result.recordset[0].Empleado;
            req.session.rol = result.recordset[0].Rol
            req.session.rol = result.recordset[0].Rol
            req.session.estatus = result.recordset[0].Estatus
            req.session.visited = true;
            if(req.session.estatus == "Despedido") {
                console.error("Cuenta Inactiva");
                return res.status(400).json({message : "Cuenta Inactiva"})
            }
        }

        req.sessionStore.get(req.session.id, (err,sessioData) => {
            if(err) {
                console.log(err);
                throw err;
            }
        });
        console.log("El Id: "+req.session.id);
        console.log(req.session);

        return res.json(result.recordset[0])


    }
    catch(error)
    {
        console.error("Error:", error.message);
        return res.status(404).json({message : error.message})
    }
}

