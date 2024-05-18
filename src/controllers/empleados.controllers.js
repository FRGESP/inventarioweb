import { getConnection } from "../database/connection.js";
import sql from 'mssql'

export const updateEmpleado = async (req, res) => {
    try
    {
        const pool = await getConnection();
        const result = await pool.request()
        .input('id',sql.Int, req.params.id)
        .input('Sueldo',sql.Money,req.body.Sueldo)
        .input('Correo',sql.VarChar,req.body.Correo)
        .input('Estatus',sql.VarChar,req.body.Estatus)
        .input('Nombre',sql.VarChar,req.body.Nombre)
        .input('Rol',sql.Int,req.body.Rol)
        .input('Telefono',sql.VarChar,req.body.Telefono)
        .query("EXEC SP_AlterEmpleado @id, @Nombre, @Rol, @Sueldo, @Correo, @Telefono, @Estatus");
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

export const addEmpleado = async (req, res) => {
    try
    {
        const pool = await getConnection();
        const result = await pool.request()
        .input('IdPersona',sql.Int, req.body.IdPersona)
        .input('Sueldo',sql.Money,req.body.Sueldo)
        .input('Clave',sql.VarChar,req.body.Clave)
        .input('Estatus',sql.VarChar,req.body.Estatus)
        .input('Rol',sql.Int,req.body.Rol)
        .query("EXEC SP_InsertEmpleados @IdPersona, @Rol, @Clave, @Sueldo, @Estatus");
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

