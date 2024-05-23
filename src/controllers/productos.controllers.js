import { getConnection } from "../database/connection.js";
import sql from 'mssql'

export const updateProducto = async (req, res) => {
    try
    {
        const pool = await getConnection();
        const result = await pool.request()
        .input('id',sql.Int, req.params.id)
        .input('Nombre',sql.VarChar,req.body.Nombre)
        .input('PrecioCompra',sql.Money,req.body.PrecioCompra)
        .input('PrecioVenta',sql.Money,req.body.PrecioVenta)
        .input('IdCategoria',sql.Int,req.body.IdCategoria)
        .input('Stock',sql.Int,req.body.Stock)
        .input('IdProveedor',sql.Int,req.body.IdProveedor)
        .query("EXEC SP_UpdateProducto @id, @Nombre, @IdCategoria, @PrecioCompra, @PrecioVenta, @Stock, @IdProveedor");
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


export const addProducto = async (req, res) => {
    try
    {
        const pool = await getConnection();
        const result = await pool.request()
        .input('Nombre',sql.VarChar,req.body.Nombre)
        .input('PrecioCompra',sql.Money,req.body.PrecioCompra)
        .input('PrecioVenta',sql.Money,req.body.PrecioVenta)
        .input('IdCategoria',sql.Int,req.body.IdCategoria)
        .input('Stock',sql.Int,req.body.Stock)
        .input('IdProveedor',sql.Int,req.body.IdProveedor)
        .query("EXEC SP_InsertProductos @Nombre, @IdCategoria, @PrecioCompra, @PrecioVenta, @Stock, @IdProveedor");
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

