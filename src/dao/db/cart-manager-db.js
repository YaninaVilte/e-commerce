import CartModel from "../models/cart.model.js";

class CartManager {


    async createCart() {
        try {
            const newCart = new CartModel({products: []})
            await newCart.save();
            return newCart;
        } catch (error) {
            console.error("Error al crear un nuevo carrito:", error);
        }
    }


    async getCartByID(cartID) {
        try {
            const cart = await CartModel.findById(cartID);
            if (!cart) {
                throw new Error("No existe un carrito con ese ID");
            }
            return cart;
        } catch (error) {
            console.log("Error al obtener el carrito por ID");
            throw error;
        }
    }


    async addProductsToCart(cartID, productID, quantity = 1) {
        try {
            const cart = await this.getCartByID(cartID);
            const productExist = cart.products.find(p => p.product.toString() === productID);
            if (productExist) {
                productExist.quantity += quantity;
            } else {
                cart.products.push({ product: productID, quantity });
            }
            cart.markModified("products");
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al agregar productos al carrito:", error);
            throw error;
        }
    }

    // ir viedo desde aca

    async removeProductFromCart(cartID, productID) {
        try {
            const cart = await this.getCartByID(cartID);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }
            const productIndex = cart.products.findIndex(p => p.product.toString() === productID);
            if (productIndex === -1) {
                throw new Error("Producto no encontrado en el carrito");
            }
            cart.products.splice(productIndex, 1);
            return cart;
        } catch (error) {
            console.error("Error al eliminar el producto del carrito:", error);
            throw error;
        }
    }

    async updateProductQuantity(cartID, productID, newQuantity) {
        try {
            // Obtener el carrito por su ID
            const cart = await this.getCartByID(cartID);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

            // Buscar el producto dentro del carrito
            const productIndex = cart.products.findIndex(p => p.product.toString() === productID);
            if (productIndex === -1) {
                throw new Error("Producto no encontrado en el carrito");
            }

            // Actualizar la cantidad del producto
            cart.products[productIndex].quantity = newQuantity;

            // Guardar el carrito actualizado
            await cart.save();

            return cart;
        } catch (error) {
            console.error("Error al actualizar la cantidad del producto en el carrito:", error);
            throw error;
        }
    }
}

export default CartManager; 