import { Router } from "express";
import { editarPerfil } from "../controllers/perfil.controllers.js";

const router = Router();

router.put("/editarPerfil",editarPerfil)

export default router;