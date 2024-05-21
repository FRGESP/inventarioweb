import { getConnection } from "../database/connection.js";
import sql from 'mssql'

export const updateDireccion = async (req, res) => {
    try
    {
        const pool = await getConnection();
        const result = await pool.request()
        .input('id',sql.Int, req.params.id)
        .input('CodigoPostal',sql.Int, req.body.CodigoPostal)
        .input('Calle',sql.VarChar,req.body.Calle)
        .input('Colonia',sql.Int,req.body.Colonia)
        .query("EXEC SP_UdateDirecciones @id, @CodigoPostal, @Colonia, @Calle");
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

export const addDireccion = async (req, res) => {
    try
    {
        const pool = await getConnection();
        const result = await pool.request()
        .input('CodigoPostal',sql.Int, req.body.CodigoPostal)
        .input('Calle',sql.VarChar,req.body.Calle)
        .input('Colonia',sql.Int,req.body.Colonia)
        .query("EXEC SP_AgregarDireccion @CodigoPostal, @Colonia, @Calle");
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

