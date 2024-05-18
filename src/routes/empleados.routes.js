import { Router } from "express";
import { updateEmpleado } from "../controllers/empleados.controllers.js";

const router = Router();

router.put("/editarEmpleados/:id",updateEmpleado);

export default router;