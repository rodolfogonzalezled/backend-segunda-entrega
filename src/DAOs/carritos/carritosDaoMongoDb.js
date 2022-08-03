import mongoose from 'mongoose';
import MongoContainer from '../../contenedores/ContenedorMongoDb.js';

const cartSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    productos: { type: Array, default: [] }
});

const cartsModel = mongoose.model('carritos', cartSchema);
export default class CartsMongoDBDao extends MongoContainer {

    constructor() {
        super(cartsModel);
    }
    async desconectar() {
    }
}