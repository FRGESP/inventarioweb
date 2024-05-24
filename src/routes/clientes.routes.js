import { Router } from "express";
import { addCliente, updateCliente } from "../controllers/clientes.controllers.js";

const router = Router();

router.put("/editarCliente/:id", updateCliente);

router.post("/agregarCliente", addCliente);


export default router;