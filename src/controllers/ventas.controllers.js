import { getConnection } from "../database/connection.js";
import sql from 'mssql';
import PDFFocument from "pdfkit-construct";

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
    const result = await pool.request()
    .input("USER",sql.Int,req.session.user)
    .query('EXEC SP_ObtenerTotal @USER');
    res.json(result.recordset[0]);
  }catch {
    console.error("Error:", error.message);
    return res.status(404).json({ message: error.message });
  }
}

export const getClienteActual=  async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request()
    .input("USER",sql.Int,req.session.user)
    .query('EXEC SP_ObtenerClienteActual @USER');
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
      .input('Cliente',sql.Int,req.body.Cliente)
      .input("USER",sql.Int,req.session.user)
      .query("EXEC SP_Ventas @Producto, @Cantidad, @USER, @Cliente");
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
      .input('Empleado',sql.Int,req.session.user)
      .query("EXEC SP_Tickets @Empleado");
      return res.status(200).json({ message: "OK" }); 
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(404).json({ message: error.message });
  }
};

function buildPDF(dataCallback, endCallback,cliente,empleado,venta) {
  try{
      const doc = new PDFFocument();
  const fecha = cliente.Fecha.toLocaleDateString();

  doc.on('data', dataCallback)
  doc.on('end',endCallback)

 

  doc.setDocumentHeader({
      height: "52%"
  }, () => {

    doc.image('src/web/img/logo.png', 500, 20, {fit: [50, 100], align: 'center'});

      doc.fontSize(30).text("Ticket De Compra",{
          align : 'center'
      });
      doc.moveDown(1);

      doc.fontSize(13).text(`${empleado.Sucursal}\n${empleado.Direccion}`,{
        align : 'center'
    });

    doc.moveDown(1);

      doc.fontSize(13).text(`Le atendió: ${empleado.NombreEmpleado}\n ID Empleado: ${empleado.IdEmpleado}`,{
        align : 'center'
    });
  
      doc.fontSize(13).text("Ticket : " + cliente.Ticket +"\nFecha de compra: " + fecha, {
          align : 'right'
      });
      doc.moveDown();
      doc.fontSize(13).text(`ID Cliente:  ${cliente.IdCliente} \nCliente: ${cliente.Nombre} \n`);
      doc.moveDown(2);
      doc.fontSize(20).text(`Total de la venta: $${cliente.Total}`,{align : 'right'})
      doc.moveDown();
      doc.fontSize(20).text("Productos",{
          align : 'center'
      });
      
  });
  doc.addTable([
      {key: "IdProducto", label: "ID",align: "center"},
      {key: "Nombre", label: "Producto",align: "left"},
      {key: "Cantidad", label: "Cantidad",align: "left"},
      {key: "Precio", label: "Precio",align: "left"},
      {key: "Monto", label: "Monto",align: "left"},
  ], venta,
  {
      border: null,
      width: "fill_body",
      striped: true,
      stripedColors: ["#ffffff", "#f2f2f2"],
      cellsPadding: 10,
      marginLeft: 45,
      marginRight: 45,
      headAlign: 'center',
      headBackground : "#9e9e9e"
  });

  doc.render();
  doc.end();
  }
  catch(error) {
      console.log(error);
  }
  
}

export const getTicket = async (req, res) => {
  try{const pool = await getConnection();
  const result = await pool.request()
  .input("USER",sql.Int,req.session.user)
  .query("EXEC SP_ImprimirTicket @USER") 

  if (result.recordsets === 0)
  {
      return res.status(404).json({message: "Product not found"})
      
  }else {
      const infoVentas = result.recordsets[0];
      const infoCliente = result.recordsets[1][0];
      const infoEmpleado = result.recordsets[2][0];
      const stream = res.writeHead(200, {
          "Content-Type" : "application/pdf",
          "Content-Disposition" : "attachment; filename=factura.pdf"
      });
      buildPDF((data) => {stream.write(data);}, () => {stream.end()},infoCliente,infoEmpleado,infoVentas)
     // return res.json(result.recordsets);
  }
  
  }
  catch(error)
  { 
      console.error("Error:", error.message);
      return res.status(404).json({message : error.message})
  }
};

export const getvistaTicket = async (req,res) => {
  try{
      const pool = await getConnection();
      const result = await pool.request()
      .input("USER",sql.Int,req.session.user)
      .query(`EXEC SP_TicketActualVista @USER`)
      return res.json(result.recordset);
  } catch(error) {
      console.error("Error:", error.message);
      return res.status(404).json({message : error.message})
  }
}