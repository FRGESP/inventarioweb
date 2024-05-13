import { getConnection } from "../database/connection.js";
import sql from 'mssql'

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

