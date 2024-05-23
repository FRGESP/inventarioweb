import { getConnection } from "../database/connection.js";
import sql from 'mssql'

export const updateProveedor = async (req, res) => {
    try
    {
        const pool = await getConnection();
        const result = await pool.request()
        .input('id',sql.Int, req.params.id)
        .input('Proveedor',sql.VarChar,req.body.Proveedor)
        .input('Telefono',sql.VarChar,req.body.Telefono)
        .input('Direccion',sql.Int,req.body.IdDireccion)
        .query("EXEC SP_UpdateProveedor @id, @Proveedor, @Telefono, @Direccion");
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


export const addProveedor = async (req, res) => {
    try
    {
        const pool = await getConnection();
        const result = await pool.request()
        .input('Proveedor',sql.VarChar,req.body.Proveedor)
        .input('Telefono',sql.VarChar,req.body.Telefono)
        .input('Direccion',sql.Int,req.body.IdDireccion)
        .query("EXEC sp_insertProveedor @Proveedor, @Telefono, @Direccion");
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

