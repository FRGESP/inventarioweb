import { Router } from "express";
import { getReimpresionTicket } from "../controllers/tickets.controllers.js";

const router = Router();

router.get("/reimprimirTicket/:id",getReimpresionTicket)


export default router;