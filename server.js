import express from 'express';
import { createServer } from "http";
import { Server } from "socket.io";
import { isAdmin } from './src/middlewares/isAdmin.js';

//---------------------- MEMORY ---- --------------------------
// import ProductsMemoryDao from './src/DAOs/productos/productosDaoMem.js'; // Memory
// import CartsMemoryDao from './src/DAOs/carritos/carritosDaoMem.js';      // Memory
// import ChatsMemoryDao from './src/DAOs/chat/carritosDaoMem.js';          // Memory

//---------------------- FILE SYSTEM --------------------------
// import ProductsFileDao from './src/DAOs/productos/productosDaoArchivo.js'; // fileSystem
// import CartsFileDao from './src/DAOs/carritos/carritosDaoArchivo.js';      // fileSystem

//---------------------- MARIADB Y SQLITE3 ---------------------
// import { knexMariaDB } from './src/Config/mariaDB.js';
// import { knexSQLite } from './src/Config/mySqlite3.js';
// import ClientDB from './src/clientDB.js';
// import { createTableProducts } from './src/createTableProducts.js';
// import { createTableChat } from './src/createTableChat.js';

//---------------------- MONGODB ---------------------
import mongoose from "mongoose";
import ProductsMongoDBDao from './src/DAOs/productos/productosDaoMongoDb.js'; // MongoDB
import CartsMongoDBDao from './src/DAOs/carritos/carritosDaoMongoDb.js';      // MongoDB
import ChatsMongoDBDao from './src/DAOs/chat/chatDaoMongoDb.js';              // MongoDB

const URL = "mongodb://localhost:27017/ecommerce";
let rta = await mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
console.log("DB Connected");

// const NAME_TABLE_PRODUCTS = 'productos';
// const NAME_TABLE_CHAT = 'mensajes';
// createTableProducts(knexMariaDB, NAME_TABLE_PRODUCTS);
// createTableChat(knexSQLite, NAME_TABLE_CHAT);

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
const PORT = 9090;
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
});
connectedServer.on("error", error => console.log(`Error en servidor ${error}`));

// --------------------------------------------------------------------------------------
// const products = new ProductsMemoryDao();  //Memory
// const carts = new CartsMemoryDao();        //Memory
// const chat = new ChatsMemoryDao();         //Memory

// const products = new ProductsFileDao();  // fileSystem
// const carts = new CartsFileDao();        // fileSystem

// const products = new ClientDB(knexMariaDB, NAME_TABLE_PRODUCTS); //mariaDB
// const chat = new ClientDB(knexSQLite, NAME_TABLE_CHAT);          // sqlite3

const products = new ProductsMongoDBDao();  //MongoDB
const carts = new CartsMongoDBDao();        //MongoDB
const chat = new ChatsMongoDBDao();         //MongoDB
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
    let productos = req.body ?? { productos: [{ ...req.body }] };
    res.json({ id: await carts.add(productos) });
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
            let productIndex;
            if(productos.id) {
                productIndex = productos.findIndex((e) => e.id == product.id);
            } else {
                productIndex = productos.findIndex((e) => e._id.toString() == product._id);
            }
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