import { getConnection } from "../database/connection.js";
import sql from 'mssql'
import PDFFocument from "pdfkit-construct";


export const vistaRestock = async (req,res) => {
    try {
        const pool = await getConnection();
        const cantidad = req.params.cantidad;
        const proveedor = req.params.proveedor;
        const result = await pool.request()
        .query(`EXEC SP_RestockProveedorCantidad ${cantidad}, ${proveedor}`);

        if (result.rowsAffected[0] === 0){
            return res.status(404).json({message: "Not found"})       
        } else {
            return res.json(result.recordset);
        } 
    }catch(error) {
        console.error("Error: ",error.message);
        return res.status(404).json({message : error.message});
    }
}

export const restock = async (req, res) => {
    try
    {
        const pool = await getConnection();
        const result = await pool.request()
        .input('id',sql.Int, req.params.id)
        .input('Cantidad',sql.Int,req.body.Stock)
        .query("EXEC SP_RestockInv @id, @Cantidad");
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

function buildPDF(dataCallback, endCallback,empleado,productos,proveedor) {
    try{
        const doc = new PDFFocument();
    const fecha = empleado.Fecha.toLocaleDateString();
  
    doc.on('data', dataCallback)
    doc.on('end',endCallback)
  
   
  
    doc.setDocumentHeader({
        height: "45%"
    }, () => {
  
  
        doc.fontSize(30).text("Carta Restock",{
            align : 'center'
        });
        doc.moveDown(1);
  
        doc.fontSize(13).text(`${empleado.Sucursal}\n${empleado.Direccion}`,{
          align : 'center'
      });
  
      doc.moveDown(1);
  
        doc.fontSize(13).text(`Empleado: ${empleado.NombreEmpleado}\n ID Empleado: ${empleado.IdEmpleado}`,{
          align : 'center'
      });

      doc.moveDown(2);

    doc.fontSize(13).text(`A quien corresponda, se le pide de la manera más atenta que haga saber al proveedor ${proveedor.Proveedor} con teléfono ${proveedor.Telefono} y la dirección
    ${proveedor.Direccion} que de favor reabastezca nuestros almacenes con los siguientes productos para que cada uno alcance un stock mínimo de: ${empleado.Cantidad} unidades`,{
        align : 'justify'
    });

    doc.moveDown();
      doc.fontSize(20).text("Productos:",{
          align : 'center'
      });
        
    });
    doc.addTable([
        {key: "IdProducto", label: "ID",align: "center"},
        {key: "Nombre", label: "Producto",align: "left"},
        {key: "Categoria", label: "Categoria",align: "left"},
        {key: "PrecioCompra", label: "PrecioCompra",align: "left"},
        {key: "PrecioVenta", label: "PrecioVenta",align: "left"},
        {key: "Stock", label: "Stock",align: "left"},
        {key: "Proveedor", label: "Proveedor",align: "left"},
    ], productos,
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
  
  export const printRestock = async (req, res) => {
    try{const pool = await getConnection();
    const result = await pool.request()
    .input('Cantidad',sql.Int, req.params.cantidad)
    .input('Proveedor',sql.Int,req.params.proveedor)
    .input("USER",sql.Int,req.session.user)
    .query("EXEC SP_ImprimirRestock @Cantidad, @Proveedor, @USER");
  
    if (result.recordsets === 0)
    {
        return res.status(404).json({message: "Product not found"})
        
    }else {
        const infoProductos = result.recordsets[0];
        const infoEmpleado = result.recordsets[1][0];
        const infoProveedor = result.recordsets[2][0];
        const stream = res.writeHead(200, {
            "Content-Type" : "application/pdf",
            "Content-Disposition" : "attachment; filename=restock.pdf"
        });
        buildPDF((data) => {stream.write(data);}, () => {stream.end()},infoEmpleado,infoProductos,infoProveedor)
    //    return res.json(result.recordsets);
    }
    
    }
    catch(error)
    { 
        console.error("Error:", error.message);
        return res.status(404).json({message : error.message})
    }
  };