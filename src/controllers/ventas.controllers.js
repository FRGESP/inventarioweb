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
