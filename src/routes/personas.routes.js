import { Router } from "express";
import { addPersona, updatePersona } from "../controllers/personas.controllers.js";

const router = Router();

router.put("/editarPersonas/:id",updatePersona);

router.post("/agregarPersona",addPersona)

export default router;