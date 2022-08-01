import * as fs from 'fs';

const fsPromises = fs.promises;

export default class CartFileContainer {
    constructor(name) {
        this.name = `./src/filesystem/${name}.json`;
    }

    async add(cart) {
        let carts = await this.getAll();
        let newId = carts.length ? carts[carts.length - 1].id + 1 : 1;
        try {
            let cartAdded = { id: newId, timestamp: new Date(Date.now()).toLocaleString(), productos: [] };
            if (cart.producto) {
                cartAdded.productos = [{ ...cart.producto, cantidad: 1 }]
            }
            carts.push(cartAdded);
            await fsPromises.writeFile(this.name, JSON.stringify(carts, null, 2));
            return newId;
        } catch (error) {
            console.log(error);
        }
    }

    async deleteById(id) {
        let carts = await this.getAll();

        if (carts.find(cart => cart.id == id)) {
            carts = carts.filter(cart => cart.id != id);
            try {
                await fsPromises.writeFile(this.name, JSON.stringify(carts, null, 2))
            } catch (error) {
                console.log(error);
            }
        } else {
            return { error: "Carrito no encontrado" };
        }
    }

    async getCartProducts(id) {
        let carts = await this.getAll();
        let cart = carts.find(cart => cart.id == id);
        return cart ? cart.productos : { error: "Carrito no encontrado" };
    }

    async addProduct(id, product) {
        let carts = await this.getAll();
        let cartUpdate;

        if (carts.find(cart => cart.id == id)) {
            carts.map(cart => {
                if (cart.id == id) {
                    let producto = cart.productos.find(prod => prod.id == product.id);
                    if (producto) {
                        cart.productos.map(product => {
                            if (product.id == producto.id) {
                                product.cantidad = producto.cantidad + 1;
                            }
                        });
                    } else {
                        cart.productos.push({ cantidad: 1, ...product });
                    }
                    cartUpdate = cart;
                }
            })
            try {
                await fsPromises.writeFile(this.name, JSON.stringify(carts, null, 2))
                return cartUpdate;
            } catch (error) {
                console.log(error);
            }
        } else {
            return { error: "Carrrito no encontrado" };
        }
    }

    async deleteProductById(id, idProduct) {
        let carts = await this.getAll();

        if (carts.find(cart => cart.id == id)) {
            carts.map(cart => {
                if (cart.id == id) {
                    cart.productos = cart.productos.filter(product => product.id != idProduct);
                }
            });
            try {
                await fsPromises.writeFile(this.name, JSON.stringify(carts, null, 2))
            } catch (error) {
                console.log(error);
            }
        } else {
            return { error: "Carrito no encontrado" };
        }
    }

    async getAll() {
        try {
            let carts = await fsPromises.readFile(this.name, 'utf8');
            if (carts) {
                return JSON.parse(carts);
            }
        } catch (error) {
            console.log(error)
        }
        return [];
    }
}