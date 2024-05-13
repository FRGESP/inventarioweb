import { getConnection } from "../database/connection.js";
import sql from 'mssql'


export const editarPerfil = async(req,res) => {
    try {
        const pool = await getConnection();

        const result = await pool.request()
        .input('id',sql.Int,req.session.user)
        .input('Correo',sql.VarChar,req.body.Correo)
        .input('Telefono',sql.VarChar,req.body.Telefono)
        .query("EXEC SP_EditarPerfil @id, @Correo, @Telefono");

        return res.json(result.recordset[0]);
    } catch(error)
    {
        console.error("Error:", error.message);
        return res.status(404).json({message : error.message})
    }

}