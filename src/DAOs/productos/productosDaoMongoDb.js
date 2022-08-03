import mongoose from 'mongoose';
import MongoContainer from '../../contenedores/ContenedorMongoDb.js';

const productSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    codigo: { type: String, required: true },
    foto: { type: String, required: true },
    precio: { type: Number, required: true },
    stock: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

const productsModel = mongoose.model('productos', productSchema);
export default class ProductsMongoDBDao extends MongoContainer {

    constructor() {
        super(productsModel);
    }
    async desconectar() {
    }
}