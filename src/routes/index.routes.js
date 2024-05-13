import { Router } from "express";
import { auth, login, nombreEmpleado } from "../controllers/index.controllers.js";

const router = Router();

router.post('/login',login);

router.get("/auth",auth)

router.get("/nombreUser",nombreEmpleado)

export default router;