import { Router } from "express";
import { addEmpleado, deleteEmpleados, updateEmpleado } from "../controllers/empleados.controllers.js";

const router = Router();

router.put("/editarEmpleados/:id",updateEmpleado);

router.post("/agregarEmplado",addEmpleado);

router.delete("/deleteEmpleado/:id",deleteEmpleados)

export default router;