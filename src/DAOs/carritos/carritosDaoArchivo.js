import FileContainer from "../../contenedores/ContenerdorArchivo.js";

export default class CartsFileDao extends FileContainer {

    constructor() {
        super("carritos");
    }
    async desconectar() {
    }
}