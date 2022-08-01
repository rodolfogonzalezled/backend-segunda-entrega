import * as fs from 'fs';

const fsPromises = fs.promises;

export default class FileContainer {
    constructor(fileName) {
        this.fileName = `./src/filesystem/${fileName}.json`;
    }

    async add(object) {
        let objects = await this.getAll();
        let newId = objects.length ? objects[objects.length - 1].id + 1 : 1;
        try {
            let objectAdded = { id: newId, timestamp: new Date(Date.now()).toLocaleString(), ...object };
            objects.push(objectAdded);
            await fsPromises.writeFile(this.fileName, JSON.stringify(objects, null, 2));
            return newId;
        } catch (error) {
            console.log(error);
        }
    }

    async getAll() {
        try {
            let objects = await fsPromises.readFile(this.fileName, 'utf8');
            if (objects) {
                return JSON.parse(objects);
            }
        } catch (error) {
            console.log(error)
        }
        return [];
    }

    async getById(id) {
        let objects = await this.getAll();
        let object = objects.find(element => element.id == id);
        return object;
    }

    async updateById(id, objectToUpdate) {
        let objects = await this.getAll();

        const objectIndex = objects.findIndex((e) => e.id == id);

        if (objectIndex === -1) return { error: "Elemento no encontrado" };

        objects[objectIndex] = { ...objects[objectIndex], ...objectToUpdate };

        try {
            await fsPromises.writeFile(this.fileName, JSON.stringify(objects, null, 2))
            return objects[objectIndex];
        } catch (error) {
            console.log(error);
        }
    }

    async deleteById(id) {
        let objects = await this.getAll();

        if (objects.find(element => element.id == id)) {
            objects = objects.filter(element => element.id != id);
            try {
                await fsPromises.writeFile(this.fileName, JSON.stringify(objects, null, 2))
            } catch (error) {
                console.log(error);
            }
        } else {
            return { error: "Elemento no encontrado" };
        }
    }
}