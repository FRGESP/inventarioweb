import { Router } from "express";
import { addSucursal, updateSucursal } from "../controllers/sucursales.controllers.js";

const router = Router();

router.put("/editarSucursal/:id",updateSucursal);

router.post("/agregarSucursal",addSucursal)

export default router;