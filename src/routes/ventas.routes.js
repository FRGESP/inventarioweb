import { Router } from "express";
import { getClienteActual, getTicket, getTotal, getvistaTicket, obtenerNombreCliente, subbirProductoVenta, subbirVenta } from "../controllers/ventas.controllers.js";

const router = Router();

router.get("/obtenerCliente/:id",obtenerNombreCliente)

router.get("/obtenerTotal",getTotal)

router.post("/subirProductoVenta/",subbirProductoVenta);

router.get("/subirVenta",subbirVenta);

router.get("/imprimirTicket",getTicket)

router.get("/obtenerTicketVista",getvistaTicket)

router.get("/obtenerClienteActual",getClienteActual)




export default router;