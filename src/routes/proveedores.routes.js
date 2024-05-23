import { Router } from "express";
import { addProveedor, updateProveedor } from "../controllers/proveedores.controllers.js";

const router = Router();

router.put("/editarProveedores/:id",updateProveedor);

router.post("/agregarProveedor",addProveedor);

export default router;