import { getConnection } from "../database/connection.js";
import sql from 'mssql'

export const updatePersona = async (req, res) => {
    try
    {
        const pool = await getConnection();
        const result = await pool.request()
        .input('id',sql.Int, req.params.id)
        .input('Correo',sql.VarChar,req.body.Correo)
        .input('Nombre',sql.VarChar,req.body.Nombre)
        .input('Telefono',sql.VarChar,req.body.Telefono)
        .input('Direccion',sql.Int,req.body.Direccion)
        .query("EXEC SP_UdatePersona @id, @Nombre, @Correo, @Telefono, @Direccion");
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

export const addPersona = async (req, res) => {
    try
    {
        const pool = await getConnection();
        const result = await pool.request()
        .input('Correo',sql.VarChar,req.body.Correo)
        .input('Nombre',sql.VarChar,req.body.Nombre)
        .input('Telefono',sql.VarChar,req.body.Telefono)
        .input('Direccion',sql.Int,req.body.Direccion)
        .query("EXEC SP_InsertPersonas @Nombre, @Correo, @Telefono, @Direccion");
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

