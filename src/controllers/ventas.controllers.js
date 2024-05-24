import { getConnection } from "../database/connection.js";
import sql from "mssql";

export const obtenerNombreCliente = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .query("EXEC SP_ObtenerCliente @id");
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Not found" });
    } else {
      return res.json(result.recordset[0]);
    }
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(404).json({ message: error.message });
  }
};

export const getTotal =  async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query('EXEC SP_ObtenerTotal');
    res.json(result.recordset[0]);
  }catch {
    console.error("Error:", error.message);
    return res.status(404).json({ message: error.message });
  }
}

export const subbirProductoVenta = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('Producto',sql.Int,req.body.Producto)
      .input('Cantidad',sql.Int,req.body.Cantidad)
      .query("EXEC SP_Ventas @Producto, @Cantidad");
      return res.status(200).json({ message: "OK" }); 
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(404).json({ message: error.message });
  }
};


export const subbirVenta = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('Cliente',sql.Int,req.body.Cliente)
      .input('Empleado',sql.Int,req.session.user)
      .query("EXEC SP_Tickets @Cliente, @Empleado");
      return res.status(200).json({ message: "OK" }); 
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(404).json({ message: error.message });
  }
};