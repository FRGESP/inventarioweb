import express from 'express'
import cors from "cors";
import productosRutas from './routes/productos.routes.js'
import indexRutas from './routes/index.routes.js'

const app = express();


app.use(cors({
    origin : ["http://127.0.0.1:5500","http://127.0.0.1:5501"]
}));



app.use(express.json());
app.use(productosRutas);
app.use(indexRutas);

export default app;