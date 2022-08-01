import mongoose from 'mongoose';
const { Schema } = mongoose;


const products = [
    {
        id: 1,
        timestamp: "30/07/2022",
        nombre: "NBA 2k23",
        descripcion: "juego de baloncesto",
        codigo: "0089",
        foto: "https://image.api.playstation.com/vulcan/ap/rnd/202106/3002/Eaq9uyUlyLZK8L5xTlsPl0rM.png",
        precio: 5000,
        stock: 50
    }
];

const productSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    codigo: { type: String, required: true },
    foto: { type: String, required: true },
    precio: { type: Number, required: true },
    stock: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
});


const productsDAO = mongoose.model('productos', productSchema);