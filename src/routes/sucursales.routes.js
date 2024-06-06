import { Router } from "express";
import { addSucursal, deleteSucursal, updateSucursal } from "../controllers/sucursales.controllers.js";

const router = Router();

router.put("/editarSucursal/:id",updateSucursal);

router.post("/agregarSucursal",addSucursal);

router.delete("/deleteSucursal/:id",deleteSucursal)


export default router;