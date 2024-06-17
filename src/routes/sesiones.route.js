import { Router } from "express";
import { auth, deleteTablas, enviarMensaje, logout, obtenerMensajes, obtenerMensajesInterval, obtenerUsuarios, perfil, setEmpleadoID, vistaTablas, vistaTablasElemento} from "../controllers/sesiones.controllers.js";

const router = Router();

router.get("/auth",auth);

router.get("/usuarios",obtenerUsuarios);

router.get("/mensajes/:dest",obtenerMensajes);

router.get("/mensajesInterval/:dest",obtenerMensajesInterval);

router.post("/enviarMensaje/:dest",enviarMensaje);

router.get("/datos",perfil);

router.get("/logout",logout);

router.get('/vistaTablas/:procedure',vistaTablas)

router.get("/vistaTablas/:procedure/:elemento",vistaTablasElemento)

router.delete("/deleteTablas/:procedure/:id",deleteTablas)

router.get("/setEmpleadoID/:tabla",setEmpleadoID)


export default router;