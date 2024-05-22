import { Router } from "express";
import { addCategoria, updateCategoria } from "../controllers/categorias.controllers.js";

const router = Router();

router.put("/editarCategorias/:id", updateCategoria);

router.post("/agregarCategorias", addCategoria);


export default router;