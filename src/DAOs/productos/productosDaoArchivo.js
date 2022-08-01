import FileContainer from "../../contenedores/ContenerdorArchivo.js";

export default class ProductsFileDao extends FileContainer {

    constructor() {
        super("productos");
    }
    async desconectar() {
    }
}