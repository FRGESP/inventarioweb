import { getConnection } from "../database/connection.js";
import sql from 'mssql'


export const getProducts = async (req,res) => {
    const pool = await getConnection();

    const result = await pool.request().query("select * from Personas");
    return res.json(result.recordset)
};

export const getProduct = async(req,res) => {
    const pool = await getConnection();

    const result = await pool.request()
    .input("id",sql.Int,req.params.id)
    .query("select * from Productos where IdProducto = @id");

    if(result.rowsAffected[0] == 0)
    {
            return res.status(404).json({message : "No encontrado"})
    }

    return res.json(result.recordset[0]);

}

export const createProduct = async(req,res) => { 
    const pool = await getConnection();
    const result = await pool.request()
    .input("nombre",sql.VarChar,req.body.nombre)
}