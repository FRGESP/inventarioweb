import { Router } from "express";
import { printRestock, restock, vistaRestock } from "../controllers/restock.controllers.js";

const router = Router();

router.get("/obtenerRestock/:cantidad/:proveedor",vistaRestock)

router.put("/restock/:id",restock);

router.get("/imprimirRestock/:cantidad/:proveedor",printRestock)



export default router;