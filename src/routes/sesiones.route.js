import { Router } from "express";
import { auth, logout, nombreEmpleado, perfil, vistaTablas } from "../controllers/sesiones.controllers.js";

const router = Router();

router.get("/auth",auth);

router.get("/nombreUser",nombreEmpleado);

router.get("/datos",perfil);

router.get("/logout",logout);

router.get('/vistaTablas/:procedure',vistaTablas)

export default router;