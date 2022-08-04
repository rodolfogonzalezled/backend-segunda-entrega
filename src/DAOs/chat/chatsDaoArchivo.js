import FileContainer from "../../contenedores/ContenerdorArchivo.js";

export default class ChatsFileDao extends FileContainer {

    constructor() {
        super("mensajes");
    }
    async desconectar() {
    }
}