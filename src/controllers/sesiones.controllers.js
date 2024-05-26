import { getConnection } from "../database/connection.js";
import sql from 'mssql'

export const auth = async (req,res) => {

    req.sessionStore.get(req.session.id, (err,session) => {
        console.log(session);
    })

    return req.session.user ? res.status(200).send(req.session.user) : res.status(401).send({message : "No autenticado"})
}


export const perfil = async (req,res) => {
    if(!req.session.user){
        res.status(401).send({message : "No autenticado"})
    }
    try {    
    const pool = await getConnection();

    const result = await pool.request()
    .input('id',sql.Int,req.session.user)
    .query("EXEC SP_Perfil @id") 

    return res.json(result.recordset[0]);
    } catch(error) {
        console.error("Error:", error.message);
        return res.status(404).json({message : error.message})
    }
}

export const logout = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error("Error al cerrar sesión:", err);
                return res.status(500).json({ message: "Error al cerrar sesión" });
            }
            console.log("Sesión cerrada correctamente");
            res.clearCookie('session-id');
            return res.redirect("/");
        });
    } catch (error) {
        console.error("Error al cerrar sesión:", error.message);
        return res.status(500).json({ message: "Error al cerrar sesión" });
    }
};

export const vistaTablas = async (req,res) => {
    try{
        const pool = await getConnection();
        const procedure = req.params.procedure;
        console.log(procedure)
        const result = await pool.request()
        .query(`EXEC ${procedure}`)
        return res.json(result.recordset);
    } catch(error) {
        console.error("Error:", error.message);
        return res.status(404).json({message : error.message})
    }
}

export const vistaTablasElemento = async (req,res) => {
    try {
        const pool = await getConnection();
        const procedure = req.params.procedure;
        const elemento = req.params.elemento;
        const result = await pool.request()
        .query(`EXEC ${procedure} ${elemento}`);

        if (result.rowsAffected[0] === 0){
            return res.status(404).json({message: "Not found"})       
        } else {
            return res.json(result.recordset);
        } 
    }catch(error) {
        console.error("Error: ",error.message);
        return res.status(404).json({message : error.message});
    }
}

export const deleteTablas = async (req,res) => {
    try {
        const pool = await getConnection();

        const procedure = req.params.procedure;
        const id = req.params.id;

        const result = await pool.request().query(`EXEC ${procedure} ${id}`)
        
        console.log(result);

        if (result.rowsAffected[0] === 0)
        {
            return res.status(404).json({message: "Element not found"})
        }
        return res.json({message : "Element deleted"});  
        } catch(error)
        {
            console.error("Error:", error.message);
        }
}

export const setEmpleadoID = async (req,res) => {
    try {
     const pool = await getConnection();
 
     const result = await pool.request()
     .input("Tabla",sql.VarChar,req.params.tabla)
     .input("Empleado",sql.Int,req.session.user)
     .query('EXEC SP_Session @Empleado, @tabla')
     return res.json(result.recordset[0]);
    } catch(error) {
     return res.status(404).json({message : error.message});
    }    
 } 
