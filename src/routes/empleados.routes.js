import { Router } from "express";
import { addEmpleado, updateEmpleado } from "../controllers/empleados.controllers.js";

const router = Router();

router.put("/editarEmpleados/:id",updateEmpleado);

router.post("/agregarEmplado",addEmpleado)

export default router;