import express from 'express';
import cors from "cors";
import productosRutas from './routes/productos.routes.js';
import indexRutas from './routes/index.routes.js';
import sesionesRutas from './routes/sesiones.route.js'
import perfilRutas from './routes/perfil.route.js'
import session from 'express-session';
import path from 'path';


const app = express();

app.use(session({
    secret : 'password',
    saveUninitialized : false,
    resave : false,
    cookie : {
        maxAge : 60000 * 60
    }
}))

app.use(cors({
    origin : ["http://127.0.0.1:5500","http://127.0.0.1:5501","https://r0rnd8mr-3000.usw3.devtunnels.ms"]
}));
const __dirname = path.resolve();


app.use(express.json());

app.use(productosRutas);
app.use(indexRutas);
app.use(sesionesRutas);
app.use(perfilRutas);

app.use(express.static(path.join(__dirname, 'src', 'web')));

app.get('/', (req, res) => {
    console.log(req.session);
    console.log("El id "+req.session.id);
    req.session.visited = true;
    res.sendFile(path.join(__dirname, 'src','web', 'html', 'index.html'));
  });

app.get('/:page', (req, res) => {
    const page = req.params.page;
    res.sendFile(path.join(__dirname, 'src', 'web', 'html', `${page}.html`));
  });

export default app;