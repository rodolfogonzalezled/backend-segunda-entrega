export default class MongoContainer {
    constructor(model) {
        this.model = model;
    }

    async add(object) {
        try {
            let elementCreated = await this.model.create(object);
            return elementCreated._id;
        } catch (error) {
            console.log(error);
        }
    }

    async getAll() {
        try {
            let elements = await this.model.find({});
            let result  = elements.map(x=> {return { id: x._id.toString(), ...x.toObject() }});

            return result;
        } catch (error) {
            console.log(error);
        }
    }

    async getById(id) {
        try {
            let element = await this.model.findOne({ _id: id }, { __v: 0 });
            return { id: element._id, ...element.toObject()};

        } catch (error) {
            console.log(error);
        }
    }

    async updateById(id, objectToUpdate) {
        try {
            return await this.model.updateOne({ _id: id }, { $set: objectToUpdate });
        } catch (error) {
            console.log(error);
        }
    }

    async deleteById(id) {
        try {
            return await this.model.deleteOne({ _id: id });
        } catch (error) {
            console.log(error);
        }
    }
}