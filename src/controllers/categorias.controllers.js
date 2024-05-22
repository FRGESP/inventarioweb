import { getConnection } from "../database/connection.js";
import sql from 'mssql'

export const updateCategoria = async (req, res) => {
    try
    {
        const pool = await getConnection();
        const result = await pool.request()
        .input('id',sql.Int, req.params.id)
        .input('Categoria',sql.VarChar,req.body.Categoria)
        .query("EXEC SP_UpdateCategoria @id, @Categoria");
        console.log(result);
        if (result.rowsAffected[0] === 0)
        {
            res.send("No se pudo realizar");
            return res.status(404).json({message: "Element not found"})
        }
        return res.json(result.recordset[0]);
    }
    catch(error)
    {
        console.error("Error:", error.message);
        return res.status(404).json({message : "No se pudo modificar los datos"})
    }
    
};

export const addCategoria = async (req, res) => {
    try
    {
        const pool = await getConnection();
        const result = await pool.request()
        .input('Categoria',sql.VarChar,req.body.Categoria)
        .query("EXEC sp_insertCategoria @Categoria");
        console.log(result);
        if (result.rowsAffected[0] === 0)
        {
            res.send("No se pudo realizar");
            return res.status(404).json({message: "Element not found"})
        }
        return res.json(result.recordset[0]);
    }
    catch(error)
    {
        console.error("Error:", error.message);
        return res.status(404).json({message : "No se pudo agregar datos"})
    }
    
};

