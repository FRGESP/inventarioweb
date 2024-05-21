import { Router } from "express";
import { addDireccion, updateDireccion } from "../controllers/direcciones.controllers.js";

const router = Router();

router.put("/editarDirecciones/:id",updateDireccion);

router.post("/agregarDireccion",addDireccion);


export default router;