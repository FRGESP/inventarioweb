import { Router } from "express";
import { getAccion } from "../controllers/registro.controllers.js";

const router = Router();

router.get("/getByAccion/:procedure/:elemento",getAccion)


export default router;