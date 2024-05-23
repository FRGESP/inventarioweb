import { Router } from "express";
import { addProducto,updateProducto } from "../controllers/productos.controllers.js";

const router = Router();

router.put("/editarProductos/:id",updateProducto);

router.post("/agregarProducto",addProducto);

export default router;