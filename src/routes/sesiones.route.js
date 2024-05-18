import { Router } from "express";
import { auth, deleteTablas, logout, perfil, vistaTablas, vistaTablasElemento} from "../controllers/sesiones.controllers.js";

const router = Router();

router.get("/auth",auth);

router.get("/datos",perfil);

router.get("/logout",logout);

router.get('/vistaTablas/:procedure',vistaTablas)

router.get("/vistaTablas/:procedure/:elemento",vistaTablasElemento)

router.delete("/deleteTablas/:procedure/:id",deleteTablas)


export default router;