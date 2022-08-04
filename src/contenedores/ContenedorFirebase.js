export default class FirebaseContainer {
    constructor(db, collectionName) {
        this.query = db.collection(collectionName);
    }

    async add(object) {
        try {
            const doc = this.query.doc();
            object.timestamp = new Date(Date.now()).toLocaleString();

            await doc.create(object);
            return doc.id;
        } catch (error) {
            console.log(error);
        }
    }

    async getAll() {
        try {
            const querySnapshot = await this.query.get();
            let docs = querySnapshot.docs;

            const elements = docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            return elements;
        } catch (error) {
            console.log(error);
        }
    }

    async getById(id) {
        try {
            const doc = this.query.doc(`${id}`);
            const element = await doc.get();
            return { id: element.id, ...element.data() };
        } catch (error) {
            console.log(error);
        }
    }

    async updateById(id, objectToUpdate) {
        try {
            const doc = this.query.doc(`${id}`);
            objectToUpdate.timestamp = new Date(Date.now()).toLocaleString();
            await doc.update(objectToUpdate);
            return this.getById(id);
        } catch (error) {
            console.log(error);
        }
    }

    async deleteById(id) {
        try {
            const doc = this.query.doc(`${id}`);
            await doc.delete();
        } catch (error) {
            console.log(error);
        }
    }
}