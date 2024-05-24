import { Router } from "express";
import { obtenerNombreCliente } from "../controllers/ventas.controllers.js";

const router = Router();

router.get("/obtenerCliente/:id",obtenerNombreCliente)

export default router;