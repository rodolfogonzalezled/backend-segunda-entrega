import FirebaseContainer from "../../contenedores/ContenedorFirebase.js";
import { dbFirebase } from "../../DB/firebase/firebase.js";

export default class ChatsFirebaseDao extends FirebaseContainer {

    constructor() {
        super(dbFirebase, "mensajes");
    }
}