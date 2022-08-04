import mongoose from 'mongoose';
import MongoContainer from '../../contenedores/ContenedorMongoDb.js';

const chatSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    autor: { type: String, required: true },
    mensaje: { type: String, required: true }
});

const chatModel = mongoose.model('mensajes', chatSchema);
export default class ChatsMongoDBDao extends MongoContainer {

    constructor() {
        super(chatModel);
    }
    async desconectar() {
    }
}