import FirebaseContainer from "../../contenedores/ContenedorFirebase.js";
import { dbFirebase } from "../../DB/firebase/firebase.js";

export default class ProductsFirebaseDao extends FirebaseContainer {
    constructor() {
        super(dbFirebase, "productos");
    }
}