import { getConnection } from "../database/connection.js";
import sql from 'mssql'

export const getAccion= async (req,res) => {
    try {
        const pool = await getConnection();
        const procedure = req.params.procedure;
        const elemento = req.params.elemento;
        const result = await pool.request()
        .query(`EXEC ${procedure} '${elemento}'`);

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