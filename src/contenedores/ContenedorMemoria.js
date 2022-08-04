export default class MemoryContainer {
    elements = [];

    add(object) {
        let objectAdded;
        if (this.elements.length) {
            let newId = this.elements[this.elements.length - 1].id + 1;
            objectAdded = { id: newId, ...object };
        } else {
            objectAdded = { id: 1, ...object };
        }
        this.elements.push(objectAdded);
        return objectAdded;
    }

    getById(id) {
        let element = this.elements.find(element => element.id == id);
        return element ?? { error: "Elemento no encontrado" };
    }

    getAll() {
        return this.elements;
    }

    updateById(id, object) {
        const objectIndex = this.elements.findIndex((e) => e.id == id);
        if (objectIndex === -1) return { error: "Elemento no encontrado" };
        this.elements[objectIndex] = { ...this.elements[objectIndex], ...object };
        return this.elements[objectIndex];
    }

    deleteById(id) {
        if (this.elements.find(element => element.id == id)) {
            this.elements = this.elements.filter(element => element.id != id);
        } else {
            return { error: "Elemento no encontrado" };
        }
    }
}
