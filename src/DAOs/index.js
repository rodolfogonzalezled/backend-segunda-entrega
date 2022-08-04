// ---------------------- MEMORY ---- --------------------------
import ProductsMemoryDao from './productos/productosDaoMem.js';
import CartsMemoryDao from './carritos/carritosDaoMem.js';      // Memory
import ChatsMemoryDao from './chat/chatsDaoMem.js';          // Memory

// ---------------------- FILE SYSTEM --------------------------
import ProductsFileDao from './productos/productosDaoArchivo.js'; // fileSystem
import CartsFileDao from './carritos/carritosDaoArchivo.js';      // fileSystem

// ---------------------- MARIADB Y SQLITE3 ---------------------
import { knexMariaDB } from '../Config/mariaDB.js';
import { knexSQLite } from '../Config/mySqlite3.js';
import ClientDB from '../clientDB.js';
import { createTableChat } from '../createTableChat.js';
import { createTableProducts } from '../createTableProducts.js';

// ---------------------- MONGODB ---------------------
import ProductsMongoDBDao from './productos/productosDaoMongoDb.js'; // MongoDB
import CartsMongoDBDao from './carritos/carritosDaoMongoDb.js';      // MongoDB
import ChatsMongoDBDao from './chat/chatsDaoMongoDb.js';              // MongoDB
import { connectMongo } from '../DB/mongoDB/mongoDb.js';

// ---------------------- FIREBASE ---------------------
import ProductsFirebaseDao from './productos/productosDaoFirebase.js'; //Firebase
import CartsFirebaseDao from './carritos/carritosDaoFirebase.js';      //Firebase
import ChatsFirebaseDao from './chat/chatsDaoFirebase.js';             //Firebase
import { config } from '../Config/config.js';
import ChatsFileDao from './chat/chatsDaoArchivo.js';

let products;
let carts;
let chat;

switch (config.useDB) {
    case 'mongodb':
        connectMongo();
        products = new ProductsMongoDBDao();  //MongoDB
        carts = new CartsMongoDBDao();        //MongoDB
        chat = new ChatsMongoDBDao();         //MongoDB
        break;
    case 'firebase':
        products = new ProductsFirebaseDao(); //Firebase
        carts = new CartsFirebaseDao();       //Firebase
        chat = new ChatsFirebaseDao();        //Firebase
        break;
    case 'memory':
        products = new ProductsMemoryDao();  //Memory
        carts = new CartsMemoryDao();        //Memory
        chat = new ChatsMemoryDao();         //Memory
        break;
    case 'mariadb':
        createTableProducts(knexMariaDB);
        createTableChat(knexMariaDB);
        products = new ClientDB(knexMariaDB, "productos");  //mariaDB
        chat = new ClientDB(knexMariaDB, "mensajes");       //mariaDB
        break;
    case 'sqlite3':
        createTableProducts(knexSQLite);
        createTableChat(knexSQLite);
        products = new ClientDB(knexSQLite, "productos");     // sqlite3
        chat = new ClientDB(knexSQLite, "mensajes");          // sqlite3
        break;
    default:
        products = new ProductsFileDao();  // fileSystem
        carts = new CartsFileDao();        // fileSystem
        chat = new ChatsFileDao();         // fileSystem
        break;
}

export { products, carts, chat };
