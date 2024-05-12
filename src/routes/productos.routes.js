import { Router } from "express";
import { getProduct, getProducts } from "../controllers/productos.controllers.js";

const router = Router();

router.get('/productos',getProducts);
router.get('/productos/:id',getProduct)


router.post('/productos',)

export default router;