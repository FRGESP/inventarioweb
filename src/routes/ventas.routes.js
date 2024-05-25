import { Router } from "express";
import { getTicket, getTotal, obtenerNombreCliente, subbirProductoVenta, subbirVenta } from "../controllers/ventas.controllers.js";

const router = Router();

router.get("/obtenerCliente/:id",obtenerNombreCliente)

router.get("/obtenerTotal",getTotal)

router.post("/subirProductoVenta",subbirProductoVenta);

router.post("/subirVenta",subbirVenta);

router.get("/imprimirTicket",getTicket)


export default router;