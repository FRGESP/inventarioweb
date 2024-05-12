import { getConnection } from "../database/connection.js";
import sql from 'mssql'

export const login = async (req,res) => {
    try {
        const pool = await getConnection();

        const result = await pool.request()
        .input('Id',sql.Int,req.body.Id)
        .input('Password',sql.VarChar,req.body.Password)
        .query("EXEC SP_ValidarEmpleado @Id, @Password")

        return res.json(result.recordset[0])
    }
    catch(error)
    {
        console.error("Error:", error.message);
        return res.status(404).json({message : error.message})
    }
}