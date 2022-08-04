import express from 'express';
import { createServer } from "http";
import { Server } from "socket.io";
import { isAdmin } from './src/middlewares/isAdmin.js';
import { carts, chat, products } from './src/DAOs/index.js';
import { config } from './src/Config/config.js';

const app = express()
const router = express.Router()
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use('/api', router);

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

app.use(express.static('public'))               // con http://localhost:9090/
// app.use('/static', express.static('public')) // con http://localhost:9090/static/

app.set("views", "./public/views");
app.set("view engine", "ejs");

// --- Conexión del Servidor ------------------------------------------------------------
const PORT = config.port;
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
});
connectedServer.on("error", error => console.log(`Error en servidor ${error}`));

// --------------------------------------------------------------------------------------

app.get("/", (req, res) => {
    res.render("pages/index");
});

app.get('/carrito', (req, res) => {
    res.render('pages/carrito')
});

// ----- WEBSOCKETS ----------------------------------------------------------------------
io.on("connection", async (socket) => {
    console.log(`Nuevo cliente conectado ${socket.id}`);
    socket.emit("productos", await products.getAll());
    socket.on('buscarProducto', async () => {
        socket.emit("productos", await products.getAll());
    });

    socket.emit("mensajes", await chat.getAll());
    socket.on('mensajeNuevo', async data => {
        chat.add(data);
        socket.emit("mensajes", await chat.getAll());
    });

    socket.on("borrarMensajes", async (autor) => {
        chat.deleteByAutor(autor);
        socket.emit("mensajes", await chat.getAll());
    });

    socket.on("borrarMensajesPorId", async (id) => {
        await chat.deleteById(id);
        socket.emit("mensajes", await chat.getAll());
    });

    socket.on('buscarCarrito', async (id) => {
        socket.emit("carritos", await carts.getById(id));
    });
});

// -----Api de Productos -----------------------------------------------------------

router.get('/productos/', async (req, res) => {
    res.json(await products.getAll());
});

router.get('/productos/:id?', isAdmin, async (req, res) => {
    let product = await products.getById(req.params.id);
    res.json(product ?? { error: "Producto no encontrado" }
    );
});

router.post('/productos', isAdmin, async (req, res) => {
    res.json({ id: await products.add(req.body) });
});

router.put('/productos/:id', isAdmin, async (req, res) => {
    let result = await products.updateById(req.params.id, req.body);
    result ? res.json(result) : res.sendStatus(200);
});

router.delete('/productos/:id', isAdmin, async (req, res) => {
    let result = await products.deleteById(req.params.id);
    result ? res.json(result) : res.sendStatus(200);
});

//------ Api de carritos -----------------------------------------------------------

router.post('/carrito', async (req, res) => {
    let product;
    if (req.body.id) {
        product = await products.getById(req.body.id);
    }
    let cart = await carts.add({ productos: [{ ...product, cantidad: 1 }] });
    res.json({ id: cart });
})

router.delete('/carrito/:id', async (req, res) => {
    let result = await carts.deleteById(req.params.id);
    result ? res.json(result) : res.sendStatus(200);
})

router.get('/carrito/:id/productos', async (req, res) => {
    let cart = await carts.getById(req.params.id);
    res.json(cart ? cart.productos : { error: "Carrito no encontrado" });
})

router.post('/carrito/:id/productos', async (req, res) => {
    let cart = await carts.getById(req.params.id);
    if (cart) {
        let product = await products.getById(req.body.id);
        if (product) {
            let productos = cart.productos ? cart.productos : [];

            let productIndex = productos.findIndex((e) => e.id.toString() == product.id);

            if (productIndex != -1) {
                productos[productIndex] = { ...productos[productIndex], cantidad: productos[productIndex].cantidad + 1 }
            } else {
                productos.push({ ...product, cantidad: 1 });
            }
            res.json(await carts.updateById(req.params.id, { productos: productos }));
        } else {
            res.json({ error: "Producto no encontrado" });
        }
    } else {
        res.json({ error: "Carrito no encontrado" });
    }
})

router.delete('/carrito/:id/productos/:id_prod', async (req, res) => {
    let cart = await carts.getById(req.params.id);
    if (cart) {
        let productos = cart.productos ? cart.productos : [];
        productos = productos.filter(producto => producto.id ? producto.id != req.params.id_prod : producto._id.toString() != req.params.id_prod.toString());
        await carts.updateById(req.params.id, { productos: productos });
        res.sendStatus(200);
    } else {
        res.json({ error: "Carrito no encontrado" });
    }
});